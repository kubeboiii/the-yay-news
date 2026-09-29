import { z } from "zod";
import { slugSchema } from "./common.ts";
import { editionSummarySchema, issueParamSchema, storyItemSchema } from "./edition.ts";
import { sectionSchema } from "./section.ts";

const neighbourSchema = z.object({ slug: slugSchema, headline: z.string() }).nullable();

/** A single story page: the story, where it sits in its edition, and its reading-order neighbours. */
export const storySchema = z.object({
  story: storyItemSchema,
  edition: editionSummarySchema,
  page: z.object({
    order: z.number().int(),
    layout: z.string(),
    section: sectionSchema.nullable(),
  }),
  /** Previous and next stories in reading order (front page to back page); null at either end. */
  prev: neighbourSchema,
  next: neighbourSchema,
});

export const storyParamSchema = issueParamSchema.extend({ slug: slugSchema });

export type Story = z.infer<typeof storySchema>;
