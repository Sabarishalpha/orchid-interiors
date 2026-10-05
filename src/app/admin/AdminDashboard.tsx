"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ContentKind } from "@/lib/content-schema";

type ContentItem = {
  id?: number;
  number?: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  images?: string[];
  gallery?: string[];
  video?: string;
  category?: string;
  location?: string;
};

type DashboardContent = Record<ContentKind, ContentItem[]>;

const sections: { kind: ContentKind; label: string; description: string }[] = [
  { kind: "services", label: "Services", description: "Your services and capabilities" },
  { kind: "design-library", label: "Design Library", description: "Room and design collections" },
  { kind: "projects", label: "Projects", description: "Published client work" },
];

const singularLabels: Record<ContentKind, string> = {
  services: "Service",
  "design-library": "Design Library item",
  projects: "Project",
};

function coverImage(item: ContentItem) {
  return item.image || item.images?.[0] || item.gallery?.[0] || "/images/hero-1.png";
}

export default function AdminDashboard({
  initialNotice = "",
  initialContent,
  initialError = "",
}: {
  initialNotice?: string;
  initialContent?: DashboardContent;
  initialError?: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState<DashboardContent | null>(initialContent ?? null);
  const [loading, setLoading] = useState(!initialContent && !initialError);
  const [error, setError] = useState(initialError);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<{ kind: ContentKind; item: ContentItem } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState(initialNotice);

  const loadContent = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const result = (await response.json()) as DashboardContent & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not load website content.");
      setContent(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load website content.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const total = useMemo(
    () => sections.reduce((count, section) => count + (content?.[section.kind].length ?? 0), 0),
    [content],
  );

  async function confirmDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: deleting.kind, slug: deleting.item.slug }),
      });
      const result = (await response.json()) as { error?: string; warning?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not delete this item.");
      setDeleting(null);
      setNotice(
        result.warning
          ? `${deleting.item.title} was deleted. ${result.warning}`
          : `${deleting.item.title} was deleted.`,
      );
      await loadContent();
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Could not delete this item.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function signOut() {
    setError("");
    try {
      const response = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Could not sign out. Please try again.");
      router.replace("/admin/login");
      router.refresh();
    } catch (signOutError) {
      setError(
        signOutError instanceof Error
          ? signOutError.message
          : "Could not sign out. Please try again.",
      );
    }
  }

  const filteredContent = useMemo(() => {
    const query = search.trim().toLowerCase();
    return Object.fromEntries(
      sections.map(({ kind }) => [
        kind,
        (content?.[kind] ?? []).filter(
          (item) =>
            !query ||
            item.title.toLowerCase().includes(query) ||
            item.slug.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query),
        ),
      ]),
    ) as DashboardContent;
  }, [content, search]);

  return (
    <main className="min-h-screen bg-[#f7f6f3] text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-7 lg:px-10">
          <Link href="/" aria-label="Orchid Interiors home" className="flex items-center gap-3">
            <Image
              alt="Orchid Interiors"
              className="h-10 w-auto object-contain"
              height={80}
              priority
              src="/images/logo.png"
              width={220}
            />
            <span className="hidden border-l border-stone-200 pl-3 text-[10px] font-medium tracking-[0.22em] text-stone-500 uppercase sm:inline">
              Studio CMS
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              className="hidden text-sm text-stone-600 transition hover:text-black sm:inline"
              href="/"
            >
              View website
            </Link>
            <button
              className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
              onClick={signOut}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-medium tracking-[0.28em] text-stone-500 uppercase">
              ORCHID INTERIORS / CONTENT STUDIO
            </p>
            <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage the content visitors see across your website.
            </p>
          </div>
          <label className="w-full sm:max-w-xs">
            <span className="sr-only">Search website content</span>
            <input
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search all content..."
              type="search"
              value={search}
            />
          </label>
        </div>

        {error ? (
          <div
            aria-live="assertive"
            className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 sm:flex-row sm:items-center"
          >
            <p>{error}</p>
            <button
              className="w-fit font-medium underline underline-offset-4"
              onClick={() => {
                setLoading(true);
                void loadContent();
              }}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : null}
        {notice ? (
          <p aria-live="polite" className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notice}
          </p>
        ) : null}

        <section aria-label="Dashboard overview" className="mt-8 grid gap-4 sm:grid-cols-3">
          {sections.map((section) => (
            <article
              className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"
              key={section.kind}
            >
              <p className="text-sm text-stone-600">{section.label}</p>
              <p className="mt-3 text-4xl font-light tracking-tight">
                {loading ? <span className="inline-block h-10 w-14 animate-pulse rounded bg-stone-100" /> : content?.[section.kind].length ?? 0}
              </p>
              <p className="mt-2 text-xs text-stone-500">Total items</p>
            </article>
          ))}
        </section>

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium tracking-[0.28em] text-stone-500 uppercase">
              LIBRARY / {loading ? "…" : total} ITEMS
            </p>
            <h2 className="mt-2 text-2xl font-light">Content management</h2>
          </div>
          <span className="hidden text-xs text-stone-500 sm:inline">
            Changes publish directly to the website
          </span>
        </div>

        <div className="mt-6 space-y-7">
          {sections.map((section) => {
            const items = filteredContent[section.kind] ?? [];
            return (
              <section
                aria-labelledby={`section-${section.kind}`}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
                key={section.kind}
              >
                <div className="flex flex-col justify-between gap-4 border-b border-stone-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h3 className="text-lg font-medium" id={`section-${section.kind}`}>
                      {section.label}
                      <span className="ml-2 text-sm font-normal text-stone-500">
                        {loading ? "…" : items.length}
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">{section.description}</p>
                  </div>
                  <Link
                    className="inline-flex w-fit items-center justify-center rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                    href={`/admin/${section.kind}/new`}
                  >
                    Add new
                  </Link>
                </div>
                {loading ? (
                  <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                      <div
                        className="h-44 animate-pulse rounded-xl bg-stone-100"
                        key={item}
                      />
                    ))}
                  </div>
                ) : items.length === 0 ? (
                  <div className="px-5 py-12 text-center sm:px-8">
                    <p className="text-sm text-stone-600">
                      {search ? "No items match your search." : `No ${section.label.toLowerCase()} yet.`}
                    </p>
                    {!search ? (
                      <Link
                        className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
                        href={`/admin/${section.kind}/new`}
                      >
                        Create the first item
                      </Link>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                    {items.map((item) => (
                      <article
                        className="overflow-hidden rounded-xl border border-stone-200 bg-white"
                        key={item.slug}
                      >
                        <div className="relative aspect-[16/9] bg-stone-100">
                          <Image
                            alt=""
                            className="object-cover"
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            src={coverImage(item)}
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-medium">{item.title}</h4>
                              <p className="mt-1 truncate text-xs text-stone-500">
                                /{section.kind}/{item.slug}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-800">
                              Published
                            </span>
                          </div>
                          <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-stone-600">
                            {item.description}
                          </p>
                          <div className="mt-4 flex gap-2">
                            <Link
                              className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-center text-xs font-medium transition hover:bg-stone-50"
                              href={`/admin/${section.kind}/${encodeURIComponent(item.slug)}`}
                            >
                              Edit
                            </Link>
                            <button
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50"
                              onClick={() => setDeleting({ kind: section.kind, item })}
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {deleting ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) setDeleting(null);
          }}
        >
          <section
            aria-labelledby="delete-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
            role="dialog"
          >
            <p className="text-[10px] font-medium tracking-[0.25em] text-red-700 uppercase">
              Destructive action
            </p>
            <h2 className="mt-3 text-xl font-medium" id="delete-title">
              Delete {singularLabels[deleting.kind]}?
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              You are deleting <strong className="font-medium text-stone-900">{deleting.item.title}</strong>.
              This removes it from the public website and cannot be undone.
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button
                className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium"
                disabled={isDeleting}
                onClick={() => setDeleting(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                disabled={isDeleting}
                onClick={() => void confirmDelete()}
                type="button"
              >
                {isDeleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
