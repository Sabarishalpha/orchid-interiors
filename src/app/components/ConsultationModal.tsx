"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowLeft, X } from "lucide-react";
import PhoneVerificationField, {
  type PhoneVerificationFieldHandle,
} from "./PhoneVerificationField";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({
  isOpen,
  onClose,
}: ConsultationModalProps) {
  const [step, setStep] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success">(
    "idle",
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedPhoneToken, setVerifiedPhoneToken] = useState("");
  const [error, setError] = useState("");
  const phoneVerificationRef = useRef<PhoneVerificationFieldHandle>(null);
  const phoneSubmitButtonRef = useRef<HTMLButtonElement>(null);
  const pendingSubmission = useRef(false);

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
    if (field === "phone") setVerifiedPhoneToken("");
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      return;
    }

    setStep(2);
  };

  const submitRequest = useCallback(async (verificationToken: string) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "consultation-modal",
          name: formData.name,
          phone: `+91${formData.phone}`,
          phoneVerificationToken: verificationToken,
          requirement: formData.requirement,
          budget: formData.budget,
          possession: formData.possession,
          message: `Consultation request: ${formData.requirement || "General consultation"}. Budget: ${formData.budget || "Not specified"}. Possession: ${formData.possession || "Not specified"}.`,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          setVerifiedPhoneToken("");
        }
        throw new Error(
          data?.error ||
            "We could not send your consultation request right now.",
        );
      }

      setSuccessMessage(
        data?.message ?? "Your verified consultation request has been sent to our team.",
      );
      setSubmissionStatus("success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not send your consultation request right now.";

      setError(message);
      console.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!verifiedPhoneToken) {
      pendingSubmission.current = true;
      const codeRequested = await phoneVerificationRef.current?.requestCode();
      if (!codeRequested) pendingSubmission.current = false;
      return;
    }
    await submitRequest(verifiedPhoneToken);
  };

  const handleCloseModal = useCallback(() => {
    setVerifiedPhoneToken("");
    pendingSubmission.current = false;
    setError("");
    setSuccessMessage("");
    setStep(1);
    setSubmissionStatus("idle");
    setFormData({
      name: "",
      phone: "",
      requirement: "",
      budget: "",
      possession: "",
    });
    onClose();
  }, [onClose]);

  const handlePhoneVerified = useCallback((token: string) => {
    setVerifiedPhoneToken(token);
    if (pendingSubmission.current) {
      pendingSubmission.current = false;
      void submitRequest(token);
    }
  }, [submitRequest]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") handleCloseModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleCloseModal]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleCloseModal}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 p-4"
      >
        <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 md:p-9">
          {/* Close button */}
          <button
            onClick={handleCloseModal}
            className="absolute right-6 top-6 text-black/40 transition-colors hover:text-black/60 sm:right-8 sm:top-8"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <div className="md:grid md:grid-cols-[0.85fr_1.15fr] md:gap-10">
            {/* FORM HEADER */}
            <div className="mb-7 pr-8 md:mb-0">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">
                  Consultation request
                </span>

                <span className="text-xs text-black/35">
                  Step 0{step} of 02
                </span>
              </div>

              <h2
                id="consultation-modal-title"
                className="text-2xl font-medium tracking-[-0.03em] text-black sm:text-3xl"
              >
                Design your space with confidence
              </h2>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Tell us a little about your project and our design team will get
                in touch to arrange your complimentary consultation.
              </p>
            </div>

            {submissionStatus === "success" ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
                <h3 className="text-lg font-medium text-emerald-950">
                  Thank you for getting in touch
                </h3>
                <p className="mt-2 text-sm leading-6 text-emerald-900/70">
                  {successMessage}
                </p>
                <a
                  href="tel:+919790352563"
                  className="mt-4 inline-block text-sm font-medium text-emerald-950 underline underline-offset-2"
                >
                  Call +91 97903 52563
                </a>
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
                        htmlFor="modal-name"
                        className="mb-2 block text-xs font-medium text-black/60"
                      >
                        Name
                      </label>

                      <input
                        id="modal-name"
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
                        htmlFor="modal-phone"
                        className="mb-2 block text-xs font-medium text-black/60"
                      >
                        Phone Number
                      </label>

                      <div className="flex h-14 overflow-hidden rounded-xl border border-black/10 bg-[#fafafa] transition-all focus-within:border-black/30 focus-within:bg-white">
                        <div className="flex items-center border-r border-black/10 px-4 text-sm text-black/60">
                          +91
                        </div>
                        <input
                          id="modal-phone"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) =>
                            updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
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
                      onClick={() => {
                        setStep(1);
                        setVerifiedPhoneToken("");
                        pendingSubmission.current = false;
                        setError("");
                      }}
                      className="mb-2 flex items-center gap-2 text-xs text-black/45 transition-colors hover:text-black"
                    >
                      <ArrowLeft size={14} />
                      Back
                    </button>

                    {/* REQUIREMENT */}
                    <div className="relative">
                      <label
                        htmlFor="modal-requirement"
                        className="mb-2 block text-xs font-medium text-black/60"
                      >
                        What is your interior requirement?
                      </label>

                      <div className="relative">
                        <select
                          id="modal-requirement"
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
                        htmlFor="modal-budget"
                        className="mb-2 block text-xs font-medium text-black/60"
                      >
                        Your Approx. Interior Budget?
                      </label>

                      <div className="relative">
                        <select
                          id="modal-budget"
                          value={formData.budget}
                          onChange={(e) =>
                            updateField("budget", e.target.value)
                          }
                          required
                          className="h-14 w-full appearance-none rounded-xl border border-black/10 bg-[#fafafa] px-4 pr-12 text-sm text-black outline-none transition-all focus:border-black/30 focus:bg-white"
                        >
                          <option value="">Select budget (Min. ₹2 Lacs)</option>
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
                        htmlFor="modal-possession"
                        className="mb-2 block text-xs font-medium text-black/60"
                      >
                        Do you have possession of property?
                      </label>

                      <div className="relative">
                        <select
                          id="modal-possession"
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

                    <PhoneVerificationField
                      ref={phoneVerificationRef}
                      captchaTriggerRef={phoneSubmitButtonRef}
                      phone={formData.phone}
                      onPhoneChange={(phone) => updateField("phone", phone)}
                      onVerified={handlePhoneVerified}
                      showPhoneInput={false}
                    />

                    {error ? (
                      <p aria-live="assertive" className="text-sm text-red-700">
                        {error}
                      </p>
                    ) : null}

                    {/* SUBMIT */}
                    <button
                      ref={phoneSubmitButtonRef}
                      type="submit"
                      disabled={isSubmitting}
                      className="group mt-2 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-black text-sm font-medium text-white transition-all duration-300 hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending request..." : "Send request"}
                      {!isSubmitting && (
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>

          {/* PRIVACY */}
          <p className="mt-5 text-[9px] leading-4 text-black/35">
            By submitting this form, you agree to our{" "}
            <a
              href="/privacy"
              className="font-medium text-black/55 underline underline-offset-2"
            >
              privacy policy
            </a>{" "}
            &{" "}
            <a
              href="/terms"
              className="font-medium text-black/55 underline underline-offset-2"
            >
              terms and conditions
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
