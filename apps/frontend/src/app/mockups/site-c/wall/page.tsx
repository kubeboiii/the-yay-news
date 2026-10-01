import Link from "next/link";
import { binderCards } from "@/app/mockups/site-a/_shared/cards";
import { loadSite, shortDate } from "@/app/mockups/site-a/_shared/data";
import { tilt } from "@/app/mockups/site-a/_shared/hand";
import { YayCard } from "@/features/cards/card-view";
import { STICKERS } from "@/features/habits/catalogue";
import { stickersOf } from "@/features/habits/core";
import { habitFonts } from "@/features/habits/fonts";
import { StickerArt } from "@/features/habits/sticker-art";
import "@/features/habits/stickers.css";
import { Shell } from "../_ui/chrome";
import { Balloon, Caption, Panel, ToonPip } from "../_ui/comic";

export default async function Wall({ searchParams }: PageProps<"/mockups/site-c/wall">) {
  const data = await loadSite(searchParams);
  const sp = await searchParams;
  const month = sp.dump === "month";
  const recap = month ? data.month : data.week;
  const cards = binderCards();
  const owned = new Set(stickersOf(data.eventsDone).map((s) => s.sticker));
  const stills = [
    { n: recap.papers, l: "papers finished" },
    { n: recap.puzzles, l: "puzzles cracked" },
    { n: recap.stickers, l: "stickers earned" },
    { n: recap.best, l: "best run" },
  ];
  return (
    <Shell
      data={data}
      place="wall"
      finished
      note="The wall is one comic page, and every panel is one collection with its own title and one big action. Pip appears in each panel to say what it's for, so a first-time reader is guided without a tutorial. Panels stack in reading order on a phone."
    >
      <h1 className="sc-wall__h sc-inked">Your wall</h1>
      <div className="sc-wallgrid">
        <Panel ground="s2" className="sc-w-clips" label="Clippings">
          <Caption>Clippings</Caption>
          <ToonPip pose="hang" className="sc-w-clips__pip" />
          <Balloon tail="r" className="sc-w-clips__say">
            Tear out a story and it lands here!
          </Balloon>
          <ul>
            {data.clippings.slice(0, 4).map((c) => (
              <li key={c.slug} style={{ rotate: `${tilt(c.slug, 4)}deg` }}>
                <Link href="/mockups/site-c/today" className="sc-snap">
                  {c.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a pressed print
                    <img src={c.photo} alt={c.alt} />
                  ) : null}
                  <span>{c.headline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel ground="l2" dots className="sc-w-cards" label="Yay Attax binder">
          <Caption>Yay Attax binder</Caption>
          <div className="sc-w-cards__page">
            {cards.map((c) => (
              <div key={c.id} className="sc-w-cards__sleeve">
                <YayCard card={c} still />
              </div>
            ))}
            {[0, 1, 2].map((k) => (
              <div key={k} className="sc-w-cards__sleeve sc-w-cards__sleeve--empty">
                ?
              </div>
            ))}
          </div>
          <Link href="/mockups/site-c/wall?scratch=1" className="sc-btn sc-btn--big sc-w-cards__go">
            Scratch your card!
            <span>1 waiting · fills a ? slot</span>
          </Link>
        </Panel>

        <Panel ground="s0" className="sc-w-stars" label="Star book">
          <Caption>Star book</Caption>
          <p className="sc-w-stars__run">
            <span className="sc-inked">{data.streakDone.current}</span> days in a row
          </p>
          <ol>
            {data.stamps.slice(-10).map((s) => (
              <li key={s.issue}>
                <svg viewBox="0 0 40 40" aria-hidden focusable="false">
                  <path
                    d="M20 3 L24.5 14.5 L37 15 L27 23 L30.5 35.5 L20 28.5 L9.5 35.5 L13 23 L3 15 L15.5 14.5 Z"
                    fill="var(--sc-l1)"
                    stroke="var(--sc-ink)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{shortDate(s.date).replace(/^\w+ /, "")}</span>
              </li>
            ))}
          </ol>
          <Link href="/mockups/site-c/pile" className="sc-w-link">
            See the whole star chart
          </Link>
        </Panel>

        <Panel ground="paper" className={`sc-w-stickers ${habitFonts}`} label="Sticker album">
          <Caption>Sticker album</Caption>
          <ul>
            {STICKERS.slice(0, 9).map((st) => {
              const have = owned.has(st.id);
              return (
                <li key={st.id} className={have ? "is-owned" : "is-missing"}>
                  <span className="sc-w-stickers__art" style={{ aspectRatio: `1 / ${st.ratio}` }}>
                    {have ? <StickerArt id={st.id} issue={data.edition.issueNumber} /> : "?"}
                  </span>
                  <span className="sc-w-stickers__l">
                    {have ? st.label : `Earn it: ${st.earnedBy}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel ground="l3" className="sc-w-recap" label={month ? "Month in Yay" : "Weekly dump"}>
          <Caption>Previously on The Yay News…</Caption>
          <div className="sc-w-recap__top">
            <h2 className="sc-w-recap__h">{month ? "This month in Yay" : "This week's dump"}</h2>
            <nav className="sc-w-recap__switch" aria-label="Recap period">
              <Link href="/mockups/site-c/wall" aria-current={!month ? "page" : undefined}>
                Week
              </Link>
              <Link
                href="/mockups/site-c/wall?dump=month"
                aria-current={month ? "page" : undefined}
              >
                Month
              </Link>
            </nav>
          </div>
          <p className="sc-w-recap__when">{recap.label}</p>
          <ol className="sc-w-recap__stills">
            {stills.map((s, i) => {
              const c = data.clippings[(i + 2) % data.clippings.length];
              return (
                <li key={s.l} style={{ rotate: `${[-3, 2, -2, 3][i]}deg` }}>
                  <span className="sc-w-recap__pic">
                    {c?.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- a pressed print
                      <img src={c.photo} alt="" />
                    ) : null}
                    <span className="sc-w-recap__n">{s.n}</span>
                  </span>
                  <span className="sc-w-recap__l">{s.l}</span>
                </li>
              );
            })}
          </ol>
          <button type="button" className="sc-btn">
            Make it a story picture
          </button>
        </Panel>

        <Panel ground="s4" className="sc-w-move" label="Moving phones">
          <Caption>Moving day</Caption>
          <ToonPip
            pose="confused"
            className="sc-w-move__pip"
            label="Pip, confused, holding a torn page"
          />
          <Balloon tail="l" className="sc-w-move__say">
            New phone? Don&rsquo;t leave me behind!
          </Balloon>
          <div className="sc-w-move__actions">
            <button type="button" className="sc-btn">
              Pack up my wall
            </button>
            <Link href="/mockups/site-c/wall?unpack=1" className="sc-w-link">
              I&rsquo;ve got a code
            </Link>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}
