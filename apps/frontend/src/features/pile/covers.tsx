"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { issueHref } from "@/features/papers/reading";
import { type PaperState, usePaperStatuses } from "@/features/site/status";

// Back issues pasted up as photocopied covers: each lead photo printed as a duotone in that
// paper's own plate A, its state slapped on in words (new!!, half read, done, done late). The
// newest is the big one. Today's paper links to the front door, not its issue page.

export type Cover = {
  issue: number;
  /** "Tue 29 Sept". */
  day: string;
  headline: string;
  kicker: string;
  photo: string | null;
  /** The paper's plate A, from riotInks. */
  plate: string;
  today: boolean;
};

const MARK: Record<PaperState, string> = {
  stamped: "done",
  late: "done late",
  started: "half read",
  unread: "new!!",
};

export function Covers({ covers }: { covers: Cover[] }) {
  const status = usePaperStatuses();
  return (
    <ol className="sb-covers" aria-label="Back issues, newest first">
      {covers.map((c, i) => {
        const st = status(c.issue).state;
        return (
          <li
            key={c.issue}
            className={i === 0 ? "is-big" : undefined}
            style={{ rotate: i === 0 ? "-1.5deg" : undefined, "--plate": c.plate } as CSSProperties}
          >
            <Link href={c.today ? "/" : issueHref(c.issue)} className="sb-cover">
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
              <span className="sb-cover__day">{c.today ? `Today · ${c.day}` : c.day}</span>
              <span className="sb-cover__head">{c.headline}</span>
              <span className={`sb-cover__mark sb-cover__mark--${st}`}>{MARK[st]}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
