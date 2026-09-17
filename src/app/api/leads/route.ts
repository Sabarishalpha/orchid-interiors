import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clientAddress, isRateLimited, jsonLimit } from "../../../lib/security";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(40),
  email: z.string().trim().email().max(254).optional(),
  location: z.string().trim().min(2).max(160),
  propertyType: z.string().trim().min(1).max(80),
  interiorRequirement: z.string().trim().min(1).max(500),
  propertySize: z.string().trim().min(1).max(80),
  budget: z.string().trim().min(1).max(80),
  timeline: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(4000),
});

export async function POST(request: NextRequest) {
  try {
    if (jsonLimit(request, 32 * 1024) || isRateLimited(`lead:${clientAddress(request)}`, 8, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many enquiries. Please try again later." }, { status: 429 });
    }

    const lead = leadSchema.parse(await request.json());
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("LEAD_WEBHOOK_URL is missing");
      return NextResponse.json({ error: "Lead delivery is not configured." }, { status: 503 });
    }

    const delivery = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `New Orchid Interiors enquiry from ${lead.name}`,
        source: "Orchid AI",
        receivedAt: new Date().toISOString(),
        ...lead,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!delivery.ok) {
      return NextResponse.json({ error: "Lead delivery failed." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Please provide all lead details." }, { status: 400 });
  }
}