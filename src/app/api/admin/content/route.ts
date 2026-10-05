import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import {
  contentKinds,
  getContentSchema,
  isContentKind,
} from "@/lib/content-schema";
import {
  collectMediaUrls,
  createContentItem,
  deleteContentItem,
  deleteUnreferencedMedia,
  getContentItems,
  updateContentItem,
} from "@/lib/content-store";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { clientAddress, isRateLimited, jsonLimit } from "@/lib/security";

export const runtime = "nodejs";

function readKind(value: unknown) {
  return typeof value === "string" && isContentKind(value) ? value : null;
}

function handleStoreError(error: unknown) {
  const message = error instanceof Error ? error.message : "Content could not be saved.";
  if (/already exists|no longer exists/i.test(message)) {
    return NextResponse.json({ error: message }, { status: 409 });
  }
  console.error("Admin content operation failed:", message);
  return NextResponse.json(
    { error: "The content operation failed. Please try again." },
    { status: 500 },
  );
}

function revalidateContent(kind: (typeof contentKinds)[number], oldSlug?: string, slug?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (kind === "services") revalidatePath("/services");
  if (kind === "projects") revalidatePath("/projects");
  if (kind === "design-library") revalidatePath("/design-library");
  if (oldSlug) {
    revalidatePath(`/${kind}/${oldSlug}`);
    if (kind === "design-library") revalidatePath(`/design-library/${oldSlug}`);
  }
  if (slug) {
    revalidatePath(`/${kind}/${slug}`);
    if (kind === "design-library") revalidatePath(`/design-library/${slug}`);
  }
}

export async function GET(request: NextRequest) {
  const denied = authorizeAdminRequest(request);
  if (denied) return denied;
  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { error: "Configure Firebase credentials before managing website content." },
      { status: 503 },
    );
  }

  try {
    const results = await Promise.all(
      contentKinds.map(async (kind) => [kind, await getContentItems(kind, true)] as const),
    );
    return NextResponse.json(Object.fromEntries(results));
  } catch (error) {
    return handleStoreError(error);
  }
}

export async function POST(request: NextRequest) {
  const denied = authorizeAdminRequest(request);
  if (denied) return denied;
  if (
    jsonLimit(request, 64 * 1024) ||
    isRateLimited(`admin-content:${clientAddress(request)}`, 60, 60 * 1000)
  ) {
    return NextResponse.json({ error: "Too many content changes. Try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid content request." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !("kind" in body) || !("item" in body)) {
    return NextResponse.json({ error: "Content type and item are required." }, { status: 400 });
  }
  const kind = readKind(body.kind);
  if (!kind) return NextResponse.json({ error: "Unsupported content type." }, { status: 400 });
  const parsed = getContentSchema(kind).safeParse(body.item);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid content." }, { status: 400 });
  }

  try {
    const item = await createContentItem(kind, parsed.data);
    revalidateContent(kind, undefined, item.slug);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return handleStoreError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const denied = authorizeAdminRequest(request);
  if (denied) return denied;
  if (
    jsonLimit(request, 64 * 1024) ||
    isRateLimited(`admin-content:${clientAddress(request)}`, 60, 60 * 1000)
  ) {
    return NextResponse.json({ error: "Too many content changes. Try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid content request." }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("kind" in body) ||
    !("oldSlug" in body) ||
    typeof body.oldSlug !== "string" ||
    !("item" in body)
  ) {
    return NextResponse.json({ error: "Content type, current slug, and item are required." }, { status: 400 });
  }

  const kind = readKind(body.kind);
  if (!kind) return NextResponse.json({ error: "Unsupported content type." }, { status: 400 });
  const parsed = getContentSchema(kind).safeParse(body.item);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid content." }, { status: 400 });
  }

  try {
    const existing = (await getContentItems(kind, true)).find(
      (item) => item.slug === body.oldSlug,
    );
    if (!existing) return NextResponse.json({ error: "The content item no longer exists." }, { status: 404 });
    await updateContentItem(kind, body.oldSlug, parsed.data);
    const nextItem = { ...existing, ...parsed.data };
    const previousMedia = collectMediaUrls(existing);
    const nextMedia = new Set(collectMediaUrls(nextItem));
    let warning: string | undefined;
    try {
      await deleteUnreferencedMedia(previousMedia.filter((url) => !nextMedia.has(url)));
    } catch (error) {
      console.error(
        "Content was updated, but old media cleanup failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
      warning = "Some replaced media could not be removed from Firebase Storage.";
    }
    revalidateContent(kind, body.oldSlug, nextItem.slug);
    return NextResponse.json({ item: nextItem, warning });
  } catch (error) {
    return handleStoreError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const denied = authorizeAdminRequest(request);
  if (denied) return denied;
  if (
    jsonLimit(request, 4 * 1024) ||
    isRateLimited(`admin-content:${clientAddress(request)}`, 60, 60 * 1000)
  ) {
    return NextResponse.json({ error: "Too many content changes. Try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid deletion request." }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("kind" in body) ||
    !("slug" in body) ||
    typeof body.slug !== "string"
  ) {
    return NextResponse.json({ error: "Content type and slug are required." }, { status: 400 });
  }
  const kind = readKind(body.kind);
  if (!kind) return NextResponse.json({ error: "Unsupported content type." }, { status: 400 });

  try {
    const mediaUrls = await deleteContentItem(kind, body.slug);
    let warning: string | undefined;
    try {
      await deleteUnreferencedMedia(mediaUrls);
    } catch (error) {
      console.error(
        "Content was deleted, but associated media cleanup failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
      warning = "Some associated media could not be removed from Firebase Storage.";
    }
    revalidateContent(kind, body.slug);
    return NextResponse.json({ success: true, warning });
  } catch (error) {
    return handleStoreError(error);
  }
}
