import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";
import { Folio, Photo, RunningHead, STRETCH, Zigzag } from "../_components/parts";

const listings = [
  { time: "7.00", title: "Moonbeam Diner", note: "S3 E1 · “Toast of the Town”. The musical one." },
  { time: "8.15", title: "Pond Life Live", note: "Two hours of ducks. No commentary. Bliss." },
  { time: "9.00", title: "The Allotment", note: "Series finale. The marrow is finally weighed." },
  {
    time: "10.30",
    title: "The Kindest Heist",
    note: "Late film. A gang breaks in to return things (U).",
  },
];

const rewatches = [
  {
    n: "One",
    label: ["The Great", "Village Bake"],
    note: "Nobody is ever voted off. They all get cake.",
  },
  {
    n: "Two",
    label: ["Moonbeam", "Diner, S1"],
    note: "Catch up before the musical. You have until 7pm.",
  },
  { n: "Three", label: ["Lighthouse", "Keepers"], note: "A calm documentary about very calm men." },
  { n: "Four", label: ["Nan Reviews", "Biscuits"], note: "Six series, no biscuit below a seven." },
  { n: "Five", label: ["Pond Life", "Live, 2024"], note: "The year the heron nearly waved." },
];

const tracks = [
  { title: "Warm-up scales (hall door open)", time: "0:48" },
  { title: "The Power Ballad", time: "5:12" },
  { title: "The Key Change (reprise)", time: "1:03" },
  { title: "Tea & biscuits (interval)", time: "0:30" },
];

export default function ScreenAndSound() {
  const section = edition.sections.find((s) => s.slug === "screen-and-sound");
  const [moonbeam, choir] = section?.stories ?? [];
  const tv = pick("retroTv");
  const choirPhoto = pick("choir");
  const seat = pick("cinema", 1);

  return (
    <div className="yn-sheet-wrap">
      <article className="yn-sheet yn-inside yn-theme-screen">
        <RunningHead
          page={2}
          section="Screen & Sound"
          tagline="Shows, films, music and the odd trailer"
        />

        <Zigzag word="now showing" />

        <section className="ss-top" aria-label="Television">
          <article className="ss-lead">
            {/* The film strip is pasted on at a slight angle and taped at two corners. */}
            <figure className="yn-filmstrip ss-strip">
              <span className="print-tape ss-strip-tape-l" aria-hidden />
              <span className="print-tape ss-strip-tape-r" aria-hidden />
              <Photo
                photo={tv}
                className="ss-frame"
                position="center 62%"
                sizes="(max-width: 760px) 100vw, 740px"
                priority
              />
              <div className="yn-film-edge" aria-hidden>
                <span>YAY 400</span>
                <span>▸ 12A</span>
                <span>13</span>
                <span>▸ 13A</span>
                <span>YAY 400</span>
              </div>
            </figure>
            <p className="yn-note ss-note" aria-hidden>
              the toaster
              <br />
              sings in this one
            </p>
            <Mark name="arrows-10" ink="var(--neon-pink)" className="yn-mark-abs ss-note-arrow" />
            <Burst fill="var(--neon-yellow)" points={22} depth={0.1} className="ss-sticker">
              <span className="yn-burst-text text-[calc(var(--u)*6)]">
                12 new
                <br />
                songs!
              </span>
            </Burst>

            <div className="ss-lead-text">
              <div>
                <p className="yn-kicker">Television</p>
                <h2 className="yn-chunk yn-hed">
                  Cult cartoon Moonbeam Diner returns with a{" "}
                  <span className="yn-mark yn-mark-pop">musical</span> episode
                </h2>
                <p className="yn-byline mt-[calc(var(--u)*3)]">By Jo Pennock, screen editor</p>
                <p className="ss-rating">
                  <span className="yn-stars" role="img" aria-label="Five out of five">
                    ★★★★★
                  </span>
                  <span className="yn-hand">five toasters out of five</span>
                </p>
              </div>
              <div>
                <p className="yn-dek">{moonbeam?.dek}</p>
                <div className="yn-body">
                  {moonbeam?.body.map((p) => (
                    <p key={p.slice(0, 16)}>{p}</p>
                  ))}
                  <p>
                    Episode one airs tonight at seven. Tissues are advised for the toaster&rsquo;s
                    number, which comes twenty minutes in.
                  </p>
                </div>
                <p className="yn-jump">Tonight&rsquo;s listings, right</p>
              </div>
            </div>
          </article>

          <aside className="ss-listings" aria-label="Tonight's listings">
            <div className="yn-letterboard" aria-hidden>
              <p className="small">tonight</p>
              <p>Now</p>
              <p>Showing</p>
            </div>
            <h3 className="yn-label">What&rsquo;s on tonight</h3>
            <ul className="ss-list">
              {listings.map((l) => (
                <li key={l.time}>
                  <time>{l.time}</time>
                  <span>
                    <b>{l.title}</b> — {l.note}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="yn-label">Five comfort rewatches</h3>
            <ol className="yn-numbered">
              {rewatches.map((r) => (
                <li key={r.n}>
                  <div className="n">
                    <span className="yn-chunk">{r.n}</span>
                    <span>
                      {r.label[0]}
                      <br />
                      {r.label[1]}
                    </span>
                  </div>
                  <p>{r.note}</p>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <Zigzag word="on repeat" />

        <section className="ss-choir" aria-label="Music">
          {/* A print pasted half over a block of pink, the way a paste-up collage is built. */}
          <div className="ss-collage">
            <div className="ss-collage-ink" aria-hidden />
            <figure className="ss-choir-print print-print">
              <span className="print-tape ss-choir-tape" aria-hidden />
              <Photo
                photo={choirPhoto}
                className="ss-choir-photo"
                tag={false}
                sizes="(max-width: 760px) 100vw, 320px"
              />
              <figcaption className="yn-caption">St Aldhelm&rsquo;s hall, take one</figcaption>
            </figure>
            <p className="ss-collage-credit">Photo: {choirPhoto.credit} · unsplash.com</p>
          </div>
          <article className="ss-choir-text">
            <p className="yn-kicker">Music</p>
            <h2 className="yn-chunk yn-hed">
              Village choir&rsquo;s power-ballad cover passes{" "}
              <span className="ss-ringed">
                10 million
                <Mark name="ellipse-01" className="ss-ring" style={STRETCH} />
              </span>{" "}
              streams
            </h2>
            <p className="yn-dek">{choir?.dek}</p>
            <p className="yn-byline">By Priya Lal · Little Wickham</p>
            <div className="yn-body">
              <p>
                <span className="yn-dateline">Little Wickham —</span> {choir?.body[0]}
              </p>
              <p>{choir?.body[1]}</p>
            </div>
            <div className="ss-tracks">
              <h3 className="yn-label">Side A</h3>
              <ol>
                {tracks.map((t) => (
                  <li key={t.title}>
                    <span>{t.title}</span>
                    <span>{t.time}</span>
                  </li>
                ))}
              </ol>
            </div>
          </article>
          {/* The record is too big for its column and slides off the edge of the sheet. */}
          <div className="ss-record" aria-hidden>
            <div className="yn-vinyl ss-vinyl">
              <span className="side">Side A</span>
              <span>Little Wickham</span>
              <span className="mt-[calc(var(--u)*7)]">Village Choir</span>
              <span className="rpm">33⅓ rpm</span>
            </div>
            <Mark name="sketch-35" className="yn-mark-abs ss-note-1" />
            <Mark name="sketch-34" ink="var(--neon-pink)" className="yn-mark-abs ss-note-2" />
          </div>
        </section>

        <Zigzag word="worth a look" />

        <section className="ss-row" aria-label="Also in Screen & Sound">
          <article className="yn-ticket ss-ticket">
            <div className="yn-ticket-ink print-worn" aria-hidden />
            <div className="yn-ticket-main">
              <Photo photo={seat} tag={false} sizes="(max-width: 760px) 100vw, 170px" />
              <div>
                <p className="admit">Admit one · Trailer of the week</p>
                <h3 className="yn-chunk yn-hed-sm">Lighthouse Keeper&rsquo;s Holiday</h3>
                <p className="yn-body">
                  Two minutes and eleven seconds of a retired keeper waving at ferries. The ferries
                  wave back. Out in spring.
                </p>
                <p className="seat">
                  <span>Screen 3</span>
                  <span>Row K</span>
                  <span>Seat 23</span>
                </p>
              </div>
            </div>
            <div className="yn-ticket-stub" aria-hidden>
              <p>
                Admit one
                <small>No. 004217</small>
              </p>
            </div>
          </article>

          <figure className="ss-quote">
            <Mark name="stars-19" ink="var(--neon-pink)" className="yn-mark-abs ss-quote-mark" />
            <blockquote className="yn-pullquote">
              &ldquo;Nobody told us about the key change. We just went for it.&rdquo;
            </blockquote>
            <figcaption className="yn-pullquote-by">Second soprano, aged 91</figcaption>
          </figure>

          <aside className="ss-ad">
            <p className="yn-ad-label">Advertisement</p>
            <p className="yn-chunk">The toaster&rsquo;s ballad, now on cassette</p>
            <p className="yn-body">Side B is the toaster humming. Moonbeam Diner Records, £0.</p>
          </aside>
        </section>

        <Folio page={2} section="Screen & Sound" />
      </article>
      <p className="yn-note-foot">
        Sample edition · all stories invented · photos: {tv.credit}, {choirPhoto.credit},{" "}
        {seat.credit} on Unsplash
      </p>
    </div>
  );
}
