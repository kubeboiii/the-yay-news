import { z } from "zod";
import { calendarDateSchema, slugSchema } from "./common.ts";
import { editionDesignSchema } from "./design.ts";
import { readerQuerySchema } from "./edition.ts";

// Searching the pile: find a story again by a word in its headline, standfirst or kicker. Results
// come grouped by the paper they were printed in, newest paper first, and only from papers already
// released to the reader.

export const SEARCH_MIN = 2;
export const SEARCH_MAX = 80;

export const searchQuerySchema = readerQuerySchema.extend({
  q: z.string().trim().min(SEARCH_MIN).max(SEARCH_MAX),
});

export const searchHitSchema = z.object({
  slug: slugSchema,
  kicker: z.string(),
  headline: z.string(),
  dek: z.string(),
});

export const searchPaperSchema = z.object({
  issueNumber: z.number().int(),
  date: calendarDateSchema,
  design: editionDesignSchema,
  stories: z.array(searchHitSchema),
});

export const searchResultSchema = z.object({
  query: z.string(),
  papers: z.array(searchPaperSchema),
  /** More stories matched than were returned. */
  more: z.boolean(),
});

export type SearchHit = z.infer<typeof searchHitSchema>;
export type SearchPaper = z.infer<typeof searchPaperSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
