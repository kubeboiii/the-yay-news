import Link from "next/link";
import type { CSSProperties } from "react";
import { binderCards } from "@/app/mockups/site-a/_shared/cards";
import { loadSite, shortDate } from "@/app/mockups/site-a/_shared/data";
import { tilt } from "@/app/mockups/site-a/_shared/hand";
import { paletteFor } from "@/app/mockups/site-a/_shared/palette";
import { Pip } from "@/app/mockups/site-a/_shared/pip";
import { YayCard } from "@/features/cards/card-view";
import { STICKERS } from "@/features/habits/catalogue";
import { stickersOf } from "@/features/habits/core";
import { habitFonts } from "@/features/habits/fonts";
import { StickerArt } from "@/features/habits/sticker-art";
import "@/features/habits/stickers.css";
import { Shell } from "../_ui/chrome";
import { FairyLights } from "../_ui/lights";
import { Stamp, Sticker, Tape } from "../_ui/kit";

export default async function Wall({ searchParams }: PageProps<"/mockups/site-a/wall">) {
  const data = await loadSite(searchParams);
  const sp = await searchParams;
  const month = sp.dump === "month";
  const recap = month ? data.month : data.week;
  const cards = binderCards();
  const owned = new Set(stickersOf(data.eventsDone).map((s) => s.sticker));
  const sheet = STICKERS.slice(0, 9);
  const recent = data.stamps.slice(-14);
  const tapes = ["var(--sa-s0)", "var(--sa-s2)", "var(--sa-s4)", "var(--sa-s1)", "var(--sa-s3)"];
  const dump = [
    { n: recap.papers, label: recap.papers === 1 ? "paper read" : "papers read" },
    { n: recap.puzzles, label: "puzzles solved" },
    { n: recap.stickers, label: "stickers" },
    { n: recap.best, label: "best run" },
  ];
  return (
    <Shell
      data={data}
      place="wall"
      scene="bedroom"
      finished
      note="The wall is your bedroom wall: everything you've kept is a real object in a fixed spot (clippings top left, binder right, stamps by the door), so you learn where things live. Each object has one clear action on it, written on it."
    >
      <FairyLights />
      <Pip pose="hang" className="sa-wall__pip" inks={{ cap: "var(--sa-l1)" }} />
      <h1 className="sa-wall__h">
        Your wall
        <span>everything you tore out, stamped and stuck</span>
      </h1>

      <div className="sa-wall">
        <section className="sa-clips" aria-labelledby="clips-h">
          <h2 id="clips-h" className="sa-label" style={{ rotate: "-3deg" }}>
            Clippings
          </h2>
          <ul>
            {data.clippings.slice(0, 4).map((c, i) => (
              <li key={c.slug} style={{ rotate: `${tilt(c.slug, 5)}deg` } as CSSProperties}>
                <Link href="/mockups/site-a/today" className="sa-polaroid">
                  {c.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a pressed print
                    <img src={c.photo} alt={c.alt} />
                  ) : null}
                  <span className="sa-polaroid__cap">{c.headline}</span>
                </Link>
                <Tape ink={tapes[i % tapes.length]} className="sa-polaroid__tape" />
              </li>
            ))}
          </ul>
        </section>

        <section className="sa-binder" aria-labelledby="binder-h">
          <h2 id="binder-h" className="sa-label" style={{ rotate: "2deg" }}>
            Yay Attax binder
          </h2>
          <div className="sa-binder__book">
            <div className="sa-binder__page">
              {cards.map((c) => (
                <div key={c.id} className="sa-sleeve">
                  <YayCard card={c} still />
                </div>
              ))}
              {[0, 1, 2].map((k) => (
                <div key={k} className="sa-sleeve sa-sleeve--empty">
                  <span>empty sleeve</span>
                </div>
              ))}
            </div>
            <span className="sa-binder__rings" aria-hidden />
          </div>
          <Link href="/mockups/site-a/wall?scratch=1" className="sa-binder__cta">
            <Sticker shape="burst" ink="var(--sa-l0)" seed="scratch" className="sa-binder__sticker">
              1 scratch card waiting
            </Sticker>
            <span className="sa-binder__ctatext">Scratch it to fill a sleeve</span>
          </Link>
        </section>

        <section className="sa-card" aria-labelledby="stamps-h">
          <h2 id="stamps-h" className="sa-card__h">
            Loyalty card
          </h2>
          <p className="sa-card__run">
            <b>{data.streakDone.current}</b> days in a row · best {data.streakDone.best}
          </p>
          <ol className="sa-card__grid">
            {recent.map((s) => (
              <li key={s.issue}>
                <span
                  className="sa-card__stamp"
                  style={
                    {
                      "--ink": paletteFor(s.colourway).loud[0],
                      rotate: `${tilt(s.date, 14)}deg`,
                    } as CSSProperties
                  }
                >
                  {s.issue}
                </span>
                <span className="sa-card__day">{shortDate(s.date).replace(/^\w+ /, "")}</span>
              </li>
            ))}
          </ol>
          <Link href="/mockups/site-a/pile" className="sa-card__more">
            See every stamp on the calendar
          </Link>
        </section>

        <section className={`sa-sheet ${habitFonts}`} aria-labelledby="sheet-h">
          <h2 id="sheet-h" className="sa-label" style={{ rotate: "-2deg" }}>
            Sticker sheet
          </h2>
          <ul className="sa-sheet__grid">
            {sheet.map((st) => {
              const have = owned.has(st.id);
              return (
                <li key={st.id} className={have ? "is-owned" : "is-missing"}>
                  <span className="sa-sheet__art" style={{ aspectRatio: `1 / ${st.ratio}` }}>
                    {have ? <StickerArt id={st.id} issue={data.edition.issueNumber} /> : null}
                  </span>
                  <span className="sa-sheet__label">
                    {have ? st.label : `Earned by ${st.earnedBy}`}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="sa-sheet__tip">Peel one and stick it on any page of the paper.</p>
        </section>

        <section className="sa-dump" aria-labelledby="dump-h">
          <div className="sa-dump__head">
            <h2 id="dump-h" className="sa-label" style={{ rotate: "1.5deg" }}>
              {month ? "Month in Yay" : "Weekly dump"}
            </h2>
            <nav className="sa-dump__switch" aria-label="Photo dump period">
              <Link href="/mockups/site-a/wall" aria-current={!month ? "page" : undefined}>
                This week
              </Link>
              <Link
                href="/mockups/site-a/wall?dump=month"
                aria-current={month ? "page" : undefined}
              >
                This month
              </Link>
            </nav>
          </div>
          <p className="sa-dump__when">{recap.label}</p>
          <ul className="sa-dump__pics">
            {dump.map((d, i) => {
              const c = data.clippings[(i + 2) % data.clippings.length];
              return (
                <li key={d.label} style={{ rotate: `${[-6, 4, -2, 7][i]}deg` }}>
                  {c?.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a pressed print
                    <img src={c.photo} alt="" />
                  ) : null}
                  <span className="sa-dump__n">{d.n}</span>
                  <span className="sa-dump__l">{d.label}</span>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="sa-pass__btn sa-dump__save"
            style={{ "--tk": "var(--sa-l4)" } as CSSProperties}
          >
            Save it as a story picture
          </button>
        </section>

        <section className="sa-box" aria-labelledby="box-h">
          <div className="sa-box__lid" aria-hidden />
          <div className="sa-box__body">
            <Stamp seed="fragile" ink="var(--sa-ink)" className="sa-box__stamp">
              this way up
            </Stamp>
            <h2 id="box-h" className="sa-box__h">
              New phone?
            </h2>
            <p>Pack your whole wall into a box: stamps, clippings, cards and stickers.</p>
            <div className="sa-box__row">
              <button
                type="button"
                className="sa-pass__btn"
                style={{ "--tk": "var(--sa-paper)" } as CSSProperties}
              >
                Pack it up
              </button>
              <Link href="/mockups/site-a/wall?unpack=1" className="sa-btn sa-btn--quiet">
                Unpack a box
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
