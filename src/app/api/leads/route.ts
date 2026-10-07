import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { clientAddress, isRateLimited, jsonLimit } from "../../../lib/security";
import { getFirebaseAuth } from "../../../lib/firebase-admin";
import { appendWebsiteLead } from "../../../lib/leads-sheet";

const FIXED_RECIPIENT_EMAIL = "sabarish.2023@gmail.com";

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

function formatLeadField(label: string, value: string) {
  if (!value || value === "Not provided") return "";
  return `<p><strong>${label}:</strong> ${value}</p>`;
}

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

    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromAddress) {
      console.warn(
        "Verified enquiry was saved to Google Sheets, but its Resend email notification is not configured.",
      );
      return NextResponse.json({
        success: true,
        message:
          "Your verified request was saved for our team. Email notifications are not configured.",
      });
    }

    const emailAddress = lead.email || "Not provided";
    const projectType = lead.projectType || lead.requirement || "General enquiry";
    const location = lead.location || "Not provided";
    const servicesText = lead.services.length ? lead.services.join(", ") : "Not provided";
    const projectMessage =
      lead.message ||
      [
        lead.requirement ? `Requirement: ${lead.requirement}` : "",
        lead.possession ? `Possession: ${lead.possession}` : "",
      ]
        .filter(Boolean)
        .join(" | ") ||
      "No extra project notes were provided.";

    const subject = `New enquiry from ${lead.name} – ${projectType}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 12px;">New Orchid Interiors enquiry</h2>
        ${formatLeadField("Source", lead.source)}
        ${formatLeadField("Name", lead.name)}
        ${formatLeadField("Phone", lead.phone)}
        ${formatLeadField("Email", emailAddress)}
        ${formatLeadField("Project type", projectType)}
        ${formatLeadField("Service interest", servicesText)}
        ${formatLeadField("Location", location)}
        ${formatLeadField("Area", lead.area || "Not provided")}
        ${formatLeadField("Budget", lead.budget || "Not provided")}
        ${formatLeadField("Timeline", lead.timeline || "Not provided")}
        ${formatLeadField("Possession", lead.possession || "Not provided")}
        <p><strong>Project details:</strong></p>
        <p>${projectMessage.replace(/\n/g, "<br />")}</p>
      </div>
    `;

    const resend = new Resend(apiKey);
    let result;
    try {
      result = await resend.emails.send({
        from: fromAddress,
        to: [FIXED_RECIPIENT_EMAIL],
        replyTo: emailAddress !== "Not provided" ? emailAddress : undefined,
        subject,
        html,
      });
    } catch (error) {
      console.error("Resend notification failed after the lead was saved:", error);
      return NextResponse.json({
        success: true,
        message:
          "Your verified request was saved for our team, but its email notification could not be sent.",
      });
    }

    if (result.error) {
      console.error("Resend send failed:", result.error);
      return NextResponse.json({
        success: true,
        message:
          "Your verified request was saved for our team, but its email notification could not be sent.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry sent successfully.",
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
