import type { Edition } from "@repo/shared";
import Link from "next/link";
import { Mark } from "@/features/print/mark";
import type { EditionPage, Reading } from "../types";
import { pageSlug } from "../reading";

// The small furniture an inside page is finished with: what's on elsewhere in the paper, a line
// from the page's own stories, the next page as an admission ticket, and a house ad.

export type Listing = { n: number; label: string; note: string; href: string };

/** Every other page of the paper, as listings: page number, name, and what leads it. */
export function listings(edition: Edition, reading: Reading, page: EditionPage): Listing[] {
  const pages = [...edition.pages].sort((a, b) => a.order - b.order);
  return reading.pages.flatMap((link, i) => {
    const p = pages.find((x) => pageSlug(x) === link.slug);
    if (!p || p.order === page.order || p.layout === "front") return [];
    const note =
      p.layout === "back"
        ? "Puzzles, the comic, the small print and the sign-off."
        : (p.stories[0]?.headline ?? p.section?.tagline ?? "");
    return [
      {
        n: i + 1,
        label: p.layout === "back" ? "The back page" : link.label,
        note,
        href: link.href,
      },
    ];
  });
}

/** A real line from the page's own stories, for a pull quote: speech set in curly quotes. */
export function pullQuote(page: EditionPage): { text: string; by: string } | null {
  for (const s of page.stories) {
    for (const p of s.body) {
      for (const m of p.matchAll(/“([^”]{20,150})”/g)) {
        const text = m[1]!.replace(/[,.]$/, "").trim();
        if (text.split(" ").length >= 4) return { text, by: s.kicker };
      }
    }
  }
  return null;
}

const HOUSE_ADS = [
  {
    head: "This space was for sale.",
    body: "Nobody bought it, so here is a nice thought instead: drink some water.",
  },
  {
    head: "Lost: one bad mood.",
    body: "Last seen on the front page this morning. Not missed. No reward offered.",
  },
  {
    head: "Wanted: readers exactly like you.",
    body: "Must enjoy good news. No experience needed. Apply by turning the page.",
  },
  {
    head: "Free to a good home: a moment of calm.",
    body: "Collect it anywhere in this paper. Especially near the crossword.",
  },
  {
    head: "For hire: one very small cheerleader.",
    body: "Fits in a pocket. Cheers quietly. Available for Mondays and other emergencies.",
  },
];

/** The house ad for a page: one of the paper's own, chosen by issue and page so it varies. */
export function HouseAd({ seed, className }: { seed: number; className?: string }) {
  const ad = HOUSE_ADS[seed % HOUSE_ADS.length]!;
  return (
    <aside className={`ss-ad bs-ad ${className ?? ""}`}>
      <p className="yn-ad-label">Advertisement</p>
      <p className="yn-chunk">{ad.head}</p>
      <p className="yn-body">{ad.body}</p>
    </aside>
  );
}

/** The next page, printed as a cinema ticket that admits you to it. */
export function NextTicket({ reading, edition }: { reading: Reading; edition: Edition }) {
  const next = reading.next;
  const n = reading.pages.indexOf(reading.current) + 2;
  return (
    <article className="yn-ticket ss-ticket bs-ticket">
      <div className="yn-ticket-ink print-worn" aria-hidden />
      <div className="bs-ticket-main">
        <p className="admit">Admit one · {next ? `page ${n}` : "tomorrow"}</p>
        <h3 className="yn-chunk yn-hed-sm">
          {next ? (
            <Link href={next.href} className="bs-link">
              {next.slug === "back" ? "The back page" : next.label}
            </Link>
          ) : (
            "That's the paper"
          )}
        </h3>
        <p className="yn-body bs-ticket-body">
          {next
            ? next.slug === "back"
              ? "The puzzles, the comic and the bit where you’re done."
              : "Turn the page. It’s all good news over there too."
            : "Come back tomorrow for a whole new paper."}
        </p>
        <p className="seat">
          <span>No. {edition.issueNumber}</span>
          <span>Row {String.fromCharCode(64 + Math.min(26, n))}</span>
          <span>Seat {n}</span>
        </p>
      </div>
      <div className="yn-ticket-stub" aria-hidden>
        <p>
          Admit one
          <small>No. {String(edition.issueNumber * 1000 + n).padStart(6, "0")}</small>
        </p>
      </div>
    </article>
  );
}

/** A pull quote with a hand-drawn flourish beside it. */
export function PullQuote({ quote }: { quote: { text: string; by: string } }) {
  return (
    <figure className="ss-quote bs-quote">
      <Mark name="stars-19" ink="var(--pop)" className="yn-mark-abs ss-quote-mark" />
      <blockquote className="yn-pullquote">&ldquo;{quote.text}&rdquo;</blockquote>
      <figcaption className="yn-pullquote-by">{quote.by}</figcaption>
    </figure>
  );
}

/** The listings: every other page, with its page number where a time would be. */
export function Listings({ items, className }: { items: Listing[]; className?: string }) {
  return (
    <ul className={`ss-list ${className ?? ""}`}>
      {items.map((l) => (
        <li key={l.href}>
          <time>p.{l.n}</time>
          <span>
            <Link href={l.href} className="bs-link">
              <b>{l.label}</b>
            </Link>{" "}
            — {l.note}
          </span>
        </li>
      ))}
    </ul>
  );
}
