"use client";

import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import { Book } from "./book";
import { useEditionToday, useHabitsReady, useMoods, useStamps, useStreak } from "./api";
import { stampInk } from "./catalogue";
import { addDays, MOODS, type MoodId, type StampInfo, type Streak } from "./core";
import { habitFonts } from "./fonts";
import { MoodFace } from "./mood";
import { hash, rng, tally } from "./sketch";
import { RubberStamp, longDate } from "./stamp";
import "./stamp-book.css";

// The stamp book: a kraft-paper passport for good news. Every finished edition gets a rubber-stamp
// impression; the inside cover keeps the streak in pencilled tally marks; one page shows the month,
// with the day's mood doodled in beside each stamp.

export const STAMPS_PER_PAGE = 6;

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const MON_SHORT = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const monthName = (ym: string) => MONTH.format(new Date(`${ym}-01T00:00:00Z`));
const shortMonth = (ym: string) => MON_SHORT.format(new Date(`${ym}-01T00:00:00Z`));
const shiftMonth = (ym: string, n: number) => {
  const [y, m] = ym.split("-").map(Number) as [number, number];
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 7);
};

/** Pencilled tally marks for a count, with the number written beside them. */
function Tally({ count, seed = 1 }: { count: number; seed?: number }) {
  const shown = Math.min(count, 35);
  const r = rng(seed);
  const paths = tally(r, shown, 6, 6, 34, 8.5);
  const width = Math.max(40, Math.ceil(shown / 5) * 55 + 10);
  return (
    <svg
      viewBox={`0 0 ${width} 48`}
      className="hb-tally"
      style={{ width: `${width * 1.1}px` }}
      aria-hidden
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

function Cover({ streak, stamps }: { streak: Streak | null; stamps: number }) {
  return (
    <div className="hb-cover">
      <span className="hb-cover__band" aria-hidden />
      <p className="hb-cover__paper">The Yay News</p>
      <h2 className="hb-cover__title">
        Stamp
        <br />
        Book
      </h2>
      <p className="hb-cover__sub">One stamp for every paper finished</p>
      <div className="hb-cover__label">
        <span className="hb-cover__label-line">
          {streak === null
            ? " "
            : stamps === 0
              ? "No stamps yet"
              : `${stamps} stamp${stamps === 1 ? "" : "s"}`}
        </span>
        <span className="hb-cover__label-line hb-cover__label-line--big">
          {streak === null
            ? " "
            : streak.current > 0
              ? `${streak.current} day${streak.current === 1 ? "" : "s"} running`
              : "Start a streak today"}
        </span>
      </div>
      <svg viewBox="0 0 100 100" className="hb-cover__emblem" aria-hidden>
        <circle cx={50} cy={50} r={40} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 12;
          const q = (n: number) => Math.round(n * 100) / 100;
          return (
            <line
              key={i}
              x1={q(50 + Math.cos(a) * 18)}
              y1={q(50 + Math.sin(a) * 18)}
              x2={q(50 + Math.cos(a) * 30)}
              y2={q(50 + Math.sin(a) * 30)}
            />
          );
        })}
        <circle cx={50} cy={50} r={11} />
      </svg>
    </div>
  );
}

function StreakPage({ streak, stamps }: { streak: Streak | null; stamps: StampInfo[] }) {
  const current = streak?.current ?? 0;
  const next = current + 1;
  return (
    <div className="hb-leafpage">
      <p className="hb-leafpage__head">Holder&rsquo;s page</p>
      <p className="hb-typed">This book belongs to</p>
      <p className="hb-written hb-written--line">a reader of good news</p>
      <p className="hb-typed hb-typed--gap">Papers finished in a row</p>
      {streak === null ? (
        <p className="hb-written">…</p>
      ) : current > 0 ? (
        <>
          <div className="hb-streak">
            <Tally count={current} seed={hash(`tally:${current}`)} />
            <p className="hb-written hb-written--big">
              {current} day{current === 1 ? "" : "s"}!
            </p>
          </div>
          <p className="hb-written hb-written--small">
            {streak.doneToday
              ? "Today’s paper is done. See you tomorrow."
              : `Finish today’s paper to make it ${next}.`}
            {streak.restDays.length > 0
              ? ` (${streak.restDays.length === 1 ? "One rest day" : `${streak.restDays.length} rest days`} in there, and that’s fine.)`
              : ""}
          </p>
        </>
      ) : (
        <p className="hb-written">
          {stamps.length > 0
            ? "A fresh start: finish today’s paper."
            : "Your first stamp is one paper away."}
        </p>
      )}
      <dl className="hb-facts">
        <div>
          <dt className="hb-typed">Best streak</dt>
          <dd className="hb-written">
            {streak ? `${streak.best} day${streak.best === 1 ? "" : "s"}` : "…"}
          </dd>
        </div>
        <div>
          <dt className="hb-typed">Stamps</dt>
          <dd className="hb-written">{streak ? stamps.length : "…"}</dd>
        </div>
      </dl>
      <p className="hb-leafpage__folio">1</p>
    </div>
  );
}

function MonthPage({
  today,
  stamps,
  moods,
  rest,
}: {
  today: string | null;
  stamps: StampInfo[];
  moods: Map<string, MoodId>;
  rest: Set<string>;
}) {
  const current = (today ?? stamps.at(-1)?.date ?? "2026-01-01").slice(0, 7);
  const [month, setMonth] = useState<string | null>(null);
  const ym = month ?? current;
  const first = stamps[0]?.date.slice(0, 7) ?? current;
  const byDate = useMemo(() => new Map(stamps.map((s) => [s.date, s])), [stamps]);
  const start = `${ym}-01`;
  const dow = (new Date(`${start}T00:00:00Z`).getUTCDay() + 6) % 7;
  const days: (string | null)[] = Array.from({ length: dow }, () => null);
  for (let d = start; d.slice(0, 7) === ym; d = addDays(d, 1)) days.push(d);
  const count = days.filter((d) => d && byDate.has(d)).length;
  return (
    <div className="hb-leafpage">
      <p className="hb-leafpage__head">The month</p>
      <div className="hb-month__nav">
        <button
          type="button"
          className="hb-month__btn"
          onClick={() => setMonth(shiftMonth(ym, -1))}
          disabled={ym <= first}
          aria-label={`Previous month, ${monthName(shiftMonth(ym, -1))}`}
        >
          ‹ {shortMonth(shiftMonth(ym, -1))}
        </button>
        <h3 className="hb-month__title">{monthName(ym)}</h3>
        <button
          type="button"
          className="hb-month__btn"
          onClick={() => setMonth(shiftMonth(ym, 1))}
          disabled={ym >= current}
          aria-label={`Next month, ${monthName(shiftMonth(ym, 1))}`}
        >
          {shortMonth(shiftMonth(ym, 1))} ›
        </button>
      </div>
      <table className="hb-month">
        <caption className="sr-only">
          {monthName(ym)}: {count} paper{count === 1 ? "" : "s"} finished
        </caption>
        <thead>
          <tr>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <th key={i} scope="col" className="hb-typed">
                <span aria-hidden>{d}</span>
                <span className="sr-only">
                  {
                    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
                      i
                    ]
                  }
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(days.length / 7) }, (_, w) => (
            <tr key={w}>
              {Array.from({ length: 7 }, (_, i) => {
                const d = days[w * 7 + i] ?? null;
                if (!d) return <td key={i} />;
                const s = byDate.get(d);
                const mood = moods.get(d);
                const isToday = d === today;
                const label = [
                  longDate(d),
                  s ? `No. ${s.issue} finished` : rest.has(d) ? "a rest day" : null,
                  mood ? `feeling ${MOODS.find((m) => m.id === mood)?.label.toLowerCase()}` : null,
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <td key={i} className={`hb-day ${isToday ? "is-today" : ""}`}>
                    <span className="sr-only">{label}</span>
                    <span className="hb-day__n" aria-hidden>
                      {Number(d.slice(8))}
                    </span>
                    {s ? (
                      <span
                        className="hb-day__stamp"
                        style={
                          {
                            "--ink": stampInk(s.design, s.colourway),
                            rotate: `${(hash(d) % 30) - 15}deg`,
                          } as CSSProperties
                        }
                        aria-hidden
                      >
                        {s.issue}
                      </span>
                    ) : rest.has(d) ? (
                      <span className="hb-day__rest" aria-hidden>
                        rest
                      </span>
                    ) : null}
                    {mood ? <MoodFace mood={mood} className="hb-day__mood" /> : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hb-written hb-written--small hb-month__sum">
        {count === 0
          ? "Nothing stamped this month yet."
          : `${count} paper${count === 1 ? "" : "s"} this month.`}
      </p>
      <p className="hb-leafpage__folio">2</p>
    </div>
  );
}

function StampsPage({
  stamps,
  from,
  folio,
  fresh,
}: {
  stamps: StampInfo[];
  from: number;
  folio: number;
  fresh?: number;
}) {
  const slots = Array.from({ length: STAMPS_PER_PAGE }, (_, i) => stamps[from + i] ?? null);
  const firstEmpty = slots.findIndex((s) => s === null);
  return (
    <div className="hb-leafpage hb-leafpage--stamps">
      <p className="hb-leafpage__head">Stamps</p>
      <ol className="hb-slots" start={from + 1}>
        {slots.map((s, i) => (
          <li key={i} className={`hb-slot ${s ? "" : "is-empty"}`}>
            {s ? (
              <RubberStamp
                stamp={s}
                className={`hb-slot__stamp ${fresh === s.issue ? "is-fresh" : ""}`}
              />
            ) : i === firstEmpty ? (
              <span className="hb-slot__next">next stamp goes here</span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="hb-leafpage__folio">{folio}</p>
    </div>
  );
}

function RulesPage({ folio }: { folio: number }) {
  return (
    <div className="hb-leafpage hb-leafpage--rules">
      <p className="hb-leafpage__head">Notes for the holder</p>
      <ol className="hb-rules">
        <li>
          A paper is finished when you&rsquo;ve read its back page and more than half its pages.
          It&rsquo;s stamped here, once.
        </li>
        <li>
          A streak counts papers finished on days in a row, by the date printed on the paper, so
          yesterday&rsquo;s paper read this morning still counts for yesterday.
        </li>
        <li>Today&rsquo;s paper never breaks a streak: you have until tomorrow&rsquo;s lands.</li>
        <li>
          Everyone misses one. One missed day in any seven is a rest day and the streak carries on.
        </li>
        <li>
          Special stamps: your first paper, weekend editions, streaks of 3, 7, 30 and 100 days, and
          a second stamp for solving every puzzle.
        </li>
        <li>This book lives on this device only. Nothing about your reading leaves it.</li>
      </ol>
      <p className="hb-leafpage__folio">{folio}</p>
    </div>
  );
}

/** The whole stamp book, for /stamps (or any page with room for an open booklet). */
export function StampBook({
  start = 0,
  fresh,
}: {
  start?: number;
  /** Issue to mark as just stamped. */ fresh?: number;
}) {
  const ready = useHabitsReady();
  const stamps = useStamps();
  const streak = useStreak();
  const today = useEditionToday();
  const { byDate: moods } = useMoods();
  const rest = useMemo(() => new Set(streak?.restDays ?? []), [streak]);
  const shownStreak = ready ? streak : null;
  const list = ready ? stamps : [];
  const stampPages = Math.max(1, Math.ceil((list.length + 1) / STAMPS_PER_PAGE));
  const pages = [
    <Cover key="cover" streak={shownStreak} stamps={list.length} />,
    <StreakPage key="streak" streak={shownStreak} stamps={list} />,
    <MonthPage
      key="month"
      today={ready ? today : null}
      stamps={list}
      moods={ready ? moods : new Map()}
      rest={rest}
    />,
    ...Array.from({ length: stampPages }, (_, i) => (
      <StampsPage
        key={`s${i}`}
        stamps={list}
        from={i * STAMPS_PER_PAGE}
        folio={3 + i}
        fresh={fresh}
      />
    )),
  ];
  pages.push(<RulesPage key="rules" folio={pages.length} />);
  // Inside pages come in pairs: a blank endpaper evens them up.
  if ((pages.length - 1) % 2 === 1)
    pages.push(<div key="end" className="hb-leafpage hb-leafpage--end" />);
  return (
    <div className={`hb-bookwrap ${habitFonts}`}>
      <Book pages={pages} label="Your stamp book" start={start} />
      <p className="hb-bookwrap__back">
        <Link href="/">Today&rsquo;s paper</Link> · <Link href="/saved">Kept stories</Link> ·{" "}
        <Link href="/archive">Back issues</Link>
      </p>
    </div>
  );
}
