// The "prominence" signal: the Yay News favours mainstream, widely known names, franchises, clubs
// and events that a Gen Z reader already knows. The list itself is data (data/prominent.json);
// this module only reads and matches it.
import { readFileSync } from "node:fs";
import path from "node:path";
import type { SectionSlug } from "./types.ts";

export type ProminentEntities = Partial<Record<SectionSlug, string[]>>;

export const PROMINENT_FILE = path.resolve(import.meta.dirname, "../data/prominent.json");

export function loadProminent(file = PROMINENT_FILE): ProminentEntities {
  const raw = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
  const out: ProminentEntities = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!k.startsWith("$") && Array.isArray(v)) out[k as SectionSlug] = v.map(String);
  }
  return out;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const matchers = new Map<string, RegExp>();
const matcher = (name: string) => {
  let re = matchers.get(name);
  if (!re) {
    re = new RegExp(`(?<![\\p{L}\\p{N}])${escape(name)}(?![\\p{L}\\p{N}])`, "iu");
    matchers.set(name, re);
  }
  return re;
};

/** The prominent names a piece of text mentions for a section (any section when none is given). */
export function prominentIn(
  text: string,
  section: SectionSlug | null,
  entities: ProminentEntities = PROMINENT,
): string[] {
  const lists = section ? [entities[section] ?? []] : Object.values(entities);
  const hits = new Set<string>();
  for (const list of lists)
    for (const name of list ?? []) if (matcher(name).test(text)) hits.add(name);
  return [...hits];
}

/**
 * A selection boost: 0 for nothing known, up to 3 for a story built around big names. The title
 * counts double: a name in the headline is what the story is about.
 */
export function prominenceBoost(
  c: { title: string; summary: string; section: SectionSlug },
  entities: ProminentEntities = PROMINENT,
): number {
  const inTitle = prominentIn(c.title, c.section, entities).length;
  const inSummary = prominentIn(c.summary, c.section, entities).length;
  return Math.min(3, inTitle * 1.5 + Math.min(inSummary, 2) * 0.5);
}

export const PROMINENT: ProminentEntities = loadProminent();
