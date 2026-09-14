import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  clearAdminSessionCookie(response);
  return response;
}
