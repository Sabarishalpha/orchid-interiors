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

export const runtime = "nodejs";

const uploadRoot = path.join(process.cwd(), "public", "uploads");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const maxFileSize = 1024 * 1024 * 1024;

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

async function saveImage(file: File, kind: ContentKind, slug: string) {
  if (!file.size) return null;

  const extension = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.has(extension) || file.size > maxFileSize) {
    throw new Error("Images must be JPG, PNG, WEBP or AVIF files no larger than 1GB.");
  }

  const folder = path.join(uploadRoot, kind, slug);
  await fs.mkdir(folder, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  await fs.writeFile(path.join(folder, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${kind}/${slug}/${filename}`;
}

async function imageValues(form: FormData, kind: ContentKind, slug: string) {
  const mainFile = form.get("mainImage");
  const galleryFiles = form.getAll("galleryImages");
  const mainImage =
    mainFile instanceof File ? await saveImage(mainFile, kind, slug) : null;
  const galleryUploads = await Promise.all(
    galleryFiles
      .filter((file): file is File => file instanceof File)
      .map((file) => saveImage(file, kind, slug)),
  );

  return {
    mainImage: mainImage ?? text(form, "existingMainImage"),
    gallery: [...existingGallery(form), ...galleryUploads.filter((value): value is string => Boolean(value))],
  };
}

function nextNumber(items: readonly { number: string }[]) {
  return String(items.length + 1).padStart(2, "0");
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    projects: getContent("projects"),
    services: getContent("services"),
    designLibrary: getContent("designLibrary"),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await request.formData();
    const kindValue = text(form, "kind");
    if (!isContentKind(kindValue)) {
      return NextResponse.json({ error: "Invalid content type." }, { status: 400 });
    }

    const title = text(form, "title");
    const slug = text(form, "slug") || slugify(title);
    if (!title || !slug) return NextResponse.json({ error: "A title is required." }, { status: 400 });

    const currentProjects = getProjects();
    const currentServices = getServices();
    const currentLibrary = getDesignLibrary();
    const currentItems: Array<Project | Service | DesignCategory> = getContent(kindValue);
    const current = currentItems.find((item) => item.slug === slug);
    const duplicate = currentItems.some((item) => item.slug === slug && item !== current);
    if (duplicate) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });

    const images = await imageValues(form, kindValue, slug);
    if (!images.mainImage) return NextResponse.json({ error: "A main image is required." }, { status: 400 });

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
        ...(current && "video" in current && current.video
          ? { video: current.video }
          : {}),
      };
      saveContent({ projects: currentProjects.some(({ slug: itemSlug }) => itemSlug === slug)
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
      };
      saveContent({ projects: currentProjects, services: currentServices.some(({ slug: itemSlug }) => itemSlug === slug)
        ? currentServices.map((entry) => (entry.slug === slug ? item : entry))
        : [...currentServices, item], designLibrary: currentLibrary });
    } else {
      const item: DesignCategory = {
        number: current?.number ?? nextNumber(currentLibrary),
        slug,
        title,
        description: text(form, "description"),
        images: [images.mainImage, ...images.gallery],
      };
      saveContent({ projects: currentProjects, services: currentServices, designLibrary: currentLibrary.some(({ slug: itemSlug }) => itemSlug === slug)
        ? currentLibrary.map((entry) => (entry.slug === slug ? item : entry))
        : [...currentLibrary, item] });
    }

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

  deleteContent(body.kind, body.slug);
  return NextResponse.json({ ok: true });
}
