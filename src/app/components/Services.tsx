"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

type ServiceShape = {
  slug: string;
  title: string;
  image: string;
  href?: string;
};

export default function Services({
  services,
  layout = "carousel",
  headingLevel = "h2",
  showHeading = true,
}: {
  services: readonly ServiceShape[];
  layout?: "carousel" | "grid";
  headingLevel?: "h1" | "h2";
  showHeading?: boolean;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const Heading = headingLevel;

  useEffect(() => {
    if (layout === "grid") return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const interval = window.setInterval(() => {
      const firstCard = carousel.querySelector<HTMLElement>("[data-service-card]");
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
  }, [layout]);

  return (
    <section
      aria-label={showHeading ? undefined : "Interior design services"}
      aria-labelledby={showHeading ? "services-title" : undefined}
      className="w-full bg-stone-50"
      id="services"
    >
      {showHeading && (
        <div className="px-4 pt-8 pb-14 text-center sm:px-6 sm:pt-10 sm:pb-16 md:px-10 lg:px-16">
          <p className="mb-3 text-[10px] font-medium tracking-[0.3em] text-stone-500 uppercase sm:text-xs">
            Orchid Interiors
          </p>
          <Heading
            className="text-4xl font-light tracking-[-0.04em] text-stone-950 sm:text-5xl lg:text-6xl"
            id="services-title"
          >
            Interior Design Services
          </Heading>
        </div>
      )}

      <div
        className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 sm:pb-16 md:px-10 lg:px-16 lg:pb-20"
      >
        <div className="relative">
          <div
            aria-label="Services"
            className={
              layout === "grid"
                ? "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8"
                : "flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
            }
            ref={carouselRef}
          >
            {services.map((service, index) => {
              const slideClass =
                layout === "grid"
                  ? "min-w-0"
                  : "shrink-0 w-[calc(100vw-2rem)] sm:w-[calc((100vw-3rem)/2)] lg:w-[calc((100%_-_3rem)/3)]";
              const card = (
                <article
                  className="group w-full min-w-0 overflow-hidden bg-white"
                  data-service-card
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-stone-200">
                    <Image
                      alt={service.title}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      fill
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={service.image}
                    />
                  </div>
                  <h2 className="mt-3 px-3 py-5 text-center text-lg font-light tracking-tight text-stone-950 sm:mt-4 sm:py-6 sm:text-xl">
                    {service.title}
                  </h2>
                </article>
              );

              return service.href ? (
                <Link
                  className={`${slideClass} block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900`}
                  href={service.href}
                  key={service.slug}
                >
                  {card}
                </Link>
              ) : (
                <div className={slideClass} key={service.slug}>
                  {card}
                </div>
              );
            })}
          </div>

          {layout === "carousel" && services.length > 1 ? (
            <div className="mt-5 flex justify-end gap-2">
              <button
                aria-label="Previous services"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-stone-800 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white"
                onClick={() =>
                  carouselRef.current?.scrollBy({
                    left: -360,
                    behavior: "smooth",
                  })
                }
                type="button"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                aria-label="Next services"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-stone-800 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white"
                onClick={() =>
                  carouselRef.current?.scrollBy({
                    left: 360,
                    behavior: "smooth",
                  })
                }
                type="button"
              >
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
