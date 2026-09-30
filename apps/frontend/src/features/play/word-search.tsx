"use client";

import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useId, useMemo, useRef, useState } from "react";
import { earnSticker, record, usePuzzleProgress } from "@/features/habits/api";
import { stickerForPuzzle } from "@/features/habits/catalogue";
import { play } from "@/features/sound";
import { PlayFrame } from "./frame";
import { hashSeed } from "./paper-style";
import { Announcer } from "./pencil";
import { CrossOut, loop, RoughPaths, Star, Tick, toPaths } from "./rough";
import type { PlayStyleProps, WordSearchData, WordSearchSolution } from "./types";

// The word search, circled by hand. Drag across a line of letters and a marker loop follows the
// pen; let go on a listed word and the loop stays and the word is crossed off in pencil, otherwise
// the loop fades away. The grid and list are all it takes to check a find, so no answers needed.

type Cell = [number, number];
type Find = { word: string; a: Cell; b: Cell };
type Progress = { found: Find[]; solved?: boolean };

const U = 40;

export type WordSearchProps = {
  issue: number;
  data: WordSearchData;
  /** Not needed to play (finds are checked against the grid); accepted for symmetry. */
  solution?: WordSearchSolution;
} & PlayStyleProps;

/** Snaps a drag from `a` towards `to` onto the nearest of the eight straight directions. */
function snap(a: Cell, to: Cell, rows: number, cols: number): Cell {
  const dr = to[0] - a[0];
  const dc = to[1] - a[1];
  if (!dr && !dc) return a;
  const ang = Math.round(Math.atan2(dr, dc) / (Math.PI / 4)) * (Math.PI / 4);
  const sr = Math.round(Math.sin(ang));
  const sc = Math.round(Math.cos(ang));
  let len = Math.round(
    sr && sc ? (Math.abs(dr) + Math.abs(dc)) / 2 : Math.max(Math.abs(dr), Math.abs(dc)),
  );
  while (len > 0) {
    const r = a[0] + sr * len;
    const c = a[1] + sc * len;
    if (r >= 0 && r < rows && c >= 0 && c < cols) return [r, c];
    len--;
  }
  return a;
}

function lettersOn(grid: string[], a: Cell, b: Cell): string | null {
  const dr = Math.sign(b[0] - a[0]);
  const dc = Math.sign(b[1] - a[1]);
  const n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
  if (dr && dc && Math.abs(b[0] - a[0]) !== Math.abs(b[1] - a[1])) return null;
  let out = "";
  for (let k = 0; k <= n; k++) out += grid[a[0] + dr * k]?.[a[1] + dc * k] ?? "";
  return out.toUpperCase();
}

function loopFor(a: Cell, b: Cell, seed: number, width: number) {
  const ax = a[1] * U + U / 2;
  const ay = a[0] * U + U / 2;
  const bx = b[1] * U + U / 2;
  const by = b[0] * U + U / 2;
  const len = Math.hypot(bx - ax, by - ay);
  return toPaths(
    loop(
      (ax + bx) / 2,
      (ay + by) / 2,
      len / 2 + U * 0.5,
      U * 0.42,
      seed,
      width,
      Math.atan2(by - ay, bx - ax),
    ),
  );
}

export function WordSearch({ issue, data, solution: _solution, ...style }: WordSearchProps) {
  const grid = data.grid.map((r) => r.toUpperCase());
  const rows = grid.length;
  const cols = Math.max(...grid.map((r) => r.length), 1);
  const words = data.words.map((w) => w.toUpperCase());
  const [progress, setProgress] = usePuzzleProgress<Progress>(`${issue}:word_search`, {
    found: [],
  });
  const found = progress.found.filter((f) => words.includes(f.word));
  const [sel, setSel] = useState<{ a: Cell; b: Cell; keyboard?: boolean } | null>(null);
  const [fading, setFading] = useState<{ a: Cell; b: Cell; id: number }[]>([]);
  const [cursor, setCursor] = useState<Cell>([0, 0]);
  const [justFound, setJustFound] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const board = useRef<HTMLDivElement>(null);
  const fadeId = useRef(0);
  const helpId = useId();
  const solved = words.length > 0 && words.every((w) => found.some((f) => f.word === w));

  const cellAt = (ev: PointerEvent): Cell | null => {
    const r = board.current?.getBoundingClientRect();
    if (!r) return null;
    const c = Math.floor(((ev.clientX - r.left) / r.width) * cols);
    const rr = Math.floor(((ev.clientY - r.top) / r.height) * rows);
    return [Math.max(0, Math.min(rows - 1, rr)), Math.max(0, Math.min(cols - 1, c))];
  };

  const finish = (a: Cell, b: Cell) => {
    setSel(null);
    const got = lettersOn(grid, a, b);
    if (!got || got.length < 2) return;
    const rev = [...got].reverse().join("");
    const word = words.find((w) => (w === got || w === rev) && !found.some((f) => f.word === w));
    if (!word) {
      const id = ++fadeId.current;
      setFading((f) => [...f.slice(-4), { a, b, id }]);
      if (words.some((w) => w === got || w === rev)) setMessage(`${got}: already found.`);
      else setMessage(`${got} isn't on the list.`);
      return;
    }
    const next = [...found, { word, a, b }];
    const nowSolved = words.every((w) => next.some((f) => f.word === w));
    setProgress({ found: next, solved: progress.solved || nowSolved || undefined });
    setJustFound(word);
    play(nowSolved ? "tick" : "pencil");
    setMessage(
      nowSolved
        ? `Found ${word}. That's all ${words.length}: solved!`
        : `Found ${word}. ${next.length} of ${words.length} found.`,
    );
    if (nowSolved && !progress.solved) {
      record({ type: "puzzle_solved", issue, puzzle: "word_search" });
      earnSticker(issue, stickerForPuzzle("word_search"));
    }
  };

  const onDown = (ev: PointerEvent<HTMLDivElement>) => {
    if (ev.button !== 0) return;
    const c = cellAt(ev);
    if (!c) return;
    ev.currentTarget.setPointerCapture(ev.pointerId);
    setSel({ a: c, b: c });
    setCursor(c);
  };
  const onMove = (ev: PointerEvent<HTMLDivElement>) => {
    if (!sel || sel.keyboard) return;
    const c = cellAt(ev);
    if (!c) return;
    const b = snap(sel.a, c, rows, cols);
    if (b[0] !== sel.b[0] || b[1] !== sel.b[1]) setSel({ a: sel.a, b });
  };
  const onUp = () => {
    if (!sel || sel.keyboard) return;
    finish(sel.a, sel.b);
  };

  const onKey = (ev: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, Cell> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const m = moves[ev.key];
    if (m) {
      ev.preventDefault();
      const next: Cell = [
        Math.max(0, Math.min(rows - 1, cursor[0] + m[0])),
        Math.max(0, Math.min(cols - 1, cursor[1] + m[1])),
      ];
      setCursor(next);
      if (sel?.keyboard) setSel({ ...sel, b: snap(sel.a, next, rows, cols) });
      const letter = grid[next[0]]?.[next[1]] ?? "";
      setMessage(
        `${letter}, row ${next[0] + 1}, column ${next[1] + 1}${sel?.keyboard ? `. Circling ${lettersOn(grid, sel.a, snap(sel.a, next, rows, cols)) ?? ""}` : ""}`,
      );
    } else if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      if (sel?.keyboard) finish(sel.a, sel.b);
      else {
        setSel({ a: cursor, b: cursor, keyboard: true });
        setMessage(
          `Circling from ${grid[cursor[0]]?.[cursor[1]] ?? ""}. Move to the last letter and press Enter.`,
        );
      }
    } else if (ev.key === "Escape" && sel) {
      ev.preventDefault();
      setSel(null);
      setMessage("Stopped circling.");
    }
  };

  const liveLoop = useMemo(
    () => (sel ? loopFor(sel.a, sel.b, hashSeed(issue, "live", ...sel.a, ...sel.b), 3.6) : []),
    [sel, issue],
  );

  return (
    <PlayFrame kind="search" title={data.title} kicker={data.theme} {...style}>
      {() => (
        <div className="pl-ws">
          <div
            ref={board}
            className="pl-ws-grid"
            style={
              { "--cols": cols, "--rows": rows, aspectRatio: `${cols} / ${rows}` } as CSSProperties
            }
            tabIndex={0}
            role="application"
            aria-roledescription="word search"
            aria-label={`${data.title}: a ${cols} by ${rows} letter grid. ${found.length} of ${words.length} words found.`}
            aria-describedby={helpId}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={() => setSel(null)}
            onKeyDown={onKey}
          >
            {grid.map((row, r) => (
              <div key={r} className="pl-ws-row" aria-hidden>
                {[...row.padEnd(cols)].map((ch, c) => (
                  <span key={c} className="pl-ws-letter">
                    {ch}
                  </span>
                ))}
              </div>
            ))}
            <svg
              className="pl-layer pl-ws-loops"
              viewBox={`0 0 ${cols * U} ${rows * U}`}
              aria-hidden
              focusable="false"
            >
              {found.map((f) => (
                <g key={f.word} className={f.word === justFound ? "pl-ws-new" : undefined}>
                  <RoughPaths
                    paths={loopFor(f.a, f.b, hashSeed(issue, f.word), 4.2)}
                    stroke="var(--play-highlight)"
                    draw={f.word === justFound}
                    duration={0.45}
                  />
                </g>
              ))}
              {fading.map((f) => (
                <g
                  key={f.id}
                  className="pl-ws-fade"
                  onAnimationEnd={() => setFading((all) => all.filter((x) => x.id !== f.id))}
                >
                  <RoughPaths
                    paths={loopFor(f.a, f.b, hashSeed(issue, "miss", f.id), 3.6)}
                    stroke="var(--play-highlight)"
                  />
                </g>
              ))}
              {sel ? (
                <g className="pl-ws-live">
                  <RoughPaths paths={liveLoop} stroke="var(--play-highlight)" />
                </g>
              ) : null}
              <rect
                className="pl-ws-cursor"
                x={cursor[1] * U + 3}
                y={cursor[0] * U + 3}
                width={U - 6}
                height={U - 6}
                rx={6}
              />
            </svg>
            {solved ? (
              <div className="pl-done pl-ws-done">
                <Tick seed={`${issue}-ws`} draw={justFound !== null} className="pl-tick" />
                <Star
                  seed={`${issue}-ws`}
                  draw={justFound !== null}
                  delay={0.4}
                  className="pl-star"
                />
              </div>
            ) : null}
          </div>
          <p id={helpId} className="pl-sr">
            Drag across a word to circle it. With a keyboard, move with the arrow keys, press Enter
            on the first letter, move to the last letter and press Enter again. Escape stops
            circling.
          </p>
          <ul className="pl-ws-words" aria-label="Words to find">
            {words.map((w) => {
              const isFound = found.some((f) => f.word === w);
              return (
                <li key={w} className={isFound ? "is-found" : undefined}>
                  <span>{w}</span>
                  {isFound ? (
                    <>
                      <CrossOut
                        seed={`${issue}-${w}`}
                        draw={w === justFound}
                        className="pl-ws-strike"
                      />
                      <span className="pl-sr"> (found)</span>
                    </>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <Announcer message={message} />
        </div>
      )}
    </PlayFrame>
  );
}
