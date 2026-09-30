import {
  sections as SECTION_LIST,
  dailySections,
  type SectionSlug as SeedSectionSlug,
  weekendSections,
} from "@repo/db/sections";
import type { EditionDesign, Feature, Image, SolvedPuzzle, StorySlot } from "@repo/shared";

/** A section slug (PLAN §4): the list itself lives with the seed data. */
export type SectionSlug = SeedSectionSlug;

/** The daily sections, in print order: every edition runs a page for each (PLAN §6). */
export const CORE_SECTIONS: readonly SectionSlug[] = dailySections.map((s) => s.slug);

/** Saturday's "The Big Weekend" and Sunday's "The Scrapbook" lineups, in print order. */
export const WEEKEND_SECTIONS = {
  saturday: weekendSections("saturday").map((s) => s.slug) as readonly SectionSlug[],
  sunday: weekendSections("sunday").map((s) => s.slug) as readonly SectionSlug[],
};

/** Weekend pages built from the past week's editions rather than from today's sources. */
export const FROM_THE_WEEK: readonly SectionSlug[] = ["week-in-10", "photo-album", "hall-of-fame"];

/** The rotating guest sections: two a day, each once per cycle (plan.ts). */
export const GUEST_SECTIONS: readonly SectionSlug[] = SECTION_LIST.filter(
  (s) => s.kind === "guest",
).map((s) => s.slug);

export type SourceKind = "rss" | "reddit" | "api";

/** One allowlisted source (the allowlist is data: see sources.ts). */
export type SourceDef = {
  slug: string;
  name: string;
  url: string;
  type: SourceKind;
  sections: SectionSlug[];
  /**
   * For `api` sources, which adapter reads the response. `scrape` reads a listing page (the
   * Source table has no "scrape" type, so scraped pages are stored as `api`); `hn-algolia` reads
   * the Hacker News front page.
   */
  adapter?: "nasa-apod" | "spaceflight-news" | "wikipedia-onthisday" | "scrape" | "hn-algolia";
  /**
   * A regular expression (as a string, so the allowlist stays data). For feeds, only items whose
   * link matches are kept; for `scrape`, the links on the listing page that are articles.
   */
  linkPattern?: string;
  /** Items older than this are skipped (default 96 hours). Evergreen fact sites use more. */
  maxAgeHours?: number;
  /** Most items to take from this source (default: the gather stage's `perSource`). */
  perSource?: number;
  /**
   * The article page is paywalled or blocks fetching: write from the feed summary, and from other
   * outlets' text on the same story when the summary is short.
   */
  paywalled?: boolean;
  /** Fetch with a browser-like user agent (some sites refuse unknown bots outright). */
  browserAgent?: boolean;
};

/** One picture found for a candidate, best first. */
export type CandidateImage = { url: string; credit: string | null; alt: string | null };

/** An item found by the gather stage. */
export type Candidate = {
  /** Stable within a run: used to refer to the item in batched model calls. */
  id: string;
  sourceSlug: string;
  sourceName: string;
  sourceSections: SectionSlug[];
  url: string;
  title: string;
  summary: string;
  /** The fetched article text: the only thing a brief may be written from. */
  text: string;
  imageUrl: string | null;
  imageCredit: string | null;
  /** Every usable picture found (feed, og:image, in-article), best first; imageUrl is the first. */
  images?: CandidateImage[];
  /** From a paywalled source: the text may be only the feed summary. */
  paywalled?: boolean;
  /** Found on a listing page: title, summary and date come from the article page. */
  scraped?: boolean;
  /** The source's freshness limit, re-checked once a scraped article's date is known. */
  maxAgeHours?: number;
  /**
   * Pictures already printed with the story this item retells (the weekend's Week in 10, Photo
   * Album and Hall of Fame): used as they are instead of pressing new ones.
   */
  presetImages?: Image[];
  /** Licence of the image when the source states one (e.g. NASA public domain). */
  imageLicence: { licence: string; licenceUrl: string } | null;
  embedUrl: string | null;
  publishedAt: Date | null;
  fetchedAt: Date;
};

/** A candidate that passed the delight check, with what the classifier said about it. */
export type Classified = Candidate & {
  section: SectionSlug;
  /** A short topic tag ("ai", "space", "cats"…) for the balance rules. */
  topic: string;
  /** The beat within the section (data/beats.json), for variety and rotation. */
  beat: string;
  /** 1–10: how delightful, and how good a lead it would make. */
  score: number;
  reason: string;
};

export type Decision =
  | "pending"
  | "rejected_blocklist"
  | "rejected_delight"
  | "duplicate"
  | "not_selected"
  | "selected"
  | "reserve"
  | "failed_fact_check"
  | "published";

/** What the run log records for each candidate. */
export type CandidateRecord = {
  candidate: Candidate;
  decision: Decision;
  reason: string | null;
  stage: string | null;
  section: SectionSlug | null;
  storySlug: string | null;
};

/** A story slot chosen by the select stage, before it is written. */
export type Assignment = {
  candidate: Classified;
  /** Page key: "front" or a section slug. */
  page: "front" | SectionSlug;
  slot: StorySlot;
  reserve: boolean;
  /** The first story on an inside page (written at main length when the source allows). */
  main?: boolean;
};

export type DraftStory = {
  slug: string;
  slot: StorySlot;
  section: SectionSlug;
  kicker: string;
  headline: string;
  dek: string;
  body: string[];
  readMinutes: number;
  sticker: string | null;
  sourceUrl: string;
  sourceName: string;
  embedUrl: string | null;
  images: Image[];
  isReserve: boolean;
  /** The candidate the story was written from (absent for evergreen items). */
  candidateId?: string;
  /** The beat the story came from (data/beats.json), logged for beat rotation. */
  beat?: string;
};

export type DraftPage = {
  order: number;
  layout: "front" | "section" | "guest" | "back";
  section: SectionSlug | null;
  /** Reserves ride along on their section's page, after the served stories. */
  stories: DraftStory[];
};

/** A finished edition, ready to validate and write. The Slow News Day builder returns one too. */
export type EditionDraft = {
  date: string;
  issueNumber: number;
  volume: number;
  status: "draft" | "scheduled" | "published";
  kind: "regular" | "slow_news_day";
  design: EditionDesign;
  colourway: string;
  guestSection: SectionSlug | null;
  pages: DraftPage[];
  features: Feature[];
  puzzles: SolvedPuzzle[];
};

/** One line of the run log (PipelineRun.log). */
export type LogEntry = {
  at: string;
  stage: string;
  level: "info" | "warn" | "error";
  message: string;
  data?: unknown;
};
