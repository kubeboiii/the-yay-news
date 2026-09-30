import "server-only";
import { archiveListSchema, type EditionDesign, editionSchema, storySchema } from "@repo/shared";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ApiRequestError, apiGet } from "@/lib/api/client";
import { TZ_COOKIE } from "./timezone";

// Every read goes through the backend API, which decides what a reader may see: an edition is
// served once it is 07:00 on its date in the reader's timezone. The timezone comes from a cookie the
// browser sets on first visit (see timezone-cookie.tsx); until then the API assumes UTC.

const envelope = <T extends z.ZodType>(schema: T) => z.object({ data: schema });

/**
 * Outside production, `?now=` moves the clock so unreleased editions can be previewed, and
 * `?design=` prints any edition in another design (for testing a design against every edition).
 */
export type Preview = { now?: string; design?: EditionDesign };

async function readerQuery(preview: Preview) {
  const tz = (await cookies()).get(TZ_COOKIE)?.value;
  const query = new URLSearchParams();
  if (tz) query.set("tz", tz);
  if (preview.now && process.env.NODE_ENV !== "production") query.set("now", preview.now);
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

/** Fetches from the API, turning a 404 (unknown or not yet released) into Next's not-found page. */
async function read<T extends z.ZodType>(path: string, schema: T): Promise<z.infer<T>> {
  try {
    // Generic zod object inference loses the field type, so name it here; apiGet has validated it.
    const body = (await apiGet(path, envelope(schema))) as { data: z.infer<T> };
    return body.data;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error;
  }
}

export async function getToday(preview: Preview = {}) {
  return read(`/api/v1/editions/today${await readerQuery(preview)}`, editionSchema);
}

export async function getEdition(issue: number, preview: Preview = {}) {
  return read(`/api/v1/editions/${issue}${await readerQuery(preview)}`, editionSchema);
}

export async function getStory(issue: number, slug: string, preview: Preview = {}) {
  return read(
    `/api/v1/editions/${issue}/stories/${encodeURIComponent(slug)}${await readerQuery(preview)}`,
    storySchema,
  );
}

/** Back issues newest first, `limit` at a time (the API's default is 12, its most 50). */
export async function getArchive(cursor?: string, preview: Preview = {}, limit?: number) {
  const base = await readerQuery(preview);
  const extra = new URLSearchParams();
  if (cursor) extra.set("cursor", cursor);
  if (limit) extra.set("limit", String(limit));
  const more = extra.toString();
  return read(
    `/api/v1/editions${base}${more ? `${base ? "&" : "?"}${more}` : ""}`,
    archiveListSchema,
  );
}

/** Parses a route's issue segment; anything but a positive integer is not found. */
export function issueParam(value: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || String(n) !== value) notFound();
  return n;
}
