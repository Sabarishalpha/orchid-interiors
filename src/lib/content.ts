import type { DesignCategory } from "../app/data/designLibrary";
import type { Project } from "../app/data/projects";
import type { Service } from "../app/data/services";
import { getPublicContentItems } from "@/lib/content-store";

export async function getProjects() {
  return (await getPublicContentItems("projects")) as Project[];
}

export async function getServices() {
  return (await getPublicContentItems("services")) as Service[];
}

export async function getDesignLibrary() {
  const categories = (await getPublicContentItems("design-library")) as DesignCategory[];
  return categories.filter(
    (category) => category.slug !== "New design for Home Office",
  );
}

export type { DesignCategory, Project, Service };
