"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { earnSticker, record } from "@/features/habits/api";
import { stickerForPuzzle } from "@/features/habits/catalogue";
import { play } from "@/features/sound";
import { PlayFrame } from "./frame";
import { hashSeed } from "./paper-style";
import { Announcer, Pencil } from "./pencil";
import { opts, roughGen as gen, RoughPaths, toPaths } from "./rough";
import type { FortuneTellerData, PlayStyleProps } from "./types";

// A folded paper fortune teller (a cootie catcher), seen from above. Four outer flaps carry the
// colour words, coloured in with crayon. Pick a colour and it opens and shuts once per letter,
// alternately up-and-down and side-to-side; each opening shows four of the eight numbers inside.
// Pick a number and it counts that out; pick again and that flap lifts to show the fortune.

type Axis = "rows" | "cols"; // "rows": top and bottom pull apart; "cols": left and right do
type Stage = "colour" | "counting" | "number" | "flap" | "read";

/** The eight inside triangles, clockwise from just right of twelve o'clock (see numbers[]). */
const TRIANGLES: { pts: [number, number][]; axis: Axis }[] = [
  {
    pts: [
      [50, 50],
      [50, 0],
      [100, 0],
    ],
    axis: "cols",
  },
  {
    pts: [
      [50, 50],
      [100, 0],
      [100, 50],
    ],
    axis: "rows",
  },
  {
    pts: [
      [50, 50],
      [100, 50],
      [100, 100],
    ],
    axis: "rows",
  },
  {
    pts: [
      [50, 50],
      [100, 100],
      [50, 100],
    ],
    axis: "cols",
  },
  {
    pts: [
      [50, 50],
      [50, 100],
      [0, 100],
    ],
    axis: "cols",
  },
  {
    pts: [
      [50, 50],
      [0, 100],
      [0, 50],
    ],
    axis: "rows",
  },
  {
    pts: [
      [50, 50],
      [0, 50],
      [0, 0],
    ],
    axis: "rows",
  },
  {
    pts: [
      [50, 50],
      [0, 0],
      [50, 0],
    ],
    axis: "cols",
  },
];

const centroid = (pts: [number, number][]) => [
  pts.reduce((s, p) => s + p[0], 0) / 3,
  pts.reduce((s, p) => s + p[1], 0) / 3,
];

/** Crayon colours for every colour word the puzzle engine uses (and a few more). */
const CRAYON: Record<string, string> = {
  red: "#e0452f",
  tangerine: "#f2812a",
  blue: "#3673d9",
  teal: "#2a9d9c",
  lilac: "#b89ae0",
  coral: "#f07b62",
  mango: "#f5a623",
  lemon: "#f2de3a",
  lime: "#8cc63f",
  mint: "#6fd3a5",
  peach: "#f5a77e",
  plum: "#8e4585",
  rose: "#e8718d",
  gold: "#d9a52a",
  amber: "#f0a818",
  indigo: "#4b3f9e",
  violet: "#8a52c7",
  scarlet: "#e8331f",
  crimson: "#c21f3a",
  cherry: "#d2203f",
  ochre: "#c8872a",
  mustard: "#d6a91c",
  sage: "#9cae88",
  olive: "#7f8a2e",
  jade: "#2e9e6e",
  emerald: "#1f9a5a",
  cobalt: "#1f4fbf",
  navy: "#2b3f8c",
  aqua: "#3fc6d6",
  cyan: "#27b5e0",
  magenta: "#d6338f",
  fuchsia: "#e03cb4",
  pink: "#f06aa4",
  saffron: "#f4b31c",
  apricot: "#f5a86b",
  honey: "#e0a53a",
  caramel: "#b87333",
  cream: "#eadbb0",
  silver: "#a8adb3",
  copper: "#b8693a",
  lavender: "#b89ae0",
  pistachio: "#a6c875",
  turquoise: "#30c0b0",
  butter: "#f3dc74",
  orange: "#f28a2e",
  green: "#3e9e58",
  yellow: "#f2c928",
  purple: "#8a52c7",
  ruby: "#c0183d",
  sapphire: "#2a52be",
  sky: "#5bb3e8",
  brown: "#95623a",
  black: "#333333",
  grey: "#8a8a8a",
  gray: "#8a8a8a",
  white: "#d8d4c8",
};
const crayonFor = (word: string) => {
  const key = word.toLowerCase().replace(/[^a-z]/g, "");
  return CRAYON[key] ?? `hsl(${hashSeed("crayon", key) % 360} 65% 55%)`;
};

const QUADS = [
  { at: "tl", row: -1, col: -1 },
  { at: "tr", row: -1, col: 1 },
  { at: "br", row: 1, col: 1 },
  { at: "bl", row: 1, col: -1 },
] as const;

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

/** The chosen inside triangle, hinged on its outer edge, lifting up and over. */
function Flap({ tri }: { tri: (typeof TRIANGLES)[number] }) {
  const [, a, b] = tri.pts;
  const style = {
    clipPath: `polygon(${tri.pts.map((p) => `${p[0]}% ${p[1]}%`).join(", ")})`,
    transformOrigin: `${(a![0] + b![0]) / 2}% ${(a![1] + b![1]) / 2}%`,
    "--axis-x": b![0] - a![0],
    "--axis-y": b![1] - a![1],
  } as CSSProperties;
  return <div className="pl-teller-flap" style={style} aria-hidden />;
}

export type FortuneTellerProps = { issue: number; data: FortuneTellerData } & PlayStyleProps;

export function FortuneTeller({ issue, data, ...style }: FortuneTellerProps) {
  const [stage, setStage] = useState<Stage>("colour");
  const [open, setOpen] = useState<Axis | null>(null);
  const [count, setCount] = useState<{ n: number; of: number } | null>(null);
  const [lifted, setLifted] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const reduce = useReducedMotion();
  const timers = useRef<number[]>([]);
  const nextAxis = useRef<Axis>("rows");
  const numberButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const again = useRef<HTMLButtonElement>(null);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  /** Opens and shuts `times` times, alternating direction, then rests open. */
  const pump = (times: number, then: (axis: Axis) => void) => {
    setStage("counting");
    const axes: Axis[] = [];
    for (let k = 0; k < times; k++) {
      axes.push(nextAxis.current);
      nextAxis.current = nextAxis.current === "rows" ? "cols" : "rows";
    }
    const last = axes.at(-1) ?? "rows";
    if (reduce) {
      setOpen(last);
      setCount({ n: times, of: times });
      play("fold");
      then(last);
      return;
    }
    const beat = 520;
    setOpen(null);
    axes.forEach((axis, k) => {
      later(k * beat + 60, () => {
        setOpen(axis);
        setCount({ n: k + 1, of: times });
        play("fold");
      });
      if (k < times - 1) later(k * beat + beat * 0.62, () => setOpen(null));
    });
    later((times - 1) * beat + 420, () => then(last));
  };

  const firstVisible = (axis: Axis) => TRIANGLES.findIndex((t) => t.axis === axis);

  const chooseColour = (i: number) => {
    const word = data.colours[i]!;
    const letters = word.replace(/[^a-z]/gi, "").length || 1;
    setMessage(`${word}: ${[...word.toUpperCase().replace(/[^A-Z]/g, "")].join(", ")}.`);
    pump(letters, (axis) => {
      setStage("number");
      const nums = TRIANGLES.map((t, k) => (t.axis === axis ? data.numbers[k] : null)).filter(
        (x) => x !== null,
      );
      setMessage(`Open. Pick a number: ${nums.join(", ")}.`);
      later(30, () => numberButtons.current[firstVisible(axis)]?.focus());
    });
  };

  const chooseNumber = (k: number) => {
    if (stage === "number") {
      const n = data.numbers[k]!;
      setMessage(`${n}. Counting it out.`);
      pump(n, (axis) => {
        setStage("flap");
        const nums = TRIANGLES.map((t, j) => (t.axis === axis ? data.numbers[j] : null)).filter(
          (x) => x !== null,
        );
        setMessage(`Now pick a flap to lift: ${nums.join(", ")}.`);
        later(30, () => numberButtons.current[firstVisible(axis)]?.focus());
      });
    } else if (stage === "flap") {
      setLifted(k);
      setStage("read");
      play("fold");
      const fortune = data.fortunes[k]!;
      setMessage(`Under flap ${data.numbers[k]}: ${fortune}`);
      record({ type: "fortune_read", issue, fortune });
      earnSticker(issue, stickerForPuzzle("fortune_teller"));
      later(reduce ? 0 : 700, () => again.current?.focus({ preventScroll: true }));
    }
  };

  const reset = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    nextAxis.current = "rows";
    setOpen(null);
    setLifted(null);
    setCount(null);
    setStage("colour");
    play("fold");
    setMessage("Folded up again. Pick a colour.");
  };

  const crayon = useMemo(
    () =>
      data.colours.map((c, i) =>
        toPaths(
          gen.rectangle(
            6,
            6,
            88,
            88,
            opts({
              stroke: "none",
              fill: "x",
              fillStyle: "hachure",
              hachureGap: 5.5,
              hachureAngle: [-35, 55, -60, 30][i]!,
              fillWeight: 3.2,
              roughness: 2.2,
              seed: hashSeed(issue, "crayon", c, i),
            }),
          ),
        ),
      ),
    [data.colours, issue],
  );

  const creases = useMemo(
    () =>
      toPaths(
        gen.line(
          0,
          0,
          100,
          100,
          opts({ roughness: 0.4, strokeWidth: 0.8, seed: hashSeed(issue, "c1") }),
        ),
        gen.line(
          100,
          0,
          0,
          100,
          opts({ roughness: 0.4, strokeWidth: 0.8, seed: hashSeed(issue, "c2") }),
        ),
        gen.line(
          50,
          0,
          50,
          100,
          opts({ roughness: 0.4, strokeWidth: 0.8, seed: hashSeed(issue, "c3") }),
        ),
        gen.line(
          0,
          50,
          100,
          50,
          opts({ roughness: 0.4, strokeWidth: 0.8, seed: hashSeed(issue, "c4") }),
        ),
      ),
    [issue],
  );

  const numbersLive = stage === "number" || stage === "flap";
  const help =
    stage === "colour"
      ? "Pick a colour"
      : stage === "counting"
        ? count
          ? `${count.n}…`
          : "…"
        : stage === "number"
          ? "Pick a number"
          : stage === "flap"
            ? "Now lift a flap"
            : "Your fortune";

  return (
    <PlayFrame kind="teller" title={data.title} {...style}>
      {() => (
        <div className="pl-teller">
          <p className="pl-teller-help" aria-hidden>
            <Pencil key={help} seed={`${issue}-${help}`}>
              {help}
            </Pencil>
          </p>
          <div
            className={`pl-teller-stage ${open ? `is-open-${open}` : "is-shut"} ${lifted !== null ? "is-lifted" : ""}`}
            data-stage={stage}
          >
            <div className="pl-teller-body">
              <div className="pl-teller-inside">
                <svg viewBox="0 0 100 100" className="pl-teller-tris" aria-hidden focusable="false">
                  {TRIANGLES.map((t, k) => (
                    <polygon
                      key={k}
                      points={t.pts.map((p) => p.join(",")).join(" ")}
                      className={`pl-tri ${t.axis === open ? "is-lit" : ""}`}
                    />
                  ))}
                  <RoughPaths paths={creases} stroke="var(--play-print)" />
                </svg>
                {TRIANGLES.map((t, k) => {
                  const [x, y] = centroid(t.pts);
                  const visible = numbersLive && t.axis === open;
                  return (
                    <button
                      key={k}
                      type="button"
                      ref={(el) => {
                        numberButtons.current[k] = el;
                      }}
                      className={`pl-teller-num ${lifted === k ? "is-chosen" : ""}`}
                      data-axis={t.axis}
                      style={{ left: `${x}%`, top: `${y}%` } as CSSProperties}
                      tabIndex={visible ? 0 : -1}
                      aria-hidden={visible ? undefined : true}
                      disabled={!visible}
                      onClick={() => chooseNumber(k)}
                      aria-label={
                        stage === "flap"
                          ? `Lift flap ${data.numbers[k]}`
                          : `Number ${data.numbers[k]}`
                      }
                    >
                      {data.numbers[k]}
                    </button>
                  );
                })}
                {lifted !== null ? <Flap tri={TRIANGLES[lifted]!} /> : null}
              </div>
              {QUADS.map((q, i) => (
                <div
                  key={q.at}
                  className={`pl-quad pl-quad-${q.at}`}
                  style={{ "--qr": q.row, "--qc": q.col } as CSSProperties}
                >
                  <button
                    type="button"
                    className="pl-quad-face"
                    disabled={stage !== "colour"}
                    onClick={() => chooseColour(i)}
                    aria-label={`${data.colours[i]}`}
                  >
                    <svg viewBox="0 0 100 100" className="pl-crayon" aria-hidden focusable="false">
                      <RoughPaths
                        paths={crayon[i]!}
                        stroke={crayonFor(data.colours[i]!)}
                        scaleStroke
                      />
                    </svg>
                    <span className="pl-quad-crease" aria-hidden />
                    <span className="pl-quad-word">{data.colours[i]}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="pl-teller-fortune" aria-hidden={stage !== "read"}>
            {stage === "read" && lifted !== null ? (
              <>
                <p className="pl-teller-under">Under flap {data.numbers[lifted]}:</p>
                <Pencil as="p" seed={`${issue}-f-${lifted}`} className="pl-teller-says">
                  {data.fortunes[lifted]!}
                </Pencil>
                <button ref={again} type="button" className="pl-again" onClick={reset}>
                  <Pencil seed={`${issue}-again`}>fold it up again</Pencil>
                </button>
              </>
            ) : (
              <p className="pl-teller-wait">Your fortune gets written here.</p>
            )}
          </div>
          <Announcer message={message} />
        </div>
      )}
    </PlayFrame>
  );
}
