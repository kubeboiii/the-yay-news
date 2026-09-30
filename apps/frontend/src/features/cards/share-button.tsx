"use client";

import { useState } from "react";
import type { Card } from "./types";

// "Share your pull": the card as an image (GET /cards/pull/<league>/<slug>, like the clippings)
// with "Pulled in The Yay News". Shared as a file where the browser can (phones), else saved.

export const pullImageHref = (card: Pick<Card, "league" | "slug">) =>
  `/cards/pull/${card.league}/${card.slug}`;

export function ShareButton({ card, className }: { card: Card; className?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "failed">("idle");
  const share = async () => {
    setState("busy");
    try {
      const res = await fetch(pullImageHref(card));
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const name = `yay-attax-${card.league}-${card.slug}.png`;
      const file = new File([blob], name, { type: "image/png" });
      const text = `I pulled ${card.name} in The Yay News!`;
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Yay Attax", text });
          setState("done");
          return;
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") {
            setState("idle");
            return;
          }
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.append(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      setState("done");
    } catch {
      setState("failed");
    }
  };
  return (
    <button
      type="button"
      className={`yr-share ${className ?? ""}`}
      onClick={share}
      disabled={state === "busy"}
    >
      {state === "busy"
        ? "Making the picture…"
        : state === "done"
          ? "Shared!"
          : state === "failed"
            ? "Try sharing again"
            : "Share your pull"}
    </button>
  );
}
