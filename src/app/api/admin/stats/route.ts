import { NextResponse } from "next/server";
import { getActivityStats } from "../../../../lib/activity";
import { isAdmin } from "../../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rangeValue = new URL(request.url).searchParams.get("range");
  const range = ["today", "7d", "30d", "3m", "1y"].includes(rangeValue ?? "")
    ? (rangeValue as "today" | "7d" | "30d" | "3m" | "1y")
    : "7d";
  return NextResponse.json(getActivityStats(range), { headers: { "Cache-Control": "no-store" } });
}
