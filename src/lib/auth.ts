import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "orchid_admin_session";

export function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "orchid-admin-dev-secret";
}

export function signSession(value: string) {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("hex");
}

export function createSessionToken(userId: number, username: string) {
  const payload = `${userId}:${username}:${Date.now()}`;
  const signature = signSession(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const payload = parts[0];
  const expectedSignature = signSession(payload);

  try {
    const actualSignature = Buffer.from(parts[1], "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (actualSignature.length !== expectedBuffer.length) {
      return null;
    }

    if (!timingSafeEqual(actualSignature, expectedBuffer)) {
      return null;
    }

    const [userId, username, timestamp] = payload.split(":");
    const parsedUserId = Number(userId);
    const parsedTimestamp = Number(timestamp);

    if (!parsedUserId || Number.isNaN(parsedTimestamp)) {
      return null;
    }

    return {
      userId: parsedUserId,
      username,
      issuedAt: parsedTimestamp,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value) ?? null;
}

export function setAdminSessionCookie(response: Response, userId: number, username: string) {
  const token = createSessionToken(userId, username);
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";

  response.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${secureFlag}`,
  );
}

export function clearAdminSessionCookie(response: Response) {
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";

  response.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`,
  );
}
