import { pick } from "@/app/mockups/_data/photos";
import { edition } from "@/app/mockups/_data/sample-edition";
import { Burst } from "@/app/mockups/_shared/burst";
import { Mark } from "@/app/mockups/_shared/mark";
import { credit, Folio, PrintPhoto } from "./_components/print";
import "./front.css";

const contents = [
  { name: "Screen & Sound", line: "A toaster’s ballad and a choir’s key change", page: "4" },
  { name: "Gaming", line: "The cat who runs a bakery, and the charts", page: "6" },
  { name: "Sports", line: "A pit-crew dance, rehearsed all season", page: "8" },
  { name: "Tech", line: "A robot that finally understands corners", page: "9" },
  { name: "Money & Culture", line: "100,000 coffees, paid forward", page: "10" },
  { name: "Puzzles", line: "The Mini, a ladder and a riddle", page: "11" },
];

export default function MidiFront() {
  const { lead, numberOfTheDay, weather, quoteOfTheDay } = edition;
  const octopus = pick("octopus");
  const coffee = pick("coffee");
  const cafe = edition.sections.find((s) => s.slug === "money")?.stories[0];
  const [first, p2, p3, , p5] = lead.body;

  return (
    <div className="print-sheet-wrap">
      <div className="print-spread">
        {/* ---------------- Cover ---------------- */}
        <article className="print-sheet print-sheet--bright m5f-cover" aria-label="Cover">
          <div className="m5f-top">
            <p className="m5f-stamp print-worn">Sample edition</p>
            <p className="m5f-issue">
              Vol. 1, No. 42 · Tuesday 30 September 2026 · {edition.price}
            </p>
          </div>

          <h1 className="m5-display m5f-mast">The Yay News</h1>
          <div className="m5f-rules" aria-hidden />

          <nav className="m5f-inside" aria-label="Inside this edition">
            <span className="m5f-inside-label" aria-hidden>
              Inside
            </span>
            <ul>
              <li>
                <span>
                  A toaster sings the{" "}
                  <span className="m5-ring">
                    ballad
                    <Mark name="ellipse-01" className="m5-ring-mark" />
                  </span>{" "}
                  of the season <b>4</b>
                </span>
              </li>
              <li>
                <span>
                  The cat who runs a bakery, and the charts <b>6</b>
                </span>
              </li>
              <li>
                <span>
                  Five letters, one Mini and not a single frown <b>11</b>
                </span>
              </li>
            </ul>
          </nav>

          {/* The photograph runs off three edges of the sheet. */}
          <div className="m5f-bleed">
            <PrintPhoto
              photo={octopus}
              priority
              position="46% 38%"
              sizes="(max-width: 760px) 100vw, 740px"
            />
          </div>

          <Burst
            fill="var(--butter-deep)"
            points={13}
            depth={0.13}
            wobble={1}
            className="m5f-sticker print-worn"
          >
            <p className="m5f-sticker-text">
              <span className="m5-display">It dances!</span>
              <small>And nobody knows why. Page 2</small>
            </p>
          </Burst>

          <div className="m5f-spec">
            <div className="m5f-spec-l">
              <p className="m5-display m5f-no">No. 42</p>
              <dl>
                <dt>Format</dt>
                <dd>Midi, 220 × 310 mm</dd>
                <dt>Reading time</dt>
                <dd>{edition.readMinutes} minutes, finishable</dd>
                <dt>Stories</dt>
                <dd>All of them invented</dd>
              </dl>
              <p className="m5-caption m5f-cover-cap">
                Cover: an octopus, mid-routine, 1,200 metres down.{" "}
                <span className="m5-credit">{credit(octopus)}</span>
              </p>
            </div>
            <div className="m5f-box print-worn">
              <b className="m5-display">100%</b>
              <span>good news, 0% doom</span>
            </div>
          </div>
        </article>

        {/* ---------------- Page 2: the lead ---------------- */}
        <article className="print-sheet print-sheet--bright" aria-label="Page 2">
          <Folio page={2} section="Discoveries" />
          <div className="m5-page m5f-lead">
            <aside className="m5f-side" aria-label="Today in brief">
              <section>
                <h3>The number of the day</h3>
                <p className="m5-display m5f-num">{numberOfTheDay.value}</p>
                <p>{numberOfTheDay.caption}.</p>
              </section>
              <section className="m5f-weather">
                <h3>The weather, roughly</h3>
                <Mark name="sketch-51" className="m5-hm m5f-cloud" />
                <p className="m5-display m5f-weather-head">{weather.headline}</p>
                <p>{weather.detail}</p>
              </section>
              <section>
                <p className="m5-display m5f-quote">“{quoteOfTheDay.text}”</p>
                <p className="m5-byline">{quoteOfTheDay.by}</p>
              </section>
              {cafe ? (
                <section className="m5f-clip print-torn">
                  <PrintPhoto photo={coffee} sizes="(max-width: 760px) 90vw, 160px" />
                  <h3>Also today, page 10</h3>
                  <h4 className="m5-display">{cafe.headline}</h4>
                  <p className="m5-credit">{credit(coffee)}</p>
                </section>
              ) : null}
            </aside>

            <div className="m5f-main">
              <p className="m5-kicker">Discoveries · the deep sea</p>
              <p className="m5-display m5f-hero" aria-hidden>
                Meet
                <br />
                Disco
                <br />
                Pete
              </p>

              <figure className="m5-pasted print-print m5f-still">
                <PrintPhoto
                  photo={octopus}
                  position="78% 72%"
                  sizes="(max-width: 760px) 80vw, 200px"
                />
                <span className="print-tape m5f-still-tape" aria-hidden />
                <figcaption className="m5-credit">Frame 4,210 · {octopus.credit}</figcaption>
              </figure>
              <p className="m5-note m5f-still-note" aria-hidden>
                this is the
                <br />
                spin
              </p>
              <Mark name="arrows-08" className="m5-hm m5f-still-arrow" />

              <h2 className="m5-display m5f-head">{lead.headline}</h2>
              <p className="m5f-dek">{lead.dek}</p>
              <p className="m5-byline m5f-byline">
                By the Yay science desk <i>· at sea, 30 September</i>
              </p>
              <div className="m5-body m5f-body">
                <p className="m5f-drop">{first}</p>
                <p>{p2}</p>
                <p>{p3}</p>
                <p>
                  The species hasn’t been formally identified yet, which means it doesn’t have a
                  name. The team has received several hundred suggestions from the public. The
                  front-runner is currently <span className="m5-highlight">“Disco Pete”</span>.
                </p>
                <p>{p5}</p>
              </div>

              <blockquote className="m5-display m5f-pull">
                “Every time, somebody in the room started{" "}
                <span className="m5f-under">
                  humming
                  <Mark name="brush-03" ink="var(--apricot-deep)" className="m5f-under-mark" />
                </span>
                .”
              </blockquote>

              <section className="m5f-contents" aria-label="Inside today">
                <h3 className="m5-display">Inside today</h3>
                <ol>
                  {contents.map((c) => (
                    <li key={c.name}>
                      <i className="m5-display">{c.page}</i>
                      <b>{c.name}</b>
                      <span>{c.line}</span>
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
