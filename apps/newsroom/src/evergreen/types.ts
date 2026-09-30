import type { EditionDesign, Feature } from "@repo/shared";

// The draft shape mirrors packages/db/prisma/seed-data/types.ts (SeedEdition), which is what the
// seed inserts. It is restated here because seed-data is not part of any package's exports; keep
// the two in step.

type WithoutOrder<T> = T extends unknown ? Omit<T, "order"> : never;

export type DraftFeature = WithoutOrder<Feature>;

export type DraftStory = {
  slug: string;
  section?: string;
  slot?: "lead" | "feature" | "brief";
  kicker: string;
  headline: string;
  dek: string;
  body: string[];
  readMinutes?: number;
  sticker?: string;
  source: string;
  sourceUrl?: string;
  reserve?: boolean;
};

/** A whole edition, ready to insert. The pipeline assigns `issueNumber` when it files it. */
export type EditionDraft = {
  issueNumber?: number;
  date: string;
  status: "draft" | "scheduled" | "published" | "pulled";
  kind: "regular" | "slow_news_day";
  design: EditionDesign;
  colourway: string;
  front: DraftStory[];
  inside: { section: string; stories: DraftStory[] }[];
  features: DraftFeature[];
};

/** One evergreen item in the bank. */
export type EvergreenItem = {
  slug: string;
  kicker: string;
  headline: string;
  dek: string;
  body: string[];
  sticker?: string;
};
