"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const brands = [
  {
    name: "REHAU",
    logo: "/logos/rehau.jpeg",
  },
  {
    name: "BOSCH",
    logo: "/logos/bosch.jpeg",
  },
  {
    name: "Royale Touche",
    logo: "/logos/royale-touche.jpeg",
  },
  {
    name: "CROMA",
    description: "Decorative Laminates",
    logo: "/logos/croma.jpeg",
  },
  {
    name: "AIROLAM",
    description: "Laminates | Plywood | Panels | Doors",
    logo: "/logos/airolam.jpeg",
  },
  {
    name: "E3 Edge Band",
    logo: "/logos/e3-edge-band.jpeg",
  },
  {
    name: "CenturyPly",
    logo: "/logos/centuryply.jpeg",
  },
  {
    name: "Sharon",
    logo: "/logos/sharon.jpeg",
  },
  {
    name: "Sharon",
    logo: "/logos/blum.svg",
  },
  {
    name: "Godrej",
    logo: "/logos/godrej.jpeg",
  },
  {
    name: "Ebco",
    logo: "/logos/ebco.jpeg",
  },
  {
    name: "Hettich",
    logo: "/logos/hettich.jpeg",
  },
  {
    name: "Blum",
    logo: "/logos/blum.svg",
  },
  {
    name: "Mikasa Ply",
    logo: "/logos/mikasa-ply.png",
  },
  {
    name: "Ozone",
    logo: "/logos/ozone.webp",
  },
  {
    name: "Faber",
    logo: "/logos/faber.avif",
  },
];

function BrandCard({
  brand,
}: {
  brand: (typeof brands)[number];
}) {
  return (
    <div
      className="
        group relative flex h-28 w-[190px] shrink-0
        items-center justify-center
        rounded-2xl border border-black/[0.06]
        bg-white px-7
        transition-all duration-500
        hover:-translate-y-1
        hover:border-black/10
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]
        sm:h-32 sm:w-[230px]
      "
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <Image
          src={brand.logo}
          alt={`${brand.name} logo`}
          width={180}
          height={80}
          className="
            max-h-25 w-auto max-w-[240px]
            object-contain
            opacity-50
            grayscale
            transition-all duration-500
            group-hover:scale-105
            group-hover:opacity-100
            group-hover:grayscale-0
            sm:max-w-[190px]
          "
        />
      </div>

      {brand.description && (
        <div
          className="
            pointer-events-none absolute bottom-2
            left-0 right-0 text-center
            text-[7px] uppercase tracking-[0.12em]
            text-black/30
          "
        >
          {brand.description}
        </div>
      )}
    </div>
  );
}

export default function BrandPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowOneRef = useRef<HTMLDivElement>(null);
  const rowTwoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const rowOne = rowOneRef.current;
    const rowTwo = rowTwoRef.current;

    if (!section || !rowOne || !rowTwo) return;

    const ctx = gsap.context(() => {
      // Initial reveal
      gsap.from(".brand-heading", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      gsap.from(".brand-card", {
        opacity: 0,
        y: 30,
        stagger: 0.04,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });

      // Infinite marquee
      const rowOneWidth = rowOne.scrollWidth / 2;
      const rowTwoWidth = rowTwo.scrollWidth / 2;

      gsap.to(rowOne, {
        x: -rowOneWidth,
        duration: 30,
        ease: "none",
        repeat: -1,
      });

      gsap.fromTo(
        rowTwo,
        {
          x: -rowTwoWidth,
        },
        {
          x: 0,
          duration: 34,
          ease: "none",
          repeat: -1,
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const rowOneBrands = brands.slice(0, 8);
  const rowTwoBrands = brands.slice(8);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f7f7f5] py-24 sm:py-32"
    >
      {/* Header */}
      <div className="brand-heading mx-auto mb-16 max-w-5xl px-6 text-center">
        <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.35em] text-black/45 sm:text-xs">
          Our Brand Partners
        </p>

        <h2 className="text-4xl font-light tracking-[-0.04em] text-black sm:text-6xl lg:text-7xl">
          Trusted by design.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-black/50 sm:text-base">
          We partner with some of the world&apos;s most trusted names to
          deliver uncompromising quality, performance and timeless design.
        </p>
      </div>

      {/* Left fade */}
      <div
        className="
          pointer-events-none absolute
          left-0 top-[250px] z-20 h-[300px] w-16
          bg-gradient-to-r from-[#f7f7f5] to-transparent
          sm:w-32
        "
      />

      {/* Right fade */}
      <div
        className="
          pointer-events-none absolute
          right-0 top-[250px] z-20 h-[300px] w-16
          bg-gradient-to-l from-[#f7f7f5] to-transparent
          sm:w-32
        "
      />

      {/* Row 1 */}
      <div className="mb-5 overflow-hidden">
        <div
          ref={rowOneRef}
          className="flex w-max gap-5 will-change-transform"
        >
          {[...rowOneBrands, ...rowOneBrands].map((brand, index) => (
            <div className="brand-card" key={`${brand.name}-one-${index}`}>
              <BrandCard brand={brand} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="overflow-hidden">
        <div
          ref={rowTwoRef}
          className="flex w-max gap-5 will-change-transform"
        >
          {[...rowTwoBrands, ...rowTwoBrands].map((brand, index) => (
            <div className="brand-card" key={`${brand.name}-two-${index}`}>
              <BrandCard brand={brand} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom statement */}
      <div className="mt-16 px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-black/30">
          Quality materials · Trusted technology · Exceptional craftsmanship
        </p>
      </div>
    </section>
  );
}
