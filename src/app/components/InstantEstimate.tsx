"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";

const steps = ["Home", "Spaces", "Experience", "Details"];
const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK+"];
const sizeOptions = ["Small - Below 1800 sq.ft", "Large - Above 1800 sq.ft"];
const roomOptions = [
  "Living Room",
  "Modular Kitchen",
  "Master Bedroom",
  "Bedroom",
  "Dining Room",
  "Pooja Room",
  "TV Unit",
  "Wardrobe",
  "Full Home",
];
const packages = [
  {
    name: "Essential",
    description: "Smart, functional interiors for everyday living.",
  },
  {
    name: "Premium",
    description: "A complete lifestyle-focused design experience.",
  },
  {
    name: "Luxury",
    description: "High-end materials, detailing and customization.",
  },
];

type EstimateData = {
  bhk: string;
  size: string;
  rooms: string[];
  package: string;
  name: string;
  phone: string;
  email: string;
  location: string;
};

const initialData: EstimateData = {
  bhk: "",
  size: "",
  rooms: [],
  package: "",
  name: "",
  phone: "",
  email: "",
  location: "",
};

export default function InstantEstimate() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const update = <Key extends keyof EstimateData>(
    key: Key,
    value: EstimateData[Key],
  ) => {
    setData((current) => ({ ...current, [key]: value }));
  };

  const canContinue = () => {
    if (step === 1) return Boolean(data.bhk && data.size);
    if (step === 2) return data.rooms.length > 0;
    return Boolean(data.package);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          location: data.location,
          propertyType: data.bhk,
          interiorRequirement: data.rooms.join(", "),
          propertySize: data.size,
          budget: data.package,
          timeline: "To be discussed",
          message: `Instant estimate request: ${data.bhk}, ${data.size}, ${data.package} package. Spaces: ${data.rooms.join(", ")}.`,
        }),
      });

      if (!response.ok) throw new Error("Unable to submit estimate request");
      setStatus("success");
    } catch (error) {
      console.error("Estimate submission error:", error);
      setStatus("error");
    }
  };

  return (
    <div
      id="estimate"
      className="bg-white p-6 text-black shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8"
    >
      {status === "success" ? (
        <div className="flex min-h-[390px] flex-col justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
            <Check />
          </div>
          <p className="mt-8 text-xs tracking-[0.25em] text-black/45 uppercase">
            Request received
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-light sm:text-4xl">
            Your design conversation starts here.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-black/60">
            Our team has received your requirements and will contact you shortly
            with the next step.
          </p>
          <a
            href="#reels"
            className="mt-8 inline-flex w-fit border-b border-black pb-2 text-sm"
          >
            Explore our work <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] tracking-[0.25em] text-black/45 uppercase">
                Instant estimate
              </p>
              <h2 className="mt-3 max-w-sm text-3xl leading-[1.05] font-light sm:text-4xl">
                Let&apos;s shape the right starting point.
              </h2>
            </div>
            <span className="shrink-0 text-xs text-black/45">0{step} / 04</span>
          </div>
          <div className="mt-7 flex gap-1" aria-label={`Step ${step} of 4`}>
            {steps.map((label, index) => (
              <span
                key={label}
                className={`h-1 flex-1 ${index < step ? "bg-black" : "bg-black/10"}`}
                title={label}
              />
            ))}
          </div>

          {step < 4 && (
            <div className="mt-10">
              {step === 1 && (
                <>
                  <p className="text-xs tracking-[0.2em] text-black/45 uppercase">
                    What are you designing?
                  </p>
                  <p className="mt-2 text-sm text-black/55">
                    Select your home type and approximate size.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {bhkOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => update("bhk", option)}
                        className={`border px-3 py-4 text-sm transition-colors ${data.bhk === option ? "border-black bg-black text-white" : "border-black/15 hover:border-black/50"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <p className="mt-8 text-xs tracking-[0.2em] text-black/45 uppercase">
                    Home size
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {sizeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => update("size", option)}
                        className={`border px-4 py-4 text-left text-sm transition-colors ${data.size === option ? "border-black bg-black text-white" : "border-black/15 hover:border-black/50"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <p className="text-xs tracking-[0.2em] text-black/45 uppercase">
                    Which spaces should we design?
                  </p>
                  <p className="mt-2 text-sm text-black/55">
                    Choose everything you want us to consider.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {roomOptions.map((option) => {
                      const selected = data.rooms.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            update(
                              "rooms",
                              selected
                                ? data.rooms.filter((room) => room !== option)
                                : [...data.rooms, option],
                            )
                          }
                          className={`border px-3 py-3 text-left text-sm transition-colors ${selected ? "border-black bg-black text-white" : "border-black/15 hover:border-black/50"}`}
                        >
                          {selected ? "✓ " : ""}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <p className="text-xs tracking-[0.2em] text-black/45 uppercase">
                    Choose your design experience
                  </p>
                  <div className="mt-6 space-y-2">
                    {packages.map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => update("package", option.name)}
                        className={`w-full border p-5 text-left transition-colors ${data.package === option.name ? "border-black bg-black text-white" : "border-black/15 hover:border-black/50"}`}
                      >
                        <span className="flex items-center justify-between text-lg font-light">
                          {option.name}
                          {option.name === "Premium" && (
                            <span className="text-[9px] tracking-[0.15em] text-black/60 uppercase">
                              Most popular
                            </span>
                          )}
                        </span>
                        <span
                          className={`mt-2 block text-sm leading-6 ${data.package === option.name ? "text-white/65" : "text-black/55"}`}
                        >
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              <button
                type="button"
                disabled={!canContinue()}
                onClick={() => setStep((current) => current + 1)}
                className="mt-8 flex w-full items-center justify-center gap-2 bg-black px-5 py-4 text-sm text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/20"
              >
                {step === 3 ? "Continue to my estimate" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={submit} className="mt-10">
              <p className="text-xs tracking-[0.2em] text-black/45 uppercase">
                Your estimate is almost ready.
              </p>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Share your details and a designer will prepare the right next
                step for your space.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["name", "Name", "text"],
                    ["phone", "WhatsApp number", "tel"],
                    ["email", "Email address (optional)", "email"],
                    ["location", "Project location", "text"],
                  ] as const
                ).map(([key, label, type]) => (
                  <label key={key} className="text-xs text-black/60">
                    {label}
                    <input
                      required={key !== "email"}
                      type={type}
                      value={data[key]}
                      onChange={(event) => update(key, event.target.value)}
                      className="mt-2 w-full border-b border-black/20 bg-transparent px-0 py-3 text-sm text-black outline-none focus:border-black"
                    />
                  </label>
                ))}
              </div>
              <p className="mt-6 text-[11px] leading-5 text-black/45">
                Your details are private. We will only contact you regarding
                your project.
              </p>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-black px-5 py-4 text-sm text-white transition-colors hover:bg-black/80 disabled:bg-black/40"
              >
                {status === "submitting" ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Sending
                    request
                  </>
                ) : (
                  "Show my estimate"
                )}
                <ArrowRight className="h-4 w-4" />
              </button>
              {status === "error" && (
                <p className="mt-3 text-center text-xs text-red-700">
                  We couldn&apos;t send your request. Please try again.
                </p>
              )}
              <button
                type="button"
                onClick={() => setStep(3)}
                className="mt-5 flex items-center gap-2 text-xs text-black/50 hover:text-black"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
