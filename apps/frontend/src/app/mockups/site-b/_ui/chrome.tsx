import Link from "next/link";
import type { ReactNode } from "react";
import { type SiteData, shortDate } from "@/app/mockups/site-a/_shared/data";
import { CutNav, type CutNavItem, RiotTheme, riotInks } from "@/features/riot";

export type Place = "today" | "pile" | "wall";

export const B = "/mockups/site-b";

/** The day's two plates, from the edition's design and the colourway being previewed. */
export const inksOf = (data: SiteData) =>
  riotInks({ design: data.edition.design, colourway: data.palette.slug });

/**
 * A plain paper masthead: the name set once in the condensed face, the date as metadata, and the
 * three places as slips cut from the same sheet, the one you're on ringed in marker. On a phone
 * the slips are stuck to a strip of black tape along the bottom.
 */
export function Shell({
  data,
  place,
  note,
  finished,
  children,
}: {
  data: SiteData;
  place: Place;
  note: string;
  finished?: boolean;
  children: ReactNode;
}) {
  const { edition } = data;
  const run = (finished ? data.streakDone : data.streak).current;
  const items: CutNavItem[] = [
    { id: "today", label: "Today", sub: `No. ${edition.issueNumber}`, href: `${B}/today` },
    { id: "pile", label: "Pile", sub: `${data.pile.length} back issues`, href: `${B}/pile` },
    { id: "wall", label: "Wall", sub: `${run}-day run`, href: `${B}/wall` },
  ];
  return (
    <RiotTheme inks={inksOf(data)} className="sb">
      <a className="sb-skip" href="#main">
        Skip to the page
      </a>
      <p className="sb-note">
        <Link href={B}>B · Riso Zine Riot</Link>
        <span>{note}</span>
      </p>
      <header className="sb-top">
        <div className="sb-top__row">
          <Link href={`${B}/today`} className="sb-logo" aria-label="The Yay News, today">
            <span className="sb-logo__the" aria-hidden>
              The
            </span>
            <span className="sb-logo__name" aria-hidden>
              Yay News
            </span>
          </Link>
          <p className="sb-date rt-meta">
            {shortDate(edition.date)} · No. {edition.issueNumber}
          </p>
          <CutNav items={items} active={place} className="sb-nav" />
        </div>
      </header>
      <main id="main" className="sb-main">
        {children}
      </main>
    </RiotTheme>
  );
}
