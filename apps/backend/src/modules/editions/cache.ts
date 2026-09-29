import type { Context } from "hono";
import { TIME_ZONE_HEADER, type Reader } from "./reader.js";

// A published edition never changes, so a given edition's responses cache well. What a reader may
// see depends on their timezone, though, so every edition response varies by it (a `?tz=` query is
// already part of the URL). Only successful responses are cached, so a 404 for an edition that
// isn't out yet doesn't outlive its release.

const POLICIES = {
  /** A specific released edition, story or archive page. */
  released: "public, max-age=300, s-maxage=3600",
  /** "Today" changes at 07:00 local time, so keep it short. */
  today: "public, max-age=60, s-maxage=60",
} as const;

export function setEditionCache(c: Context, policy: keyof typeof POLICIES, reader: Reader) {
  c.header("Cache-Control", reader.preview ? "no-store" : POLICIES[policy]);
  c.header("Vary", TIME_ZONE_HEADER, { append: true });
}
