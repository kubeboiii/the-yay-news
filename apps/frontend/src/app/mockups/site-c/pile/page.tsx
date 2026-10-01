import Link from "next/link";
import type { CSSProperties } from "react";
import { monthGrid, WEEKDAYS } from "@/app/mockups/site-a/_shared/calendar";
import { loadSite, shortDate } from "@/app/mockups/site-a/_shared/data";
import { tilt } from "@/app/mockups/site-a/_shared/hand";
import { paletteFor } from "@/app/mockups/site-a/_shared/palette";
import type { HabitEvent } from "@/features/habits/core";
import { Shell } from "../_ui/chrome";
import { Balloon, Caption, Panel, ToonPip } from "../_ui/comic";
import { type Slab, Tower } from "../_ui/tower";

export default async function Pile({ searchParams }: PageProps<"/mockups/site-c/pile">) {
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
  const slabs: Slab[] = data.pile.map((p, i) => ({
    issue: p.issueNumber,
    day: shortDate(p.date),
    headline: p.lead.headline,
    ground: paletteFor(p.colourway).soft[i % 2 ? 2 : 0]!,
    tilt: tilt(`tw-${p.issueNumber}`, 1.6),
    shift: Math.round(tilt(`tws-${p.issueNumber}`, 14)),
  }));
  const q = data.search.query;
  const hits = data.search.papers.flatMap((p) =>
    p.stories.map((s) => ({ ...s, issue: p.issueNumber, date: p.date })),
  );
  const month = monthGrid("2026-09", data.stamps, data.streak.restDays, data.today);
  const oct = monthGrid(
    "2026-10",
    data.stamps.filter((s) => s.date < data.today),
    data.streak.restDays,
    data.today,
  );
  return (
    <Shell
      data={data}
      place="pile"
      note="Pip sits on top of your pile and asks what you're looking for: search is a speech balloon you type into, so it's the first thing you see. Every paper in the tower says its number, date, headline and state in words; the star chart shows the days, one gold star per paper finished."
    >
      <div className="sc-pile">
        <div className="sc-pile__tower">
          <ToonPip pose="sit" className="sc-pile__pip" />
          <Tower slabs={slabs} events={[...data.events, ...reading]} />
          <span className="sc-pile__floor" aria-hidden />
        </div>
        <div className="sc-pile__side">
          <form action="/mockups/site-c/pile" role="search" className="sc-search">
            <Balloon tail="l" className="sc-search__balloon">
              <label htmlFor="sc-q">What are we looking for?</label>
              <span className="sc-search__row">
                <input
                  id="sc-q"
                  name="q"
                  defaultValue={q}
                  placeholder="octopus, Mars, Elvis…"
                  className="sc-search__input"
                />
                <button type="submit" className="sc-btn sc-search__go">
                  Find it
                </button>
              </span>
            </Balloon>
          </form>
          <Panel ground="paper" className="sc-hits" label="Search results">
            <Caption>
              {hits.length} stories about &ldquo;{q}&rdquo;
            </Caption>
            <ul>
              {hits.slice(0, 4).map((h) => (
                <li key={`${h.issue}-${h.slug}`}>
                  <Link href={`/mockups/site-c/today?issue=${h.issue}`}>
                    <span className="sc-hits__meta">
                      No. {h.issue} · {shortDate(h.date)}
                    </span>
                    <span className="sc-hits__head">{h.headline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel ground="s0" className="sc-chart" label="Star chart">
            <h2 className="sc-chart__h sc-inked">Star chart</h2>
            <p className="sc-chart__sub">
              One gold star for every paper you finish. {data.streak.current} in a row!
            </p>
            {[month, oct].map((m) => (
              <div key={m.label}>
                <p className="sc-chart__month">{m.label}</p>
                <table className="sc-chart__grid">
                  <thead>
                    <tr>
                      {WEEKDAYS.map((d, i) => (
                        <th key={i} scope="col">
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {m.weeks.map((w, wi) => (
                      <tr key={wi}>
                        {w.map((d, di) =>
                          d ? (
                            <td key={di} className={d.today ? "is-today" : undefined}>
                              <span className="sc-chart__n">{d.day}</span>
                              {d.stamp ? (
                                <svg
                                  viewBox="0 0 40 40"
                                  className="sc-chart__star"
                                  style={{ rotate: `${tilt(d.date, 14)}deg` } as CSSProperties}
                                  role="img"
                                  aria-label={`No. ${d.stamp.issue} finished`}
                                >
                                  <path
                                    d="M20 3 L24.5 14.5 L37 15 L27 23 L30.5 35.5 L20 28.5 L9.5 35.5 L13 23 L3 15 L15.5 14.5 Z"
                                    fill="var(--sc-l1)"
                                    stroke="var(--sc-ink)"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : d.rest ? (
                                <span className="sc-chart__rest">rest</span>
                              ) : null}
                            </td>
                          ) : (
                            <td key={di} aria-hidden />
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </Shell>
  );
}
