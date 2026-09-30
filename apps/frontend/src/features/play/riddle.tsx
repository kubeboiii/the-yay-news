"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { earnSticker, record, usePuzzleProgress } from "@/features/habits/api";
import { stickerForPuzzle } from "@/features/habits/catalogue";
import { play } from "@/features/sound";
import { PlayFrame } from "./frame";
import { Announcer, Pencil } from "./pencil";
import { Star, Tick } from "./rough";
import type { PlayStyleProps, RiddleData, RiddleSolution } from "./types";

// The riddle, printed as in the paper, with a line to pencil a guess on. Today's answer isn't
// served until tomorrow, so the bottom corner of the box folds down (drag it, or tap it) to show
// yesterday's answer printed upside down on the back of the paper.

type Progress = { guess: string; folded?: boolean; peeked?: boolean; solved?: boolean };

export type YesterdaysRiddle = { issue: number; question: string; answer: string };

export type RiddleProps = {
  issue: number;
  data: RiddleData;
  /** When given (a preview, or yesterday's riddle), the reader's guess is checked against it. */
  solution?: RiddleSolution;
  /** Yesterday's riddle and its answer, printed on the back of the folding corner. */
  yesterday?: YesterdaysRiddle | null;
} & PlayStyleProps;

const REST = 30; // px: the dog-ear the corner rests at

const core = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\b(a|an|the|some)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function Riddle({ issue, data, solution, yesterday, ...style }: RiddleProps) {
  const [progress, setProgress] = usePuzzleProgress<Progress>(`${issue}:riddle`, { guess: "" });
  const [drag, setDrag] = useState<number | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [message, setMessage] = useState("");
  const [justSolved, setJustSolved] = useState(false);
  const page = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  // A drag ends with a click event too; this swallows it so the drag's own result stands.
  const skip = useRef(false);
  const guessId = useId();

  useEffect(() => {
    const el = page.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      if (e) setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const max = size ? Math.min(size.w, size.h) * 0.96 : 220;
  const openAt = size ? Math.min(size.w, size.h) * 0.9 : 200;
  const folded = !!progress.folded;
  const fold = drag ?? (folded ? openAt : REST);

  const setFolded = (next: boolean) => {
    if (next === folded) return;
    play("fold");
    const peek = next && !!yesterday && !progress.peeked;
    setProgress({ ...progress, folded: next, peeked: progress.peeked || peek || undefined });
    if (peek) record({ type: "puzzle_peeked", issue: yesterday.issue, puzzle: "riddle" });
    setMessage(
      next
        ? yesterday
          ? `Corner folded down. Yesterday's riddle: ${yesterday.question} Answer: ${yesterday.answer}.`
          : "Corner folded down. Nothing printed under here yet: today's answer is in tomorrow's paper."
        : "Corner folded back up.",
    );
  };

  const foldFor = (ev: PointerEvent) => {
    const r = page.current?.getBoundingClientRect();
    if (!r) return REST;
    const s = (r.right - ev.clientX + (r.bottom - ev.clientY)) / 2;
    return Math.max(REST, Math.min(max, s));
  };

  const onDown = (ev: PointerEvent<HTMLButtonElement>) => {
    if (ev.button !== 0) return;
    ev.currentTarget.setPointerCapture(ev.pointerId);
    gesture.current = { x: ev.clientX, y: ev.clientY, moved: false };
  };
  const onMove = (ev: PointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    if (!g) return;
    if (!g.moved && Math.hypot(ev.clientX - g.x, ev.clientY - g.y) < 6) return;
    g.moved = true;
    setDrag(foldFor(ev));
  };
  const onUp = (ev: PointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g?.moved) return;
    const s = foldFor(ev);
    setDrag(null);
    setFolded(s > openAt * 0.4);
    skip.current = true;
  };

  const onGuess = (guess: string) => {
    const right = !!solution && core(guess) !== "" && core(guess) === core(solution.answer);
    const nowSolved = right && !progress.solved;
    setProgress({ ...progress, guess, solved: progress.solved || right || undefined });
    if (nowSolved) {
      setJustSolved(true);
      play("tick");
      setMessage(`That's it: ${solution.answer}.`);
      record({ type: "puzzle_solved", issue, puzzle: "riddle" });
      earnSticker(issue, stickerForPuzzle("riddle"));
    }
  };
  const right =
    !!solution && core(progress.guess) !== "" && core(progress.guess) === core(solution.answer);

  return (
    <PlayFrame kind="riddle" title={data.title} {...style}>
      {() => (
        <div
          ref={page}
          className={`pl-riddle-page ${drag !== null ? "is-dragging" : ""}`}
          style={{ "--fold": `${fold}px`, "--fold-open": `${openAt}px` } as CSSProperties}
        >
          <div className="pl-riddle-under" aria-hidden />
          <div className="pl-riddle-face">
            <p className="pl-riddle-q">{data.question}</p>
            <div className="pl-guess">
              <label htmlFor={guessId} className="pl-guess-label">
                Your guess
              </label>
              <input
                id={guessId}
                className="pl-guess-input"
                value={progress.guess}
                onChange={(e) => onGuess(e.target.value)}
                maxLength={60}
                autoComplete="off"
                enterKeyHint="done"
              />
              {right ? (
                <span className="pl-done pl-riddle-done">
                  <Tick seed={`${issue}-riddle`} draw={justSolved} className="pl-tick" />
                  <Star
                    seed={`${issue}-riddle`}
                    draw={justSolved}
                    delay={0.4}
                    className="pl-star"
                  />
                </span>
              ) : null}
            </div>
            <p className="pl-riddle-note">
              {solution
                ? "Pencil your guess: it earns a tick when it’s right."
                : "The answer’s printed upside down in tomorrow’s paper."}
            </p>
            <p className="pl-riddle-hint" aria-hidden>
              Fold the corner for yesterday&rsquo;s &#8600;
            </p>
          </div>
          <div className="pl-flap-shadow" aria-hidden>
            <div className="pl-flap">
              <div className="pl-flap-print">
                {yesterday ? (
                  <>
                    <p className="pl-flap-kicker">Yesterday · No. {yesterday.issue}</p>
                    <p className="pl-flap-q">{yesterday.question}</p>
                    <p className="pl-flap-a">{yesterday.answer}</p>
                  </>
                ) : (
                  <Pencil seed={`${issue}-nothing`} className="pl-flap-none">
                    Nothing under here yet. Come back tomorrow!
                  </Pencil>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="pl-corner"
            aria-expanded={folded}
            aria-label={
              folded
                ? "Fold the corner back up"
                : yesterday
                  ? "Fold the corner down to see yesterday's riddle answer"
                  : "Fold the corner down"
            }
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={() => {
              gesture.current = null;
              setDrag(null);
            }}
            onClick={() => {
              if (skip.current) {
                skip.current = false;
                return;
              }
              setFolded(!folded);
            }}
          />
          <Announcer message={message} />
        </div>
      )}
    </PlayFrame>
  );
}
