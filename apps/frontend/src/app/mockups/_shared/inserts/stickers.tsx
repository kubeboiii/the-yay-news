"use client";

import { Burst } from "@repo/ui/print/burst";
import { Mark } from "@repo/ui/print/mark";

// The stickers on the sheet. Each is printed from the kit — Burst shapes and real hand-drawn
// marks — and set in the viewing version's type. `w` is its width as a share of the sheet, and the
// same size is kept when it is stuck on the page, so a sticker never changes size in the hand.

export type StickerDef = { id: string; label: string; w: number; ratio: number };

export const stickerDefs: StickerDef[] = [
  { id: "good-news", label: "Good news only", w: 36, ratio: 1 },
  { id: "yay", label: "Yay!", w: 34, ratio: 0.58 },
  { id: "issue", label: "No. 42", w: 25, ratio: 1 },
  { id: "heart", label: "A heart", w: 21, ratio: 0.95 },
  { id: "finished", label: "Finished it!", w: 38, ratio: 0.46 },
  { id: "smile", label: "A smiley face", w: 23, ratio: 1 },
  { id: "star", label: "A gold star", w: 23, ratio: 1 },
  { id: "hi", label: "Hi", w: 22, ratio: 1 },
];

export const stickerById = (id: string) => stickerDefs.find((s) => s.id === id);

/** One sticker's printed face. It fills its box; the caller sizes the box. */
export function StickerArt({ id, issue }: { id: string; issue: number }) {
  switch (id) {
    case "good-news":
      return (
        <Burst fill="var(--yi-a)" points={22} depth={0.13} className="yi-st-fill">
          <span className="yi-st-type yi-st-type--good">
            Good
            <br />
            news
            <br />
            only
          </span>
        </Burst>
      );
    case "yay":
      return (
        <span className="yi-st-pill">
          <span className="yi-st-type yi-st-type--yay">Yay!</span>
        </span>
      );
    case "issue":
      return (
        <Burst fill="var(--yi-c)" points={11} depth={0.12} wobble={1} className="yi-st-fill">
          <span className="yi-st-type yi-st-type--issue">
            <small>No.</small>
            {issue}
          </span>
        </Burst>
      );
    case "heart":
      return <Mark name="stars-15" ink="var(--yi-a)" className="yi-st-fill" />;
    case "finished":
      return (
        <span className="yi-st-label">
          <Mark name="stars-04" ink="var(--yi-ink)" className="yi-st-label__star" />
          <span className="yi-st-type yi-st-type--label">Finished it!</span>
        </span>
      );
    case "smile":
      return (
        <span className="yi-st-dot" style={{ background: "var(--yi-b)" }}>
          <Mark name="doodles-06" ink="var(--yi-ink)" className="yi-st-dot__mark" />
        </span>
      );
    case "star":
      return <Mark name="stars-21" ink="var(--yi-d)" className="yi-st-fill" />;
    case "hi":
      return (
        <span className="yi-st-dot" style={{ background: "var(--yi-e)" }}>
          <Mark
            name="sketch-09"
            ink="var(--yi-ink)"
            className="yi-st-dot__mark yi-st-dot__mark--hi"
          />
        </span>
      );
    default:
      return null;
  }
}

// ——— Stickers stuck on a page, remembered per page ———

export type Placed = { id: string; x: number; y: number; rot: number };

const key = (path: string) => `yn-insert-stickers:${path}`;

export function readPlaced(path: string): Placed[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key(path)) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (p): p is Placed =>
        typeof p === "object" &&
        p !== null &&
        typeof (p as Placed).id === "string" &&
        Number.isFinite((p as Placed).x) &&
        Number.isFinite((p as Placed).y) &&
        Number.isFinite((p as Placed).rot) &&
        stickerById((p as Placed).id) !== undefined,
    );
  } catch {
    return [];
  }
}

export function savePlaced(path: string, placed: Placed[]) {
  try {
    localStorage.setItem(key(path), JSON.stringify(placed));
  } catch {
    // Storage blocked: the stickers stay put for this visit only.
  }
}
