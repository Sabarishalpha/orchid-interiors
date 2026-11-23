import { existsSync } from "node:fs";
import path from "node:path";
import type { DesignCategory } from "../app/data/designLibrary";
import type { Project } from "../app/data/projects";
import type { Service } from "../app/data/services";
import { getPublicContentItems } from "@/lib/content-store";
import { resolveProjectAsset } from "@/lib/project-assets";

const publicDirectory = path.resolve(process.cwd(), "public");
const serviceImageFallbacks = [
  { terms: ["kitchen"], image: "/images/design-library/kitchen/01.png" },
  { terms: ["bed"], image: "/images/design-library/bed-room/1.png" },
  { terms: ["living"], image: "/images/design-library/living-room/1.png" },
  { terms: ["dining"], image: "/images/design-library/dining/01.png" },
  { terms: ["pooja"], image: "/images/design-library/pooja/01.png" },
  { terms: ["office", "workstation"], image: "/images/design-library/office/01.png" },
  { terms: ["aluminium", "partition", "door"], image: "/images/design-library/partition/01.png" },
  { terms: ["hospitality", "hotel"], image: "/images/design-library/hotel/1.png" },
  { terms: ["institution"], image: "/images/hero-3.png" },
] as const;

const serviceDestinations = [
  { terms: ["institution"], href: "/projects/kongu-engineering-college" },
  { terms: ["hospitality"], href: "/projects/sangeetha-dental" },
  { terms: ["kitchen"], href: "/design-library/kitchen" },
  { terms: ["bed-room", "bedroom"], href: "/design-library/bed-room" },
  { terms: ["living"], href: "/design-library/living-room" },
  { terms: ["dining"], href: "/design-library/dining-room" },
  { terms: ["pooja"], href: "/design-library/pooja-units" },
  { terms: ["office", "workstation"], href: "/design-library/office-room" },
  {
    terms: ["aluminium", "aluminum", "partition"],
    href: "/design-library/partition-wall",
  },
  { terms: ["hotel"], href: "/design-library/hotel-room" },
] as const;

type ServiceCategory = {
  slug: string;
  title: string;
  category?: string;
  projectSlug?: string;
  href?: string;
};

const serviceCategories: readonly ServiceCategory[] = [
  { slug: "modular-kitchen", title: "Modular Kitchen", category: "kitchen" },
  { slug: "bed-room", title: "Bed Room", category: "bed-room" },
  { slug: "living-rooms", title: "Living Rooms", category: "living-room" },
  { slug: "dining-area", title: "Dining Area", category: "dining-room" },
  { slug: "pooja-units", title: "Pooja Units", category: "pooja-units" },
  {
    slug: "office-workstation",
    title: "Office and Workstation",
    category: "office-room",
  },
  {
    slug: "aluminium-doors-partitions",
    title: "Aluminium Doors & Partitions",
    category: "partition-wall",
  },
  {
    slug: "institutions",
    title: "Institutions",
    projectSlug: "kongu-engineering-college",
    href: "/projects/kongu-engineering-college",
  },
  {
    slug: "hospitality",
    title: "Hospitality",
    category: "hotel-room",
    projectSlug: "sangeetha-dental",
    href: "/projects/sangeetha-dental",
  },
];

export function getServiceHref(slug: string, title: string) {
  const serviceName = `${slug} ${title}`.toLowerCase();
  return (
    serviceDestinations.find(({ terms }) =>
      terms.some((term) => serviceName.includes(term)),
    )?.href ?? "/design-library"
  );
}

function getServiceImageFallback(slug: string, title: string) {
  const serviceName = `${slug} ${title}`.toLowerCase();
  return (
    serviceImageFallbacks.find(({ terms }) =>
      terms.some((term) => serviceName.includes(term)),
    )?.image ?? "/images/hero-1.png"
  );
}

function resolveServiceImage(image: string, slug: string, title: string) {
  if (/^(https?:|data:)/i.test(image)) return image;

  if (image.startsWith("/") && !image.startsWith("//")) {
    try {
      const localPath = path.resolve(
        publicDirectory,
        `.${decodeURIComponent(image.split(/[?#]/, 1)[0])}`,
      );
      const relativePath = path.relative(publicDirectory, localPath);
      const isInsidePublic =
        relativePath !== "" &&
        relativePath !== ".." &&
        !relativePath.startsWith(`..${path.sep}`) &&
        !path.isAbsolute(relativePath);

      if (isInsidePublic && existsSync(localPath)) return image;
    } catch (error) {
      if (!(error instanceof URIError)) throw error;
    }
  }

  return getServiceImageFallback(slug, title);
}

export async function getProjects() {
  return (await getPublicContentItems("projects")) as Project[];
}

export async function getServices() {
  const services = (await getPublicContentItems("services")) as Service[];
  return services.map(({ slug, title, image }) => ({
    slug,
    title,
    image: resolveServiceImage(image, slug, title),
    href: getServiceHref(slug, title),
  }));
}

export function buildServiceCatalog(
  designCategories: readonly DesignCategory[],
  existingServices: readonly Pick<Service, "slug" | "title" | "image">[],
  projects: readonly Project[],
) {
  return serviceCategories.map((service) => {
    const category = service.category
      ? designCategories.find((item) => item.slug === service.category)
      : undefined;
    const project = service.projectSlug
      ? projects.find((item) => item.slug === service.projectSlug)
      : undefined;
    const href =
      service.href ??
      (category ? `/design-library/${category.slug}` : "/design-library");
    const existingService = existingServices.find(
      (item) => getServiceHref(item.slug, item.title) === href,
    );

    return {
      slug: service.slug,
      title: service.title,
      image:
        (project ? resolveProjectAsset(project.image) : undefined) ??
        category?.images[0] ??
        existingService?.image ??
        getServiceImageFallback(service.slug, service.title),
      href,
    };
  });
}

export async function getDesignLibrary() {
  const categories = (await getPublicContentItems("design-library")) as DesignCategory[];
  return categories.filter(
    (category) => category.slug !== "New design for Home Office",
  );
}

export type { DesignCategory, Project, Service };
