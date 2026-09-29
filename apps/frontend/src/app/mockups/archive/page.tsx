import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  Alfa_Slab_One,
  Bodoni_Moda,
  Courier_Prime,
  League_Gothic,
  Libre_Caslon_Text,
  Libre_Franklin,
} from "next/font/google";
import { TODAY_ISSUE, ageInDays, seeded } from "@/app/mockups/_shared/edition-seed";
import { ageBackground, ageLook, agedPaper } from "@/app/mockups/_shared/life/age";
import "./archive.css";

// Each paper's own display face, so a back issue's spine reads as that paper.
const gothic = League_Gothic({ subsets: ["latin"], variable: "--ar-gothic" });
const franklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["500", "800", "900"],
  variable: "--ar-franklin",
});
const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--ar-slab" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--ar-bodoni" });
const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--ar-caslon",
});
const typewriter = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--ar-type",
});

export const metadata: Metadata = { title: "Back issues · Mockup" };

const PAPERS = [
  { slug: "v1", name: "Fluoro Broadsheet", short: "Fluoro" },
  { slug: "v3", name: "Tabloid Brights", short: "Tabloid" },
  { slug: "v4", name: "Mini Zine", short: "Zine" },
  { slug: "v5", name: "Midi Magazine", short: "Midi" },
] as const;

type Paper = (typeof PAPERS)[number];

// Today's issue, No. 42, is dated Wednesday 30 September 2026; one issue a day before it.
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const TODAY = Date.UTC(2026, 8, 30);

function dateOf(issue: number) {
  const d = new Date(TODAY - (TODAY_ISSUE - issue) * 86_400_000);
  const [day, date, month] = [d.getUTCDay(), d.getUTCDate(), d.getUTCMonth()];
  return {
    short: `${DAYS[day]} ${date} ${MONTHS[month]}`,
    day: `${date} ${MONTHS[month]}`,
    long: `${DAYS_LONG[day]} ${date} ${MONTHS_LONG[month]} 2026`,
  };
}

// The five papers take the run in turn, today's broadsheet first.
const paperOf = (issue: number): Paper =>
  PAPERS[(TODAY_ISSUE - issue) % PAPERS.length] ?? PAPERS[0];

function aged(issue: number): CSSProperties {
  const look = ageLook(ageInDays(issue), issue);
  return {
    "--ar-paper": agedPaper(ageInDays(issue)),
    "--ar-age": look.edge > 0 ? ageBackground(look) : "none",
    filter: `sepia(${(look.sepia * 0.8).toFixed(3)}) contrast(${look.contrast.toFixed(3)}) saturate(${look.saturate.toFixed(3)})`,
  } as CSSProperties;
}

const issues = Array.from({ length: TODAY_ISSUE }, (_, i) => TODAY_ISSUE - i);
const rack = issues.slice(0, 7);
const piles = [0, 1, 2, 3, 4].map((p) => issues.slice(7 + p * 7, 14 + p * 7));

/** A folded front page standing in the rack: only its top half, masthead up. */
function Front({ issue, index }: { issue: number; index: number }) {
  const paper = paperOf(issue);
  const date = dateOf(issue);
  const r = seeded(issue * 97);
  const style = {
    ...aged(issue),
    "--ar-tilt": `${((r() - 0.5) * 3.2).toFixed(2)}deg`,
    "--ar-drop": `${Math.round(r() * 10)}px`,
    zIndex: 10 - index,
  } as CSSProperties;
  return (
    <Link
      href={`/mockups/${paper.slug}?edition=${issue}`}
      className={`ar-front ar-front--${paper.slug}`}
      style={style}
      aria-label={`No. ${issue}, ${date.long}, in ${paper.name}`}
    >
      <span className="ar-front__sheet">
        <span className="ar-front__ear">No. {issue}</span>
        <span className="ar-front__mast">
          {paper.slug === "v4" ? (
            <>
              The
              <br />
              Yay News
            </>
          ) : paper.slug === "v3" ? (
            "YAY!"
          ) : (
            "The Yay News"
          )}
        </span>
        <span className="ar-front__line">
          <span>{date.short} 2026</span>
          <span>Vol. 1 · No. {issue}</span>
        </span>
        <span className="ar-front__type" aria-hidden>
          <em>Only good news. Mostly fun. Occasionally weird.</em>
          <span>Screen &amp; Sound · Gaming · The Back Page</span>
        </span>
        <span className="ar-front__age" aria-hidden />
      </span>
      <span className="ar-front__tag">{paper.short}</span>
    </Link>
  );
}

/** A folded paper lying in a pile, seen edge-on: the fold, its number and date on the spine. */
function Spine({ issue }: { issue: number }) {
  const paper = paperOf(issue);
  const date = dateOf(issue);
  const r = seeded(issue * 131 + 5);
  const style = {
    ...aged(issue),
    "--ar-shift": `${Math.round((r() - 0.5) * 16)}px`,
    "--ar-width": `${92 + Math.round(r() * 8)}%`,
    "--ar-tilt": `${((r() - 0.5) * 1.1).toFixed(2)}deg`,
  } as CSSProperties;
  return (
    <li className="ar-spine-slot">
      <Link
        href={`/mockups/${paper.slug}?edition=${issue}`}
        className={`ar-spine ar-spine--${paper.slug}`}
        style={style}
        aria-label={`No. ${issue}, ${date.long}, in ${paper.name}`}
      >
        <span className="ar-spine__flash" aria-hidden />
        <span className="ar-spine__no">No. {issue}</span>
        <span className="ar-spine__date">{date.short}</span>
        <span className="ar-spine__paper">{paper.short}</span>
        <span className="ar-spine__age" aria-hidden />
      </Link>
    </li>
  );
}

export default function ArchivePage() {
  const fonts = [gothic, franklin, slab, bodoni, caslon, typewriter]
    .map((f) => f.variable)
    .join(" ");
  return (
    <main className={`ar-desk ${fonts}`}>
      <header className="ar-sign">
        <span className="ar-tape ar-tape--l" aria-hidden />
        <span className="ar-tape ar-tape--r" aria-hidden />
        <p className="ar-sign__kicker">The Yay News · newsstand</p>
        <h1 className="ar-sign__title">Back issues</h1>
        <p className="ar-sign__sub">
          Nos. {TODAY_ISSUE} to 1 · every one still good news · <b>free, forever</b>
        </p>
        <p className="ar-sign__note">
          Five papers take turns. Pull any copy out and read it as it was printed.
        </p>
      </header>

      <section className="ar-rack" aria-label={`This week: Nos. ${rack[0]} to ${rack.at(-1)}`}>
        <p className="ar-ticket">
          This week · Nos. {rack[0]}–{rack.at(-1)}
        </p>
        <div className="ar-rack__row">
          {rack.map((n, i) => (
            <Front key={n} issue={n} index={i} />
          ))}
        </div>
        <div className="ar-rack__rail" aria-hidden />
      </section>

      <section className="ar-shelf" aria-label="Older issues">
        <div className="ar-shelf__piles">
          {piles.map((pile) => (
            <div key={pile[0]} className="ar-pile">
              <ol className="ar-pile__stack" aria-label={`Nos. ${pile[0]} to ${pile.at(-1)}`}>
                {pile.map((n) => (
                  <Spine key={n} issue={n} />
                ))}
              </ol>
              <p className="ar-ticket ar-ticket--pile">
                Nos. {pile[0]}–{pile.at(-1)} · {dateOf(pile.at(-1) ?? 1).day} –{" "}
                {dateOf(pile[0] ?? 1).day}
              </p>
            </div>
          ))}
        </div>
        <div className="ar-shelf__edge" aria-hidden />
      </section>

      <nav
        aria-label="Mockup pages"
        className="fixed inset-x-0 bottom-3 z-50 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] flex-wrap items-center justify-center gap-1 rounded-full bg-black/85 px-2 py-1.5 text-xs text-white shadow-lg backdrop-blur"
        style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}
      >
        <Link href="/mockups" className="rounded-full px-3 py-1 hover:bg-white/15">
          ← All
        </Link>
        <span className="px-2 font-semibold">Back issues</span>
        {PAPERS.map((p) => (
          <Link
            key={p.slug}
            href={`/mockups/${p.slug}`}
            className="rounded-full px-3 py-1 hover:bg-white/15"
          >
            {p.name}
          </Link>
        ))}
      </nav>
    </main>
  );
}
