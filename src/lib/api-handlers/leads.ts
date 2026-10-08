import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clientAddress, isRateLimited, jsonLimit } from "@/lib/security";
import { getFirebaseAuth } from "@/lib/firebase-admin";
import { appendWebsiteLead } from "@/lib/leads-sheet";

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

    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      console.error("Firebase Phone Authentication is not configured.");
      return NextResponse.json(
        { error: "Phone verification is temporarily unavailable." },
        { status: 503 },
      );
    }

    try {
      const decodedToken = await firebaseAuth.verifyIdToken(
        lead.phoneVerificationToken,
      );
      if (decodedToken.phone_number !== normalizedPhone) {
        return NextResponse.json(
          { error: "The verified phone number does not match this request." },
          { status: 401 },
        );
      }
    } catch (error) {
      console.warn(
        "Enquiry phone verification failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
      return NextResponse.json(
        { error: "Phone verification expired. Verify your number again." },
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
        { error: "Your request could not be saved. Please try again later." },
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
