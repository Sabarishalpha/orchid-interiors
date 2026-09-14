"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// About carousel images
const ABOUT_CAROUSEL_IMAGES = [
  "/images/about-1.jpeg",
  "/images/about-2.jpeg",
  "/images/about-3.jpeg",
  "/images/about-4.jpeg",
];

type AboutStatistics = {
  yearsExperience: number;
  projectsCompleted: number;
  clientFocused: number;
  awardsWon: number;
  trusted: number;
};

export default function About({
  statistics = {
    yearsExperience: 10,
    projectsCompleted: 800,
    clientFocused: 100,
    awardsWon: 25,
    trusted: 100,
  },
}: {
  statistics?: AboutStatistics;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  return (
    <section
      id="about"
      className="relative w-full bg-stone-50 px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-14 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Label */}
        <p
          data-about-label
          className="mb-6 text-sm font-medium tracking-[0.32em] text-stone-600 sm:text-base md:text-lg"
        ></p>

        {/* Main Layout - Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-start">
            {/* Main Heading */}
            <h2
              data-about-title
              className="mb-6 max-w-lg text-4xl font-light leading-tight text-black sm:text-5xl md:text-6xl"
            >
              Designing spaces
              <br />
              with purpose.
            </h2>

            {/* Description */}
            <p
              data-about-description
              className="mb-7 max-w-lg text-base leading-8 text-stone-700 sm:text-lg md:text-xl"
            >
              At Orchid Interiors, we create thoughtful spaces that balance
              architecture, functionality and timeless beauty.
            </p>

            <p className="mb-8 max-w-lg text-base leading-8 text-stone-700 sm:text-lg md:text-xl">
              Every project is shaped around the people who experience it,
              combining refined materials, intelligent planning and a distinct
              sense of identity.
            </p>

            {/* CTA */}
            <Link
              href="/services"
              data-about-cta
              className="group inline-flex items-center gap-2 text-sm font-medium text-black transition-opacity duration-300 hover:opacity-60 md:text-base"
            >
              Discover Our Approach
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          {/* Right Image Carousel */}
          <div
            data-about-image
            className="relative w-full overflow-hidden rounded-lg"
          >
            <div
              className="relative w-full mb-8"
              style={{ aspectRatio: "26 / 18" }}
            >
              <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  el: ".about-swiper-pagination",
                }}
                loop
                className="h-full w-full"
              >
                {ABOUT_CAROUSEL_IMAGES.map((imagePath, index) => (
                  <SwiperSlide key={index} className="relative h-full w-full">
                    <Image
                      src={imagePath}
                      alt={`Orchid Interiors interior design ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Pagination Dots */}
              <div className="about-swiper-pagination absolute bottom-4 left-1/2 z-10 -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div
          ref={ref}
          data-about-stats
          className="mt-10 border-t border-stone-300 pt-8 sm:mt-12 md:mt-14 md:pt-10"
        >
          {/* Statistics Heading */}
          <h3 className="mb-6 text-center text-3xl font-light text-black sm:mb-7 sm:text-4xl md:mb-8 md:text-5xl">
            The Measure of Excellence
          </h3>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:gap-8 lg:gap-12">
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left md:items-center md:text-center">
              <div className="mb-3 text-4xl font-light text-black sm:text-5xl">
                {inView ? (
                  <>
                    <CountUp end={statistics.yearsExperience} duration={2.5} />
                    <span className="text-3xl sm:text-4xl">+</span>
                  </>
                ) : (
                  <>
                    0<span className="text-3xl sm:text-4xl">+</span>
                  </>
                )}
              </div>
              <p className="text-xs font-medium tracking-[0.1em] text-stone-600 sm:text-sm">
                YEARS OF EXPERIENCE
              </p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left md:items-center md:text-center">
              <div className="mb-3 text-4xl font-light text-black sm:text-5xl">
                {inView ? (
                  <>
                    <CountUp
                      end={statistics.projectsCompleted}
                      duration={2.5}
                    />
                    <span className="text-3xl sm:text-4xl">+</span>
                  </>
                ) : (
                  <>
                    0<span className="text-3xl sm:text-4xl">+</span>
                  </>
                )}
              </div>
              <p className="text-xs font-medium tracking-[0.1em] text-stone-600 sm:text-sm">
                PROJECTS COMPLETED
              </p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left md:items-center md:text-center">
              <div className="mb-3 text-4xl font-light text-black sm:text-5xl">
                {inView ? (
                  <>
                    <CountUp end={statistics.clientFocused} duration={2.5} />
                    <span className="text-3xl sm:text-4xl">%</span>
                  </>
                ) : (
                  <>
                    0<span className="text-3xl sm:text-4xl">%</span>
                  </>
                )}
              </div>
              <p className="text-xs font-medium tracking-[0.1em] text-stone-600 sm:text-sm">
                CLIENT FOCUSED
              </p>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left md:items-center md:text-center">
              <div className="mb-3 text-4xl font-light text-black sm:text-5xl">
                {inView ? (
                  <>
                    <CountUp end={statistics.awardsWon} duration={2.5} />
                    <span className="text-3xl sm:text-4xl">+</span>
                  </>
                ) : (
                  <>
                    0<span className="text-3xl sm:text-4xl">+</span>
                  </>
                )}
              </div>
              <p className="text-xs font-medium tracking-[0.1em] text-stone-600 sm:text-sm">
                AWARDS WON
              </p>
            </div>

            {/* Stat 5 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left md:items-center md:text-center">
              <div className="mb-3 text-4xl font-light text-black sm:text-5xl">
                {inView ? (
                  <>
                    <CountUp end={statistics.trusted} duration={2.5} />
                    <span className="text-3xl sm:text-4xl">%</span>
                  </>
                ) : (
                  <>
                    0<span className="text-3xl sm:text-4xl">%</span>
                  </>
                )}
              </div>
              <p className="text-xs font-medium tracking-[0.1em] text-stone-600 sm:text-sm">
                Trusted
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
