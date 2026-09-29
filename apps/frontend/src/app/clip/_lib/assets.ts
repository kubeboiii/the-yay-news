// Paper, tape, wear and photographs for the clippings, as data URIs (Satori cannot read relative
// URLs). Local files are read once and kept; a photo that has not been pressed onto newsprint yet
// (they are gitignored) falls back to the Unsplash CDN, which Satori fetches itself.

import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { edition, type Story } from "@/app/mockups/_data/sample-edition";
import { type Photo, type PhotoKey, pick } from "@/app/mockups/_data/photos";

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

/** The pressed halftone print of a photo, or the CDN original. */
export function photoSrc(p: Photo, width = 1600): string {
  return (
    asset(`mockup/press/${p.id}.jpg`) ??
    `https://images.unsplash.com/${p.id}?w=${width}&q=80&auto=format&fit=crop`
  );
}

// Which photograph runs with which story. The picture editor's choice, not an algorithm.
const PICTURES: Record<string, { key: PhotoKey; n?: number; focus?: string }> = {
  "dancing-octopus": { key: "octopus", focus: "50% 40%" },
  "moonbeam-diner-musical": { key: "retroTv", focus: "50% 55%" },
  "village-choir-power-ballad": { key: "choir", focus: "50% 45%" },
  "bread-and-butter": { key: "bakeryCat", focus: "50% 35%" },
  "fishing-patch": { key: "fishing", focus: "50% 55%" },
  "pit-crew-dance": { key: "pitStop" },
  "six-into-fruit-bowl": { key: "cricket" },
  "birdsong-phones": { key: "songbird", focus: "50% 40%" },
  "fitted-sheet-robot": { key: "robot", focus: "50% 35%" },
  "pay-it-forward-cafe": { key: "coffee" },
  "tiny-wins-thread": { key: "stickyNotes" },
  "benches-with-views": { key: "bench", focus: "50% 60%" },
};

export type Picture = { src: string; alt: string; credit: string; focus: string };

export function pictureFor(story: Story): Picture | null {
  const choice = PICTURES[story.slug];
  if (!choice) return null;
  const p = pick(choice.key, choice.n);
  return { src: photoSrc(p), alt: p.alt, credit: p.credit, focus: choice.focus ?? "50% 50%" };
}

export const EDITION = {
  name: edition.name,
  tagline: edition.tagline,
  date: edition.date,
  shortDate: edition.date.replace(/^\w+, /, ""),
  volume: edition.volume,
  issue: edition.issue,
  price: edition.price,
};
