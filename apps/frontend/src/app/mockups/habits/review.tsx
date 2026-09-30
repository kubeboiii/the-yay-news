"use client";

import { useEffect, useRef, useState } from "react";
import {
  earnSticker,
  exportLog,
  useDemoLogSwitch,
  useEditionToday,
  useHabitsReady,
  useStreak,
  writeDemoLog,
} from "@/features/habits/api";
import { STICKERS } from "@/features/habits/catalogue";
import type { StampInfo } from "@/features/habits/core";
import { addDays } from "@/features/habits/core";
import { demoEvents } from "@/features/habits/demo";
import { MoodPicker } from "@/features/habits/mood";
import { PaperPlaneEnding } from "@/features/habits/paper-plane";
import { useReadingTracker } from "@/features/habits/reading";
import { SaveStoryButton } from "@/features/habits/save-story";
import { RubberStamp } from "@/features/habits/stamp";
import { StampBook } from "@/features/habits/stamp-book";
import { StampMoment } from "@/features/habits/stamp-moment";
import { StickerLayer, StickerSheet } from "@/features/habits/stickers";
import { type PaperSound, play } from "@/features/sound";
import { SoundToggle } from "@/features/sound/sound-toggle";

const SOUNDS: PaperSound[] = [
  "pencil",
  "erase",
  "tick",
  "stamp",
  "sticker",
  "press",
  "fold",
  "rustle",
  "whoosh",
];

const sample = (over: Partial<StampInfo>): StampInfo => ({
  issue: 42,
  date: "2026-09-29",
  design: "broadsheet",
  colourway: "original",
  weekend: false,
  first: false,
  milestone: null,
  allSolved: false,
  at: "2026-09-29T08:00:00.000Z",
  ...over,
});

const GALLERY: { label: string; stamp: StampInfo }[] = [
  { label: "Weekday broadsheet", stamp: sample({}) },
  {
    label: "Pool Party ink",
    stamp: sample({ issue: 43, colourway: "pool-party", date: "2026-09-30" }),
  },
  {
    label: "First issue",
    stamp: sample({ issue: 38, first: true, date: "2026-09-24", colourway: "rave-grape" }),
  },
  {
    label: "Weekend tabloid",
    stamp: sample({
      issue: 40,
      design: "tabloid",
      colourway: "house",
      weekend: true,
      date: "2026-09-26",
    }),
  },
  {
    label: "Weekend zine",
    stamp: sample({
      issue: 41,
      design: "zine",
      colourway: "paint-box",
      weekend: true,
      date: "2026-09-27",
    }),
  },
  {
    label: "Midi",
    stamp: sample({
      issue: 47,
      design: "midi",
      colourway: "gelato-counter",
      weekend: true,
      date: "2026-10-03",
    }),
  },
  {
    label: "7-day streak",
    stamp: sample({ issue: 44, milestone: 7, colourway: "tropic-punch", date: "2026-10-01" }),
  },
  {
    label: "All puzzles solved",
    stamp: sample({ issue: 45, allSolved: true, colourway: "candy-shop", date: "2026-10-02" }),
  },
];

const SAMPLE_PAGES = [
  { order: 1, layout: "front", title: "Front page" },
  { order: 2, layout: "section", title: "Discoveries" },
  { order: 3, layout: "back", title: "Back page" },
];

/** One page of a pretend edition, tracked while it's on screen. */
function SamplePage({
  edition,
  page,
}: {
  edition: Parameters<typeof useReadingTracker>[0]["edition"];
  page: (typeof SAMPLE_PAGES)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useReadingTracker({ edition, page, target: ref });
  return (
    <div
      ref={ref}
      className="hr-sample"
      data-testid={`sample-page-${page.order}`}
      data-read={state.read ? "1" : "0"}
    >
      <p className="hr-sample__folio">p.{page.order}</p>
      <p className="hr-sample__title">{page.title}</p>
      <p className="hr-sample__state">{state.read ? "read" : "reading…"}</p>
      {state.justFinished ? (
        <StampMoment stamp={state.justFinished} streak={state.streak} onClose={state.dismiss} />
      ) : null}
    </div>
  );
}

function ReadingDemo() {
  const today = useEditionToday();
  const ready = useHabitsReady();
  if (!ready || !today) return null;
  const edition = {
    issueNumber: 900 + Number(today.slice(8)),
    date: today,
    design: "broadsheet" as const,
    colourway: "laser-tag",
    pages: SAMPLE_PAGES,
    puzzles: [{ type: "crossword" }, { type: "riddle" }],
  };
  return (
    <>
      <p className="hr-note">
        A pretend three-page edition dated today (No. {edition.issueNumber}). Each page counts as
        read after 6 seconds on screen; the paper is finished once the back page and more than half
        the pages are read, and the stamping card slides in.
      </p>
      <div className="hr-samples">
        {SAMPLE_PAGES.map((p) => (
          <SamplePage key={p.order} edition={edition} page={p} />
        ))}
      </div>
    </>
  );
}

function StreakLine() {
  const streak = useStreak();
  const ready = useHabitsReady();
  return (
    <span data-testid="streak">
      {ready && streak
        ? `${streak.current} day streak (best ${streak.best})${streak.doneToday ? ", today done" : ""}`
        : "…"}
    </span>
  );
}

export function HabitsReview() {
  const [demo, setDemo] = useDemoLogSwitch();
  const today = useEditionToday();
  const [momentKey, setMomentKey] = useState(0);

  // The review page starts on the demo log, and always hands the real one back on the way out.
  useEffect(() => {
    setDemo(true);
    return () => setDemo(false);
  }, [setDemo]);
  useEffect(() => {
    if (demo && today && exportLog().events.length === 0) writeDemoLog(demoEvents(today));
  }, [demo, today]);

  return (
    <main className="hr">
      <header className="hr-head">
        <p className="hr-kicker">Phase 3 review · habits &amp; rituals</p>
        <h1 className="hr-title">The reader&rsquo;s own things</h1>
        <div className="hr-bar">
          <label className="hr-switch">
            <input
              type="checkbox"
              checked={demo}
              onChange={(e) => setDemo(e.target.checked)}
              data-testid="demo-switch"
            />{" "}
            Demo data <small>(a month of made-up reading, kept apart from the real log)</small>
          </label>
          {demo && today ? (
            <button
              type="button"
              className="hr-link"
              onClick={() => writeDemoLog(demoEvents(today))}
            >
              reset demo
            </button>
          ) : null}
          <SoundToggle />
          <StreakLine />
        </div>
      </header>

      <section className="hr-sec">
        <h2 className="hr-h">1 · The stamping moment</h2>
        <div className="hr-row">
          <StampMoment
            key={momentKey}
            floating={false}
            streak={7}
            stamp={sample({
              issue: 44,
              date: today ?? "2026-09-30",
              milestone: 7,
              colourway: "tropic-punch",
            })}
          />
          <button
            type="button"
            className="hr-link"
            onClick={() => setMomentKey((k) => k + 1)}
            data-testid="restamp"
          >
            stamp it again
          </button>
        </div>
        <div className="hr-gallery">
          {GALLERY.map((g) => (
            <figure key={g.label} className="hr-gallery__item">
              <RubberStamp stamp={g.stamp} className="hr-gallery__stamp" />
              <figcaption>{g.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="hr-sec">
        <h2 className="hr-h">2 · The stamp book</h2>
        <StampBook start={1} />
      </section>

      <section className="hr-sec">
        <h2 className="hr-h">3 · What counts as reading</h2>
        <ReadingDemo />
      </section>

      <section className="hr-sec">
        <h2 className="hr-h">4 · Stickers</h2>
        <p className="hr-note">
          Earn one:{" "}
          {STICKERS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="hr-link"
              onClick={() => earnSticker(Math.floor(Math.random() * 1000) + 1, s.id)}
            >
              {s.id}
            </button>
          ))}
        </p>
        <div className="hr-stickers">
          <StickerSheet />
          <div className="hr-paper" data-testid="sample-sheet">
            <p className="hr-paper__mast">The Yay News</p>
            <p className="hr-paper__rule">No. 42 · Tuesday 29 September 2026 · good news only</p>
            <h3 className="hr-paper__head">Octopus paints its first masterpiece</h3>
            <div className="hr-paper__cols">
              <span />
              <span />
              <span />
            </div>
            <StickerLayer issue={42} page="review" />
          </div>
        </div>
      </section>

      <section className="hr-sec">
        <h2 className="hr-h">5 · The mood doodle</h2>
        <div className="hr-paper hr-paper--short">
          <MoodPicker
            issue={today ? 900 + Number(today.slice(8)) : 900}
            date={today ?? undefined}
          />
        </div>
      </section>

      <section className="hr-sec">
        <h2 className="hr-h">6 · Keep this one</h2>
        <div className="hr-paper hr-paper--short">
          <p className="hr-paper__kicker">Discoveries</p>
          <h3 className="hr-paper__head">
            Octopus paints its first masterpiece, gallery says it&rsquo;s &lsquo;mostly
            suckers&rsquo;
          </h3>
          <SaveStoryButton
            issue={42}
            slug="octopus-art"
            headline="Octopus paints its first masterpiece, gallery says it's 'mostly suckers'"
            kicker="Discoveries"
            date={today ? addDays(today, -1) : undefined}
          />
          <p className="hr-note">
            Kept stories are listed at <a href="/saved">/saved</a> (switch the demo data off to see
            your own).
          </p>
        </div>
      </section>

      <section className="hr-sec">
        <h2 className="hr-h">7 · The paper aeroplane</h2>
        <div className="hr-paper hr-paper--short">
          <PaperPlaneEnding issue={42} nextReleaseText="Tomorrow’s paper lands at 7am" />
        </div>
      </section>

      <section className="hr-sec">
        <h2 className="hr-h">8 · Paper sounds</h2>
        <p className="hr-note">Switch sound on above, then:</p>
        <p className="hr-note">
          {SOUNDS.map((s) => (
            <button key={s} type="button" className="hr-link" onClick={() => play(s)}>
              {s}
            </button>
          ))}
        </p>
      </section>
    </main>
  );
}
