import Link from "next/link";
import type { CSSProperties } from "react";
import { binderCards } from "@/app/mockups/site-a/_shared/cards";
import { loadSite, shortDate } from "@/app/mockups/site-a/_shared/data";
import { YayCard } from "@/features/cards/card-view";
import { STICKERS } from "@/features/habits/catalogue";
import { stickersOf } from "@/features/habits/core";
import { habitFonts } from "@/features/habits/fonts";
import { StickerArt } from "@/features/habits/sticker-art";
import "@/features/habits/stickers.css";
import { GoButton, Heading, Mascot, RansomHeading, Scrap, Sticker, tilt } from "@/features/riot";
import { Shell } from "../_ui/chrome";

export default async function Wall({ searchParams }: PageProps<"/mockups/site-b/wall">) {
  const data = await loadSite(searchParams);
  const sp = await searchParams;
  const month = sp.dump === "month";
  const recap = month ? data.month : data.week;
  const cards = binderCards();
  const ownedIds = stickersOf(data.eventsDone).map((s) => s.sticker);
  const owned = new Set(ownedIds);
  const known = STICKERS.filter((s) => owned.has(s.id));
  const missing = STICKERS.filter((s) => !owned.has(s.id)).slice(0, 4);
  const frames = [
    { n: recap.papers, l: "papers" },
    { n: recap.puzzles, l: "puzzles" },
    { n: recap.stickers, l: "stickers" },
    { n: recap.best, l: "best run" },
    { n: recap.clippings.length, l: "kept" },
  ];
  return (
    <Shell
      data={data}
      place="wall"
      finished
      note="The wall is a zine you made by reading. One flat band of plate A carries the cut-outs; everything else sits straight on paper under plain condensed heads. Only the page title is ransom."
    >
      <div className="sb-wall">
        <div className="sb-wall__head">
          <RansomHeading text="MY WALL" seed="my-wall" className="sb-pile__h" />
          <p className="sb-pile__sub">
            {data.clippings.length} stories ripped out, {known.length} stickers, a{" "}
            {data.streakDone.current}-day run.
          </p>
        </div>
        <Mascot pose="lights" className="sb-wall__odin" />

        <section className="sb-clips" aria-labelledby="clip-h">
          <Heading id="clip-h" className="sb-h">
            Ripped out
          </Heading>
          <ul>
            {data.clippings.slice(0, 5).map((c, i) => (
              <li
                key={c.slug}
                className={i === 0 ? "is-hero" : undefined}
                style={i === 0 ? { rotate: `${tilt(c.slug, 3) || -2}deg` } : undefined}
              >
                <Link href="/mockups/site-b/today" className="sb-clip">
                  <span className="sb-clip__pic">
                    {c.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- a pressed print
                      <img src={c.photo} alt={c.alt} />
                    ) : null}
                  </span>
                  <span className="sb-clip__kick">{c.kicker}</span>
                  <span className="sb-clip__head">{c.headline}</span>
                </Link>
                {i === 0 ? <span className="sb-clip__tape" aria-hidden /> : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="sb-sleeves" aria-labelledby="cards-h">
          <Heading id="cards-h" className="sb-h">
            Yay Attax
          </Heading>
          <div className="sb-sleeves__page">
            {cards.map((c) => (
              <div key={c.id} className="sb-sleeve">
                <YayCard card={c} still />
              </div>
            ))}
            {[0, 1, 2].map((k) => (
              <div key={k} className="sb-sleeve sb-sleeve--empty">
                <span>slot {cards.length + k + 1}</span>
              </div>
            ))}
          </div>
          <GoButton
            href="/mockups/site-b/wall?scratch=1"
            sub="fills the next empty slot"
            className="sb-sleeves__go"
          >
            Scratch 1 card
          </GoButton>
        </section>

        <section className="sb-punch" aria-labelledby="punch-h">
          <Heading id="punch-h" className="sb-h">
            Punch card
          </Heading>
          <p className="sb-punch__run">
            {data.streakDone.current} in a row · best {data.streakDone.best}
          </p>
          <ol className="sb-punch__holes">
            {data.stamps.slice(-12).map((s) => (
              <li key={s.issue}>
                <span className="sb-punch__hole" aria-hidden />
                <span>{shortDate(s.date).replace(/^\w+ /, "")}</span>
              </li>
            ))}
          </ol>
          <Link href="/mockups/site-b/pile" className="sb-punch__more">
            All the dates on the stamp tour
          </Link>
        </section>

        <section className={`sb-lid ${habitFonts}`} aria-labelledby="lid-h">
          <Heading id="lid-h" className="sb-h">
            Sticker bomb
          </Heading>
          <div className="sb-lid__lid">
            <ul className="sb-lid__bomb">
              {known.map((st, i) => (
                <li
                  key={st.id}
                  style={
                    {
                      rotate: `${tilt(st.id, 18)}deg`,
                      left: `${[4, 34, 62, 14, 48, 74, 28, 58][i % 8]}%`,
                      top: `${[6, 2, 10, 46, 40, 50, 70, 74][i % 8]}%`,
                      width: `${Math.max(st.w * 5.4, 60)}px`,
                    } as CSSProperties
                  }
                >
                  <span className="sb-lid__art" style={{ aspectRatio: `1 / ${st.ratio}` }}>
                    <StickerArt id={st.id} issue={data.edition.issueNumber} />
                  </span>
                  <span className="rt-sr">{st.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="sb-lid__still">Still to get:</p>
          <ul className="sb-lid__todo">
            {missing.map((m) => (
              <li key={m.id}>
                <b>{m.label}</b> for {m.earnedBy}
              </li>
            ))}
          </ul>
        </section>

        <section className="sb-film" aria-labelledby="film-h">
          <div className="sb-film__top">
            <Heading id="film-h" className="sb-h">
              {month ? "Month in yay" : "Photo dump"}
            </Heading>
            <nav className="sb-film__switch" aria-label="Photo dump period">
              <Link href="/mockups/site-b/wall" aria-current={!month ? "page" : undefined}>
                Week
              </Link>
              <Link
                href="/mockups/site-b/wall?dump=month"
                aria-current={month ? "page" : undefined}
              >
                Month
              </Link>
            </nav>
            <p className="sb-film__when">{recap.label}</p>
          </div>
          <ol className="sb-film__strip">
            {frames.map((f, i) => {
              const c = data.clippings[(i + 1) % data.clippings.length];
              return (
                <li key={f.l}>
                  <span className="sb-film__frame">
                    {c?.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- a pressed print
                      <img src={c.photo} alt="" />
                    ) : null}
                    <span className="sb-film__n">{f.n}</span>
                  </span>
                  <span className="sb-film__l">
                    {String(i + 12)}A · {f.l}
                  </span>
                </li>
              );
            })}
          </ol>
          <GoButton tone="paper">Post the dump</GoButton>
        </section>

        <Scrap
          seed="smuggle"
          as="aside"
          ground="white"
          edge="zigzag"
          sides={["top"]}
          className="sb-smuggle"
        >
          <Sticker seed="smug" ground="a" pinned className="sb-smuggle__sticker">
            new phone?
          </Sticker>
          <Heading as="h2" className="sb-h">
            Smuggle your wall out
          </Heading>
          <p>
            Everything on this wall, packed into one code. Type it on the new phone. No account.
          </p>
          <div className="sb-smuggle__row">
            <GoButton>Pack it</GoButton>
            <GoButton tone="quiet" href="/mockups/site-b/wall?unpack=1">
              I&rsquo;ve got a code
            </GoButton>
          </div>
        </Scrap>
      </div>
    </Shell>
  );
}
