"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";

const testimonials = [
  "We wanted a home that felt calm, practical and entirely our own. The design brought those priorities together beautifully.",
  "From the first conversation to the finishing details, the process felt considered and clear. Every room has a purpose.",
  "Thoughtful materials, clever use of space and a warm, timeless feel — the result reflects the way we live.",
];

export default function Testimonials() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      aria-labelledby="testimonials-title"
      className="relative mt-16 overflow-hidden rounded-[1.75rem] px-5 py-8 text-stone-50 sm:mt-20 sm:px-8 sm:py-12 lg:px-12 lg:py-14"
      style={{ backgroundColor: "#171714" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full border border-white/[0.07]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/[0.07]"
      />
      <div className="relative grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
        <div className="flex h-full flex-col items-start">
          <p className="mb-8 inline-flex items-center gap-3 text-[10px] font-medium tracking-[0.28em] text-stone-400 uppercase sm:text-xs">
            <span className="h-px w-8 bg-stone-500" />
            A note from our clients
          </p>
          <h3
            className="max-w-lg text-4xl font-light leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl"
            id="testimonials-title"
          >
            Spaces that feel{" "}
            <span className="text-stone-400 italic">like yours.</span>
          </h3>
          <p className="mt-6 max-w-sm text-sm leading-7 text-stone-400 sm:text-base">
            Every home has a story. We shape the details around the people who
            live in it.
          </p>
          <div className="mt-auto hidden items-center gap-2 pt-12 text-[10px] tracking-[0.2em] text-stone-500 uppercase lg:flex">
            Discover the Orchid experience
            <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
          </div>
        </div>

        <div className="min-w-0">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 6500, disableOnInteraction: false }}
            loop
            onSwiper={setSwiper}
            onRealIndexChange={(instance) => setActiveIndex(instance.realIndex)}
            className="about-testimonials-swiper"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial}>
                <article
                  className="flex min-h-[310px] flex-col justify-between rounded-2xl p-6 text-stone-950 sm:min-h-[340px] sm:p-9 lg:p-10"
                  style={{ backgroundColor: "#f3f0e9" }}
                >
                  <div className="flex items-center justify-between gap-5">
                    <span className="rounded-full border border-stone-300 px-3 py-1.5 text-[9px] font-medium tracking-[0.18em] text-stone-600 uppercase">
                      Sample review
                    </span>
                    <span className="text-xs tabular-nums tracking-[0.18em] text-stone-500">
                      0{index + 1} <span className="px-1 text-stone-300">/</span>{" "}
                      0{testimonials.length}
                    </span>
                  </div>
                  <div>
                    <Quote
                      aria-hidden="true"
                      className="mb-4 h-8 w-8 fill-stone-300 text-stone-300 sm:mb-5"
                      strokeWidth={1}
                    />
                    <blockquote className="max-w-2xl text-xl font-light leading-8 tracking-[-0.015em] text-stone-900 sm:text-2xl sm:leading-10 lg:text-[1.75rem]">
                      “{testimonial}”
                    </blockquote>
                  </div>
                  <p className="mt-7 border-t border-stone-300 pt-4 text-[9px] font-medium tracking-[0.18em] text-stone-500 uppercase">
                    Placeholder copy · Replace with approved client feedback
                  </p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-5 flex items-center justify-between gap-5">
            <div
              aria-label={`Testimonial ${activeIndex + 1} of ${testimonials.length}`}
              className="h-px flex-1 overflow-hidden bg-white/15"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={testimonials.length}
              aria-valuenow={activeIndex + 1}
            >
              <span
                className="block h-full bg-stone-200 transition-[width] duration-500"
                style={{ width: `${((activeIndex + 1) / testimonials.length) * 100}%` }}
              />
            </div>
            <button
              aria-label="Previous testimonial"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-stone-950"
              onClick={() => swiper?.slidePrev()}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              aria-label="Next testimonial"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-stone-950"
              onClick={() => swiper?.slideNext()}
              type="button"
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
