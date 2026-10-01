"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import type { HabitEvent } from "@/features/habits/core";
import { statusesOf } from "@/features/site/status";

export type Slab = {
  issue: number;
  day: string;
  headline: string;
  ground: string;
  tilt: number;
  shift: number;
};

const BADGE = { stamped: "Starred", late: "Starred late", started: "Reading", unread: "New!" };

/** The pile as a wobbly cartoon tower: one chunky paper per row, its state as a badge in words. */
export function Tower({ slabs, events }: { slabs: Slab[]; events: HabitEvent[] }) {
  const statuses = useMemo(() => statusesOf(events), [events]);
  return (
    <ol className="sc-tower" aria-label="Your pile, newest on top">
      {slabs.map((s) => {
        const st = statuses.get(s.issue)?.state ?? "unread";
        return (
          <li
            key={s.issue}
            style={
              {
                rotate: `${s.tilt}deg`,
                translate: `${s.shift}px 0`,
                "--sg": s.ground,
              } as CSSProperties
            }
          >
            <Link href={`/mockups/site-c/today?issue=${s.issue}`} className="sc-slab">
              <span className="sc-slab__n">{s.issue}</span>
              <span className="sc-slab__text">
                <span className="sc-slab__day">{s.day}</span>
                <span className="sc-slab__head">{s.headline}</span>
              </span>
              <span className={`sc-badge sc-badge--${st}`}>{BADGE[st]}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
