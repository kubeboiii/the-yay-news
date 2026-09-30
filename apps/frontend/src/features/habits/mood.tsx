"use client";

import { useId, useMemo, useState } from "react";
import { play } from "@/features/sound";
import { record, useHabitLog, useHabitsReady } from "./api";
import { MOODS, type MoodId, moodsByIssue } from "./core";
import { handwriting } from "./fonts";
import { ellipse, hash, line, rng, scrawl } from "./sketch";
import "./mood.css";

// The sign-off's mood doodle: six faces sketched in pencil. Pick one and it's drawn in, darker,
// with a ring round it, as if you'd gone over it; the paper remembers it for the day's stamp.

type Stroke = { d: string; w?: number; fill?: boolean };

/** The pencil strokes of one face in a 100 × 100 box. Seeded, so identical everywhere. */
export function faceStrokes(mood: MoodId, variant = 0): Stroke[] {
  const r = rng(hash(`face:${mood}:${variant}`));
  const out: Stroke[] = [];
  // The head: gone round twice, like a real pencil circle.
  out.push({ d: ellipse(r, 50, 53, 33, 31, 1.2, 0.22) });
  out.push({ d: ellipse(r, 50, 53, 32, 30.5, 1.4, 0.1), w: 0.8 });
  const dot = (x: number, y: number, s = 2.4) =>
    out.push({ d: ellipse(r, x, y, s, s * 1.1, 0.6, 0.4), fill: true });
  switch (mood) {
    case "sunny": {
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI + (Math.PI * 2 * i) / 9 + 0.2;
        const c = Math.cos(a);
        const s = Math.sin(a);
        out.push({ d: line(r, 50 + c * 39, 53 + s * 37, 50 + c * 47, 53 + s * 45, 0.7) });
      }
      dot(39, 47);
      dot(61, 47);
      out.push({
        d: scrawl(
          r,
          [
            [34, 60],
            [42, 69],
            [50, 72],
            [58, 69],
            [66, 59],
          ],
          0.8,
        ),
      });
      break;
    }
    case "grin": {
      out.push({
        d: scrawl(
          r,
          [
            [33, 49],
            [38, 43],
            [44, 49],
          ],
          0.5,
        ),
      });
      out.push({
        d: scrawl(
          r,
          [
            [56, 49],
            [62, 43],
            [67, 49],
          ],
          0.5,
        ),
      });
      out.push({
        d: scrawl(
          r,
          [
            [31, 58],
            [50, 60],
            [69, 58],
            [63, 72],
            [50, 76],
            [37, 72],
            [31, 58],
          ],
          0.7,
        ),
      });
      out.push({ d: line(r, 34, 63.5, 66, 63.5, 0.6), w: 0.8 });
      out.push({ d: line(r, 45, 60, 45, 74, 0.5), w: 0.7 });
      out.push({ d: line(r, 55, 60, 55, 74, 0.5), w: 0.7 });
      break;
    }
    case "calm": {
      out.push({
        d: scrawl(
          r,
          [
            [33, 48],
            [38, 52],
            [44, 48],
          ],
          0.4,
        ),
      });
      out.push({
        d: scrawl(
          r,
          [
            [56, 48],
            [62, 52],
            [67, 48],
          ],
          0.4,
        ),
      });
      out.push({
        d: scrawl(
          r,
          [
            [41, 64],
            [50, 68],
            [59, 64],
          ],
          0.5,
        ),
      });
      out.push({ d: line(r, 27, 58, 33, 56, 0.4), w: 0.7 });
      out.push({ d: line(r, 28, 61, 34, 59, 0.4), w: 0.7 });
      out.push({ d: line(r, 67, 56, 73, 58, 0.4), w: 0.7 });
      out.push({ d: line(r, 66, 59, 72, 61, 0.4), w: 0.7 });
      break;
    }
    case "silly": {
      out.push({ d: line(r, 33, 47, 44, 46, 0.5) });
      dot(61, 46, 3);
      out.push({
        d: scrawl(
          r,
          [
            [33, 60],
            [42, 66],
            [52, 67],
            [62, 64],
            [69, 57],
          ],
          0.6,
        ),
      });
      out.push({
        d: scrawl(
          r,
          [
            [46, 66.5],
            [45, 75],
            [51, 79],
            [57, 74],
            [56, 65.5],
          ],
          0.5,
        ),
      });
      out.push({ d: line(r, 51, 68, 51, 75, 0.4), w: 0.6 });
      break;
    }
    case "sleepy": {
      out.push({
        d: scrawl(
          r,
          [
            [32, 50],
            [38, 52],
            [44, 50],
          ],
          0.4,
        ),
      });
      out.push({
        d: scrawl(
          r,
          [
            [56, 50],
            [62, 52],
            [68, 50],
          ],
          0.4,
        ),
      });
      out.push({ d: ellipse(r, 50, 66, 4.5, 5, 0.6, 0.2) });
      out.push({
        d: scrawl(
          r,
          [
            [72, 18],
            [80, 18],
            [72, 26],
            [80, 26],
          ],
          0.3,
        ),
        w: 0.8,
      });
      out.push({
        d: scrawl(
          r,
          [
            [83, 6],
            [89, 6],
            [83, 12],
            [89, 12],
          ],
          0.3,
        ),
        w: 0.7,
      });
      break;
    }
    case "wow": {
      out.push({ d: ellipse(r, 39, 46, 6, 7, 0.6, 0.15) });
      out.push({ d: ellipse(r, 61, 46, 6, 7, 0.6, 0.15) });
      dot(40, 47, 2);
      dot(62, 47, 2);
      out.push({
        d: scrawl(
          r,
          [
            [31, 34],
            [38, 31],
            [45, 33],
          ],
          0.4,
        ),
      });
      out.push({
        d: scrawl(
          r,
          [
            [55, 33],
            [62, 31],
            [69, 34],
          ],
          0.4,
        ),
      });
      out.push({ d: ellipse(r, 50, 67, 6, 7.5, 0.7, 0.2) });
      break;
    }
  }
  return out;
}

/** A pencil face. `drawn` animates the strokes going down (pathLength 1 + dash offset). */
export function MoodFace({
  mood,
  drawn = false,
  faint = false,
  className,
  title,
}: {
  mood: MoodId;
  drawn?: boolean;
  faint?: boolean;
  className?: string;
  title?: string;
}) {
  const raw = useId();
  const id = `hbm${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const strokes = useMemo(() => faceStrokes(mood), [mood]);
  return (
    <svg
      viewBox="0 0 100 100"
      className={`hb-face ${drawn ? "is-drawn" : ""} ${faint ? "is-faint" : ""} ${className ?? ""}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={hash(mood) % 50}
            result="t"
          />
          <feDisplacementMap in="SourceGraphic" in2="t" scale={1.8} result="d" />
          <feColorMatrix
            in="t"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.2 0 0 0 1.9"
            result="g"
          />
          <feComposite in="d" in2="g" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} className="hb-face__lead">
        {strokes.map((s, i) => (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            className={s.fill ? "hb-face__dot" : "hb-face__stroke"}
            style={{
              strokeWidth: 2.6 * (s.w ?? 1),
              animationDelay: drawn ? `${i * 0.07}s` : undefined,
            }}
          />
        ))}
      </g>
    </svg>
  );
}

const RING = (seed: number) => ellipse(rng(seed), 50, 50, 46, 43, 1.6, 0.25);

/**
 * "How did today's paper leave you?" — six pencil faces to pick from, for the sign-off. Records a
 * `mood` event (the latest pick for an issue is the one kept).
 */
export function MoodPicker({
  issue,
  date,
  question = "How did today’s paper leave you?",
  className,
}: {
  issue: number;
  /** The edition's date, so the stamp book's month can show it even before the paper's finished. */
  date?: string;
  question?: string;
  className?: string;
}) {
  const events = useHabitLog();
  const ready = useHabitsReady();
  const picked = useMemo(() => moodsByIssue(events).get(issue) ?? null, [events, issue]);
  const [fresh, setFresh] = useState<MoodId | null>(null);
  const qid = useId();
  return (
    <section
      className={`hb-mood ${handwriting.className} ${className ?? ""}`}
      aria-labelledby={qid}
    >
      <h2 id={qid} className="hb-mood__q">
        {question}
      </h2>
      <div className="hb-mood__row" role="radiogroup" aria-labelledby={qid}>
        {MOODS.map((m, i) => {
          const on = ready && picked === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={m.label}
              className={`hb-mood__pick ${on ? "is-on" : ""}`}
              style={{ rotate: `${[-4, 3, -2, 5, -3, 2][i]}deg` }}
              onClick={() => {
                if (picked === m.id) return;
                setFresh(m.id);
                record({ type: "mood", issue, mood: m.id, date });
                play("pencil");
                window.setTimeout(() => play("pencil"), 140);
                window.setTimeout(() => play("pencil"), 300);
              }}
            >
              <MoodFace
                mood={m.id}
                drawn={on && fresh === m.id}
                faint={ready && picked !== null && !on}
              />
              {on ? (
                <svg
                  viewBox="0 0 100 100"
                  className={`hb-mood__ring ${fresh === m.id ? "is-fresh" : ""}`}
                  aria-hidden
                >
                  <path d={RING(hash(`ring:${m.id}`))} pathLength={1} />
                </svg>
              ) : null}
              <span className="hb-mood__label">{m.label}</span>
            </button>
          );
        })}
      </div>
      <p className="hb-mood__note" aria-live="polite">
        {ready && picked
          ? `Noted: ${MOODS.find((m) => m.id === picked)?.label.toLowerCase()}. It goes in your stamp book.`
          : " "}
      </p>
    </section>
  );
}
