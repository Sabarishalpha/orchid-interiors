import { NextRequest, NextResponse } from "next/server";
import * as adminContent from "@/lib/api-handlers/admin-content";
import * as adminLogin from "@/lib/api-handlers/admin-login";
import * as adminLogout from "@/lib/api-handlers/admin-logout";
import * as adminMedia from "@/lib/api-handlers/admin-media";
import * as adminMediaComplete from "@/lib/api-handlers/admin-media-complete";
import * as chat from "@/lib/api-handlers/chat";
import * as leads from "@/lib/api-handlers/leads";
import * as publicContent from "@/lib/api-handlers/public-content";

export const runtime = "nodejs";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const handlers: Record<string, Partial<Record<Method, (request: NextRequest) => Promise<NextResponse>>>> = {
  "admin/auth/login": { POST: adminLogin.POST },
  "admin/auth/logout": { POST: adminLogout.POST },
  "admin/content": {
    GET: adminContent.GET,
    POST: adminContent.POST,
    PATCH: adminContent.PATCH,
    DELETE: adminContent.DELETE,
  },
  "admin/media": { POST: adminMedia.POST },
  "admin/media/complete": { POST: adminMediaComplete.POST },
  chat: { POST: chat.POST },
  leads: { POST: leads.POST },
};

async function dispatch(request: NextRequest) {
  const segments = request.nextUrl.pathname
    .slice("/api/".length)
    .split("/")
    .filter(Boolean);
  const route = segments.join("/");
  const method = request.method as Method;

  if (segments.length === 2 && segments[0] === "content" && method === "GET") {
    return publicContent.GET(request, {
      params: Promise.resolve({ kind: segments[1] }),
    });
  }

  const handler = handlers[route]?.[method];
  if (handler) return handler(request);

  if (handlers[route]) {
    return NextResponse.json(
      { error: "Method not allowed." },
      {
        status: 405,
        headers: { Allow: Object.keys(handlers[route]!).join(", ") },
      },
    );
  }

  return NextResponse.json({ error: "API route not found." }, { status: 404 });
}

export const GET = dispatch;
export const POST = dispatch;
export const PATCH = dispatch;
export const DELETE = dispatch;
