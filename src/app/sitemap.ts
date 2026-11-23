import type { MetadataRoute } from "next";
import { getDesignLibrary, getProjects } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, designLibrary] = await Promise.all([
    getProjects(),
    getDesignLibrary(),
  ]);
  const pages = [
    "",
    "/about",
    "/services",
    "/projects",
    "/contact",
    "/design-library",
  ];

  return [
    ...pages.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...designLibrary.map((category) => ({
      url: `${siteUrl}/design-library/${category.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}