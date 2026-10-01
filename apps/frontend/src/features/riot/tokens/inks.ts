import type { EditionDesign } from "@repo/shared";
import { pastels } from "@repo/ui/print/colourways/pastels";
import { contrast, type Palette, paletteFor } from "./palette";

// The riot kit's colour: a two-drum risograph. Plate A and plate B are two of the day's inks,
// pushed towards fluoro (more chroma, same hue), and where they cross they overprint (multiply)
// into a third colour. Black is for words; the paper shows through everywhere else.
//
// Pure and server-safe (no hooks, no browser APIs): compute it once per request and pass it down.

export type RiotInks = {
  slug: string;
  name: string;
  family: Palette["family"];
  /** The stock: newsprint, bright copy paper or a pastel day's warm white. */
  paper: string;
  /** The black drum. Every word that is read. */
  k: string;
  /** Plate A, the big flat ink. */
  a: string;
  /** Plate B, used sparingly, mostly where it overprints A. */
  b: string;
  /** A × B, the third colour the overprint makes. */
  over: string;
  /** Black or paper, whichever passes AA on that ground. */
  aOn: string;
  bOn: string;
  overOn: string;
  /** CSS custom properties for all of the above (`--rt-a`, `--rt-a-on`, …). */
  vars: Record<`--rt-${string}`, string>;
};

const K = "#111111";

/** "house" (and anything unknown) means the design's own default colourway. */
function slugFor(design: EditionDesign, colourway: string): string {
  if (colourway !== "house") return colourway;
  return design === "broadsheet" ? "original" : pastels[0]!.slug;
}

// ——— colour maths (sRGB ⇄ OKLab), enough for a chroma push ———

type V3 = [number, number, number];

const toLin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGam = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function hexToRgb(hex: string): V3 {
  return [0, 1, 2].map((i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255) as V3;
}
function rgbToHex([r, g, b]: V3): string {
  return `#${[r, g, b]
    .map((v) =>
      Math.round(Math.min(1, Math.max(0, v)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function toOklab(hex: string): V3 {
  const [r, g, b] = hexToRgb(hex).map(toLin) as V3;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, A, B]: V3): string {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return rgbToHex(
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(toGam) as V3,
  );
}

const hueOf = (hex: string) => {
  const [, a, b] = toOklab(hex);
  return Math.atan2(b, a);
};

/** Fluoro: the same hue with more chroma, lightness held in a band black type reads on. */
function fluoro(hex: string, boost: number): string {
  const [L, A, B] = toOklab(hex);
  const l = Math.min(0.9, Math.max(0.66, L));
  return fromOklab([l, A * boost, B * boost]);
}

function mix(a: string, b: string, t: number): string {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex(x.map((v, i) => v * (1 - t) + y[i]! * t) as V3);
}

/** Lets a plate down with paper until black type on it passes AA (4.5:1). */
function readable(c: string, paper: string): string {
  let out = c;
  for (let t = 0.08; contrast(out, K) < 4.5 && t <= 1; t += 0.08) out = mix(c, paper, t);
  return out;
}

/** Two inks printed over each other: subtractive, so multiply. */
const multiply = (a: string, b: string) => {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex(x.map((v, i) => v * y[i]!) as V3);
};

const on = (bg: string, paper: string) => (contrast(bg, K) >= contrast(bg, paper) ? K : paper);

/**
 * The day's two plates. Plate A is the colourway's lead ink; plate B is whichever of the next
 * three sits furthest round the hue wheel from it, so the overprint makes a real third colour
 * instead of a darker A.
 */
export function riotInks({
  design = "broadsheet",
  colourway,
}: {
  design?: EditionDesign;
  colourway: string;
}): RiotInks {
  const p = paletteFor(slugFor(design, colourway));
  const lead = p.loud[0]!;
  const h = hueOf(lead);
  const gap = (c: string) => {
    const d = Math.abs(hueOf(c) - h);
    return Math.min(d, Math.PI * 2 - d);
  };
  const partner = p.loud.slice(1, 4).reduce((best, c) => (gap(c) > gap(best) ? c : best));
  const a = readable(fluoro(lead, 1.5), p.paper);
  const b = readable(fluoro(partner, 1.45), p.paper);
  const over = multiply(a, b);
  const t = {
    slug: p.slug,
    name: p.name,
    family: p.family,
    paper: p.paper,
    k: K,
    a,
    b,
    over,
    aOn: on(a, p.paper),
    bOn: on(b, p.paper),
    overOn: on(over, p.paper),
  };
  return {
    ...t,
    vars: {
      "--rt-paper": t.paper,
      "--rt-k": t.k,
      "--rt-a": t.a,
      "--rt-b": t.b,
      "--rt-over": t.over,
      "--rt-a-on": t.aOn,
      "--rt-b-on": t.bOn,
      "--rt-over-on": t.overOn,
    },
  };
}
