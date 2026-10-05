import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { clientAddress, isRateLimited, jsonLimit } from "../../../lib/security";

const FIXED_RECIPIENT_EMAIL = "sabarish.2023@gmail.com";

const leadSchema = z.object({
  source: z.string().trim().max(80).default("website"),
  name: z.string().trim().min(2, "Name is required."),
  phone: z.string().trim().min(7, "Phone number is required."),
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

function getResendErrorMessage(fromAddress: string, error: unknown): string {
  const message =
    typeof error === "object" && error && "message" in error
      ? String((error as { message?: string }).message ?? "")
      : "";

  const lowerMessage = message.toLowerCase();
  const senderIssue =
    lowerMessage.includes("verified") ||
    lowerMessage.includes("domain") ||
    lowerMessage.includes("from") ||
    lowerMessage.includes("invalid") ||
    lowerMessage.includes("forbidden") ||
    lowerMessage.includes("unauthorized");

  if (senderIssue || /resend\.app|@gmail\.com/i.test(fromAddress)) {
    return "The sender email is not verified in Resend. Please use a verified domain such as noreply@orchidinteriors.com, not Gmail or a Resend sandbox address, then try again.";
  }

  return "The enquiry could not be sent. Please try again in a moment.";
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
    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromAddress) {
      console.error("Missing Resend configuration. Set RESEND_API_KEY and RESEND_FROM_EMAIL.");
      return NextResponse.json(
        {
          error:
            "The enquiry service is not configured yet. Please add the Resend API key and verified sender email.",
        },
        { status: 503 },
      );
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
    const result = await resend.emails.send({
      from: fromAddress,
      to: [FIXED_RECIPIENT_EMAIL],
      replyTo: emailAddress !== "Not provided" ? emailAddress : undefined,
      subject,
      html,
    });

    if (result.error) {
      console.error("Resend send failed:", result.error);
      return NextResponse.json(
        {
          error: getResendErrorMessage(fromAddress, result.error),
        },
        { status: 502 },
      );
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
