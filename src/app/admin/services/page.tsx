import { getAllServices } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import {
  createServiceAction,
  deleteContentAction,
  updateServiceStatusAction,
} from "../actions";

export default async function ServicesAdminPage() {
  await requireAdminSession();
  const services = getAllServices();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
            Services
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-[-0.05em] text-black">
            Service CMS
          </h1>
        </div>
        <a
          href="#add-service"
          className="rounded-full bg-black px-5 py-2.5 text-sm text-white"
        >
          Add service
        </a>
      </div>

      <form
        id="add-service"
        action={createServiceAction}
        encType="multipart/form-data"
        className="grid gap-5 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <h2 className="text-2xl font-light text-black md:col-span-2">
          Add service
        </h2>
        <label className="text-sm text-stone-700">
          Service title
          <input
            name="name"
            required
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Slug (optional)
          <input
            name="slug"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Subtitle / short description
          <textarea
            name="short_description"
            required
            rows={2}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Full service content
          <textarea
            name="full_description"
            required
            rows={5}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Service image upload
          <input
            name="service_image_file"
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm"
          />
        </label>
        <label className="text-sm text-stone-700">
          Or image URL
          <input
            name="service_image"
            type="url"
            placeholder="/images/services.jpg"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Additional gallery images
          <input
            name="gallery_image_files"
            type="file"
            accept="image/*"
            multiple
            className="mt-2 block w-full text-sm"
          />
          <textarea
            name="gallery_images"
            rows={2}
            placeholder="Optional image URLs, one per line"
            className="mt-3 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Features
          <textarea
            name="features"
            required
            rows={3}
            placeholder="One feature per line"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          CTA text
          <input
            name="cta_text"
            required
            defaultValue="Book a consultation"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          CTA link
          <input
            name="cta_link"
            required
            defaultValue="/contact"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          SEO title
          <input
            name="seo_title"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          SEO description
          <textarea
            name="seo_description"
            rows={2}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Display order
          <input
            name="display_order"
            type="number"
            defaultValue="0"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="flex items-center gap-3 pt-7 text-sm text-stone-700">
          <input name="published" type="checkbox" defaultChecked /> Publish
          immediately
        </label>
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-sm text-white md:col-span-2"
        >
          Save service
        </button>
      </form>

      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black sm:max-w-xs"
            placeholder="Search services"
          />
          <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Published only
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
              <tr>
                <th className="pb-3 pr-4">Service</th>
                <th className="pb-3 pr-4">Slug</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Order</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-t border-stone-200 align-top"
                >
                  <td className="py-4 pr-4 font-medium text-stone-800">
                    <a
                      href={`/admin/services/${service.id}`}
                      className="hover:underline"
                    >
                      {service.name}
                    </a>
                  </td>
                  <td className="py-4 pr-4 text-stone-700">{service.slug}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${service.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {service.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-stone-700">
                    {service.display_order}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex gap-2">
                      <form action={updateServiceStatusAction}>
                        <input type="hidden" name="id" value={service.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={service.published ? "" : "on"}
                        />
                        <button className="rounded-lg border border-stone-300 px-3 py-1 text-xs">
                          {service.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteContentAction}>
                        <input type="hidden" name="id" value={service.id} />
                        <input type="hidden" name="type" value="service" />
                        <button className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-700">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
