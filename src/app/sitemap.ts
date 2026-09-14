import type { MetadataRoute } from "next";
import { getDesignLibrary, getProjects, getServices } from "@/lib/content";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://orchidinteriors.com";
const lastModified = new Date("2026-09-10T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();
  const services = getServices();
  const designLibrary = getDesignLibrary();
  const pages = [
    "",
    "/about",
    "/services",
    "/projects",
    "/contact",
    "/orchid-interiors",
    "/design-library",
  ];

  return [
    ...pages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" || path === "/orchid-interiors" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...designLibrary.map((category) => ({
      url: `${siteUrl}/design-library/${category.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}