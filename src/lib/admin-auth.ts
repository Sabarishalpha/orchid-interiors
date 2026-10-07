import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "orchid-admin-session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

type AdminToken = {
  username: string;
  expiresAt: number;
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
      !("username" in payload) ||
      typeof payload.username !== "string" ||
      !("expiresAt" in payload) ||
      typeof payload.expiresAt !== "number"
    ) {
      return null;
    }

    return payload as AdminToken;
  } catch {
    return null;
  }
}

export function getAdminAuthConfig() {
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !password || !secret || secret.length < 32) return null;
  return { username, password, secret };
}

function credentialDigest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function verifyAdminCredentials(
  username: string,
  password: string,
  config: ReturnType<typeof getAdminAuthConfig>,
) {
  if (!config) return false;
  const usernameMatches = timingSafeEqual(
    credentialDigest(username.trim().toLowerCase()),
    credentialDigest(config.username),
  );
  const passwordMatches = timingSafeEqual(
    credentialDigest(password),
    credentialDigest(config.password),
  );
  return usernameMatches && passwordMatches;
}

export function createAdminSession(username: string, secret: string) {
  return createToken(
    { username, expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000 },
    secret,
  );
}

export function isValidAdminSession(
  token: string | undefined,
  username: string,
  secret: string,
) {
  const session = readToken(token, secret);
  return Boolean(
    session && session.username === username && session.expiresAt > Date.now(),
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
