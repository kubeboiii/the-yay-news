import type { ReaderQuery } from "@repo/shared";
import { env } from "../../config/env.js";
import { resolveTimeZone } from "./release.js";

/** Who is reading and when, which decides the editions they may see. */
export type Reader = {
  timeZone: string;
  now: Date;
  /** True when `now` was overridden for a preview; such responses must not be cached. */
  preview: boolean;
};

export const TIME_ZONE_HEADER = "x-timezone";

/**
 * The reader's zone comes from `?tz=`, then the `x-timezone` header, and falls back to UTC when
 * missing or unknown. `?now=` overrides the clock outside production only.
 */
export function readerFrom(query: ReaderQuery, timeZoneHeader: string | undefined): Reader {
  const preview = env.NODE_ENV !== "production" && query.now !== undefined;
  return {
    timeZone: resolveTimeZone(query.tz ?? timeZoneHeader),
    now: preview ? new Date(query.now as string) : new Date(),
    preview,
  };
}
