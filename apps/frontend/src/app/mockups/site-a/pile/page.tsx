import Link from "next/link";
import type { CSSProperties } from "react";
import { monthGrid, WEEKDAYS } from "@/app/mockups/site-a/_shared/calendar";
import { loadSite, shortDate } from "@/app/mockups/site-a/_shared/data";
import { tilt } from "@/app/mockups/site-a/_shared/hand";
import { paletteFor } from "@/app/mockups/site-a/_shared/palette";
import { Pip } from "@/app/mockups/site-a/_shared/pip";
import type { HabitEvent } from "@/features/habits/core";
import { Beanbag } from "../_ui/beanbag";
import { Shell } from "../_ui/chrome";
import { Tape } from "../_ui/kit";
import { Stack, type StackPaper } from "../_ui/stack";

const DESIGN: Record<string, string> = {
  broadsheet: "Broadsheet",
  tabloid: "Tabloid",
  zine: "Zine",
  midi: "Midi",
};

export default async function Pile({ searchParams }: PageProps<"/mockups/site-a/pile">) {
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
  const papers: StackPaper[] = data.pile.map((p) => {
    const pal = paletteFor(p.colourway);
    return {
      issue: p.issueNumber,
      date: p.date,
      day: shortDate(p.date),
      headline: p.lead.headline,
      kicker: p.lead.kicker,
      design: DESIGN[p.design] ?? p.design,
      ground: pal.soft[0]!,
      ink: pal.loud[0]!,
      tilt: tilt(`pile-${p.issueNumber}`, 1.1),
      shift: Math.round(tilt(`pile-x-${p.issueNumber}`, 16)),
    };
  });
  const months = ["2026-09", "2026-10"].map((m) =>
    monthGrid(
      m,
      data.stamps.filter((s) => s.date < data.today),
      data.streak.restDays,
      data.today,
    ),
  );
  const q = data.search.query;
  const hits = data.search.papers.flatMap((p) =>
    p.stories.map((s) => ({ ...s, issue: p.issueNumber, date: p.date })),
  );
  return (
    <Shell
      data={data}
      place="pile"
      scene="corner"
      note="The pile is a stack you can read like a list: every edge says number, date and headline, and its state (stamped, dog-eared, unread) is a word, not only a colour. Finding things is two tools side by side: words (search) and days (the stamp calendar)."
    >
      <div className="sa-pilerow">
        <section className="sa-room" aria-labelledby="pile-h">
          <h1 id="pile-h" className="sa-room__h">
            Your pile <span>{data.pile.length} papers by the beanbag</span>
          </h1>
          <div className="sa-scene">
            <div className="sa-room__floor" aria-hidden />
            <Beanbag className="sa-room__bag" />
            <div className="sa-heap">
              <div className="sa-heap__top">
                <Pip pose="sit" className="sa-heap__pip" inks={{ cap: "var(--sa-l1)" }} />
                <Link href="/mockups/site-a/today" className="sa-flat">
                  <span className="sa-flat__mast">The Yay News</span>
                  <span className="sa-flat__meta">
                    No. {top.issueNumber} · {shortDate(top.date)} · today · dog-eared at page 2
                  </span>
                  {top.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a pressed print
                    <img src={top.photo} alt="" className="sa-flat__img" />
                  ) : (
                    <span className="sa-flat__kick">{top.lead.kicker}</span>
                  )}
                  <span className="sa-flat__head">{top.lead.headline}</span>
                </Link>
              </div>
              <Stack papers={papers.slice(1)} events={[...data.events, ...reading]} />
            </div>
          </div>
        </section>

        <div className="sa-pileside">
          <form className="sa-slip" action="/mockups/site-a/pile" role="search">
            <Tape className="sa-slip__tape" ink="var(--sa-s2)" />
            <label htmlFor="sa-q" className="sa-slip__label">
              Find a story again
            </label>
            <div className="sa-slip__row">
              <input
                id="sa-q"
                name="q"
                defaultValue={q}
                placeholder="octopus, Mars, Elvis…"
                className="sa-slip__input"
              />
              <button type="submit" className="sa-slip__go">
                Find
              </button>
            </div>
            <p className="sa-slip__count">
              {hits.length} {hits.length === 1 ? "story" : "stories"} about &ldquo;{q}&rdquo; in
              your pile
            </p>
            {hits.length === 0 ? (
              <div className="sa-empty">
                <Pip pose="confused" className="sa-empty__pip" inks={{ cap: "var(--sa-l1)" }} />
                <p>
                  Pip looked through every paper. Nothing about &ldquo;{q}&rdquo; yet. Try a simpler
                  word, or an animal.
                </p>
              </div>
            ) : null}
            <ul className="sa-hits">
              {hits.slice(0, 3).map((h) => (
                <li key={`${h.issue}-${h.slug}`} style={{ rotate: `${tilt(h.slug, 1.2)}deg` }}>
                  <Link href={`/mockups/site-a/today?issue=${h.issue}`}>
                    <span className="sa-hits__meta">
                      No. {h.issue} · {shortDate(h.date)} · {h.kicker}
                    </span>
                    <span className="sa-hits__head">{h.headline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </form>

          <section className="sa-wallcal" aria-labelledby="cal-h">
            <span className="sa-wallcal__nail" aria-hidden />
            <h2 id="cal-h" className="sa-wallcal__h">
              Stamp calendar
            </h2>
            {months.map((m) => (
              <div key={m.label} className="sa-month">
                <p className="sa-month__name">{m.label}</p>
                <table className="sa-month__grid">
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
                              <span className="sa-month__n">{d.day}</span>
                              {d.stamp ? (
                                <span
                                  className="sa-month__stamp"
                                  style={
                                    {
                                      "--ink": paletteFor(d.stamp.colourway).loud[1],
                                      rotate: `${tilt(d.date, 16)}deg`,
                                    } as CSSProperties
                                  }
                                  aria-label={`No. ${d.stamp.issue} stamped`}
                                >
                                  {d.stamp.issue}
                                </span>
                              ) : d.rest ? (
                                <span className="sa-month__rest">rest</span>
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
            <p className="sa-wallcal__key">
              Every stamp is a paper you finished. A missed day stays blank; one rest day a week
              keeps your run going.
            </p>
          </section>
        </div>
      </div>
    </Shell>
  );
}
