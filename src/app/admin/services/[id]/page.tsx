import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { getServiceById } from "@/lib/db";
import { updateServiceAction } from "../../actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const service = getServiceById(Number((await params).id));
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/services"
        className="text-xs uppercase tracking-[0.2em] text-stone-500"
      >
        ← Services
      </Link>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
          Edit service
        </p>
        <h1 className="mt-2 text-4xl font-light text-black">{service.name}</h1>
      </div>
      <form
        action={updateServiceAction}
        className="grid gap-5 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <input type="hidden" name="id" value={service.id} />
        <label className="text-sm text-stone-700">
          Service title
          <input
            name="name"
            required
            defaultValue={service.name}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Slug
          <input
            name="slug"
            required
            defaultValue={service.slug}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Short description
          <textarea
            name="short_description"
            required
            defaultValue={service.short_description}
            rows={2}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Full description
          <textarea
            name="full_description"
            required
            defaultValue={service.full_description}
            rows={5}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Service image URL
          <input
            name="service_image"
            required
            defaultValue={service.service_image}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Display order
          <input
            name="display_order"
            type="number"
            defaultValue={service.display_order}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Gallery URLs
          <textarea
            name="gallery_images"
            defaultValue={service.gallery_images.join("\n")}
            rows={4}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Features
          <textarea
            name="features"
            defaultValue={service.features.join("\n")}
            rows={3}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          CTA text
          <input
            name="cta_text"
            defaultValue={service.cta_text}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          CTA link
          <input
            name="cta_link"
            defaultValue={service.cta_link}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          SEO title
          <input
            name="seo_title"
            defaultValue={service.seo_title ?? ""}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          SEO description
          <textarea
            name="seo_description"
            defaultValue={service.seo_description ?? ""}
            rows={2}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="flex items-center gap-3 pt-7 text-sm text-stone-700">
          <input
            name="published"
            type="checkbox"
            defaultChecked={Boolean(service.published)}
          />{" "}
          Published
        </label>
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-sm text-white md:col-span-2"
        >
          Save service
        </button>
      </form>
    </div>
  );
}
