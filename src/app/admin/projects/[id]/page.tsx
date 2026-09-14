import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { getProjectById } from "@/lib/db";
import { updateProjectAction } from "../../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const project = getProjectById(Number((await params).id));
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/projects"
        className="text-xs uppercase tracking-[0.2em] text-stone-500"
      >
        ← Projects
      </Link>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
          Edit project
        </p>
        <h1 className="mt-2 text-4xl font-light text-black">{project.name}</h1>
      </div>
      <form
        action={updateProjectAction}
        className="grid gap-5 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <input type="hidden" name="id" value={project.id} />
        <label className="text-sm text-stone-700">
          Project name
          <input
            name="name"
            required
            defaultValue={project.name}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Slug
          <input
            name="slug"
            required
            defaultValue={project.slug}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Category
          <input
            name="category"
            required
            defaultValue={project.category}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Project type
          <input
            name="project_type"
            required
            defaultValue={project.project_type}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Location
          <input
            name="location"
            required
            defaultValue={project.location}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Cover image URL
          <input
            name="cover_image"
            required
            defaultValue={project.cover_image}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Short description
          <textarea
            name="short_description"
            required
            defaultValue={project.short_description}
            rows={2}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Project details
          <textarea
            name="full_description"
            required
            defaultValue={project.full_description}
            rows={5}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Gallery URLs
          <textarea
            name="gallery"
            defaultValue={project.gallery.join("\n")}
            rows={4}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Video URL
          <input
            name="project_video"
            defaultValue={project.project_video}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Area
          <input
            name="area_sqft"
            defaultValue={project.area_sqft ?? ""}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Completion year
          <input
            name="completion_year"
            type="number"
            defaultValue={project.completion_year ?? ""}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Display order
          <input
            name="display_order"
            type="number"
            defaultValue={project.display_order}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          SEO title
          <input
            name="seo_title"
            defaultValue={project.seo_title ?? ""}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          SEO description
          <textarea
            name="seo_description"
            defaultValue={project.seo_description ?? ""}
            rows={2}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          SEO keywords
          <input
            name="seo_keywords"
            defaultValue={project.seo_keywords ?? ""}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <div className="flex items-center gap-5 pt-7 text-sm text-stone-700">
          <label>
            <input
              name="featured"
              type="checkbox"
              defaultChecked={Boolean(project.featured)}
              className="mr-2"
            />{" "}
            Featured
          </label>
          <label>
            <input
              name="published"
              type="checkbox"
              defaultChecked={Boolean(project.published)}
              className="mr-2"
            />{" "}
            Published
          </label>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-sm text-white md:col-span-2"
        >
          Save project
        </button>
      </form>
    </div>
  );
}
