"use client";

import Link from "next/link";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

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
        <div className="grid items-stretch gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div className="flex max-w-3xl flex-col items-start text-left">
            {/* Main Heading */}
            <h2
              data-about-title
              className="mb-6 max-w-3xl text-4xl font-light leading-tight text-black sm:text-5xl md:text-6xl"
            >
              Your space has a story.
              <br />
              Let&apos;s design it well.
            </h2>

            {/* Description */}
            <p
              data-about-description
              className="mb-7 max-w-3xl text-base leading-8 text-stone-700 sm:text-lg md:text-xl"
            >
              A home should feel like yours in every detail: the way it reflects
              your lifestyle, the way your kitchen works, how your storage fits
              your needs and how each room welcomes you at the end of the day.
            </p>

            <p className="mb-8 max-w-3xl text-base leading-8 text-stone-700 sm:text-lg md:text-xl">
              Since 2017, Orchid Modular Interiors has been designing and
              creating practical, beautiful spaces for homes and businesses. We
              bring design, manufacturing and installation together, with our
              own fully automated factory supporting the manufacturing behind
              every finished interior.
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

          {/* Right Video */}
          <div
            data-about-video
            className="relative w-full overflow-hidden rounded-lg bg-stone-200"
          >
            <div className="relative aspect-video w-full lg:aspect-auto lg:h-full">
              <iframe
                src="https://www.youtube.com/embed/FerrUBGbAfg?si=vsuAqqlzx7vSbW8U"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
              />
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
