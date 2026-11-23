"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useConsultationModal } from "./ConsultationModalProvider";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Hero carousel images
const HERO_IMAGES = [
  "/images/hero.jpeg",
  "/images/heroo.jpeg",
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
];

export default function Hero() {
  const { openModal } = useConsultationModal();

  return (
    <section
      id="hero"
      className="relative isolate min-h-screen w-full overflow-hidden bg-black"
    >
      {/* =========================
          BACKGROUND CAROUSEL
      ========================== */}
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            el: ".swiper-pagination",
          }}
          loop
          className="h-full w-full"
        >
          {HERO_IMAGES.map((imagePath, index) => (
            <SwiperSlide key={index} className="relative h-full w-full">
              <Image
                src={imagePath}
                alt={`Luxury Orchid Interiors interior design ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/25" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Main dark overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Left radial light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_30%)]" />

        {/* Right dark gradient for form */}
        <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-black/50 via-black/10 to-transparent lg:w-3/4" />
      </div>

      {/* =========================
          HERO CONTENT
      ========================== */}
      <div className="relative z-10 mx-auto flex min-h-[82vh] w-full max-w-7xl items-center px-4 pb-14 pt-24 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_450px]">
          {/* =====================
              LEFT CONTENT
          ====================== */}
          <div className="max-w-[700px] text-left">
            <p
              data-hero-label
              className="mb-8 text-sm font-medium tracking-[0.32em] text-white/80 sm:text-base md:text-lg"
            >
              ORCHID INTERIORS
            </p>

            <h1 className="mb-6 max-w-2xl text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Interior design for the way you live.
            </h1>

            <p
              data-hero-description
              className="max-w-xl text-sm leading-7 text-white/75 sm:text-base md:text-lg"
            >
              Thoughtfully designed interiors that bring together architecture,
              comfort and timeless elegance.
            </p>

            <div className="mt-10">
              <button
                type="button"
                onClick={openModal}
                data-hero-cta
                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium tracking-[0.04em] text-black transition-all duration-300 hover:bg-black hover:text-white sm:px-8 sm:py-4 sm:text-base"
              >
                Talk to an Expert
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          SCROLL INDICATOR
      ========================== */}
      <div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium tracking-[0.32em] text-white/70 md:flex"
      >
        <span>SCROLL</span>

        <span aria-hidden="true" className="text-base leading-none">
          ↓
        </span>
      </div>

      {/* =========================
          SWIPER PAGINATION
      ========================== */}
      <div className="swiper-pagination absolute bottom-24 left-1/2 z-20 -translate-x-1/2" />
    </section>
  );
}
