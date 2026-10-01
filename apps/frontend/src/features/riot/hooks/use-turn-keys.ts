"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Turns the page with the arrow keys (← `prev`, → `next`), like flicking through the paper.
 * Ignored while typing in a field or with a modifier held. Pass undefined for an end with no page.
 */
export function useTurnKeys(prev?: string, next?: string): void {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight" && next) router.push(next, { scroll: false });
      if (e.key === "ArrowLeft" && prev) router.push(prev, { scroll: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev, next]);
}
