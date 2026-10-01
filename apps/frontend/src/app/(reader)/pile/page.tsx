import { calendarDateSchema, type EditionSummary } from "@repo/shared";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArchive, getToday } from "@/features/editions/api";
import { issueHref } from "@/features/papers/reading";
import { BirthdayForm } from "@/features/pile/birthday-form";
import { BeforeYourTime } from "@/features/pile/catch-up";
import { type Cover, Covers } from "@/features/pile/covers";
import { StampTour } from "@/features/pile/stamp-tour";
import { FindItBox, GAP, Heading, Mascot, RansomHeading, riotInks } from "@/features/riot";
import { printedPhoto } from "@repo/ui/print/photo";
import { previewFrom } from "../_preview";
import "@/features/pile/pile.css";

export const metadata: Metadata = {
  title: "Your Pile · The Yay News",
  description: "Every paper so far, all free, with your stamps on the ones you've read.",
};

// Your Pile (Direction B, "Riso Zine Riot"): back issues pasted up as covers, each printed in its
// own day's plate A with the reader's state slapped on in words; FIND IT, the box you can't miss;
// the stamp tour, the last fourteen dates newest first; and everything older filed by month.

const PER_VISIT = 50;
const COVERS = 12;
const SHORT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const short = (d: string) => SHORT.format(new Date(`${d}T00:00:00Z`));

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
  const { cursor } = await searchParams;
  if (cursor !== undefined && !calendarDateSchema.safeParse(cursor).success) notFound();
  const from = typeof cursor === "string" ? cursor : undefined;
  const [page, today] = await Promise.all([
    getArchive(from, preview, PER_VISIT),
    getToday(preview).catch(() => null),
  ]);
  const items = page.items;
  const todayIssue = from ? null : (today?.issueNumber ?? null);
  const keep = preview.now ? `&now=${encodeURIComponent(preview.now)}` : "";

  const covers: Cover[] = (from ? [] : items.slice(0, COVERS)).map((e) => ({
    issue: e.issueNumber,
    day: short(e.date),
    headline: e.lead?.headline ?? "Only good news. Mostly fun. Occasionally weird.",
    kicker: e.lead?.kicker ?? "The Yay News",
    photo: e.lead?.image ? printedPhoto(e.lead.image.url, 640) : null,
    plate: riotInks({ design: e.design, colourway: e.colourway }).a,
    today: e.issueNumber === todayIssue,
  }));
  const older = from ? items : items.slice(COVERS);

  return (
    <div className="ys-page sb-pile">
      <div className="sb-pile__head">
        <RansomHeading
          text="BACK ISSUES"
          seed="back-issues"
          as="h1"
          className="sb-pile__h"
          cuts={[
            { ch: "BA", from: "gothic", size: 1.12 },
            { ch: "C", from: "didone", size: 0.9, lift: 0.07, tuck: 0.04, turn: -3 },
            { ch: "K", from: "slab", size: 1.0, tuck: 0.03 },
            GAP,
            { ch: "IS", from: "roman", size: 0.96, turn: 2 },
            { ch: "S", from: "slab", size: 1.1, tuck: 0.04, lift: -0.05, ground: "a" },
            { ch: "UES", from: "gothic", size: 1.04, tuck: 0.03 },
          ]}
        />
        <p className="sb-pile__sub">
          Every paper so far, all free, none of them about the news you were dreading.
        </p>
      </div>

      <div className="sb-pile__find">
        <FindItBox
          action="/pile/search"
          id="sb-q"
          placeholder="octopus, Mars, Elvis…"
          label="Find a story again"
        />
        <Mascot pose="confused" className="sb-pile__odin" label="" />
      </div>

      {covers.length ? <Covers covers={covers} /> : null}

      {today && !from ? (
        <StampTour
          today={today.date}
          papers={items.map((e) => ({
            issue: e.issueNumber,
            date: e.date,
            kicker: e.lead?.kicker ?? "",
          }))}
        />
      ) : null}

      {older.length ? (
        <section className="ys-older" aria-labelledby="older-h">
          <Heading id="older-h" className="sb-h">
            Further down the pile
          </Heading>
          {monthsOf(older).map((box) => (
            <details key={box.key} className="ys-older__box">
              <summary>
                <span className="ys-older__month">
                  {MONTH.format(new Date(`${box.key}-01T00:00:00Z`))}
                </span>
                <span className="rt-meta">
                  {box.items.length} paper{box.items.length === 1 ? "" : "s"}
                </span>
              </summary>
              <ul>
                {box.items.map((e) => (
                  <li key={e.issueNumber}>
                    <Link href={issueHref(e.issueNumber)}>
                      <span className="rt-meta">
                        No. {e.issueNumber} · {short(e.date)}
                      </span>
                      <span>{e.lead?.headline ?? "The Yay News"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </section>
      ) : null}

      <div className="ys-pile__foot">
        <BirthdayForm />
        <BeforeYourTime
          oldest={
            items.at(-1) ? { issue: items.at(-1)!.issueNumber, date: items.at(-1)!.date } : null
          }
        />
      </div>

      {from || page.nextCursor ? (
        <nav className="ys-more" aria-label="More of the pile">
          {from ? (
            <Link href={keep ? `/pile?${keep.slice(1)}` : "/pile"}>← The top of the pile</Link>
          ) : null}
          {page.nextCursor ? (
            <Link href={`/pile?cursor=${page.nextCursor}${keep}`}>Further down the pile →</Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
