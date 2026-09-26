import path from "node:path";

import { del } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { isAdmin } from "../../../../lib/admin-auth";
import { hasValidMediaSignature } from "../../../../lib/upload-validation";

const maxFileSize = 1024 * 1024 * 1024;
const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
};

function validUploadPath(pathname: string, clientPayload: string | null) {
  const parts = pathname.split("/");
  if (parts.length !== 4 || parts[0] !== "uploads") return false;
  if (!(parts[1] === "projects" || parts[1] === "services" || parts[1] === "designLibrary")) return false;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parts[2])) return false;
  if (!/^[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif|mp4|mov)$/i.test(parts[3])) return false;

  try {
    const payload = JSON.parse(clientPayload ?? "") as { kind?: string; slug?: string };
    return payload.kind === parts[1] && payload.slug === parts[2];
  } catch {
    return false;
  }
}

async function validateBlob(url: string, extension: string) {
  const response = await fetch(url, {
    headers: { Range: "bytes=0-15" },
    cache: "no-store",
  });
  if (!response.ok || !response.body) return false;

  const reader = response.body.getReader();
  const { value } = await reader.read();
  await reader.cancel();
  return hasValidMediaSignature(extension, Buffer.from(value ?? []));
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    clientUploadsEnabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    directUploadsRequired: Boolean(process.env.VERCEL),
  });
}

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Vercel Blob uploads are not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!(await isAdmin()) || !validUploadPath(pathname, clientPayload)) {
          throw new Error("Invalid or unauthorized upload.");
        }
        const extension = path.extname(pathname).toLowerCase();
        return {
          allowedContentTypes: [contentTypes[extension]],
          maximumSizeInBytes: maxFileSize,
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        const extension = path.extname(blob.pathname).toLowerCase();
        if (!await validateBlob(blob.url, extension)) {
          await del(blob.url);
          throw new Error("The uploaded file does not match its image or video type.");
        }
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to authorize upload." },
      { status: 400 },
    );
  }
}