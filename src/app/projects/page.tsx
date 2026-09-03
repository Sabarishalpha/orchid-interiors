import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import Footer from "../components/Footer";
import Link from "next/link";
import PageHeader from "../components/PageHeader";

const projectProcess = [
  {
    title: "Discovery",
    text: "We begin by understanding your lifestyle, preferences and functional goals for the space.",
  },
  {
    title: "Concept Design",
    text: "We translate your brief into moodboards, layouts and material directions that reflect the right mood.",
  },
  {
    title: "Realisation",
    text: "From execution planning to final styling, we ensure every detail is carefully delivered.",
  },
];

const projectReasons = [
  { value: "45+", label: "Homes transformed" },
  { value: "12", label: "Design languages explored" },
  { value: "Tailored", label: "Project-first approach" },
];

export const metadata: Metadata = {
  title: "Interior Design Projects",
  description:
    "Explore selected residential, commercial, modern and luxury interior design projects by Orchid Interiors.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        image="/images/projects/1.png"
        imageAlt="Interior design project by Orchid Interiors"
      />
      <Projects />

      <section className="relative w-full bg-stone-50 px-4 py-20 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="mb-4 text-center lg:col-span-3">
              <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                HOW WE DESIGN
              </p>
              <h3 className="text-3xl font-light text-black sm:text-4xl">
                A design journey built around your vision.
              </h3>
            </div>

            {projectProcess.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[2rem] border border-stone-300 bg-white p-6 sm:p-7"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-medium text-white">
                  0{index + 1}
                </div>
                <h4 className="mb-3 text-xl font-light text-black">{step.title}</h4>
                <p className="text-sm leading-7 text-stone-700">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[2rem] bg-black px-6 py-10 text-white sm:px-8 lg:px-10 lg:py-12">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr] lg:items-center">
              <div>
                <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-300 uppercase">
                  WHY CLIENTS CHOOSE US
                </p>
                <h3 className="text-3xl font-light text-white sm:text-4xl">
                  Each project is shaped around how you live and what you value.
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {projectReasons.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-white/15 bg-white/5 p-5"
                  >
                    <p className="mb-3 text-2xl font-light text-white">{item.value}</p>
                    <p className="text-sm leading-6 text-stone-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 rounded-[2rem] border border-stone-300 bg-white px-6 py-10 text-center sm:px-8 lg:px-12 lg:py-14">
            <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
              START YOUR PROJECT
            </p>
            <h3 className="mx-auto max-w-2xl text-3xl font-light text-black sm:text-4xl">
              Let’s create a space that feels personal, refined and beautifully lived in.
            </h3>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-700">
              Share your vision with our team and we’ll help shape a design concept that fits your lifestyle and ambitions.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center border border-black bg-black px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
              >
                Book a Consultation
              </a>
              <Link
                href="/services"
                className="inline-flex items-center justify-center border border-stone-300 bg-transparent px-7 py-3 text-sm font-medium text-black transition-all duration-300 hover:border-black hover:bg-stone-100"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
