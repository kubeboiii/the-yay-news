import { edition } from "@/app/mockups/_data/sample-edition";
import { type Photo as PhotoT, pick } from "@/app/mockups/_data/photos";
import { Mark } from "@repo/ui/print/mark";
import { Folio, Photo, RunningHead, Stamp, Zigzag } from "../_components/parts";

/** Splits a comic line like "PIP: Hello" into the speaker and what they said. */
function splitLine(line: string) {
  const i = line.indexOf(":");
  return i < 0
    ? { who: "", said: line }
    : { who: line.slice(0, i).trim(), said: line.slice(i + 1).trim() };
}

const titleCase = (w: string) => w.charAt(0) + w.slice(1).toLowerCase();

export default function BackPage() {
  const { puzzles, corrections, classifieds, comic, signOff } = edition;
  const { crossword, wordLadder, riddle } = puzzles;

  const otters = pick("otters");
  const dog = pick("goldenRetriever");
  const puppy = pick("goldenRetriever", 1);
  const lighthouse = pick("lighthouse");
  // Pip is the otters, Pigeon is the dog. The cast alternates, so the photos do too.
  const cast: { photo: PhotoT; position: string; side: "left" | "right" }[] = [
    { photo: otters, position: "center 60%", side: "left" },
    { photo: dog, position: "center 35%", side: "right" },
    { photo: otters, position: "20% 70%", side: "left" },
    { photo: puppy, position: "center 40%", side: "right" },
  ];

  const rungs = [
    wordLadder.start,
    ...Array.from({ length: wordLadder.steps }, () => ""),
    wordLadder.end,
  ];

  // Somebody has already started the crossword: the first two letters of 1 across, in pencil.
  const pencilled: Record<string, string> = { "0,0": "H", "0,1": "E" };

  const [signFirst, signSecond] = signOff.split(". ");

  return (
    <div className="yn-sheet-wrap">
      <article className="yn-sheet yn-inside yn-theme-back">
        <RunningHead
          page={8}
          section="The Back Page"
          tagline="Puzzles, small print, and the bit where you’re done"
        />

        <Zigzag word="the funnies" />

        <section aria-labelledby="comic-title">
          <div className="bk-comic-title">
            <h2 id="comic-title" className="yn-chunk">
              {comic.title}
            </h2>
            <p className="yn-caption">
              In which two friends read the paper.{" "}
              <span className="yn-credit">
                Photos: {otters.credit}, {dog.credit}, {puppy.credit}
              </span>
            </p>
          </div>
          <ol className="bk-strip">
            {comic.panels.map((line, i) => {
              const { who, said } = splitLine(line);
              const panel = cast[i];
              if (!panel) return null;
              return (
                <li key={line} className="bk-panel">
                  <Photo
                    photo={panel.photo}
                    position={panel.position}
                    tag={false}
                    sizes="(max-width: 760px) 50vw, 280px"
                  />
                  <p className={`yn-balloon ${panel.side === "right" ? "right" : ""}`}>
                    <span className="who">{titleCase(who)}</span>
                    <span className="said">{said}</span>
                  </p>
                </li>
              );
            })}
          </ol>
        </section>

        <Zigzag word="puzzles" />

        <section className="bk-puzzles" aria-label="Puzzles">
          <div className="bk-xword-wrap">
            <h2 className="yn-chunk bk-head">{crossword.title}</h2>
            <div className="yn-xword" role="img" aria-label="A five by five crossword grid">
              {crossword.grid.flatMap((row, r) =>
                [...row].map((ch, c) => {
                  const n = crossword.numbers[`${r},${c}`];
                  const pencil = pencilled[`${r},${c}`];
                  return (
                    <div key={`${r}-${c}`} className={ch === "#" ? "block" : undefined}>
                      {n ? <span>{n}</span> : null}
                      {pencil ? <i className="bk-pencil">{pencil}</i> : null}
                    </div>
                  );
                }),
              )}
            </div>
            <p className="yn-note bk-note" aria-hidden>
              started this on the bus
            </p>
            <Mark name="arrows-07" className="yn-mark-abs bk-note-arrow" />
          </div>

          <div className="bk-clues">
            <h3>Across</h3>
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
            <h3>Down</h3>
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
            <p className="bk-yesterday">
              <span className="yn-kicker">Yesterday&rsquo;s answer</span>
              {puzzles.yesterday.replace("Yesterday's riddle: ", "")}
            </p>
          </div>

          <div className="bk-side">
            <div className="bk-side-ink print-worn" aria-hidden />
            <div className="bk-ladder">
              <h2 className="yn-chunk bk-head">{wordLadder.title}</h2>
              <p className="yn-body">{wordLadder.instructions}</p>
              <ol
                aria-label={`From ${wordLadder.start} to ${wordLadder.end} in ${wordLadder.steps} steps`}
              >
                {rungs.map((word, i) => (
                  <li key={`rung-${i}`}>
                    {[0, 1, 2].map((k) => (
                      <span key={k}>{word[k] ?? ""}</span>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bk-riddle">
              <p className="yn-kicker">{riddle.title}</p>
              <p className="yn-chunk">{riddle.question}</p>
              <p className="yn-body">
                A clue: it has eighty-eight of them, and would rather be played than opened.
              </p>
              <details>
                <summary>Give up? Turn it over</summary>
                <p className="answer">{riddle.answer}.</p>
              </details>
            </div>
          </div>
        </section>

        <Zigzag word="small print" />

        <section className="bk-small" aria-label="Corrections and classifieds">
          <div className="bk-corrections">
            <h2 className="yn-chunk bk-head">Corrections and clarifications</h2>
            <div className="yn-body">
              {corrections.map((c) => (
                <p key={c.slice(0, 16)}>{c}</p>
              ))}
            </div>
            <p className="yn-jump">
              Spotted a mistake that was too kind? Tell the readers&rsquo; editor.
            </p>
          </div>
          <div className="bk-classifieds">
            <h2 className="yn-chunk bk-head">Classifieds</h2>
            <ul>
              {classifieds.map((c) => (
                <li key={c.heading} className={c.heading === "FOR HIRE" ? "has-print" : undefined}>
                  <h3 className="yn-chunk yn-caps">{c.heading}</h3>
                  <p>{c.text}</p>
                  {c.heading === "FOR HIRE" ? (
                    <figure className="bk-lighthouse print-print">
                      <span className="print-tape bk-lighthouse-tape" aria-hidden />
                      <Photo
                        photo={lighthouse}
                        tag={false}
                        sizes="(max-width: 760px) 40vw, 120px"
                      />
                    </figure>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The sign-off is the page's grid-breaker: set too big for the sheet and cropped by it. */}
        <section className="bk-signoff" aria-label="Sign-off">
          <div className="bk-signoff-ink" aria-hidden />
          <p className="yn-chunk bk-signoff-small">{signFirst}.</p>
          <p className="yn-chunk bk-signoff-big">{signSecond}</p>
          <Stamp className="bk-stamp">
            All
            <br />
            done
          </Stamp>
          <Mark name="stars-06" className="yn-mark-abs bk-stars" />
        </section>

        <Folio page={8} section="The back page" />
      </article>
      <p className="yn-note-foot">
        Sample edition · all stories invented · photos: {otters.credit}, {dog.credit},{" "}
        {puppy.credit}, {lighthouse.credit} on Unsplash
      </p>
    </div>
  );
}
