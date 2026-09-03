"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Hero carousel images
const HERO_IMAGES = [
  "/images/hero.jpeg",
  "/images/heroo.jpeg",
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
];

export default function Hero() {
  const [step, setStep] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    requirement: "",
    budget: "",
    possession: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: "To be discussed",
          propertyType: formData.requirement,
          interiorRequirement: formData.requirement,
          propertySize: "To be discussed",
          budget: formData.budget,
          timeline: formData.possession,
          message: "Request for a free interior design consultation.",
        }),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      setSubmissionStatus("success");
    } catch (error) {
      console.error("Consultation request error:", error);
      setSubmissionStatus("error");
    }
  };

  return (
    <section
      id="hero"
      className="relative isolate min-h-screen w-full overflow-hidden bg-black"
    >
      {/* =========================
          BACKGROUND CAROUSEL
      ========================== */}
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            el: ".swiper-pagination",
          }}
          loop
          className="h-full w-full"
        >
          {HERO_IMAGES.map((imagePath, index) => (
            <SwiperSlide key={index} className="relative h-full w-full">
              <Image
                src={imagePath}
                alt={`Luxury Orchid Interiors interior design ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/25" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Main dark overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Left radial light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_30%)]" />

        {/* Right dark gradient for form */}
        <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-black/50 via-black/10 to-transparent lg:w-3/4" />
      </div>

      {/* =========================
          HERO CONTENT
      ========================== */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 pb-20 pt-28 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_450px]">
          {/* =====================
              LEFT CONTENT
          ====================== */}
          <div className="max-w-[700px] text-left">
            <h3
              data-hero-label
              className="mb-8 text-sm font-medium tracking-[0.32em] text-white/80 sm:text-base md:text-lg"
            >
              ORCHID INTERIORS
            </h3>

            <p
              data-hero-description
              className="max-w-xl text-sm leading-7 text-white/75 sm:text-base md:text-lg"
            >
              Thoughtfully designed interiors that bring together architecture,
              comfort and timeless elegance.
            </p>

            <div className="mt-10">
              <Link
                href="/projects"
                data-hero-cta
                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium tracking-[0.04em] text-black transition-all duration-300 hover:bg-black hover:text-white sm:px-8 sm:py-4 sm:text-base"
              >
                Explore Projects
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* =====================
              FREE QUOTE FORM
          ====================== */}
          <div className="w-full max-w-[450px] lg:ml-auto">
            <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 md:p-9">
              {/* FORM HEADER */}
              <div className="mb-7">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">
                    Consultation request
                  </span>

                  <span className="text-xs text-black/35">
                    Step 0{step} of 02
                  </span>
                </div>

                <h2 className="text-2xl font-medium tracking-[-0.03em] text-black sm:text-3xl">
                  Design your space with confidence
                </h2>

                <p className="mt-3 text-sm leading-6 text-black/50">
                  Tell us a little about your project and our design team will
                  get in touch to arrange your complimentary consultation.
                </p>
              </div>

              {submissionStatus === "success" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
                  <h3 className="text-lg font-medium text-emerald-950">
                    Thank you for getting in touch
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-900/70">
                    Your consultation request has been sent to our team. We will
                    contact you shortly.
                  </p>
                </div>
              ) : (
                <>
                  {/* =====================
                  STEP 1
              ====================== */}
                  {step === 1 && (
                    <form onSubmit={handleNext} className="space-y-5">
                      {/* NAME */}
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-xs font-medium text-black/60"
                        >
                          Name
                        </label>

                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Enter your name"
                          required
                          className="h-14 w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 text-sm text-black outline-none transition-all placeholder:text-black/30 focus:border-black/30 focus:bg-white"
                        />
                      </div>

                      {/* PHONE */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-xs font-medium text-black/60"
                        >
                          Phone Number
                        </label>

                        <div className="flex h-14 overflow-hidden rounded-xl border border-black/10 bg-[#fafafa] transition-all focus-within:border-black/30 focus-within:bg-white">
                          <div className="flex items-center border-r border-black/10 px-4 text-sm text-black/60">
                            +91
                          </div>

                          <input
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) =>
                              updateField(
                                "phone",
                                e.target.value.replace(/\D/g, ""),
                              )
                            }
                            placeholder="Enter phone number"
                            required
                            className="h-full flex-1 bg-transparent px-4 text-sm text-black outline-none placeholder:text-black/30"
                          />
                        </div>
                      </div>

                      {/* NEXT */}
                      <button
                        type="submit"
                        className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-black text-sm font-medium text-white transition-all duration-300 hover:bg-[#222]"
                      >
                        Next
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                    </form>
                  )}

                  {/* =====================
                  STEP 2
              ====================== */}
                  {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* BACK */}
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mb-2 flex items-center gap-2 text-xs text-black/45 transition-colors hover:text-black"
                      >
                        <ArrowLeft size={14} />
                        Back
                      </button>

                      {/* REQUIREMENT */}
                      <div className="relative">
                        <label
                          htmlFor="requirement"
                          className="mb-2 block text-xs font-medium text-black/60"
                        >
                          What is your interior requirement?
                        </label>

                        <div className="relative">
                          <select
                            id="requirement"
                            value={formData.requirement}
                            onChange={(e) =>
                              updateField("requirement", e.target.value)
                            }
                            required
                            className="h-14 w-full appearance-none rounded-xl border border-black/10 bg-[#fafafa] px-4 pr-12 text-sm text-black outline-none transition-all focus:border-black/30 focus:bg-white"
                          >
                            <option value="">Select requirement</option>
                            <option value="2bhk">2 BHK</option>
                            <option value="3bhk">3 BHK</option>
                            <option value="4bhk">4 BHK</option>
                            <option value="villa">Villa</option>
                            <option value="office">Office</option>
                            <option value="commercial">Commercial</option>
                            <option value="renovation">Renovation</option>
                          </select>

                          <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
                          />
                        </div>
                      </div>

                      {/* BUDGET */}
                      <div className="relative">
                        <label
                          htmlFor="budget"
                          className="mb-2 block text-xs font-medium text-black/60"
                        >
                          Your Approx. Interior Budget?
                        </label>

                        <div className="relative">
                          <select
                            id="budget"
                            value={formData.budget}
                            onChange={(e) =>
                              updateField("budget", e.target.value)
                            }
                            required
                            className="h-14 w-full appearance-none rounded-xl border border-black/10 bg-[#fafafa] px-4 pr-12 text-sm text-black outline-none transition-all focus:border-black/30 focus:bg-white"
                          >
                            <option value="">
                              Select budget (Min. ₹2 Lacs)
                            </option>
                            <option value="2-5">₹2 – ₹5 Lacs</option>
                            <option value="5-10">₹5 – ₹10 Lacs</option>
                            <option value="10-20">₹10 – ₹20 Lacs</option>
                            <option value="20-30">₹20 – ₹30 Lacs</option>
                            <option value="30+">₹30+ Lacs</option>
                          </select>

                          <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
                          />
                        </div>
                      </div>

                      {/* POSSESSION */}
                      <div className="relative">
                        <label
                          htmlFor="possession"
                          className="mb-2 block text-xs font-medium text-black/60"
                        >
                          Do you have possession of property?
                        </label>

                        <div className="relative">
                          <select
                            id="possession"
                            value={formData.possession}
                            onChange={(e) =>
                              updateField("possession", e.target.value)
                            }
                            required
                            className="h-14 w-full appearance-none rounded-xl border border-black/10 bg-[#fafafa] px-4 pr-12 text-sm text-black outline-none transition-all focus:border-black/30 focus:bg-white"
                          >
                            <option value="">Select option</option>
                            <option value="yes">Yes, I have possession</option>
                            <option value="soon">Possession soon</option>
                            <option value="not-yet">Not yet</option>
                          </select>

                          <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
                          />
                        </div>
                      </div>

                      {/* SUBMIT */}
                      <button
                        type="submit"
                        disabled={submissionStatus === "submitting"}
                        className="group mt-2 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-black text-sm font-medium text-white transition-all duration-300 hover:bg-[#222]"
                      >
                        {submissionStatus === "submitting"
                          ? "Sending request..."
                          : "Request my consultation"}

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                      {submissionStatus === "error" && (
                        <p className="text-center text-xs text-red-600">
                          We couldn&apos;t send your request. Please try again.
                        </p>
                      )}
                    </form>
                  )}
                </>
              )}

              {/* PRIVACY */}
              <p className="mt-5 text-[9px] leading-4 text-black/35">
                By submitting this form, you agree to our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-black/55 underline underline-offset-2"
                >
                  privacy policy
                </Link>{" "}
                &{" "}
                <Link
                  href="/terms"
                  className="font-medium text-black/55 underline underline-offset-2"
                >
                  terms and conditions
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          SCROLL INDICATOR
      ========================== */}
      <div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium tracking-[0.32em] text-white/70 md:flex"
      >
        <span>SCROLL</span>

        <span aria-hidden="true" className="text-base leading-none">
          ↓
        </span>
      </div>

      {/* =========================
          SWIPER PAGINATION
      ========================== */}
      <div className="swiper-pagination absolute bottom-24 left-1/2 z-20 -translate-x-1/2" />
    </section>
  );
}
