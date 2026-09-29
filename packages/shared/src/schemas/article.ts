import { z } from "zod";
import { categorySchema } from "./category.ts";

export const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase words separated by hyphens");

// Dates travel as ISO strings over JSON.
export const articleSchema = z.object({
  id: z.string(),
  slug: slugSchema,
  title: z.string(),
  summary: z.string(),
  body: z.string(),
  imageUrl: z.string().nullable(),
  publishedAt: z.iso.datetime(),
  category: categorySchema.nullable(),
});

export const articleListQuerySchema = z.object({
  category: slugSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type Article = z.infer<typeof articleSchema>;
export type ArticleListQuery = z.infer<typeof articleListQuerySchema>;
