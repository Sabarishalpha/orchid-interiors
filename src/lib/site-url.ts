const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orchidinteriors.com";

export const siteUrl = new URL(configuredSiteUrl).origin;
