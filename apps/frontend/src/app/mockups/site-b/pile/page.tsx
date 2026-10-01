import Link from "next/link";
import { loadSite, shortDate } from "@/app/mockups/site-a/_shared/data";
import { addDays, type HabitEvent } from "@/features/habits/core";
import { FindItBox, GAP, Heading, Mascot, RansomHeading, riotInks } from "@/features/riot";
import { Shell } from "../_ui/chrome";
import { type Cover, Covers } from "../_ui/covers";

export default async function Pile({ searchParams }: PageProps<"/mockups/site-b/pile">) {
  const data = await loadSite(searchParams);
  const top = data.pile[0]!;
  const reading: HabitEvent[] = [1, 2].map(
    (page) =>
      ({
        id: `mock-read-${page}`,
        type: "page_read",
        issue: top.issueNumber,
        page,
        at: `${data.today}T08:0${page}:00.000Z`,
      }) as HabitEvent,
  );
  // Each back issue printed in its own day's plate A.
  const covers: Cover[] = data.pile.map((p, i) => ({
    issue: p.issueNumber,
    day: shortDate(p.date),
    headline: p.lead.headline,
    kicker: p.lead.kicker,
    photo: p.photo,
    plate: riotInks({ design: p.design, colourway: p.colourway }).a,
    tilt: i === 0 ? -1.5 : 0,
  }));
  const stampByDate = new Map(data.stamps.map((s) => [s.date, s]));
  const rest = new Set(data.streak.restDays);
  const issueByDate = new Map(data.pile.map((p) => [p.date, p]));
  const dates = Array.from({ length: 14 }, (_, k) => addDays(data.today, -k));
  const q = data.search.query;
  const hits = data.search.papers.flatMap((p) =>
    p.stories.map((s) => ({ ...s, issue: p.issueNumber, date: p.date })),
  );
  return (
    <Shell
      data={data}
      place="pile"
      note="Back issues as a paste-up of covers, each photo printed in that day's own ink, its state in words. Search is the plain box you can't miss. The stamp tour reads top to bottom, newest first, so it works on a phone."
    >
      <div className="sb-pile">
        <div className="sb-pile__head">
          <RansomHeading
            text="BACK ISSUES"
            seed="back-issues"
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
            {data.pile.length} papers, all free, none of them about the news you were dreading.
          </p>
        </div>

        <div className="sb-pile__find">
          <FindItBox
            action="/mockups/site-b/pile"
            id="sb-q"
            defaultValue={q}
            placeholder="octopus, Mars, Elvis…"
            count={
              <>
                {hits.length} {hits.length === 1 ? "story" : "stories"} with &ldquo;{q}&rdquo; in
                them
              </>
            }
            hits={hits.slice(0, 4).map((h) => ({
              key: `${h.issue}-${h.slug}`,
              href: `/mockups/site-b/today?issue=${h.issue}`,
              meta: `No. ${h.issue} · ${shortDate(h.date)}`,
              title: h.headline,
            }))}
          />
          <Mascot pose="confused" className="sb-pile__odin" />
        </div>

        <Covers covers={covers} events={[...data.events, ...reading]} />

        <section className="sb-tour" aria-labelledby="tour-h">
          <Heading id="tour-h" className="sb-tour__h">
            The stamp tour
          </Heading>
          <p className="sb-tour__when rt-meta">Last 14 dates, newest first</p>
          <table className="sb-tour__table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Paper</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((d) => {
                const s = stampByDate.get(d);
                const p = issueByDate.get(d);
                const today = d === data.today;
                const state = today
                  ? "tonight"
                  : s
                    ? "stamped"
                    : rest.has(d)
                      ? "rest day"
                      : "missed";
                return (
                  <tr key={d} className={`is-${state.replace(" ", "-")}`}>
                    <td className="sb-tour__date">{shortDate(d)}</td>
                    <td>
                      {p ? (
                        <Link href={`/mockups/site-b/today?issue=${p.issueNumber}`}>
                          No. {p.issueNumber} <span>{p.lead.kicker}</span>
                        </Link>
                      ) : s ? (
                        <>No. {s.issue}</>
                      ) : (
                        <span className="sb-tour__none">no paper read</span>
                      )}
                    </td>
                    <td>
                      <span className="sb-tour__state">
                        {state === "stamped" ? "sold out" : state === "tonight" ? "on now" : state}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="sb-tour__key">
            Sold out means you finished it. One rest day a week keeps the run alive.
          </p>
        </section>
      </div>
    </Shell>
  );
}
