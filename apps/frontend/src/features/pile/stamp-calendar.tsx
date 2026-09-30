"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { usePaperStatuses } from "@/features/site/status";

// The pile as a calendar: every day a paper came out, with the reader's stamp on it. Pick any day
// to read that day's paper. Months run newest first; weeks start on Monday.

export type CalendarDay = { date: string; issue: number; ink: string };

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const LONG = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const HEADS = ["M", "T", "W", "T", "F", "S", "S"];

const utc = (date: string) => new Date(`${date}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);

function monthsOf(days: CalendarDay[]) {
  const byDate = new Map(days.map((d) => [d.date, d]));
  const keys = [...new Set(days.map((d) => d.date.slice(0, 7)))].sort().reverse();
  return keys.map((key) => {
    const first = utc(`${key}-01`);
    const lead = (first.getUTCDay() + 6) % 7;
    const cells: ({ day: number; date: string; paper: CalendarDay | undefined } | null)[] = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (
      let d = new Date(first);
      d.getUTCMonth() === first.getUTCMonth();
      d.setUTCDate(d.getUTCDate() + 1)
    ) {
      const date = iso(d);
      cells.push({ day: d.getUTCDate(), date, paper: byDate.get(date) });
    }
    return { key, name: MONTH.format(first), cells };
  });
}

export function StampCalendar({ days, today }: { days: CalendarDay[]; today: string | null }) {
  const status = usePaperStatuses();
  const months = monthsOf(days);
  if (months.length === 0)
    return <p className="ar-empty">The first edition hasn&rsquo;t been printed yet.</p>;
  return (
    <div className="pl-cal">
      {months.map((m) => (
        <section key={m.key} className="pl-cal__month" aria-label={m.name}>
          <h2 className="pl-cal__name">{m.name}</h2>
          <div className="pl-cal__grid">
            {HEADS.map((h, i) => (
              <span key={`h${i}`} className="pl-cal__head" aria-hidden>
                {h}
              </span>
            ))}
            {m.cells.map((c, i) =>
              !c ? (
                <span key={`b${i}`} aria-hidden />
              ) : c.paper ? (
                (() => {
                  const s = status(c.paper.issue).state;
                  const isToday = c.date === today;
                  const label = `${LONG.format(utc(c.date))}, No. ${c.paper.issue}: ${
                    s === "stamped"
                      ? "stamped"
                      : s === "late"
                        ? "read late"
                        : s === "started"
                          ? "started"
                          : "unread"
                  }${isToday ? ", today's paper" : ""}`;
                  return (
                    <Link
                      key={c.date}

                      href={isToday ? "/" : `/issue/${c.paper.issue}`}
                      className="pl-cal__day"
                      data-state={s}
                      data-today={isToday || undefined}
                      style={{ "--pl-ink": c.paper.ink } as CSSProperties}
                      aria-label={label}
                    >
                      {c.day}
                    </Link>
                  );
                })()
              ) : (
                <span key={c.date} className="pl-cal__none" aria-hidden>
                  {c.day}
                </span>
              ),
            )}
          </div>
        </section>
      ))}
      <ul className="pl-cal__key" aria-label="Key">
        <li>
          <span className="pl-cal__swatch" data-state="stamped" /> Stamped
        </li>
        <li>
          <span className="pl-cal__swatch" data-state="late" /> Read late
        </li>
        <li>
          <span className="pl-cal__swatch" data-state="started" /> Started
        </li>
        <li>
          <span className="pl-cal__swatch" data-state="unread" /> Unread
        </li>
      </ul>
    </div>
  );
}
