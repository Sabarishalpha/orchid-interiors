import { randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { clientAddress, isRateLimited, jsonLimit } from "@/lib/security";
import {
  ADMIN_OTP_COOKIE,
  ADMIN_OTP_COOKIE_PATH,
  ADMIN_OTP_MAX_AGE,
  adminCookieOptions,
  createAdminOtpChallenge,
  getAdminAuthConfig,
} from "@/lib/admin-auth";

function invalidRequest() {
  return NextResponse.json(
    { error: "Enter a valid email address." },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  if (
    jsonLimit(request, 4 * 1024) ||
    isRateLimited(`admin-otp:${clientAddress(request)}`, 3, 15 * 60 * 1000)
  ) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalidRequest();
  }

  const email =
    typeof body === "object" && body !== null && "email" in body &&
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return invalidRequest();
  }

  const config = getAdminAuthConfig();
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL;
  if (!config || !apiKey || !fromAddress) {
    console.error(
      "Admin sign-in is not configured. Set ADMIN_EMAIL, ADMIN_SESSION_SECRET, RESEND_API_KEY, and RESEND_FROM_EMAIL.",
    );
    return NextResponse.json(
      { error: "Admin sign-in is temporarily unavailable." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({
    message: "If this email is authorized, a sign-in code will be sent.",
  });
  if (email !== config.email) return response;

  if (isRateLimited(`admin-otp-email:${config.email}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please try again later." },
      { status: 429 },
    );
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const resend = new Resend(apiKey);
  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: [config.email],
      subject: "Your Orchid Interiors admin sign-in code",
      text: `Your admin sign-in code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
    });

    if (result.error) {
      console.error("Admin sign-in email failed:", result.error);
      return NextResponse.json(
        { error: "The sign-in email could not be sent. Please try again later." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error(
      "Admin sign-in email failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { error: "The sign-in email could not be sent. Please try again later." },
      { status: 502 },
    );
  }

  response.cookies.set(
    ADMIN_OTP_COOKIE,
    createAdminOtpChallenge(config.email, code, config.secret),
    adminCookieOptions(ADMIN_OTP_MAX_AGE, ADMIN_OTP_COOKIE_PATH),
  );
  return response;
}
