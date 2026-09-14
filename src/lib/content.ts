import "server-only";

import fs from "node:fs";
import path from "node:path";

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

function readOverrides(): ContentOverrides {
  try {
    return JSON.parse(fs.readFileSync(contentPath, "utf8")) as ContentOverrides;
  } catch {
    return {};
  }
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

export function getProjects() {
  const overrides = readOverrides();
  return mergeBySlug(PROJECTS, overrides.projects, overrides.deleted?.projects);
}

export function getServices() {
  const overrides = readOverrides();
  return mergeBySlug(SERVICES, overrides.services, overrides.deleted?.services);
}

export function getDesignLibrary() {
  const overrides = readOverrides();
  return mergeBySlug(
    DESIGN_LIBRARY,
    overrides.designLibrary,
    overrides.deleted?.designLibrary,
  );
}

export function getContent(kind: ContentKind) {
  if (kind === "projects") return getProjects();
  if (kind === "services") return getServices();
  return getDesignLibrary();
}

export function saveContent(content: ContentOverrides) {
  const existing = readOverrides();
  const deleted = { ...existing.deleted, ...content.deleted };
  const collections = {
    projects: content.projects ?? getProjects(),
    services: content.services ?? getServices(),
    designLibrary: content.designLibrary ?? getDesignLibrary(),
  };

  for (const kind of ["projects", "services", "designLibrary"] as const) {
    deleted[kind] = (deleted[kind] ?? []).filter(
      (slug) => !collections[kind].some((item) => item.slug === slug),
    );
  }

  fs.mkdirSync(path.dirname(contentPath), { recursive: true });
  fs.writeFileSync(
    contentPath,
    `${JSON.stringify(
      {
        ...collections,
        deleted,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

export function deleteContent(kind: ContentKind, slug: string) {
  const overrides = readOverrides();
  const collection = overrides[kind] ?? [];
  const deleted = new Set(overrides.deleted?.[kind] ?? []);
  const nextOverrides = collection.filter((item) => item.slug !== slug);
  const isBuiltIn =
    (kind === "projects" && PROJECTS.some((item) => item.slug === slug)) ||
    (kind === "services" && SERVICES.some((item) => item.slug === slug)) ||
    (kind === "designLibrary" && DESIGN_LIBRARY.some((item) => item.slug === slug));

  if (isBuiltIn) deleted.add(slug);

  saveContent({
    ...overrides,
    [kind]: nextOverrides,
    deleted: {
      ...overrides.deleted,
      [kind]: [...deleted],
    },
  });
}

export type { DesignCategory, Project, Service };
