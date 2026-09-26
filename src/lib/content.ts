import "server-only";

import fs from "node:fs";
import path from "node:path";
import { getProductionRedis } from "./production-storage";

import { DESIGN_LIBRARY, type DesignCategory } from "../app/data/designLibrary";
import { PROJECTS, type Project } from "../app/data/projects";
import { SERVICES, type Service } from "../app/data/services";

export type ContentKind = "projects" | "services" | "designLibrary";

export type ContentOverrides = {
  projects?: Project[];
  services?: Service[];
  designLibrary?: DesignCategory[];
  deleted?: Partial<Record<ContentKind, string[]>>;
};

const contentPath = path.join(process.cwd(), "data", "content-overrides.json");
const contentKey = "orchid-interiors:content-overrides";

function readLocalOverrides(): ContentOverrides {
  try {
    return JSON.parse(fs.readFileSync(contentPath, "utf8")) as ContentOverrides;
  } catch {
    return {};
  }
}

async function readOverrides(): Promise<ContentOverrides> {
  const redis = getProductionRedis();
  if (!redis) return readLocalOverrides();

  const stored = await redis.get<ContentOverrides>(contentKey);
  if (stored) return stored;

  const initial = readLocalOverrides();
  await redis.set(contentKey, initial, { nx: true });
  return (await redis.get<ContentOverrides>(contentKey)) ?? initial;
}

function mergeBySlug<T extends { slug: string }>(
  defaults: readonly T[],
  overrides: readonly T[] = [],
  deleted: readonly string[] = [],
) {
  const overrideMap = new Map(overrides.map((item) => [item.slug, item]));
  const deletedSlugs = new Set(deleted);
  const merged = defaults
    .filter((item) => !deletedSlugs.has(item.slug))
    .map((item) => overrideMap.get(item.slug) ?? item);
  const defaultSlugs = new Set(defaults.map((item) => item.slug));

  return [
    ...merged,
    ...overrides.filter(
      (item) => !defaultSlugs.has(item.slug) && !deletedSlugs.has(item.slug),
    ),
  ];
}

export async function getProjects(includeUnpublished = false) {
  const overrides = await readOverrides();
  const items = mergeBySlug(PROJECTS, overrides.projects, overrides.deleted?.projects);
  return includeUnpublished ? items : items.filter((item) => item.published !== false);
}

export async function getServices(includeUnpublished = false) {
  const overrides = await readOverrides();
  const items = mergeBySlug(SERVICES, overrides.services, overrides.deleted?.services);
  return includeUnpublished ? items : items.filter((item) => item.published !== false);
}

export async function getDesignLibrary(includeUnpublished = false) {
  const overrides = await readOverrides();
  const items = mergeBySlug(
    DESIGN_LIBRARY,
    overrides.designLibrary,
    overrides.deleted?.designLibrary,
  );
  return includeUnpublished ? items : items.filter((item) => item.published !== false);
}

export async function getContent(kind: ContentKind, includeUnpublished = false) {
  if (kind === "projects") return getProjects(includeUnpublished);
  if (kind === "services") return getServices(includeUnpublished);
  return getDesignLibrary(includeUnpublished);
}

export async function saveContent(content: ContentOverrides) {
  const existing = await readOverrides();
  const deleted = { ...existing.deleted, ...content.deleted };
  const collections = {
    projects: content.projects ?? await getProjects(true),
    services: content.services ?? await getServices(true),
    designLibrary: content.designLibrary ?? await getDesignLibrary(true),
  };

  for (const kind of ["projects", "services", "designLibrary"] as const) {
    deleted[kind] = (deleted[kind] ?? []).filter(
      (slug) => !collections[kind].some((item) => item.slug === slug),
    );
  }

  const next = { ...collections, deleted };
  const redis = getProductionRedis();
  if (redis) {
    await redis.set(contentKey, next);
  } else {
    fs.mkdirSync(path.dirname(contentPath), { recursive: true });
    fs.writeFileSync(contentPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  }
}

export async function deleteContent(kind: ContentKind, slug: string) {
  const overrides = await readOverrides();
  const collection = overrides[kind] ?? [];
  const deleted = new Set(overrides.deleted?.[kind] ?? []);
  const nextOverrides = collection.filter((item) => item.slug !== slug);
  const isBuiltIn =
    (kind === "projects" && PROJECTS.some((item) => item.slug === slug)) ||
    (kind === "services" && SERVICES.some((item) => item.slug === slug)) ||
    (kind === "designLibrary" && DESIGN_LIBRARY.some((item) => item.slug === slug));

  if (isBuiltIn) deleted.add(slug);

  await saveContent({
    ...overrides,
    [kind]: nextOverrides,
    deleted: {
      ...overrides.deleted,
      [kind]: [...deleted],
    },
  });
}

export type { DesignCategory, Project, Service };
