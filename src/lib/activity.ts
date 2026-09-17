import fs from "node:fs";
import path from "node:path";

export type ActivityType = "visitor" | "page_view" | "brochure_download" | "content_update";
export type ActivityCategory = "project" | "service" | "designLibrary";
export type ActivityRange = "today" | "7d" | "30d" | "3m" | "1y";

type ActivityEvent = {
  type: ActivityType;
  path: string;
  category?: ActivityCategory;
  visitorId?: string;
  createdAt: string;
};

export type ActivityStats = {
  visitors: number;
  brochureDownloads: number;
  pageViews: number;
  projectViews: number;
  serviceViews: number;
  designLibraryViews: number;
  lastSevenDays: Array<{ label: string; views: number; visitors: number }>;
  topPages: Array<{ path: string; views: number }>;
  recentActivity: Array<{ type: ActivityType; path: string; createdAt: string }>;
  analytics: Array<{ label: string; visitors: number; pageViews: number; downloads: number }>;
  changes: { visitors: number | null; pageViews: number | null; downloads: number | null };
};

const activityPath = path.join(process.cwd(), "data", "activity.json");

function readEvents(): ActivityEvent[] {
  try {
    const value = JSON.parse(fs.readFileSync(activityPath, "utf8"));
    return Array.isArray(value) ? (value as ActivityEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: ActivityEvent[]) {
  fs.mkdirSync(path.dirname(activityPath), { recursive: true });
  const temporaryPath = `${activityPath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(events)}\n`, "utf8");
  fs.renameSync(temporaryPath, activityPath);
}

export function recordActivity(event: Omit<ActivityEvent, "createdAt">) {
  const events = readEvents();
  events.push({ ...event, createdAt: new Date().toISOString() });
  writeEvents(events.slice(-100000));
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function rangeDays(range: ActivityRange) {
  if (range === "today") return 1;
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  if (range === "3m") return 90;
  return 365;
}

function percentageChange(current: number, previous: number) {
  if (!previous) return current ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function getActivityStats(range: ActivityRange = "7d"): ActivityStats {
  const events = readEvents();
  const visitorIds = new Set(
    events.filter((event) => event.type === "visitor" && event.visitorId).map((event) => event.visitorId),
  );
  const pageViews = events.filter((event) => event.type === "page_view");
  const pageCounts = new Map<string, number>();
  for (const event of pageViews) {
    pageCounts.set(event.path, (pageCounts.get(event.path) ?? 0) + 1);
  }
  const topPages = [...pageCounts.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 5)
    .map(([path, views]) => ({ path, views }));
  const days = rangeDays(range);
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setHours(0, 0, 0, 0);
  currentStart.setDate(currentStart.getDate() - (days - 1));
  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - days);
  const currentEvents = events.filter((event) => new Date(event.createdAt) >= currentStart);
  const previousEvents = events.filter((event) => {
    const date = new Date(event.createdAt);
    return date >= previousStart && date < currentStart;
  });
  const currentPageViews = currentEvents.filter((event) => event.type === "page_view");
  const previousPageViews = previousEvents.filter((event) => event.type === "page_view");
  const currentVisitors = new Set(currentEvents.filter((event) => event.type === "visitor" && event.visitorId).map((event) => event.visitorId)).size;
  const previousVisitors = new Set(previousEvents.filter((event) => event.type === "visitor" && event.visitorId).map((event) => event.visitorId)).size;
  const currentDownloads = currentEvents.filter((event) => event.type === "brochure_download").length;
  const previousDownloads = previousEvents.filter((event) => event.type === "brochure_download").length;
  const analytics = Array.from({ length: Math.min(days, 30) }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (Math.min(days, 30) - 1 - index) * Math.ceil(days / Math.min(days, 30)));
    const key = dayKey(date);
    const dayEvents = events.filter((event) => dayKey(new Date(event.createdAt)) === key);
    return {
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visitors: new Set(dayEvents.filter((event) => event.type === "visitor" && event.visitorId).map((event) => event.visitorId)).size,
      pageViews: dayEvents.filter((event) => event.type === "page_view").length,
      downloads: dayEvents.filter((event) => event.type === "brochure_download").length,
    };
  });

  return {
    visitors: visitorIds.size,
    brochureDownloads: events.filter((event) => event.type === "brochure_download").length,
    pageViews: pageViews.length,
    projectViews: pageViews.filter((event) => event.category === "project").length,
    serviceViews: pageViews.filter((event) => event.category === "service").length,
    designLibraryViews: pageViews.filter((event) => event.category === "designLibrary").length,
    lastSevenDays: analytics.slice(-7).map((day) => ({ label: day.label, views: day.pageViews, visitors: day.visitors })),
    topPages,
    recentActivity: [...events]
      .reverse()
      .slice(0, 5)
      .map(({ type, path, createdAt }) => ({ type, path, createdAt })),
    analytics,
    changes: {
      visitors: percentageChange(currentVisitors, previousVisitors),
      pageViews: percentageChange(currentPageViews.length, previousPageViews.length),
      downloads: percentageChange(currentDownloads, previousDownloads),
    },
  };
}
