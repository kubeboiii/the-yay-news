import { calendarDateSchema, type EditionSummary } from "@repo/shared";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editionLook } from "@/app/clip/_lib/looks";
import { rackFonts } from "@/features/archive/fonts";
import { Copy, Rack, racksOf, weekOf } from "@/features/archive/rack";
import { getArchive, getToday } from "@/features/editions/api";
import { habitFonts } from "@/features/habits/fonts";
import { BeforeYourTime, BoxCount, CatchUp } from "@/features/pile/catch-up";
import { BirthdayForm } from "@/features/pile/birthday-form";
import { SearchBox } from "@/features/pile/search-box";
import { StampCalendar } from "@/features/pile/stamp-calendar";
import { previewFrom } from "../_preview";
import "@/features/archive/archive.css";
import "@/features/pile/pile.css";

export const metadata: Metadata = {
  title: "Your Pile · The Yay News",
  description: "Every paper so far, stacked by date, with your stamps on the ones you've read.",
};

// Your Pile: every paper so far, as the stack by your bed. On top, anything from the last week you
// haven't finished; then this week standing in its rack; then earlier weeks packed into a box per
// month. Or the same papers as a calendar with your stamps on it (?view=calendar).

const PER_VISIT = 50;
const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const DAY = 86_400_000;
const at = (date: string) => Date.parse(`${date}T00:00:00Z`);

function monthsOf(items: EditionSummary[]) {
  const boxes: { key: string; items: EditionSummary[] }[] = [];
  for (const e of items) {
    const key = e.date.slice(0, 7);
    const last = boxes.at(-1);
    if (last?.key === key) last.items.push(e);
    else boxes.push({ key, items: [e] });
  }
  return boxes;
}

export default async function PilePage({ searchParams }: PageProps<"/pile">) {
  const preview = await previewFrom(searchParams);
  const { cursor, view } = await searchParams;
  if (cursor !== undefined && !calendarDateSchema.safeParse(cursor).success) notFound();
  const from = typeof cursor === "string" ? cursor : undefined;
  const calendar = view === "calendar";
  const [page, today] = await Promise.all([
    getArchive(from, preview, PER_VISIT),
    getToday(preview).catch(() => null),
  ]);
  const ref = today?.date ?? page.items[0]?.date;
  const now = ref ? at(ref) : 0;
  const todayIssue = from ? null : (today?.issueNumber ?? null);
  const keep = preview.now ? `&now=${encodeURIComponent(preview.now)}` : "";
  const views = (v: "stack" | "calendar") =>
    `/pile${v === "calendar" ? "?view=calendar" : ""}${keep ? (v === "calendar" ? keep : `?${keep.slice(1)}`) : ""}`;

  const items = page.items;
  const thisWeek = ref ? weekOf(ref) : null;
  const week = from ? [] : items.filter((e) => weekOf(e.date) === thisWeek);
  const earlier = items.filter((e) => !week.includes(e));
  const recent = from
    ? []
    : items.filter((e) => e.issueNumber !== todayIssue && now - at(e.date) <= 7 * DAY);

  return (
    <main className={`ar-desk pl-desk ${rackFonts} ${habitFonts}`}>
      <header className="ar-sign pl-sign">
        <span className="ar-tape ar-tape--l" aria-hidden />
        <span className="ar-tape ar-tape--r" aria-hidden />
        <p className="ar-sign__kicker">The Yay News</p>
        <h1 className="ar-sign__title">Your Pile</h1>
        <p className="ar-sign__sub">
          Every paper so far, stacked by the bed · <b>free, forever</b>
        </p>
        <nav className="pl-views" aria-label="Pile view">
          <Link href={views("stack")} aria-current={calendar ? undefined : "page"}>
            The stack
          </Link>
          <Link href={views("calendar")} aria-current={calendar ? "page" : undefined}>
            Stamp calendar
          </Link>
        </nav>
        <SearchBox />
      </header>

      {items.length === 0 ? (
        <p className="ar-empty">The first edition hasn&rsquo;t been printed yet.</p>
      ) : calendar ? (
        <>
          <StampCalendar
            today={todayIssue ? (today?.date ?? null) : null}
            days={items.map((e) => ({ date: e.date, issue: e.issueNumber, ink: editionLook(e).a }))}
          />
          <BirthdayForm />
        </>
      ) : (
        <>
          <CatchUp
            copies={recent.map((e, i) => ({
              issue: e.issueNumber,
              date: e.date,
              node: <Copy key={e.issueNumber} edition={e} index={i} now={now} today={false} />,
            }))}
          />
          {week.length ? (
            <Rack week={thisWeek!} items={week} now={now} todayIssue={todayIssue} />
          ) : null}
          {monthsOf(earlier).map((box, i) => (
            <details key={box.key} className="pl-box" open={from !== undefined && i === 0}>
              <summary className="pl-box__lid">
                <span className="pl-box__k">Box</span>
                <span className="pl-box__name">
                  {MONTH.format(new Date(`${box.key}-01T00:00:00Z`))}
                </span>
                <span className="pl-box__n">
                  {box.items.length} paper{box.items.length === 1 ? "" : "s"}
                  <BoxCount issues={box.items.map((e) => e.issueNumber)} />
                </span>
              </summary>
              {racksOf(box.items).map((r) => (
                <Rack key={r.week} week={r.week} items={r.items} now={now} todayIssue={null} />
              ))}
            </details>
          ))}
          <BeforeYourTime
            oldest={
              items.at(-1) ? { issue: items.at(-1)!.issueNumber, date: items.at(-1)!.date } : null
            }
          />
        </>
      )}

      {from || page.nextCursor ? (
        <nav className="ar-more" aria-label="More of the pile">
          {from ? (
            <Link href={views(calendar ? "calendar" : "stack")} className="ar-ticket">
              ← The top of the pile
            </Link>
          ) : null}
          {page.nextCursor ? (
            <Link
              href={`/pile?cursor=${page.nextCursor}${calendar ? "&view=calendar" : ""}${keep}`}
              className="ar-ticket"
            >
              Further down the pile →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
