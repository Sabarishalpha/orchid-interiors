"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to authenticate.");
      return;
    }

    router.replace("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f0eb] px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(28,25,23,0.08)]">
        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-stone-500">
            Orchid Interiors
          </p>
          <h1 className="mt-3 text-4xl font-light tracking-[-0.05em] text-black">
            Admin Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm text-stone-700"
            >
              Email or username
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm((current) => ({ ...current, username: e.target.value }))
              }
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-black outline-none transition focus:border-black"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-stone-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((current) => ({ ...current, password: e.target.value }))
              }
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-black outline-none transition focus:border-black"
              placeholder="••••••••"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
