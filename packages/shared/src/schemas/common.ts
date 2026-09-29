import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase words separated by hyphens");

/** A calendar date, `YYYY-MM-DD`. Editions are keyed by date, not by instant. */
export const calendarDateSchema = z.iso.date();

export type CalendarDate = z.infer<typeof calendarDateSchema>;
