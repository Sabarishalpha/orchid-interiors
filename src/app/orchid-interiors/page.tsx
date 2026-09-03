"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import InstantEstimate from "../components/InstantEstimate";

const projects = [
  [
    "01",
    "Modern Elegance",
    "3 BHK apartment",
    "Coimbatore · 2,100 sq.ft",
    "/images/projects/1.png",
  ],
  [
    "02",
    "Quiet Geometry",
    "Contemporary home",
    "Coimbatore · Residential",
    "/images/projects/2.jpeg",
  ],
  [
    "03",
    "Material & Light",
    "Turnkey interior",
    "Tamil Nadu · Residential",
    "/images/projects/3.jpeg",
  ],
] as const;

const reels = [
  [
    "Home",
    "A feeling of calm, layered through light, material and proportion.",
    "/videos/home-reel.mp4",
  ],
  [
    "Kitchen",
    "Thoughtful functionality with a refined, considered finish.",
    "/videos/kitchen-reel.mp4",
  ],
  [
    "Living Room",
    "Everyday spaces where character, comfort and connection meet.",
    "/videos/living-room-reel.mp4",
  ],
] as const;

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "InteriorDesignBusiness",
  name: "Orchid Interiors",
  description:
    "Premium residential, commercial and turnkey interior design solutions in Coimbatore and Tamil Nadu.",
  email: "hello@orchidinteriors.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  areaServed: ["Coimbatore", "Tamil Nadu"],
};

function track(event: string) {
  if (typeof window !== "undefined") {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.(
      "event",
      event,
    );
  }
}

function CampaignNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-5 sm:px-8 lg:px-12">
        <Link
          href="/orchid-interiors"
          aria-label="Orchid Interiors home"
          className="inline-flex w-44 items-center rounded-full border border-white/45 bg-white/20 px-5 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:w-52 sm:px-6"
        >
          <Image
            src="/images/logo.png"
            alt="Orchid Interiors"
            width={220}
            height={62}
            priority
            className="h-auto w-full object-contain"
          />
        </Link>
      </div>
    </header>
  );
}

export default function OrchidInteriorsLandingPage() {
  return (
    <main className="bg-white pb-16 text-black lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <CampaignNav />

      <section
        className="relative overflow-hidden bg-black text-white"
        aria-labelledby="landing-title"
      >
        <Image
          src="/images/hero-1.png"
          alt="Refined Orchid Interiors living space"
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/65" />
        <div className="relative mx-auto grid min-h-[850px] max-w-7xl items-end gap-12 px-5 pb-14 pt-32 sm:px-8 sm:pb-20 lg:grid-cols-[1fr_430px] lg:items-center lg:px-12 lg:pb-10">
          <div className="max-w-2xl">
            <p className="mb-6 text-xs tracking-[0.3em] text-white/70 uppercase">
              Premium interior design for modern living
            </p>
            <h1
              id="landing-title"
              className="max-w-xl text-6xl leading-[0.9] font-light sm:text-8xl"
            >
              Beautiful spaces.
              <br />
              Better living.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              From concept to completion, we create thoughtful interiors
              designed around your lifestyle, space and vision.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#estimate"
                onClick={() => track("estimate_opened")}
                className="inline-flex items-center gap-3 bg-white px-6 py-4 text-sm text-black transition-colors hover:bg-white/80"
              >
                Get instant estimate <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#process"
                className="inline-flex items-center border-b border-white/60 px-1 py-4 text-sm text-white"
              >
                How it works
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/65">
              <span>
                <Check className="mr-2 inline h-3 w-3 text-white" />
                Personalised design
              </span>
              <span>
                <Check className="mr-2 inline h-3 w-3 text-white" />
                Transparent process
              </span>
              <span>
                <Check className="mr-2 inline h-3 w-3 text-white" />
                End-to-end execution
              </span>
            </div>
          </div>
          <InstantEstimate />
        </div>
      </section>

      <section
        className="border-b border-black/15 bg-white"
        aria-label="Studio promises"
      >
        <div className="mx-auto grid max-w-7xl divide-y divide-black/15 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
          {[
            "Designed around you",
            "Built with detail",
            "One team, one responsibility",
          ].map((item) => (
            <div
              key={item}
              className="py-6 text-center text-xs tracking-[0.18em] uppercase"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section
        id="reels"
        className="bg-white px-5 py-20 sm:px-8 md:py-28 lg:px-12"
        aria-labelledby="reels-title"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.25em] text-black/50 uppercase">
            The studio reel
          </p>
          <h2
            id="reels-title"
            className="mt-5 max-w-3xl text-5xl leading-[0.95] font-light sm:text-7xl"
          >
            See the detail.
            <br />
            Feel the space.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-black/60">
            Materials, movement and small decisions. Step inside the details
            that turn an interior from a room into your place.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {reels.map(([title, text, video], index) => (
              <article key={title} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <video
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    controls
                    controlsList="nodownload"
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-label={`${title} interior design reel`}
                  >
                    <source src={video} type="video/mp4" />
                  </video>
                  <span className="absolute left-4 top-4 bg-black/55 px-3 py-2 text-[10px] tracking-[0.2em] text-white uppercase">
                    0{index + 1} · {title}
                  </span>
                </div>
                <p className="mt-4 max-w-sm text-sm leading-6 text-black/60">
                  {text}
                </p>
              </article>
            ))}
          </div>
          <a
            href="#estimate"
            className="mt-12 inline-flex items-center bg-black px-6 py-4 text-sm text-white"
          >
            Start your project <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      <section
        className="bg-black px-5 py-20 text-white sm:px-8 md:py-28 lg:px-12"
        aria-labelledby="projects-title"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs tracking-[0.25em] text-white/60 uppercase">
                Selected work
              </p>
              <h2
                id="projects-title"
                className="mt-5 max-w-2xl text-5xl leading-[0.95] font-light sm:text-7xl"
              >
                Spaces that speak
                <br />
                for themselves.
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 border-b border-white/40 pb-2 text-sm"
            >
              View all projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {projects.map(([number, name, type, detail, image]) => (
              <Link href="/projects" key={number} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src={image}
                    alt={`${name} interior design project`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                </div>
                <div className="relative -mt-20 p-5">
                  <p className="text-xs text-white/55">{number}</p>
                  <h3 className="mt-3 text-2xl font-light">{name}</h3>
                  <p className="mt-2 text-xs text-white/60">
                    {type}
                    <br />
                    {detail}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 border-t border-white/15 pt-8">
            <p className="text-sm text-white/65">Want something like this?</p>
            <a
              href="#estimate"
              className="mt-3 inline-flex items-center gap-2 text-white"
            >
              Get your instant estimate <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="process"
        className="bg-white px-5 py-20 sm:px-8 md:py-28 lg:px-12"
        aria-labelledby="process-title"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.25em] text-black/50 uppercase">
            From idea to handover
          </p>
          <h2
            id="process-title"
            className="mt-5 max-w-2xl text-5xl leading-[0.95] font-light sm:text-7xl"
          >
            A clear process.
            <br />A considered result.
          </h2>
          <div className="mt-14 grid gap-0 border-t border-black/20 md:grid-cols-4">
            {[
              [
                "01",
                "Consultation",
                "Understand your needs, lifestyle and vision.",
              ],
              ["02", "Design", "Shape the concept and finalize every detail."],
              [
                "03",
                "Execution",
                "Manage materials, manufacturing and installation.",
              ],
              [
                "04",
                "Handover",
                "A finished space ready for the life inside it.",
              ],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="border-b border-black/20 py-7 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
              >
                <p className="text-xs text-black/50">{number}</p>
                <h3 className="mt-8 text-2xl font-light">{title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-black/60">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black px-5 py-20 text-white sm:px-8 md:py-28 lg:px-12">
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.25em] text-white/60 uppercase">
            Ready when you are
          </p>
          <h2 className="mt-5 max-w-3xl text-5xl leading-[0.95] font-light sm:text-7xl">
            Your home deserves
            <br />a thoughtful plan.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
            Tell us a little about your space. We&apos;ll help you understand
            the possibilities and the right next step.
          </p>
          <a
            href="#estimate"
            className="mt-9 inline-flex items-center gap-3 bg-white px-6 py-4 text-sm text-black"
          >
            Get my instant estimate <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="bg-black px-5 py-12 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm tracking-[0.28em] uppercase">
              Orchid Interiors
            </p>
            <p className="mt-5 text-sm text-white/55">
              Interior Design · Turnkey Interiors
            </p>
          </div>
          <div>
            <p className="text-sm text-white/75">
              Coimbatore, Tamil Nadu, India
            </p>
            <a
              href="mailto:hello@orchidinteriors.com"
              className="mt-3 block text-sm text-white/55 hover:text-white"
            >
              hello@orchidinteriors.com
            </a>
          </div>
          <div>
            <a
              href="#estimate"
              className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" /> Start a conversation
            </a>
          </div>
          <div className="text-sm text-white/45 lg:text-right">
            © 2026 Orchid Interiors.
            <br />
            All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
