import { getAllDesignCategories } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import {
  createDesignCategoryAction,
  deleteContentAction,
  updateCategoryStatusAction,
} from "../actions";

export default async function DesignLibraryAdminPage() {
  await requireAdminSession();
  const categories = getAllDesignCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
            Design Library
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-[-0.05em] text-black">
            Categories & items
          </h1>
        </div>
        <a
          href="#add-category"
          className="rounded-full bg-black px-5 py-2.5 text-sm text-white"
        >
          New category
        </a>
      </div>

      <form
        id="add-category"
        action={createDesignCategoryAction}
        encType="multipart/form-data"
        className="grid gap-5 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <h2 className="text-2xl font-light text-black md:col-span-2">
          New design category
        </h2>
        <label className="text-sm text-stone-700">
          Category title
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
          Description
          <textarea
            name="short_description"
            required
            rows={3}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Category image upload
          <input
            name="cover_image_file"
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm"
          />
        </label>
        <label className="text-sm text-stone-700">
          Or category image URL
          <input
            name="cover_image"
            type="url"
            placeholder="/images/projects/1.png"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Design images
          <input
            name="design_image_files"
            type="file"
            accept="image/*"
            multiple
            className="mt-2 block w-full text-sm"
          />
          <textarea
            name="design_images"
            rows={3}
            placeholder="Optional image URLs, one per line"
            className="mt-3 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
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
          Save category and designs
        </button>
      </form>

      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black sm:max-w-xs"
            placeholder="Search design categories"
          />
          <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
              <tr>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Slug</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Order</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-stone-200 align-top"
                >
                  <td className="py-4 pr-4 font-medium text-stone-800">
                    <a
                      href={`/admin/design-library/${category.id}`}
                      className="hover:underline"
                    >
                      {category.name}
                    </a>
                  </td>
                  <td className="py-4 pr-4 text-stone-700">{category.slug}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${category.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {category.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-stone-700">
                    {category.display_order}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex gap-2">
                      <form action={updateCategoryStatusAction}>
                        <input type="hidden" name="id" value={category.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={category.published ? "" : "on"}
                        />
                        <button className="rounded-lg border border-stone-300 px-3 py-1 text-xs">
                          {category.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteContentAction}>
                        <input type="hidden" name="id" value={category.id} />
                        <input type="hidden" name="type" value="category" />
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
