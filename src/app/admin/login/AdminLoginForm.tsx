"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not request a sign-in code.");
      setCodeSent(true);
      setMessage(result.message ?? "Check your email for a sign-in code.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not request a sign-in code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not verify the sign-in code.");
      router.replace("/admin");
      router.refresh();
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Could not verify the sign-in code.",
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
          {codeSent
            ? "Enter the six-digit code sent to your authorized email address."
            : "Sign in securely with a one-time code sent to your authorized email address."}
        </p>

        {codeSent ? (
          <form className="mt-8 space-y-5" onSubmit={verifyCode}>
            <label className="block text-sm text-stone-700" htmlFor="admin-code">
              Sign-in code
              <input
                autoComplete="one-time-code"
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-base tracking-[0.3em] text-stone-950 outline-none focus:border-stone-700"
                id="admin-code"
                inputMode="numeric"
                maxLength={6}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                pattern="[0-9]{6}"
                required
                value={code}
              />
            </label>
            <button
              className="w-full rounded-xl bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || code.length !== 6}
              type="submit"
            >
              {isSubmitting ? "Verifying..." : "Verify and continue"}
            </button>
            <button
              className="w-full text-sm text-stone-600 underline underline-offset-4"
              disabled={isSubmitting}
              onClick={() => {
                setCodeSent(false);
                setCode("");
                setError("");
                setMessage("");
              }}
              type="button"
            >
              Use a different email or request a new code
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={requestCode}>
            <label className="block text-sm text-stone-700" htmlFor="admin-email">
              Email address
              <input
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-base text-stone-950 outline-none focus:border-stone-700"
                id="admin-email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <button
              className="w-full rounded-xl bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Sending code..." : "Send sign-in code"}
            </button>
          </form>
        )}

        {message ? (
          <p aria-live="polite" className="mt-5 text-sm text-stone-600">
            {message}
          </p>
        ) : null}
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
