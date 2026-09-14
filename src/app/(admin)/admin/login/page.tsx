"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(result.error ?? "Unable to sign in.");
      setBusy(false);
      return;
    }
    router.replace("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-6 py-16 text-stone-900">
      <div className="w-full max-w-md border border-stone-300 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
          Orchid Interiors
        </p>
        <h1 className="mt-5 text-4xl font-light">Admin Login</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Sign in to manage the content shown on the website.
        </p>
        <form className="mt-9 space-y-5" onSubmit={submit}>
          <label className="block text-sm">
            Username
            <input
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="mt-2 w-full border border-stone-300 px-3 py-3 outline-none focus:border-black"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full border border-stone-300 px-3 py-3 outline-none focus:border-black"
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            disabled={busy}
            className="w-full bg-black px-4 py-3 text-sm text-white transition hover:bg-stone-800 disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
