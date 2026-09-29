"use client";

import { useEffect } from "react";
import { useStoredChoice } from "./use-stored-choice";

type Paper = "newsprint" | "white";

// ?paper=white (or newsprint) in the URL wins, so a comparison can be linked or screenshotted.
const isPaper = (v: string | null): v is Paper => v === "white" || v === "newsprint";

/** Switches every mockup between newsprint and white stock, and remembers the choice. */
export function PaperToggle() {
  const [paper, setPaper] = useStoredChoice<Paper>("yn-paper", "paper", isPaper, "newsprint");

  useEffect(() => {
    document.documentElement.dataset.paper = paper;
  }, [paper]);

  return (
    <span
      className="flex items-center gap-0.5 rounded-full bg-white/15 p-0.5"
      role="group"
      aria-label="Paper"
    >
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
