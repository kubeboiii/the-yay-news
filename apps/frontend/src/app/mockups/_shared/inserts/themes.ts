import type { CSSProperties } from "react";

/**
 * Each insert is printed by the same press as the paper it falls out of, so it borrows that
 * version's typefaces and inks. The font variables are set on each version's layout wrapper,
 * which is where every insert (and its tab, and its stickers) is rendered.
 */
export type InsertTheme = {
  /** Headline face, and whether that face is set in capitals. */
  display: string;
  displayCase: "uppercase" | "none";
  displayWeight: number;
  displayTracking: string;
  /** Reading face (and its italic, for the pencilled notes). */
  text: string;
  /** Small working face: serials, spec lines, small print. */
  small: string;
  ink: string;
  /** Five inks besides black, strongest first. Crayons and stickers are drawn from these. */
  inks: [string, string, string, string, string];
  /** Tinted card for the coupon. */
  couponStock: string;
  /** Glossy backing paper behind the stickers. */
  backing: string;
  /** Cream of the postcard's reverse. */
  postStock: string;
};

const themes: Record<string, InsertTheme> = {
  v1: {
    display: 'var(--font-head), "League Gothic", "Arial Narrow", sans-serif',
    displayCase: "uppercase",
    displayWeight: 400,
    displayTracking: "0.01em",
    text: 'var(--font-text), "Libre Caslon Text", Georgia, serif',
    small: 'var(--font-sans), "Libre Franklin", system-ui, sans-serif',
    ink: "#17140f",
    inks: ["#ff3d9a", "#e9ff1f", "#2f5bff", "#ff6a1f", "#36f28a"],
    couponStock: "#f1fb7c",
    backing: "#f3f0ea",
    postStock: "#f4efe2",
  },
  v3: {
    display: 'var(--font-head), "Libre Franklin", "Franklin Gothic", sans-serif',
    displayCase: "uppercase",
    displayWeight: 900,
    displayTracking: "-0.02em",
    text: 'var(--font-text), Tinos, "Times New Roman", serif',
    small: 'var(--font-mono), "Courier Prime", "Courier New", monospace',
    ink: "#151515",
    inks: ["#ff5a1f", "#0078bf", "#6fb7e3", "#ff9a6b", "#ffc2a8"],
    couponStock: "#ffd9c4",
    backing: "#f2f2ee",
    postStock: "#f5f1e6",
  },
  v4: {
    display: 'var(--z-slab), "Alfa Slab One", Rockwell, serif',
    displayCase: "none",
    displayWeight: 400,
    displayTracking: "0",
    text: 'var(--z-serif), "PT Serif", Georgia, serif',
    small: 'var(--z-type), "Courier Prime", "Courier New", monospace',
    ink: "#141414",
    inks: ["#f19bbd", "#9d8ef0", "#62cf95", "#f5ad7e", "#72bfe0"],
    couponStock: "#fff3a0",
    backing: "#f4f0f7",
    postStock: "#f7f1e4",
  },
  v5: {
    display: 'var(--f-display), "Bodoni Moda", Didot, serif',
    displayCase: "none",
    displayWeight: 500,
    displayTracking: "-0.01em",
    text: 'var(--f-text), "Crimson Pro", Georgia, serif',
    small: 'var(--f-sans), "IBM Plex Sans Condensed", "Arial Narrow", sans-serif',
    ink: "#1b1712",
    inks: ["#f4a3bf", "#b4a2f2", "#92d8b4", "#f6a47c", "#8fc3ea"],
    couponStock: "#ffe9d9",
    backing: "#f5f2ef",
    postStock: "#f8f3e8",
  },
};

export const themeFor = (version: string): InsertTheme => themes[version] ?? themes.v1!;

/** The theme as custom properties, set on every element this layer renders. */
export const themeVars = (t: InsertTheme): CSSProperties =>
  ({
    "--yi-display": t.display,
    "--yi-display-case": t.displayCase,
    "--yi-display-weight": t.displayWeight,
    "--yi-display-tracking": t.displayTracking,
    "--yi-text": t.text,
    "--yi-small": t.small,
    "--yi-ink": t.ink,
    "--yi-a": t.inks[0],
    "--yi-b": t.inks[1],
    "--yi-c": t.inks[2],
    "--yi-d": t.inks[3],
    "--yi-e": t.inks[4],
    "--yi-coupon": t.couponStock,
    "--yi-backing": t.backing,
    "--yi-post": t.postStock,
  }) as CSSProperties;
