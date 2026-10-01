"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEditionToday, useStreak } from "@/features/habits/api";
import { CutNav, type CutNavItem } from "@/features/riot";
import { usePlaceOverride } from "./place";

// The masthead on every reader page: the name set once, today's date as metadata, and the three
// places as slips cut from the same sheet (the riot kit's CutNav), the one you're on ringed in
// marker. On a phone the slips are stuck to a strip of black tape along the bottom of the screen.

const DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function placeOf(path: string) {
  if (path.startsWith("/pile") || path.startsWith("/archive")) return "pile";
  if (["/wall", "/stamps", "/saved", "/cards"].some((p) => path.startsWith(p))) return "wall";
  if (path.startsWith("/about")) return "about";
  return "today";
}

export function SiteBar({ todayIssue }: { todayIssue: number | null }) {
  const path = usePathname();
  const claimed = usePlaceOverride();
  const today = useEditionToday();
  const streak = useStreak();
  const place = claimed ?? placeOf(path);
  const run = streak?.current ?? 0;
  const items: CutNavItem[] = [
    { id: "today", label: "Today", sub: todayIssue ? `No. ${todayIssue}` : "the paper", href: "/" },
    { id: "pile", label: "Pile", sub: "back issues", href: "/pile" },
    { id: "wall", label: "Wall", sub: run ? `${run}-day run` : "your stuff", href: "/wall" },
  ];
  return (
    <header className="sb-top">
      <div className="sb-top__row">
        <Link href="/" className="sb-logo" aria-label="The Yay News, today's paper">
          <span className="sb-logo__the" aria-hidden>
            The
          </span>
          <span className="sb-logo__name" aria-hidden>
            Yay News
          </span>
        </Link>
        <p className="sb-date rt-meta">
          {today ? DAY.format(new Date(`${today}T00:00:00Z`)) : " "}
          {todayIssue ? ` · No. ${todayIssue}` : ""}
        </p>
        <CutNav items={items} active={place} className="sb-nav" />
      </div>
    </header>
  );
}
