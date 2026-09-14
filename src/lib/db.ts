import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { PROJECTS } from "@/app/data/projects";
import { SERVICES } from "@/app/data/services";
import { DESIGN_LIBRARY } from "@/app/data/designLibrary";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "orchid-cms.sqlite");

export type ProjectRecord = {
  id: number;
  name: string;
  slug: string;
  category: string;
  location: string;
  project_type: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  gallery: string[];
  project_video: string;
  client_name: string | null;
  area_sqft: string | null;
  completion_year: number | null;
  featured: number;
  published: number;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceRecord = {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  service_image: string;
  gallery_images: string[];
  icon: string;
  features: string[];
  cta_text: string;
  cta_link: string;
  seo_title: string | null;
  seo_description: string | null;
  published: number;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type DesignCategoryRecord = {
  id: number;
  name: string;
  slug: string;
  cover_image: string;
  short_description: string;
  display_order: number;
  published: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
};

export type DesignItemRecord = {
  id: number;
  title: string;
  category_id: number;
  main_image: string;
  additional_images: string[];
  description: string;
  tags: string[];
  featured: number;
  display_order: number;
  published: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
};

export type MediaRecord = {
  id: number;
  file_name: string;
  original_name: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  kind: string;
  created_at: string;
};

function ensureDirectory() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

export function getDatabase(): Database.Database {
  ensureDirectory();
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

function asJson(value: readonly string[] | null | undefined) {
  return JSON.stringify(Array.isArray(value) ? value : []);
}

function asArray(value: string | readonly string[] | null | undefined): string[] {
  if (Array.isArray(value)) return [...value];
  if (!value) return [];

  const rawValue = typeof value === "string" ? value : JSON.stringify(value);
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

function normalizeProject(project: (typeof PROJECTS)[number], index: number) {
  return {
    name: project.title,
    slug: project.slug,
    category: project.category,
    location: project.location,
    project_type: "Residential",
    short_description: `${project.category} interior project designed by Orchid Interiors.`,
    full_description: `${project.title} is a ${project.category.toLowerCase()} interior concept created by Orchid Interiors.`,
    cover_image: project.image,
    gallery: asJson(project.gallery ?? [project.image]),
    project_video: project.video ?? "",
    client_name: null,
    area_sqft: null,
    completion_year: 2024,
    featured: index < 3 ? 1 : 0,
    published: 1,
    display_order: index + 1,
    seo_title: project.title,
    seo_description: `${project.title} in ${project.location} by Orchid Interiors.`,
    seo_keywords: project.category,
  };
}

function normalizeService(service: (typeof SERVICES)[number], index: number) {
  return {
    name: service.title,
    slug: service.slug,
    short_description: service.description,
    full_description: service.detail,
    service_image: service.image,
    gallery_images: asJson(service.gallery ?? [service.image]),
    icon: "sparkle",
    features: asJson(["Design consultation", "Material planning", "Execution support"]),
    cta_text: "Book a consultation",
    cta_link: "/contact",
    seo_title: service.title,
    seo_description: service.description,
    published: 1,
    display_order: index + 1,
  };
}

function normalizeCategory(category: (typeof DESIGN_LIBRARY)[number], index: number) {
  return {
    name: category.title,
    slug: category.slug,
    cover_image: category.images[0],
    short_description: category.description,
    display_order: index + 1,
    published: 1,
    seo_title: category.title,
    seo_description: category.description,
    seo_keywords: category.title,
  };
}

export function initializeDatabase() {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      project_type TEXT NOT NULL DEFAULT 'Residential',
      short_description TEXT NOT NULL,
      full_description TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      gallery TEXT NOT NULL DEFAULT '[]',
      project_video TEXT DEFAULT '',
      client_name TEXT,
      area_sqft TEXT,
      completion_year INTEGER,
      featured INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL DEFAULT 0,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      short_description TEXT NOT NULL,
      full_description TEXT NOT NULL,
      service_image TEXT NOT NULL,
      gallery_images TEXT NOT NULL DEFAULT '[]',
      icon TEXT NOT NULL DEFAULT 'sparkle',
      features TEXT NOT NULL DEFAULT '[]',
      cta_text TEXT NOT NULL DEFAULT 'Book a consultation',
      cta_link TEXT NOT NULL DEFAULT '/contact',
      seo_title TEXT,
      seo_description TEXT,
      published INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS design_library_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      cover_image TEXT NOT NULL,
      short_description TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 0,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS design_library_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      main_image TEXT NOT NULL,
      additional_images TEXT NOT NULL DEFAULT '[]',
      description TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      featured INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 0,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES design_library_categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS media_library (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      kind TEXT NOT NULL DEFAULT 'image',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const adminCount = db.prepare(`SELECT COUNT(*) as count FROM admin_users`).get() as { count: number };
  if (adminCount.count === 0) {
    const username = process.env.ADMIN_USERNAME ?? "admin";
    const email = process.env.ADMIN_EMAIL ?? "admin@orchidinteriors.com";
    const password = process.env.ADMIN_PASSWORD ?? "orchidadmin";
    const hash = buildPasswordHash(password);

    db.prepare(`INSERT INTO admin_users (email, username, password_hash, role) VALUES (?, ?, ?, ?)`).run(
      email,
      username,
      hash,
      "admin",
    );
  }

  const projectCount = db.prepare(`SELECT COUNT(*) as count FROM projects`).get() as { count: number };
  if (projectCount.count === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (
        name, slug, category, location, project_type, short_description,
        full_description, cover_image, gallery, project_video, client_name,
        area_sqft, completion_year, featured, published, display_order,
        seo_title, seo_description, seo_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const [index, project] of PROJECTS.entries()) {
      const data = normalizeProject(project, index);
      insertProject.run(
        data.name,
        data.slug,
        data.category,
        data.location,
        data.project_type,
        data.short_description,
        data.full_description,
        data.cover_image,
        data.gallery,
        data.project_video,
        data.client_name,
        data.area_sqft,
        data.completion_year,
        data.featured,
        data.published,
        data.display_order,
        data.seo_title,
        data.seo_description,
        data.seo_keywords,
      );
    }
  }

  const serviceCount = db.prepare(`SELECT COUNT(*) as count FROM services`).get() as { count: number };
  if (serviceCount.count === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (
        name, slug, short_description, full_description, service_image,
        gallery_images, icon, features, cta_text, cta_link, seo_title,
        seo_description, published, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const [index, service] of SERVICES.entries()) {
      const data = normalizeService(service, index);
      insertService.run(
        data.name,
        data.slug,
        data.short_description,
        data.full_description,
        data.service_image,
        data.gallery_images,
        data.icon,
        data.features,
        data.cta_text,
        data.cta_link,
        data.seo_title,
        data.seo_description,
        data.published,
        data.display_order,
      );
    }
  }

  const categoryCount = db.prepare(`SELECT COUNT(*) as count FROM design_library_categories`).get() as { count: number };
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare(`
      INSERT INTO design_library_categories (
        name, slug, cover_image, short_description, display_order,
        published, seo_title, seo_description, seo_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const [index, category] of DESIGN_LIBRARY.entries()) {
      const data = normalizeCategory(category, index);
      insertCategory.run(
        data.name,
        data.slug,
        data.cover_image,
        data.short_description,
        data.display_order,
        data.published,
        data.seo_title,
        data.seo_description,
        data.seo_keywords,
      );
    }

    const categories = db.prepare(`SELECT id, slug FROM design_library_categories ORDER BY id`).all() as Array<{ id: number; slug: string }>;
    const categoryMap = new Map(categories.map((item) => [item.slug, item.id]));
    const insertItem = db.prepare(`
      INSERT INTO design_library_items (
        category_id, title, main_image, additional_images, description,
        tags, featured, display_order, published, seo_title, seo_description, seo_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const design of DESIGN_LIBRARY) {
      const categoryId = categoryMap.get(design.slug);
      if (!categoryId) continue;

      const images = Array.isArray(design.images) && design.images.length > 0 ? [...design.images] : ["/images/projects/1.png"];
      for (const [index, image] of images.entries()) {
        insertItem.run(
          categoryId,
          `${design.title} ${index + 1}`,
          image,
          asJson(images.filter((entry) => entry !== image)),
          design.description,
          asJson([design.title, "interior", "design"]),
          index === 0 ? 1 : 0,
          index + 1,
          1,
          design.title,
          design.description,
          design.title,
        );
      }
    }
  }

  db.close();
}

export function buildPasswordHash(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 100_000;
  const key = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha256").toString("hex");
  return `pbkdf2_sha256$${iterations}$${salt}$${key}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const match = storedHash.match(/^pbkdf2_sha256\$(\d+)\$([A-Za-z0-9]+)\$(.+)$/);
  if (!match) return false;

  const [, iterations, salt, expectedHash] = match;
  const derived = crypto.pbkdf2Sync(password, salt, Number(iterations), 64, "sha256").toString("hex");
  return derived === expectedHash;
}

export function getAdminUserByUsernameOrEmail(usernameOrEmail: string) {
  const db = getDatabase();
  const user = db
    .prepare(`SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1`)
    .get(usernameOrEmail, usernameOrEmail) as { id: number; email: string; username: string; password_hash: string; role: string } | undefined;

  db.close();
  return user;
}

export function getDashboardStats() {
  const db = getDatabase();
  const stats = {
    totalProjects: db.prepare(`SELECT COUNT(*) as count FROM projects`).get() as { count: number },
    totalServices: db.prepare(`SELECT COUNT(*) as count FROM services`).get() as { count: number },
    totalDesigns: db.prepare(`SELECT COUNT(*) as count FROM design_library_items`).get() as { count: number },
    published: db.prepare(`SELECT COUNT(*) as count FROM projects WHERE published = 1 UNION ALL SELECT COUNT(*) as count FROM services WHERE published = 1 UNION ALL SELECT COUNT(*) as count FROM design_library_items WHERE published = 1`).all() as Array<{ count: number }>,
    drafts: db.prepare(`SELECT COUNT(*) as count FROM projects WHERE published = 0 UNION ALL SELECT COUNT(*) as count FROM services WHERE published = 0 UNION ALL SELECT COUNT(*) as count FROM design_library_items WHERE published = 0`).all() as Array<{ count: number }> ,
  };

  const totalPublished = stats.published.reduce((sum, row) => sum + Number(row.count), 0);
  const totalDrafts = stats.drafts.reduce((sum, row) => sum + Number(row.count), 0);
  db.close();

  return {
    totalProjects: Number(stats.totalProjects.count),
    totalServices: Number(stats.totalServices.count),
    totalDesigns: Number(stats.totalDesigns.count),
    publishedItems: totalPublished,
    draftItems: totalDrafts,
  };
}

export function getAllProjects(search = "") {
  const db = getDatabase();
  const rows = db
    .prepare(`
      SELECT * FROM projects
      WHERE (? = '' OR name LIKE '%' || ? || '%' OR location LIKE '%' || ? || '%' OR category LIKE '%' || ? || '%')
      ORDER BY display_order ASC, created_at DESC
    `)
    .all(search, search, search, search) as ProjectRecord[];
  db.close();
  return rows.map((row) => ({ ...row, gallery: asArray(row.gallery) }));
}

export function getProjectById(id: number) {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM projects WHERE id = ? LIMIT 1").get(id) as ProjectRecord | undefined;
  db.close();
  return row ? { ...row, gallery: asArray(row.gallery) } : null;
}

export function getAllServices(search = "") {
  const db = getDatabase();
  const rows = db
    .prepare(`
      SELECT * FROM services
      WHERE (? = '' OR name LIKE '%' || ? || '%' OR short_description LIKE '%' || ? || '%')
      ORDER BY display_order ASC, created_at DESC
    `)
    .all(search, search, search) as ServiceRecord[];
  db.close();
  return rows.map((row) => ({ ...row, gallery_images: asArray(row.gallery_images), features: asArray(row.features) }));
}

export function getServiceById(id: number) {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM services WHERE id = ? LIMIT 1").get(id) as ServiceRecord | undefined;
  db.close();
  return row ? { ...row, gallery_images: asArray(row.gallery_images), features: asArray(row.features) } : null;
}

export function getAllDesignCategories(search = "") {
  const db = getDatabase();
  const rows = db
    .prepare(`
      SELECT * FROM design_library_categories
      WHERE (? = '' OR name LIKE '%' || ? || '%' OR short_description LIKE '%' || ? || '%')
      ORDER BY display_order ASC, created_at DESC
    `)
    .all(search, search, search) as DesignCategoryRecord[];
  db.close();
  return rows;
}

export function getDesignCategoryById(id: number) {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM design_library_categories WHERE id = ? LIMIT 1").get(id) as DesignCategoryRecord | undefined;
  db.close();
  return row ?? null;
}

export function getAllDesignItemsByCategory(categoryId?: number) {
  const db = getDatabase();
  const query = categoryId
    ? `SELECT * FROM design_library_items WHERE category_id = ? ORDER BY display_order ASC, created_at DESC`
    : `SELECT * FROM design_library_items ORDER BY display_order ASC, created_at DESC`;
  const rows = db.prepare(query).all(categoryId ?? undefined).filter(Boolean) as DesignItemRecord[];
  db.close();
  return rows.map((row) => ({ ...row, additional_images: asArray(row.additional_images), tags: asArray(row.tags) }));
}

export function getPublicProjects() {
  const db = getDatabase();
  const rows = db
    .prepare(`SELECT * FROM projects WHERE published = 1 ORDER BY display_order ASC, created_at DESC`)
    .all() as ProjectRecord[];
  db.close();
  return rows.map((row) => ({ ...row, gallery: asArray(row.gallery), image: row.cover_image, cover_image: row.cover_image, full_description: row.full_description ?? "" }));
}

export function getPublicServices() {
  const db = getDatabase();
  const rows = db
    .prepare(`SELECT * FROM services WHERE published = 1 ORDER BY display_order ASC, created_at DESC`)
    .all() as ServiceRecord[];
  db.close();
  return rows.map((row) => ({ ...row, gallery_images: asArray(row.gallery_images), features: asArray(row.features), image: row.service_image }));
}

export function getPublicDesignCategories() {
  const db = getDatabase();
  const rows = db
    .prepare(`SELECT * FROM design_library_categories WHERE published = 1 ORDER BY display_order ASC, created_at DESC`)
    .all() as DesignCategoryRecord[];
  db.close();
  return rows.map((row) => ({ ...row, title: row.name, description: row.short_description, images: [row.cover_image], slug: row.slug }));
}

export function getDesignLibraryByCategorySlug(slug: string) {
  const db = getDatabase();
  const category = db
    .prepare(`SELECT * FROM design_library_categories WHERE slug = ? AND published = 1 LIMIT 1`)
    .get(slug) as DesignCategoryRecord | undefined;

  if (!category) {
    db.close();
    return null;
  }

  const items = db
    .prepare(`SELECT * FROM design_library_items WHERE category_id = ? AND published = 1 ORDER BY display_order ASC`)
    .all(category.id) as DesignItemRecord[];

  db.close();
  const featuredItem = items.find((item) => item.featured);
  const orderedItems = featuredItem
    ? [featuredItem, ...items.filter((item) => item.id !== featuredItem.id)]
    : items;
  return {
    category: { ...category, title: category.name, description: category.short_description, images: [category.cover_image], slug: category.slug },
    items: orderedItems.map((item) => ({ ...item, additional_images: asArray(item.additional_images), tags: asArray(item.tags), image: item.main_image, images: [item.main_image, ...asArray(item.additional_images)] })),
  };
}

export function getProjectBySlug(slug: string) {
  const db = getDatabase();
  const project = db
    .prepare(`SELECT * FROM projects WHERE slug = ? AND published = 1 LIMIT 1`)
    .get(slug) as ProjectRecord | undefined;
  db.close();
  if (!project) return null;
  return { ...project, gallery: asArray(project.gallery), image: project.cover_image };
}

export function getServiceBySlug(slug: string) {
  const db = getDatabase();
  const service = db
    .prepare(`SELECT * FROM services WHERE slug = ? AND published = 1 LIMIT 1`)
    .get(slug) as ServiceRecord | undefined;
  db.close();
  if (!service) return null;
  return { ...service, gallery_images: asArray(service.gallery_images), features: asArray(service.features), image: service.service_image, detail: service.full_description, description: service.short_description };
}

export function getSiteSetting(key: string) {
  const db = getDatabase();
  const row = db.prepare(`SELECT value FROM site_settings WHERE key = ? LIMIT 1`).get(key) as { value: string } | undefined;
  db.close();
  return row?.value ?? null;
}

export function setSiteSetting(key: string, value: string) {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(key, value);
  db.close();
}

export type SiteStatistics = {
  yearsExperience: number;
  projectsCompleted: number;
  clientFocused: number;
  awardsWon: number;
  trusted: number;
};

const DEFAULT_STATISTICS: SiteStatistics = {
  yearsExperience: 10,
  projectsCompleted: 800,
  clientFocused: 100,
  awardsWon: 25,
  trusted: 100,
};

export function getSiteStatistics(): SiteStatistics {
  return {
    yearsExperience: Number(getSiteSetting("stats.yearsExperience") ?? DEFAULT_STATISTICS.yearsExperience),
    projectsCompleted: Number(getSiteSetting("stats.projectsCompleted") ?? DEFAULT_STATISTICS.projectsCompleted),
    clientFocused: Number(getSiteSetting("stats.clientFocused") ?? DEFAULT_STATISTICS.clientFocused),
    awardsWon: Number(getSiteSetting("stats.awardsWon") ?? DEFAULT_STATISTICS.awardsWon),
    trusted: Number(getSiteSetting("stats.trusted") ?? DEFAULT_STATISTICS.trusted),
  };
}

export function setSiteStatistics(statistics: SiteStatistics) {
  for (const [key, value] of Object.entries(statistics)) {
    setSiteSetting(`stats.${key}`, String(Math.max(0, Math.round(value))));
  }
}

export function getMediaLibrary() {
  const db = getDatabase();
  const rows = db.prepare(`SELECT * FROM media_library ORDER BY created_at DESC`).all() as MediaRecord[];
  db.close();
  return rows;
}

initializeDatabase();
