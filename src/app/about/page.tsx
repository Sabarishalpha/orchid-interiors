import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";

const storyTimeline = [
  {
    year: "2015",
    title: "A thoughtful beginning",
    text: "Orchid Modular Interiors began with a simple idea: to create long-lasting interiors that look beautiful, work hard every day and feel right for the people who use them.",
  },
  {
    year: "Early 2017",
    title: "Our first services",
    text: "We began with modular kitchens, wardrobes and related interior solutions. As we grew, we expanded into bedrooms and living spaces, creating designs to suit each family’s needs, style and budget.",
  },
  {
    year: "Mid-2017",
    title: "Our own automated factory",
    text: "We established our own fully automated factory, giving us greater control over modular furniture production. It helps us manufacture from approved designs with precision and achieve consistent finishes.",
  },
  {
    year: "2018",
    title: "A new experience centre in Tirupur",
    text: "Orchid has established its fully equipped, modern experience centre in Tirupur, giving customers a place to explore design ideas, materials and complete residential and commercial interior solutions.",
  },
  {
    year: "Late 2018",
    title: "Complete turnkey interiors",
    text: "We expanded our services to execute complete turnkey interiors, from flooring to lighting and interior works, for a more connected project experience across residential and commercial needs.",
  },
  {
    year: "2019",
    title: "Interiors for businesses",
    text: "Orchid stepped into a new vision: creating tailor-made interior solutions for offices, workspaces, institutions and all types of commercial needs.",
  },
  {
    year: "2026",
    title: "A growing vision",
    text: "We expanded our modern experience centre “VESTA” by Orchid Interiors in Coimbatore and Gobichettipalayam, to provide premium living experiences.",
  },
];

export const metadata: Metadata = {
  title: "About Orchid Interiors",
  description:
    "Learn about Orchid Interiors, our residential and commercial design approach, our team and our creative process.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: "About Orchid Interiors",
    description:
      "Learn about Orchid Interiors, our residential and commercial design approach, our team and our creative process.",
    url: "/about",
    images: [{ url: "/images/about-1.jpeg", alt: "Orchid Interiors studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Orchid Interiors",
    description:
      "Learn about Orchid Interiors, our residential and commercial design approach, our team and our creative process.",
    images: ["/images/about-1.jpeg"],
  },
};

const teamMembers = [
  {
    name: "Aarav Menon",
    role: "Creative Director",
    focus: "Concept, identity and the emotional language of each space.",
  },
  {
    name: "Meera Iyer",
    role: "Design Lead",
    focus: "Material palettes, detailing and the rhythm between rooms.",
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
        title="About Orchid Interiors"
      />

      {/* ABOUT INTRO */}
      <About />

      {/* OUR STORY */}
      <section className="relative w-full bg-stone-50 px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div>
            <div className="mb-8 text-left">
              <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                OUR STORY
              </p>

              <h3 className="max-w-3xl text-3xl font-light leading-tight text-black sm:text-4xl lg:text-5xl">
                Built on thoughtful design.
                <br />
                Growing with every new idea.
              </h3>
            </div>

            <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <section className="relative mt-14 border-t border-stone-300 pt-12 sm:mt-16 sm:pt-16">
            <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
              {/* IMAGE SIDE */}
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute -left-5 -top-5 h-full w-full rounded-[2rem] border border-stone-300 sm:-left-7 sm:-top-7" />

                {/* Main image */}
                <div className="group relative z-10 overflow-hidden rounded-[2rem] bg-stone-200">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/images/founder/saravanan.png"
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
                      src="/images/founder/saravanan.png"
                      alt="Orchid Interiors founder"
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Experience badge */}
              </div>

              {/* CONTENT SIDE */}
              <div className="relative">
                <p className="mb-5 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                  Managing Director
                </p>

                <h2 className="max-w-2xl text-4xl font-light leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-6xl">
                  A vision.
                  <br />
                  <span className="text-stone-400">Built with experience.</span>
                </h2>

                <div className="mt-8 h-px w-16 bg-black" />

                <h3 className="mt-8 text-2xl font-light text-black sm:text-3xl">
                  Mr. Saravanan (D.T.Tech), MD
                </h3>

                <p className="mt-2 text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">
                  Managing Director
                </p>

                <p className="mt-7 max-w-xl text-base leading-8 text-stone-700">
                  Mr. Saravanan, Sasikumar and Aravindhan, established Orchid
                  Modular Interiors in 2017 and continue to lead the company
                  together.
                </p>

                <p className="mt-5 max-w-xl text-base leading-8 text-stone-700">
                  With more than 40 years of business experience across several
                  areas of the textile industry, Mr. Saravanan saw how factory
                  manufacturing could simplify interior work and deliver more
                  consistent quality. He brought that idea to life by setting up
                  Orchid’s fully equipped modular furniture factory. The
                  standards he established for in-house manufacturing helped
                  Orchid build its reputation as a trusted interiors company.
                </p>

                {/* Founder stats */}
              </div>
            </div>
          </section>

          <section className="relative mt-14 border-t border-stone-300 pt-12 sm:mt-16 sm:pt-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              {/* IMAGE SIDE */}
              <div className="relative lg:order-2">
                {/* Decorative background */}
                <div className="absolute -left-5 -top-5 h-full w-full rounded-[2rem] border border-stone-300 sm:-left-7 sm:-top-7" />

                {/* Main image */}
                <div className="group relative z-10 overflow-hidden rounded-[2rem] bg-stone-200">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/images/founder/sasi.png"
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
                      src="/images/founder/sasi.png"
                      alt="Orchid Interiors founder"
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Experience badge */}
              </div>

              {/* CONTENT SIDE */}
              <div className="relative lg:order-1">
                <p className="mb-5 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                  DIRECTOR
                </p>

                <h2 className="max-w-2xl text-4xl font-light leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-6xl">
                  Experience built on site.
                  <br />
                  <span className="text-stone-400">
                    Precision in every detail.
                  </span>
                </h2>

                <div className="mt-8 h-px w-16 bg-black" />

                <h3 className="mt-8 text-2xl font-light text-black sm:text-3xl">
                  Mr. Sasikumar (B.E. Civil Engineering, MBA)
                </h3>

                <p className="mt-2 text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">
                  Director
                </p>

                <p className="mt-7 max-w-xl text-base leading-8 text-stone-700">
                  Sasikumar, brings more than 13 years of experience in civil
                  and interior projects. In his earlier work, he planned and
                  executed projects using manual fabrication, working directly
                  with carpenters and site teams. His civil engineering
                  background and practical site experience helped turn his
                  father’s manufacturing vision into a turnkey interior service
                  that coordinates project planning, factory production and
                  on-site installation.
                </p>

                {/* Founder stats */}
              </div>
            </div>
          </section>

          <section className="relative mt-14 border-t border-stone-300 pt-12 sm:mt-16 sm:pt-16">
            <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
              {/* IMAGE SIDE */}
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute -left-5 -top-5 h-full w-full rounded-[2rem] border border-stone-300 sm:-left-7 sm:-top-7" />

                {/* Main image */}
                <div className="group relative z-10 overflow-hidden rounded-[2rem] bg-stone-200">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/images/founder/aravindhan.png"
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
                      src="/images/founder/aravindhan.png"
                      alt="Orchid Interiors founder"
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Experience badge */}
              </div>

              {/* CONTENT SIDE */}
              <div className="relative">
                <p className="mb-5 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
                  Director
                </p>

                <h2 className="max-w-2xl text-4xl font-light leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-6xl">
                  Design-led execution.
                  <br />
                  <span className="text-stone-400">
                    Built for demanding spaces.
                  </span>
                </h2>

                <div className="mt-8 h-px w-16 bg-black" />

                <h3 className="mt-8 text-2xl font-light text-black sm:text-3xl">
                  Mr. Aravindhan (B.E. EEE, MBA)
                </h3>

                <p className="mt-2 text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">
                  Director
                </p>

                <p className="mt-7 max-w-xl text-base leading-8 text-stone-700">
                  Aravindhan, brings eight years of experience in interiors. He
                  uses design software to work through complex client
                  requirements before production and develop solutions that
                  Orchid’s factory and site teams can build and install. This
                  approach has helped Orchid take on more demanding projects,
                  with a focus on delivering turnkey interiors for luxury homes
                  and commercial spaces.
                </p>

                {/* Founder stats */}
              </div>
            </div>
          </section>

          {/* =========================================================
              TEAM
          ========================================================== */}
          <div className="mt-16 border-t border-stone-300 pt-12 sm:mt-20 sm:pt-16">
            <div className="mb-8 max-w-2xl">
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
          <div className="mt-16 bg-black px-6 py-10 text-white sm:px-10 lg:mt-20 lg:px-14 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
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
                    <p className="text-sm text-stone-400">{goal.number}</p>

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
