import { pastels } from "@repo/ui/print/colourways/pastels";
import { overprint, themes } from "@repo/ui/print/colourways/themes";

// The day's colourway, turned into what the website chrome needs. The paper's colourway is a
// printer's spec (paper stock, inks); the chrome reads it as: a ground to paint the room with,
// loud inks for stickers and blocks, and an ink to set every word in. Every loud ink is let down
// with paper until black type on it reaches AA. Pure and server-safe. The riot kit's two plates
// (inks.ts) are drawn from this; the older site mockups (site-a, site-c) read it directly.

export type Palette = {
  slug: string;
  name: string;
  family: "neon" | "pastel";
  /** The sheet the words print on. */
  paper: string;
  /** Every word. */
  ink: string;
  /** Loud inks, most important first (fluoro for neon days, the deep tones on pastel days). */
  loud: string[];
  /** Soft grounds, one per loud ink (pastel softs, or the neon ink let down with paper). */
  soft: string[];
  /** Where the first two inks overprint. */
  over: string;
};

const NEWSPRINT = "#efe8d8";
const BRIGHT = "#fbf8f0";

function mix(a: string, b: string, t: number): string {
  const ch = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2]
    .map((i) =>
      Math.round(ch(a, i) * (1 - t) + ch(b, i) * t)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/**
 * Every loud ink is a ground words print on, so one too dark for the ink colour (an electric blue,
 * a violet) is let down with paper until it reaches 4.5:1. The hue survives; the type stays AA.
 */
function readable(c: string, ink: string, paper: string): string {
  let out = c;
  for (let t = 0.1; contrast(out, ink) < 4.5 && t <= 1; t += 0.1) out = mix(c, paper, t);
  return out;
}

/** The colourway's palette; unknown slugs fall back to the broadsheet's Original Fluoro. */
export function paletteFor(slug: string): Palette {
  const pastel = pastels.find((p) => p.slug === slug);
  if (pastel) {
    const loud = pastel.inks.map((i) => readable(i.deep, pastel.ink, "#fbf6ec"));
    return {
      slug,
      name: pastel.name,
      family: "pastel",
      paper: "#fbf6ec",
      ink: pastel.ink,
      loud,
      soft: pastel.inks.map((i) => i.soft),
      over: overprint(loud[0]!, loud[2] ?? loud[1]!),
    };
  }
  const theme = themes.find((t) => t.slug === slug) ?? themes[0]!;
  const paper = theme.paper === "bright" ? BRIGHT : NEWSPRINT;
  const loud = theme.inks.map((i) => i.hex);
  while (loud.length < 6)
    loud.push(["#ff3d9a", "#e9ff1f", "#36f28a", "#2f5bff", "#ff6a1f", "#b14bff"][loud.length]!);
  for (let i = 0; i < loud.length; i++) loud[i] = readable(loud[i]!, "#1b1714", paper);
  return {
    slug: theme.slug,
    name: theme.name,
    family: "neon",
    paper,
    ink: "#1b1714",
    loud,
    soft: loud.map((c) => mix(c, paper, 0.62)),
    over: overprint(loud[0]!, loud[1]!),
  };
}

/** Relative luminance (WCAG). */
function lum(hex: string): number {
  const c = [0, 1, 2].map((i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255);
  const l = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0]! + 0.7152 * l[1]! + 0.0722 * l[2]!;
}

export function contrast(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

/** Whichever of the palette's ink or paper reads better on `bg`. */
export const textOn = (p: Palette, bg: string) =>
  contrast(bg, p.ink) >= contrast(bg, p.paper) ? p.ink : p.paper;

/** CSS custom properties for a palette, under a direction's own prefix. */
export function paletteVars(p: Palette, prefix: string): Record<string, string> {
  const out: Record<string, string> = {
    [`--${prefix}-paper`]: p.paper,
    [`--${prefix}-ink`]: p.ink,
    [`--${prefix}-over`]: p.over,
  };
  p.loud.slice(0, 6).forEach((c, i) => {
    out[`--${prefix}-l${i}`] = c;
    out[`--${prefix}-l${i}-on`] = textOn(p, c);
  });
  p.soft.slice(0, 6).forEach((c, i) => (out[`--${prefix}-s${i}`] = c));
  return out;
}
