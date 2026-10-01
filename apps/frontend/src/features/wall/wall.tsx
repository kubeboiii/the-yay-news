"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { CardFaceDown } from "@/features/cards/card-view";
import { useCollection } from "@/features/cards/use-collection";
import {
  record,
  useHabitLog,
  useHabitsReady,
  useSavedStories,
  useStamps,
  useStickers,
  useStreak,
} from "@/features/habits/api";
import { STICKERS } from "@/features/habits/catalogue";
import { StickerArt } from "@/features/habits/sticker-art";
import { storyHref } from "@/features/papers/reading";
import { GoButton, Heading, Mascot, RansomHeading, tilt } from "@/features/riot";
import { statusesOf } from "@/features/site/status";
import { Dumps } from "./dump";
import { MoveMyWall } from "./move-my-wall";
import "@/features/habits/stickers.css";

// Your Wall (Direction B, "Riso Zine Riot"): a zine you made by reading. One flat band of plate A
// carries the stories you ripped out; then your cards in their sleeves, the punch card of stamps,
// the sticker bomb, the photo dump of your week or month, and the envelope to smuggle it all to a
// new phone. It all lives on this device, so the page fills in after it loads.

const SHORT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const SLOTS = 6;

function RippedOut() {
  const saved = useSavedStories();
  return (
    <section className="sb-clips" aria-labelledby="clip-h">
      <Heading id="clip-h" className="sb-h">
        Ripped out
      </Heading>
      {saved.length === 0 ? (
        <p className="ys-empty">
          Nothing yet. Tick &ldquo;Keep this one&rdquo; under any story and it gets ripped out and
          stuck up here.
        </p>
      ) : (
        <ul>
          {saved.map((s, i) => (
            <li
              key={`${s.issue}:${s.slug}`}
              className={i === 0 ? "is-hero" : undefined}
              style={i === 0 ? { rotate: `${tilt(s.slug, 3) || -2}deg` } : undefined}
            >
              <Link href={storyHref(s.issue, s.slug)} className="sb-clip">
                <span className="sb-clip__kick">{s.kicker ?? `No. ${s.issue}`}</span>
                <span className="sb-clip__head">{s.headline}</span>
                <span className="ys-clip__from rt-meta">
                  No. {s.issue}
                  {s.date ? ` · ${SHORT.format(new Date(`${s.date}T00:00:00Z`))}` : ""}
                </span>
              </Link>
              {i === 0 ? <span className="sb-clip__tape" aria-hidden /> : null}
              <button
                type="button"
                className="ys-unpin"
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
      )}
    </section>
  );
}

function Sleeves() {
  const collection = useCollection();
  const owned = collection.owned.size + collection.classic.size;
  const waiting = collection.pending.length;
  return (
    <section className="sb-sleeves" aria-labelledby="cards-h">
      <Heading id="cards-h" className="sb-h">
        Yay Attax
      </Heading>
      <div className="sb-sleeves__page" aria-label={`${owned} cards in your album`}>
        {Array.from({ length: SLOTS }, (_, k) =>
          k < owned ? (
            <div key={k} className="sb-sleeve">
              <CardFaceDown />
            </div>
          ) : (
            <div key={k} className="sb-sleeve sb-sleeve--empty">
              <span>slot {k + 1}</span>
            </div>
          ),
        )}
      </div>
      <GoButton
        href="/cards"
        sub={
          waiting
            ? `${waiting} ${waiting === 1 ? "pack" : "packs"} waiting to open`
            : `${owned} ${owned === 1 ? "card" : "cards"} so far`
        }
        className="sb-sleeves__go"
      >
        {waiting ? "Open your packs" : "Your album"}
      </GoButton>
    </section>
  );
}

function PunchCard() {
  const stamps = useStamps();
  const streak = useStreak();
  const events = useHabitLog();
  const late = statusesOf(events);
  return (
    <section className="sb-punch" aria-labelledby="punch-h">
      <Heading id="punch-h" className="sb-h">
        Punch card
      </Heading>
      <p className="sb-punch__run">
        {streak?.current ?? 0} in a row · best {streak?.best ?? 0} · {stamps.length} punched
      </p>
      {stamps.length ? (
        <ol className="sb-punch__holes">
          {stamps.slice(-12).map((s) => (
            <li
              key={s.issue}
              className={late.get(s.issue)?.state === "late" ? "is-late" : undefined}
            >
              <span className="sb-punch__hole" aria-hidden />
              <span>{SHORT.format(new Date(`${s.date}T00:00:00Z`))}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="ys-empty">Finish a paper and it gets punched here.</p>
      )}
      <Link href="/pile#tour" className="sb-punch__more">
        Every date on the stamp tour
      </Link>
    </section>
  );
}

function StickerBomb() {
  const owned = useStickers();
  const ids = new Set(owned.map((s) => s.sticker));
  const known = STICKERS.filter((s) => ids.has(s.id));
  const missing = STICKERS.filter((s) => !ids.has(s.id)).slice(0, 4);
  const issue = owned[0]?.issue ?? 0;
  return (
    <section className="sb-lid" aria-labelledby="lid-h">
      <Heading id="lid-h" className="sb-h">
        Sticker bomb
      </Heading>
      <div className="sb-lid__lid">
        <ul className="sb-lid__bomb">
          {known.map((st, i) => (
            <li
              key={st.id}
              style={
                {
                  rotate: `${tilt(st.id, 18)}deg`,
                  left: `${[4, 34, 62, 14, 48, 74, 28, 58][i % 8]}%`,
                  top: `${[6, 2, 10, 46, 40, 50, 70, 74][i % 8]}%`,
                  width: `${Math.max(st.w * 5.4, 60)}px`,
                } as CSSProperties
              }
            >
              <span className="sb-lid__art" style={{ aspectRatio: `1 / ${st.ratio}` }}>
                <StickerArt id={st.id} issue={issue} />
              </span>
              <span className="rt-sr">{st.label}</span>
            </li>
          ))}
        </ul>
        {known.length === 0 ? <p className="ys-empty ys-empty--lid">No stickers yet.</p> : null}
      </div>
      {missing.length ? (
        <>
          <p className="sb-lid__still">Still to get:</p>
          <ul className="sb-lid__todo">
            {missing.map((m) => (
              <li key={m.id}>
                <b>{m.label}</b> for {m.earnedBy}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

export function Wall() {
  const ready = useHabitsReady();
  const saved = useSavedStories();
  const stickers = useStickers();
  const streak = useStreak();
  return (
    <div className="ys-page sb-wall">
      <div className="sb-wall__head">
        <RansomHeading text="MY WALL" seed="my-wall" as="h1" className="sb-pile__h" />
        <p className="sb-pile__sub">
          {ready
            ? `${saved.length} ${saved.length === 1 ? "story" : "stories"} ripped out, ${stickers.length} ${stickers.length === 1 ? "sticker" : "stickers"}, a ${streak?.current ?? 0}-day run.`
            : "Pinning everything up…"}
        </p>
      </div>
      <Mascot pose="lights" className="sb-wall__odin" label="" />
      {ready ? (
        <>
          <RippedOut />
          <Sleeves />
          <PunchCard />
          <StickerBomb />
          <Dumps />
          <MoveMyWall />
        </>
      ) : null}
    </div>
  );
}
