"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ContextMenuGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const preventContextMenu = (event: MouseEvent) => {
      if (finePointerQuery.matches) event.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);
    return () =>
      document.removeEventListener("contextmenu", preventContextMenu);
  }, [pathname]);

  return null;
}
