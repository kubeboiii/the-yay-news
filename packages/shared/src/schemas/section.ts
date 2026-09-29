import { z } from "zod";
import { slugSchema } from "./common.ts";

export const sectionKindSchema = z.enum(["core", "guest"]);
export const sectionVoiceSchema = z.enum(["witty", "quirky", "warm"]);

export const sectionSchema = z.object({
  slug: slugSchema,
  name: z.string(),
  tagline: z.string(),
  kind: sectionKindSchema,
  /** Default ink as a hex colour; the edition's colourway may override it. */
  colour: z.string().regex(/^#[0-9a-f]{6}$/i),
  voice: sectionVoiceSchema,
});

export type Section = z.infer<typeof sectionSchema>;
export type SectionKind = z.infer<typeof sectionKindSchema>;
export type SectionVoice = z.infer<typeof sectionVoiceSchema>;
