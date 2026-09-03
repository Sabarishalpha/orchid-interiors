import type { MetadataRoute } from "next";
import { PROJECTS } from "./data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://orchidinteriors.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/services", "/projects", "/contact", "/orchid-interiors"];

  return [
    ...pages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" || path === "/orchid-interiors" ? 1 : 0.8,
    })),
    ...PROJECTS.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}