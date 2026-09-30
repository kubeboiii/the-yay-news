import type { EditionDesign, PuzzleType } from "@repo/shared";
import { editionLook } from "@/app/clip/_lib/looks";

// What there is to collect: the stickers (and which puzzle earns which), and how each paper's
// stamp is inked and decorated.

// ——— Stickers ———

export type StickerDef = {
  id: string;
  label: string;
  /** Width as a share (%) of the page it's stuck on (and of a sticker sheet's width × 2). */
  w: number;
  /** Height ÷ width. */
  ratio: number;
  /** What earns it, in words, for the sheet's small print. */
  earnedBy: string;
  /** The sheet's hint for a sticker still to earn, when "Solve …" doesn't fit. */
  hint?: string;
};

export const STICKERS: StickerDef[] = [
  { id: "star", label: "A gold star", w: 11, ratio: 1, earnedBy: "the crossword" },
  { id: "yay", label: "Yay!", w: 15, ratio: 0.58, earnedBy: "the word ladder" },
  { id: "hi", label: "Hi", w: 10, ratio: 1, earnedBy: "the riddle" },
  { id: "heart", label: "A heart", w: 10, ratio: 0.95, earnedBy: "the word search" },
  { id: "good-news", label: "Good news only", w: 15, ratio: 1, earnedBy: "the fortune teller" },
  {
    id: "finished",
    label: "Finished it!",
    w: 17,
    ratio: 0.46,
    earnedBy: "every puzzle in a paper",
  },
  {
    id: "full-set",
    label: "Full set!",
    w: 13,
    ratio: 1,
    earnedBy: "a full set of Yay Attax cards",
    hint: "Complete a set of cards",
  },
  { id: "bee", label: "A busy bee", w: 12, ratio: 0.8, earnedBy: "a bonus" },
  { id: "rainbow", label: "A rainbow", w: 13, ratio: 0.7, earnedBy: "a bonus" },
  { id: "smile", label: "A smiley face", w: 10, ratio: 1, earnedBy: "a bonus" },
  { id: "issue", label: "The issue number", w: 11, ratio: 1, earnedBy: "a bonus" },
];

export const stickerDef = (id: string): StickerDef =>
  STICKERS.find((s) => s.id === id) ?? {
    id,
    label: "A sticker",
    w: 10,
    ratio: 1,
    earnedBy: "something",
  };

const PUZZLE_STICKER: Record<PuzzleType, string> = {
  crossword: "star",
  word_ladder: "yay",
  riddle: "hi",
  word_search: "heart",
  fortune_teller: "good-news",
};

/** The sticker a puzzle earns. Record it with `earnSticker(issue, stickerForPuzzle(type))`. */
export const stickerForPuzzle = (puzzle: PuzzleType) => PUZZLE_STICKER[puzzle];

/** The sticker for solving every puzzle in a paper. */
export const ALL_SOLVED_STICKER = "finished";

// ——— Stamps ———

const lum = (hex: string) =>
  [1, 3, 5].reduce((s, i, k) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    const lin = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    return s + lin * [0.2126, 0.7152, 0.0722][k]!;
  }, 0);

const HOUSE_INK: Record<EditionDesign, string> = {
  broadsheet: "#2f5bff",
  tabloid: "#d8401c",
  zine: "#2d55b8",
  midi: "#b4432f",
};

const isDesign = (d: string): d is EditionDesign =>
  d === "broadsheet" || d === "tabloid" || d === "zine" || d === "midi";

/**
 * The stamp-pad ink for an edition: the colourway's strongest ink that still reads on the
 * stamp book's manila (a fluoro yellow wouldn't), else the design's house stamp colour.
 */
export function stampInk(design: string, colourway: string): string {
  if (!isDesign(design)) return "#2d55b8";
  try {
    const look = editionLook({ design, colourway });
    const candidates = [look.desk, look.bDeep, look.aDeep, look.a, look.b];
    const good = candidates.find(
      (c) => /^#[0-9a-f]{6}$/i.test(c) && lum(c) < 0.28 && lum(c) > 0.02,
    );
    return good ?? HOUSE_INK[design];
  } catch {
    return HOUSE_INK[design];
  }
}

export type Motif = "sun" | "star" | "heart" | "flower" | "planet" | "bolt" | "cup" | "plane";

const MOTIFS: Record<EditionDesign, Motif[]> = {
  broadsheet: ["sun", "cup", "star", "plane", "bolt"],
  tabloid: ["bolt", "star", "sun"],
  zine: ["heart", "flower", "star"],
  midi: ["flower", "planet", "heart"],
};

/** A small doodle for the middle of an edition's stamp, varying with the issue. */
export function motifFor(design: string, issue: number): Motif {
  const set = isDesign(design) ? MOTIFS[design] : MOTIFS.broadsheet;
  return set[issue % set.length]!;
}

export const DESIGN_NAME: Record<string, string> = {
  broadsheet: "Broadsheet",
  tabloid: "Tabloid",
  zine: "Mini Zine",
  midi: "Midi",
};
