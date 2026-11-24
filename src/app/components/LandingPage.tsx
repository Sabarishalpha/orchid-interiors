"use client";

import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
  Ruler,
  Sparkles,
  MessageCircle,
  Layers3,
  Palette,
  ShieldCheck,
  Hammer,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useConsultationModal } from "./ConsultationModalProvider";
import PhoneVerificationField, {
  type PhoneVerificationFieldHandle,
} from "./PhoneVerificationField";
import InteriorReels, { type InteriorReel } from "./InteriorReels";

const strengths = [
  {
    icon: Palette,
    title: "Personalized Design",
    text: "Layouts and finishes shaped around your lifestyle, preferences and everyday routines.",
  },
  {
    icon: Ruler,
    title: "Smart Space Planning",
    text: "Thoughtful planning that makes every room feel organized, balanced and practical.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Materials",
    text: "Considered material choices selected for appearance, performance and long-term use.",
  },
  {
    icon: Hammer,
    title: "End-to-End Support",
    text: "Guidance across design decisions, planning, coordination and execution.",
  },
  {
    icon: Users,
    title: "Transparent Consultation",
    text: "Clear discussions about requirements, possibilities and project direction.",
  },
  {
    icon: Sparkles,
    title: "Functional Interiors",
    text: "Refined spaces that combine visual character with comfortable, everyday function.",
  },
];

const processSteps = [
  [
    "Share Your Requirements",
    "Tell us how you live and what you want to transform.",
  ],
  [
    "Meet Our Design Experts",
    "Discuss ideas, priorities, materials and project scope.",
  ],
  [
    "Finalize Your Design",
    "Review the plan and align every detail before execution.",
  ],
  [
    "Bring Your Dream Space to Life",
    "Move from a clear design vision to a finished interior.",
  ],
] as const;

const whastappUrl =
  "https://wa.me/919790352563?text=Hello%20Orchid%20Interiors%2C%20I%27d%20like%20to%20enquire%20about%20interior%20design.";

function trackEvent(eventName: string) {
  if (typeof window === "undefined") return;
  const gtag = (
    window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    }
  ).gtag;
  gtag?.("event", eventName);
}

function getUtmPayload() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const payload: Record<string, string> = {
    landingPageUrl: window.location.href,
  };
  [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ].forEach((key) => {
    const value = params.get(key);
    if (value) payload[key] = value;
  });
  return payload;
}

export default function LandingPage({
  reels,
}: {
  reels: readonly InteriorReel[];
}) {
  const { openModal } = useConsultationModal();
  const [quickSubmitted, setQuickSubmitted] = useState(false);
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickError, setQuickError] = useState("");
  const [quickPhoneToken, setQuickPhoneToken] = useState("");
  const [quickForm, setQuickForm] = useState({
    name: "",
    phone: "",
    location: "",
    propertyType: "",
    service: "",
  });
  const quickPhoneRef = useRef<PhoneVerificationFieldHandle>(null);
  const quickSubmitRef = useRef<HTMLButtonElement>(null);
  const pendingQuick = useRef(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => {
      setKeyboardOpen(viewport.height < window.innerHeight * 0.75);
    };
    viewport.addEventListener("resize", update);
    return () => viewport.removeEventListener("resize", update);
  }, []);

  const submitQuick = useCallback(
    async (token: string) => {
      setQuickSubmitting(true);
      setQuickError("");
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "Landing Page",
            name: quickForm.name,
            phone: `+91${quickForm.phone}`,
            phoneVerificationToken: token,
            location: quickForm.location,
            projectType: quickForm.propertyType,
            services: quickForm.service ? [quickForm.service] : [],
            message: `Landing page enquiry for ${quickForm.service || "interior design"} in ${quickForm.location}.`,
            consent: true,
            ...getUtmPayload(),
          }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(data?.error || "We could not send your enquiry.");
        setQuickSubmitted(true);
        trackEvent("enquiry_form_submission");
      } catch (error) {
        setQuickError(
          error instanceof Error ? error.message : "Please try again.",
        );
      } finally {
        setQuickSubmitting(false);
      }
    },
    [quickForm],
  );

  const handleQuickVerified = useCallback(
    (token: string) => {
      setQuickPhoneToken(token);
      if (pendingQuick.current) {
        pendingQuick.current = false;
        void submitQuick(token);
      }
    },
    [submitQuick],
  );

  const handleQuickSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setQuickError("");
    if (!quickPhoneToken) {
      pendingQuick.current = true;
      const started = await quickPhoneRef.current?.requestCode();
      if (!started) pendingQuick.current = false;
      return;
    }
    await submitQuick(quickPhoneToken);
  };

  return (
    <main className="pb-[68px] md:pb-0">
      <section className="relative isolate min-h-[720px] overflow-hidden bg-[#f4f1eb] text-stone-950 sm:min-h-[680px] lg:min-h-[760px]">
        <div className="absolute right-4 top-4 z-20 flex gap-3 sm:right-6 sm:top-6">
          <button
            type="button"
            aria-label="Get Free Design Consultation"
            onClick={() => {
              trackEvent("hero_consultation_click");
              openModal();
            }}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition hover:bg-stone-200"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          <a
            href="#instant-estimate"
            aria-label="Get Instant Estimate"
            onClick={() => trackEvent("instant_estimate_start")}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
          >
            <Ruler className="h-5 w-5" />
          </a>
        </div>

        <div className="relative z-10 mx-auto grid min-h-[720px] max-w-[1500px] items-center gap-6 px-4 pb-10 pt-24 sm:min-h-[680px] sm:px-6 sm:pb-12 sm:pt-28 md:px-10 lg:min-h-[760px] lg:grid-cols-[1.05fr_0.95fr] lg:px-16">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-stone-200 sm:min-h-[480px] lg:h-[620px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-label="Orchid Interiors interior design showcase"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/videos/LP_ORCHID.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-5 z-20 flex h-16 w-[180px] -translate-x-1/2 items-center justify-center sm:top-6">
            <Image
              src="/images/logo.png"
              alt="Orchid Interiors"
              width={180}
              height={80}
              className="h-14 w-full object-contain"
            />
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-[0_25px_80px_rgba(32,25,16,0.10)] sm:p-8">
            {quickSubmitted ? (
              <div className="py-8 text-center text-emerald-950">
                <Check className="mx-auto mb-4 h-8 w-8" />
                <h2 className="text-2xl font-medium">
                  Thank you for getting in touch
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Our team will contact you shortly to discuss your interior
                  requirements.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleQuickSubmit}
                onFocus={() => trackEvent("enquiry_form_start")}
              >
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-stone-500">
                  Free consultation
                </p>
                <h2 className="mb-6 text-3xl font-light tracking-[-0.04em]">
                  Collect Your Details
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <label className="text-xs font-medium text-stone-700">
                    Full Name
                    <input
                      required
                      autoComplete="name"
                      value={quickForm.name}
                      onChange={(e) =>
                        setQuickForm({ ...quickForm, name: e.target.value })
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-stone-900"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="text-xs font-medium text-stone-700">
                    Mobile Number
                    <div className="mt-2 flex h-12 overflow-hidden rounded-xl border border-stone-200 focus-within:border-stone-900">
                      <span className="flex items-center border-r border-stone-200 px-3 text-sm text-stone-500">
                        +91
                      </span>
                      <input
                        required
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        value={quickForm.phone}
                        onChange={(e) => {
                          setQuickPhoneToken("");
                          setQuickForm({
                            ...quickForm,
                            phone: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10),
                          });
                        }}
                        className="min-w-0 flex-1 px-3 text-sm outline-none"
                        placeholder="10-digit mobile"
                      />
                    </div>
                  </label>
                  <label className="text-xs font-medium text-stone-700">
                    City / Location
                    <input
                      required
                      autoComplete="address-level2"
                      value={quickForm.location}
                      onChange={(e) =>
                        setQuickForm({ ...quickForm, location: e.target.value })
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-stone-900"
                      placeholder="Coimbatore"
                    />
                  </label>
                  <label className="text-xs font-medium text-stone-700">
                    Property Type
                    <select
                      required
                      value={quickForm.propertyType}
                      onChange={(e) =>
                        setQuickForm({
                          ...quickForm,
                          propertyType: e.target.value,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-stone-900"
                    >
                      <option value="">Select property</option>
                      {[
                        "1 BHK",
                        "2 BHK",
                        "3 BHK",
                        "4 BHK",
                        "Villa",
                        "Commercial",
                      ].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <PhoneVerificationField
                  ref={quickPhoneRef}
                  captchaTriggerRef={quickSubmitRef}
                  phone={quickForm.phone}
                  onPhoneChange={(phone) =>
                    setQuickForm({ ...quickForm, phone })
                  }
                  onVerified={handleQuickVerified}
                  showPhoneInput={false}
                  compact
                />
                {quickError && (
                  <p role="alert" className="mt-3 text-sm text-red-700">
                    {quickError}
                  </p>
                )}
                <button
                  ref={quickSubmitRef}
                  type="submit"
                  disabled={quickSubmitting}
                  className="mt-4 min-h-12 w-full rounded-xl bg-stone-950 px-6 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-60"
                >
                  {quickSubmitting
                    ? "Sending request..."
                    : "Book My Free Consultation"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section
        id="consultation"
        className="relative z-20 bg-[#f4f1eb] px-4 py-12 sm:px-6 md:px-10 md:py-16 lg:px-16"
      >
        <div className="mx-auto grid max-w-[1500px] gap-8 rounded-[2rem] bg-white p-5 shadow-[0_25px_80px_rgba(32,25,16,0.08)] sm:p-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:p-10">
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-stone-500">
              Free consultation
            </p>
            <h2 className="text-3xl font-light tracking-[-0.04em] text-stone-950 sm:text-4xl">
              Let&apos;s Design Your Dream Home
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-stone-600">
              Share a few details and our team will help identify the right next
              step for your space.
            </p>
          </div>

          {quickSubmitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
              <Check className="mb-3 h-6 w-6" />
              <h3 className="text-xl font-medium">
                Thank you for getting in touch
              </h3>
              <p className="mt-2 text-sm leading-6">
                Our team will contact you shortly to discuss your interior
                requirements.
              </p>
              <a
                href="tel:+919790352563"
                className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
              >
                Call +91 97903 52563
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleQuickSubmit}
              className="grid gap-4 sm:grid-cols-2"
              onFocus={() => trackEvent("enquiry_form_start")}
            >
              <label className="text-xs font-medium text-stone-700">
                Full Name
                <input
                  required
                  autoComplete="name"
                  value={quickForm.name}
                  onChange={(e) =>
                    setQuickForm({ ...quickForm, name: e.target.value })
                  }
                  className="mt-2 h-14 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-stone-900"
                  placeholder="Your name"
                />
              </label>
              <label className="text-xs font-medium text-stone-700">
                Mobile Number
                <div className="mt-2 flex h-14 overflow-hidden rounded-xl border border-stone-200 focus-within:border-stone-900">
                  <span className="flex items-center border-r border-stone-200 px-4 text-sm text-stone-500">
                    +91
                  </span>
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={quickForm.phone}
                    onChange={(e) => {
                      setQuickPhoneToken("");
                      setQuickForm({
                        ...quickForm,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      });
                    }}
                    className="min-w-0 flex-1 px-4 text-sm outline-none"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </label>
              <label className="text-xs font-medium text-stone-700">
                City / Location
                <input
                  required
                  autoComplete="address-level2"
                  value={quickForm.location}
                  onChange={(e) =>
                    setQuickForm({ ...quickForm, location: e.target.value })
                  }
                  className="mt-2 h-14 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-stone-900"
                  placeholder="Coimbatore"
                />
              </label>
              <label className="text-xs font-medium text-stone-700">
                Property Type
                <select
                  required
                  value={quickForm.propertyType}
                  onChange={(e) =>
                    setQuickForm({ ...quickForm, propertyType: e.target.value })
                  }
                  className="mt-2 h-14 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-stone-900"
                >
                  <option value="">Select property</option>
                  {[
                    "1 BHK",
                    "2 BHK",
                    "3 BHK",
                    "4 BHK",
                    "Villa",
                    "Commercial",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-stone-700 sm:col-span-2">
                Service Required
                <select
                  required
                  value={quickForm.service}
                  onChange={(e) =>
                    setQuickForm({ ...quickForm, service: e.target.value })
                  }
                  className="mt-2 h-14 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-stone-900"
                >
                  <option value="">Select service</option>
                  {[
                    "Full Home Interior",
                    "Modular Kitchen",
                    "Bedroom",
                    "Living Room",
                    "Renovation",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <div className="sm:col-span-2">
                <PhoneVerificationField
                  ref={quickPhoneRef}
                  captchaTriggerRef={quickSubmitRef}
                  phone={quickForm.phone}
                  onPhoneChange={(phone) =>
                    setQuickForm({ ...quickForm, phone })
                  }
                  onVerified={handleQuickVerified}
                  showPhoneInput={false}
                  compact
                />
                {quickError && (
                  <p role="alert" className="mb-3 text-sm text-red-700">
                    {quickError}
                  </p>
                )}
                <button
                  ref={quickSubmitRef}
                  type="submit"
                  disabled={quickSubmitting}
                  className="min-h-14 w-full rounded-xl bg-stone-950 px-6 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-60"
                >
                  {quickSubmitting
                    ? "Sending request..."
                    : "Book My Free Consultation"}
                </button>
                <p className="mt-3 text-[10px] leading-5 text-stone-500">
                  By submitting, you agree to be contacted about your enquiry.
                  We use your details only to respond to this request.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-10 md:py-20 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-10 max-w-2xl">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-stone-500">
              Why Orchid Interiors
            </p>
            <h2 className="text-4xl font-light tracking-[-0.04em] text-stone-950 sm:text-5xl">
              Designed around the way you live.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
            {strengths.map(({ icon: Icon, title, text }) => (
              <article key={title} className="bg-white p-6 sm:p-8">
                <Icon
                  className="mb-8 h-6 w-6 text-stone-700"
                  strokeWidth={1.4}
                />
                <h3 className="text-xl font-medium text-stone-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <InteriorReels reels={reels} />

      <InstantEstimate />

      <section className="bg-white px-4 py-16 sm:px-6 md:px-10 md:py-20 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-stone-500">
                Our Design Process
              </p>
              <h2 className="text-4xl font-light tracking-[-0.04em] text-stone-950 sm:text-5xl">
                A clear journey from idea to interior.
              </h2>
            </div>
            <button
              type="button"
              onClick={openModal}
              className="hidden min-h-14 w-fit items-center gap-3 rounded-full bg-stone-950 px-7 text-sm text-white lg:inline-flex"
            >
              Start My Interior Journey <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(([title, text], index) => (
              <article key={title} className="bg-white p-6 sm:p-7">
                <span className="mb-10 flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-xs text-stone-500">
                  0{index + 1}
                </span>
                <h3 className="text-lg font-medium text-stone-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[520px] overflow-hidden bg-stone-950 text-white">
        <Image
          src="/images/hero-2.png"
          alt="Premium Orchid Interiors home interior"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1500px] items-center px-4 py-16 sm:px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.32em] text-white/65">
              Start your project
            </p>
            <h2 className="text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.98] tracking-[-0.055em]">
              Your Dream Home Starts With One Conversation.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Connect with Orchid Interiors and take the first step toward a
              home designed around your lifestyle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  trackEvent("final_consultation_click");
                  openModal();
                }}
                className="inline-flex min-h-14 items-center justify-between gap-8 rounded-full bg-white px-6 text-sm text-black"
              >
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={whastappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("whatsapp_click")}
                className="inline-flex min-h-14 items-center justify-between gap-8 rounded-full border border-white/50 px-6 text-sm text-white"
              >
                Chat on WhatsApp <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {!keyboardOpen && (
        <nav
          aria-label="Quick contact actions"
          className="fixed inset-x-0 bottom-0 z-[60] grid grid-cols-3 border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] md:hidden"
        >
          <a
            href="tel:+919790352563"
            onClick={() => trackEvent("phone_click")}
            className="flex min-h-[68px] flex-col items-center justify-center gap-1 text-xs font-medium text-stone-950"
          >
            <Phone className="h-5 w-5" />
            Call Now
          </a>
          <a
            href={whastappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("whatsapp_click")}
            className="flex min-h-[68px] flex-col items-center justify-center gap-1 text-xs font-medium text-stone-950"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              trackEvent("mobile_quote_click");
              document
                .getElementById("consultation")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex min-h-[68px] flex-col items-center justify-center gap-1 bg-stone-950 text-xs font-medium text-white"
          >
            <Layers3 className="h-5 w-5" />
            Get Free Quote
          </button>
        </nav>
      )}
    </main>
  );
}

function InstantEstimate() {
  const [step, setStep] = useState(1);
  const [bhk, setBhk] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [packageType, setPackageType] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const phoneRef = useRef<PhoneVerificationFieldHandle>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const pending = useRef(false);

  const submitEstimate = useCallback(
    async (verificationToken: string) => {
      setSubmitting(true);
      setError("");
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "Instant Estimate",
            name,
            phone: `+91${phone}`,
            phoneVerificationToken: verificationToken,
            location,
            projectType: bhk,
            services: rooms,
            budget: packageType,
            message: `Instant estimate request. Property: ${bhk}. Rooms: ${rooms.join(", ") || "Not selected"}. Package preference: ${packageType || "Not selected"}.`,
            consent: true,
            ...getUtmPayload(),
          }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(
            data?.error || "We could not submit your estimate request.",
          );
        setSubmitted(true);
        trackEvent("instant_estimate_completion");
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [bhk, location, name, packageType, phone, rooms],
  );

  const handleVerified = useCallback(
    (verificationToken: string) => {
      setToken(verificationToken);
      if (pending.current) {
        pending.current = false;
        void submitEstimate(verificationToken);
      }
    },
    [submitEstimate],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!token) {
      pending.current = true;
      const started = await phoneRef.current?.requestCode();
      if (!started) pending.current = false;
      return;
    }
    await submitEstimate(token);
  };

  const toggleRoom = (room: string) => {
    setRooms((current) =>
      current.includes(room)
        ? current.filter((item) => item !== room)
        : [...current, room],
    );
  };

  const canContinue =
    (step === 1 && Boolean(bhk)) ||
    (step === 2 && rooms.length > 0) ||
    (step === 3 && Boolean(packageType));

  return (
    <section
      id="instant-estimate"
      className="bg-stone-950 px-4 py-16 text-white sm:px-6 md:px-10 md:py-20 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
            Instant Estimate
          </p>
          <h2 className="text-4xl font-light tracking-[-0.04em] sm:text-5xl">
            Curious About Your Interior Budget?
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/65">
            Tell us a little about your home and explore an initial interior
            estimate. This is a lead request, not a fixed-price quotation.
          </p>
          <div className="mt-8 hidden gap-3 sm:flex">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`h-1 flex-1 rounded-full ${item <= step ? "bg-white" : "bg-white/15"}`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white p-5 text-stone-950 sm:p-8">
          {submitted ? (
            <div className="py-10 text-center">
              <Check className="mx-auto mb-4 h-8 w-8" />
              <h3 className="text-2xl font-light">
                Your estimate request is received
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-600">
                Our team can now prepare the next conversation around your space
                and requirements.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-7 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-stone-500">
                  Step {step} of 4
                </span>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex min-h-11 items-center gap-2 text-xs text-stone-600"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
              </div>
              {step === 1 && (
                <div>
                  <h3 className="mb-5 text-2xl font-light">Select BHK Type</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      "1 BHK",
                      "2 BHK",
                      "3 BHK",
                      "4 BHK",
                      "Villa",
                      "Commercial",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setBhk(item)}
                        className={`min-h-16 rounded-xl border px-3 text-sm ${bhk === item ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 hover:border-stone-500"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h3 className="mb-5 text-2xl font-light">Choose Rooms</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Living Room",
                      "Modular Kitchen",
                      "Bedroom",
                      "Dining",
                      "Wardrobe",
                      "Full Home",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleRoom(item)}
                        className={`min-h-16 rounded-xl border px-3 text-left text-sm ${rooms.includes(item) ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 hover:border-stone-500"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <h3 className="mb-5 text-2xl font-light">Select Package</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Essential", "Signature", "Bespoke"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPackageType(item)}
                        className={`min-h-24 rounded-xl border p-4 text-left ${packageType === item ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 hover:border-stone-500"}`}
                      >
                        <span className="block text-sm font-medium">
                          {item}
                        </span>
                        <span
                          className={`mt-2 block text-xs ${packageType === item ? "text-white/65" : "text-stone-500"}`}
                        >
                          Discuss design scope
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <h3 className="text-2xl font-light">
                    Get Your Estimate Request
                  </h3>
                  <input
                    required
                    aria-label="Full name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-stone-900"
                    placeholder="Full name"
                  />
                  <div className="flex h-14 overflow-hidden rounded-xl border border-stone-200 focus-within:border-stone-900">
                    <span className="flex items-center border-r border-stone-200 px-4 text-sm text-stone-500">
                      +91
                    </span>
                    <input
                      required
                      aria-label="Mobile number"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        setToken("");
                        setPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        );
                      }}
                      className="min-w-0 flex-1 px-4 text-sm outline-none"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <input
                    required
                    aria-label="City or location"
                    autoComplete="address-level2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-14 rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-stone-900"
                    placeholder="City / location"
                  />
                  <PhoneVerificationField
                    ref={phoneRef}
                    captchaTriggerRef={submitRef}
                    phone={phone}
                    onPhoneChange={setPhone}
                    onVerified={handleVerified}
                    showPhoneInput={false}
                    compact
                  />
                  {error && (
                    <p role="alert" className="text-sm text-red-700">
                      {error}
                    </p>
                  )}
                  <button
                    ref={submitRef}
                    type="submit"
                    disabled={submitting}
                    className="min-h-14 rounded-xl bg-stone-950 px-6 text-sm text-white disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Estimate Request"}
                  </button>
                </form>
              )}
              {step < 4 && (
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep(step + 1)}
                  className="mt-6 flex min-h-14 w-full items-center justify-between rounded-xl bg-stone-950 px-5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
