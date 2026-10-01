"use client";

import { useFirstSeen } from "@/features/site/status";

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
