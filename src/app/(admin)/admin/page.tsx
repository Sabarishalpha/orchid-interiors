"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FileDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Plus,
  ExternalLink,
  Settings2,
  Users,
} from "lucide-react";

const tabs = ["projects", "services", "designLibrary"] as const;
type Kind = (typeof tabs)[number];
type Item = {
  number: string;
  slug: string;
  title: string;
  category?: string;
  location?: string;
  description?: string;
  detail?: string;
  image?: string;
  gallery?: string[];
  images?: string[];
  video?: string;
  published?: boolean;
};
type Content = Record<Kind, Item[]>;
type Stats = {
  visitors: number;
  brochureDownloads: number;
  pageViews: number;
  projectViews: number;
  serviceViews: number;
  designLibraryViews: number;
  lastSevenDays: Array<{ label: string; views: number; visitors: number }>;
  topPages: Array<{ path: string; views: number }>;
  recentActivity: Array<{ type: string; path: string; createdAt: string }>;
  analytics: Array<{
    label: string;
    visitors: number;
    pageViews: number;
    downloads: number;
  }>;
  changes: {
    visitors: number | null;
    pageViews: number | null;
    downloads: number | null;
  };
};
type AnalyticsRange = "today" | "7d" | "30d" | "3m" | "1y";
const empty: Content = { projects: [], services: [], designLibrary: [] };
const emptyStats: Stats = {
  visitors: 0,
  brochureDownloads: 0,
  pageViews: 0,
  projectViews: 0,
  serviceViews: 0,
  designLibraryViews: 0,
  lastSevenDays: [],
  topPages: [],
  recentActivity: [],
  analytics: [],
  changes: { visitors: null, pageViews: null, downloads: null },
};
const getImages = (item?: Item) => item?.images ?? item?.gallery ?? [];
const labels: Record<Kind, string> = {
  projects: "Projects",
  services: "Services",
  designLibrary: "Design Library",
};

function pageName(path: string) {
  if (path === "/") return "Home";
  return path
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    )
    .join(" / ");
}

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<Content>(empty);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [kind, setKind] = useState<Kind>("projects");
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyticsRange, setAnalyticsRange] = useState<AnalyticsRange>("30d");
  const active = content[kind].find((item) => item.slug === selected);

  async function load() {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }
    if (!response.ok) {
      setError("Unable to load content.");
      setLoading(false);
      return;
    }
    setContent((await response.json()) as Content);
    setLoading(false);
  }
  useEffect(() => {
    let cancelled = false;

    async function loadInitialContent() {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      if (cancelled) return;
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) {
        setError("Unable to load content.");
        setLoading(false);
        return;
      }
      setContent((await response.json()) as Content);
      setLoading(false);
    }

    async function loadInitialStats() {
      const response = await fetch(`/api/admin/stats?range=${analyticsRange}`, {
        cache: "no-store",
      });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!cancelled && response.ok) setStats((await response.json()) as Stats);
    }

    void loadInitialContent();
    void loadInitialStats();
    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/admin/stats?range=${analyticsRange}`, {
        cache: "no-store",
      });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (response.ok) setStats((await response.json()) as Stats);
    }, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [analyticsRange, router]);
  if (loading)
    return (
      <main className="min-h-screen bg-stone-100 p-8 text-stone-600">
        Loading admin panel...
      </main>
    );

  const maxSeriesValue = Math.max(
    ...stats.analytics.flatMap((point) => [
      point.visitors,
      point.pageViews,
      point.downloads,
    ]),
    1,
  );
  const cards = [
    {
      label: "Total projects",
      value: content.projects.length,
      icon: FolderKanban,
      tone: "bg-amber-50 text-amber-800",
      change: null,
    },
    {
      label: "Total services",
      value: content.services.length,
      icon: Settings2,
      tone: "bg-sky-50 text-sky-800",
      change: null,
    },
    {
      label: "Design categories",
      value: content.designLibrary.length,
      icon: LayoutDashboard,
      tone: "bg-emerald-50 text-emerald-800",
      change: null,
    },
    {
      label: "Unique visitors",
      value: stats.visitors,
      icon: Users,
      tone: "bg-violet-50 text-violet-800",
      change: stats.changes.visitors,
    },
    {
      label: "Brochure downloads",
      value: stats.brochureDownloads,
      icon: FileDown,
      tone: "bg-rose-50 text-rose-800",
      change: stats.changes.downloads,
    },
  ];
  const chartPoints = (key: "visitors" | "pageViews" | "downloads") =>
    stats.analytics
      .map((point, index) => {
        const x =
          stats.analytics.length > 1
            ? (index / (stats.analytics.length - 1)) * 1000
            : 500;
        const y = 220 - (point[key] / maxSeriesValue) * 190;
        return `${x},${y}`;
      })
      .join(" ");

  const selectKind = (nextKind: Kind) => {
    setKind(nextKind);
    setSelected("");
    setStatus("");
  };

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.replace("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f5f3ef] text-stone-900">
      <div className="min-h-screen">
        <header className="border-b border-stone-200 bg-[#f5f3ef]/90 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-375 items-center justify-between">
            <Image
              src="/images/logo.png"
              alt="Orchid Interiors"
              width={170}
              height={56}
              className="h-auto w-32 object-contain"
              priority
            />
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-xs font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-375 space-y-8 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map(({ label, value, icon: Icon, tone, change }) => (
              <div
                key={label}
                className="border border-stone-200 bg-white p-5 shadow-[0_8px_30px_rgba(54,48,38,0.04)]"
              >
                <div className="flex items-start justify-between">
                  <p className="max-w-32 text-xs uppercase tracking-[0.12em] text-stone-500">
                    {label}
                  </p>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}
                  >
                    <Icon size={17} />
                  </span>
                </div>
                <p className="mt-6 text-3xl font-light tracking-tight">
                  {value.toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-stone-400">
                  {change === null
                    ? "Current published total"
                    : `${change >= 0 ? "↑" : "↓"} ${Math.abs(change)}% vs previous period`}
                </p>
              </div>
            ))}
          </section>
          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="border border-stone-200 bg-white p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Audience activity
                  </p>
                  <h2 className="mt-2 text-2xl font-light">
                    Website analytics
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 text-[11px] text-stone-500">
                    <span className="h-2 w-2 rounded-full bg-[#24423b]" />{" "}
                    Visitors{" "}
                    <span className="h-2 w-2 rounded-full bg-[#c59f70]" /> Page
                    views <span className="h-2 w-2 rounded-full bg-[#9b8bc3]" />{" "}
                    Downloads
                  </div>
                  <select
                    value={analyticsRange}
                    onChange={(event) =>
                      setAnalyticsRange(event.target.value as AnalyticsRange)
                    }
                    className="border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 outline-none"
                  >
                    <option value="today">Today</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="3m">3 Months</option>
                    <option value="1y">1 Year</option>
                  </select>
                </div>
              </div>
              <div className="mt-7 overflow-x-auto">
                <svg
                  viewBox="0 0 1000 250"
                  className="h-56 min-w-[620px] w-full"
                  role="img"
                  aria-label="Website visitors, page views, and brochure downloads"
                >
                  <path
                    d="M0 220H1000 M0 125H1000 M0 30H1000"
                    stroke="#ebe7e0"
                    strokeWidth="1"
                  />
                  <polyline
                    points={chartPoints("visitors")}
                    fill="none"
                    stroke="#24423b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={chartPoints("pageViews")}
                    fill="none"
                    stroke="#c59f70"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={chartPoints("downloads")}
                    fill="none"
                    stroke="#9b8bc3"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex justify-between text-[10px] text-stone-400">
                  {stats.analytics
                    .filter(
                      (_, index) =>
                        index === 0 ||
                        index === stats.analytics.length - 1 ||
                        index === Math.floor(stats.analytics.length / 2),
                    )
                    .map((point) => (
                      <span key={point.label}>{point.label}</span>
                    ))}
                </div>
              </div>
            </div>
            <div className="border border-stone-200 bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Top pages
                  </p>
                  <h2 className="mt-2 text-2xl font-light">Most visited</h2>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-stone-500 hover:text-stone-900"
                >
                  View site <ExternalLink size={12} />
                </a>
              </div>
              <div className="mt-6 divide-y divide-stone-100">
                {stats.topPages.length ? (
                  stats.topPages.map((page) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between gap-4 py-3 text-sm"
                    >
                      <span className="truncate text-stone-700">
                        {pageName(page.path)}
                      </span>
                      <span className="shrink-0 text-stone-500">
                        {page.views.toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-sm text-stone-400">
                    Page activity will appear here as visitors browse the site.
                  </p>
                )}
              </div>
            </div>
          </section>
          <section className="border border-stone-200 bg-white">
            <div className="flex flex-col justify-between gap-4 border-b border-stone-200 p-5 sm:flex-row sm:items-center sm:p-7">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  Content management
                </p>
                <h2 className="mt-2 text-2xl font-light">
                  Manage your website
                </h2>
              </div>
              <button
                onClick={() => setSelected("")}
                className="inline-flex items-center justify-center gap-2 bg-stone-900 px-4 py-3 text-sm text-white transition hover:bg-stone-700"
              >
                <Plus size={17} /> Add{" "}
                {kind === "designLibrary" ? "category" : kind.slice(0, -1)}
              </button>
            </div>
            <nav className="flex overflow-x-auto border-b border-stone-200 px-5 sm:px-7">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => selectKind(tab)}
                  className={`whitespace-nowrap border-b-2 px-1 py-4 mr-6 text-sm ${kind === tab ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400"}`}
                >
                  {labels[tab]}
                </button>
              ))}
            </nav>
            <div className="grid gap-8 p-5 lg:grid-cols-[280px_1fr] lg:p-7">
              <aside>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                    {labels[kind]}{" "}
                    <span className="text-stone-300">
                      ({content[kind].length})
                    </span>
                  </p>
                  <span className="text-xs text-stone-400">
                    {
                      content[kind].filter((item) => item.published !== false)
                        .length
                    }{" "}
                    live
                  </span>
                </div>
                <div className="max-h-115 space-y-1 overflow-y-auto pr-1">
                  {content[kind].map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => setSelected(item.slug)}
                      className={`block w-full border px-3 py-3 text-left text-sm ${selected === item.slug ? "border-stone-900 bg-stone-100" : "border-transparent hover:border-stone-200"}`}
                    >
                      <span className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-stone-400">
                        <span>{item.number}</span>
                        <span
                          className={
                            item.published === false
                              ? "text-amber-700"
                              : "text-emerald-700"
                          }
                        >
                          {item.published === false ? "Draft" : "Published"}
                        </span>
                      </span>
                      <span className="mt-2 block truncate">{item.title}</span>
                    </button>
                  ))}
                </div>
              </aside>
              <Editor
                kind={kind}
                item={active}
                onSaved={async (slug) => {
                  setSelected(slug);
                  setStatus("Saved. The public page now uses this content.");
                  setError("");
                  await load();
                }}
                onError={(message) => {
                  setError(message);
                  setStatus("");
                }}
                onDeleted={async () => {
                  setSelected("");
                  setStatus(
                    "Deleted. The public page no longer shows this content.",
                  );
                  setError("");
                  await load();
                }}
              />
            </div>
          </section>
          {status ? <p className="text-sm text-emerald-800">{status}</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      </div>
    </main>
  );
}

function Editor({
  kind,
  item,
  onSaved,
  onError,
  onDeleted,
}: {
  kind: Kind;
  item?: Item;
  onSaved: (slug: string) => Promise<void>;
  onError: (message: string) => void;
  onDeleted: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const existing = getImages(item);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    form.set("kind", kind);
    form.set(
      "existingGallery",
      JSON.stringify(kind === "designLibrary" ? existing.slice(1) : existing),
    );
    form.set(
      "existingMainImage",
      kind === "designLibrary" ? (existing[0] ?? "") : (item?.image ?? ""),
    );
    form.set("existingVideo", item?.video ?? "");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      body: form,
    });
    const result = (await response.json()) as { error?: string; slug?: string };
    setSaving(false);
    if (!response.ok || !result.slug) {
      onError(result.error ?? "Unable to save content.");
      return;
    }
    await onSaved(result.slug);
  }

  async function deleteItem() {
    if (
      !item ||
      !window.confirm(
        `Delete "${item.title}"? This removes it from the public website.`,
      )
    ) {
      return;
    }

    setDeleting(true);
    const response = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, slug: item.slug }),
    });
    const result = (await response.json()) as { error?: string };
    setDeleting(false);
    if (!response.ok) {
      onError(result.error ?? "Unable to delete content.");
      return;
    }
    await onDeleted();
  }
  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
          {item ? "Edit" : "Add"}{" "}
          {kind === "designLibrary" ? "category" : kind.slice(0, -1)}
        </p>
        <h2 className="mt-2 text-3xl font-light">
          {item?.title ?? "New entry"}
        </h2>
      </div>
      <input type="hidden" name="slug" defaultValue={item?.slug ?? ""} />
      <label className="block text-sm">
        Title
        <input
          required
          name="title"
          defaultValue={item?.title ?? ""}
          className="mt-2 w-full border border-stone-300 px-3 py-3 outline-none focus:border-black"
        />
      </label>
      {kind === "projects" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            Category
            <select
              required
              name="category"
              defaultValue={item?.category ?? "Residential"}
              className="mt-2 w-full border border-stone-300 bg-white px-3 py-3"
            >
              <option>Residential</option>
              <option>Commercial</option>
              <option>Hospitality</option>
              <option>Institute</option>
              <option>Luxury</option>
            </select>
          </label>
          <label className="block text-sm">
            Location
            <input
              required
              name="location"
              defaultValue={item?.location ?? ""}
              className="mt-2 w-full border border-stone-300 px-3 py-3"
            />
          </label>
        </div>
      ) : null}
      <label className="block text-sm">
        Description
        <textarea
          required
          name="description"
          defaultValue={item?.description ?? item?.detail ?? ""}
          rows={5}
          className="mt-2 w-full resize-y border border-stone-300 px-3 py-3 outline-none focus:border-black"
        />
      </label>
      <label className="flex cursor-pointer items-center gap-3 border border-stone-200 bg-stone-50 px-4 py-3 text-sm">
        <input
          name="published"
          value="true"
          type="checkbox"
          defaultChecked={item?.published !== false}
          className="h-4 w-4 accent-stone-900"
        />
        <span>
          <span className="block">Published</span>
          <span className="mt-1 block text-xs text-stone-500">
            Published items are visible on the public website.
          </span>
        </span>
      </label>
      <label className="block text-sm">
        Main image
        <input
          required={!item}
          name="mainImage"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="mt-2 block w-full border border-stone-300 px-3 py-3 text-sm"
        />
        <span className="mt-2 block text-xs text-stone-500">
          JPG, PNG, WEBP or AVIF. Maximum 1GB per image and 1GB per save.
        </span>
      </label>
      <label className="block text-sm">
        Additional images
        <input
          name="galleryImages"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="mt-2 block w-full border border-stone-300 px-3 py-3 text-sm"
        />
      </label>
      <label className="block text-sm">
        Video
        <input
          name="video"
          type="file"
          accept="video/mp4,video/quicktime,.mp4,.mov"
          className="mt-2 block w-full border border-stone-300 px-3 py-3 text-sm"
        />
        <span className="mt-2 block text-xs text-stone-500">
          MP4 or MOV. Maximum 1GB per video and 1GB per save.
        </span>
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          disabled={saving || deleting}
          type="submit"
          className="bg-black px-6 py-3 text-sm text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : item ? "Save changes" : "Create entry"}
        </button>
        {item ? (
          <button
            disabled={saving || deleting}
            type="button"
            onClick={deleteItem}
            className="border border-red-700 px-6 py-3 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
