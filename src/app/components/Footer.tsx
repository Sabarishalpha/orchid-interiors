import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { Shield, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="footer"
      data-footer
      className="relative w-full bg-black text-white"
    >
      {/* Main Footer Content */}
      <div className="px-4 py-12 sm:px-6 md:px-10 md:py-16 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Top Section - Brand & CTA */}
          <div className="mb-12 border-b border-white/10 pb-12 md:mb-14 md:pb-14">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Brand Column */}
              <div className="lg:col-span-1">
                {/* Logo */}
                <div data-footer-logo className="mb-8">
                  <Image
                    src="/images/logo.png"
                    alt="Orchid Interiors"
                    width={180}
                    height={60}
                    className="h-12 w-auto"
                  />
                </div>

                {/* Heading & Description */}
                <div className="mb-8">
                  <h2
                    data-footer-heading
                    className="mb-4 max-w-sm text-2xl font-light leading-tight sm:text-3xl md:text-4xl"
                  >
                    Make Dream Into reality
                  </h2>
                </div>

                {/* CTA Button */}
                <Link
                  href="/contact"
                  data-footer-cta
                  className="group inline-flex items-center gap-2 border border-white px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-white hover:text-black md:text-base"
                >
                  Start a Project
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>

              {/* Explore Column */}
              <div data-footer-column className="lg:col-span-1">
                <h3 className="mb-6 text-xs font-medium tracking-[0.32em] uppercase text-white/60 md:mb-8">
                  Explore
                </h3>
                <nav className="flex flex-col gap-3 md:gap-4">
                  <Link
                    href="/"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    About
                  </Link>
                  <Link
                    href="/services"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    Services
                  </Link>
                  <Link
                    href="/projects"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    Projects
                  </Link>
                  <Link
                    href="/contact"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    Contact
                  </Link>
                </nav>
              </div>

              {/* Services Column */}
              <div data-footer-column className="lg:col-span-1">
                <h3 className="mb-6 text-xs font-medium tracking-[0.32em] uppercase text-white/60 md:mb-8">
                  Services
                </h3>
                <nav className="flex flex-col gap-3 md:gap-4">
                  <Link
                    href="/services"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    Services
                  </Link>
                  <Link
                    href="/design-library"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    Design Library
                  </Link>
                  <Link
                    href="/projects"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    Commercial
                  </Link>
                  <Link
                    href="/contact"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    Space Planning
                  </Link>
                  <Link
                    href="/contact"
                    data-footer-link
                    className="text-sm leading-relaxed text-white/80 transition-colors duration-300 hover:text-white md:text-base"
                  >
                    Custom Furniture
                  </Link>
                </nav>
              </div>

              {/* Contact Column */}
              <div data-footer-column className="lg:col-span-1">
                <h3 className="mb-6 text-xs font-medium tracking-[0.32em] uppercase text-white/60 md:mb-8">
                  Contact
                </h3>
                <div className="space-y-4 md:space-y-5">
                  <p className="text-sm leading-relaxed text-white/80 md:text-base">
                    Avinashi Main Rd, Periyar Colony,
                    <br />
                    Tiruppur, Tamil Nadu - 641 603
                  </p>
                  <p className="text-sm leading-relaxed text-white/80 md:text-base">
                    +91 97903 52563
                    <br />
                    +91 97912 55355
                  </p>
                  <p className="text-sm leading-relaxed text-white/80 md:text-base">
                    <a
                      href="mailto:hello@orchidinteriors.com"
                      className="transition-colors duration-300 hover:text-white"
                    >
                      hello@orchidinteriors.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Social & Legal */}
          <div
            data-footer-bottom
            className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between"
          >
            {/* Left - Copyright */}
            <div className="text-xs leading-relaxed text-white/60 sm:text-sm md:text-base">
              <p className="mb-2">© 2026 Orchid Interiors</p>
              <p>All rights reserved.</p>
            </div>

            {/* Middle - Social Links */}
            <div
              data-footer-social
              className="flex items-center gap-6 sm:gap-8"
            >
              <a
                href="https://wa.me/919790352563"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with Orchid Interiors on WhatsApp"
                className="transition-colors duration-300 hover:text-white/60"
              >
                <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="https://www.instagram.com/orchid.modular.interiors/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Orchid Interiors on Instagram"
                className="transition-colors duration-300 hover:text-white/60"
              >
                <FaInstagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              {/* <a
                href="https://www.x.com/orchidmodular"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Orchid Interiors on X (Twitter)"
                className="transition-colors duration-300 hover:text-white/60"
              >
                <FaXTwitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a> */}
              <a
                href="https://www.pinterest.com/orchidmodular/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Orchid Interiors on Pinterest"
                className="transition-colors duration-300 hover:text-white/60"
              >
                <FaPinterestP className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/orchid-modular-interiors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with Orchid Interiors on LinkedIn"
                className="transition-colors duration-300 hover:text-white/60"
              >
                <FaLinkedinIn className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="https://www.youtube.com/@orchid_interiors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with Orchid Interiors on YouTube"
                className="transition-colors duration-300 hover:text-white/60"
              >
                <FaYoutube className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60 sm:text-sm">
              <span>Developed by</span>
              <a
                href="https://about.me/sabarish.a"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View developer profile on Instagram"
                className="inline-flex h-9 w-9 items-center justify-center text-white transition-opacity hover:opacity-70"
              >
                <span className="relative inline-flex">
                  <Shield className="h-8 w-8" aria-hidden="true" />
                  <Zap
                    className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 fill-current"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </div>

            {/* Right - Legal Links */}
            {/* <div className="flex gap-4 text-xs sm:gap-6 sm:text-sm md:text-base">
              <Link
                href="#privacy"
                className="text-white/60 transition-colors duration-300 hover:text-white"
              >
                Privacy Policy
              </Link>
              <span className="text-white/20">·</span>
              <Link
                href="#terms"
                className="text-white/60 transition-colors duration-300 hover:text-white"
              >
                Terms & Conditions
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
