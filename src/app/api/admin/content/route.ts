import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import {
  getContent,
  deleteContent,
  getDesignLibrary,
  getProjects,
  getServices,
  saveContent,
  type ContentKind,
  type DesignCategory,
  type Project,
  type Service,
} from "../../../../lib/content";
import { isAdmin } from "../../../../lib/admin-auth";
import { recordActivity } from "../../../../lib/activity";

export const runtime = "nodejs";

const uploadRoot = path.join(process.cwd(), "public", "uploads");
const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const allowedVideoExtensions = new Set([".mp4", ".mov"]);
const maxFileSize = 1024 * 1024 * 1024;
const maxRequestSize = maxFileSize + 10 * 1024 * 1024;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isContentKind(value: string): value is ContentKind {
  return value === "projects" || value === "services" || value === "designLibrary";
}

function isSafeSlug(value: string) {
  return value.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function hasValidSignature(extension: string, buffer: Buffer) {
  if (extension === ".jpg" || extension === ".jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (extension === ".png") {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (extension === ".webp") {
    return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }
  if (extension === ".avif") {
    return buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp" && /^(avif|avis)$/.test(buffer.toString("ascii", 8, 12));
  }
  if (extension === ".mp4" || extension === ".mov") {
    return buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp";
  }
  return false;
}

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function existingGallery(form: FormData) {
  try {
    const value = JSON.parse(text(form, "existingGallery"));
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function isPublicBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

function uploadedGallery(form: FormData): string[] | null {
  const rawValue = text(form, "galleryImageUrls");
  if (!rawValue) return [];
  try {
    const value = JSON.parse(rawValue);
    return Array.isArray(value) && value.every((item) => typeof item === "string" && isPublicBlobUrl(item))
      ? value as string[]
      : null;
  } catch {
    return null;
  }
}

async function saveUpload(
  file: File,
  kind: ContentKind,
  slug: string,
  extensions: Set<string>,
  message: string,
) {
  if (!file.size) return null;

  const extension = path.extname(file.name).toLowerCase();
  if (!extensions.has(extension) || file.size > maxFileSize) {
    throw new Error(message);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!hasValidSignature(extension, buffer)) {
    throw new Error(message);
  }

  const folder = path.join(uploadRoot, kind, slug);
  await fs.mkdir(folder, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  await fs.writeFile(path.join(folder, filename), buffer);
  return `/uploads/${kind}/${slug}/${filename}`;
}

async function saveImage(file: File, kind: ContentKind, slug: string) {
  return saveUpload(
    file,
    kind,
    slug,
    allowedImageExtensions,
    "Images must be JPG, PNG, WEBP or AVIF files no larger than 1GB.",
  );
}

async function saveVideo(file: File, kind: ContentKind, slug: string) {
  return saveUpload(
    file,
    kind,
    slug,
    allowedVideoExtensions,
    "Videos must be MP4 or MOV files no larger than 1GB.",
  );
}

async function imageValues(form: FormData, kind: ContentKind, slug: string) {
  const mainFile = form.get("mainImage");
  const galleryFiles = form.getAll("galleryImages");
  const remoteMainImage = text(form, "mainImageUrl");
  const remoteGallery = uploadedGallery(form);
  if (galleryFiles.length > 40) {
    throw new Error("A maximum of 40 gallery images can be uploaded at once.");
  }
  if (remoteMainImage && !isPublicBlobUrl(remoteMainImage)) {
    throw new Error("The main image URL is not a valid Vercel Blob URL.");
  }
  if (!remoteGallery) {
    throw new Error("One or more gallery image URLs are invalid.");
  }
  const mainImage =
    mainFile instanceof File ? await saveImage(mainFile, kind, slug) : null;
  const galleryUploads = await Promise.all(
    galleryFiles
      .filter((file): file is File => file instanceof File)
      .map((file) => saveImage(file, kind, slug)),
  );

  return {
    mainImage: remoteMainImage || mainImage || text(form, "existingMainImage"),
    gallery: [...existingGallery(form), ...remoteGallery, ...galleryUploads.filter((value): value is string => Boolean(value))],
  };
}

function nextNumber(items: readonly { number: string }[]) {
  return String(items.length + 1).padStart(2, "0");
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [projects, services, designLibrary] = await Promise.all([
    getContent("projects", true),
    getContent("services", true),
    getContent("designLibrary", true),
  ]);
  return NextResponse.json({
    projects,
    services,
    designLibrary,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxRequestSize) {
    return NextResponse.json({ error: "The upload is larger than 1GB." }, { status: 413 });
  }

  try {
    const form = await request.formData();
    if (process.env.VERCEL && ["mainImage", "galleryImages", "video"].some((key) => form.getAll(key).some((value) => value instanceof File && value.size > 0))) {
      return NextResponse.json({ error: "Upload files directly to Vercel Blob before saving." }, { status: 400 });
    }
    const kindValue = text(form, "kind");
    if (!isContentKind(kindValue)) {
      return NextResponse.json({ error: "Invalid content type." }, { status: 400 });
    }

    const title = text(form, "title");
    const slug = text(form, "slug") || slugify(title);
    if (!title || !slug) return NextResponse.json({ error: "A title is required." }, { status: 400 });
    if (title.length > 200 || !isSafeSlug(slug)) {
      return NextResponse.json({ error: "Use a valid title and URL slug." }, { status: 400 });
    }

    const [currentProjects, currentServices, currentLibrary, currentItems] = await Promise.all([
      getProjects(true),
      getServices(true),
      getDesignLibrary(true),
      getContent(kindValue, true),
    ]);
    const current = currentItems.find((item) => item.slug === slug);
    const duplicate = currentItems.some((item) => item.slug === slug && item !== current);
    if (duplicate) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });

    const images = await imageValues(form, kindValue, slug);
    if (!images.mainImage) return NextResponse.json({ error: "A main image is required." }, { status: 400 });
    const videoFile = form.get("video");
    const remoteVideo = text(form, "videoUrl");
    if (remoteVideo && !isPublicBlobUrl(remoteVideo)) {
      throw new Error("The video URL is not a valid Vercel Blob URL.");
    }
    const video = remoteVideo || (videoFile instanceof File
      ? await saveVideo(videoFile, kindValue, slug)
      : text(form, "existingVideo"));
    const publishedValue = form.get("published");
    const published = publishedValue === null || publishedValue === "true";

    if (kindValue === "projects") {
      const item: Project = {
        id: current && "id" in current ? current.id : Math.max(0, ...currentProjects.map(({ id }) => id)) + 1,
        number: current?.number ?? nextNumber(currentProjects),
        title,
        slug,
        category: text(form, "category") as Project["category"],
        location: text(form, "location"),
        description: text(form, "description"),
        image: images.mainImage,
        width: 1920,
        height: 1080,
        gallery: images.gallery,
        published,
        ...(video ? { video } : {}),
      };
      await saveContent({ projects: currentProjects.some(({ slug: itemSlug }) => itemSlug === slug)
        ? currentProjects.map((entry) => (entry.slug === slug ? item : entry))
        : [...currentProjects, item], services: currentServices, designLibrary: currentLibrary });
    } else if (kindValue === "services") {
      const item: Service = {
        number: current?.number ?? nextNumber(currentServices),
        slug,
        title,
        description: text(form, "description"),
        detail: text(form, "description"),
        image: images.mainImage,
        gallery: images.gallery,
        published,
        ...(video ? { video } : {}),
      };
      await saveContent({ projects: currentProjects, services: currentServices.some(({ slug: itemSlug }) => itemSlug === slug)
        ? currentServices.map((entry) => (entry.slug === slug ? item : entry))
        : [...currentServices, item], designLibrary: currentLibrary });
    } else {
      const item: DesignCategory = {
        number: current?.number ?? nextNumber(currentLibrary),
        slug,
        title,
        description: text(form, "description"),
        images: [images.mainImage, ...images.gallery],
        published,
        ...(video ? { video } : {}),
      };
      await saveContent({ projects: currentProjects, services: currentServices, designLibrary: currentLibrary.some(({ slug: itemSlug }) => itemSlug === slug)
        ? currentLibrary.map((entry) => (entry.slug === slug ? item : entry))
        : [...currentLibrary, item] });
    }

    await recordActivity({
      type: "content_update",
      path: `/${kindValue}/${slug}`,
      category: kindValue === "projects" ? "project" : kindValue === "services" ? "service" : "designLibrary",
    });

    return NextResponse.json({ ok: true, slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save content.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { kind?: string; slug?: string }
    | null;

  if (!body?.slug || !body.kind || !isContentKind(body.kind)) {
    return NextResponse.json({ error: "A valid content type and slug are required." }, { status: 400 });
  }

  await deleteContent(body.kind, body.slug);
  await recordActivity({
    type: "content_update",
    path: `/${body.kind}/${body.slug}`,
    category: body.kind === "projects" ? "project" : body.kind === "services" ? "service" : "designLibrary",
  });
  return NextResponse.json({ ok: true });
}
