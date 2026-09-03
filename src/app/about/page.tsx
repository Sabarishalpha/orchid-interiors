import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";

const storyTimeline = [
  {
    year: "2014",
    title: "Studio founded",
    text: "Orchid Interiors began with a simple philosophy: design spaces that feel personal, warm and enduring.",
  },
  {
    year: "2017",
    title: "Residential portfolio expands",
    text: "We grew from boutique residential projects into complete lifestyle-focused home transformations.",
  },
  {
    year: "2020",
    title: "Commercial projects added",
    text: "Our expertise broadened into offices, hospitality and thoughtfully designed commercial interiors.",
  },
  {
    year: "2025",
    title: "Multi-city showroom presence",
    text: "We extended our design footprint with a multi-city showroom presence and a stronger nationwide identity.",
  },
];

export const metadata: Metadata = {
  title: "About Our Interior Design Studio",
  description:
    "Meet Orchid Interiors, a thoughtful interior design studio creating refined residential and commercial spaces in Coimbatore and Tamil Nadu.",
};

const teamMembers = [
  {
    name: "Aarav Menon",
    role: "Creative Director",
    focus:
      "Concept, identity and the emotional language of each space.",
  },
  {
    name: "Meera Iyer",
    role: "Design Lead",
    focus:
      "Material palettes, detailing and the rhythm between rooms.",
  },
  {
    name: "Rohan Shah",
    role: "Project Director",
    focus:
      "Planning, coordination and a considered path from brief to handover.",
  },
];

const goals = [
  {
    number: "01",
    title: "Design with purpose",
    text: "Create spaces that make everyday life feel calmer, more useful and more connected.",
  },
  {
    number: "02",
    title: "Make quality visible",
    text: "Choose honest materials, thoughtful details and craftsmanship that rewards a closer look.",
  },
  {
    number: "03",
    title: "Build lasting trust",
    text: "Keep every conversation clear and every project relationship personal from start to finish.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        image="/images/about-1.jpeg"
        imageAlt="Layered living space designed by Orchid Interiors"
      />

      {/* ABOUT INTRO */}
      <About />

      {/* OUR STORY */}
      <section className="relative w-full bg-stone-50 px-4 py-20 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div>
            <div className="mb-12 text-center">
              <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                OUR STORY
              </p>

              <h3 className="mx-auto max-w-3xl text-3xl font-light leading-tight text-black sm:text-4xl lg:text-5xl">
                A studio shaped by thoughtful design and lasting relationships.
              </h3>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {storyTimeline.map((item) => (
                <div
                  key={item.year}
                  className="group rounded-[1.75rem] border border-stone-300 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-black hover:shadow-xl"
                >
                  <p className="mb-5 text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">
                    {item.year}
                  </p>

                  <div className="mb-5 h-px w-8 bg-black transition-all duration-500 group-hover:w-16" />

                  <h4 className="mb-3 text-xl font-light text-black">
                    {item.title}
                  </h4>

                  <p className="text-sm leading-7 text-stone-700">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================
              FOUNDER & CEO
          ========================================================== */}
          <section className="relative mt-28 border-t border-stone-300 pt-20 sm:mt-32 sm:pt-24">
            <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              {/* IMAGE SIDE */}
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute -left-5 -top-5 h-full w-full rounded-[2rem] border border-stone-300 sm:-left-7 sm:-top-7" />

                {/* Main image */}
                <div className="group relative z-10 overflow-hidden rounded-[2rem] bg-stone-200">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/images/founder/founder-main.jpg"
                      alt="Founder and CEO of Orchid Interiors"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Image label */}
                    <div className="absolute bottom-6 left-6">
                      <p className="text-[10px] font-medium tracking-[0.3em] text-white/80 uppercase">
                        ORCHID INTERIORS
                      </p>

                      <p className="mt-2 text-sm text-white">
                        Founder&apos;s vision
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secondary floating image */}
                <div className="absolute -bottom-10 -right-4 z-20 hidden w-36 overflow-hidden rounded-2xl border-4 border-stone-50 shadow-2xl sm:block sm:w-44 md:-right-8">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/images/founder/founder-detail.jpg"
                      alt="Orchid Interiors founder"
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Experience badge */}
                <div className="absolute -bottom-8 left-6 z-30 flex h-24 w-24 items-center justify-center rounded-full bg-black text-center text-white shadow-xl sm:-bottom-10 sm:left-8 sm:h-28 sm:w-28">
                  <div>
                    <p className="text-2xl font-light">10+</p>
                    <p className="mt-1 text-[9px] tracking-[0.15em] text-stone-400 uppercase">
                      Years
                    </p>
                  </div>
                </div>
              </div>

              {/* CONTENT SIDE */}
              <div className="relative">
                <p className="mb-5 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                  FOUNDER & CEO
                </p>

                <h2 className="max-w-2xl text-4xl font-light leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-6xl">
                  Designing with purpose.
                  <br />
                  <span className="text-stone-400">
                    Building with belief.
                  </span>
                </h2>

                <div className="mt-8 h-px w-16 bg-black" />

                <h3 className="mt-8 text-2xl font-light text-black sm:text-3xl">
                  [Founder Name]
                </h3>

                <p className="mt-2 text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">
                  Founder & Chief Executive Officer
                </p>

                <p className="mt-7 max-w-xl text-base leading-8 text-stone-700">
                  Orchid Interiors was built around a simple belief — that
                  beautiful interiors should not only look exceptional, but
                  should also make everyday life better.
                </p>

                <p className="mt-5 max-w-xl text-base leading-8 text-stone-700">
                  With a deep appreciation for architecture, materials and
                  craftsmanship, our founder continues to guide Orchid
                  Interiors with a focus on thoughtful design, honest
                  execution and long-lasting relationships.
                </p>

                {/* Quote */}
                <div className="relative mt-10 max-w-xl border-l border-black pl-6 sm:pl-8">
                  <span className="absolute -left-[6px] -top-3 text-4xl font-serif text-black">
                    “
                  </span>

                  <blockquote className="text-lg font-light leading-8 text-black sm:text-xl">
                    We don&apos;t simply design rooms. We create environments that
                    become part of people&apos;s everyday stories.
                  </blockquote>

                  <p className="mt-4 text-xs tracking-[0.2em] text-stone-500 uppercase">
                    — Founder, Orchid Interiors
                  </p>
                </div>

                {/* Founder stats */}
                <div className="mt-12 grid max-w-xl grid-cols-3 border-t border-stone-300 pt-7">
                  <div>
                    <p className="text-2xl font-light text-black sm:text-3xl">
                      10+
                    </p>
                    <p className="mt-2 text-[10px] tracking-[0.15em] text-stone-500 uppercase">
                      Years
                    </p>
                  </div>

                  <div className="border-l border-stone-300 pl-5 sm:pl-8">
                    <p className="text-2xl font-light text-black sm:text-3xl">
                      250+
                    </p>
                    <p className="mt-2 text-[10px] tracking-[0.15em] text-stone-500 uppercase">
                      Projects
                    </p>
                  </div>

                  <div className="border-l border-stone-300 pl-5 sm:pl-8">
                    <p className="text-2xl font-light text-black sm:text-3xl">
                      05
                    </p>
                    <p className="mt-2 text-[10px] tracking-[0.15em] text-stone-500 uppercase">
                      Cities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              TEAM
          ========================================================== */}
          <div className="mt-32 border-t border-stone-300 pt-20 sm:mt-36 sm:pt-24">
            <div className="mb-12 max-w-2xl">
              <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                THE TEAM
              </p>

              <h3 className="text-3xl font-light leading-tight text-black sm:text-4xl lg:text-5xl">
                A small, thoughtful team with a wide point of view.
              </h3>

              <p className="mt-5 text-base leading-7 text-stone-700">
                Designers, makers and project minds working together to make
                every detail feel intentional.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {teamMembers.map((member) => (
                <article
                  key={member.name}
                  className="group border-t border-black pt-5 transition-all duration-500 hover:pt-7"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs tracking-[0.2em] text-stone-500 uppercase">
                      {member.role}
                    </p>

                    <span className="text-stone-300 transition-colors duration-300 group-hover:text-black">
                      ↗
                    </span>
                  </div>

                  <h4 className="mt-5 text-2xl font-light text-black">
                    {member.name}
                  </h4>

                  <p className="mt-4 text-sm leading-7 text-stone-700">
                    {member.focus}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* =========================================================
              GOALS
          ========================================================== */}
          <div className="mt-28 bg-black px-6 py-12 text-white sm:px-10 lg:mt-36 lg:px-14 lg:py-16">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-400 uppercase">
                  OUR GOALS
                </p>

                <h3 className="max-w-md text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
                  Better spaces, made with intention.
                </h3>

                <p className="mt-6 max-w-sm text-sm leading-7 text-stone-400">
                  Every project is an opportunity to combine beauty,
                  functionality and a deeper sense of belonging.
                </p>
              </div>

              <div className="divide-y divide-white/20">
                {goals.map((goal) => (
                  <div
                    key={goal.number}
                    className="grid gap-4 py-7 first:pt-0 sm:grid-cols-[56px_1fr]"
                  >
                    <p className="text-sm text-stone-400">
                      {goal.number}
                    </p>

                    <div>
                      <h4 className="text-xl font-light text-white sm:text-2xl">
                        {goal.title}
                      </h4>

                      <p className="mt-3 max-w-xl text-sm leading-7 text-stone-300">
                        {goal.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
