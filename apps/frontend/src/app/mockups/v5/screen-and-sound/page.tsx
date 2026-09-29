import { pick } from "@/app/mockups/_data/photos";
import { edition } from "@/app/mockups/_data/sample-edition";
import { Mark } from "@/app/mockups/_shared/mark";
import { credit, Folio, PrintPhoto } from "../_components/print";
import "./screen.css";

// Invented listings for this page only; every title and venue is fictional.
const listings = [
  {
    time: "Mon 20.00",
    title: "Moonbeam Diner",
    note: "Series 3, episode 1 — the musical one",
    stars: 5,
  },
  {
    time: "Tue 19.30",
    title: "The Very Slow Heist",
    note: "Two tortoises, one lettuce farm",
    stars: 4,
  },
  {
    time: "Wed 21.00",
    title: "Grand Pier Bake-Off",
    note: "The final: meringue on a windy day",
    stars: 4,
  },
  {
    time: "Thu 18.45",
    title: "Choir! Live from the Hall",
    note: "The ballad, plus eleven hymns",
    stars: 5,
  },
  { time: "Sat 10.00", title: "Otter Hour", note: "Sixty minutes of hand-holding", stars: 5 },
];

const tracks = [
  ["Toast of the Town", "3:12"],
  ["Two Eggs, Over the Moon", "2:48"],
  ["Low-Gravity Waltz", "4:05"],
  ["Refill (Reprise)", "1:30"],
  ["The Ballad of the Toaster", "5:41"],
  ["Last Orders on the Dark Side", "3:26"],
];

const rewatches = [
  "The one where the diner loses gravity",
  "A cooking show that is mostly the dog",
  "Every heist film without a villain",
  "The choir documentary, again",
  "Anything with a lighthouse in it",
];

const Stars = ({ n }: { n: number }) => (
  <span className="m5s-stars" role="img" aria-label={`${n} out of 5 stars`}>
    {"★".repeat(n)}
    <span className="m5s-stars-off">{"★".repeat(5 - n)}</span>
  </span>
);

export default function MidiScreenAndSound() {
  const section = edition.sections.find((s) => s.slug === "screen-and-sound");
  const moonbeam = section?.stories[0];
  const choir = section?.stories[1];
  const tv = pick("retroTv");
  const cinema = pick("cinema");
  const vinyl = pick("vinyl", 1);
  const choirPhoto = pick("choir");

  return (
    <div className="print-sheet-wrap">
      <div className="print-spread">
        {/* ---------------- Page 4: the picks, pasted up on blush ---------------- */}
        <article className="print-sheet print-sheet--bright m5s-left" aria-label="Page 4">
          <Folio page={4} section="Screen & Sound" />
          <div className="m5-page m5s-collage">
            <header className="m5s-head">
              <h1 className="m5-display m5s-title">
                Screen &amp;
                <br />
                Sound
              </h1>
              <p className="m5s-sub">Three picks for the week, argued over by the whole desk</p>
            </header>

            <figure className="m5-pasted print-print m5s-tv">
              <PrintPhoto photo={tv} sizes="(max-width: 760px) 90vw, 320px" position="50% 55%" />
              <span className="print-tape m5s-tape-a" aria-hidden />
              <figcaption className="m5-credit">{credit(tv)}</figcaption>
            </figure>
            <p className="m5-note m5s-note-tv" aria-hidden>
              twelve new songs,
              <br />
              and one of them is
              <br />
              sung by the toaster
            </p>
            <Mark name="arrows-07" className="m5-hm m5s-arrow-tv" />

            {moonbeam ? (
              <section className="m5s-pick-one">
                <p className="m5-kicker">Pick one · television</p>
                <h2 className="m5-display m5s-h2">{moonbeam.headline}</h2>
                <p className="m5s-dek">{moonbeam.dek}</p>
                <div className="m5-body m5s-cols">
                  {moonbeam.body.map((p) => (
                    <p key={p.slice(0, 20)}>{p}</p>
                  ))}
                  <p className="m5s-verdict">
                    <Stars n={5} /> Five stars, and a sixth for the toaster.
                  </p>
                </div>
              </section>
            ) : null}

            <figure className="m5-pasted print-print m5s-cinema">
              <PrintPhoto photo={cinema} sizes="(max-width: 760px) 90vw, 300px" />
              <span className="print-tape m5s-tape-b" aria-hidden />
              <figcaption className="m5-credit">{credit(cinema)}</figcaption>
            </figure>
            <figure className="m5-pasted print-print m5s-vinyl">
              <PrintPhoto photo={vinyl} sizes="(max-width: 760px) 90vw, 300px" />
              <span className="print-tape m5s-tape-c" aria-hidden />
              <figcaption className="m5-credit">{credit(vinyl)}</figcaption>
            </figure>
            <p className="m5-note m5s-note-vinyl" aria-hidden>
              pressed in amber,
              <br />
              “so it looks like toast”
            </p>
            <Mark name="arrows-09" className="m5-hm m5s-arrow-vinyl" />
            <Mark name="sketch-24" className="m5-hm m5s-notes" />

            <section className="m5s-pick-two">
              <p className="m5-kicker">Pick two · the trailer</p>
              <h3 className="m5-display m5s-h3">The Very Slow Heist</h3>
              <p className="m5s-mini">
                Two tortoises plan to rob a lettuce farm. The trailer runs four minutes and nobody
                moves more than a metre. Cinemas report standing ovations, slowly. <Stars n={4} />
              </p>
            </section>
            <section className="m5s-pick-three">
              <p className="m5-kicker">Pick three · the record</p>
              <h3 className="m5-display m5s-h3">Songs for Watering Plants, Vol. 2</h3>
              <p className="m5s-mini">
                A quartet recorded it in a greenhouse at dawn. Every track is exactly as long as it
                takes to water a windowsill. <Stars n={5} />
              </p>
            </section>
          </div>
        </article>

        {/* ---------------- Page 5: the choir, on paper ---------------- */}
        <article className="print-sheet print-sheet--bright m5s-right" aria-label="Page 5">
          <Folio page={5} section="Screen & Sound" />
          {/* Bleeds off the top of the page and into the gutter. */}
          <div className="m5s-bleed">
            <PrintPhoto
              photo={choirPhoto}
              sizes="(max-width: 760px) 100vw, 700px"
              position="50% 42%"
            />
          </div>
          <p className="m5-credit m5s-bleed-credit">{credit(choirPhoto)}</p>

          <div className="m5-page m5s-feature">
            {choir ? (
              <section className="m5s-choir">
                <p className="m5-kicker">Pick of the week · music</p>
                <h2 className="m5-display m5s-choir-head">
                  Village choir’s power-ballad cover passes{" "}
                  <span className="m5-ring">
                    10 million
                    <Mark name="ellipse-01" ink="var(--rose-deep)" className="m5-ring-mark" />
                  </span>{" "}
                  streams
                </h2>
                <p className="m5s-dek">{choir.dek}</p>
                <p className="m5-byline">By Harriet Vale, music editor</p>
                <div className="m5s-choir-grid">
                  <div className="m5-body m5s-cols">
                    {choir.body.map((p) => (
                      <p key={p.slice(0, 20)}>{p}</p>
                    ))}
                    <p>
                      The choir has since been asked to perform it at two weddings, a ferry launch
                      and a retirement party for a lollipop lady. They have said yes to all four.
                    </p>
                  </div>
                  <blockquote className="m5-display m5s-pull">
                    “The drummer should be proud.”
                    <cite className="m5-byline">The choir’s oldest member, 91</cite>
                  </blockquote>
                </div>
              </section>
            ) : null}

            <div className="m5s-lists">
              <section aria-labelledby="now-showing">
                <h3 id="now-showing" className="m5-display m5s-list-head">
                  Now showing
                </h3>
                <ul className="m5s-now">
                  {listings.map((l) => (
                    <li key={l.title}>
                      <span className="m5s-time">{l.time}</span>
                      <span>
                        <b>{l.title}</b> <Stars n={l.stars} />
                        <i>{l.note}</i>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="side-a">
                <h3 id="side-a" className="m5-display m5s-list-head">
                  Side A
                </h3>
                <ol className="m5s-tracks">
                  {tracks.map(([t, d], i) => (
                    <li key={t}>
                      <span>A{i + 1}</span>
                      <b>{t}</b>
                      <span>{d}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="rewatch">
                <h3 id="rewatch" className="m5-display m5s-list-head">
                  Five comfort rewatches
                </h3>
                <ol className="m5s-rewatch">
                  {rewatches.map((r, i) => (
                    <li key={r}>
                      <b className="m5-display">{i + 1}</b>
                      <span>{r}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
