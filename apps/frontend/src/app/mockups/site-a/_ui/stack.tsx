"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import type { HabitEvent } from "@/features/habits/core";
import { STATE_LABEL, statusesOf } from "@/features/site/status";

export type StackPaper = {
  issue: number;
  date: string;
  day: string;
  headline: string;
  kicker: string;
  design: string;
  ground: string;
  ink: string;
  tilt: number;
  shift: number;
};

/**
 * The pile, seen from the side: one folded paper per row, newest on top. Every edge is a link
 * with its number, date and lead headline, so the pile reads like a list even though it looks
 * like a stack. What you did with each paper (stamped, dog-eared, unread) sits at the right edge.
 */
export function Stack({ papers, events }: { papers: StackPaper[]; events: HabitEvent[] }) {
  const statuses = useMemo(() => statusesOf(events), [events]);
  return (
    <ol className="sa-stack" aria-label="Your pile, newest first">
      {papers.map((p, i) => {
        const st = statuses.get(p.issue)?.state ?? "unread";
        return (
          <li
            key={p.issue}
            style={
              {
                "--ground": p.ground,
                "--edge": p.ink,
                rotate: `${p.tilt}deg`,
                translate: `${p.shift}px 0`,
                zIndex: papers.length - i,
              } as CSSProperties
            }
          >
            <Link
              href={`/mockups/site-a/today?issue=${p.issue}`}
              className={`sa-slab sa-slab--${st}`}
            >
              <span className="sa-slab__no">{p.issue}</span>
              <span className="sa-slab__when">
                {p.day}
                <span className="sa-slab__design">{p.design}</span>
              </span>
              <span className="sa-slab__head">{p.headline}</span>
              <span className={`sa-slab__state sa-slab__state--${st}`}>{STATE_LABEL[st]}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
