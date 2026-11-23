"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (signInError) {
      setError(
        signInError instanceof Error ? signInError.message : "Could not sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-10">
        <p className="text-xs font-medium tracking-[0.3em] text-stone-500 uppercase">
          Orchid Interiors
        </p>
        <h1 className="mt-5 text-3xl font-light text-stone-950">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Sign in with your administrator username and password.
        </p>

        <form className="mt-8 space-y-5" onSubmit={signIn}>
          <label className="block text-sm text-stone-700" htmlFor="admin-username">
            Username
            <input
              autoComplete="username"
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-base text-stone-950 outline-none focus:border-stone-700"
              id="admin-username"
              onChange={(event) => setUsername(event.target.value)}
              required
              value={username}
            />
          </label>
          <label className="block text-sm text-stone-700" htmlFor="admin-password">
            Password
            <input
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-base text-stone-950 outline-none focus:border-stone-700"
              id="admin-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          <button
            className="w-full rounded-xl bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error ? (
          <p aria-live="assertive" className="mt-5 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <Link className="mt-8 inline-block text-sm text-stone-500 underline underline-offset-4" href="/">
          Return to website
        </Link>
      </section>
    </main>
  );
}
