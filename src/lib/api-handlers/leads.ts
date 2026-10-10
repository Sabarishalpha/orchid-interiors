import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clientAddress, isRateLimited, jsonLimit } from "@/lib/security";
import { verifyFirebasePhoneToken } from "@/lib/firebase-phone-verification";
import {
  appendWebsiteLead,
  GoogleSheetsAccessError,
  GoogleSheetsAuthenticationError,
  GoogleSheetsConfigurationError,
  GoogleSheetsWorksheetError,
} from "@/lib/leads-sheet";

const leadSchema = z.object({
  source: z.string().trim().max(80).default("website"),
  name: z.string().trim().min(2, "Name is required."),
  phone: z.string().trim().min(7, "Phone number is required."),
  phoneVerificationToken: z.string().min(1).max(5000),
  email: z.string().trim().max(255).optional().default(""),
  projectType: z.string().trim().max(120).optional().default(""),
  services: z.array(z.string().trim().max(80)).optional().default([]),
  location: z.string().trim().max(200).optional().default(""),
  area: z.string().trim().max(200).optional().default(""),
  budget: z.string().trim().max(100).optional().default(""),
  timeline: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().max(3000).optional().default(""),
  requirement: z.string().trim().max(200).optional().default(""),
  possession: z.string().trim().max(100).optional().default(""),
  consent: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    if (
      jsonLimit(request, 64 * 1024) ||
      isRateLimited(`lead:${clientAddress(request)}`, 10, 60 * 1000)
    ) {
      return NextResponse.json(
        {
          error: "Too many enquiries sent from this device. Please try again shortly.",
        },
        { status: 429 },
      );
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Invalid enquiry details.",
        },
        { status: 400 },
      );
    }

    const lead = parsed.data;
    const phoneDigits = lead.phone.replace(/\D/g, "");
    const normalizedPhone =
      phoneDigits.length === 12 && phoneDigits.startsWith("91")
        ? `+${phoneDigits}`
        : `+91${phoneDigits}`;
    if (!/^\+91[6-9]\d{9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit Indian mobile number." },
        { status: 400 },
      );
    }

    let verifiedPhone: string | null;
    try {
      verifiedPhone = await verifyFirebasePhoneToken(
        lead.phoneVerificationToken,
      );
    } catch (error) {
      console.error(
        "Could not verify enquiry phone token:",
        error instanceof Error ? error.message : "Unknown error",
      );
      return NextResponse.json(
        { error: "Phone verification is temporarily unavailable." },
        { status: 503 },
      );
    }
    if (!verifiedPhone) {
      return NextResponse.json(
        { error: "Phone verification expired. Verify your number again." },
        { status: 401 },
      );
    }
    if (verifiedPhone !== normalizedPhone) {
      return NextResponse.json(
        { error: "The verified phone number does not match this request." },
        { status: 401 },
      );
    }

    try {
      await appendWebsiteLead({
        source: lead.source,
        name: lead.name,
        phone: normalizedPhone,
        email: lead.email,
        projectType: lead.projectType,
        services: lead.services,
        location: lead.location,
        area: lead.area,
        budget: lead.budget,
        timeline: lead.timeline,
        message: lead.message,
        requirement: lead.requirement,
        possession: lead.possession,
      });
    } catch (error) {
      console.error(
        "Could not add verified enquiry to Google Sheets:",
        error instanceof Error ? error.message : "Unknown error",
      );
      return NextResponse.json(
        {
          error:
            error instanceof GoogleSheetsConfigurationError
              ? "Enquiry saving is not configured. The site owner must set GOOGLE_SHEETS_SPREADSHEET_ID and the Google Sheets service-account credentials."
              : error instanceof GoogleSheetsAuthenticationError
                ? "The Google Sheets service-account email and private key do not match, or the key has been revoked. Set both Sheets credentials from the same active service-account JSON key."
                : error instanceof GoogleSheetsAccessError
                  ? "The Google Sheets service account cannot access this spreadsheet. Share the Leads spreadsheet with that account as an Editor."
                  : error instanceof GoogleSheetsWorksheetError
                    ? "The Google spreadsheet needs a worksheet tab named Leads."
                    : "Your enquiry could not be saved to Google Sheets. Check that the Sheets API is enabled and the service account has Editor access to the Leads spreadsheet.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your verified enquiry was saved successfully.",
    });
  } catch (error) {
    console.error("Lead submission failed:", error);

    return NextResponse.json(
      {
        error: "The enquiry service is temporarily unavailable. Please try again later.",
      },
      { status: 500 },
    );
  }
}
