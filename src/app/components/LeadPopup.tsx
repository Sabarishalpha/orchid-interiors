"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const closePopup = () => {
    setIsOpen(false);
  };

  /*
   * Open popup every 50 seconds
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setIsSubmitted(false);
      setIsOpen(true);
    }, 300000);

    return () => window.clearInterval(timer);
  }, []);

  /*
   * Close popup with Escape
   * Lock body scrolling when popup is open
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /*
   * Form submit
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitted(true);
  };

  /*
   * Don't render popup when closed
   */
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/60
        px-4
        py-6
        backdrop-blur-sm
        sm:px-6
      "
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closePopup();
        }
      }}
    >
      {/* =====================================================
          POPUP
      ====================================================== */}

      <div
        className="
          relative
          grid
          w-full
          max-w-4xl
          overflow-hidden
          rounded-[1.5rem]
          bg-stone-100
          shadow-2xl
          md:grid-cols-[0.9fr_1.1fr]
          md:rounded-[2rem]
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-popup-title"
      >
        {/* =====================================================
            LEFT IMAGE PANEL
        ====================================================== */}

        <div
          className="
            relative
            hidden
            min-h-[500px]
            overflow-hidden
            text-white
            md:flex
            md:flex-col
            md:justify-between
          "
        >
          {/* Background Image */}

          <Image
            src="/images/hero-1.png"
            alt=""
            fill
            priority
            className="
              object-cover
              object-center
            "
            sizes="450px"
          />

          {/* Dark Overlay */}

          <div className="absolute inset-0 bg-black/55" />

          {/* Cinematic Gradient */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/90
              via-black/45
              to-black/50
            "
          />

          {/* Image Content */}

          <div className="relative z-10 p-10 lg:p-12">
            <p
              className="
                text-xs
                tracking-[0.3em]
                text-stone-300
                uppercase
              "
            >
              ORCHID INTERIORS
            </p>

            <p
              className="
                mt-12
                max-w-xs
                text-4xl
                leading-tight
                font-light
                lg:text-[42px]
              "
            >
              Make room for a life beautifully lived.
            </p>
          </div>

          <p
            className="
              relative
              z-10
              max-w-xs
              p-10
              pt-0
              text-sm
              leading-6
              text-stone-300
              lg:p-12
              lg:pt-0
            "
          >
            Tell us a little about your space and our design team will be in
            touch.
          </p>
        </div>

        {/* =====================================================
            RIGHT FORM PANEL
        ====================================================== */}

        <div
          className="
            relative
            min-h-[520px]
            p-7
            sm:p-10
            md:min-h-[500px]
            lg:p-12
          "
        >
          {/* Close Button */}

          <button
            type="button"
            onClick={closePopup}
            aria-label="Close consultation form"
            className="
              absolute
              right-5
              top-5
              z-20
              rounded-full
              p-2
              text-stone-500
              transition-colors
              hover:bg-stone-200
              hover:text-black
              sm:right-6
              sm:top-6
            "
          >
            <X className="h-5 w-5" />
          </button>

          {/* =====================================================
              FORM
          ====================================================== */}

          {!isSubmitted ? (
            <>
              {/* Small Mobile Brand */}

              <div className="mb-8 md:hidden">
                <p
                  className="
                    text-[10px]
                    tracking-[0.3em]
                    text-stone-500
                    uppercase
                  "
                >
                  ORCHID INTERIORS
                </p>
              </div>

              {/* Heading */}

              <p
                className="
                  mb-4
                  text-xs
                  tracking-[0.28em]
                  text-stone-500
                  uppercase
                "
              >
                PRIVATE CONSULTATION
              </p>

              <h2
                id="lead-popup-title"
                className="
                  max-w-sm
                  text-3xl
                  leading-tight
                  font-light
                  tracking-tight
                  text-black
                  sm:text-4xl
                "
              >
                Begin your next chapter at home.
              </h2>

              <p
                className="
                  mt-4
                  max-w-md
                  text-sm
                  leading-6
                  text-stone-600
                "
              >
                Share your details to receive a complimentary 20-minute design
                consultation.
              </p>

              {/* =================================================
                  FORM FIELDS
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-4"
              >
                {/* Name */}

                <label className="block">
                  <span className="sr-only">Your name</span>

                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    className="
                      w-full
                      border-b
                      border-stone-300
                      bg-transparent
                      px-0
                      py-3
                      text-sm
                      text-black
                      outline-none
                      placeholder:text-stone-500
                      focus:border-black
                    "
                  />
                </label>

                {/* Email */}

                <label className="block">
                  <span className="sr-only">Email address</span>

                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    className="
                      w-full
                      border-b
                      border-stone-300
                      bg-transparent
                      px-0
                      py-3
                      text-sm
                      text-black
                      outline-none
                      placeholder:text-stone-500
                      focus:border-black
                    "
                  />
                </label>

                {/* =================================================
                    PHONE NUMBER
                ================================================== */}

                <label className="block">
                  <span className="sr-only">Phone number</span>

                  <div
                    className="
                      flex
                      items-center
                      border-b
                      border-stone-300
                      focus-within:border-black
                    "
                  >
                    {/* Country Code */}

                    <select
                      name="countryCode"
                      defaultValue="+91"
                      aria-label="Country code"
                      className="
                        shrink-0
                        cursor-pointer
                        bg-transparent
                        py-3
                        pr-2
                        text-sm
                        text-black
                        outline-none
                      "
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+60">🇲🇾 +60</option>
                    </select>

                    {/* Phone */}

                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="Phone number"
                      inputMode="tel"
                      autoComplete="tel"
                      className="
                        min-w-0
                        w-full
                        bg-transparent
                        px-2
                        py-3
                        text-sm
                        text-black
                        outline-none
                        placeholder:text-stone-500
                      "
                    />
                  </div>
                </label>

                {/* Project Type */}

                <label className="block">
                  <span className="sr-only">Project type</span>

                  <select
                    required
                    name="projectType"
                    defaultValue=""
                    className="
                      w-full
                      border-b
                      border-stone-300
                      bg-transparent
                      px-0
                      py-3
                      text-sm
                      text-stone-600
                      outline-none
                      focus:border-black
                    "
                  >
                    <option value="" disabled>
                      What are you designing?
                    </option>

                    <option value="home">
                      A home
                    </option>

                    <option value="office">
                      An office
                    </option>

                    <option value="hospitality">
                      A hospitality space
                    </option>
                  </select>
                </label>

                {/* Submit */}

                <button
                  type="submit"
                  className="
                    mt-5
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-black
                    px-6
                    py-3.5
                    text-sm
                    text-white
                    transition-all
                    duration-300
                    hover:bg-stone-800
                    hover:shadow-lg
                    active:scale-[0.98]
                  "
                >
                  Request consultation

                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Contact Page */}

              <p
                className="
                  mt-5
                  text-center
                  text-xs
                  leading-5
                  text-stone-500
                "
              >
                Prefer to share more?{" "}

                <Link
                  href="/contact"
                  onClick={closePopup}
                  className="
                    text-black
                    underline
                    underline-offset-4
                    transition-opacity
                    hover:opacity-60
                  "
                >
                  Visit our contact page
                </Link>
              </p>
            </>
          ) : (
            /* =====================================================
               SUCCESS STATE
            ====================================================== */

            <div
              className="
                flex
                min-h-[430px]
                flex-col
                items-center
                justify-center
                px-2
                text-center
              "
            >
              {/* Success Icon */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  text-white
                "
              >
                <Check className="h-6 w-6" />
              </div>

              {/* Heading */}

              <h2
                id="lead-popup-title"
                className="
                  mt-6
                  text-3xl
                  font-light
                  tracking-tight
                  text-black
                  sm:text-4xl
                "
              >
                Thank you.
              </h2>

              {/* Message */}

              <p
                className="
                  mt-4
                  max-w-sm
                  text-sm
                  leading-6
                  text-stone-600
                "
              >
                Your details are ready for the Orchid Interiors team. Our
                design team will be in touch with you shortly.
              </p>

              {/* Close */}

              <button
                type="button"
                onClick={closePopup}
                className="
                  mt-8
                  rounded-full
                  border
                  border-black
                  px-6
                  py-3
                  text-sm
                  text-black
                  transition-all
                  duration-300
                  hover:bg-black
                  hover:text-white
                "
              >
                Continue browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
