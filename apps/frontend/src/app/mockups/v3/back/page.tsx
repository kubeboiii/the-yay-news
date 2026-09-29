import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { Mark } from "@/app/mockups/_shared/mark";
import { Folio, Masthead, MiniMark, Photo, Sheet, Stamp, Tape } from "../_components/parts";

const BLUE = "var(--blue)";
const ORANGE = "var(--orange)";

// Each comic panel pairs a speaker's line with the photo that plays them.
const panels = [
  { photo: pick("otters"), position: "30% 50%" },
  { photo: pick("goldenRetriever"), position: "50% 30%" },
  { photo: pick("otters"), position: "80% 60%" },
  { photo: pick("goldenRetriever", 1), position: "50% 40%" },
];

function splitLine(line: string) {
  const i = line.indexOf(":");
  return i === -1
    ? { who: "", said: line }
    : { who: line.slice(0, i), said: line.slice(i + 1).trim() };
}

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export default function TabloidBack() {
  const { puzzles, corrections, classifieds, comic, signOff } = edition;
  const { crossword, wordLadder, riddle } = puzzles;
  const [signOffHead, ...signOffRest] = signOff.split(". ");
  const [boxedAd, ...plainAds] = [...classifieds].reverse();

  return (
    <Sheet theme="back">
      <Masthead
        eyebrow={<MiniMark section="The back page" page={8} />}
        title="Puzzles & play"
        aside={
          <>
            <p className="tb-kicker">On today&rsquo;s back page:</p>
            <p>
              A five-by-five crossword, a two-step ladder, one fiendish riddle and a pigeon who is
              suspicious of good news. Pencil optional.
            </p>
          </>
        }
        box={
          <>
            <span className="tb-box-num">08</span>
            <span className="tb-box-words">
              Pencils ready
              <small>The back page</small>
            </span>
          </>
        }
      />

      <section className="tb-puzzles" aria-label="Puzzles">
        <article className="tb-tile" aria-labelledby="xw-title" style={{ position: "relative" }}>
          <h2 id="xw-title" className="tb-tile-head tb-cond">
            {crossword.title}
          </h2>
          <p className="tb-note tb-back2-note" aria-hidden>
            start with 1 across
          </p>
          <Mark name="arrows-10" ink={BLUE} className="tb-mark tb-back2-arrow" />
          <div className="tb-xw">
            <div
              className="tb-xw-grid"
              role="img"
              aria-label="A five by five crossword grid with black squares in the middle of rows two and four"
            >
              {crossword.grid.flatMap((row, r) =>
                row.split("").map((ch, c) => {
                  const n = crossword.numbers[`${r},${c}`];
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`tb-xw-cell ${ch === "#" ? "tb-xw-cell--black" : ""}`}
                    >
                      {n ? <span>{n}</span> : null}
                    </div>
                  );
                }),
              )}
            </div>
            <div className="tb-clues">
              <h4>Across</h4>
              <ol>
                {crossword.across.map((c) => (
                  <li key={`a${c.n}`}>
                    <b>{c.n}</b>
                    <span>
                      {c.clue} ({c.answer.length})
                    </span>
                  </li>
                ))}
              </ol>
              <h4>Down</h4>
              <ol>
                {crossword.down.map((c) => (
                  <li key={`d${c.n}`}>
                    <b>{c.n}</b>
                    <span>
                      {c.clue} ({c.answer.length})
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </article>

        <article
          className="tb-tile"
          aria-labelledby="ladder-title"
          style={{ position: "relative" }}
        >
          <h2 id="ladder-title" className="tb-tile-head tb-cond">
            {wordLadder.title}
          </h2>
          <p>{wordLadder.instructions}</p>
          <ol className="tb-ladder">
            <li className="tb-rung tb-rung--end">
              {wordLadder.start.split("").map((ch, i) => (
                <i key={`s${i}`}>{ch}</i>
              ))}
            </li>
            {Array.from({ length: wordLadder.steps }, (_, s) => (
              <li
                key={`step${s}`}
                className="tb-rung"
                aria-label={`Step ${s + 1}, three empty letters`}
              >
                {Array.from({ length: wordLadder.start.length }, (_, i) => (
                  <i key={i} />
                ))}
              </li>
            ))}
            <li className="tb-rung tb-rung--end">
              {wordLadder.end.split("").map((ch, i) => (
                <i key={`e${i}`}>{ch}</i>
              ))}
            </li>
          </ol>
          <Stamp className="tb-back2-stamp2">
            Answers
            <small>in tomorrow&rsquo;s paper</small>
          </Stamp>
        </article>

        <article className="tb-tile" aria-labelledby="riddle-title">
          <h2 id="riddle-title" className="tb-tile-head tb-cond">
            {riddle.title}
          </h2>
          <p className="tb-riddle-q tb-cond">{riddle.question}</p>
          <details className="tb-answer">
            <summary>The answer, printed upside down</summary>
            <span className="tb-answer-flip tb-cond">{riddle.answer}</span>
          </details>
          <p className="tb-yesterday">
            <span className="tb-runin">Yesterday&rsquo;s answer:</span>{" "}
            {puzzles.yesterday.replace(/^Yesterday's riddle: /, "")}
          </p>
        </article>
      </section>

      <section className="tb-comic tb-grow" aria-labelledby="comic-title">
        <div className="tb-comic-head">
          <h2 id="comic-title" className="tb-tile-head tb-cond">
            {comic.title}
          </h2>
          <p className="tb-source">
            A strip in four photographs by {pick("otters").credit}, {pick("goldenRetriever").credit}{" "}
            and {pick("goldenRetriever", 1).credit} · unsplash.com
          </p>
        </div>
        <ol className="tb-comic-panels">
          {comic.panels.map((line, i) => {
            const panel = panels[i] ?? panels[0]!;
            const { who, said } = splitLine(line);
            return (
              <li key={line} className="tb-panel">
                <Photo
                  photo={panel.photo}
                  sizes="(max-width: 760px) 50vw, 250px"
                  position={panel.position}
                />
                <p className="tb-balloon">
                  <b>{who ? titleCase(who) : ""}</b>
                  {said}
                </p>
                {i === 1 ? <Tape className="tb-comic-tape" /> : null}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="tb-band tb-back-band" aria-label="Corrections, classifieds and answers">
        <article className="tb-col tb-body" aria-labelledby="corrections">
          <h2 id="corrections" className="tb-cond tb-h3 tb-colhead">
            Corrections
          </h2>
          {corrections.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </article>

        <article className="tb-col" aria-labelledby="classifieds">
          <h2 id="classifieds" className="tb-cond tb-h3 tb-colhead">
            Classifieds
          </h2>
          <div className="tb-back2-cls">
            {plainAds.reverse().map((ad) => (
              <p key={ad.heading} className="tb-ad-p">
                <b>{titleCase(ad.heading)}.</b> {ad.text}
              </p>
            ))}
            {boxedAd ? (
              <p className="tb-ad-p tb-back2-ad">
                <b>{titleCase(boxedAd.heading)}.</b> {boxedAd.text}
              </p>
            ) : null}
          </div>
        </article>

        <aside className="tb-col" aria-labelledby="share">
          <div className="tb-share">
            <Mark name="stars-14" ink={ORANGE} className="tb-mark tb-over tb-share-stars" />
            <h2 id="share" className="tb-share-head tb-cond">
              Share your answers
            </h2>
            <p>
              Solved the Mini before the kettle boiled? Photograph your page and tag us. The neatest
              handwriting gets printed on Friday.
            </p>
            <p className="tb-share-handle">
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
              </svg>
              @theyaynews
            </p>
          </div>
        </aside>
      </section>

      <section className="tb-signoff2 print-worn" aria-label="Sign-off">
        <p className="tb-signoff2-big tb-wide">{signOffHead}.</p>
        <p className="tb-hand">{signOffRest.join(". ")}</p>
      </section>

      <Folio page={8} section="The back page" />
    </Sheet>
  );
}
