"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  record,
  useHabitLog,
  useHabitsReady,
  useSavedStories,
  useStamps,
  useStickers,
  useStreak,
} from "@/features/habits/api";
import { storyHref } from "@/features/papers/reading";
import { StampBook } from "@/features/habits/stamp-book";
import { statusesOf } from "@/features/site/status";
import { MoveMyWall } from "./move-my-wall";

// Your Wall: a corkboard of everything the reader has kept. Stories they tore out, pinned up as
// clippings; their stamps and streak; the card album; and a way to carry the lot to a new phone.
// It all lives on this device, so the page fills in after it loads.

const SHORT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const tilt = (i: number) => [-2.5, 2, -1.2, 2.8, -3, 1.4][i % 6];

function Clippings() {
  const saved = useSavedStories();
  if (saved.length === 0) {
    return (
      <p className="wl-note">
        tear a story out of the paper (&ldquo;Keep this one&rdquo; under any story) and it gets
        pinned up here.
      </p>
    );
  }
  return (
    <ul className="wl-clips">
      {saved.map((s, i) => (
        <li
          key={`${s.issue}:${s.slug}`}
          className="wl-clips__item"
          style={{ rotate: `${tilt(i)}deg` }}
        >
          <Link href={storyHref(s.issue, s.slug)} className="wl-clip">
            <span className="wl-pin" aria-hidden />
            {s.kicker ? <span className="wl-clip__k">{s.kicker}</span> : null}
            <span className="wl-clip__head">{s.headline}</span>
            <span className="wl-clip__from">
              No. {s.issue}
              {s.date ? ` · ${SHORT.format(new Date(`${s.date}T00:00:00Z`))}` : ""}
            </span>
          </Link>
          <button
            type="button"
            className="wl-unpin"
            aria-label={`Take “${s.headline}” off the wall`}
            onClick={() => record({ type: "story_unsaved", issue: s.issue, slug: s.slug })}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Stamps() {
  const stamps = useStamps();
  const streak = useStreak();
  const events = useHabitLog();
  const states = useMemo(() => statusesOf(events), [events]);
  const late = stamps.filter((s) => states.get(s.issue)?.state === "late").length;
  const recent = stamps.slice(-12).reverse();
  return (
    <div className="wl-card wl-card--stamps">
      <p className="wl-card__line">
        <b>
          {stamps.length} stamp{stamps.length === 1 ? "" : "s"}
        </b>
        {late ? ` · ${late} read late` : ""} · streak <b>{streak?.current ?? 0}</b>
        {streak && streak.best > streak.current ? ` · best ${streak.best}` : ""}
      </p>
      {recent.length ? (
        <ul className="wl-stamps" aria-label="Your latest stamps">
          {recent.map((s, i) => {
            const isLate = states.get(s.issue)?.state === "late";
            return (
              <li
                key={s.issue}
                className={isLate ? "wl-stamp wl-stamp--late" : "wl-stamp"}
                style={{ rotate: `${[-8, 6, -4, 9, -6, 3][i % 6]}deg` }}
              >
                <span className="wl-stamp__n">{s.issue}</span>
                <span className="wl-stamp__d">{SHORT.format(new Date(`${s.date}T00:00:00Z`))}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="wl-card__hint">Finish a paper and its stamp lands here.</p>
      )}
      <a href="#wl-book" className="wl-link">
        Open the stamp book ↓
      </a>
    </div>
  );
}

export function Wall() {
  const ready = useHabitsReady();
  const stickers = useStickers();
  if (!ready) return <p className="wl-note">Pinning everything up…</p>;
  return (
    <>
      <section className="wl-section" aria-labelledby="wl-clippings">
        <h2 id="wl-clippings" className="wl-label">
          Clippings
        </h2>
        <Clippings />
      </section>

      <section className="wl-section" id="stamps" aria-labelledby="wl-stamps">
        <h2 id="wl-stamps" className="wl-label">
          Stamps
        </h2>
        <Stamps />
        <div id="wl-book" className="wl-book">
          <StampBook start={1} />
        </div>
      </section>

      <section className="wl-section wl-section--pair" aria-label="Cards and stickers">
        <Link href="/cards" className="wl-card wl-card--link">
          <span className="wl-label wl-label--in">Cards</span>
          <span className="wl-card__big">Yay Attax</span>
          <span className="wl-card__hint">Your album, packs and duels →</span>
        </Link>
        <div className="wl-card">
          <span className="wl-label wl-label--in">Stickers</span>
          <span className="wl-card__big">{stickers.length}</span>
          <span className="wl-card__hint">
            {stickers.length === 1 ? "sticker" : "stickers"} earned. Stick them on any page of the
            paper.
          </span>
        </div>
      </section>

      <section className="wl-section" aria-labelledby="wl-move">
        <h2 id="wl-move" className="wl-label">
          New phone?
        </h2>
        <MoveMyWall />
      </section>
    </>
  );
}
