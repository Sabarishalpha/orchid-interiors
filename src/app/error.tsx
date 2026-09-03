"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 text-center text-black">
      <p className="text-xs tracking-[0.3em] text-stone-500 uppercase">ORCHID INTERIORS</p>
      <h1 className="mt-6 text-4xl font-light sm:text-6xl">Something went wrong.</h1>
      <p className="mt-5 max-w-md text-sm leading-7 text-stone-600">
        Please try again. If the problem continues, return to the home page.
      </p>
      <button type="button" onClick={reset} className="mt-8 border border-black bg-black px-6 py-3 text-sm text-white transition-colors hover:bg-white hover:text-black">
        Try again
      </button>
    </main>
  );
}