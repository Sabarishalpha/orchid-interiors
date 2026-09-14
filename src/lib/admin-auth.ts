import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "orchid_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && getSecret(),
  );
}

export function isValidCredentials(username: string, password: string) {
  return (
    isAdminConfigured() &&
    safeEqual(username, process.env.ADMIN_USERNAME ?? "") &&
    safeEqual(password, process.env.ADMIN_PASSWORD ?? "")
  );
}

export function createSessionValue(username: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${username}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSession(value: string | undefined) {
  if (!value || !getSecret()) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [username, expiresAt, signature] = parts;
  const payload = `${username}.${expiresAt}`;
  const expires = Number(expiresAt);

  return (
    Number.isSafeInteger(expires) &&
    expires > Math.floor(Date.now() / 1000) &&
    safeEqual(signature, sign(payload))
  );
}

export async function isAdmin() {
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(COOKIE_NAME)?.value);
}

export function getSessionCookie(value: string) {
  return {
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  };
}

export function getExpiredSessionCookie() {
  return {
    ...getSessionCookie(""),
    maxAge: 0,
  };
}
