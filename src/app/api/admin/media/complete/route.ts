import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import { finalizeMediaUpload } from "@/lib/content-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = authorizeAdminRequest(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid upload completion request." }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("path" in body) ||
    typeof body.path !== "string" ||
    !("contentType" in body) ||
    typeof body.contentType !== "string"
  ) {
    return NextResponse.json({ error: "Upload path and media type are required." }, { status: 400 });
  }

  try {
    const url = await finalizeMediaUpload(body.path, body.contentType);
    return NextResponse.json({ url });
  } catch (error) {
    console.error(
      "Could not finalize media upload:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json({ error: "The uploaded file could not be verified." }, { status: 400 });
  }
}
