import type { DesignCategory } from "../app/data/designLibrary";
import type { Project } from "../app/data/projects";
import type { Service } from "../app/data/services";
import { getContentItems } from "@/lib/content-store";

export async function getProjects() {
  return (await getContentItems("projects")) as Project[];
}

export async function getServices() {
  return (await getContentItems("services")) as Service[];
}

export async function getDesignLibrary() {
  return (await getContentItems("design-library")) as DesignCategory[];
}

export type { DesignCategory, Project, Service };
