"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function visitorId() {
  const name = "orchid_visitor=";
  const existing = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(name));
  if (existing) return existing.slice(name.length);

  const id = crypto.randomUUID();
  document.cookie = `${name}${id}; max-age=31536000; path=/; samesite=lax`;
  return id;
}

function categoryForPath(pathname: string) {
  if (pathname.startsWith("/projects/")) return "project";
  if (pathname.startsWith("/services/")) return "service";
  if (pathname.startsWith("/design-library/")) return "designLibrary";
  return undefined;
}

export default function ActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const hadVisitorCookie = document.cookie.includes("orchid_visitor=");
    const id = visitorId();
    const category = categoryForPath(pathname);
    const payload = JSON.stringify({
      type: "page_view",
      path: pathname,
      category,
      visitorId: id,
    });

    void fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });

    if (!hadVisitorCookie) {
      void fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "visitor",
          path: pathname,
          visitorId: id,
        }),
        keepalive: true,
      });
    }
  }, [pathname]);

  return null;
}
