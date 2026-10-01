import type { CSSProperties } from "react";
import { r1, rand } from "../tokens/seed";
import "../riot.css";

// Ransom-note lettering, for the one or two biggest headings on a screen and nowhere else.
//
// A real ransom note is cut from three or four sources, a syllable at a time: a couple of
// letters from one headline, one from a magazine cover, a fat one from a poster. The cuts are
// different sizes, sit on different baselines, touch and overlap, and almost all of them are plain
// black on the paper they came from. One, maybe two, are loud: reversed out of black, on the day's
// ink, or torn from a photo.
//
// Pass `cuts` to compose a heading by hand (best), or let it compose one from the seed. Either
// way the heading reads as one string to assistive tech; the cuts are presentation.

export type CutSource = "slab" | "didone" | "roman" | "gothic" | "grot" | "type";
export type CutGround = "paper" | "none" | "ink" | "a" | "b" | "photo";

export type Cut = {
  /** One or more letters cut out together. */
  ch: string;
  from?: CutSource;
  /** Size relative to the heading, ~0.8–1.3. */
  size?: number;
  /** Baseline shift in em; positive lifts. */
  lift?: number;
  /** Rotation in degrees; keep it small. */
  turn?: number;
  /** "paper" is a plain scrap (the default), "none" is the letter alone. */
  ground?: CutGround;
  /** How far it slides under the previous cut, in em. */
  tuck?: number;
};

/** A word break. */
export const GAP = " " as const;

const SOURCES: CutSource[] = ["slab", "gothic", "didone", "grot", "roman", "type"];

/** Composes cuts for `text`: chunks of 1–3 letters, 3–4 sources, one or two accents. */
export function composeCuts(text: string, seed: string, photo = false): (Cut | typeof GAP)[] {
  const r = rand(`ransom2:${seed}`);
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)]!;
  // Three or four sources for the whole heading, like the few magazines on the table.
  const deck = [...SOURCES];
  for (let k = deck.length - 1; k > 0; k--) {
    const j = Math.floor(r() * (k + 1));
    [deck[k], deck[j]] = [deck[j]!, deck[k]!];
  }
  const pool = deck.slice(0, 3 + Math.round(r()));
  const out: (Cut | typeof GAP)[] = [];
  let last: CutSource | null = null;
  for (const [w, word] of text.split(" ").entries()) {
    if (w) out.push(GAP);
    let i = 0;
    while (i < word.length) {
      const len = Math.min(word.length - i, r() < 0.45 ? 1 : r() < 0.7 ? 2 : 3);
      let from = pick(pool);
      if (from === last) from = pool[(pool.indexOf(from) + 1) % pool.length]!;
      last = from;
      out.push({
        ch: word.slice(i, i + len),
        from,
        size: r1(0.84 + r() * 0.36, 2),
        lift: r1((r() - 0.5) * 0.14, 2),
        turn: r1((r() - 0.5) * 5),
        tuck: i ? r1(0.02 + r() * 0.08, 2) : 0,
      });
      i += len;
    }
  }
  // One or two accents, never on neighbours.
  const cuts = out.flatMap((c, k) => (c === GAP ? [] : [k]));
  const first = cuts[Math.floor(r() * cuts.length)]!;
  (out[first] as Cut).ground = photo ? "photo" : r() < 0.5 ? "ink" : "a";
  if (cuts.length > 5) {
    const far = cuts.filter((k) => Math.abs(k - first) > 2);
    const second = far[Math.floor(r() * far.length)];
    if (second !== undefined) (out[second] as Cut).ground = photo ? "ink" : "b";
  }
  return out;
}

/** A cut's outline: four corners each nicked a little, like scissors on newsprint. */
function snip(r: () => number): string {
  const n = () => r1(r() * 7);
  return `polygon(${n()}% ${n()}%, ${100 - n()}% ${n()}%, ${100 - n()}% ${100 - n()}%, ${n()}% ${100 - n()}%)`;
}

export function RansomHeading({
  text,
  seed,
  cuts,
  photo,
  as: Tag = "h1",
  className,
  style,
}: {
  /** What it says (read out, and the source for auto-composed cuts). */
  text: string;
  seed: string;
  /** Hand-composed cuts; when absent they're composed from `seed`. */
  cuts?: readonly (Cut | typeof GAP)[];
  /** An image a `photo` cut is torn from. */
  photo?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  style?: CSSProperties;
}) {
  const list = cuts ?? composeCuts(text, seed, Boolean(photo));
  const r = rand(`ransom-snip:${seed}`);
  const words: Cut[][] = [[]];
  for (const c of list) {
    if (c === GAP) words.push([]);
    else words.at(-1)!.push(c);
  }
  return (
    <Tag
      className={`rt-ransom ${className ?? ""}`}
      style={photo ? ({ ...style, "--rt-photo": `url("${photo}")` } as CSSProperties) : style}
    >
      <span className="rt-sr">{text}</span>
      {words.map((word, w) => (
        <span key={w} className="rt-ransom__word" aria-hidden>
          {word.map((c, i) => {
            const ground = c.ground ?? "paper";
            return (
              <span
                key={i}
                className={`rt-cutl rt-cutl--${c.from ?? "slab"} rt-cutl--on-${ground}`}
                style={{
                  fontSize: `${c.size ?? 1}em`,
                  translate: `0 ${-(c.lift ?? 0)}em`,
                  rotate: c.turn ? `${c.turn}deg` : undefined,
                  marginInlineStart: c.tuck ? `${-c.tuck}em` : undefined,
                  clipPath: ground === "none" ? undefined : snip(r),
                  zIndex: ground === "paper" || ground === "none" ? undefined : 1,
                }}
              >
                {c.ch}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
