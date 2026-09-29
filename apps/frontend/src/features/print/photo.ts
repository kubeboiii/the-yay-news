import "server-only";
import { readdirSync } from "node:fs";
import path from "node:path";

// Photos run through scripts/press_photos.py are printed onto newsprint (halftone screen, lifted
// blacks) and served from public/mockup/press. Anything not pressed yet falls back to the live CDN.
const pressed = new Set(
  (() => {
    try {
      return readdirSync(path.join(process.cwd(), "public/mockup/press"));
    } catch {
      return [];
    }
  })(),
);

const UNSPLASH = /^https:\/\/images\.unsplash\.com\/(photo-[\w-]+)/;

/**
 * The URL to print an edition image from: the newsprint-pressed copy when there is one, otherwise
 * the original at `width` (Unsplash URLs get a resized, cropped rendition).
 */
export function printedPhoto(url: string, width = 1600): string {
  const id = UNSPLASH.exec(url)?.[1];
  if (!id) return url;
  return pressed.has(`${id}.jpg`)
    ? `/mockup/press/${id}.jpg`
    : `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`;
}
