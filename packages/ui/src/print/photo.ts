import "server-only";
import { readFileSync, readdirSync } from "node:fs";
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

// ——— Picture shapes ———
// A designer sizes a picture to its own shape: a portrait isn't forced into a letterbox. The shape
// is read once from the file itself (JPEG or PNG header) and remembered.

const aspects = new Map<string, number>();

/** Width over height of a JPEG or PNG, read from its header; null when it can't be read. */
function readAspect(buf: Buffer): number | null {
  if (buf[0] === 0x89 && buf.toString("latin1", 1, 4) === "PNG") {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    return w && h ? w / h : null;
  }
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1]!;
    // Start-of-frame markers carry the picture's size (not DHT, JPG or DAC).
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      const h = buf.readUInt16BE(i + 5);
      const w = buf.readUInt16BE(i + 7);
      return w && h ? w / h : null;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

/**
 * The picture's shape, width over height, measured from the file the paper prints (the pressed
 * copy or the edition's own). Pictures that can't be measured are taken as 3:2.
 */
export function imageAspect(url: string): number {
  const known = aspects.get(url);
  if (known) return known;
  const printed = printedPhoto(url);
  let ratio: number | null = null;
  if (printed.startsWith("/")) {
    try {
      ratio = readAspect(readFileSync(path.join(process.cwd(), "public", printed)));
    } catch {
      ratio = null;
    }
  }
  const out = ratio && Number.isFinite(ratio) ? ratio : 1.5;
  aspects.set(url, out);
  return out;
}
