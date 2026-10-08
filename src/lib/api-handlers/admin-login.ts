import { NextRequest, NextResponse } from "next/server";
import { clientAddress, isRateLimited, jsonLimit } from "@/lib/security";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  adminCookieOptions,
  createAdminSession,
  getAdminAuthConfig,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (
    jsonLimit(request, 4 * 1024) ||
    isRateLimited(`admin-login:${clientAddress(request)}`, 5, 15 * 60 * 1000)
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
    return NextResponse.json(
      { error: "Enter your username and password." },
      { status: 400 },
    );
  }

  const username =
    typeof body === "object" && body !== null && "username" in body &&
    typeof body.username === "string"
      ? body.username
      : "";
  const password =
    typeof body === "object" && body !== null && "password" in body &&
    typeof body.password === "string"
      ? body.password
      : "";
  if (!username.trim() || username.length > 128 || !password || password.length > 1024) {
    return NextResponse.json(
      { error: "Enter your username and password." },
      { status: 400 },
    );
  }

  const config = getAdminAuthConfig();
  if (!config) {
    console.error(
      "Admin sign-in is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.",
    );
    return NextResponse.json(
      { error: "Admin sign-in is temporarily unavailable." },
      { status: 503 },
    );
  }

  if (!verifyAdminCredentials(username, password, config)) {
    return NextResponse.json(
      { error: "The username or password is incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSession(config.username, config.secret),
    adminCookieOptions(ADMIN_SESSION_MAX_AGE, "/"),
  );
  return response;
}
