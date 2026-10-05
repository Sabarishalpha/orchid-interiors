import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminAuthConfig,
  isValidAdminSession,
} from "@/lib/admin-auth";

export function authorizeAdminRequest(request: NextRequest) {
  const config = getAdminAuthConfig();
  if (!config) {
    console.error("Admin sign-in is not configured.");
    return NextResponse.json(
      { error: "Admin services are temporarily unavailable." },
      { status: 503 },
    );
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSession(session, config.email, config.secret)) {
    return NextResponse.json({ error: "Sign in to manage website content." }, { status: 401 });
  }

  return null;
}
