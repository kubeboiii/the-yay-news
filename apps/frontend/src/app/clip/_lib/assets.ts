// Paper, tape, wear and photographs for the clippings, as data URIs (Satori cannot read relative
// URLs). Local files are read once and kept; a photo that has not been pressed onto newsprint yet
// (they are gitignored) falls back to the Unsplash CDN, which Satori fetches itself.

import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const PUBLIC = path.join(process.cwd(), "public");
const uris = new Map<string, string>();

/** A file under public/ as a data URI, or null when it is not there. */
export function asset(rel: string): string | null {
  const hit = uris.get(rel);
  if (hit) return hit;
  const file = path.join(PUBLIC, rel);
  if (!existsSync(file)) return null;
  const type = rel.endsWith(".png") ? "image/png" : "image/jpeg";
  const uri = `data:${type};base64,${readFileSync(file).toString("base64")}`;
  uris.set(rel, uri);
  return uri;
}

/** An asset the clipping cannot do without. */
export function required(rel: string): string {
  const uri = asset(rel);
  if (!uri) throw new Error(`Missing clipping asset public/${rel}`);
  return uri;
}

const UNSPLASH = /^https:\/\/images\.unsplash\.com\/(photo-[\w-]+)/;

/**
 * The pressed halftone print of a photo (the same copy the reader prints, see
 * @repo/ui/print/photo.ts), or the CDN original for an Unsplash photo that has not been pressed.
 * Any other URL is used as it is; Satori fetches it.
 */
export function photoSrc(url: string, width = 1600): string {
  // A story image fetched into public/ (e.g. /editions/42/octopus.jpg), already pressed.
  if (url.startsWith("/")) return asset(url.slice(1)) ?? url;
  const id = UNSPLASH.exec(url)?.[1] ?? (/^photo-[\w-]+$/.test(url) ? url : null);
  if (!id) return url;
  return (
    asset(`mockup/press/${id}.jpg`) ??
    `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`
  );
}

/** A photograph as a clipping prints it: where it comes from, its credit line and focal point. */
export type Picture = { src: string; alt: string; credit: string; focus: string };
