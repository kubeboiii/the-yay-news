"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { storyHref } from "@/features/papers/reading";
import { play } from "@/features/sound";
import { record, useHabitsReady, useSavedStories } from "./api";
import { habitFonts } from "./fonts";
import { hash, rng } from "./sketch";
import { longDate } from "./stamp";
import "./saved.css";

/** The kept stories, as newspaper clippings taped to the desk, newest first. */
export function SavedList() {
  const ready = useHabitsReady();
  const saved = useSavedStories();
  if (!ready) {
    return <p className={`hb-saved__empty ${habitFonts}`}>Finding your clippings…</p>;
  }
  if (saved.length === 0) {
    return (
      <p className={`hb-saved__empty ${habitFonts}`}>
        Nothing kept yet. Tick <i>Keep this one</i> beside any story and it&rsquo;ll be clipped out
        and kept here, on this device.
      </p>
    );
  }
  return (
    <ul className={`hb-saved__list ${habitFonts}`}>
      {saved.map((s) => {
        const r = rng(hash(`${s.issue}:${s.slug}`));
        const style = {
          "--tilt": `${(r() * 2 - 1) * 1.6}deg`,
          "--tape": `${(r() * 2 - 1) * 8}deg`,
          "--tape-x": `${30 + r() * 40}%`,
        } as CSSProperties;
        return (
          <li key={`${s.issue}:${s.slug}`} className="hb-clip" style={style}>
            <span className="hb-clip__tape" aria-hidden />
            <p className="hb-clip__meta">
              The Yay News · No. {s.issue}
              {s.date ? ` · ${longDate(s.date)}` : ""}
            </p>
            {s.kicker ? <p className="hb-clip__kicker">{s.kicker}</p> : null}
            <h2 className="hb-clip__head">
              <Link href={storyHref(s.issue, s.slug)}>{s.headline}</Link>
            </h2>
            <p className="hb-clip__foot">
              <Link href={storyHref(s.issue, s.slug)} className="hb-clip__read">
                Read it again
              </Link>
              <button
                type="button"
                className="hb-clip__drop"
                onClick={() => {
                  record({ type: "story_unsaved", issue: s.issue, slug: s.slug });
                  play("erase");
                }}
              >
                Let it go<span className="sr-only">: {s.headline}</span>
              </button>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
