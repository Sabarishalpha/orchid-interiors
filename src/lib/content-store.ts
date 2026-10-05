import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import type { Bucket } from "@google-cloud/storage";
import designLibrarySeed from "../../data/design-library.json";
import projectsSeed from "../../data/projects.json";
import servicesSeed from "../../data/services.json";
import type { DesignCategory } from "@/app/data/designLibrary";
import type { Project } from "@/app/data/projects";
import type { Service } from "@/app/data/services";
import { getFirebaseServices } from "@/lib/firebase-admin";
import type { ContentKind } from "@/lib/content-schema";

export type ManagedContent = Service | DesignCategory | Project;
const publicDirectory = path.join(process.cwd(), "public");

const seedData: Record<ContentKind, ManagedContent[]> = {
  services: servicesSeed as Service[],
  "design-library": designLibrarySeed as DesignCategory[],
  projects: projectsSeed as Project[],
};

const collectionNames: Record<ContentKind, string> = {
  services: "services",
  "design-library": "designLibrary",
  projects: "projects",
};

async function migrateSeedMedia(item: ManagedContent, bucket: Bucket) {
  const copy: Record<string, unknown> = { ...item };
  const mediaFields = ["image", "gallery", "images", "video"] as const;

  async function migrateUrl(url: string) {
    if (!url.startsWith("/uploads/")) return url;
    const localPath = path.resolve(publicDirectory, `.${url}`);
    const relativePath = path.relative(publicDirectory, localPath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      throw new Error("A legacy media path is outside the public directory.");
    }

    const bytes = await readFile(localPath);
    const extension = path.extname(localPath).toLowerCase();
    const contentType =
      extension === ".png"
        ? "image/png"
        : extension === ".webp"
          ? "image/webp"
          : extension === ".mp4"
            ? "video/mp4"
            : "image/jpeg";
    const digest = createHash("sha256").update(url).digest("hex");
    const storagePath = `orchid-content/legacy-${digest}-${path.basename(localPath)}`;
    const token = digest;
    await bucket.file(storagePath).save(bytes, {
      resumable: false,
      metadata: {
        contentType,
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
  }

  for (const field of mediaFields) {
    const value = copy[field];
    if (typeof value === "string") copy[field] = await migrateUrl(value);
    if (Array.isArray(value)) {
      copy[field] = await Promise.all(value.map((url) => migrateUrl(String(url))));
    }
  }

  return copy as unknown as ManagedContent;
}

export async function getContentItems(kind: ContentKind, includeUnpublished = false) {
  const firebase = getFirebaseServices();
  if (!firebase) {
    return seedData[kind].filter(
      (item) => includeUnpublished || item.published !== false,
    );
  }

  const collection = firebase.db.collection(collectionNames[kind]);
  const snapshot = await collection.get();
  const seedMarker = firebase.db.collection("_system").doc(`seed-${collectionNames[kind]}`);
  const markerSnapshot = await seedMarker.get();
  if (snapshot.empty) {
    if (markerSnapshot.exists) return [];

    const batch = firebase.db.batch();
    const migratedItems = await Promise.all(
      seedData[kind].map((item) => migrateSeedMedia(item, firebase.bucket)),
    );
    for (const item of migratedItems) {
      batch.set(collection.doc(item.slug), item);
    }
    batch.set(seedMarker, { completedAt: FieldValue.serverTimestamp() });
    await batch.commit();
    return migratedItems.filter(
      (item) => includeUnpublished || item.published !== false,
    );
  }
  if (!markerSnapshot.exists) {
    await seedMarker.set({ completedAt: FieldValue.serverTimestamp() });
  }

  return snapshot.docs
    .map((document) => {
      const item = document.data();
      delete item.updatedAt;
      return item as ManagedContent;
    })
    .filter((item) => includeUnpublished || item.published !== false)
    .sort((first, second) =>
      String(first.number ?? "").localeCompare(String(second.number ?? "")),
    );
}

export async function getContentItem(kind: ContentKind, slug: string) {
  return (await getContentItems(kind)).find((item) => item.slug === slug) ?? null;
}

export async function createContentItem(kind: ContentKind, data: Record<string, unknown>) {
  const firebase = getFirebaseServices();
  if (!firebase) throw new Error("Firebase storage is not configured.");

  const collection = firebase.db.collection(collectionNames[kind]);
  const item: Record<string, unknown> = {
    ...data,
    number: String((await collection.get()).size + 1).padStart(2, "0"),
    ...(kind === "projects"
      ? { id: Date.now() }
      : {}),
  };
  const document = collection.doc(String(item.slug));
  await firebase.db.runTransaction(async (transaction) => {
    const existing = await transaction.get(document);
    if (existing.exists) throw new Error("An item with this slug already exists.");
    transaction.set(document, { ...item, updatedAt: FieldValue.serverTimestamp() });
  });
  return item as unknown as ManagedContent;
}

export async function updateContentItem(
  kind: ContentKind,
  oldSlug: string,
  data: Record<string, unknown>,
) {
  const firebase = getFirebaseServices();
  if (!firebase) throw new Error("Firebase storage is not configured.");

  const collection = firebase.db.collection(collectionNames[kind]);
  const oldDocument = collection.doc(oldSlug);
  const newDocument = collection.doc(String(data.slug));
  const item = { ...data, updatedAt: FieldValue.serverTimestamp() };

  await firebase.db.runTransaction(async (transaction) => {
    const existing = await transaction.get(oldDocument);
    if (!existing.exists) throw new Error("The content item no longer exists.");

    if (oldSlug !== data.slug) {
      const slugCollision = await transaction.get(newDocument);
      if (slugCollision.exists) throw new Error("An item with this slug already exists.");
      transaction.set(newDocument, {
        ...existing.data(),
        ...item,
        ...(kind === "projects" ? { id: existing.get("id") } : {}),
      });
      transaction.delete(oldDocument);
    } else {
      transaction.update(oldDocument, item);
    }
  });
}

export async function deleteContentItem(kind: ContentKind, slug: string) {
  const firebase = getFirebaseServices();
  if (!firebase) throw new Error("Firebase storage is not configured.");

  const collection = firebase.db.collection(collectionNames[kind]);
  const document = collection.doc(slug);
  return firebase.db.runTransaction(async (transaction) => {
    const existing = await transaction.get(document);
    if (!existing.exists) throw new Error("The content item no longer exists.");
    const data = existing.data() ?? {};
    transaction.delete(document);
    return collectMediaUrls(data as ManagedContent);
  });
}

export async function collectUnreferencedMediaUrls(candidates: string[]) {
  const firebase = getFirebaseServices();
  if (!firebase || candidates.length === 0) return [];

  const references = new Set<string>();
  for (const kind of Object.keys(collectionNames) as ContentKind[]) {
    const snapshot = await firebase.db.collection(collectionNames[kind]).get();
    for (const document of snapshot.docs) {
      for (const url of collectMediaUrls(document.data() as ManagedContent)) {
        references.add(url);
      }
    }
  }
  return candidates.filter((candidate) => !references.has(candidate));
}

export function getManagedStoragePath(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "firebasestorage.googleapis.com") return null;
    const match = parsed.pathname.match(/^\/v0\/b\/[^/]+\/o\/(.+)$/);
    if (!match) return null;
    const path = decodeURIComponent(match[1]);
    return path.startsWith("orchid-content/") ? path : null;
  } catch {
    return null;
  }
}

export async function deleteUnreferencedMedia(urls: string[]) {
  const firebase = getFirebaseServices();
  if (!firebase) throw new Error("Firebase storage is not configured.");

  const removableUrls = await collectUnreferencedMediaUrls(urls);
  await Promise.all(
    removableUrls.map(async (url) => {
      const path = getManagedStoragePath(url);
      if (path) await firebase.bucket.file(path).delete({ ignoreNotFound: true });
    }),
  );
}

export async function createMediaUpload(name: string, contentType: string) {
  const firebase = getFirebaseServices();
  if (!firebase) throw new Error("Firebase Storage is not configured.");

  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "upload";
  const path = `orchid-content/${randomUUID()}-${safeName}`;
  const file = firebase.bucket.file(path);
  const [uploadUrl] = await file.getSignedUrl({
    action: "write",
    expires: Date.now() + 10 * 60 * 1000,
    contentType,
    version: "v4",
  });
  return { path, uploadUrl };
}

export async function finalizeMediaUpload(path: string, contentType: string) {
  const firebase = getFirebaseServices();
  if (!firebase) throw new Error("Firebase Storage is not configured.");
  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ]);
  if (
    !path.startsWith("orchid-content/") ||
    path.includes("..") ||
    !allowedTypes.has(contentType)
  ) {
    throw new Error("Invalid media upload.");
  }

  const file = firebase.bucket.file(path);
  const [exists] = await file.exists();
  if (!exists) throw new Error("The uploaded media file was not found.");
  const [metadata] = await file.getMetadata();
  const size = Number(metadata.size);
  if (
    metadata.contentType !== contentType ||
    !Number.isFinite(size) ||
    size <= 0 ||
    size > 50 * 1024 * 1024
  ) {
    await file.delete({ ignoreNotFound: true });
    throw new Error("The uploaded file type or size is not allowed.");
  }

  const token = randomUUID();
  await file.setMetadata({
    contentType,
    metadata: { firebaseStorageDownloadTokens: token },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${firebase.bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

export function collectMediaUrls(item: ManagedContent | DocumentData) {
  const data = item as Record<string, unknown>;
  const values = [
    data.image,
    ...(Array.isArray(data.gallery) ? data.gallery : []),
    ...(Array.isArray(data.images) ? data.images : []),
    data.video,
  ];
  return [
    ...new Set(
      values.filter(
        (value): value is string =>
          typeof value === "string" && Boolean(getManagedStoragePath(value)),
      ),
    ),
  ];
}
