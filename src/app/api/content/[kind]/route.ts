import { NextRequest, NextResponse } from "next/server";
import { isContentKind } from "@/lib/content-schema";
import { getContentItems } from "@/lib/content-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params;
  if (!isContentKind(kind)) {
    return NextResponse.json({ error: "Content type not found." }, { status: 404 });
  }

  try {
    return NextResponse.json({ items: await getContentItems(kind) });
  } catch (error) {
    console.error(
      "Could not load public content:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { error: "Website content is temporarily unavailable." },
      { status: 503 },
    );
  }
}
