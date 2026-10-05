"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { ContentKind } from "@/lib/content-schema";

type EditableContent = {
  id?: number;
  number?: string;
  title: string;
  slug: string;
  description: string;
  published?: boolean;
  image?: string;
  images?: string[];
  gallery?: string[];
  video?: string;
  detail?: string;
  category?: "Residential" | "Commercial" | "Hospitality" | "Institute" | "Luxury";
  location?: string;
  width?: number;
  height?: number;
};

type UploadProgress = { name: string; progress: number };

const kindLabels: Record<ContentKind, string> = {
  services: "Service",
  "design-library": "Design Library item",
  projects: "Project",
};

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const maxFileSize = 50 * 1024 * 1024;

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function responseJson<T>(response: Response) {
  const result = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(result.error ?? "The request could not be completed.");
  return result;
}

function putFile(url: string, file: File, onProgress: (progress: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error("The media upload failed. Check Firebase Storage CORS settings and try again."));
    };
    request.onerror = () =>
      reject(new Error("The media upload could not reach Firebase Storage. Check its CORS settings and try again."));
    request.onabort = () => reject(new Error("The media upload was cancelled."));
    request.send(file);
  });
}

export default function ContentEditor({
  kind,
  initialItem,
}: {
  kind: ContentKind;
  initialItem?: EditableContent;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialItem);
  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [slug, setSlug] = useState(initialItem?.slug ? makeSlug(initialItem.slug) : "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [description, setDescription] = useState(initialItem?.description ?? "");
  const [cover, setCover] = useState(initialItem?.image ?? initialItem?.images?.[0] ?? "");
  const [gallery, setGallery] = useState(
    initialItem?.images ?? initialItem?.gallery ?? [],
  );
  const [video, setVideo] = useState(initialItem?.video ?? "");
  const [detail, setDetail] = useState(initialItem?.detail ?? "");
  const [category, setCategory] = useState<EditableContent["category"]>(
    initialItem?.category ?? "Residential",
  );
  const [location, setLocation] = useState(initialItem?.location ?? "");
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [hasUnsavedChanges]);

  const publicPath = useMemo(
    () =>
      kind === "services"
        ? `/services/${slug || "your-slug"}`
        : kind === "projects"
          ? `/projects/${slug || "your-slug"}`
          : `/design-library/${slug || "your-slug"}`,
    [kind, slug],
  );

  async function uploadFile(file: File, onProgress: (progress: number) => void) {
    if (!imageTypes.has(file.type) && !videoTypes.has(file.type)) {
      throw new Error("Choose a JPG, PNG, WebP, AVIF, GIF, MP4, WebM, or QuickTime file.");
    }
    if (file.size <= 0 || file.size > maxFileSize) {
      throw new Error("Each media file must be smaller than 50 MB.");
    }

    const { uploadUrl, path } = await responseJson<{ uploadUrl: string; path: string }>(
      await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, contentType: file.type, size: file.size }),
      }),
    );
    await putFile(uploadUrl, file, onProgress);
    const result = await responseJson<{ url: string }>(
      await fetch("/api/admin/media/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, contentType: file.type }),
      }),
    );
    return result.url;
  }

  async function uploadFiles(files: FileList | null, target: "cover" | "gallery" | "video") {
    if (!files?.length) return;
    const fileList = Array.from(files);
    if (target === "video" && fileList.length !== 1) {
      setError("Upload one video at a time.");
      return;
    }
    if (target === "gallery" && gallery.length + fileList.length > 40) {
      setError("A maximum of 40 gallery images is allowed.");
      return;
    }

    setError("");
    setNotice("");
    const complete: string[] = [];
    try {
      for (const file of fileList) {
        if (target === "video" && !videoTypes.has(file.type)) {
          throw new Error("Choose an MP4, WebM, or QuickTime video.");
        }
        if (target !== "video" && !imageTypes.has(file.type)) {
          throw new Error("Choose a JPG, PNG, WebP, AVIF, or GIF image.");
        }
        setUploads((current) => [...current, { name: file.name, progress: 0 }]);
        const url = await uploadFile(file, (progress) => {
          setUploads((current) =>
            current.map((upload) =>
              upload.name === file.name ? { ...upload, progress } : upload,
            ),
          );
        });
        complete.push(url);
        setHasUnsavedChanges(true);
      }

      if (target === "cover") setCover(complete[0]);
      if (target === "gallery") setGallery((current) => [...current, ...complete]);
      if (target === "video") setVideo(complete[0]);
      setNotice(
        fileList.length === 1
          ? "Media uploaded and ready to publish."
          : `${fileList.length} files uploaded and ready to publish.`,
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Media could not be uploaded.",
      );
    } finally {
      setUploads([]);
      if (target === "cover" && coverInput.current) coverInput.current.value = "";
      if (target === "gallery" && galleryInput.current) galleryInput.current.value = "";
      if (target === "video" && videoInput.current) videoInput.current.value = "";
    }
  }

  function changeTitle(value: string) {
    setTitle(value);
    if (!slugManuallyEdited) setSlug(makeSlug(value));
    setHasUnsavedChanges(true);
  }

  function removeGalleryImage(index: number) {
    setGallery((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setHasUnsavedChanges(true);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);

    const item: EditableContent = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      published: true,
      video,
      ...(kind === "services"
        ? { image: cover, gallery, detail: detail.trim() }
        : {}),
      ...(kind === "design-library"
        ? { images: gallery }
        : {}),
      ...(kind === "projects"
        ? {
            image: cover,
            gallery,
            category,
            location: location.trim(),
            width: initialItem?.width ?? 1920,
            height: initialItem?.height ?? 1080,
          }
        : {}),
    };

    try {
      const response = await fetch("/api/admin/content", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing
            ? { kind, oldSlug: initialItem?.slug, item }
            : { kind, item },
        ),
      });
      const result = await responseJson<{ warning?: string }>(response);
      setHasUnsavedChanges(false);
      router.replace(`/admin?saved=${result.warning ? "warning" : "published"}`);
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Content could not be published.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function setText(
    setter: (value: string) => void,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setter(event.target.value);
    setHasUnsavedChanges(true);
  }

  const label = kindLabels[kind];
  const galleryImages = gallery;

  return (
    <main className="min-h-screen bg-[#f7f6f3] text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-7">
          <Link className="text-sm font-medium tracking-[0.15em] uppercase" href="/admin">
            Orchid Interiors <span className="text-stone-400">/ Studio CMS</span>
          </Link>
          <Link className="text-sm text-stone-600 underline underline-offset-4" href="/admin">
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-7 sm:py-10">
        <div>
          <p className="text-[10px] font-medium tracking-[0.28em] text-stone-500 uppercase">
            {kindLabels[kind]} / {isEditing ? "EDIT" : "NEW"}
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            {isEditing ? "Edit content" : `Create ${label.toLowerCase()}`}
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Save and publish to make this content available on your website.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={save}>
          <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
            <h2 className="text-lg font-medium">Content details</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-stone-700">
                Title <span className="text-red-700">*</span>
                <input
                  className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-500"
                  maxLength={120}
                  onChange={(event) => changeTitle(event.target.value)}
                  required
                  value={title}
                />
              </label>
              <label className="text-sm text-stone-700">
                Slug <span className="text-red-700">*</span>
                <input
                  className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-500"
                  maxLength={100}
                  onChange={(event) => {
                    setSlugManuallyEdited(true);
                    setSlug(makeSlug(event.target.value));
                    setHasUnsavedChanges(true);
                  }}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  required
                  value={slug}
                />
                <span className="mt-1 block break-all text-xs text-stone-500">
                  Public URL: {publicPath}
                </span>
              </label>
              <label className="text-sm text-stone-700 sm:col-span-2">
                Description <span className="text-red-700">*</span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-xl border border-stone-200 px-4 py-3 leading-6 outline-none focus:border-stone-500"
                  maxLength={1000}
                  onChange={(event) => setText(setDescription, event)}
                  required
                  value={description}
                />
              </label>
              {kind === "services" ? (
                <label className="text-sm text-stone-700 sm:col-span-2">
                  Service details <span className="text-red-700">*</span>
                  <textarea
                    className="mt-2 min-h-36 w-full rounded-xl border border-stone-200 px-4 py-3 leading-6 outline-none focus:border-stone-500"
                    maxLength={3000}
                    onChange={(event) => setText(setDetail, event)}
                    required
                    value={detail}
                  />
                </label>
              ) : null}
              {kind === "projects" ? (
                <>
                  <label className="text-sm text-stone-700">
                    Project type <span className="text-red-700">*</span>
                    <select
                      className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:border-stone-500"
                      onChange={(event) => {
                        setCategory(event.target.value as EditableContent["category"]);
                        setHasUnsavedChanges(true);
                      }}
                      value={category}
                    >
                      {["Residential", "Commercial", "Hospitality", "Institute", "Luxury"].map(
                        (value) => <option key={value}>{value}</option>,
                      )}
                    </select>
                  </label>
                  <label className="text-sm text-stone-700">
                    Project location <span className="text-red-700">*</span>
                    <input
                      className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-500"
                      onChange={(event) => setText(setLocation, event)}
                      required
                      value={location}
                    />
                  </label>
                </>
              ) : null}
            </div>
          </section>

          {kind !== "design-library" ? (
            <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
              <div>
                <h2 className="text-lg font-medium">Cover image</h2>
                <p className="mt-1 text-sm text-stone-500">
                  Choose the main image visitors will see in listings.
                </p>
              </div>
              {cover ? (
                <div className="relative mt-5 aspect-[16/8] overflow-hidden rounded-xl bg-stone-100">
                  <Image alt="Content cover preview" className="object-cover" fill sizes="(max-width: 768px) 100vw, 800px" src={cover} />
                  <button
                    className="absolute right-3 top-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-red-700 shadow"
                    onClick={() => {
                      setCover("");
                      setHasUnsavedChanges(true);
                    }}
                    type="button"
                  >
                    Remove cover
                  </button>
                </div>
              ) : null}
              <input
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                className="sr-only"
                onChange={(event) => void uploadFiles(event.target.files, "cover")}
                ref={coverInput}
                type="file"
              />
              <button
                className="mt-5 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium transition hover:bg-stone-50"
                onClick={() => coverInput.current?.click()}
                type="button"
              >
                {cover ? "Replace cover image" : "Upload cover image"}
              </button>
            </section>
          ) : null}

          <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-lg font-medium">
                  {kind === "design-library" ? "Design images" : "Gallery images"}
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Add images to the public {kind === "design-library" ? "collection" : "gallery"}.
                </p>
              </div>
              <span className="text-xs text-stone-500">{galleryImages.length} / 40 images</span>
            </div>
            <input
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="sr-only"
              multiple
              onChange={(event) => void uploadFiles(event.target.files, "gallery")}
              ref={galleryInput}
              type="file"
            />
            <button
              className="mt-5 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium transition hover:bg-stone-50"
              onClick={() => galleryInput.current?.click()}
              type="button"
            >
              Upload images
            </button>
            {galleryImages.length ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {galleryImages.map((image, index) => (
                  <figure className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100" key={`${image}-${index}`}>
                    <Image alt={`Gallery image ${index + 1}`} className="object-cover" fill sizes="(max-width: 640px) 50vw, 25vw" src={image} />
                    <button
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute right-2 top-2 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-medium text-red-700 opacity-100 shadow sm:opacity-0 sm:transition group-hover:opacity-100"
                      onClick={() => removeGalleryImage(index)}
                      type="button"
                    >
                      Remove
                    </button>
                  </figure>
                ))}
              </div>
            ) : kind === "design-library" ? (
              <p className="mt-5 rounded-xl bg-stone-50 px-4 py-5 text-sm text-stone-600">
                Upload at least one image to publish this design collection.
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
            <h2 className="text-lg font-medium">Video (optional)</h2>
            <p className="mt-1 text-sm text-stone-500">MP4, WebM, or QuickTime video up to 50 MB.</p>
            {video ? (
              <div className="mt-5 max-w-2xl">
                <video className="aspect-video w-full rounded-xl bg-black object-contain" controls preload="metadata" src={video} />
                <button
                  className="mt-3 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700"
                  onClick={() => {
                    setVideo("");
                    setHasUnsavedChanges(true);
                  }}
                  type="button"
                >
                  Remove video
                </button>
              </div>
            ) : null}
            <input
              accept="video/mp4,video/webm,video/quicktime"
              className="sr-only"
              onChange={(event) => void uploadFiles(event.target.files, "video")}
              ref={videoInput}
              type="file"
            />
            <button
              className="mt-5 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium transition hover:bg-stone-50"
              onClick={() => videoInput.current?.click()}
              type="button"
            >
              {video ? "Replace video" : "Upload video"}
            </button>
          </section>

          {uploads.length ? (
            <section aria-live="polite" className="rounded-2xl border border-stone-200 bg-white p-5">
              {uploads.map((upload) => (
                <div className="mb-4 last:mb-0" key={upload.name}>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="truncate">{upload.name}</span>
                    <span className="shrink-0 text-stone-500">{upload.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-stone-900 transition-[width]" style={{ width: `${upload.progress}%` }} />
                  </div>
                </div>
              ))}
            </section>
          ) : null}

          {notice ? (
            <p aria-live="polite" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>
          ) : null}
          {error ? (
            <p aria-live="assertive" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
          ) : null}
          <div className="sticky bottom-3 flex flex-col-reverse justify-end gap-3 rounded-2xl border border-stone-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row">
            <Link className="rounded-xl border border-stone-200 px-5 py-3 text-center text-sm font-medium" href="/admin">
              Cancel
            </Link>
            <button
              className="rounded-xl bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaving || uploads.length > 0}
              type="submit"
            >
              {isSaving ? "Publishing..." : isEditing ? "Update & publish" : "Save & publish"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
