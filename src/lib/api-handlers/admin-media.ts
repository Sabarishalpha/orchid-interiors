import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import { createMediaUpload } from "@/lib/content-store";
import { clientAddress, isRateLimited, jsonLimit } from "@/lib/security";

export const runtime = "nodejs";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(request: NextRequest) {
  const denied = authorizeAdminRequest(request);
  if (denied) return denied;
  if (
    jsonLimit(request, 8 * 1024) ||
    isRateLimited(`admin-media:${clientAddress(request)}`, 30, 60 * 60 * 1000)
  ) {
    return NextResponse.json({ error: "Too many upload requests. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("name" in body) ||
    typeof body.name !== "string" ||
    !("contentType" in body) ||
    typeof body.contentType !== "string" ||
    !("size" in body) ||
    typeof body.size !== "number" ||
    body.size <= 0 ||
    body.size > 50 * 1024 * 1024 ||
    !allowedTypes.has(body.contentType)
  ) {
    return NextResponse.json(
      { error: "Choose an image or video up to 50 MB." },
      { status: 400 },
    );
  }

  try {
    const upload = await createMediaUpload(body.name, body.contentType);
    return NextResponse.json(upload);
  } catch (error) {
    console.error(
      "Could not create media upload:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json({ error: "Could not start the upload." }, { status: 503 });
  }
}
