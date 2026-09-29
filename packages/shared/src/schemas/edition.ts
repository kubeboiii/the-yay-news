import { z } from "zod";
import { calendarDateSchema, slugSchema } from "./common.ts";
import { editionDesignProblems, editionDesignSchema } from "./design.ts";
import { sectionSchema } from "./section.ts";

// ——— Stories and images ———

export const imageSchema = z.object({
  /** An absolute URL, or a path on the site itself (e.g. "/editions/42/octopus.jpg"). */
  url: z.union([z.url(), z.string().regex(/^\/[^\s]+$/)]),
  alt: z.string(),
  credit: z.string(),
  licence: z.string(),
  licenceUrl: z.url(),
  kind: z.enum(["photo", "illustration"]),
});

export const storySlotSchema = z.enum(["lead", "feature", "brief"]);

/** A story as it appears on a page. */
export const storyItemSchema = z.object({
  slug: slugSchema,
  order: z.number().int(),
  slot: storySlotSchema,
  section: sectionSchema,
  kicker: z.string(),
  headline: z.string(),
  /** Standfirst. */
  dek: z.string(),
  /** One entry per paragraph. */
  body: z.array(z.string()),
  readMinutes: z.number().int().min(1),
  sticker: z.string().nullable(),
  sourceUrl: z.url(),
  sourceName: z.string(),
  embedUrl: z.url().nullable(),
  images: z.array(imageSchema),
});

// ——— Recurring features ———

const feature = <T extends string, C extends z.ZodType>(type: T, content: C) =>
  z.object({ type: z.literal(type), order: z.number().int(), content });

export const featureSchema = z.discriminatedUnion("type", [
  feature("number_of_day", z.object({ value: z.string(), caption: z.string() })),
  feature("weather", z.object({ headline: z.string(), detail: z.string() })),
  feature("quote", z.object({ text: z.string(), by: z.string() })),
  feature("correction", z.object({ text: z.string() })),
  feature("classified", z.object({ heading: z.string(), text: z.string() })),
  feature("letter", z.object({ text: z.string(), from: z.string() })),
  feature(
    "word_of_the_day",
    z.object({
      word: z.string(),
      pronunciation: z.string(),
      meaning: z.string(),
      example: z.string(),
    }),
  ),
  feature("comic", z.object({ title: z.string(), panels: z.array(z.string()).min(1) })),
  feature("sign_off", z.object({ text: z.string() })),
]);

export const featureTypeSchema = z.enum([
  "number_of_day",
  "weather",
  "quote",
  "correction",
  "classified",
  "letter",
  "word_of_the_day",
  "comic",
  "sign_off",
]);

// ——— Puzzles (the back page). Solutions are only ever served in the following edition. ———

const clueSchema = z.object({
  n: z.number().int().min(1),
  clue: z.string(),
  length: z.number().int(),
});

export const crosswordDataSchema = z.object({
  title: z.string(),
  /** One string per row: "#" is a black square, "." a square to fill. */
  rows: z.array(z.string()),
  /** Where each numbered answer starts. */
  numbers: z.array(z.object({ row: z.number().int(), col: z.number().int(), n: z.number().int() })),
  across: z.array(clueSchema),
  down: z.array(clueSchema),
});
export const crosswordSolutionSchema = z.object({
  /** The filled grid, "#" for black squares. */
  grid: z.array(z.string()),
  across: z.array(z.object({ n: z.number().int(), answer: z.string() })),
  down: z.array(z.object({ n: z.number().int(), answer: z.string() })),
});

export const wordLadderDataSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  start: z.string(),
  end: z.string(),
  /** Number of words between start and end. */
  steps: z.number().int().min(1),
});
export const wordLadderSolutionSchema = z.object({ ladder: z.array(z.string()).min(2) });

export const riddleDataSchema = z.object({ title: z.string(), question: z.string() });
export const riddleSolutionSchema = z.object({ answer: z.string() });

export const puzzleSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("crossword"), order: z.number().int(), data: crosswordDataSchema }),
  z.object({ type: z.literal("word_ladder"), order: z.number().int(), data: wordLadderDataSchema }),
  z.object({ type: z.literal("riddle"), order: z.number().int(), data: riddleDataSchema }),
]);

export const solvedPuzzleSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("crossword"),
    order: z.number().int(),
    data: crosswordDataSchema,
    solution: crosswordSolutionSchema,
  }),
  z.object({
    type: z.literal("word_ladder"),
    order: z.number().int(),
    data: wordLadderDataSchema,
    solution: wordLadderSolutionSchema,
  }),
  z.object({
    type: z.literal("riddle"),
    order: z.number().int(),
    data: riddleDataSchema,
    solution: riddleSolutionSchema,
  }),
]);

export const puzzleTypeSchema = z.enum(["crossword", "word_ladder", "riddle"]);

// ——— Editions ———

export const editionKindSchema = z.enum(["regular", "slow_news_day"]);

const designRefinement = (
  e: { date: string; design: z.infer<typeof editionDesignSchema>; colourway: string },
  ctx: z.RefinementCtx,
) => {
  for (const message of editionDesignProblems(e)) {
    ctx.addIssue({ code: "custom", path: ["design"], message });
  }
};

const editionSummaryShape = z.object({
  issueNumber: z.number().int().min(1),
  volume: z.number().int().min(1),
  date: calendarDateSchema,
  kind: editionKindSchema,
  design: editionDesignSchema,
  colourway: z.string(),
  guestSection: sectionSchema.nullable(),
  /** The front-page lead, for archive racks and link previews. */
  lead: z
    .object({
      slug: slugSchema,
      kicker: z.string(),
      headline: z.string(),
      image: imageSchema.nullable(),
    })
    .nullable(),
});

export const editionSummarySchema = editionSummaryShape.superRefine(designRefinement);

export const pageSchema = z.object({
  order: z.number().int(),
  /** "front", "section", "guest" or "back". */
  layout: z.string(),
  /** Null for the front and back pages. */
  section: sectionSchema.nullable(),
  stories: z.array(storyItemSchema),
});

export const editionSchema = editionSummaryShape
  .extend({
    pages: z.array(pageSchema),
    features: z.array(featureSchema),
    /** Today's puzzles, without answers. */
    puzzles: z.array(puzzleSchema),
    /** The previous edition's puzzles with their answers, for "yesterday's answers". */
    yesterday: z
      .object({ issueNumber: z.number().int(), puzzles: z.array(solvedPuzzleSchema) })
      .nullable(),
  })
  .superRefine(designRefinement);

export const archiveListSchema = z.object({
  items: z.array(editionSummarySchema),
  /** Pass as `?cursor=` to fetch the next (older) page; null on the last page. */
  nextCursor: calendarDateSchema.nullable(),
});

// ——— Requests ———

/** Who is reading, and when. `now` is honoured outside production only (previews and tests). */
export const readerQuerySchema = z.object({
  tz: z.string().max(100).optional(),
  now: z.iso.datetime({ offset: true }).optional(),
});

export const archiveQuerySchema = readerQuerySchema.extend({
  cursor: calendarDateSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const issueParamSchema = z.object({ issue: z.coerce.number().int().min(1) });
export const dateParamSchema = z.object({ date: calendarDateSchema });

export type Image = z.infer<typeof imageSchema>;
export type StorySlot = z.infer<typeof storySlotSchema>;
export type StoryItem = z.infer<typeof storyItemSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type FeatureType = z.infer<typeof featureTypeSchema>;
export type Puzzle = z.infer<typeof puzzleSchema>;
export type SolvedPuzzle = z.infer<typeof solvedPuzzleSchema>;
export type PuzzleType = z.infer<typeof puzzleTypeSchema>;
export type EditionKind = z.infer<typeof editionKindSchema>;
export type EditionSummary = z.infer<typeof editionSummarySchema>;
export type EditionPage = z.infer<typeof pageSchema>;
export type Edition = z.infer<typeof editionSchema>;
export type ArchiveList = z.infer<typeof archiveListSchema>;
export type ReaderQuery = z.infer<typeof readerQuerySchema>;
export type ArchiveQuery = z.infer<typeof archiveQuerySchema>;
