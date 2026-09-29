"use client";

import { useEffect, useState } from "react";

type Paper = "newsprint" | "white";

const readSaved = (): Paper => {
  // ?paper=white (or newsprint) in the URL wins, so a comparison can be linked or screenshotted.
  const fromUrl = new URLSearchParams(window.location.search).get("paper");
  if (fromUrl === "white" || fromUrl === "newsprint") return fromUrl;
  try {
    return localStorage.getItem("yn-paper") === "white" ? "white" : "newsprint";
  } catch {
    return "newsprint";
  }
};

/** Switches every mockup between newsprint and white stock, and remembers the choice. */
export function PaperToggle() {
  const [paper, setPaper] = useState<Paper>("newsprint");

  useEffect(() => {
    setPaper(readSaved());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.paper = paper;
    try {
      localStorage.setItem("yn-paper", paper);
    } catch {
      // Private mode or blocked storage: the switch still works for this page view.
    }
  }, [paper]);

  return (
    <span className="flex items-center gap-0.5 rounded-full bg-white/15 p-0.5" role="group" aria-label="Paper">
      {(["newsprint", "white"] as const).map((p) => (
        <button
          key={p}
          type="button"
          aria-pressed={paper === p}
          onClick={() => setPaper(p)}
          className={`rounded-full px-2.5 py-0.5 capitalize ${paper === p ? "bg-white text-black" : "hover:bg-white/15"}`}
        >
          {p}
        </button>
      ))}
    </span>
  );
}
