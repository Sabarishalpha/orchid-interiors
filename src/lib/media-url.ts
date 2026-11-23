export function normalizeMediaUrl(url: string) {
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  return `/${url}`;
}
