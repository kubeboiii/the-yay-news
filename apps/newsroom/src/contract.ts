// Checks a draft against the shared contracts: the edition exactly as the backend would serve it
// must parse with @repo/shared's editionSchema, and a few rules the schema cannot see must hold.
import { type Edition, editionSchema, slugSchema, solvedPuzzleSchema } from "@repo/shared";
import { SECTIONS } from "./store.ts";
import type { EditionDraft } from "./types.ts";

const sectionBySlug = new Map(SECTIONS.map((s) => [s.slug, s]));
const section = (slug: string) => {
  const s = sectionBySlug.get(slug);
  if (!s) throw new Error(`unknown section "${slug}"`);
  return s;
};

/** The draft as the reader API serves it (reserves hidden, puzzles without answers). */
export function toServedEdition(d: EditionDraft): Edition {
  const pages = d.pages.map((p) => ({
    order: p.order,
    layout: p.layout,
    section: p.section ? section(p.section) : null,
    stories: p.stories
      .filter((s) => !s.isReserve)
      .map((s, i) => ({
        slug: s.slug,
        order: i + 1,
        slot: s.slot,
        section: section(s.section),
        kicker: s.kicker,
        headline: s.headline,
        dek: s.dek,
        body: s.body,
        readMinutes: s.readMinutes,
        sticker: s.sticker,
        sourceUrl: s.sourceUrl,
        sourceName: s.sourceName,
        embedUrl: s.embedUrl,
        images: s.images,
      })),
  }));
  const lead = pages[0]?.stories.find((s) => s.slot === "lead") ?? null;
  return editionSchema.parse({
    issueNumber: d.issueNumber,
    volume: d.volume,
    date: d.date,
    kind: d.kind,
    design: d.design,
    colourway: d.colourway,
    guestSections: d.guestSections.map(section),
    guestSection: d.guestSections[0] ? section(d.guestSections[0]) : null,
    lead: lead
      ? {
          slug: lead.slug,
          kicker: lead.kicker,
          headline: lead.headline,
          image: lead.images[0] ?? null,
        }
      : null,
    pages,
    features: d.features,
    puzzles: d.puzzles.map(({ solution: _solution, ...p }) => p),
    yesterday: null,
  });
}

/** Everything wrong with a draft; empty when it can be published. */
export function draftProblems(d: EditionDraft): string[] {
  const problems: string[] = [];
  try {
    toServedEdition(d);
  } catch (e) {
    problems.push(`does not match the edition contract: ${(e as Error).message.slice(0, 1500)}`);
  }
  const slugs = new Set<string>();
  const pictures = new Set<string>();
  for (const p of d.pages) {
    for (const s of p.stories) {
      if (!slugSchema.safeParse(s.slug).success) problems.push(`bad slug "${s.slug}"`);
      if (slugs.has(s.slug)) problems.push(`duplicate slug "${s.slug}"`);
      slugs.add(s.slug);
      for (const img of s.images) {
        if (!img.licence || !img.licenceUrl) problems.push(`image on "${s.slug}" has no licence`);
        if (pictures.has(img.url)) problems.push(`picture ${img.url} used twice`);
        pictures.add(img.url);
      }
    }
  }
  if (d.pages[0]?.layout !== "front") problems.push("first page is not the front page");
  if (d.pages.at(-1)?.layout !== "back") problems.push("last page is not the back page");
  if (!d.pages[0]?.stories.some((s) => s.slot === "lead" && !s.isReserve))
    problems.push("no lead story");
  const guests = d.pages.filter((p) => p.layout === "guest");
  if (guests.length > 2) problems.push("more than two guest pages");
  if (guests.map((p) => p.section).join() !== d.guestSections.join())
    problems.push("guest sections do not match their pages");
  for (const p of d.puzzles) {
    const r = solvedPuzzleSchema.safeParse(p);
    if (!r.success) problems.push(`puzzle ${p.type}: ${r.error.message}`);
  }
  return problems;
}
