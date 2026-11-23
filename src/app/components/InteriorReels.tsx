"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef, useState } from "react";

export type InteriorReel = {
  id: string;
  title: string;
};

export default function InteriorReels({
  reels,
}: {
  reels: readonly InteriorReel[];
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeReel, setActiveReel] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector<HTMLElement>("[data-reel-card]");
    carousel.scrollBy({
      left: (card?.offsetWidth ?? 280) * (direction === "left" ? -1 : 1),
      behavior: "smooth",
    });
  };

  if (reels.length === 0) return null;

  return (
    <section className="overflow-hidden bg-[#11110f] px-4 py-16 text-white sm:px-6 md:px-10 md:py-20 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex items-end justify-between gap-5 md:mb-10">
          <div>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
              Orchid Shorts
            </p>
            <h2 className="max-w-3xl text-4xl font-light leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              See the spaces we bring to life.
            </h2>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous reels"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition hover:bg-white hover:text-black"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next reels"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition hover:bg-white hover:text-black"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          aria-label="YouTube Shorts"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
        >
          {reels.map((reel, index) => {
            const isActive = activeReel === reel.id;
            return (
              <article
                key={reel.id}
                data-reel-card
                className="group relative w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-[1.25rem] border border-white/10 bg-black sm:w-[260px] md:w-[280px] lg:w-[300px]"
              >
                <div className="relative aspect-[9/16] w-full bg-stone-900">
                  {isActive ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${reel.id}?autoplay=1&mute=1&rel=0&playsinline=1`}
                      title={reel.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveReel(reel.id)}
                      aria-label={`Play ${reel.title}`}
                      className="absolute inset-0 block h-full w-full"
                    >
                      <Image
                        src={`https://i.ytimg.com/vi/${reel.id}/hq720.jpg`}
                        alt={reel.title}
                        fill
                        priority={index < 2}
                        sizes="(max-width: 640px) 78vw, (max-width: 768px) 260px, 300px"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/35 backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-white group-hover:text-black">
                        <Play className="ml-1 h-5 w-5 fill-current" />
                      </span>
                      <span className="absolute inset-x-0 bottom-0 p-4 text-left">
                        <span className="line-clamp-2 text-sm leading-6 text-white">
                          {reel.title}
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-7 flex justify-center sm:justify-start">
          <a
            href="https://www.youtube.com/@orchid_interiors/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/25 px-5 text-sm text-white transition hover:bg-white hover:text-black"
          >
            View All Shorts
          </a>
        </div>
      </div>
    </section>
  );
}
