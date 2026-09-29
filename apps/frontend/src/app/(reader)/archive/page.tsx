import { calendarDateSchema } from "@repo/shared";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { rackFonts } from "@/features/archive/fonts";
import { Rack, racksOf } from "@/features/archive/rack";
import { getArchive, getToday } from "@/features/editions/api";
import { previewFrom } from "../_preview";
import "@/features/archive/archive.css";

export const metadata: Metadata = {
  title: "Back issues · The Yay News",
  description: "Every past edition of The Yay News, by date: still good news, free, forever.",
};

/** Back issues by date, newest first, a week to a rack; `?cursor=` turns to older ones. */
export default async function ArchivePage({ searchParams }: PageProps<"/archive">) {
  const preview = await previewFrom(searchParams);
  const { cursor } = await searchParams;
  if (cursor !== undefined && !calendarDateSchema.safeParse(cursor).success) notFound();
  const at = typeof cursor === "string" ? cursor : undefined;
  const [page, today] = await Promise.all([
    getArchive(at, preview),
    // Which copy is today's, to mark it; there may be none released yet.
    getToday(preview).catch(() => null),
  ]);
  // Copies age from today's paper (the newest a reader here can see).
  const ref = today?.date ?? page.items[0]?.date;
  const now = ref ? Date.parse(`${ref}T00:00:00Z`) : 0;
  const racks = racksOf(page.items);
  const newest = page.items[0]?.issueNumber;
  const oldest = page.items.at(-1)?.issueNumber;
  const keep = preview.now ? `&now=${encodeURIComponent(preview.now)}` : "";

  return (
    <main className={`ar-desk ${rackFonts}`}>
      <header className="ar-sign">
        <span className="ar-tape ar-tape--l" aria-hidden />
        <span className="ar-tape ar-tape--r" aria-hidden />
        <p className="ar-sign__kicker">The Yay News · newsstand</p>
        <h1 className="ar-sign__title">Back issues</h1>
        <p className="ar-sign__sub">
          {newest && oldest ? (
            <>
              {newest === oldest ? `No. ${newest}` : `Nos. ${newest} to ${oldest}`} on this stand ·
              every one still good news · <b>free, forever</b>
            </>
          ) : (
            <>Nothing on the stand yet</>
          )}
        </p>
        <p className="ar-sign__note">
          The Broadsheet on weekdays; the Tabloid, Mini Zine or Midi Magazine at weekends. Pull any
          copy out and read it as it was printed. <Link href="/">Today&rsquo;s paper</Link>
        </p>
      </header>

      {racks.length === 0 ? (
        <p className="ar-empty">The first edition hasn&rsquo;t been printed yet.</p>
      ) : (
        racks.map((r) => (
          <Rack
            key={r.week}
            week={r.week}
            items={r.items}
            now={now}
            todayIssue={at ? null : (today?.issueNumber ?? null)}
          />
        ))
      )}

      {at || page.nextCursor ? (
        <nav className="ar-more" aria-label="More back issues">
          {at ? (
            <Link href={keep ? `/archive?${keep.slice(1)}` : "/archive"} className="ar-ticket">
              ← The newest issues
            </Link>
          ) : null}
          {page.nextCursor ? (
            <Link
              href={`/archive?cursor=${page.nextCursor}${keep}`}
              className="ar-ticket"
              rel="next"
            >
              Older issues →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
