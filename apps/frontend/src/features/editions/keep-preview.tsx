"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const KEPT = ["now", "design"];

/**
 * Dev only: keeps the `?now=` and `?design=` preview parameters on internal links, so clicking
 * through a previewed edition stays in the preview instead of landing on an unreleased page.
 */
export function KeepPreview() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const current = new URLSearchParams(window.location.search);
      const kept = KEPT.filter((k) => current.has(k));
      if (!kept.length) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='/']");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank" || a.hasAttribute("download"))
        return;
      const url = new URL(a.href);
      if (url.pathname.startsWith("/clip/")) return;
      for (const k of kept) if (!url.searchParams.has(k)) url.searchParams.set(k, current.get(k)!);
      // Capture phase: take over before Next's Link navigates to its own href.
      e.preventDefault();
      e.stopPropagation();
      router.push(`${url.pathname}${url.search}${url.hash}`);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);
  return null;
}
