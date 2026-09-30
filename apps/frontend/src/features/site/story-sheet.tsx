"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import "./sheet.css";

// A story opened from inside the paper, on a sheet pulled up over the page. It has the story's own
// URL, so Back closes it, and the page underneath keeps its scroll position.

export function StorySheet({ label, children }: { label: string; children: ReactNode }) {
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);
  const close = () => router.back();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  return (
    <div className="ys-sheet">
      <button
        type="button"
        className="ys-sheet__scrim"
        aria-label="Close the story"
        onClick={close}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="ys-sheet__panel"
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
        }}
      >
        <div className="ys-sheet__top">
          <span className="ys-sheet__grip" aria-hidden />
          <button type="button" className="ys-sheet__close" aria-label="Close" onClick={close}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
