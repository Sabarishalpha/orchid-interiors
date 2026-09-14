import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-stone-200 bg-[#f7f2ee] p-6 lg:flex">
          <div className="mb-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-stone-500">
              Orchid Interiors
            </p>
            <h1 className="mt-3 text-3xl font-light tracking-[-0.05em] text-black">
              Admin
            </h1>
          </div>

          <nav className="space-y-2 text-sm">
            {[
              ["Projects", "/admin/projects"],
              ["Services", "/admin/services"],
              ["Design Library", "/admin/design-library"],
              ["Statistics", "/admin/statistics"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 transition hover:border-stone-300 hover:bg-white"
              >
                <span>{label}</span>
                <span className="text-stone-400">→</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-stone-200 bg-white p-4">
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="w-full rounded-xl bg-black px-4 py-3 text-sm text-white transition hover:bg-stone-800"
              >
                Logout
              </button>
            </form>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
                  Content Management
                </p>
                <h2 className="mt-1 text-xl font-light text-black">
                  Orchid CMS
                </h2>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-stone-100 px-3 py-2 text-xs text-stone-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Admin Online
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
