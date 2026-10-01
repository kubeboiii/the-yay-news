"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import type { HabitEvent } from "@/features/habits/core";
import { statusesOf } from "@/features/site/status";

export type Cover = {
  issue: number;
  day: string;
  headline: string;
  kicker: string;
  photo: string | null;
  plate: string;
  tilt: number;
};

const MARK = { stamped: "done", late: "done late", started: "half read", unread: "new!!" };

/**
 * Back issues pasted up as photocopied covers: each photo printed as a duotone in that paper's
 * own ink, the state slapped on in words (new!!, half read, done).
 */
export function Covers({ covers, events }: { covers: Cover[]; events: HabitEvent[] }) {
  const statuses = useMemo(() => statusesOf(events), [events]);
  return (
    <ol className="sb-covers" aria-label="Back issues, newest first">
      {covers.map((c, i) => {
        const st = statuses.get(c.issue)?.state ?? "unread";
        return (
          <li
            key={c.issue}
            className={i === 0 ? "is-big" : undefined}
            style={{ rotate: `${c.tilt}deg`, "--plate": c.plate } as CSSProperties}
          >
            <Link href={`/mockups/site-b/today?issue=${c.issue}`} className="sb-cover">
              <span className="sb-cover__mast">
                <span>The Yay News</span>
                <span>No. {c.issue}</span>
              </span>
              <span className="sb-cover__pic">
                {c.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- a pressed print
                  <img src={c.photo} alt="" />
                ) : (
                  <span className="sb-cover__kick">{c.kicker}</span>
                )}
              </span>
              <span className="sb-cover__day">{c.day}</span>
              <span className="sb-cover__head">{c.headline}</span>
              <span className={`sb-cover__mark sb-cover__mark--${st}`}>{MARK[st]}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
