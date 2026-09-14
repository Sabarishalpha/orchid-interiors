import { NextRequest, NextResponse } from "next/server";
import { getAdminUserByUsernameOrEmail, verifyPassword } from "@/lib/db";
import { setAdminSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const usernameOrEmail = String(body.username ?? "").trim();
  const password = String(body.password ?? "");

  if (!usernameOrEmail || !password) {
    return NextResponse.json({ error: "Email or username and password are required." }, { status: 400 });
  }

  const user = getAdminUserByUsernameOrEmail(usernameOrEmail);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  setAdminSessionCookie(response, user.id, user.username);
  return response;
}
