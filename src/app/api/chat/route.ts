import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { BUSINESS_INFO } from "../../data/business";

const SYSTEM_INSTRUCTION = `
You are Orchid AI, the virtual interior design assistant for ${BUSINESS_INFO.companyName}.

You help website visitors with:
- Home interior design
- Residential interiors
- Commercial interiors
- Modern interiors
- Luxury interiors
- Project enquiries
- Design consultations
- Modular kitchens, wardrobes, bedrooms, living rooms, dining rooms, TV units
- Office interiors, custom furniture, site visits, quotations and contact details

Your job is to answer questions clearly and professionally.

If someone is interested in starting a project, guide them to the enquiry form and help collect:
- Name
- Phone number
- Email
- Location
- Property type, interior requirement and approximate property size
- Approximate budget, preferred timeline and additional requirements

Important rules:
- Be friendly and professional.
- Keep responses very simple and concise: 1 to 3 short sentences.
- Ask for only one missing detail at a time. Do not send a long checklist.
- Use plain text only. Do not use Markdown, asterisks, numbered lists, headings, or long paragraphs.
- Do not invent prices.
- Do not invent company information.
- Approved contact email: ${BUSINESS_INFO.emailAddress}
- Approved office: ${BUSINESS_INFO.officeAddress}
- Approved service areas: ${BUSINESS_INFO.serviceAreas.join(", ")}
- Portfolio: ${BUSINESS_INFO.portfolioUrl}; booking and quote: ${BUSINESS_INFO.bookingUrl}
- Phone and WhatsApp are not configured; never create or guess numbers.
- Never claim an unlisted location is served. Ask the visitor to share it for team confirmation.
- If you don't know something, say that the Orchid Interiors design team can provide the exact information.
- Encourage users to request a consultation when appropriate.
- If the request is unclear, explain that you can help with kitchens, wardrobes, home interiors, pricing, consultations, site visits and quotations.
`;

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
          console.error("GEMINI_API_KEY is missing");

      return NextResponse.json(
        {
              error: "The chat service is temporarily unavailable.",
        },
            {
              status: 503,
        }
      );
    }

    const body = await request.json();

    const message = body?.message;
    const history = Array.isArray(body?.history)
      ? body.history
      : [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    /*
     * Convert previous messages into Gemini format.
     */
    const contents = [
      ...history
        .filter(
          (item: {
            role?: string;
            content?: string;
          }) =>
            typeof item?.content === "string" &&
            (item.role === "user" ||
              item.role === "assistant")
        )
        .map(
          (item: {
            role: string;
            content: string;
          }) => ({
            role:
              item.role === "assistant"
                ? "model"
                : "user",
            parts: [
              {
                text: item.content,
              },
            ],
          })
        ),

      {
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    console.log("🤖 Sending request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    const reply = response.text?.trim();

    console.log("✅ Gemini response received");

    if (!reply) {
      return NextResponse.json(
        {
          error: "Gemini returned an empty response.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      reply,
    });
  } catch (error: unknown) {
    console.error("❌ GEMINI ERROR:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown Gemini API error";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}