import {
  editionSchema,
  editionSummarySchema,
  storyItemSchema,
  type Edition,
  type EditionSummary,
  type StoryItem,
} from "@repo/shared";
import type {
  EditionRecord,
  EditionSummaryRecord,
  PuzzleRecord,
  StoryRecord,
} from "./edition.repository.js";

// Database rows → public contract. Each result is parsed with the shared zod schema, so a row that
// doesn't fit the contract (e.g. malformed feature JSON) fails loudly instead of reaching readers.

/** `@db.Date` columns come back as midnight UTC. */
export const toCalendarDate = (date: Date) => date.toISOString().slice(0, 10);
export const fromCalendarDate = (date: string) => new Date(`${date}T00:00:00.000Z`);

const storyItem = (s: StoryRecord) => ({
  slug: s.slug,
  order: s.order,
  slot: s.slot,
  section: s.section,
  kicker: s.kicker,
  headline: s.headline,
  dek: s.dek,
  body: s.body,
  readMinutes: s.readMinutes,
  sticker: s.sticker,
  sourceUrl: s.sourceUrl,
  sourceName: s.sourceName,
  embedUrl: s.embedUrl,
  images: s.images.map(({ url, alt, credit, licence, licenceUrl, kind }) => ({
    url,
    alt,
    credit,
    licence,
    licenceUrl,
    kind,
  })),
});

const summaryFields = (e: EditionSummaryRecord | EditionRecord, lead: StoryRecord | undefined) => ({
  issueNumber: e.issueNumber,
  volume: e.volume,
  date: toCalendarDate(e.date),
  kind: e.kind,
  design: e.design,
  colourway: e.colourway,
  guestSections: e.guests.map((g) => g.section),
  guestSection: e.guests[0]?.section ?? null,
  lead: lead
    ? {
        slug: lead.slug,
        kicker: lead.kicker,
        headline: lead.headline,
        image: storyItem(lead).images[0] ?? null,
      }
    : null,
});

/** Stories in reading order: front page to back page, top to bottom. */
export const readingOrder = (e: EditionRecord) => e.pages.flatMap((p) => p.stories);

const leadOf = (e: EditionRecord) => readingOrder(e).find((s) => s.slot === "lead");

export const toStoryItem = (s: StoryRecord): StoryItem => storyItemSchema.parse(storyItem(s));

/** Summary of an archive row, which carries only its lead story. */
export const toEditionSummary = (e: EditionSummaryRecord): EditionSummary =>
  editionSummarySchema.parse(summaryFields(e, e.stories[0]));

/** Summary of a fully loaded edition. */
export const summariseEdition = (e: EditionRecord): EditionSummary =>
  editionSummarySchema.parse(summaryFields(e, leadOf(e)));

export function toEdition(
  e: EditionRecord,
  yesterday: { issueNumber: number; puzzles: PuzzleRecord[] } | null,
): Edition {
  return editionSchema.parse({
    ...summaryFields(e, leadOf(e)),
    pages: e.pages.map((p) => ({
      order: p.order,
      layout: p.layout,
      section: p.section,
      stories: p.stories.map(storyItem),
    })),
    features: e.features.map(({ type, order, content }) => ({ type, order, content })),
    puzzles: e.puzzles.map(({ type, order, data }) => ({ type, order, data })),
    yesterday: yesterday && {
      issueNumber: yesterday.issueNumber,
      puzzles: yesterday.puzzles.map(({ type, order, data, solution }) => ({
        type,
        order,
        data,
        solution,
      })),
    },
  });
}
