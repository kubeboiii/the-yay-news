"use client";

import type { ReactNode } from "react";
import { useHabitLog, useHabitsReady } from "@/features/habits/api";
import { useFirstSeen, usePaperStatuses } from "@/features/site/status";

// The top of the pile: papers from the last week the reader hasn't finished, lying on top where
// they'll be seen. Only for readers who have been here before (a first visit has nothing to catch
// up on), and only papers from after their first visit.

export type PileCopy = { issue: number; date: string; node: ReactNode };

export function CatchUp({ copies }: { copies: PileCopy[] }) {
  const ready = useHabitsReady();
  const events = useHabitLog();
  const status = usePaperStatuses();
  const since = useFirstSeen();
  if (!ready || events.length === 0) return null;
  const waiting = copies.filter((c) => {
    const s = status(c.issue).state;
    return (s === "unread" || s === "started") && (!since || c.date >= since);
  });
  if (waiting.length === 0) {
    return (
      <section className="pl-catch pl-catch--clear" aria-label="On your pile">
        <p className="pl-hand">pile&rsquo;s clear. you&rsquo;re all caught up.</p>
      </section>
    );
  }
  return (
    <section className="pl-catch" aria-labelledby="pl-catch-title">
      <p id="pl-catch-title" className="ar-ticket">
        On your pile · {waiting.length} to catch up on
      </p>
      <ol className="ar-rack__row pl-catch__row">{waiting.map((c) => c.node)}</ol>
    </section>
  );
}

/** "12 stamped", for a month box's label: how many of its papers the reader finished. */
export function BoxCount({ issues }: { issues: number[] }) {
  const ready = useHabitsReady();
  const status = usePaperStatuses();
  if (!ready) return null;
  const n = issues.filter((i) => {
    const s = status(i).state;
    return s === "stamped" || s === "late";
  }).length;
  return <> · {n} stamped</>;
}

/** Where the reader's own pile starts: everything older was printed before their first visit. */
export function BeforeYourTime({ oldest }: { oldest: { issue: number; date: string } | null }) {
  const since = useFirstSeen();
  if (!since || !oldest || oldest.date >= since) return null;
  const when = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${since}T00:00:00Z`));
  return (
    <p className="pl-before">
      <span className="pl-before__k">Before your time</span>
      You started reading on {when}. Every paper from before then is still on the stand. Dig in.
    </p>
  );
}
