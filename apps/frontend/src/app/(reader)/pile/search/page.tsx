import { SEARCH_MAX, SEARCH_MIN } from "@repo/shared";
import type { Metadata } from "next";
import Link from "next/link";
import { rackFonts } from "@/features/archive/fonts";
import { searchPile } from "@/features/editions/api";
import { storyHref } from "@/features/papers/reading";
import { SearchBox } from "@/features/pile/search-box";
import { previewFrom } from "../../_preview";
import "@/features/archive/archive.css";
import "@/features/pile/pile.css";

export const metadata: Metadata = {
  title: "Search the pile · The Yay News",
  robots: { index: false },
};

const LONG = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const PAPER: Record<string, string> = {
  broadsheet: "Broadsheet",
  tabloid: "Tabloid",
  zine: "Mini Zine",
  midi: "Midi Magazine",
};

/** Find a story again: every paper on the pile with a story matching the words, newest first. */
export default async function PileSearchPage({ searchParams }: PageProps<"/pile/search">) {
  const preview = await previewFrom(searchParams);
  const raw = (await searchParams).q;
  const q = (typeof raw === "string" ? raw : "").trim().slice(0, SEARCH_MAX);
  const result = q.length >= SEARCH_MIN ? await searchPile(q, preview) : null;
  const count = result?.papers.reduce((n, p) => n + p.stories.length, 0) ?? 0;

  return (
    <main className={`ar-desk pl-desk ${rackFonts}`}>
      <header className="ar-sign pl-sign">
        <span className="ar-tape ar-tape--l" aria-hidden />
        <span className="ar-tape ar-tape--r" aria-hidden />
        <p className="ar-sign__kicker">
          <Link href="/pile">Your Pile</Link>
        </p>
        <h1 className="ar-sign__title">Search the pile</h1>
        <SearchBox initial={q} />
      </header>

      {result === null ? (
        <p className="pl-found__none">
          Type a word or two from the story you&rsquo;re after: <i>octopus</i>, <i>Mars</i>,{" "}
          <i>Taylor Swift</i>.
        </p>
      ) : result.papers.length === 0 ? (
        <p className="pl-found__none">
          Nothing on the pile matches &ldquo;{q}&rdquo;. Try another word?
        </p>
      ) : (
        <div className="pl-found">
          <p className="pl-found__count" role="status">
            {count}
            {result.more ? "+" : ""} {count === 1 ? "story" : "stories"} in {result.papers.length}{" "}
            {result.papers.length === 1 ? "paper" : "papers"}
          </p>
          {result.papers.map((p) => (
            <section
              key={p.issueNumber}
              className="pl-found__paper"
              aria-label={`No. ${p.issueNumber}`}
            >
              <h2 className="pl-found__head">
                <Link href={`/issue/${p.issueNumber}`}>
                  No. {p.issueNumber} · {LONG.format(new Date(`${p.date}T00:00:00Z`))}
                </Link>
                <span className="pl-found__design">{PAPER[p.design] ?? p.design}</span>
              </h2>
              <ul>
                {p.stories.map((s) => (
                  <li key={s.slug}>
                    <Link href={storyHref(p.issueNumber, s.slug)} className="pl-found__story">
                      <span className="pl-found__k">{s.kicker}</span>
                      <span className="pl-found__h">{s.headline}</span>
                      <span className="pl-found__d">{s.dek}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {result.more ? (
            <p className="pl-found__none">Plenty more match that. Add a word to narrow it down.</p>
          ) : null}
        </div>
      )}
    </main>
  );
}
