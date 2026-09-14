import { requireAdminSession } from "@/lib/auth";

export default async function SettingsAdminPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
          Settings
        </p>
        <h1 className="mt-2 text-4xl font-light tracking-[-0.05em] text-black">
          Site settings
        </h1>
      </div>

      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-stone-700">
              Site name
            </label>
            <input
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none focus:border-black"
              defaultValue="Orchid Interiors"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-stone-700">
              Primary email
            </label>
            <input
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none focus:border-black"
              defaultValue="hello@orchidinteriors.com"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button className="rounded-full bg-black px-5 py-2.5 text-sm text-white">
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
