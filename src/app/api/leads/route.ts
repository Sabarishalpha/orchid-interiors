import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(7),
  email: z.string().trim().email().optional(),
  location: z.string().trim().min(2),
  propertyType: z.string().trim().min(1),
  interiorRequirement: z.string().trim().min(1),
  propertySize: z.string().trim().min(1),
  budget: z.string().trim().min(1),
  timeline: z.string().trim().min(1),
  message: z.string().trim().min(1),
});

export async function POST(request: NextRequest) {
  try {
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
    });

    if (!delivery.ok) {
      return NextResponse.json({ error: "Lead delivery failed." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Please provide all lead details." }, { status: 400 });
  }
}