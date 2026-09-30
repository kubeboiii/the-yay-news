"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useHabitLog, useHabitsReady, useStreak } from "@/features/habits/api";
import { pagesRead, solvedByIssue } from "@/features/habits/core";
import "./today.css";

// What sits above today's front page, depending on the time and on what the reader has done:
//   · before 07:00, the shutter is half up: today's paper is on the press, yesterday's is below;
//   · once today's paper is finished, the shop is closed till 7, with the reader's receipt;
//   · on a first visit, a note tucked into the paper saying what this is;
//   · halfway through, a chip back to the next page to read.
// The paper itself is always there underneath (#paper), so nothing is ever locked away.

export type HeroPage = { order: number; label: string; href: string; colour: string };

type Props = {
  issue: number;
  pages: HeroPage[];
  /** A word or two per page for the receipt, from the day's kickers. */
  tags: string[];
  /** Minutes until 07:00 while today's paper is still on the press; null once it has landed. */
  pressIn: number | null;
  /** The paper served before 7 is yesterday's; its date, for the label. */
  servedLabel: string;
};

const WELCOMED = "yn-welcomed";

function readFlag(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeFlag(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked: the note shows again next time, which is fine */
  }
}

function useCountdown(minutes: number | null) {
  const router = useRouter();
  const [left, setLeft] = useState(minutes === null ? null : minutes * 60);
  useEffect(() => {
    if (minutes === null) return;
    const until = Date.now() + minutes * 60_000;
    const tick = () => {
      const s = Math.max(0, Math.round((until - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) router.refresh();
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [minutes, router]);
  return left;
}

function OnThePress({
  issue,
  pressIn,
  servedLabel,
}: Pick<Props, "issue" | "pressIn" | "servedLabel">) {
  const left = useCountdown(pressIn);
  const secs = left ?? 0;
  const h = Math.floor(secs / 3600);
  const m = Math.ceil((secs % 3600) / 60);
  const wait = h > 0 ? `${h}h ${m}m` : `${m} minute${m === 1 ? "" : "s"}`;
  return (
    <section className="ys-shutter ys-shutter--half" aria-labelledby="ys-press-title">
      <div className="ys-shutter__slats">
        <p className="ys-shutter__kicker">No. {issue + 1} is on the press</p>
        <h1 id="ys-press-title" className="ys-shutter__title">
          Fresh ink
          <br />
          at 7:00
        </h1>
        <p className="ys-shutter__sub">
          Lands in <b>{wait}</b>. Same paper for everyone, wherever you are.
        </p>
      </div>
      <a href="#paper" className="ys-peek">
        <span className="ys-peek__kicker">{servedLabel}</span>
        <span className="ys-peek__line">Read it while you wait ↓</span>
      </a>
    </section>
  );
}

function Closed({ issue, pages, tags }: Pick<Props, "issue" | "pages" | "tags">) {
  const events = useHabitLog();
  const streak = useStreak();
  const read = useMemo(() => pagesRead(events, issue), [events, issue]);
  const finished = events.find((e) => e.type === "edition_finished" && e.issue === issue);
  const puzzles = finished && finished.type === "edition_finished" ? (finished.puzzles ?? 0) : 0;
  const solved = solvedByIssue(events).get(issue)?.size ?? 0;
  const [shared, setShared] = useState<string | null>(null);

  const receipt = [
    `THE YAY NEWS  No. ${issue}`,
    `${pages.map((p) => (read.has(p.order) ? "🟨" : "⬜")).join("")} ${read.size}/${pages.length} pages`,
    ...(puzzles ? [`🧩 ${Math.min(solved, puzzles)}/${puzzles} puzzles`] : []),
    tags.slice(0, 3).join(" · ").toUpperCase(),
  ];

  const share = async () => {
    const url = `${window.location.origin}/issue/${issue}`;
    const text = `${receipt.join("\n")}\n${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShared("Copied. Paste it in the group chat.");
    } catch {
      setShared("Couldn't copy that. Try again?");
    }
  };

  return (
    <section className="ys-shutter ys-shutter--down" aria-labelledby="ys-closed-title">
      <div className="ys-sign">
        <p className="ys-sign__small">Sorry, we&rsquo;re</p>
        <h1 id="ys-closed-title" className="ys-sign__big">
          Closed
        </h1>
        <p className="ys-sign__sub">Fresh ink at 7:00 tomorrow.</p>
      </div>
      <p className="ys-scrawl">go outside. see you at 7.</p>

      <div className="ys-receipt" aria-label={`Your receipt for No. ${issue}`}>
        <p className="ys-receipt__head">The Yay News · No. {issue}</p>
        <p className="ys-receipt__row" aria-label={`${read.size} of ${pages.length} pages read`}>
          {pages.map((p) => (
            <span
              key={p.order}
              className="ys-receipt__sq"
              style={{ background: read.has(p.order) ? p.colour : "#ffffff" }}
            />
          ))}
          <span className="ys-receipt__n">
            {read.size}/{pages.length} pages
          </span>
        </p>
        {puzzles ? (
          <p className="ys-receipt__line">
            Puzzles {Math.min(solved, puzzles)}/{puzzles}
          </p>
        ) : null}
        {streak?.current ? <p className="ys-receipt__line">Streak {streak.current}</p> : null}
        <p className="ys-receipt__line">{tags.slice(0, 3).join(" · ")}</p>
      </div>
      <button type="button" className="ys-btn ys-btn--hi" onClick={share}>
        Share the receipt
      </button>
      {shared ? (
        <p className="ys-note" role="status">
          {shared}
        </p>
      ) : null}

      <div className="ys-shutter__links">
        <Link href="/pile" className="ys-btn">
          Your Pile
        </Link>
        <Link href="/wall" className="ys-btn">
          Your Wall
        </Link>
      </div>
      <a href="#paper" className="ys-again">
        Read it again ↓
      </a>
    </section>
  );
}

function Welcome() {
  // Only mounted after hydration (TodayHero waits for the habits log), so storage can be read here.
  const [open, setOpen] = useState(() => !readFlag(WELCOMED));
  if (!open) return null;
  const close = () => {
    writeFlag(WELCOMED, "1");
    setOpen(false);
  };
  return (
    <aside className="ys-flyer" aria-label="New here?">
      <span className="ys-flyer__tape" aria-hidden />
      <p className="ys-flyer__hand">new here? a fresh paper drops every morning at 7.</p>
      <p className="ys-flyer__text">
        Only good news, about fifteen minutes of it. Turn the pages, do the puzzles on the back, and
        then it ends. That&rsquo;s the whole idea.
      </p>
      <button type="button" className="ys-btn ys-btn--ink" onClick={close}>
        Got it, let&rsquo;s read
      </button>
    </aside>
  );
}

function Resume({ issue, pages }: Pick<Props, "issue" | "pages">) {
  const events = useHabitLog();
  const read = useMemo(() => pagesRead(events, issue), [events, issue]);
  if (read.size === 0) return null;
  const next = pages.find((p) => !read.has(p.order) && p.order !== pages[0]?.order);
  if (!next) return null;
  return (
    <Link href={next.href} className="ys-resume">
      <span className="ys-resume__k">Carry on</span>
      <span>
        Page {pages.indexOf(next) + 1} · {next.label} →
      </span>
    </Link>
  );
}

export function TodayHero(props: Props) {
  const ready = useHabitsReady();
  const events = useHabitLog();
  if (props.pressIn !== null) return <OnThePress {...props} />;
  if (!ready) return null;
  const finished = events.some((e) => e.type === "edition_finished" && e.issue === props.issue);
  if (finished) return <Closed {...props} />;
  return (
    <>
      {events.length === 0 ? <Welcome /> : null}
      <Resume issue={props.issue} pages={props.pages} />
    </>
  );
}
