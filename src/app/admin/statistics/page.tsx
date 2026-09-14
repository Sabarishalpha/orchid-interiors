import { requireAdminSession } from "@/lib/auth";
import { getSiteStatistics } from "@/lib/db";
import { updateStatisticsAction } from "../actions";

const fields = [
  ["yearsExperience", "Years of experience"],
  ["projectsCompleted", "Projects completed"],
  ["clientFocused", "Client focused percentage"],
  ["awardsWon", "Awards won"],
  ["trusted", "Trusted percentage"],
] as const;

export default async function StatisticsAdminPage() {
  await requireAdminSession();
  const statistics = getSiteStatistics();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
          Website statistics
        </p>
        <h1 className="mt-2 text-4xl font-light tracking-[-0.05em] text-black">
          Count / Statistics
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-stone-600">
          Update the numbers shown in the public About section and homepage.
        </p>
      </div>
      <form
        action={updateStatisticsAction}
        className="grid gap-5 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        {fields.map(([name, label]) => (
          <label key={name} className="text-sm text-stone-700">
            {label}
            <input
              name={name}
              type="number"
              min="0"
              required
              defaultValue={statistics[name]}
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
            />
          </label>
        ))}
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-sm text-white sm:col-span-2"
        >
          Save statistics
        </button>
      </form>
    </div>
  );
}
