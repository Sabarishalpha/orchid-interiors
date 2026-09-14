import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { getAllDesignItemsByCategory, getDesignCategoryById } from "@/lib/db";
import { reorderDesignItemsAction, updateCategoryAction } from "../../actions";

export default async function EditDesignCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const id = Number((await params).id);
  const category = getDesignCategoryById(id);
  if (!category) notFound();
  const items = getAllDesignItemsByCategory(id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/design-library"
        className="text-xs uppercase tracking-[0.2em] text-stone-500"
      >
        ← Design library
      </Link>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
          Edit category
        </p>
        <h1 className="mt-2 text-4xl font-light text-black">{category.name}</h1>
      </div>
      <form
        action={updateCategoryAction}
        className="grid gap-5 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <input type="hidden" name="id" value={category.id} />
        <label className="text-sm text-stone-700">
          Category title
          <input
            name="name"
            required
            defaultValue={category.name}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Slug
          <input
            name="slug"
            required
            defaultValue={category.slug}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Cover image URL
          <input
            name="cover_image"
            required
            defaultValue={category.cover_image}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Display order
          <input
            name="display_order"
            type="number"
            defaultValue={category.display_order}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Description
          <textarea
            name="short_description"
            required
            defaultValue={category.short_description}
            rows={3}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          SEO title
          <input
            name="seo_title"
            defaultValue={category.seo_title ?? ""}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          SEO description
          <textarea
            name="seo_description"
            defaultValue={category.seo_description ?? ""}
            rows={2}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="flex items-center gap-3 pt-7 text-sm text-stone-700">
          <input
            name="published"
            type="checkbox"
            defaultChecked={Boolean(category.published)}
          />{" "}
          Published
        </label>
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-sm text-white md:col-span-2"
        >
          Save category
        </button>
      </form>
      <form
        action={reorderDesignItemsAction}
        className="space-y-4 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="category_id" value={category.id} />
        <h2 className="text-2xl font-light text-black">
          Gallery order and primary image
        </h2>
        <p className="text-sm text-stone-600">
          Enter the image IDs in the desired order, separated by commas. Choose
          one ID as the primary image.
        </p>
        <input
          name="ordered_ids"
          required
          defaultValue={items.map((item) => item.id).join(", ")}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
        />
        <input
          name="primary_id"
          required
          type="number"
          defaultValue={
            items.find((item) => item.featured)?.id ?? items[0]?.id ?? 0
          }
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="border border-stone-200 p-3">
              <p className="text-xs text-stone-500">ID {item.id}</p>
              <div className="relative mt-2 aspect-square">
                <Image
                  src={item.main_image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-sm text-white"
        >
          Save gallery order
        </button>
      </form>
    </div>
  );
}
