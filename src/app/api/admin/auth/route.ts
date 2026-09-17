import { NextRequest, NextResponse } from "next/server";

import {
  createSessionValue,
  getExpiredSessionCookie,
  getSessionCookie,
  isAdminConfigured,
  isValidCredentials,
} from "../../../../lib/admin-auth";
import { clientAddress, isRateLimited, jsonLimit } from "../../../../lib/security";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (jsonLimit(request, 16 * 1024) || isRateLimited(`admin-login:${clientAddress(request)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Set ADMIN_USERNAME and ADMIN_PASSWORD before using the admin panel." },
      { status: 503 },
    );
  }

  if (
    typeof body?.username !== "string" ||
    typeof body.password !== "string" ||
    !body.username ||
    !body.password ||
    !isValidCredentials(body.username, body.password)
  ) {
    return NextResponse.json(
      { error: "Invalid admin credentials." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(getSessionCookie(createSessionValue(body.username)));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(getExpiredSessionCookie());
  return response;
}
