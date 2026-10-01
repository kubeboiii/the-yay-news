import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { type SiteData, shortDate } from "@/app/mockups/site-a/_shared/data";
import { paletteVars } from "@/app/mockups/site-a/_shared/palette";
import { Pip } from "@/app/mockups/site-a/_shared/pip";
import { TOON_PIP } from "./comic";
import { GlyphPile, GlyphToday, GlyphWall } from "./glyphs";

export type Place = "today" | "pile" | "wall";
export const C = "/mockups/site-c";

/**
 * A Saturday-morning title card: the name in fat inked letters on a sunburst, and three big
 * chunky buttons. Pip peeks over the one you're on, so "you are here" is a character, not a line.
 * On a phone the buttons sit in a tray along the bottom.
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
  const { edition, palette } = data;
  const run = (finished ? data.streakDone : data.streak).current;
  const items = [
    {
      id: "today" as const,
      label: "Today",
      sub: `No. ${edition.issueNumber}`,
      Glyph: GlyphToday,
      ink: "l0",
    },
    {
      id: "pile" as const,
      label: "Pile",
      sub: `${data.pile.length} papers`,
      Glyph: GlyphPile,
      ink: "l2",
    },
    { id: "wall" as const, label: "Wall", sub: `${run}-day run`, Glyph: GlyphWall, ink: "l4" },
  ];
  return (
    <div className="sc" style={paletteVars(palette, "sc") as CSSProperties}>
      <a className="sc-skip" href="#main">
        Skip to the page
      </a>
      <p className="sc-note">
        <Link href={C}>C · Saturday Cartoon</Link>
        <span>{note}</span>
      </p>
      <header className="sc-top">
        <div className="sc-top__row">
          <Link href={`${C}/today`} className="sc-logo">
            <span className="sc-logo__burst" aria-hidden />
            <span className="sc-logo__the">The</span>
            <span className="sc-logo__name">Yay News</span>
          </Link>
          <p className="sc-top__date">
            {shortDate(edition.date)}
            <span>episode {edition.issueNumber}</span>
          </p>
          <nav className="sc-nav" aria-label="Main">
            <ul>
              {items.map((it) => (
                <li key={it.id}>
                  <Link
                    href={`${C}/${it.id}`}
                    className="sc-navbtn"
                    aria-current={place === it.id ? "page" : undefined}
                    style={{ "--nb": `var(--sc-${it.ink})` } as CSSProperties}
                  >
                    {place === it.id ? (
                      <span className="sc-navbtn__peek" aria-hidden>
                        <Pip pose="stand" look="toon" inks={TOON_PIP} label="" />
                      </span>
                    ) : null}
                    <it.Glyph />
                    <span className="sc-navbtn__text">
                      <span className="sc-navbtn__label">{it.label}</span>
                      <span className="sc-navbtn__sub">{it.sub}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="sc-main">
        {children}
      </main>
    </div>
  );
}
