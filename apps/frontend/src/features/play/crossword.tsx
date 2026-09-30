"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useId, useMemo, useRef, useState } from "react";
import { earnSticker, record, usePuzzleProgress } from "@/features/habits/api";
import { stickerForPuzzle } from "@/features/habits/catalogue";
import { play } from "@/features/sound";
import { PlayFrame } from "./frame";
import { hashSeed } from "./paper-style";
import { Announcer, Pencil, PencilLetter } from "./pencil";
import { roughGen as gen, opts, RoughPaths, Star, Tick, toPaths, Underline } from "./rough";
import type { CrosswordData, CrosswordSolution, PlayStyleProps } from "./types";

// The mini crossword, filled in with a pencil. The grid is hand-ruled (Rough.js) with the black
// squares shaded in; letters go in in handwriting, each at its own slight angle; rubbing one out
// leaves an eraser smudge. Today's answers aren't served, so "done" means every square is filled —
// unless a `solution` is passed (yesterday's puzzle, previews), and then the letters are checked.

type Dir = "across" | "down";
type Entry = { n: number; dir: Dir; clue: string; cells: number[] };
type Progress = { letters: string; solved?: boolean };
type Smudge = { cell: number; char: string; id: number };

const U = 40; // one square in SVG units

function layout(data: CrosswordData) {
  const rows = data.rows.length;
  const cols = Math.max(...data.rows.map((r) => r.length), 1);
  const block = Array.from({ length: rows * cols }, (_, i) => {
    const ch = data.rows[Math.floor(i / cols)]?.[i % cols];
    return ch === undefined || ch === "#";
  });
  const at = new Map(data.numbers.map((x) => [x.n, x.row * cols + x.col]));
  const numberAt = new Map(data.numbers.map((x) => [x.row * cols + x.col, x.n]));
  const run = (start: number, dir: Dir) => {
    const cells: number[] = [];
    let r = Math.floor(start / cols);
    let c = start % cols;
    while (r < rows && c < cols && !block[r * cols + c]) {
      cells.push(r * cols + c);
      if (dir === "across") c++;
      else r++;
    }
    return cells;
  };
  const entries: Entry[] = [];
  for (const dir of ["across", "down"] as const) {
    for (const clue of data[dir]) {
      const start = at.get(clue.n);
      if (start === undefined) continue;
      const cells = run(start, dir).slice(0, clue.length || undefined);
      if (cells.length) entries.push({ n: clue.n, dir, clue: clue.clue, cells });
    }
  }
  const entryAt: { across?: number; down?: number }[] = Array.from(
    { length: rows * cols },
    () => ({}),
  );
  entries.forEach((e, k) => {
    for (const cell of e.cells) entryAt[cell]![e.dir] = k;
  });
  const open = block
    .map((b, i) => (!b && (entryAt[i]?.across ?? entryAt[i]?.down) !== undefined ? i : -1))
    .filter((i) => i >= 0);
  return { rows, cols, block, entries, entryAt, numberAt, open };
}

const blank = (n: number) => " ".repeat(n);

export type CrosswordProps = {
  issue: number;
  data: CrosswordData;
  /** When given, letters are checked against it; otherwise "done" is every square filled. */
  solution?: CrosswordSolution;
} & PlayStyleProps;

export function Crossword({ issue, data, solution, ...style }: CrosswordProps) {
  const g = useMemo(() => layout(data), [data]);
  const { rows, cols, block, entries, entryAt, numberAt, open } = g;
  const size = rows * cols;

  const [progress, setProgress] = usePuzzleProgress<Progress>(`${issue}:crossword`, {
    letters: blank(size),
  });
  const letters = progress.letters.length === size ? progress.letters : blank(size);

  const first = entries[0]?.cells[0] ?? 0;
  const [active, setActive] = useState<{ cell: number; dir: Dir }>({
    cell: first,
    dir: entries[0]?.dir ?? "across",
  });
  const [focused, setFocused] = useState(false);
  const [smudges, setSmudges] = useState<Smudge[]>([]);
  const [message, setMessage] = useState("");
  const [justDone, setJustDone] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const smudgeId = useRef(0);
  const wasFocused = useRef(false);
  const helpId = useId();

  const solutionAt = (i: number) => solution?.grid[Math.floor(i / cols)]?.[i % cols];
  const statusOf = (l: string) => {
    const filled = open.every((i) => l[i] !== " ");
    if (!filled) return "open" as const;
    if (!solution) return "full" as const;
    return open.every((i) => l[i] === solutionAt(i)?.toUpperCase())
      ? ("correct" as const)
      : ("wrong" as const);
  };
  const status = statusOf(letters);
  const wrongCount =
    solution && status === "wrong"
      ? open.filter((i) => letters[i] !== solutionAt(i)?.toUpperCase()).length
      : 0;

  const entryIndex =
    entryAt[active.cell]?.[active.dir] ??
    entryAt[active.cell]?.across ??
    entryAt[active.cell]?.down ??
    0;
  const entry = entries[entryIndex];

  const describe = (e: Entry | undefined) =>
    e
      ? `${e.n} ${e.dir === "across" ? "Across" : "Down"}: ${e.clue}, ${e.cells.length} letters`
      : "";

  const goto = (cell: number, dir: Dir) => {
    const has = entryAt[cell];
    if (!has) return;
    const d = has[dir] !== undefined ? dir : dir === "across" ? "down" : "across";
    const next = has[d];
    if (next !== undefined && next !== entryIndex) setMessage(describe(entries[next]));
    setActive({ cell, dir: d });
  };

  const write = (next: string) => {
    const was = statusOf(letters);
    const now = statusOf(next);
    const done = (now === "full" || now === "correct") && was !== now;
    setProgress({ letters: next, solved: progress.solved || done || undefined });
    if (done) {
      setJustDone(true);
      play("tick");
      setMessage(
        now === "correct"
          ? "Solved! Every square is right."
          : "All filled in. The answers are in tomorrow's paper.",
      );
      if (!progress.solved) {
        record({ type: "puzzle_solved", issue, puzzle: "crossword" });
        earnSticker(issue, stickerForPuzzle("crossword"));
      }
    } else if (now === "wrong" && was !== "wrong") {
      setMessage("Every square is filled, but a few letters aren't right yet.");
    }
  };

  const put = (cell: number, ch: string) => letters.slice(0, cell) + ch + letters.slice(cell + 1);

  const typeLetter = (ch: string) => {
    if (!entry) return;
    play("pencil");
    write(put(active.cell, ch));
    const pos = entry.cells.indexOf(active.cell);
    const after = entry.cells[pos + 1];
    if (after !== undefined) setActive({ cell: after, dir: entry.dir });
  };

  const rubOut = (cell: number) => {
    const ch = letters[cell];
    if (!ch || ch === " ") return false;
    play("erase");
    const id = ++smudgeId.current;
    setSmudges((s) => [...s.filter((x) => x.cell !== cell).slice(-12), { cell, char: ch, id }]);
    write(put(cell, " "));
    return true;
  };

  const backspace = () => {
    if (!entry) return;
    if (rubOut(active.cell)) return;
    const pos = entry.cells.indexOf(active.cell);
    const before = entry.cells[pos - 1];
    if (before !== undefined) {
      setActive({ cell: before, dir: entry.dir });
      rubOut(before);
    }
  };

  const moveBy = (dr: number, dc: number) => {
    let r = Math.floor(active.cell / cols) + dr;
    let c = (active.cell % cols) + dc;
    const dir: Dir = dr === 0 ? "across" : "down";
    while (r >= 0 && r < rows && c >= 0 && c < cols) {
      const i = r * cols + c;
      if (!block[i] && entryAt[i]?.[dir] !== undefined) return goto(i, dir);
      if (!block[i] && (entryAt[i]?.across ?? entryAt[i]?.down) !== undefined) return goto(i, dir);
      r += dr;
      c += dc;
    }
    goto(active.cell, dir);
  };

  const gotoEntry = (k: number) => {
    const e = entries[(k + entries.length) % entries.length];
    if (!e) return;
    const empty = e.cells.find((i) => letters[i] === " ") ?? e.cells[0]!;
    setMessage(describe(e));
    setActive({ cell: empty, dir: e.dir });
  };

  const onKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.nativeEvent.isComposing || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const k = ev.key;
    const handled = () => ev.preventDefault();
    if (k === "ArrowLeft") return (handled(), moveBy(0, -1));
    if (k === "ArrowRight") return (handled(), moveBy(0, 1));
    if (k === "ArrowUp") return (handled(), moveBy(-1, 0));
    if (k === "ArrowDown") return (handled(), moveBy(1, 0));
    if (k === "Backspace") return (handled(), backspace());
    if (k === "Delete") return (handled(), rubOut(active.cell));
    if (k === " " || k === "Enter") {
      handled();
      return goto(active.cell, active.dir === "across" ? "down" : "across");
    }
    if (k === "Tab") {
      const next = entryIndex + (ev.shiftKey ? -1 : 1);
      if (next < 0 || next >= entries.length) return; // let focus leave the puzzle
      handled();
      return gotoEntry(next);
    }
    if (/^[a-z]$/i.test(k)) return (handled(), typeLetter(k.toUpperCase()));
  };

  // Phones: the native keyboard types into the hidden input. It always holds one invisible
  // character, so a backspace on an "empty" field still arrives as a change.
  const SENTINEL = "​";
  const onChange = (value: string) => {
    if (value.length < SENTINEL.length || !value.includes(SENTINEL)) {
      backspace();
      return;
    }
    const typed = value.replace(SENTINEL, "").replace(/[^a-z]/gi, "");
    if (typed) typeLetter(typed.slice(-1).toUpperCase());
  };

  const focusInput = () => input.current?.focus({ preventScroll: true });
  const onCell = (i: number) => {
    if (block[i]) return;
    if (focused && i === active.cell) goto(i, active.dir === "across" ? "down" : "across");
    else goto(i, active.dir);
    focusInput();
  };

  // ——— Drawing ———

  const lines = useMemo(() => {
    const s = hashSeed(issue, "xw-lines", rows, cols);
    const W = cols * U;
    const H = rows * U;
    const ruled = [] as ReturnType<typeof gen.line>[];
    for (let r = 1; r < rows; r++)
      ruled.push(
        gen.line(
          -1,
          r * U,
          W + 1,
          r * U,
          opts({ roughness: 0.55, bowing: 0.8, strokeWidth: 1.1, seed: s + r }),
        ),
      );
    for (let c = 1; c < cols; c++)
      ruled.push(
        gen.line(
          c * U,
          -1,
          c * U,
          H + 1,
          opts({ roughness: 0.55, bowing: 0.8, strokeWidth: 1.1, seed: s + 50 + c }),
        ),
      );
    ruled.push(
      gen.rectangle(
        0,
        0,
        W,
        H,
        opts({ roughness: 0.7, bowing: 0.6, strokeWidth: 2, seed: s + 99 }),
      ),
    );
    return toPaths(...ruled);
  }, [issue, rows, cols]);

  const shade = useMemo(() => {
    const s = hashSeed(issue, "xw-shade");
    return toPaths(
      ...block.flatMap((b, i) => {
        if (!b) return [];
        const x = (i % cols) * U;
        const y = Math.floor(i / cols) * U;
        return [
          gen.rectangle(
            x + 1.5,
            y + 1.5,
            U - 3,
            U - 3,
            opts({
              stroke: "none",
              fill: "x",
              fillStyle: "zigzag",
              hachureGap: 2.3,
              hachureAngle: -48 + ((s + i * 7) % 14),
              fillWeight: 1.2,
              roughness: 1.3,
              seed: s + i,
            }),
          ),
        ];
      }),
    );
  }, [issue, block, cols]);

  const band = useMemo(() => {
    if (!entry) return [];
    const a = entry.cells[0]!;
    const b = entry.cells.at(-1)!;
    const x = (a % cols) * U + 3;
    const y = Math.floor(a / cols) * U + 3;
    const w = (b % cols) * U + U - 3 - x;
    const h = Math.floor(b / cols) * U + U - 3 - y;
    return toPaths(
      gen.rectangle(
        x,
        y,
        w,
        h,
        opts({
          stroke: "none",
          fill: "x",
          fillStyle: "solid",
          roughness: 1.4,
          seed: hashSeed(issue, "band", entryIndex),
        }),
      ),
    );
  }, [entry, cols, issue, entryIndex]);

  const cellBox = useMemo(() => {
    const x = (active.cell % cols) * U;
    const y = Math.floor(active.cell / cols) * U;
    return toPaths(
      gen.rectangle(
        x + 4,
        y + 4,
        U - 8,
        U - 8,
        opts({ roughness: 1.1, strokeWidth: 1.6, seed: hashSeed(issue, "box", active.cell) }),
      ),
    );
  }, [active.cell, cols, issue]);

  const done = status === "full" || status === "correct";
  const note =
    status === "full"
      ? "All filled in — answers in tomorrow's paper."
      : status === "correct"
        ? "Every square right. Lovely."
        : status === "wrong"
          ? `Nearly! ${wrongCount} square${wrongCount === 1 ? "" : "s"} to rethink.`
          : "";

  const pos = entry ? entry.cells.indexOf(active.cell) + 1 : 0;
  const here = letters[active.cell]?.trim();
  const label = entry
    ? `Crossword, ${describe(entry)}. Square ${pos} of ${entry.cells.length}: ${here || "blank"}.`
    : "Crossword";
  const cellStyle = (i: number): CSSProperties => ({
    left: `${((i % cols) / cols) * 100}%`,
    top: `${(Math.floor(i / cols) / rows) * 100}%`,
    width: `${100 / cols}%`,
    height: `${100 / rows}%`,
  });

  return (
    <PlayFrame kind="crossword" title={data.title} {...style}>
      {() => (
        <div className={`pl-xw ${cols > 5 || rows > 5 ? "pl-xw--big" : ""}`}>
          <div className="pl-xw-board">
            <p className="pl-xw-current" aria-hidden>
              {entry ? (
                <>
                  <b>
                    {entry.n} {entry.dir === "across" ? "Across" : "Down"}
                  </b>{" "}
                  {entry.clue} <span className="pl-len">({entry.cells.length})</span>
                </>
              ) : null}
            </p>
            <div
              className="pl-xw-grid"
              style={
                {
                  "--cols": cols,
                  "--rows": rows,
                  aspectRatio: `${cols} / ${rows}`,
                } as CSSProperties
              }
            >
              <svg
                className="pl-layer pl-xw-shade"
                viewBox={`0 0 ${cols * U} ${rows * U}`}
                aria-hidden
                focusable="false"
              >
                <RoughPaths paths={shade} stroke="var(--play-ink)" />
              </svg>
              <svg
                className={`pl-layer pl-xw-band ${focused ? "is-on" : ""}`}
                viewBox={`0 0 ${cols * U} ${rows * U}`}
                aria-hidden
                focusable="false"
              >
                <RoughPaths paths={band} fill="var(--play-highlight)" />
              </svg>
              {open.map((i) => {
                const ch = letters[i]?.trim();
                const n = numberAt.get(i);
                const smudge = smudges.find((s) => s.cell === i);
                return (
                  <div
                    key={i}
                    className="pl-xw-cell"
                    style={cellStyle(i)}
                    onClick={() => onCell(i)}
                    aria-hidden
                  >
                    {n ? <span className="pl-xw-n">{n}</span> : null}
                    {smudge ? (
                      <span key={smudge.id} className="pl-smudge">
                        {smudge.char}
                      </span>
                    ) : null}
                    {ch ? (
                      <PencilLetter
                        char={ch}
                        seed={hashSeed(issue, i, ch)}
                        className="pl-xw-letter"
                      />
                    ) : null}
                  </div>
                );
              })}
              <svg
                className="pl-layer pl-xw-lines"
                viewBox={`0 0 ${cols * U} ${rows * U}`}
                aria-hidden
                focusable="false"
              >
                <RoughPaths paths={lines} stroke="var(--play-print)" />
                {focused ? <RoughPaths paths={cellBox} stroke="var(--play-ink)" /> : null}
              </svg>
              <input
                ref={input}
                className="pl-xw-input"
                style={cellStyle(active.cell)}
                value={SENTINEL}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={(e) => {
                  setFocused(true);
                  e.target.setSelectionRange(1, 1);
                }}
                onSelect={(e) => e.currentTarget.setSelectionRange(1, 1)}
                onBlur={() => setFocused(false)}
                onPointerDown={() => {
                  wasFocused.current = focused;
                }}
                onClick={() => {
                  if (wasFocused.current)
                    goto(active.cell, active.dir === "across" ? "down" : "across");
                }}
                aria-label={label}
                aria-describedby={helpId}
                autoCapitalize="characters"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                inputMode="text"
              />
              {done ? (
                <div className="pl-done pl-xw-done">
                  <Tick seed={issue} draw={justDone} className="pl-tick" />
                  <Star seed={issue} draw={justDone} delay={0.4} className="pl-star" />
                </div>
              ) : null}
            </div>
            <p className="pl-note" aria-hidden>
              {note ? <Pencil seed={`${issue}-${status}`}>{note}</Pencil> : " "}
            </p>
            <p id={helpId} className="pl-sr">
              Type a letter to pencil it in. Arrow keys move between squares, Tab goes to the next
              clue, and Space switches between across and down. Backspace rubs a letter out.
            </p>
          </div>
          <div className="pl-xw-clues">
            {(["across", "down"] as const).map((dir) => (
              <div key={dir} className="pl-xw-list">
                <p className="pl-xw-dir">{dir === "across" ? "Across" : "Down"}</p>
                <ol>
                  {entries.map((e, k) =>
                    e.dir === dir ? (
                      <li key={k}>
                        <button
                          type="button"
                          className="pl-clue"
                          aria-current={k === entryIndex ? "true" : undefined}
                          onClick={() => {
                            gotoEntry(k);
                            focusInput();
                          }}
                        >
                          <b>{e.n}</b> {e.clue} <span className="pl-len">({e.cells.length})</span>
                          {k === entryIndex ? (
                            <Underline
                              key={`u${k}`}
                              seed={`${issue}-${k}`}
                              draw
                              className="pl-clue-line"
                            />
                          ) : null}
                          {e.cells.every((i) => letters[i] !== " ") ? (
                            <span className="pl-sr"> (filled in)</span>
                          ) : null}
                        </button>
                      </li>
                    ) : null,
                  )}
                </ol>
              </div>
            ))}
          </div>
          <Announcer message={message} />
        </div>
      )}
    </PlayFrame>
  );
}

/** Yesterday's answers, printed: the grid with its solution letters set in type, read-only. */
export function CrosswordAnswers({
  data,
  solution,
  ...style
}: { data: CrosswordData; solution: CrosswordSolution } & PlayStyleProps) {
  const { rows, cols, block, numberAt, open } = useMemo(() => layout(data), [data]);
  const lines = useMemo(() => {
    const W = cols * U;
    const H = rows * U;
    const s = hashSeed("answers", rows, cols);
    const ruled = [] as ReturnType<typeof gen.line>[];
    for (let r = 1; r < rows; r++)
      ruled.push(
        gen.line(0, r * U, W, r * U, opts({ roughness: 0.3, strokeWidth: 1, seed: s + r })),
      );
    for (let c = 1; c < cols; c++)
      ruled.push(
        gen.line(c * U, 0, c * U, H, opts({ roughness: 0.3, strokeWidth: 1, seed: s + 50 + c })),
      );
    ruled.push(gen.rectangle(0, 0, W, H, opts({ roughness: 0.3, strokeWidth: 1.6, seed: s + 99 })));
    return toPaths(...ruled);
  }, [rows, cols]);
  const letter = (i: number) => solution.grid[Math.floor(i / cols)]?.[i % cols] ?? "";
  const words = [
    ...solution.across.map((a) => `${a.n} across ${a.answer}`),
    ...solution.down.map((a) => `${a.n} down ${a.answer}`),
  ].join(", ");
  return (
    <PlayFrame kind="answers" title={data.title} {...style}>
      {() => (
        <div
          className="pl-xw-grid pl-answers"
          role="img"
          aria-label={`Answers: ${words}`}
          style={
            { "--cols": cols, "--rows": rows, aspectRatio: `${cols} / ${rows}` } as CSSProperties
          }
        >
          <svg
            className="pl-layer"
            viewBox={`0 0 ${cols * U} ${rows * U}`}
            aria-hidden
            focusable="false"
          >
            {block.map((b, i) =>
              b ? (
                <rect
                  key={i}
                  x={(i % cols) * U}
                  y={Math.floor(i / cols) * U}
                  width={U}
                  height={U}
                  fill="var(--play-print)"
                />
              ) : null,
            )}
            <RoughPaths paths={lines} stroke="var(--play-print)" />
          </svg>
          {open.map((i) => (
            <div
              key={i}
              className="pl-xw-cell pl-answer-cell"
              style={{
                left: `${((i % cols) / cols) * 100}%`,
                top: `${(Math.floor(i / cols) / rows) * 100}%`,
                width: `${100 / cols}%`,
                height: `${100 / rows}%`,
              }}
            >
              {numberAt.get(i) ? <span className="pl-xw-n">{numberAt.get(i)}</span> : null}
              <span className="pl-answer-letter">{letter(i)}</span>
            </div>
          ))}
        </div>
      )}
    </PlayFrame>
  );
}
