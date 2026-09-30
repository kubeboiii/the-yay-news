"use client";

import type { CSSProperties, ReactNode } from "react";
import { useId, useMemo, useRef, useState } from "react";
import { earnSticker, record, usePuzzleProgress } from "@/features/habits/api";
import { stickerForPuzzle } from "@/features/habits/catalogue";
import { play } from "@/features/sound";
import { PlayFrame } from "./frame";
import { hashSeed, seeded } from "./paper-style";
import { Announcer, Pencil, PencilLetter } from "./pencil";
import { Arrow, opts, roughGen as gen, RoughPaths, Tick, toPaths } from "./rough";
import type { PlayStyleProps, WordLadderData, WordLadderSolution } from "./types";
import { knownWord, lettersChanged } from "./words";

// The word ladder, on strips torn from the paper and laid across two pencilled rails. The start
// word is printed on the bottom strip and the end word on the top; the reader pencils a word on
// each strip between. Any path counts, not just the printed answer: every step changes one letter
// and is a real word (see ./words). A step that breaks the one-letter rule gets a pencilled "?"
// and a wobble; a word the dictionary doesn't know gets a softer "a word?" and doesn't complete
// the ladder.

type Progress = { steps: string[]; solved?: boolean };
type Verdict = "empty" | "ok" | "unknown" | "bad";

const ROW = 3.4; // em per rung

export type WordLadderProps = {
  issue: number;
  data: WordLadderData;
  /** Yesterday's (or a preview's) answer; its words join the pocket dictionary. */
  solution?: WordLadderSolution;
} & PlayStyleProps;

function Strip({
  seed,
  printed,
  children,
  wobbling,
  overlay,
}: {
  seed: number;
  printed?: boolean;
  children: ReactNode;
  /** Changes each time the strip should wobble. */
  wobbling?: number;
  /** Rendered outside the wobbling part (the input, so it keeps focus). */
  overlay?: ReactNode;
}) {
  const r = seeded(seed);
  const style = {
    "--pl-tilt": `${(r() - 0.5) * 2.6}deg`,
    "--pl-shift": `${(r() - 0.5) * 0.9}em`,
    "--pl-tear": `${Math.round(r() * 100)}%`,
    "--pl-tear-end": `${Math.round(r() * 100)}%`,
  } as CSSProperties;
  return (
    <div className={`pl-strip ${printed ? "is-printed" : ""}`} style={style}>
      <div key={wobbling ?? 0} className={`pl-strip-body ${wobbling ? "is-wobbling" : ""}`}>
        <div className="pl-strip-paper" />
        <div className="pl-strip-ink">{children}</div>
      </div>
      {overlay}
    </div>
  );
}

export function WordLadder({ issue, data, solution, ...style }: WordLadderProps) {
  const L = data.start.length;
  const start = data.start.toUpperCase();
  const end = data.end.toUpperCase();
  const [progress, setProgress] = usePuzzleProgress<Progress>(`${issue}:word_ladder`, {
    steps: [],
  });
  const steps = Array.from({ length: data.steps }, (_, i) =>
    (progress.steps[i] ?? "").toUpperCase().slice(0, L),
  );
  const [focus, setFocus] = useState<number | null>(null);
  const [wobble, setWobble] = useState<{ rung: number; id: number } | null>(null);
  const [message, setMessage] = useState("");
  const [justSolved, setJustSolved] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const wobbles = useRef(0);
  const extra = solution?.ladder ?? [];
  const uid = useId();

  const judge = (words: string[]) =>
    words.map((w, i): Verdict => {
      if (w.length < L) return "empty";
      const prev = i === 0 ? start : words[i - 1]!;
      if (prev.length < L) return knownWord(w, extra) ? "ok" : "unknown";
      if (lettersChanged(prev, w) !== 1) return "bad";
      if (i === words.length - 1 && lettersChanged(w, end) !== 1) return "bad";
      return knownWord(w, extra) ? "ok" : "unknown";
    });
  const solvedBy = (words: string[]) => judge(words).every((x) => x === "ok");
  const verdicts = judge(steps);
  const solved = solvedBy(steps);

  const why = (words: string[], i: number) => {
    const prev = i === 0 ? start : words[i - 1]!;
    const w = words[i]!;
    if (lettersChanged(prev, w) !== 1)
      return `${w} changes ${lettersChanged(prev, w)} letters from ${prev}; change just one.`;
    return `${w} is one letter from ${prev}, but the next step up has to reach ${end}.`;
  };

  const change = (i: number, raw: string) => {
    const word = raw
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, L);
    const before = steps[i] ?? "";
    if (word === before) return;
    play(word.length < before.length ? "erase" : "pencil");
    const next = steps.map((w, k) => (k === i ? word : w));
    const wasSolved = solvedBy(steps);
    const nowSolved = solvedBy(next);
    setProgress({ steps: next, solved: progress.solved || nowSolved || undefined });
    if (word.length === L) {
      const v = judge(next)[i];
      if (v === "bad") {
        wobbles.current += 1;
        setWobble({ rung: i, id: wobbles.current });
        setMessage(why(next, i));
      } else if (!nowSolved) {
        setMessage(
          v === "unknown"
            ? `${word}: is that a word? It isn't in our dictionary; try another.`
            : `${word}, good step.`,
        );
        if (i + 1 < data.steps && (next[i + 1] ?? "").length < L) inputs.current[i + 1]?.focus();
      }
    }
    if (nowSolved && !wasSolved) {
      setJustSolved(true);
      play("tick");
      setMessage(`Solved! You climbed from ${start} to ${end}.`);
      if (!progress.solved) {
        record({ type: "puzzle_solved", issue, puzzle: "word_ladder" });
        earnSticker(issue, stickerForPuzzle("word_ladder"));
      }
    }
  };

  const rails = useMemo(() => {
    const s = hashSeed(issue, "rails");
    const h = (data.steps + 2) * ROW * 10;
    return toPaths(
      gen.line(6, -4, 4, h + 4, opts({ roughness: 1, bowing: 2, strokeWidth: 1.8, seed: s })),
      gen.line(94, -4, 96, h + 4, opts({ roughness: 1, bowing: 2, strokeWidth: 1.8, seed: s + 1 })),
    );
  }, [issue, data.steps]);

  const rungs = data.steps + 2;
  const H = rungs * ROW * 10;
  const arrow: [number, number][] = [
    [14, H - ROW * 5],
    [24, H * 0.62],
    [26, H * 0.34],
    [14, ROW * 5.5],
  ];

  const slots = (word: string, active: boolean, seed: string) => (
    <span className="pl-slots" aria-hidden style={{ "--letters": L } as CSSProperties}>
      {Array.from({ length: L }, (_, k) => {
        const ch = word[k];
        return (
          <span key={k} className={`pl-slot ${active && k === word.length ? "is-caret" : ""}`}>
            {ch ? <PencilLetter char={ch} seed={hashSeed(seed, k, ch)} /> : null}
          </span>
        );
      })}
    </span>
  );

  // Top of the page is the end word, so the rungs are listed top-down.
  const order = Array.from({ length: data.steps }, (_, k) => data.steps - 1 - k);

  return (
    <PlayFrame kind="ladder" title={data.title} kicker={data.instructions} {...style}>
      {() => (
        <div
          className="pl-ladder"
          style={{ "--rungs": rungs, "--row": `${ROW}em` } as CSSProperties}
        >
          <svg
            className="pl-ladder-rails"
            viewBox={`0 0 100 ${H}`}
            preserveAspectRatio="none"
            aria-hidden
            focusable="false"
          >
            <RoughPaths paths={rails} stroke="var(--play-print)" />
          </svg>
          <ol className="pl-rungs">
            <li>
              <Strip seed={hashSeed(issue, "end")} printed>
                <span className="pl-printed-word">{end}</span>
                <span className="pl-sr">Finish word: {end}</span>
              </Strip>
            </li>
            {order.map((i) => {
              const v = verdicts[i]!;
              const word = steps[i]!;
              const id = `${uid}-rung-${i}`;
              return (
                <li key={i}>
                  <Strip
                    seed={hashSeed(issue, "rung", i)}
                    wobbling={wobble?.rung === i ? wobble.id : undefined}
                    overlay={
                      <>
                        <label className="pl-sr" htmlFor={id}>
                          Step {i + 1} of {data.steps}, a {L}-letter word one letter from the word
                          below
                        </label>
                        <input
                          id={id}
                          ref={(el) => {
                            inputs.current[i] = el;
                          }}
                          className="pl-strip-input"
                          value={word}
                          maxLength={L}
                          onChange={(e) => change(i, e.target.value)}
                          onFocus={(e) => {
                            setFocus(i);
                            const n = e.target.value.length;
                            e.target.setSelectionRange(n, n);
                          }}
                          onBlur={() => setFocus(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "ArrowUp") {
                              e.preventDefault();
                              inputs.current[i + 1]?.focus();
                            } else if (e.key === "ArrowDown") {
                              e.preventDefault();
                              inputs.current[i - 1]?.focus();
                            }
                          }}
                          aria-invalid={v === "bad" ? true : undefined}
                          autoCapitalize="characters"
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          enterKeyHint="next"
                        />
                      </>
                    }
                  >
                    {slots(word, focus === i, `${issue}-${i}`)}

                    <span className="pl-verdict" aria-hidden>
                      {v === "bad" ? (
                        <Pencil
                          key={`q${wobble?.id ?? 0}`}
                          seed={`${issue}-q-${i}`}
                          className="pl-query"
                        >
                          ?
                        </Pencil>
                      ) : v === "unknown" ? (
                        <Pencil seed={`${issue}-w-${i}`} className="pl-query-soft">
                          a word?
                        </Pencil>
                      ) : null}
                    </span>
                  </Strip>
                </li>
              );
            })}
            <li>
              <Strip seed={hashSeed(issue, "start")} printed>
                <span className="pl-printed-word">{start}</span>
                <span className="pl-sr">Start word: {start}</span>
              </Strip>
            </li>
          </ol>
          {solved ? (
            <>
              <Arrow
                seed={issue}
                points={arrow}
                viewBox={`0 0 40 ${H}`}
                head={8}
                draw={justSolved}
                className="pl-ladder-arrow"
              />
              <div className="pl-done pl-ladder-done">
                <Tick seed={`${issue}-ladder`} draw={justSolved} delay={0.8} className="pl-tick" />
              </div>
            </>
          ) : null}
          <Announcer message={message} />
        </div>
      )}
    </PlayFrame>
  );
}
