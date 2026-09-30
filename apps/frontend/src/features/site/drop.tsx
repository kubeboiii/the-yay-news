"use client";

import { type ReactNode, useEffect, useRef } from "react";

// The morning's paper drops onto the doormat: the first time a reader opens a new issue, the front
// page falls in and settles. Once per issue per device, and never with reduced motion.

const KEY = "yn-dropped";

export function Drop({ issue, children }: { issue: number; children: ReactNode }) {
  const paper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = paper.current;
    if (!el) return;
    try {
      if (localStorage.getItem(KEY) === String(issue)) return;
      localStorage.setItem(KEY, String(issue));
    } catch {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.dropping = "";
    const t = setTimeout(() => delete el.dataset.dropping, 1100);
    return () => clearTimeout(t);
  }, [issue]);
  return (
    <div id="paper" ref={paper} className="ys-paper">
      {children}
    </div>
  );
}
