import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Footer from "../components/Footer";
import Link from "next/link";
import PageHeader from "../components/PageHeader";

const processSteps = [
  {
    title: "Consultation",
    text: "We begin with a detailed conversation to understand your space, goals, lifestyle and budget.",
  },
  {
    title: "Design & Planning",
    text: "Our team develops the concept, layouts, material palette and detailed design direction for approval.",
  },
  {
    title: "Execution & Styling",
    text: "We coordinate procurement, installation and finishing touches to deliver a cohesive, liveable result.",
  },
];

const valuePoints = [
  { value: "360°", label: "Project understanding" },
  { value: "100%", label: "Customized layouts" },
  { value: "End-to-end", label: "Execution support" },
];

export const metadata: Metadata = {
  title: "Interior Design Services",
  description:
    "Explore Orchid Interiors services including residential interiors, commercial design, space planning, custom furniture and turnkey execution.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        image="/images/services.jpg"
        imageAlt="Refined residential interior designed by Orchid Interiors"
      />
      <Services />

      <section className="relative w-full bg-stone-50 px-4 py-20 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mt-0 grid gap-10 lg:grid-cols-3">
            <div className="mb-4 text-center lg:col-span-3">
              <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                HOW WE WORK
              </p>
              <h3 className="text-3xl font-light text-black sm:text-4xl">
                A clear process from first brief to final styling.
              </h3>
            </div>

            {processSteps.map((step, index) => (
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
                  Thoughtful design, delivered with clarity.
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {valuePoints.map((item) => (
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

          <div className="mt-20">
            <div className="mb-8 text-center">
              <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                FEATURED STYLING NOTES
              </p>
              <h3 className="text-3xl font-light text-black sm:text-4xl">
                Design details that shape the feeling of a home.
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Material palette",
                  text: "Warm woods, natural stones and tactile finishes that ground a space with depth and character.",
                },
                {
                  title: "Lighting mood",
                  text: "Layered lighting to create softness, drama and a sense of atmosphere across day and night.",
                },
                {
                  title: "Space planning",
                  text: "Thoughtful layouts that make every room feel effortless, balanced and beautifully functional.",
                },
              ].map((note) => (
                <div
                  key={note.title}
                  className="rounded-[1.75rem] border border-stone-300 bg-white p-6 text-left"
                >
                  <p className="mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-stone-500">
                    Studio note
                  </p>
                  <h4 className="mb-3 text-xl font-light text-black">{note.title}</h4>
                  <p className="text-sm leading-7 text-stone-700">{note.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 rounded-[2rem] border border-stone-300 bg-white px-6 py-10 text-center sm:px-8 lg:px-12 lg:py-14">
            <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
              START YOUR PROJECT
            </p>
            <h3 className="mx-auto max-w-2xl text-3xl font-light text-black sm:text-4xl">
              Let’s shape a home or workspace that feels distinctly yours.
            </h3>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-700">
              Share your brief, timeline and vision. We’ll guide you through the next steps with a tailored design approach.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center border border-black bg-black px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
              >
                Book a Consultation
              </a>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center border border-stone-300 bg-transparent px-7 py-3 text-sm font-medium text-black transition-all duration-300 hover:border-black hover:bg-stone-100"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
