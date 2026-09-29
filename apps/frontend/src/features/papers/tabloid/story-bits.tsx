import type { StoryItem } from "@repo/shared";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Mark } from "@/features/print/mark";
import { host, sentence } from "./edition-data";
import { Bars, fit, Photo, Sticker, Stamp } from "./parts";

// Pieces of a story as the tabloid prints them, shared by the front, the inside pages and the
// guest section.

export const fs = (u: number) =>
  ({ fontSize: `calc(var(--u) * ${u.toFixed(2)})` }) as CSSProperties;

/** The big outline word printed across a plate of ink, sized to its plate on desk and phone. */
export function PlateWord({ text, measure }: { text: string; measure: number }) {
  const upper = text.toUpperCase();
  const size = (m: number, max: number) =>
    fit(upper, { max, min: 8, measure: m, lines: 2, em: 0.7 }).toFixed(2);
  return (
    <span
      className="tb-plate-word"
      aria-hidden
      style={{ "--pw": size(measure, 34), "--pw-phone": size(136, 30) } as CSSProperties}
    >
      {text}
    </span>
  );
}

/** The splash headline, sized so even a long one sits in three lines on the photograph. */
export function splashSize(headline: string, measure: number, max = 11.5, lines = 3) {
  return fit(headline.toUpperCase(), { max, min: 6.5, measure, lines, em: 0.64 });
}

/**
 * The top of a page: the story's photograph run big, with its sticker and the headline printed
 * on it; or, with no photograph, a solid plate of the second ink with the headline set larger.
 */
export function Splash({
  story,
  href,
  className,
  bleed,
  measure,
  priority,
  note,
  stamp,
  children,
}: {
  story: StoryItem;
  href: string;
  className?: string;
  bleed?: boolean;
  /** The headline's measure on the sheet, in mm. */
  measure: number;
  priority?: boolean;
  /** A pencilled editor's note on the art. */
  note?: string;
  stamp?: ReactNode;
  children?: ReactNode;
}) {
  const image = story.images[0];
  const head = (
    <div className="tb-onphoto">
      <p className="tb-kicker">{story.kicker}:</p>
      <h2
        className="tb-splash"
        style={fs(
          image ? splashSize(story.headline, measure) : splashSize(story.headline, measure, 16, 4),
        )}
      >
        <Link href={href}>
          <Bars className={image ? "tb-bars--over" : "tb-bars--plate"}>{story.headline}</Bars>
        </Link>
      </h2>
      {image ? null : <p className="tb-plate-dek">{story.dek}</p>}
    </div>
  );
  const extras = (
    <>
      {story.sticker ? (
        <Sticker text={story.sticker} plate={image ? "b" : "a"} className="tb-splash-sticker" />
      ) : null}
      {note ? (
        <>
          <p className="tb-note tb-splash-note" aria-hidden>
            {note}
          </p>
          <Mark name="stars-06" ink="var(--a)" className="tb-mark tb-splash-sparks" />
        </>
      ) : null}
      {stamp ? <Stamp className="tb-splash-stamp">{stamp}</Stamp> : null}
      {children}
    </>
  );
  const cls = `tb-grow tb-splash-art ${bleed ? "tb-bleed" : ""} ${className ?? ""}`;
  if (!image) {
    return (
      <div className={`tb-plate ${cls}`}>
        <PlateWord text={story.kicker} measure={bleed ? 250 : 228} />
        <Mark name="doodles-02" ink="var(--a)" className="tb-mark tb-plate-star" />
        {extras}
        {head}
      </div>
    );
  }
  return (
    <Photo
      image={image}
      sizes={bleed ? "(max-width: 760px) 100vw, 1100px" : "(max-width: 760px) 100vw, 1000px"}
      className={`${cls} tb-photo--open`}
      position="50% 45%"
      priority={priority}
    >
      {extras}
      {head}
    </Photo>
  );
}

/** "Source: Hollowmere Herald" with a link to the original. */
export function Source({ story, extra }: { story: StoryItem; extra?: string }) {
  return (
    <p className="tb-source">
      Source:{" "}
      <a href={story.sourceUrl} rel="noopener noreferrer" target="_blank">
        {story.sourceName || host(story.sourceUrl)}
      </a>
      {extra ? ` · ${extra}` : null}
    </p>
  );
}

/** The jump to a story's own page, set like a tabloid's "continued" line. */
export function Jump({ href, children }: { href: string; children?: ReactNode }) {
  return (
    <p className="tb-jump">
      <Link href={href}>
        {children ?? "The whole story"}, <b>on its own page →</b>
      </Link>
    </p>
  );
}

/** The first line of a story's body that someone said out loud, for a pull quote. */
export function pullQuote(stories: StoryItem[]): { text: string; by: string } | null {
  for (const s of stories) {
    for (const para of s.body) {
      const m = /[“"]([^”"]{24,150})[”"](?:,)?\s+(?:said|says|added)\s+([^.,]{3,60})/.exec(para);
      if (m) return { text: sentence(m[1]!.replace(/[,]$/, "")), by: m[2]! };
      const q = /[“"]([^”"]{30,150})[”"]/.exec(para);
      if (q) return { text: sentence(q[1]!.replace(/[,]$/, "")), by: "" };
    }
  }
  return null;
}
