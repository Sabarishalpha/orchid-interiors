import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "orchid-admin-session";
export const ADMIN_OTP_COOKIE = "orchid-admin-otp";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;
export const ADMIN_OTP_MAX_AGE = 60 * 10;
export const ADMIN_OTP_COOKIE_PATH = "/api/admin/auth/verify";

type AdminToken = {
  email: string;
  expiresAt: number;
  nonce?: string;
  codeVerifier?: string;
};

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function createToken(payload: AdminToken, secret: string) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

function readToken(token: string | undefined, secret: string): AdminToken | null {
  if (!token || token.length > 2048) return null;

  const [encodedPayload, signature, extra] = token.split(".");
  if (!encodedPayload || !signature || extra) return null;

  const expectedSignature = Buffer.from(sign(encodedPayload, secret));
  const actualSignature = Buffer.from(signature);
  if (
    expectedSignature.length !== actualSignature.length ||
    !timingSafeEqual(expectedSignature, actualSignature)
  ) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("email" in payload) ||
      typeof payload.email !== "string" ||
      !("expiresAt" in payload) ||
      typeof payload.expiresAt !== "number" ||
      ("nonce" in payload && typeof payload.nonce !== "string") ||
      ("codeVerifier" in payload && typeof payload.codeVerifier !== "string")
    ) {
      return null;
    }

    return payload as AdminToken;
  } catch {
    return null;
  }
}

export function getAdminAuthConfig() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!email || !secret || secret.length < 32) return null;
  return { email, secret };
}

export function createAdminOtpChallenge(email: string, code: string, secret: string) {
  const nonce = randomBytes(16).toString("base64url");
  const codeVerifier = sign(`${nonce}:${code}`, secret);
  return createToken(
    { email, nonce, codeVerifier, expiresAt: Date.now() + ADMIN_OTP_MAX_AGE * 1000 },
    secret,
  );
}

export function verifyAdminOtpChallenge(
  token: string | undefined,
  code: string,
  email: string,
  secret: string,
) {
  const challenge = readToken(token, secret);
  if (
    !challenge ||
    challenge.email !== email ||
    !challenge.nonce ||
    !challenge.codeVerifier ||
    challenge.expiresAt <= Date.now()
  ) {
    return false;
  }

  const expected = Buffer.from(challenge.codeVerifier);
  const actual = Buffer.from(sign(`${challenge.nonce}:${code}`, secret));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createAdminSession(email: string, secret: string) {
  return createToken(
    { email, expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000 },
    secret,
  );
}

export function isValidAdminSession(token: string | undefined, email: string, secret: string) {
  const session = readToken(token, secret);
  return Boolean(
    session && session.email === email && session.expiresAt > Date.now(),
  );
}

export function adminCookieOptions(maxAge: number, path: string) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path,
    maxAge,
  };
}
