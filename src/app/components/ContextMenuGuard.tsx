"use client";

import { useEffect } from "react";

export default function ContextMenuGuard() {
  useEffect(() => {
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const preventContextMenu = (event: MouseEvent) => {
      if (finePointerQuery.matches) event.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);
    return () =>
      document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  return null;
}
