"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "../data/projects";

const CATEGORIES = [
  "Residential",
  "Commercial",
  "Modern",
  "Hospitality",
  "Institute",
  "Luxury",
] as const;

type CategoryType = (typeof CATEGORIES)[number];

export default function Projects() {
  const [activeCategory, setActiveCategory] =
    useState<CategoryType>("Residential");

  const filteredProjects = PROJECTS.filter(
    (project) => project.category === activeCategory,
  );

  /*
   * Re-run your project animation after category changes.
   * This dispatches a custom event that your existing GSAP
   * animation code can listen for if required.
   */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("projects-category-change"));
  }, [activeCategory]);

  return (
    <section
      id="projects"
      data-projects-section
      className="
        relative
        w-full
        overflow-hidden
        bg-stone-50
        px-4
        py-20
        sm:px-6
        sm:py-24
        md:px-10
        md:py-28
        lg:px-16
        lg:py-32
      "
    >
      <div className="mx-auto max-w-[1600px]">
        {/* =====================================================
            SECTION INTRODUCTION
        ====================================================== */}

        <div
          className="
            mb-14
            text-center
            sm:mb-16
            md:mb-20
            lg:mb-24
          "
        >
          <p
            data-projects-label
            className="
              mb-5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.32em]
              text-stone-500
              sm:text-xs
            "
          >
            Our Projects
          </p>

          <h2
            data-projects-title
            className="
              mx-auto
              mb-7
              max-w-3xl
              text-4xl
              font-light
              leading-[1.05]
              tracking-[-0.025em]
              text-black
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            Spaces we&apos;ve
            <br />
            brought to life.
          </h2>

          <p
            data-projects-description
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
            A selection of interiors shaped by thoughtful design,
            <br className="hidden sm:block" />
            materiality and attention to detail.
          </p>
        </div>

        {/* =====================================================
            CATEGORY FILTER
        ====================================================== */}

        <div
          className="
            mb-12
            flex
            justify-start
            gap-5
            overflow-x-auto
            px-1
            pb-3
            sm:justify-center
            sm:gap-7
            md:mb-16
            md:gap-10
          "
        >
          {CATEGORIES.map((category) => {
            const count = PROJECTS.filter(
              (project) => project.category === category,
            ).length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`
                  group
                  relative
                  whitespace-nowrap
                  pb-2
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  transition-all
                  duration-300
                  sm:text-sm
                  md:text-base
                  ${
                    activeCategory === category
                      ? "text-black"
                      : "text-stone-500 hover:text-black"
                  }
                `}
                aria-pressed={activeCategory === category}
              >
                {category}

                {/* Project Count */}

                <span
                  className={`
                    ml-1
                    align-top
                    text-[8px]
                    transition-colors
                    duration-300
                    sm:text-[9px]
                    ${
                      activeCategory === category
                        ? "text-stone-500"
                        : "text-stone-400"
                    }
                  `}
                >
                  {count}
                </span>

                {/* Active Line */}

                <span
                  className={`
                    absolute
                    bottom-0
                    left-0
                    h-px
                    bg-black
                    transition-all
                    duration-500
                    ${
                      activeCategory === category
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }
                  `}
                />
              </button>
            );
          })}
        </div>

        {/* =====================================================
            PROJECT GRID
        ====================================================== */}

        <div
          key={activeCategory}
          data-projects-grid
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            sm:gap-6
            lg:grid-cols-2
            lg:gap-8
          "
        >
          {filteredProjects.map((project, index) => {
            const aspectRatio = project.width / project.height;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                data-project-card
                className="
                  group
                  relative
                  overflow-hidden
                  border
                  border-stone-200
                  bg-stone-100
                  transition-all
                  duration-500
                  hover:border-stone-400
                  hover:shadow-xl
                "
                style={{
                  aspectRatio: `${aspectRatio}`,
                }}
              >
                {/* =================================================
                    PROJECT IMAGE
                ================================================== */}

                <div
                  data-project-image
                  className="
                    absolute
                    inset-0
                    overflow-hidden
                  "
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority={index === 0}
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
                      50vw
                    "
                  />

                  {/* Overlay */}

                  <div
                    data-project-overlay
                    className="
                      absolute
                      inset-0
                      bg-black/0
                      transition-all
                      duration-500
                      group-hover:bg-black/20
                    "
                  />

                  {/* Bottom Gradient */}

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      h-[55%]
                      bg-gradient-to-t
                      from-black/80
                      via-black/30
                      to-transparent
                    "
                  />
                </div>

                {/* =================================================
                    PROJECT INFORMATION
                ================================================== */}

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    z-10
                    px-5
                    py-6
                    sm:px-7
                    sm:py-8
                    md:px-8
                    md:py-9
                  "
                >
                  {/* Category */}

                  <p
                    data-project-category
                    className="
                      mb-2
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.18em]
                      text-white/70
                      transition-colors
                      duration-300
                      group-hover:text-white
                      sm:text-[10px]
                      md:text-xs
                    "
                  >
                    {project.category}
                  </p>

                  {/* Title */}

                  <h3
                    data-project-title
                    className="
                      mb-2
                      text-xl
                      font-light
                      leading-tight
                      text-white
                      sm:text-2xl
                      md:text-3xl
                    "
                  >
                    {project.title}
                  </h3>

                  {/* Location + Arrow */}

                  <div className="flex items-center justify-between">
                    <p
                      data-project-location
                      className="
                        text-xs
                        text-white/65
                        transition-colors
                        duration-300
                        group-hover:text-white/90
                        sm:text-sm
                        md:text-base
                      "
                    >
                      {project.location}
                    </p>

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/30
                        transition-all
                        duration-500
                        group-hover:border-white
                        group-hover:bg-white
                      "
                    >
                      <ArrowRight
                        data-project-arrow
                        className="
                          h-4
                          w-4
                          text-white
                          transition-all
                          duration-500
                          group-hover:translate-x-0.5
                          group-hover:text-black
                        "
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredProjects.length === 0 && (
          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
              border
              border-stone-200
              bg-white
              text-center
            "
          >
            <p className="text-sm text-stone-500">Projects coming soon.</p>
          </div>
        )}

        {/* =====================================================
            PROJECT COUNT
        ====================================================== */}

        <div className="mt-8 flex justify-between text-[10px] uppercase tracking-[0.2em] text-stone-400">
          <span>{activeCategory}</span>

          <span>{filteredProjects.length} Projects</span>
        </div>

        {/* =====================================================
            VIEW ALL PROJECTS
        ====================================================== */}

        <div className="mt-14 flex items-center justify-center md:mt-20">
          <Link
            href="/projects"
            className="
              group
              inline-flex
              items-center
              gap-3
              border-b
              border-black
              pb-2
              text-sm
              font-medium
              text-black
              transition-all
              duration-300
              hover:gap-5
              md:text-base
            "
          >
            View All Projects
            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
