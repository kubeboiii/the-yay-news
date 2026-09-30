// Stage 6: pictures. The story's own source image is used (the editor permits it), pressed onto
// newsprint by the frontend's press script and saved under apps/frontend/public/editions/<issue>/,
// always with a credit and a licence recorded. No picture is used twice in an edition; a story
// without a usable picture gets the typographic treatment (no image).
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import type { Image } from "@repo/shared";
import type { Candidate, CandidateImage } from "../types.ts";
import { fullSize, imageKey, unusableImage } from "./gather.ts";

const run = promisify(execFile);

export const FRONTEND_ROOT = path.resolve(import.meta.dirname, "../../../frontend");

/**
 * Downloads `url` and returns the site path of the pressed copy, or null if it could not (or it is
 * narrower than `minWidth`).
 */
export type Presser = (
  url: string,
  issue: number,
  slug: string,
  minWidth?: number,
) => Promise<string | null>;

/** apps/frontend/scripts/fetch_image.py: download, press onto newsprint, save at 1200px. */
export const pressWithPython: Presser = async (url, issue, slug, minWidth) => {
  try {
    const { stdout } = await run(
      "python3",
      [
        path.join(FRONTEND_ROOT, "scripts/fetch_image.py"),
        url,
        String(issue),
        slug,
        ...(minWidth ? [String(minWidth)] : []),
      ],
      { timeout: 90_000 },
    );
    const site = stdout.trim().split("\n").at(-1) ?? "";
    return site.startsWith("/editions/") ? site : null;
  } catch {
    return null;
  }
};

/** Leaves the picture where it is (dry runs). */
export const noPress: Presser = async (url) => url;

/**
 * Pictures per story. The aim is many stories with a picture, not many pictures per story: every
 * story (briefs included) gets one; only the front-page lead (3) and the first front feature (2)
 * may carry extras.
 */
export const PICTURES = { lead: 3, frontFeature: 2, story: 1 } as const;
/** A story's first picture may be a little narrower than its extras, so most stories get one. */
export const MIN_WIDTH = { first: 600, extra: 800 } as const;

export type Picture = { images: Image[]; note: string };

export type IllustrateItem = {
  slug: string;
  headline: string;
  candidate: Candidate;
  /** How many pictures the story may carry. */
  max?: number;
};

/** The candidate's pictures, best first, deduplicated, with the legacy single image included. */
export function picturesOf(c: Candidate): CandidateImage[] {
  const list: CandidateImage[] = [
    ...(c.imageUrl ? [{ url: c.imageUrl, credit: c.imageCredit, alt: null }] : []),
    ...(c.images ?? []),
  ];
  const seen = new Set<string>();
  return list.filter((i) => {
    const k = imageKey(i.url);
    if (seen.has(k) || unusableImage(i.url)) return false;
    seen.add(k);
    return true;
  });
}

export async function illustrate(
  stories: IllustrateItem[],
  { issue, press, used = new Set<string>() }: { issue: number; press: Presser; used?: Set<string> },
): Promise<Map<string, Picture>> {
  const got = new Map<string, Image[]>();
  const stats = new Map<string, { reused: number; failed: number }>();
  const tried = new Map<string, Set<string>>();

  const addOne = async (s: IllustrateItem) => {
    const c = s.candidate;
    const images = got.get(s.slug) ?? [];
    const st = stats.get(s.slug) ?? { reused: 0, failed: 0 };
    const seen = tried.get(s.slug) ?? new Set<string>();
    got.set(s.slug, images);
    stats.set(s.slug, st);
    tried.set(s.slug, seen);
    for (const option of picturesOf(c)) {
      const key = imageKey(option.url);
      if (seen.has(key)) continue;
      if (seen.size >= 6) break;
      seen.add(key);
      if (used.has(key)) {
        st.reused++;
        continue;
      }
      const name = images.length ? `${s.slug}-${images.length + 1}` : s.slug;
      // The full-size copy first (feeds carry thumbnails); the URL as found if that fails.
      const minW = images.length ? MIN_WIDTH.extra : MIN_WIDTH.first;
      const big = fullSize(option.url);
      const url =
        (big !== option.url ? await press(big, issue, name, minW) : null) ??
        (await press(option.url, issue, name, minW));
      if (!url) {
        st.failed++;
        continue;
      }
      used.add(key);
      const licence =
        images.length === 0 && c.imageLicence
          ? c.imageLicence
          : { licence: "Credited to its source", licenceUrl: c.url };
      images.push({
        url,
        alt: option.alt ?? `Picture accompanying “${s.headline}”`,
        credit: option.credit ?? (images.length === 0 ? c.imageCredit : null) ?? c.sourceName,
        kind: "photo",
        ...licence,
      });
      return true;
    }
    return false;
  };

  // Pass 1: one picture for every story, in page order. Pass 2: extras for the few allowed them.
  for (const s of stories) await addOne(s);
  for (const s of stories) {
    while ((got.get(s.slug)?.length ?? 0) < (s.max ?? 1)) if (!(await addOne(s))) break;
  }

  const out = new Map<string, Picture>();
  for (const s of stories) {
    const images = got.get(s.slug) ?? [];
    const st = stats.get(s.slug)!;
    const why = [
      st.reused ? `${st.reused} already used in this edition` : "",
      st.failed ? `${st.failed} too small or failed to download` : "",
    ]
      .filter(Boolean)
      .join(", ");
    out.set(s.slug, {
      images,
      note: picturesOf(s.candidate).length
        ? `${images.length} picture(s) from ${s.candidate.sourceName}${why ? ` (${why})` : ""}`
        : "no usable source image",
    });
  }
  return out;
}
