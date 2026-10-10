"use client";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from "react";
import { getFirebaseClientAuth } from "@/lib/firebase-client";

export type PhoneVerificationFieldHandle = {
  requestCode: () => Promise<boolean>;
};

type PhoneVerificationFieldProps = {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onVerified: (token: string) => void;
  captchaTriggerRef?: RefObject<HTMLButtonElement | null>;
  compact?: boolean;
  showPhoneInput?: boolean;
};

const PhoneVerificationField = forwardRef<
  PhoneVerificationFieldHandle,
  PhoneVerificationFieldProps
>(function PhoneVerificationField(
  {
    phone,
    onPhoneChange,
    onVerified,
    captchaTriggerRef,
    compact = false,
    showPhoneInput = true,
  },
  ref,
) {
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null,
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verified, setVerified] = useState(false);
  const verifier = useRef<RecaptchaVerifier | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const verificationAttempt = useRef(0);
  const verifying = useRef(false);
  const inputId = useId();
  const digits = phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");

  useEffect(
    () => () => {
      verifier.current?.clear();
    },
    [],
  );

  const sendCode = useCallback(async () => {
    setError("");
    if (sending) return true;
    if (digits.length !== 10) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return false;
    }

    const attempt = ++verificationAttempt.current;
    setSending(true);
    try {
      const auth = getFirebaseClientAuth();
      const captchaTrigger = captchaTriggerRef?.current;
      const captchaContainer = captchaTrigger ?? container.current;
      if (!captchaContainer) {
        throw new Error(
          "Phone verification could not be initialized. Please try again.",
        );
      }
      verifier.current ??= new RecaptchaVerifier(auth, captchaContainer, {
        size: "invisible",
      });
      await verifier.current.render();
      const result = await signInWithPhoneNumber(
        auth,
        `+91${digits}`,
        verifier.current,
      );
      if (attempt !== verificationAttempt.current) return false;
      setConfirmation(result);
      setCode("");
      return true;
    } catch (sendError) {
      if (attempt !== verificationAttempt.current) return false;
      const errorCode =
        typeof sendError === "object" &&
        sendError !== null &&
        "code" in sendError &&
        typeof sendError.code === "string"
          ? sendError.code
          : "";
      setError(
        errorCode === "auth/invalid-app-credential"
          ? "Firebase could not verify this app. Check that this site is listed in Firebase Authentication's authorized domains, then try again."
          : sendError instanceof Error
            ? sendError.message
            : "Could not send a verification code. Please try again.",
      );
      verifier.current?.clear();
      verifier.current = null;
      return false;
    } finally {
      if (attempt === verificationAttempt.current) setSending(false);
    }
  }, [captchaTriggerRef, digits, sending]);

  const requestCode = useCallback(async () => {
    return sendCode();
  }, [sendCode]);

  useImperativeHandle(ref, () => ({ requestCode }), [requestCode]);

  const verifyCode = useCallback(async (verificationCode: string) => {
    if (!confirmation || !/^\d{6}$/.test(verificationCode) || verifying.current) {
      return;
    }

    const attempt = ++verificationAttempt.current;
    verifying.current = true;
    setError("");
    setSending(true);
    try {
      const credential = await confirmation.confirm(verificationCode);
      if (attempt !== verificationAttempt.current) return;
      const token = await credential.user.getIdToken();
      if (attempt !== verificationAttempt.current) return;
      setVerified(true);
      onVerified(token);
    } catch (verifyError) {
      if (attempt === verificationAttempt.current) {
        setError(
          verifyError instanceof Error
            ? verifyError.message
            : "The code is invalid or expired. Please try again.",
        );
      }
    } finally {
      if (attempt === verificationAttempt.current) {
        verifying.current = false;
        setSending(false);
      }
    }
  }, [confirmation, onVerified]);

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
              verificationAttempt.current += 1;
              verifying.current = false;
              setSending(false);
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
        <div>
          <input
            aria-label="SMS verification code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) => {
              const nextCode = event.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(nextCode);
              if (nextCode.length === 6) void verifyCode(nextCode);
            }}
            placeholder="6-digit SMS code"
            className={`${inputClass} w-full rounded-lg border border-stone-300 bg-white`}
          />
          <p className="mt-1 text-xs text-stone-600">
            Enter the 6-digit code sent to your phone. It will verify automatically.
          </p>
        </div>
      ) : null}

      {sending && !confirmation ? (
        <p role="status" className="text-xs text-stone-600">
          Sending verification code…
        </p>
      ) : null}

      {verified && (
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
});

export default PhoneVerificationField;
