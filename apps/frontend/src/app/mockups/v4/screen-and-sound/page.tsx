import type { Metadata } from "next";
import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import {
  Across,
  Anno,
  Credit,
  Folio,
  Head,
  Page,
  Photo,
  Print,
  Ring,
  RunningHead,
  Spread,
  Zig,
} from "../_components/zine";

export const metadata: Metadata = { title: "Screen & Sound · Mini Zine · Mockup" };

const section = edition.sections.find((s) => s.slug === "screen-and-sound");
const [moonbeam, choir] = section?.stories ?? [];

const tv = pick("retroTv");
const popcorn = pick("popcorn");
const choirPhoto = pick("choir");

function splitRing(text: string, word: string) {
  const i = text.indexOf(word);
  return i === -1 ? [text, "", ""] : [text.slice(0, i), word, text.slice(i + word.length)];
}

// Invented, obviously fictional listings to fill the section.
const tracks = [
  { n: "A1", title: "Warm-up hum (in B flat, mostly)", time: "0:42" },
  { n: "A2", title: "The Power Ballad", time: "4:58" },
  { n: "A3", title: "Key change, from the back row", time: "0:19" },
  { n: "A4", title: "Tea break (field recording)", time: "11:02" },
];

const listings = [
  {
    kind: "Trailer of the week",
    title: "Snail Mail",
    stars: 5,
    text: "A documentary about the slowest postal round in the country. Ninety seconds of trailer, zero of them rushed.",
  },
  {
    kind: "Comfort rewatch",
    title: "The Great Village Bake-Off (1998)",
    stars: 4,
    text: "Still the only final ever decided by a dog walking past the scones.",
  },
  {
    kind: "Podcast",
    title: "Good Gates",
    stars: 4,
    text: "Two retired postmen rate the country’s nicest garden gates. Episode 40: a gate that squeaks in tune.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="z-stars" role="img" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n)}
      {"☆".repeat(5 - n)}
    </span>
  );
}

export default function ScreenAndSoundPage() {
  if (!moonbeam || !choir) return null;
  const [before, ringed, after] = splitRing(choir.headline, "10 million");
  return (
    <Spread label="Screen and Sound spread">
      <Page ground="pink" side="left">
        <RunningHead>The Yay Zine · Screen &amp; Sound</RunningHead>
        <Across side="left" height={31}>
          <Head
            as="h1"
            top="Now showing · shows, films & music"
            bottom="Screen & Sound"
            bottomSize={23}
          />
        </Across>

        <div className="z-film" style={{ marginTop: "calc(var(--u) * 3)" }}>
          <div className="z-film__frames">
            <Photo
              photo={tv}
              ratio="16 / 10"
              sizes="(max-width: 900px) 66vw, 400px"
              position="50% 60%"
              priority
            />
            <Photo photo={popcorn} ratio="4 / 5" sizes="(max-width: 900px) 33vw, 200px" />
          </div>
          <p className="z-film__edge" aria-hidden>
            <span>YAY 400</span>
            <span>▸ 23A</span>
            <span>▸ 24</span>
            <span>▸ 24A</span>
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <p className="z-cap">
            <span className="z-cap__credit">
              Photos: {tv.credit}; {popcorn.credit} · unsplash.com
            </span>
          </p>
          <Anno
            arrow="arrows-04"
            arrowFirst={false}
            arrowSize={[6, 11]}
            arrowStyle={{ rotate: "20deg" }}
            style={{
              right: "calc(var(--u) * 2)",
              top: "calc(var(--u) * 1)",
              ["--r" as string]: "-4deg",
            }}
          >
            extra butter,
            <br />
            obviously
          </Anno>
        </div>

        <article className="z-ss__story">
          <div>
            <p className="z-kicker">Television — new season</p>
            <h2 className="z-h2">{moonbeam.headline}</h2>
            <p className="z-dek">{moonbeam.dek}</p>
            <p className="z-byline">By Ottilie Frame</p>
            <div className="z-body" style={{ marginTop: "calc(var(--u) * 2.5)" }}>
              {moonbeam.body.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <p className="z-stamp print-worn z-sold" aria-hidden>
              Sold out
              <small>all sofas</small>
            </p>
            <div className="z-ticket" aria-label="Ticket: Moonbeam Diner season three, episode one">
              <div className="z-ticket__main">
                <span>Admit one · Sofa, row A</span>
                <b>Moonbeam Diner</b>
                <span>Season 3 · Ep. 1 · The Musical</span>
                <span>12 songs · 1 toaster</span>
              </div>
              <div className="z-ticket__stub" aria-hidden>
                No. 000042
              </div>
            </div>
          </div>
        </article>

        <div className="z-pull z-ss__pull">
          <Zig short />
          <blockquote>
            <p>“It kept making the voice cast cry, so we rewrote it nine times.”</p>
          </blockquote>
          <Zig short />
        </div>

        <Folio n={3} />
      </Page>

      <Page ground="lilac" side="right">
        <RunningHead>The Yay Zine · Screen &amp; Sound</RunningHead>

        <Across side="right" height={31}>
          <Head
            as="div"
            top="Now showing · shows, films & music"
            bottom="Screen & Sound"
            bottomSize={23}
          />
        </Across>

        <article className="z-choir">
          <p className="z-kicker">Music — recorded in a church hall</p>
          <h2 className="z-h2 z-choir__head">
            {before}
            <Ring>{ringed}</Ring>
            {after}
          </h2>
          <div className="z-choir__grid">
            <Print
              photo={choirPhoto}
              ratio="4 / 3"
              sizes="(max-width: 900px) 100vw, 300px"
              position="50% 40%"
              rotate={-3}
              tape={["tl", "br"]}
              note="the key change, live"
            />
            <div>
              <p className="z-dek">{choir.dek}</p>
              <div className="z-body" style={{ marginTop: "calc(var(--u) * 2)" }}>
                {choir.body.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
              </div>
              <p className="z-byline">By Ottilie Frame</p>
              <Credit photo={choirPhoto} />
            </div>
          </div>
        </article>

        <div className="z-ss__lower">
          <section aria-labelledby="set-list">
            <h3 className="z-label" id="set-list">
              The church hall sessions
            </h3>
            <div className="z-vinyl">
              <div className="z-vinyl__disc" aria-hidden>
                <div className="z-vinyl__label">
                  <span>Side A</span>
                  <i />
                  <span>33⅓ rpm</span>
                </div>
              </div>
              <p className="z-dek">Side A, as it went on the phone. Bring tissues for A3.</p>
            </div>
            <ol className="z-tracks">
              {tracks.map((t) => (
                <li key={t.n}>
                  <span>{t.n}</span>
                  <b>{t.title}</b>
                  <span>{t.time}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="now-showing">
            <h3
              className="z-label"
              id="now-showing"
              style={{ marginBottom: "calc(var(--u) * 2.5)" }}
            >
              Now showing
            </h3>
            <ul className="z-listings">
              {listings.map((l) => (
                <li key={l.title}>
                  <p className="z-kicker">{l.kind}</p>
                  <div className="z-listings__head">
                    <h4 className="z-h3" style={{ margin: 0 }}>
                      {l.title}
                    </h4>
                    <Stars n={l.stars} />
                  </div>
                  <p>{l.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <Folio n={4} />
      </Page>
    </Spread>
  );
}
