"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDatabase, setSiteStatistics } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseStringList(value: FormDataEntryValue | string | null | undefined) {
  if (!value) return [];

  return String(value)
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" ? 1 : 0;
}

function getNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function refreshPublicContent(...paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

async function saveUploadedFiles(formData: FormData, fieldName: string) {
  const files = formData
    .getAll(fieldName)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (!files.length) return [];

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDirectory, { recursive: true });

  return Promise.all(
    files.map(async (file) => {
      const extension = path.extname(file.name).toLowerCase() || ".bin";
      const fileName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;
      await fs.writeFile(path.join(uploadDirectory, fileName), Buffer.from(await file.arrayBuffer()));
      return `/uploads/${fileName}`;
    }),
  );
}

export async function createServiceAction(formData: FormData) {
  await requireAdminSession();

  const name = getText(formData, "name");
  if (!name) {
    redirect("/admin/services");
  }

  const db = getDatabase();
  const slug = getText(formData, "slug") || slugify(name);
  const shortDescription = getText(formData, "short_description");
  const fullDescription = getText(formData, "full_description") || shortDescription || name;
  const uploadedServiceImages = await saveUploadedFiles(formData, "service_image_file");
  const serviceImage = uploadedServiceImages[0] || getText(formData, "service_image") || "/images/services.jpg";
  const uploadedGallery = await saveUploadedFiles(formData, "gallery_image_files");
  const gallery = [...uploadedGallery, ...parseStringList(formData.get("gallery_images"))];
  const features = parseStringList(formData.get("features"));
  const ctaText = getText(formData, "cta_text") || "Book a consultation";
  const ctaLink = getText(formData, "cta_link") || "/contact";
  const seoTitle = getText(formData, "seo_title") || name;
  const seoDescription = getText(formData, "seo_description") || shortDescription || name;
  const published = getBoolean(formData, "published");
  const displayOrder = getNumber(formData, "display_order");

  db.prepare(`
    INSERT INTO services (
      name, slug, short_description, full_description, service_image,
      gallery_images, icon, features, cta_text, cta_link, seo_title,
      seo_description, published, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name,
    slug,
    shortDescription || name,
    fullDescription,
    serviceImage,
    JSON.stringify(gallery.length ? gallery : [serviceImage]),
    "sparkle",
    JSON.stringify(features),
    ctaText,
    ctaLink,
    seoTitle,
    seoDescription,
    published,
    displayOrder,
  );

  db.close();
  refreshPublicContent("/admin/services", "/services", "/");
  redirect("/admin/services");
}

export async function createProjectAction(formData: FormData) {
  await requireAdminSession();

  const name = getText(formData, "name");
  if (!name) {
    redirect("/admin/projects");
  }

  const db = getDatabase();
  const slug = getText(formData, "slug") || slugify(name);
  const category = getText(formData, "category") || "Residential";
  const location = getText(formData, "location") || "Bengaluru";
  const shortDescription = getText(formData, "short_description") || `${category} interiors by Orchid Interiors.`;
  const fullDescription = getText(formData, "full_description") || shortDescription;
  const uploadedCoverImages = await saveUploadedFiles(formData, "cover_image_file");
  const coverImage = uploadedCoverImages[0] || getText(formData, "cover_image") || "/images/projects/1.png";
  const uploadedGallery = await saveUploadedFiles(formData, "gallery_files");
  const gallery = [...uploadedGallery, ...parseStringList(formData.get("gallery"))];
  const projectType = getText(formData, "project_type") || "Residential";
  const projectVideo = getText(formData, "project_video");
  const clientName = getText(formData, "client_name");
  const areaSqft = getText(formData, "area_sqft");
  const completionYear = getNumber(formData, "completion_year", 0) || null;
  const featured = getBoolean(formData, "featured");
  const published = getBoolean(formData, "published");
  const displayOrder = getNumber(formData, "display_order");
  const seoTitle = getText(formData, "seo_title") || name;
  const seoDescription = getText(formData, "seo_description") || shortDescription;
  const seoKeywords = getText(formData, "seo_keywords") || category;

  db.prepare(`
    INSERT INTO projects (
      name, slug, category, location, project_type, short_description,
      full_description, cover_image, gallery, project_video, client_name,
      area_sqft, completion_year, featured, published, display_order,
      seo_title, seo_description, seo_keywords
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name,
    slug,
    category,
    location,
    projectType,
    shortDescription,
    fullDescription,
    coverImage,
    JSON.stringify(gallery.length ? gallery : [coverImage]),
    projectVideo,
    clientName || null,
    areaSqft || null,
    completionYear,
    featured,
    published,
    displayOrder,
    seoTitle,
    seoDescription,
    seoKeywords,
  );

  db.close();
  refreshPublicContent("/admin/projects", "/projects", "/");
  redirect("/admin/projects");
}

export async function createDesignCategoryAction(formData: FormData) {
  await requireAdminSession();

  const name = getText(formData, "name");
  if (!name) {
    redirect("/admin/design-library");
  }

  const db = getDatabase();
  const slug = getText(formData, "slug") || slugify(name);
  const uploadedCoverImages = await saveUploadedFiles(formData, "cover_image_file");
  const coverImage = uploadedCoverImages[0] || getText(formData, "cover_image") || "/images/projects/1.png";
  const shortDescription = getText(formData, "short_description") || `${name} interior design collection.`;
  const published = getBoolean(formData, "published");
  const displayOrder = getNumber(formData, "display_order");
  const uploadedDesignImages = await saveUploadedFiles(formData, "design_image_files");
  const designImages = parseStringList(formData.get("design_images"));
  const images = [...uploadedDesignImages, ...designImages].length
    ? [...uploadedDesignImages, ...designImages]
    : [coverImage];

  const categoryResult = db.prepare(`
    INSERT INTO design_library_categories (
      name, slug, cover_image, short_description, display_order,
      published, seo_title, seo_description, seo_keywords
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name,
    slug,
    coverImage,
    shortDescription,
    displayOrder,
    published,
    name,
    shortDescription,
    name,
  );

  const categoryId = Number(categoryResult.lastInsertRowid);

  for (const [index, image] of images.entries()) {
    db.prepare(`
      INSERT INTO design_library_items (
        category_id, title, main_image, additional_images, description,
        tags, featured, display_order, published, seo_title, seo_description, seo_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      categoryId,
      `${name} ${index + 1}`,
      image,
      JSON.stringify(images.filter((entry) => entry !== image)),
      shortDescription,
      JSON.stringify([name, "interior", "design"]),
      index === 0 ? 1 : 0,
      index + 1,
      published,
      `${name} ${index + 1}`,
      shortDescription,
      name,
    );
  }

  db.close();
  refreshPublicContent("/admin/design-library", "/design-library", "/");
  redirect("/admin/design-library");
}

export async function updateServiceAction(formData: FormData) {
  await requireAdminSession();
  const id = getNumber(formData, "id");
  const db = getDatabase();
  db.prepare(`UPDATE services SET name = ?, slug = ?, short_description = ?, full_description = ?, service_image = ?, gallery_images = ?, features = ?, cta_text = ?, cta_link = ?, seo_title = ?, seo_description = ?, published = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(
    getText(formData, "name"), getText(formData, "slug"), getText(formData, "short_description"), getText(formData, "full_description"), getText(formData, "service_image"), JSON.stringify(parseStringList(formData.get("gallery_images"))), JSON.stringify(parseStringList(formData.get("features"))), getText(formData, "cta_text"), getText(formData, "cta_link"), getText(formData, "seo_title"), getText(formData, "seo_description"), getBoolean(formData, "published"), getNumber(formData, "display_order"), id,
  );
  db.close();
  refreshPublicContent("/admin/services", "/services", "/");
  redirect("/admin/services");
}

export async function updateProjectAction(formData: FormData) {
  await requireAdminSession();
  const id = getNumber(formData, "id");
  const db = getDatabase();
  db.prepare(`UPDATE projects SET name = ?, slug = ?, category = ?, location = ?, project_type = ?, short_description = ?, full_description = ?, cover_image = ?, gallery = ?, project_video = ?, client_name = ?, area_sqft = ?, completion_year = ?, featured = ?, published = ?, display_order = ?, seo_title = ?, seo_description = ?, seo_keywords = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(
    getText(formData, "name"), getText(formData, "slug"), getText(formData, "category"), getText(formData, "location"), getText(formData, "project_type"), getText(formData, "short_description"), getText(formData, "full_description"), getText(formData, "cover_image"), JSON.stringify(parseStringList(formData.get("gallery"))), getText(formData, "project_video"), getText(formData, "client_name") || null, getText(formData, "area_sqft") || null, getNumber(formData, "completion_year", 0) || null, getBoolean(formData, "featured"), getBoolean(formData, "published"), getNumber(formData, "display_order"), getText(formData, "seo_title"), getText(formData, "seo_description"), getText(formData, "seo_keywords"), id,
  );
  db.close();
  refreshPublicContent("/admin/projects", "/projects", "/");
  redirect("/admin/projects");
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdminSession();
  const id = getNumber(formData, "id");
  const db = getDatabase();
  db.prepare("UPDATE design_library_categories SET name = ?, slug = ?, cover_image = ?, short_description = ?, display_order = ?, published = ?, seo_title = ?, seo_description = ?, seo_keywords = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
    getText(formData, "name"), getText(formData, "slug"), getText(formData, "cover_image"), getText(formData, "short_description"), getNumber(formData, "display_order"), getBoolean(formData, "published"), getText(formData, "seo_title"), getText(formData, "seo_description"), getText(formData, "seo_keywords"), id,
  );
  db.close();
  refreshPublicContent("/admin/design-library", "/design-library", "/");
  redirect("/admin/design-library");
}

export async function reorderDesignItemsAction(formData: FormData) {
  await requireAdminSession();
  const categoryId = getNumber(formData, "category_id");
  const orderedIds = parseStringList(formData.get("ordered_ids"));
  const primaryId = getNumber(formData, "primary_id");
  const db = getDatabase();
  const update = db.prepare("UPDATE design_library_items SET display_order = ?, featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND category_id = ?");
  const transaction = db.transaction(() => {
    orderedIds.forEach((itemId, index) => update.run(index + 1, Number(itemId) === primaryId ? 1 : 0, Number(itemId), categoryId));
  });
  transaction();
  db.close();
  refreshPublicContent("/admin/design-library", "/design-library", "/");
  redirect("/admin/design-library");
}

export async function updateProjectStatusAction(formData: FormData) {
  await requireAdminSession();
  const db = getDatabase();
  db.prepare("UPDATE projects SET published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(getBoolean(formData, "published"), getNumber(formData, "id"));
  db.close();
  refreshPublicContent("/admin/projects", "/projects", "/");
  redirect("/admin/projects");
}

export async function updateServiceStatusAction(formData: FormData) {
  await requireAdminSession();
  const db = getDatabase();
  db.prepare("UPDATE services SET published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(getBoolean(formData, "published"), getNumber(formData, "id"));
  db.close();
  refreshPublicContent("/admin/services", "/services", "/");
  redirect("/admin/services");
}

export async function updateCategoryStatusAction(formData: FormData) {
  await requireAdminSession();
  const db = getDatabase();
  db.prepare("UPDATE design_library_categories SET published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(getBoolean(formData, "published"), getNumber(formData, "id"));
  db.prepare("UPDATE design_library_items SET published = ?, updated_at = CURRENT_TIMESTAMP WHERE category_id = ?").run(getBoolean(formData, "published"), getNumber(formData, "id"));
  db.close();
  refreshPublicContent("/admin/design-library", "/design-library", "/");
  redirect("/admin/design-library");
}

export async function deleteContentAction(formData: FormData) {
  await requireAdminSession();
  const type = getText(formData, "type");
  const id = getNumber(formData, "id");
  const table = type === "project" ? "projects" : type === "service" ? "services" : "design_library_categories";
  const db = getDatabase();
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  db.close();
  const path = type === "project" ? "/projects" : type === "service" ? "/services" : "/design-library";
  refreshPublicContent(`/admin/${type === "project" ? "projects" : type === "service" ? "services" : "design-library"}`, path, "/");
  redirect(`/admin/${type === "project" ? "projects" : type === "service" ? "services" : "design-library"}`);
}

export async function updateStatisticsAction(formData: FormData) {
  await requireAdminSession();
  setSiteStatistics({
    yearsExperience: getNumber(formData, "yearsExperience"),
    projectsCompleted: getNumber(formData, "projectsCompleted"),
    clientFocused: getNumber(formData, "clientFocused"),
    awardsWon: getNumber(formData, "awardsWon"),
    trusted: getNumber(formData, "trusted"),
  });
  revalidatePath("/admin/statistics");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/statistics");
}
