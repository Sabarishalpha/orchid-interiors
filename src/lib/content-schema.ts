import { z } from "zod";

export const contentKinds = ["services", "design-library", "projects"] as const;
export type ContentKind = (typeof contentKinds)[number];

function isMediaUrl(value: string) {
  if (/^\/(?!\/)/.test(value)) return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "firebasestorage.googleapis.com"
    );
  } catch {
    return false;
  }
}

const mediaUrl = z
  .string()
  .trim()
  .min(1, "Upload the required image.")
  .max(2048)
  .refine(isMediaUrl, "Choose a valid image or video.");
const optionalMediaUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => !value || isMediaUrl(value), "Choose a valid video.")
  .default("");
const baseContentSchema = z.object({
  title: z.string().trim().min(2, "Enter a title.").max(120),
  description: z.string().trim().min(2, "Enter a description.").max(1000),
  slug: z
    .string()
    .trim()
    .min(2, "Enter a slug.")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  published: z.boolean().default(true),
});

export const serviceContentSchema = baseContentSchema.extend({
  image: mediaUrl.min(1, "Upload a cover image."),
  gallery: z.array(mediaUrl).max(40),
  video: optionalMediaUrl,
  detail: z.string().trim().min(2, "Enter service details.").max(3000),
});

export const designLibraryContentSchema = baseContentSchema.extend({
  images: z.array(mediaUrl).min(1, "Upload at least one design image.").max(40),
  video: optionalMediaUrl,
});

export const projectContentSchema = baseContentSchema.extend({
  category: z.enum(["Residential", "Commercial", "Hospitality", "Institute", "Luxury"]),
  location: z.string().trim().min(2, "Enter a project location.").max(120),
  image: mediaUrl.min(1, "Upload a cover image."),
  gallery: z.array(mediaUrl).max(40),
  video: optionalMediaUrl,
  width: z.number().int().min(1).max(10000).default(1920),
  height: z.number().int().min(1).max(10000).default(1080),
});

export function getContentSchema(kind: ContentKind) {
  if (kind === "services") return serviceContentSchema;
  if (kind === "design-library") return designLibraryContentSchema;
  return projectContentSchema;
}

export function isContentKind(value: string): value is ContentKind {
  return contentKinds.includes(value as ContentKind);
}

export function contentCollectionLabel(kind: ContentKind) {
  if (kind === "services") return "Services";
  if (kind === "design-library") return "Design Library";
  return "Projects";
}
