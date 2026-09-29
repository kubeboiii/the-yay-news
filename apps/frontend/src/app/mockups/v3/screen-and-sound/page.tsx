import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { Burst } from "@/app/mockups/_shared/burst";
import { Mark } from "@/app/mockups/_shared/mark";
import { Bars, Folio, Masthead, MiniMark, Photo, Sheet, Tape } from "../_components/parts";

const BLUE = "var(--blue)";
const ORANGE = "var(--orange)";

const board = ["NOW SHOWING", "MOONBEAM DINER · S3"];

const listings = [
  {
    time: "Wed 18:00",
    where: "Film · Screen 2",
    title: "The Sandcastle Years",
    note: "Trailer of the week: forty wordless seconds of competitive sand sculpture.",
    stars: 4,
  },
  {
    time: "Sat 15:00",
    where: "Live · The church hall",
    title: "Choir, encore",
    note: "Forty singers return. Bring a hymn book to prop your phone on.",
    stars: 5,
  },
  {
    time: "Sun 11:00",
    where: "Radio · Longwave",
    title: "The Quiet Hour",
    note: "Sixty minutes of a lighthouse keeper reading the shipping forecast, slowly.",
    stars: 3,
  },
];

const rewatches = [
  "Moonbeam Diner, season one",
  "The Great Garden Swap",
  "Detective Dog, Retired",
  "Tiny Island Vets",
  "The Longest Picnic (director’s cut)",
];

const tracks: [string, string, string][] = [
  ["A1", "Hall reverb test", "0:12"],
  ["A2", "Power ballad (key change)", "4:51"],
  ["B1", "Tea-break outtake", "1:03"],
];

function Stars({ n }: { n: number }) {
  return (
    <p className="tb-stars" aria-label={`${n} out of 5 stars`}>
      <span aria-hidden>
        {"★".repeat(n)}
        {"☆".repeat(5 - n)}
      </span>
    </p>
  );
}

export default function TabloidScreenAndSound() {
  const section = edition.sections.find((s) => s.slug === "screen-and-sound");
  const moonbeam = section?.stories[0];
  const choir = section?.stories[1];
  if (!section || !moonbeam || !choir) return null;

  return (
    <Sheet theme="screen">
      <Masthead
        eyebrow={<MiniMark section="Screen & Sound" page={2} />}
        title="Screen & Sound"
        aside={
          <>
            <p className="tb-kicker">Tonight&rsquo;s bill:</p>
            <p>
              <span className="tb-runin">Moonbeam Diner, 19:30. </span>
              Twelve new songs, one of them sung by a toaster. Popcorn is free, forever.
            </p>
          </>
        }
        box={
          <>
            <span className="tb-box-num">02</span>
            <span className="tb-box-words">
              Admit
              <br />
              one
              <small>Shows, films &amp; music</small>
            </span>
          </>
        }
      />

      <div className="tb-letterboard" aria-hidden>
        <div className="tb-letterboard-rows">
          {board.map((line) => (
            <div key={line} className="tb-letterboard-row">
              {line.split("").map((ch, i) => (
                <span
                  key={`${line}-${i}`}
                  className={`tb-letter ${ch === " " ? "tb-letter--gap" : ""}`}
                >
                  {ch === " " ? "" : ch}
                </span>
              ))}
            </div>
          ))}
        </div>
        <span className="tb-letterboard-tag tb-cond">
          12 new
          <br />
          songs
        </span>
      </div>

      <Photo
        photo={pick("cinema")}
        sizes="(max-width: 760px) 100vw, 1000px"
        className="tb-grow tb-photo--open"
        position="50% 88%"
        priority
      >
        <Burst fill={ORANGE} points={22} depth={0.12} className="tb-sticker tb-screen2-sticker">
          <span aria-hidden>
            <span className="tb-sticker-big">{moonbeam.sticker}</span>
            <span className="tb-sticker-hand">one song is sung by a toaster</span>
          </span>
        </Burst>
        <div className="tb-onphoto tb-screen2-onphoto">
          <p className="tb-kicker">{moonbeam.kicker} · season three:</p>
          <h2 className="tb-splash">
            <Bars>{moonbeam.headline}</Bars>
          </h2>
        </div>
      </Photo>

      <section className="tb-band tb-screen2-band" aria-label="Screen and Sound stories">
        <article className="tb-col">
          <p className="tb-byline">
            By our television critic, <b>on the sofa</b>
          </p>
          <p className="tb-dek">{moonbeam.dek}</p>
          {moonbeam.body.map((para, i) => (
            <p key={para}>
              {i === 0 ? <span className="tb-runin">Back on the Moon. </span> : null}
              {para}
            </p>
          ))}
          <p className="tb-source">
            Source: {moonbeam.source} · Photo: {pick("cinema").credit} · unsplash.com
          </p>
          <blockquote className="tb-pull">
            <p className="tb-cond">
              &ldquo;We rewrote the toaster&rsquo;s ballad nine times. It kept making the cast
              cry.&rdquo;
            </p>
            <footer className="tb-pull-by">The show&rsquo;s creators, roughly</footer>
          </blockquote>
          <div className="tb-mini" style={{ position: "relative" }}>
            <Mark name="sketch-24" ink={BLUE} className="tb-mark tb-screen2-music" />
            <h4 className="tb-cond tb-mini-head">Earworm of the week</h4>
            <p>
              <span className="tb-runin">A whistled sea shanty </span>
              recorded by a ferry&rsquo;s deckhand has been added to 40,000 &ldquo;calm&rdquo;
              playlists. He says he was only trying to remember the tune.
            </p>
          </div>
          <div className="tb-rewatch">
            <h3 className="tb-kicker tb-colhead">Top 5 comfort rewatches:</h3>
            <ol>
              {rewatches.map((title, i) => (
                <li key={title}>
                  <span>{i + 1}</span>
                  <span>{title}</span>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <article className="tb-col">
          <p className="tb-kicker tb-colhead">{choir.kicker}:</p>
          <h3 className="tb-cond tb-h3-sm tb-colhead">{choir.headline}</h3>
          <div className="tb-filmstrip tb-screen2-strip">
            <div className="tb-sprockets" aria-hidden>
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <Photo photo={pick("choir")} sizes="(max-width: 760px) 100vw, 360px" />
            <div className="tb-sprockets" aria-hidden>
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <Tape />
          </div>
          <p className="tb-credit-line">Photo: {pick("choir").credit} · unsplash.com</p>
          <p className="tb-dek">
            Forty singers, one church hall, and a key change that has the internet in{" "}
            <span className="tb-ring">
              tears.
              <Mark name="ellipse-01" ink={ORANGE} className="tb-mark" />
            </span>
          </p>
          {choir.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
          <div className="tb-choir-row">
            <div className="tb-label" aria-hidden>
              <span className="tb-label-top">Side A · 33⅓</span>
              <span className="tb-label-big">10,000,000</span>
              <span>plays</span>
            </div>
            <ol className="tb-tracks" aria-label="The choir's recording, track by track">
              {tracks.map(([side, name, len]) => (
                <li key={side}>
                  <span>{side}</span>
                  <span>{name}</span>
                  <span>{len}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="tb-source">Source: {choir.source}</p>
        </article>

        <aside className="tb-col" aria-labelledby="now-showing">
          <div className="tb-colhead">
            <p className="tb-kicker">Listings:</p>
            <h3 id="now-showing" className="tb-cond tb-h3">
              Now showing
            </h3>
          </div>
          <div className="tb-ticket tb-one-ticket">
            <div className="tb-ticket-main">
              <p className="tb-ticket-meta">TV · Screen 1 · Tue 19:30</p>
              <h4 className="tb-ticket-title tb-cond">Moonbeam Diner: the musical</h4>
              <p className="tb-ticket-note">Twelve songs, one toaster, several tissues.</p>
              <Stars n={5} />
            </div>
            <div className="tb-ticket-stub" aria-hidden>
              <span>Admit one</span>
              <b>S3</b>
              <span>No. 042</span>
            </div>
          </div>
          <ul>
            {listings.map((l) => (
              <li key={l.title} className="tb-listing">
                <p className="tb-listing-time">{l.time}</p>
                <div>
                  <p className="tb-ticket-meta">{l.where}</p>
                  <h4 className="tb-listing-title tb-cond">{l.title}</h4>
                  <p>{l.note}</p>
                  <Stars n={l.stars} />
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <Folio page={2} section="Screen & Sound" />
    </Sheet>
  );
}
