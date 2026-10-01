import { SEARCH_MAX, SEARCH_MIN } from "@repo/shared";
import type { Metadata } from "next";
import Link from "next/link";
import { searchPile } from "@/features/editions/api";
import { storyHref } from "@/features/papers/reading";
import { FindItBox, GAP, Mascot, RansomHeading } from "@/features/riot";
import { previewFrom } from "../../_preview";

export const metadata: Metadata = {
  title: "Find it · Your Pile · The Yay News",
  robots: { index: false },
};

const SHORT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** Find a story again: every story on the pile matching the words, newest paper first. */
export default async function PileSearchPage({ searchParams }: PageProps<"/pile/search">) {
  const preview = await previewFrom(searchParams);
  const raw = (await searchParams).q;
  const q = (typeof raw === "string" ? raw : "").trim().slice(0, SEARCH_MAX);
  const result = q.length >= SEARCH_MIN ? await searchPile(q, preview) : null;
  const hits =
    result?.papers.flatMap((p) =>
      p.stories.map((s) => ({
        key: `${p.issueNumber}-${s.slug}`,
        href: storyHref(p.issueNumber, s.slug),
        meta: `No. ${p.issueNumber} · ${SHORT.format(new Date(`${p.date}T00:00:00Z`))} · ${s.kicker}`,
        title: s.headline,
      })),
    ) ?? [];

  return (
    <div className="ys-page sb-pile">
      <div className="sb-pile__head">
        <p className="rt-meta">
          <Link href="/pile">← Your Pile</Link>
        </p>
        <RansomHeading
          text="FIND IT"
          seed="find-it"
          as="h1"
          className="sb-pile__h"
          cuts={[
            { ch: "FI", from: "slab", size: 1.1 },
            { ch: "N", from: "didone", size: 0.92, lift: 0.06, turn: -3 },
            { ch: "D", from: "gothic", size: 1.04, tuck: 0.03, ground: "a" },
            GAP,
            { ch: "IT", from: "roman", size: 1.06, turn: 2 },
          ]}
        />
      </div>
      <div className="sb-pile__find">
        <FindItBox
          action="/pile/search"
          id="sb-q"
          defaultValue={q}
          placeholder="octopus, Mars, Elvis…"
          label="Find a story again"
          count={
            result === null ? (
              <>Type a word or two from the story you&rsquo;re after.</>
            ) : hits.length === 0 ? (
              <>Nothing on the pile with &ldquo;{q}&rdquo; in it. Try another word?</>
            ) : (
              <>
                {hits.length}
                {result.more ? "+" : ""} {hits.length === 1 ? "story" : "stories"} with &ldquo;
                {q}&rdquo; in {hits.length === 1 ? "it" : "them"}
              </>
            )
          }
          hits={hits}
        />
        <Mascot
          pose={hits.length || result === null ? "standing" : "confused"}
          className="sb-pile__odin"
          label=""
        />
      </div>
    </div>
  );
}
