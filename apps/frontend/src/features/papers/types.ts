import type { Edition, EditionDesign, Story } from "@repo/shared";
import type { ComponentType, ReactNode } from "react";

// The contract every design (broadsheet, tabloid, zine, midi) implements. The reader routes fetch
// an edition from the API and hand one page of it to the edition's design; the design owns
// everything printed on the sheet, and the shell owns the chrome around it (page bar, share bar).

export type EditionPage = Edition["pages"][number];
export type StoryItem = EditionPage["stories"][number];

/** A page of the edition as a link: its URL segment, a label for navigation, and its href. */
export type PageLink = {
  order: number;
  /** URL segment: "" for the front page, "back" for the back page, else the section slug. */
  slug: string;
  label: string;
  href: string;
};

/** Where a page sits in its edition, with the links a design may print (folios, "turn to"). */
export type Reading = {
  pages: PageLink[];
  current: PageLink;
  prev: PageLink | null;
  next: PageLink | null;
  /** The page link for a section slug (for "inside today" indexes), if the edition has it. */
  pageFor: (sectionSlug: string) => PageLink | null;
  /** The URL of a story's own page. */
  storyHref: (slug: string) => string;
};

export type PageProps = { edition: Edition; page: EditionPage; reading: Reading };

export type StoryLinks = {
  edition: string;
  page: string;
  prev: { href: string; headline: string } | null;
  next: { href: string; headline: string } | null;
};

export type StoryProps = { data: Story; links: StoryLinks };

export type Paper = {
  design: EditionDesign;
  /**
   * Wraps every sheet of this design: fonts, stylesheets and the colourway. `colourway` is one of
   * the design's slugs (see @repo/shared COLOURWAYS).
   */
  Frame: ComponentType<{ colourway: string; children: ReactNode }>;
  Front: ComponentType<PageProps>;
  /** A core-section inside page. */
  Section: ComponentType<PageProps>;
  /** The rotating guest section's page. */
  Guest: ComponentType<PageProps>;
  Back: ComponentType<PageProps>;
  Story: ComponentType<StoryProps>;
};
