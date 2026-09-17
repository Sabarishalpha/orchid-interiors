import { NextRequest, NextResponse } from "next/server";
import { recordActivity, type ActivityCategory, type ActivityType } from "../../../lib/activity";
import { clientAddress, isRateLimited, jsonLimit } from "../../../lib/security";

const activityTypes = new Set<ActivityType>(["visitor", "page_view", "brochure_download"]);
const categories = new Set<ActivityCategory>(["project", "service", "designLibrary"]);

export async function POST(request: NextRequest) {
  try {
    if (jsonLimit(request, 16 * 1024) || isRateLimited(`activity:${clientAddress(request)}`, 120, 60 * 1000)) {
      return NextResponse.json({ error: "Activity limit exceeded." }, { status: 429 });
    }

    const body = (await request.json()) as {
      type?: string;
      path?: string;
      category?: string;
      visitorId?: string;
    };

    if (!body.type || !activityTypes.has(body.type as ActivityType)) {
      return NextResponse.json({ error: "Invalid activity type." }, { status: 400 });
    }

    const path = typeof body.path === "string" ? body.path : "/";
    const visitorId = typeof body.visitorId === "string" ? body.visitorId : "";
    if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api/") || (visitorId && !/^[0-9a-f-]{36}$/i.test(visitorId))) {
      return NextResponse.json({ error: "Invalid activity payload." }, { status: 400 });
    }

    recordActivity({
      type: body.type as ActivityType,
      path: path.slice(0, 500),
      ...(body.category && categories.has(body.category as ActivityCategory)
        ? { category: body.category as ActivityCategory }
        : {}),
      ...(visitorId ? { visitorId } : {}),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to record activity." }, { status: 400 });
  }
}
