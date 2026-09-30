import type { Edition, Feature, Image as EditionImage } from "@repo/shared";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { printedPhoto } from "@repo/ui/print/photo";
import { FillPlates } from "../plates";
import type { PageLink, Reading, StoryItem } from "../types";

// Shared furniture for the Midi Magazine: dates, folios, photographs, page numbers and the few
// derived bits of copy (pull quotes, grounds) every template uses.

// ——— Dates. `date` is a calendar date, so it is always formatted in UTC. ———

const at = (date: string) => new Date(`${date}T00:00:00Z`);
const part = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...options }).format(at(date));

/** "Sunday 27 September 2026" */
export const longDate = (date: string) =>
  `${part(date, { weekday: "long" })} ${part(date, { day: "numeric" })} ${part(date, { month: "long" })} ${part(date, { year: "numeric" })}`;

/** "Sun 27 Sep 2026" */
export const shortDate = (date: string) =>
  `${part(date, { weekday: "short" })} ${part(date, { day: "numeric" })} ${part(date, { month: "long" }).slice(0, 3)} ${part(date, { year: "numeric" })}`;

export const weekday = (date: string) => part(date, { weekday: "long" });

// ——— Page numbers ———
//
// The front route prints the cover (page 1) and the opening spread (pages 2–3); every other route
// prints one two-page spread starting on an even, left-hand page, so the reading order's n-th
// page (0-based) opens on page 2n + 2: Tech 4–5, Startups 6–7, and so on.

export const pageNumber = (index: number) => (index <= 0 ? 1 : 2 * index + 2);

export const pageNumberOf = (reading: Reading, link: PageLink) =>
  pageNumber(reading.pages.indexOf(link));

/** The two page numbers printed on the current route's spread. */
export function spreadNumbers(reading: Reading): [number, number] {
  const i = reading.pages.indexOf(reading.current);
  return i <= 0 ? [2, 3] : [pageNumber(i), pageNumber(i) + 1];
}

// ——— Running heads and folios ———

/** Running head and page number, placed like a magazine: even pages left, odd pages right. */
export function Folio({
  page,
  section,
  date,
  top,
}: {
  page: number;
  section: string;
  date: string;
  top?: string;
}) {
  const side = page % 2 === 0 ? "m5-folio--even" : "m5-folio--odd";
  return (
    <>
      <div className={`m5-runhead ${side}`} aria-hidden>
        {top ?? `The Yay News · ${section}`}
      </div>
      <div className={`m5-folio ${side}`}>
        <span className="m5-folio-num" aria-hidden>
          {String(page).padStart(2, "0")}
        </span>
        <span className="m5-folio-line">
          Page {page} · The Yay News · {shortDate(date)}
        </span>
      </div>
    </>
  );
}

// ——— Photographs ———

/**
 * The only picture credit the paper prints: for an image taken from a real article, one tiny line
 * on the story's own page. Pool and sample photographs are credited in their metadata only.
 */
export const articleCredit = (image: EditionImage) =>
  image.licence === "Credited to its source" && image.credit ? `Image: ${image.credit}` : null;

/** A photograph printed onto the sheet, cropped by its frame. */
export function PrintPhoto({
  image,
  sizes,
  className,
  priority,
  position,
  children,
  plates,
}: {
  image: EditionImage;
  sizes: string;
  className?: string;
  priority?: boolean;
  position?: string;
  children?: ReactNode;
  /** A story with more than one picture prints them all, as a group, in this photo's place. */
  plates?: Pick<StoryItem, "slug" | "images">;
}) {
  if (plates && plates.images.length > 1) {
    return (
      <div className={`m5-photo m5-photo--plates ${className ?? ""}`}>
        <FillPlates story={plates} sizes={sizes} priority={priority} />
        {children}
      </div>
    );
  }
  return (
    <div className={`m5-photo ${className ?? ""}`}>
      <Image
        src={printedPhoto(image.url, 1600)}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="print-photo m5-photo-img"
        style={position ? { objectPosition: position } : undefined}
      />
      {children}
    </div>
  );
}

// ——— Stories ———

const SLOT_RANK = { lead: 0, feature: 1, brief: 2 } as const;

/** A page's stories, most important first. */
export const ranked = (stories: StoryItem[]) =>
  [...stories].sort((a, b) => SLOT_RANK[a.slot] - SLOT_RANK[b.slot] || a.order - b.order);

/** A sentence someone said, lifted out of the body for a pull quote, if the story has one. */
export function pullQuote(body: string[]): string | null {
  for (const p of body) {
    for (const m of p.matchAll(/[“"]([^”"]{30,130})[”"]/g)) {
      const said = m[1]!.trim().replace(/[,;:]$/, ".");
      if (said.split(" ").length >= 6) return /[.!?…]$/.test(said) ? said : `${said}.`;
    }
  }
  return null;
}

export const readMinutes = (stories: StoryItem[]) => stories.reduce((n, s) => n + s.readMinutes, 0);

export const minutes = (n: number) => `${n} minute${n === 1 ? "" : "s"}`;

/** Headline size class by length, so a long headline steps down rather than overflowing. */
export const lengthClass = (text: string, steps: [number, number, number]) =>
  text.length <= steps[0]
    ? "m5-len-s"
    : text.length <= steps[1]
      ? "m5-len-m"
      : text.length <= steps[2]
        ? "m5-len-l"
        : "m5-len-xl";

/** Passes a text length to CSS, for type that must fit a fixed measure. */
export const lenStyle = (text: string) => ({ "--len": Math.max(text.length, 1) }) as CSSProperties;

// ——— Features ———

export function features<T extends Feature["type"]>(edition: Edition, type: T) {
  return edition.features
    .filter((f): f is Extract<Feature, { type: T }> => f.type === type)
    .sort((a, b) => a.order - b.order)
    .map((f) => f.content as Extract<Feature, { type: T }>["content"]);
}

export const feature = <T extends Feature["type"]>(edition: Edition, type: T) =>
  features(edition, type)[0] ?? null;

// ——— Grounds: which pastel each section's opening page is printed on ———

export type Ground = "apricot" | "lilac" | "mint" | "blush" | "butter" | "powder";

const GROUNDS: Record<string, Ground> = {
  screen: "blush",
  play: "mint",
  startups: "powder",
  music: "apricot",
  sports: "butter",
  discoveries: "powder",
  tech: "lilac",
  money: "apricot",
  internet: "lilac",
};
const ROTATION: Ground[] = ["powder", "mint", "butter", "lilac", "apricot", "blush"];

export function groundFor(slug: string): Ground {
  const known = GROUNDS[slug];
  if (known) return known;
  const hash = [...slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return ROTATION[hash % ROTATION.length]!;
}

/** The first sentence of a sign-off, and the rest of it. */
export function splitSignOff(text: string): [string, string] {
  const m = /^(.+?[.!?])\s+(.+)$/.exec(text.trim());
  return m ? [m[1]!, m[2]!] : [text.trim(), ""];
}
