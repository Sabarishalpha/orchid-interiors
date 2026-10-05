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
  const filename = path.split("/").pop() ?? "";
  const baseName = filename.replace(/\.jpg$/, "").replace(/-\d+$/, "");

  return missingProjectAssetPrefixes.includes(baseName)
    ? "/images/projects/1.png"
    : path;
}
