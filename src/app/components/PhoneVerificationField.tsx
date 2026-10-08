"use client";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { useEffect, useId, useRef, useState } from "react";
import { getFirebaseClientAuth } from "@/lib/firebase-client";

export default function PhoneVerificationField({
  phone,
  onPhoneChange,
  onVerified,
  compact = false,
  showPhoneInput = true,
}: {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onVerified: (token: string) => void;
  compact?: boolean;
  showPhoneInput?: boolean;
}) {
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null,
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verified, setVerified] = useState(false);
  const verifier = useRef<RecaptchaVerifier | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const digits = phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");

  useEffect(
    () => () => {
      verifier.current?.clear();
    },
    [],
  );

  async function sendCode() {
    setError("");
    if (digits.length !== 10) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setSending(true);
    try {
      const auth = getFirebaseClientAuth();
      if (!container.current) {
        throw new Error(
          "Phone verification could not be initialized. Please try again.",
        );
      }
      verifier.current ??= new RecaptchaVerifier(auth, container.current, {
        size: "invisible",
      });
      const result = await signInWithPhoneNumber(
        auth,
        `+91${digits}`,
        verifier.current,
      );
      setConfirmation(result);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Could not send a verification code. Please try again.",
      );
      verifier.current?.clear();
      verifier.current = null;
    } finally {
      setSending(false);
    }
  }

  async function verifyCode() {
    if (!confirmation || !/^\d{6}$/.test(code)) return;
    setError("");
    setSending(true);
    try {
      const credential = await confirmation.confirm(code);
      const token = await credential.user.getIdToken();
      setVerified(true);
      onVerified(token);
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "The code is invalid or expired. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  const inputClass = compact
    ? "min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs text-black outline-none"
    : "min-w-0 flex-1 border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none focus:border-black focus:ring-1 focus:ring-black";

  return (
    <div className="space-y-2">
      {showPhoneInput ? (
        <label
          className={`block ${compact ? "text-[11px]" : "mb-2 text-sm"} font-medium text-black`}
          htmlFor={inputId}
        >
          Phone <span className="text-red-600">*</span>
        </label>
      ) : (
        <p className="text-xs text-stone-600">
          Verify this number: +91 {digits}
        </p>
      )}
      {showPhoneInput ? (
        <div
          className={
            compact
              ? "flex overflow-hidden rounded-xl border border-stone-200 bg-stone-50 focus-within:border-stone-500"
              : "flex overflow-hidden border border-stone-300 bg-white focus-within:border-black"
          }
        >
          <span
            className={`flex items-center border-r border-stone-200 px-3 text-stone-500 ${compact ? "text-xs" : "text-sm"}`}
          >
            +91
          </span>
          <input
            id={inputId}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            required
            value={digits}
            onChange={(event) => {
              setConfirmation(null);
              setCode("");
              setVerified(false);
              setError("");
              onVerified("");
              verifier.current?.clear();
              verifier.current = null;
              onPhoneChange(event.target.value.replace(/\D/g, "").slice(0, 10));
            }}
            placeholder="10-digit mobile number"
            className={inputClass}
          />
        </div>
      ) : null}

      {confirmation && !verified ? (
        <div className="flex gap-2">
          <input
            aria-label="SMS verification code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="6-digit SMS code"
            className={`${inputClass} rounded-lg border border-stone-300 bg-white`}
          />
          <button
            type="button"
            onClick={() => void verifyCode()}
            disabled={sending || code.length !== 6}
            className="shrink-0 rounded-lg bg-stone-900 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {sending ? "Verifying…" : "Verify"}
          </button>
        </div>
      ) : null}

      {!verified ? (
        <button
          type="button"
          onClick={() => void sendCode()}
          disabled={sending || digits.length !== 10}
          className="text-xs font-medium text-stone-700 underline underline-offset-4 disabled:opacity-50"
        >
          {sending
            ? "Sending code…"
            : confirmation
              ? "Send a new code"
              : "Send SMS verification code"}
        </button>
      ) : (
        <p className="text-xs font-medium text-emerald-700">
          Phone number verified.
        </p>
      )}

      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
      <div ref={container} />
    </div>
  );
}
