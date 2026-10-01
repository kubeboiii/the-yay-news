import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { type SiteData, longDate, shortDate } from "@/app/mockups/site-a/_shared/data";
import { torn } from "@/app/mockups/site-a/_shared/hand";
import { paletteVars } from "@/app/mockups/site-a/_shared/palette";

export type Place = "today" | "pile" | "wall";

const BASE = "/mockups/site-a";

/**
 * The world around the paper: a masthead strip torn off today's front page (in today's
 * colourway), three rubber-stamped ticket stubs for the only three places there are, and a
 * tear-off calendar block for jumping to another day's paper. On a phone the stubs move to a strip
 * along the bottom, under the thumb.
 */
export function Shell({
  data,
  place,
  note,
  scene,
  finished,
  children,
}: {
  /** Today's paper is finished (the run counts it). */
  finished?: boolean;
  data: SiteData;
  place: Place;
  /** The design rationale for this screen (a mockup annotation, not part of the design). */
  note: string;
  /** Which room the screen is in; sets the backdrop. */
  scene: "kiosk" | "desk" | "corner" | "bedroom";
  children: ReactNode;
}) {
  const { edition, palette } = data;
  const stamped = (finished ? data.streakDone : data.streak).current;
  const tickets: { id: Place; label: string; sub: string; href: string; ink: string }[] = [
    {
      id: "today",
      label: "Today",
      sub: `No. ${edition.issueNumber}`,
      href: `${BASE}/today`,
      ink: "l0",
    },
    {
      id: "pile",
      label: "Pile",
      sub: `${data.pile.length} papers`,
      href: `${BASE}/pile`,
      ink: "l2",
    },
    { id: "wall", label: "Wall", sub: `${stamped}-day run`, href: `${BASE}/wall`, ink: "l3" },
  ];
  return (
    <div className={`sa sa--${scene}`} style={paletteVars(palette, "sa") as CSSProperties}>
      <a className="sa-skip" href="#main">
        Skip to the page
      </a>
      <p className="sa-note">
        <Link href={BASE}>A · Paperboy&rsquo;s World</Link>
        <span>{note}</span>
      </p>
      <header className="sa-strip">
        <div className="sa-strip__paper" style={{ clipPath: torn("strip", ["bottom"], 9, 70) }} />
        <div className="sa-strip__band" aria-hidden />
        <div className="sa-strip__row">
          <Link href={`${BASE}/today`} className="sa-mast">
            <span className="sa-mast__name">The Yay News</span>
            <span className="sa-mast__line">
              No. {edition.issueNumber} · {longDate(edition.date)} · only good news
            </span>
          </Link>
          <CalendarBlock data={data} />
          <nav className="sa-tickets" aria-label="Main">
            <ul>
              {tickets.map((t, i) => (
                <li
                  key={t.id}
                  style={
                    {
                      "--tk": `var(--sa-${t.ink})`,
                      "--tilt": `${[-2, 1.5, -1][i]}deg`,
                    } as CSSProperties
                  }
                >
                  <Link
                    href={t.href}
                    className="sa-ticket"
                    aria-current={place === t.id ? "page" : undefined}
                  >
                    <span className="sa-ticket__stub" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="sa-ticket__label">{t.label}</span>
                    <span className="sa-ticket__sub">{t.sub}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="sa-main">
        {children}
      </main>
    </div>
  );
}

/** A tear-off desk calendar: today's date on the block; open it to tear back to another day. */
function CalendarBlock({ data }: { data: SiteData }) {
  const d = new Date(`${data.edition.date}T00:00:00Z`);
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  const wd = d.toLocaleString("en-GB", { weekday: "long", timeZone: "UTC" });
  return (
    <details className="sa-cal">
      <summary aria-label={`Paper for ${longDate(data.edition.date)}. Choose another day`}>
        <span className="sa-cal__rings" aria-hidden />
        <span className="sa-cal__month">{month}</span>
        <span className="sa-cal__day">{d.getUTCDate()}</span>
        <span className="sa-cal__wd">{wd}</span>
        <span className="sa-cal__under" aria-hidden />
      </summary>
      <div className="sa-cal__sheet">
        <p className="sa-cal__title">Tear back to…</p>
        <ul>
          {data.pile.map((p) => (
            <li key={p.issueNumber}>
              <Link href={`${BASE}/today?issue=${p.issueNumber}`}>
                <span>{shortDate(p.date)}</span>
                <span>No. {p.issueNumber}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
