"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

type Project = {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  href: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "The Harmonia Residence",
    location: "Bangalore",
    description:
      "A home that balances warmth, elegance and calm through timeless interiors and refined natural materials.",
    image: "/images/about-1.jpeg",
    href: "/projects/harmonia-residence",
  },
  {
    id: 2,
    title: "The Aurelia Villa",
    location: "Coimbatore",
    description:
      "A contemporary villa designed around light, openness and sophisticated details.",
    image: "/images/about-2.jpeg",
    href: "/projects/aurelia-villa",
  },
  {
    id: 3,
    title: "The Aria Residence",
    location: "Chennai",
    description:
      "An elegant urban residence where modern architecture meets warm, expressive interiors.",
    image: "/images/about-3.jpeg",
    href: "/projects/aria-residence",
  },
  {
    id: 4,
    title: "The Elysian Home",
    location: "Coimbatore",
    description:
      "A serene family home shaped by natural textures, soft tones and understated luxury.",
    image: "/images/about-4.jpeg",
    href: "/projects/elysian-home",
  },
  {
    id: 5,
    title: "The Solara Villa",
    location: "Bangalore",
    description:
      "A statement residence combining sculptural architecture with warm contemporary interiors.",
    image: "/images/about-5.jpeg",
    href: "/projects/solara-villa",
  },
];

export default function FeaturedProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const activeProject = projects[activeIndex];

  /*
   * ------------------------------------------
   * CHANGE SLIDE
   * ------------------------------------------
   */

  const changeSlide = useCallback(
    (newIndex: number, direction: 1 | -1) => {
      if (isAnimating || newIndex === activeIndex) return;

      const currentImage = imageRefs.current[activeIndex];
      const nextImage = imageRefs.current[newIndex];

      if (!currentImage || !nextImage || !contentRef.current) return;

      setIsAnimating(true);

      const timeline = gsap.timeline({
        onComplete: () => {
          setActiveIndex(newIndex);
          setIsAnimating(false);
        },
      });

      /*
       * Current image leaves
       */

      timeline.to(currentImage, {
        scale: 1.08,
        opacity: 0,
        xPercent: direction === 1 ? -4 : 4,
        duration: 0.75,
        ease: "power3.inOut",
      });

      /*
       * Next image enters
       */

      gsap.set(nextImage, {
        opacity: 0,
        scale: 1.12,
        xPercent: direction === 1 ? 4 : -4,
      });

      timeline.to(
        nextImage,
        {
          opacity: 1,
          scale: 1,
          xPercent: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.45"
      );

      /*
       * Content animation
       */

      timeline
        .to(
          contentRef.current.children,
          {
            opacity: 0,
            y: 20,
            duration: 0.25,
            stagger: 0.03,
            ease: "power2.in",
          },
          "-=0.8"
        )
        .to(
          contentRef.current.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.05"
        );
    },
    [activeIndex, isAnimating]
  );

  /*
   * ------------------------------------------
   * NEXT / PREVIOUS
   * ------------------------------------------
   */

  const nextSlide = useCallback(() => {
    const nextIndex = (activeIndex + 1) % projects.length;
    changeSlide(nextIndex, 1);
  }, [activeIndex, changeSlide]);

  const previousSlide = useCallback(() => {
    const previousIndex =
      (activeIndex - 1 + projects.length) % projects.length;

    changeSlide(previousIndex, -1);
  }, [activeIndex, changeSlide]);

  /*
   * ------------------------------------------
   * AUTOPLAY
   * ------------------------------------------
   */

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      if (!isAnimating) {
        const nextIndex = (activeIndex + 1) % projects.length;
        changeSlide(nextIndex, 1);
      }
    }, 5500);
  }, [activeIndex, changeSlide, isAnimating]);

  useEffect(() => {
    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [startAutoplay]);

  /*
   * ------------------------------------------
   * KEYBOARD CONTROLS
   * ------------------------------------------
   */

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        previousSlide();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [nextSlide, previousSlide]);

  /*
   * ------------------------------------------
   * TOUCH / SWIPE
   * ------------------------------------------
   */

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current = null;
  };

  /*
   * ------------------------------------------
   * INITIAL IMAGE
   * ------------------------------------------
   */

  useEffect(() => {
    imageRefs.current.forEach((image, index) => {
      if (!image) return;

      gsap.set(image, {
        opacity: index === 0 ? 1 : 0,
        scale: index === 0 ? 1 : 1.12,
        xPercent: 0,
      });
    });
  }, []);

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#11100e]
        px-2
        py-2
        sm:px-3
        sm:py-3
        md:px-4
        md:py-5
        lg:px-5
        lg:py-6
      "
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="
          relative
          mx-auto
          min-h-[620px]
          w-full
          overflow-hidden
          rounded-[2px]
          sm:min-h-[650px]
          md:min-h-[680px]
          lg:min-h-[720px]
          xl:min-h-[760px]
        "
      >
        {/* =====================================================
            IMAGES
        ====================================================== */}

        <div className="absolute inset-0">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(element) => {
                imageRefs.current[index] = element;
              }}
              className="absolute inset-0 overflow-hidden"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="
                  object-cover
                  object-center
                  will-change-transform
                "
              />

              {/* Image darkness */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Left cinematic gradient */}
              <div
                className="
                  absolute
                  inset-y-0
                  left-0
                  w-full
                  bg-gradient-to-r
                  from-black/90
                  via-black/60
                  to-transparent
                  sm:w-[90%]
                  md:w-[75%]
                  lg:w-[65%]
                "
              />

              {/* Bottom gradient */}
              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-[45%]
                  bg-gradient-to-t
                  from-black/65
                  to-transparent
                "
              />
            </div>
          ))}
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div
          ref={contentRef}
          className="
            relative
            z-10
            flex
            min-h-[620px]
            flex-col
            justify-between
            px-7
            py-8
            sm:min-h-[650px]
            sm:px-10
            sm:py-10
            md:min-h-[680px]
            md:w-[65%]
            md:px-12
            md:py-14
            lg:min-h-[720px]
            lg:w-[52%]
            lg:px-16
            lg:py-16
            xl:min-h-[760px]
            xl:px-20
          "
        >
          {/* TOP */}

          <div>
            <p
              className="
                mb-8
                text-[8px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-white/65
                sm:mb-10
                sm:text-[9px]
                md:mb-14
                md:text-[10px]
              "
            >
              Featured Project
            </p>

            <h2
              className="
                max-w-[550px]
                font-serif
                text-[40px]
                font-light
                leading-[0.98]
                tracking-[-0.035em]
                text-white
                sm:text-[48px]
                md:text-[58px]
                lg:text-[66px]
                xl:text-[72px]
              "
            >
              {activeProject.title}
            </h2>

            <p
              className="
                mt-5
                text-[8px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-white/65
                sm:mt-6
                sm:text-[9px]
                md:mt-7
                md:text-[10px]
              "
            >
              {activeProject.location}
            </p>

            <p
              className="
                mt-4
                max-w-[340px]
                text-[11px]
                leading-[1.8]
                text-white/65
                sm:text-[12px]
                md:mt-5
                md:text-[13px]
              "
            >
              {activeProject.description}
            </p>
          </div>

          {/* BOTTOM */}

          <div className="flex flex-col gap-7">
            {/* View Project */}

            <Link
              href={activeProject.href}
              className="
                group
                flex
                w-fit
                items-center
                gap-4
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-white
                sm:text-[10px]
              "
            >
              <span className="relative">
                View Project

                <span
                  className="
                    absolute
                    -bottom-1
                    left-0
                    h-px
                    w-0
                    bg-white
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                />
              </span>

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/40
                  transition-all
                  duration-500
                  group-hover:border-white
                  group-hover:bg-white
                  group-hover:text-black
                  sm:h-8
                  sm:w-8
                "
              >
                <ArrowUpRight
                  size={12}
                  strokeWidth={1.4}
                  className="
                    transition-transform
                    duration-500
                    group-hover:rotate-45
                  "
                />
              </span>
            </Link>

            {/* MOBILE CONTROLS */}

            <div className="flex items-center gap-5 md:hidden">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous project"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/30
                  text-white
                  transition
                  hover:bg-white
                  hover:text-black
                "
              >
                <ArrowLeft size={14} strokeWidth={1.3} />
              </button>

              <div className="h-px w-16 bg-white/20">
                <div
                  className="h-px bg-white transition-all duration-700"
                  style={{
                    width: `${((activeIndex + 1) / projects.length) * 100}%`,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next project"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/30
                  text-white
                  transition
                  hover:bg-white
                  hover:text-black
                "
              >
                <ArrowRight size={14} strokeWidth={1.3} />
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            DESKTOP RIGHT COUNTER
        ====================================================== */}

        <div
          ref={counterRef}
          className="
            absolute
            right-6
            top-1/2
            z-20
            hidden
            -translate-y-1/2
            flex-col
            items-center
            md:flex
            lg:right-8
            xl:right-10
          "
        >
          <span className="mb-3 text-[8px] tracking-wider text-white">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>

          <div className="relative h-32 w-px bg-white/20 lg:h-36">
            <div
              className="
                absolute
                left-0
                top-0
                w-px
                bg-white
                transition-all
                duration-700
              "
              style={{
                height: `${((activeIndex + 1) / projects.length) * 100}%`,
              }}
            />
          </div>

          <span className="mt-3 text-[8px] tracking-wider text-white/40">
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* =====================================================
            DESKTOP ARROWS
        ====================================================== */}

        <div
          className="
            absolute
            bottom-10
            right-10
            z-20
            hidden
            items-center
            gap-2
            md:flex
            lg:bottom-12
            lg:right-14
          "
        >
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous project"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              text-white
              transition-all
              duration-300
              hover:border-white
              hover:bg-white
              hover:text-black
              lg:h-10
              lg:w-10
            "
          >
            <ArrowLeft size={14} strokeWidth={1.2} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next project"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              text-white
              transition-all
              duration-300
              hover:border-white
              hover:bg-white
              hover:text-black
              lg:h-10
              lg:w-10
            "
          >
            <ArrowRight size={14} strokeWidth={1.2} />
          </button>
        </div>

        {/* =====================================================
            PROJECT DOTS
        ====================================================== */}

        <div
          className="
            absolute
            bottom-5
            left-1/2
            z-20
            flex
            -translate-x-1/2
            items-center
            gap-2
            md:hidden
          "
        >
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() =>
                changeSlide(index, index > activeIndex ? 1 : -1)
              }
              aria-label={`Go to project ${index + 1}`}
              className={`
                h-[2px]
                transition-all
                duration-500
                ${
                  activeIndex === index
                    ? "w-7 bg-white"
                    : "w-2 bg-white/40"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
