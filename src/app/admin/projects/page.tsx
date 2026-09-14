import { getAllProjects } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import {
  createProjectAction,
  deleteContentAction,
  updateProjectStatusAction,
} from "../actions";

export default async function ProjectsAdminPage() {
  await requireAdminSession();
  const projects = getAllProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
            Projects
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-[-0.05em] text-black">
            Project CMS
          </h1>
        </div>
        <a
          href="#add-project"
          className="rounded-full bg-black px-5 py-2.5 text-sm text-white"
        >
          Add project
        </a>
      </div>

      <form
        id="add-project"
        action={createProjectAction}
        encType="multipart/form-data"
        className="grid gap-5 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <h2 className="text-2xl font-light text-black md:col-span-2">
          Add project
        </h2>
        <label className="text-sm text-stone-700">
          Project title
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
        <label className="text-sm text-stone-700">
          Category
          <select
            name="category"
            defaultValue="Residential"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          >
            <option>Residential</option>
            <option>Commercial</option>
            <option>Hospitality</option>
            <option>Institute</option>
            <option>Luxury</option>
          </select>
        </label>
        <label className="text-sm text-stone-700">
          Project type
          <input
            name="project_type"
            required
            defaultValue="Residential"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Location
          <input
            name="location"
            required
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Short description
          <textarea
            name="short_description"
            required
            rows={2}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Full description
          <textarea
            name="full_description"
            required
            rows={5}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Cover image upload
          <input
            name="cover_image_file"
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm"
          />
        </label>
        <label className="text-sm text-stone-700">
          Or cover image URL
          <input
            name="cover_image"
            type="url"
            placeholder="/images/projects/1.png"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700 md:col-span-2">
          Gallery images
          <input
            name="gallery_files"
            type="file"
            accept="image/*"
            multiple
            className="mt-2 block w-full text-sm"
          />
          <textarea
            name="gallery"
            rows={2}
            placeholder="Optional image URLs, one per line"
            className="mt-3 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Client name
          <input
            name="client_name"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Area
          <input
            name="area_sqft"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Completion year
          <input
            name="completion_year"
            type="number"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          />
        </label>
        <label className="text-sm text-stone-700">
          Project video URL
          <input
            name="project_video"
            type="url"
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
          SEO keywords
          <input
            name="seo_keywords"
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
        <div className="flex items-center gap-5 pt-7 text-sm text-stone-700">
          <label>
            <input name="featured" type="checkbox" className="mr-2" /> Featured
          </label>
          <label>
            <input
              name="published"
              type="checkbox"
              defaultChecked
              className="mr-2"
            />{" "}
            Publish immediately
          </label>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-sm text-white md:col-span-2"
        >
          Save project
        </button>
      </form>

      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black sm:max-w-xs"
            placeholder="Search projects"
          />
          <div className="flex gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
            <span className="rounded-full border border-stone-200 px-3 py-2">
              All
            </span>
            <span className="rounded-full border border-stone-200 px-3 py-2">
              Published
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
              <tr>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Order</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-t border-stone-200 align-top"
                >
                  <td className="py-4 pr-4">
                    <div className="font-medium text-stone-800">
                      <a
                        href={`/admin/projects/${project.id}`}
                        className="hover:underline"
                      >
                        {project.name}
                      </a>
                    </div>
                    <div className="text-xs text-stone-500">{project.slug}</div>
                  </td>
                  <td className="py-4 pr-4 text-stone-700">
                    {project.category}
                  </td>
                  <td className="py-4 pr-4 text-stone-700">
                    {project.location}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${project.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {project.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-stone-700">
                    {project.display_order}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex gap-2">
                      <form action={updateProjectStatusAction}>
                        <input type="hidden" name="id" value={project.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={project.published ? "" : "on"}
                        />
                        <button className="rounded-lg border border-stone-300 px-3 py-1 text-xs">
                          {project.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteContentAction}>
                        <input type="hidden" name="id" value={project.id} />
                        <input type="hidden" name="type" value="project" />
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
