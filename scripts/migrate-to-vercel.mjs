import { Redis } from "@upstash/redis";
import { put } from "@vercel/blob";
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import path from "node:path";

const requiredEnvironment = [
  "BLOB_READ_WRITE_TOKEN",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);
if (missingEnvironment.length) {
  throw new Error(`Missing environment variables: ${missingEnvironment.join(", ")}`);
}

const publicRoot = path.resolve("public");
const overridesPath = path.resolve("data/content-overrides.json");
const overrides = JSON.parse(await readFile(overridesPath, "utf8"));
const mediaPaths = new Set();

function collectMedia(value) {
  if (typeof value === "string" && value.startsWith("/uploads/")) {
    mediaPaths.add(value);
  } else if (Array.isArray(value)) {
    value.forEach(collectMedia);
  } else if (value && typeof value === "object") {
    Object.values(value).forEach(collectMedia);
  }
}

collectMedia(overrides);
const resolvedPaths = new Map();
const missingFiles = [];

for (const mediaPath of mediaPaths) {
  const relativePath = decodeURIComponent(mediaPath.slice(1));
  const filePath = path.resolve(publicRoot, relativePath);
  if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
    throw new Error(`Unsafe media path in content overrides: ${mediaPath}`);
  }
  try {
    await stat(filePath);
    resolvedPaths.set(mediaPath, filePath);
  } catch {
    missingFiles.push(mediaPath);
  }
}

if (missingFiles.length) {
  throw new Error(`Restore or remove these missing local uploads before migration:\n${missingFiles.join("\n")}`);
}

const migratedUrls = new Map();
for (const [mediaPath, filePath] of resolvedPaths) {
  const fileName = path.basename(filePath);
  const body = Readable.toWeb(createReadStream(filePath));
  const blob = await put(`uploads/${mediaPath.slice("/uploads/".length)}`, body, {
    access: "public",
    addRandomSuffix: true,
    multipart: (await stat(filePath)).size > 5 * 1024 * 1024,
    contentType: mediaPath.toLowerCase().endsWith(".mp4") ? "video/mp4"
      : mediaPath.toLowerCase().endsWith(".mov") ? "video/quicktime"
        : mediaPath.toLowerCase().endsWith(".png") ? "image/png"
          : mediaPath.toLowerCase().endsWith(".webp") ? "image/webp"
            : mediaPath.toLowerCase().endsWith(".avif") ? "image/avif"
              : "image/jpeg",
  });
  migratedUrls.set(mediaPath, blob.url);
  console.log(`Uploaded ${fileName}`);
}

function replaceMedia(value) {
  if (typeof value === "string") return migratedUrls.get(value) ?? value;
  if (Array.isArray(value)) return value.map(replaceMedia);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceMedia(item)]));
  }
  return value;
}

const redis = Redis.fromEnv();
await redis.set("orchid-interiors:content-overrides", replaceMedia(overrides));
console.log(`Migrated ${migratedUrls.size} uploads and seeded production content.`);