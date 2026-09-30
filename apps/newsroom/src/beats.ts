// Beats: the finer topics inside a section (data/beats.json), so a page does not run three football
// stories while the boxing and F1 news goes unused, and so a beat left out lately comes back. The
// list is data; this module only reads it.
import { readFileSync } from "node:fs";
import path from "node:path";
import type { SectionSlug } from "./types.ts";

/** Section → beat → weight. */
export type Beats = Partial<Record<SectionSlug, Record<string, number>>>;

export const BEATS_FILE = path.resolve(import.meta.dirname, "../data/beats.json");

/** The beat for anything that fits none of its section's beats (and for sections without beats). */
export const OTHER_BEAT = "other";

export function loadBeats(file = BEATS_FILE): Beats {
  const raw = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
  const out: Beats = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith("$") || !v || typeof v !== "object") continue;
    out[k as SectionSlug] = Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([b, w]) => [b, Number(w) || 1]),
    );
  }
  return out;
}

export const BEATS: Beats = loadBeats();

/** A classifier's beat, checked against the section's list ("other" when it is not on it). */
export function beatFor(section: SectionSlug, beat: string | undefined, beats = BEATS): string {
  const b = (beat ?? "").toLowerCase().trim().replace(/\s+/g, "-");
  return beats[section]?.[b] !== undefined ? b : OTHER_BEAT;
}

export const beatWeight = (section: SectionSlug, beat: string, beats = BEATS) =>
  beats[section]?.[beat] ?? 1;

/** The beat lists as prompt text: one line per section. */
export const beatsPrompt = (beats = BEATS) =>
  `BEATS (pick one for the item's section):\n${Object.entries(beats)
    .map(([s, bs]) => `- ${s}: ${Object.keys(bs ?? {}).join(", ")}`)
    .join("\n")}`;
