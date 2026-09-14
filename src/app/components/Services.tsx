"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { SERVICES } from "../data/services";

type ServiceShape = {
  number: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  gallery: readonly string[];
  detail: string;
};

export default function Services({
  services = SERVICES as readonly ServiceShape[],
}: {
  services?: readonly ServiceShape[];
}) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const interval = window.setInterval(() => {
      const firstCard = carousel.querySelector<HTMLElement>(
        "[data-service-card]",
      );

      if (!firstCard) return;

      const cardDistance = firstCard.offsetWidth + 24;
      const isAtEnd =
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 8;

      carousel.scrollTo({
        left: isAtEnd ? 0 : carousel.scrollLeft + cardDistance,
        behavior: "smooth",
      });
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="services"
      data-services-section
      className="
        relative
        w-full
        overflow-hidden
        bg-stone-50
        px-4
        py-10
        sm:px-6
        sm:py-12
        md:px-8
        md:py-14
        lg:px-12
        lg:py-16
        xl:px-16
      "
    >
      {/* =====================================================
          CONTENT CONTAINER
      ====================================================== */}

      <div className="mx-auto max-w-[1600px]">
        {/* =====================================================
            SECTION INTRODUCTION
        ====================================================== */}

        <div
          className="
            mb-8
            text-center
            sm:mb-10
            md:mb-12
            lg:mb-14
          "
        >
          {/* Label */}

          <p
            data-services-label
            className="
              mb-5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.32em]
              text-stone-600
              sm:mb-6
              sm:text-xs
              md:text-sm
            "
          >
            Our Services
          </p>

          {/* Heading */}

          <h2
            data-services-title
            className="
              mx-auto
              mb-4
              max-w-3xl
              text-4xl
              font-light
              leading-[1.05]
              tracking-[-0.025em]
              text-black
              sm:mb-5
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            Spaces designed around you.
          </h2>

          {/* Description */}

          <p
            data-services-description
            className="
              mx-auto
              max-w-2xl
              text-sm
              leading-7
              text-stone-700
              sm:text-base
              sm:leading-8
              md:text-lg
            "
          >
            From concept to completion, we create considered interiors that
            combine functionality, craftsmanship and timeless design.
          </p>
        </div>

        {/* =====================================================
            SERVICE CARDS
        ====================================================== */}

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Our services"
          >
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                data-service-card
                className="
                w-[calc(100vw-2rem)]
                min-w-[calc(100vw-2rem)]
                snap-start
                group
                relative
                flex
                min-h-0
                flex-col
                overflow-hidden
                border
                border-stone-300
                bg-white
                transition-all
                duration-500
                hover:-translate-y-1
                hover:border-stone-400
                hover:shadow-xl
                sm:w-[calc((100vw-3rem)/2)]
                sm:min-w-[calc((100vw-3rem)/2)]
                lg:w-[calc((100%_-_3rem)/3)]
                lg:min-w-[calc((100%_-_3rem)/3)]
              "
              >
                {/* =================================================
                  SERVICE IMAGE
              ================================================== */}

                <div
                  className="
                  relative
                  h-56
                  w-full
                  overflow-hidden
                  bg-stone-200
                  sm:h-64
                  md:h-72
                  lg:h-80
                  xl:h-80
                "
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                    sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    33vw
                  "
                  />

                  {/* Image Overlay */}

                  <div
                    className="
                    absolute
                    inset-0
                    bg-black/0
                    transition-colors
                    duration-500
                    group-hover:bg-black/5
                  "
                  />
                </div>

                {/* =================================================
                  SERVICE CONTENT
              ================================================== */}

                <div
                  className="
                  flex
                  flex-grow
                  flex-col
                  items-center
                  justify-between
                  px-5
                  py-7
                  text-center
                  sm:px-6
                  sm:py-8
                  lg:px-6
                  lg:py-9
                  xl:px-5
                  xl:py-8
                  2xl:px-6
                  2xl:py-9
                "
                >
                  {/* Top Content */}

                  <div className="flex w-full flex-col items-center">
                    {/* Number */}

                    <span
                      data-service-number
                      className="
                      mb-4
                      text-[10px]
                      font-light
                      tracking-[0.16em]
                      text-stone-500
                      transition-colors
                      duration-300
                      group-hover:text-stone-700
                      sm:text-xs
                    "
                    >
                      {service.number}
                    </span>

                    {/* Title */}

                    <h3
                      data-service-title
                      className="
                      mb-4
                      text-lg
                      font-light
                      leading-tight
                      tracking-[-0.01em]
                      text-black
                      sm:text-xl
                      lg:text-[21px]
                    "
                    >
                      {service.title}
                    </h3>

                    {/* Description */}

                    <p
                      data-service-description
                      className="
                      max-w-[260px]
                      text-xs
                      leading-6
                      text-stone-600
                      sm:text-sm
                      sm:leading-7
                    "
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* =================================================
                    ARROW
                ================================================== */}

                  <div
                    className="
                    mt-7
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-stone-300
                    transition-all
                    duration-500
                    group-hover:border-black
                    group-hover:bg-black
                  "
                  >
                    <ArrowRight
                      data-service-arrow
                      className="
                      h-4
                      w-4
                      text-black
                      transition-all
                      duration-500
                      group-hover:translate-x-0.5
                      group-hover:text-white
                    "
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label="Previous service"
            onClick={() =>
              carouselRef.current?.scrollBy({ left: -360, behavior: "smooth" })
            }
            className="absolute left-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/75 text-white transition-colors hover:bg-black sm:left-7 sm:flex"
          >
            <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next service"
            onClick={() =>
              carouselRef.current?.scrollBy({ left: 360, behavior: "smooth" })
            }
            className="absolute right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/75 text-white transition-colors hover:bg-black sm:right-7 sm:flex"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
