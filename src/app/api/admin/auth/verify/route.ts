import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_OTP_COOKIE,
  ADMIN_OTP_COOKIE_PATH,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  adminCookieOptions,
  createAdminSession,
  getAdminAuthConfig,
  verifyAdminOtpChallenge,
} from "@/lib/admin-auth";
import { clientAddress, isRateLimited, jsonLimit } from "@/lib/security";

export async function POST(request: NextRequest) {
  if (
    jsonLimit(request, 4 * 1024) ||
    isRateLimited(`admin-otp-verify:${clientAddress(request)}`, 5, 15 * 60 * 1000)
  ) {
    return NextResponse.json(
      { error: "Too many verification attempts. Request a new code later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter the six-digit sign-in code." }, { status: 400 });
  }

  const code =
    typeof body === "object" && body !== null && "code" in body &&
    typeof body.code === "string"
      ? body.code.trim()
      : "";
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the six-digit sign-in code." }, { status: 400 });
  }

  const config = getAdminAuthConfig();
  if (!config) {
    console.error("Admin sign-in is not configured.");
    return NextResponse.json(
      { error: "Admin sign-in is temporarily unavailable." },
      { status: 503 },
    );
  }

  const challenge = request.cookies.get(ADMIN_OTP_COOKIE)?.value;
  if (!verifyAdminOtpChallenge(challenge, code, config.email, config.secret)) {
    return NextResponse.json(
      { error: "The code is invalid or has expired. Request a new code and try again." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSession(config.email, config.secret),
    adminCookieOptions(ADMIN_SESSION_MAX_AGE, "/"),
  );
  response.cookies.set(
    ADMIN_OTP_COOKIE,
    "",
    adminCookieOptions(0, ADMIN_OTP_COOKIE_PATH),
  );
  return response;
}
