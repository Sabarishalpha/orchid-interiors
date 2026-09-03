"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  /*
   * ---------------------------------------------------------
   * SMART HEADER
   *
   * Scroll down → Hide header
   * Scroll up   → Show header
   * Top         → Always visible
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      /*
       * At the very top
       */
      if (currentScrollY <= 20) {
        setIsHeaderVisible(true);
        setIsScrolled(false);

        lastScrollY = currentScrollY;
        return;
      }

      /*
       * User has scrolled
       */
      setIsScrolled(true);

      /*
       * Scroll DOWN
       */
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);

        // Close mobile menu when scrolling down
        setIsMenuOpen(false);
      }

      /*
       * Scroll UP
       */
      if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * ESCAPE KEY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  /*
   * ---------------------------------------------------------
   * PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
   * ---------------------------------------------------------
   */

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`
        fixed
        inset-x-0
        top-0
        z-50
        transition-all
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          isHeaderVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-[120%] opacity-0"
        }
        ${isScrolled ? "pt-3" : "pt-5"}
      `}
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            MAIN NAVBAR
        ===================================================== */}

        <nav
          className={`
            relative
            flex
            h-[72px]
            items-center
            justify-between
            rounded-[22px]
            border
            px-4
            transition-all
            duration-500
            md:px-6
            ${
              isScrolled
                ? `
                  border-black/10
                  bg-white/95
                  shadow-[0_18px_50px_rgba(0,0,0,0.10)]
                  backdrop-blur-xl
                `
                : `
                  border-black/[0.08]
                  bg-white/85
                  shadow-[0_10px_35px_rgba(0,0,0,0.06)]
                  backdrop-blur-lg
                `
            }
          `}
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            aria-label="Orchid Interiors home"
            className="group relative z-10 flex shrink-0 items-center"
          >
            <Image
              src="/images/logo.png"
              alt="Orchid Interiors"
              width={170}
              height={56}
              priority
              className="
                h-auto
                w-[135px]
                object-contain
                transition-transform
                duration-300
                group-hover:scale-[1.02]
                sm:w-[150px]
                md:w-[165px]
              "
            />
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
            <div
              className="
                flex
                items-center
                gap-1
                rounded-full
                border
                border-black/[0.07]
                bg-[#f7f6f3]/80
                p-1.5
              "
            >
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      group
                      relative
                      rounded-full
                      px-4
                      py-2.5
                      text-[15.6px]
                      font-medium
                      tracking-[-0.01em]
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? `
                            bg-white
                            text-black
                            shadow-[0_3px_12px_rgba(0,0,0,0.08)]
                          `
                          : `
                            text-black/55
                            hover:bg-white/70
                            hover:text-black
                          `
                      }
                    `}
                  >
                    {link.label}

                    {/* Active indicator */}

                    {isActive && (
                      <span
                        className="
                          absolute
                          bottom-[5px]
                          left-1/2
                          h-[2px]
                          w-3
                          -translate-x-1/2
                          rounded-full
                          bg-black
                        "
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* =================================================
              DESKTOP CTA
          ================================================= */}

          <div className="hidden items-center md:flex">
            <Link
              href="/contact"
              className="
                group
                flex
                items-center
                gap-2
                rounded-full
                bg-[#171717]
                px-5
                py-3
                text-[15.6px]
                font-medium
                text-white
                transition-all
                duration-300
                hover:bg-black
                hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)]
              "
            >
              <span>Start a Project</span>

              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                "
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="
              relative
              z-20
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-black/10
              bg-white
              text-black
              transition-all
              duration-300
              hover:border-black/20
              hover:bg-[#f5f4f1]
              md:hidden
            "
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.7} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.7} />
            )}
          </button>
        </nav>

        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        <div
          className={`
            overflow-hidden
            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            md:hidden
            ${
              isMenuOpen
                ? "mt-3 max-h-[600px] opacity-100"
                : "pointer-events-none mt-0 max-h-0 opacity-0"
            }
          `}
        >
          <div
            className="
              rounded-[28px]
              border
              border-black/10
              bg-[#171717]
              p-3
              shadow-[0_25px_70px_rgba(0,0,0,0.22)]
            "
          >
            <div
              className="
                rounded-[22px]
                border
                border-white/[0.08]
                bg-white/[0.03]
                p-3
              "
            >
              {/* Mobile Links */}

              {navLinks.map((link, index) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      group
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      px-4
                      py-4
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? "bg-white text-black"
                          : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`
                          text-[10px]
                          font-medium
                          ${isActive ? "text-black/40" : "text-white/25"}
                        `}
                      >
                        0{index + 1}
                      </span>

                      <span className="text-[18px] font-medium">
                        {link.label}
                      </span>
                    </div>

                    <ArrowUpRight
                      className={`
                        h-4
                        w-4
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                        }
                      `}
                    />
                  </Link>
                );
              })}

              {/* Divider */}

              <div className="my-3 h-px bg-white/[0.08]" />

              {/* Mobile CTA */}

              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  bg-white
                  px-4
                  py-4
                  text-black
                  transition-all
                  duration-300
                  hover:bg-[#f0eee9]
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-black/40
                    "
                  >
                    Let&apos;s create
                  </p>

                  <p className="mt-1 text-[18px] font-medium">
                    Start a Project
                  </p>
                </div>

                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    text-white
                    transition-transform
                    duration-300
                    group-hover:rotate-45
                  "
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
