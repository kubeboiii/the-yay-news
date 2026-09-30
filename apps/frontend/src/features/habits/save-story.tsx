"use client";

import { useId, useMemo, useState } from "react";
import { play } from "@/features/sound";
import { record, useHabitsReady, useSavedStories } from "./api";
import { handwriting } from "./fonts";
import { hash, line, rng } from "./sketch";
import "./save-story.css";

/**
 * "Keep this one": a pencilled tick box beside a story. Ticking it keeps the story on the device
 * (it appears on /saved); ticking again rubs the tick out. Prints in the ink of the text around it
 * (currentColor), so it sits in any design.
 */
export function SaveStoryButton({
  issue,
  slug,
  headline,
  kicker,
  date,
  label = "Keep this one",
  keptLabel = "Kept",
  className,
}: {
  issue: number;
  slug: string;
  headline: string;
  kicker?: string;
  /** The edition's date, printed on the clipping in /saved. */
  date?: string;
  label?: string;
  keptLabel?: string;
  className?: string;
}) {
  const ready = useHabitsReady();
  const saved = useSavedStories();
  const kept = ready && saved.some((s) => s.issue === issue && s.slug === slug);
  const [fresh, setFresh] = useState(false);
  const id = useId();
  const art = useMemo(() => {
    const r = rng(hash(`box:${slug}`));
    return {
      box: [
        line(r, 3, 4, 21, 3, 0.6),
        line(r, 21, 3, 22, 21, 0.6),
        line(r, 22, 21, 3, 22, 0.6),
        line(r, 3, 22, 3, 4, 0.6),
      ],
      tick: `M5.5 12.5 C7.5 14 9 16.5 10.5 19.5 C13 12 17.5 5 26 -1.5`,
    };
  }, [slug]);
  return (
    <button
      type="button"
      className={`hb-keep ${handwriting.className} ${kept ? "is-kept" : ""} ${className ?? ""}`}
      aria-pressed={kept}
      aria-describedby={id}
      onClick={() => {
        if (kept) {
          record({ type: "story_unsaved", issue, slug });
          play("erase");
          setFresh(false);
        } else {
          record({ type: "story_saved", issue, slug, headline, kicker, date });
          play("tick");
          setFresh(true);
        }
      }}
    >
      <svg viewBox="-1 -4 30 28" className="hb-keep__box" aria-hidden>
        {art.box.map((d, i) => (
          <path key={i} d={d} className="hb-keep__line" />
        ))}
        {kept ? (
          <path
            d={art.tick}
            pathLength={1}
            className={`hb-keep__tick ${fresh ? "is-fresh" : ""}`}
          />
        ) : null}
      </svg>
      <span className="hb-keep__label">{kept ? keptLabel : label}</span>
      <span id={id} className="sr-only">
        {kept
          ? "Saved on this device. Press to remove it from your kept stories."
          : "Save this story on this device."}
      </span>
    </button>
  );
}
