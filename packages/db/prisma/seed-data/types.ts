import type { EditionDesign, Feature, SolvedPuzzle } from "@repo/shared";
import type { PhotoKey } from "./photos.ts";
import type { SectionSlug } from "./sections.ts";

type WithoutOrder<T> = T extends unknown ? Omit<T, "order"> : never;

/** A recurring feature; its order among features of the same type is its position in the list. */
export type SeedFeature = WithoutOrder<Feature>;
export type SeedPuzzle = WithoutOrder<SolvedPuzzle>;

export type SeedStory = {
  slug: string;
  /** Defaults to the page's section. Required on the front page. */
  section?: SectionSlug;
  /** Defaults to "lead" on the front page, "feature" for a page's first story, else "brief". */
  slot?: "lead" | "feature" | "brief";
  kicker: string;
  headline: string;
  dek: string;
  body: string[];
  /** Defaults to one minute per 200 words, at least one. */
  readMinutes?: number;
  sticker?: string;
  /** Name of the source. */
  source: string;
  /** The real article this story is based on; without one, a sample URL under example.com. */
  sourceUrl?: string;
  /** A photo from the shared Unsplash pool (photos.ts)… */
  photo?: PhotoKey | [PhotoKey, number];
  /**
   * …or an image fetched for this story with apps/frontend/scripts/fetch_image.py, which saves a
   * pressed copy under apps/frontend/public/editions/. `file` is its site path; `from` is the page
   * the image came from.
   */
  image?: { file: string; alt: string; credit: string; from: string };
  embedUrl?: string;
  reserve?: boolean;
};

export type SeedEdition = {
  issueNumber: number;
  date: string;
  status: "draft" | "scheduled" | "published" | "pulled";
  kind?: "regular" | "slow_news_day";
  design: EditionDesign;
  colourway: string;
  /** Front page: the lead (and anything else that runs there). */
  front: SeedStory[];
  /** Inside pages in order. A page in a guest section makes it the edition's guest section. */
  inside: { section: SectionSlug; stories: SeedStory[] }[];
  /** Front-page and back-page features. */
  features: SeedFeature[];
  puzzles: SeedPuzzle[];
};
