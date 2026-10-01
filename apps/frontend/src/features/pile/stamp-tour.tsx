"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useHabitsReady, useStamps, useStreak } from "@/features/habits/api";
import { addDays } from "@/features/habits/core";
import { Heading } from "@/features/riot";
import { issueHref } from "@/features/papers/reading";
import { usePaperStatuses } from "@/features/site/status";

// The stamp tour: the last fourteen dates as a gig poster's tour list, newest first, so it reads
// top to bottom on a phone. Each date says what happened in words: sold out (finished), read late,
// on now (today), a rest day, half read, or missed. Before the reader's first visit, nothing.

export type TourPaper = { issue: number; date: string; kicker: string };

const SHORT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function StampTour({ papers, today }: { papers: TourPaper[]; today: string }) {
  const ready = useHabitsReady();
  const stamps = useStamps();
  const streak = useStreak(today);
  const status = usePaperStatuses();
  const byDate = useMemo(() => new Map(papers.map((p) => [p.date, p])), [papers]);
  const stamped = useMemo(() => new Set(stamps.map((s) => s.date)), [stamps]);
  const rest = new Set(streak?.restDays ?? []);
  const first = stamps[0]?.date;
  const dates = Array.from({ length: 14 }, (_, k) => addDays(today, -k));

  return (
    <section className="sb-tour" id="tour" aria-labelledby="tour-h">
      <Heading id="tour-h" className="sb-tour__h">
        The stamp tour
      </Heading>
      <p className="sb-tour__when rt-meta">Last 14 dates, newest first</p>
      <table className="sb-tour__table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Paper</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((d) => {
            const p = byDate.get(d);
            const st = p ? status(p.issue).state : "unread";
            const state = !ready
              ? ""
              : st === "late"
                ? "read late"
                : st === "stamped" || stamped.has(d)
                  ? "sold out"
                  : d === today
                    ? "on now"
                    : rest.has(d)
                      ? "rest day"
                      : st === "started"
                        ? "half read"
                        : !first || d < first
                          ? ""
                          : "missed";
            return (
              <tr key={d} className={state ? `is-${state.replace(" ", "-")}` : undefined}>
                <td className="sb-tour__date">{SHORT.format(new Date(`${d}T00:00:00Z`))}</td>
                <td>
                  {p ? (
                    <Link href={d === today ? "/" : issueHref(p.issue)}>
                      No. {p.issue} <span>{p.kicker}</span>
                    </Link>
                  ) : (
                    <span className="sb-tour__none">no paper</span>
                  )}
                </td>
                <td>
                  <span className="sb-tour__state">{state || "—"}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="sb-tour__key">
        Sold out means you finished it. One rest day a week keeps the run alive.
      </p>
    </section>
  );
}
