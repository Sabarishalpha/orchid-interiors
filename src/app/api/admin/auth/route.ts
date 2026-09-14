import { NextResponse } from "next/server";

import {
  createSessionValue,
  getExpiredSessionCookie,
  getSessionCookie,
  isAdminConfigured,
  isValidCredentials,
} from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Set ADMIN_USERNAME and ADMIN_PASSWORD before using the admin panel." },
      { status: 503 },
    );
  }

  if (!body?.username || !body.password || !isValidCredentials(body.username, body.password)) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookie(createSessionValue(body.username)));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getExpiredSessionCookie());
  return response;
}
