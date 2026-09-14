"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
};
type Content = Record<Kind, Item[]>;
const empty: Content = { projects: [], services: [], designLibrary: [] };
const getImages = (item?: Item) => item?.images ?? item?.gallery ?? [];

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<Content>(empty);
  const [kind, setKind] = useState<Kind>("projects");
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

    void loadInitialContent();
    return () => {
      cancelled = true;
    };
  }, [router]);
  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.replace("/admin/login");
  }
  if (loading)
    return (
      <main className="min-h-screen bg-stone-100 p-8 text-stone-600">
        Loading admin panel...
      </main>
    );

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 text-stone-900 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-stone-300 pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              Orchid Interiors
            </p>
            <h1 className="mt-3 text-4xl font-light">Admin Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="self-start border border-stone-400 px-4 py-2 text-xs uppercase tracking-[0.18em] hover:border-black hover:bg-white sm:self-auto"
          >
            Sign out
          </button>
        </header>
        <section className="grid gap-3 py-8 sm:grid-cols-3">
          {tabs.map((tab) => (
            <div
              key={tab}
              className="border border-stone-300 bg-white px-5 py-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Total{" "}
                {tab === "designLibrary" ? "Design Library Categories" : tab}
              </p>
              <p className="mt-3 text-4xl font-light">{content[tab].length}</p>
            </div>
          ))}
        </section>
        <section className="border border-stone-300 bg-white">
          <nav className="flex overflow-x-auto border-b border-stone-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setKind(tab);
                  setSelected("");
                  setStatus("");
                }}
                className={`whitespace-nowrap px-5 py-4 text-sm ${kind === tab ? "border-b-2 border-black text-black" : "text-stone-500"}`}
              >
                {tab === "designLibrary" ? "Design Library" : tab}
              </button>
            ))}
          </nav>
          <div className="grid gap-8 p-5 lg:grid-cols-[260px_1fr] lg:p-8">
            <aside>
              <button
                onClick={() => setSelected("")}
                className="mb-4 w-full bg-black px-4 py-3 text-left text-sm text-white"
              >
                + Add new
              </button>
              <div className="space-y-1">
                {content[kind].map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => setSelected(item.slug)}
                    className={`block w-full border px-3 py-3 text-left text-sm ${selected === item.slug ? "border-black bg-stone-100" : "border-transparent hover:border-stone-300"}`}
                  >
                    <span className="block text-xs text-stone-500">
                      {item.number}
                    </span>
                    <span className="mt-1 block">{item.title}</span>
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
                setStatus("Deleted. The public page no longer shows this content.");
                setError("");
                await load();
              }}
            />
          </div>
        </section>
        {status ? (
          <p className="mt-4 text-sm text-green-800">{status}</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
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
    if (!item || !window.confirm(`Delete "${item.title}"? This removes it from the public website.`)) {
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
