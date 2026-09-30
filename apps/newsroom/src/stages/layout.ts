// Stage 8 (first half): lay the written stories onto pages in the shape the reader expects: the
// front page (lead and two features), one page per section (main story, second story, briefs, then
// any reserves), at most one guest page, and the back page. Failed stories are replaced from
// reserves here.
import { slugify, wordCount } from "../text.ts";
import {
  type Assignment,
  type DraftPage,
  type DraftStory,
  GUEST_SECTIONS,
  type SectionSlug,
} from "../types.ts";
import type { Selection } from "./select.ts";
import type { Written } from "./write.ts";

export type LaidOut = {
  pages: DraftPage[];
  /** Candidate id → what happened at layout (e.g. "replaced by reserve …"). */
  notes: Map<string, string>;
  /** Assignments that ended up in the paper, served or reserve, keyed by candidate id. */
  placed: Map<string, { story: DraftStory; assignment: Assignment }>;
};

export function layOut(selection: Selection, written: Map<string, Written>): LaidOut {
  const notes = new Map<string, string>();
  const placed: LaidOut["placed"] = new Map();
  const slugs = new Set<string>();
  const uniqueSlug = (headline: string) => {
    const base = slugify(headline);
    let slug = base;
    for (let n = 2; slugs.has(slug); n++) slug = `${base}-${n}`;
    slugs.add(slug);
    return slug;
  };

  const ok = (a: Assignment) => written.has(a.candidate.id);
  const reserves = selection.assignments.filter((a) => a.reserve && ok(a));
  const takeReserve = (page: Assignment["page"]) => {
    const i = page === "front" ? 0 : reserves.findIndex((r) => r.page === page);
    if (i < 0 || !reserves[i]) return null;
    return reserves.splice(i, 1)[0] ?? null;
  };

  const toStory = (a: Assignment, slot: DraftStory["slot"], isReserve: boolean): DraftStory => {
    const w = written.get(a.candidate.id) as Written;
    const story: DraftStory = {
      slug: uniqueSlug(w.headline),
      slot,
      section: a.candidate.section,
      kicker: w.kicker,
      headline: w.headline,
      dek: w.dek,
      body: w.body,
      readMinutes: Math.max(1, Math.round(wordCount(w.body.join(" ")) / 200)),
      sticker: w.sticker ?? null,
      sourceUrl: a.candidate.url,
      sourceName: a.candidate.sourceName,
      embedUrl: a.candidate.embedUrl,
      images: [],
      isReserve,
      candidateId: a.candidate.id,
    };
    placed.set(a.candidate.id, { story, assignment: a });
    return story;
  };

  const pages: DraftPage[] = [];
  for (const key of selection.pages) {
    const served = selection.assignments.filter((a) => a.page === key && !a.reserve);
    const stories: DraftStory[] = [];
    for (const a of served) {
      if (ok(a)) {
        stories.push(toStory(a, a.slot, false));
        continue;
      }
      const r = takeReserve(key);
      if (r) {
        notes.set(a.candidate.id, `replaced by reserve ${r.candidate.id}`);
        notes.set(r.candidate.id, `promoted from reserve to replace ${a.candidate.id}`);
        stories.push(toStory(r, a.slot, false));
      } else notes.set(a.candidate.id, "dropped: no reserve to replace it");
    }
    if (key === "front") {
      // The front page always has a lead, even if the chosen lead fell through.
      if (stories.length && !stories.some((s) => s.slot === "lead")) stories[0]!.slot = "lead";
      stories.forEach((s, i) => i > 0 && (s.slot = "feature"));
    } else {
      stories.forEach((s, i) => (s.slot = i < 2 ? "feature" : "brief"));
    }
    if (!stories.length) continue;
    pages.push({
      order: pages.length + 1,
      layout:
        key === "front"
          ? "front"
          : GUEST_SECTIONS.includes(key as SectionSlug)
            ? "guest"
            : "section",
      section: key === "front" ? null : (key as SectionSlug),
      stories,
    });
  }
  // Remaining reserves ride along on their page, after the served stories.
  for (const r of reserves) {
    const page =
      pages.find((p) => p.section === r.page) ?? pages.find((p) => p.layout === "section");
    if (page) page.stories.push(toStory(r, "brief", true));
  }
  pages.push({ order: pages.length + 1, layout: "back", section: null, stories: [] });
  return { pages, notes, placed };
}
