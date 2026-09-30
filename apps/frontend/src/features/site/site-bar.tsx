"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useEditionToday } from "@/features/habits/api";
import { usePlaceOverride } from "./place";
import "./site.css";

// Where you are on the site, as opposed to where you are in the paper (the page bar at the foot of
// each page). Three places and the date: Today, your Pile of past papers, your Wall. It tucks away
// while you read down a page and comes back as soon as you scroll up.

const DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function useTucked() {
  const [tucked, setTucked] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last.current) < 8) return;
      setTucked(y > last.current && y > 120);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return tucked;
}

export function SiteBar({ fonts }: { fonts: string }) {
  const path = usePathname();
  const tucked = useTucked();
  const today = useEditionToday();
  const claimed = usePlaceOverride();
  const place =
    claimed ??
    (path.startsWith("/pile") || path.startsWith("/archive")
      ? "pile"
      : path.startsWith("/wall") ||
          path.startsWith("/stamps") ||
          path.startsWith("/saved") ||
          path.startsWith("/cards")
        ? "wall"
        : "today");
  const date = today ? DAY.format(new Date(`${today}T00:00:00Z`)) : null;
  return (
    <header className={`ys-bar ${fonts}`} data-tucked={tucked || undefined}>
      <nav aria-label="The Yay News" className="ys-bar__in">
        <Link href="/" className="ys-mark" aria-current={place === "today" ? "page" : undefined}>
          <span className="ys-mark__word">The Yay News</span>
          <span className="ys-mark__short" aria-hidden>
            Yay!
          </span>
        </Link>
        {date ? (
          <Link
            href="/pile?view=calendar"
            className="ys-date"
            aria-label={`${date}. Pick another day's paper`}
          >
            {date}
            <svg viewBox="0 0 12 12" aria-hidden>
              <path d="M2.5 4.5 6 8l3.5-3.5" />
            </svg>
          </Link>
        ) : (
          <span className="ys-date ys-date--blank" aria-hidden />
        )}
        <span className="ys-bar__gap" />
        <Link href="/" className="ys-tab" aria-current={place === "today" ? "page" : undefined}>
          Today
        </Link>
        <Link href="/pile" className="ys-tab" aria-current={place === "pile" ? "page" : undefined}>
          Pile
        </Link>
        <Link href="/wall" className="ys-tab" aria-current={place === "wall" ? "page" : undefined}>
          Wall
        </Link>
      </nav>
    </header>
  );
}
