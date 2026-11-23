const missingProjectAssetPrefixes = [
  "atelier",
  "axis",
  "elysian",
  "grand-resort",
  "imperial-villa",
  "knowledge-hub",
  "linear",
  "minimalist",
  "nexa",
  "opulent-house",
  "royale-estate",
  "solara",
  "vertex",
];

export function resolveProjectAsset(path: string) {
  const assetPath =
    path.startsWith("/") || /^[a-z][a-z\d+.-]*:\/\//i.test(path)
      ? path
      : `/${path}`;
  const filename = assetPath.split("/").pop() ?? "";
  const baseName = filename.replace(/\.jpg$/, "").replace(/-\d+$/, "");

  return missingProjectAssetPrefixes.includes(baseName)
    ? "/images/hero-1.png"
    : assetPath;
}
