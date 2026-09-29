import { pick } from "@/app/mockups/_data/photos";
import { edition } from "@/app/mockups/_data/sample-edition";
import { Burst } from "@/app/mockups/_shared/burst";
import { Mark } from "@/app/mockups/_shared/mark";
import { credit, Folio, PrintPhoto } from "../_components/print";
import "./gaming.css";

// The review's scores, invented like everything else on the page.
const scores = [
  { label: "Cosiness", score: "10" },
  { label: "Pastries", score: "9" },
  { label: "Customers, very specific", score: "8" },
  { label: "Pettability, update pending", score: "6" },
];

const alsoThisWeek = [
  {
    run: "Speedrun.",
    text: "A player finishes a farming game in record time by being kind to every chicken.",
  },
  {
    run: "Found.",
    text: "An attic console still holds a 1998 save, parked politely outside the final boss.",
  },
  {
    run: "One button.",
    text: "A co-op puzzle game adds a single new button. It just says “well done”.",
  },
];

export default function MidiGaming() {
  const section = edition.sections.find((s) => s.slug === "gaming");
  const bread = section?.stories[0];
  const fishing = section?.stories[1];
  const catWide = pick("bakeryCat");
  const cat = pick("bakeryCat", 1);

  return (
    <div className="print-sheet-wrap">
      <div className="print-spread">
        {/* ---------------- Page 6: mint, the photograph and the first half of the word ---------------- */}
        <article className="print-sheet print-sheet--bright m5g-left" aria-label="Page 6">
          <Folio page={6} section="Gaming" />
          <div className="m5g-bleed">
            <PrintPhoto
              photo={catWide}
              priority
              sizes="(max-width: 760px) 100vw, 700px"
              position="46% 40%"
            />
          </div>
          <p className="m5-credit m5g-bleed-credit">{credit(catWide)}</p>

          <p className="m5g-slip print-torn" aria-hidden>
            regulation
            <br />
            bakery hat
          </p>
          <span className="print-tape m5g-slip-tape" aria-hidden />
          <Mark name="arrows-11" ink="var(--butter)" className="m5-hm m5g-slip-arrow" />

          <h1 className="m5-display m5-cross m5g-word print-misreg">
            <span className="m5-sr">Gaming: </span>Press play
          </h1>

          <div className="m5g-under">
            <p className="m5g-stand">
              Two people in a spare bedroom made a game about a cat who runs a bakery. It outsold
              three blockbusters in its first week. The review is over the page.
            </p>
            <section className="m5g-score" aria-labelledby="hi">
              <h2 id="hi" className="m5g-score-label">
                High score of the day
              </h2>
              <p className="m5-display m5g-score-num">1,000,000</p>
              <p className="m5g-score-cap">
                pastries served by one player, who says she “just likes the little bell”.
              </p>
            </section>
          </div>
        </article>

        {/* ---------------- Page 7: the review ---------------- */}
        <article className="print-sheet print-sheet--bright m5g-right" aria-label="Page 7">
          <Folio page={7} section="Gaming" />
          <p className="m5-display m5-cross m5-cross--r m5g-word print-misreg" aria-hidden>
            Press play
          </p>

          {bread ? (
            <section className="m5g-review" aria-labelledby="gotw">
              <p className="m5-kicker m5g-kick">Game of the week · indie</p>
              <h2 id="gotw" className="m5-display m5g-title">
                Bread &amp; Butter
              </h2>
              <p className="m5g-dek">{bread.dek}</p>
              <p className="m5-byline m5g-by">Reviewed by Sam Okafor</p>

              <figure className="m5-pasted print-print m5g-print">
                <PrintPhoto photo={cat} sizes="(max-width: 760px) 90vw, 280px" position="50% 38%" />
                <span className="print-tape m5g-print-tape" aria-hidden />
                <figcaption className="m5-credit">{credit(cat)}</figcaption>
              </figure>
              <Burst
                fill="var(--butter-deep)"
                points={12}
                depth={0.14}
                wobble={1}
                className="m5g-stamp print-worn"
              >
                <p className="m5g-stamp-text">
                  <b className="m5-display">9</b>
                  <span>out of ten</span>
                </p>
              </Burst>

              <div className="m5g-right-col">
                <dl className="m5g-scores">
                  {scores.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd className="m5-display">
                        {s.score === "10" ? (
                          <span className="m5-ring m5g-ring">
                            {s.score}
                            <Mark name="ellipse-01" ink="var(--ink)" className="m5-ring-mark" />
                          </span>
                        ) : (
                          s.score
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="m5-body m5g-body">
                  {bread.body.map((p) => (
                    <p key={p.slice(0, 20)}>{p}</p>
                  ))}
                  <p>
                    The best-selling pastry is a cinnamon swirl, which takes eleven minutes to bake
                    because the cat keeps sitting on it.
                  </p>
                </div>
                <p className="m5g-info">
                  Bread &amp; Butter · Two Spoons, a studio of two · every screen in the house · £8
                  · no timers, no losing, one very soft bell
                </p>
              </div>
            </section>
          ) : null}

          <blockquote className="m5-display m5g-pull">
            “The most requested feature is the ability to pet the customers.”
            <cite className="m5-byline">The developers, who are working on it</cite>
          </blockquote>

          <div className="m5g-bottom">
            {fishing ? (
              <section className="m5g-patch print-torn" aria-labelledby="patch">
                <p className="m5-kicker">Patch notes · version 25.0.1</p>
                <h2 id="patch" className="m5-display m5g-patch-head">
                  {fishing.headline}
                </h2>
                <p className="m5g-patch-dek">{fishing.dek}</p>
                <ul className="m5g-patch-list">
                  <li>
                    <b>+</b>
                    <span>You can fish now.</span>
                  </li>
                  <li>
                    <b>+</b> Added one pond, one rod and one very patient heron.
                  </li>
                  <li>
                    <b>~</b> A fish that should not exist has been caught. We are looking into it.
                    (We are not.)
                  </li>
                </ul>
              </section>
            ) : null}
            <section className="m5g-also" aria-labelledby="also">
              <h2 id="also" className="m5-display m5g-also-head">
                Also this week
              </h2>
              {alsoThisWeek.map((a) => (
                <p key={a.run}>
                  <b>{a.run}</b> {a.text}
                </p>
              ))}
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
