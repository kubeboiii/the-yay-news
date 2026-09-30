import { pick } from "@/app/mockups/_data/photos";
import { edition } from "@/app/mockups/_data/sample-edition";
import { Burst } from "@repo/ui/print/burst";
import { Mark } from "@repo/ui/print/mark";
import { credit, Folio, PrintPhoto } from "../_components/print";
import "./back.css";

export default function MidiBack() {
  const { crossword, wordLadder, riddle, yesterday } = edition.puzzles;
  const otters = pick("otters");
  const dog = pick("goldenRetriever");
  const puppy = pick("goldenRetriever", 1);
  const pencil = pick("crossword");

  // The otters play Pip and the retrievers play Pigeon; the otters come back closer for the punchline.
  const cast = [
    { photo: otters, position: "50% 45%" },
    { photo: dog, position: "50% 30%" },
    { photo: otters, position: "22% 40%" },
    { photo: puppy, position: "50% 35%" },
  ];
  const panels = edition.comic.panels.map((line, i) => {
    const [who = "", ...rest] = line.split(": ");
    return { who, text: rest.join(": "), ...(cast[i] ?? { photo: otters, position: "50% 50%" }) };
  });

  const ladderRows = [
    wordLadder.start,
    ...Array.from({ length: wordLadder.steps }, () => ""),
    wordLadder.end,
  ];
  const [forHire, ...ads] = [...edition.classifieds].reverse();

  return (
    <div className="print-sheet-wrap">
      <div className="print-spread">
        {/* ---------------- Page 11: puzzles on lilac ---------------- */}
        <article className="print-sheet print-sheet--bright m5b-left" aria-label="Page 11">
          <Folio page={11} section="Puzzles" />
          <h1 className="m5-display m5b-title">Puzzles</h1>
          <p className="m5b-stand">Pencils out. Ten minutes, tops, and nobody is timing you.</p>

          <section className="m5b-mini" aria-labelledby="mini">
            <h2 id="mini" className="m5-display m5b-h">
              {crossword.title}
            </h2>
            <div className="m5b-grid" role="img" aria-label="A five by five crossword grid">
              {crossword.grid.flatMap((row, r) =>
                row.split("").map((ch, c) => {
                  const n = crossword.numbers[`${r},${c}`];
                  return (
                    <span
                      key={`${r}-${c}`}
                      className={ch === "#" ? "m5b-cell m5b-cell--black" : "m5b-cell"}
                    >
                      {n ? <b>{n}</b> : null}
                    </span>
                  );
                }),
              )}
            </div>
            <div className="m5b-clues">
              <h3>Across</h3>
              <ol>
                {crossword.across.map((c) => (
                  <li key={`a${c.n}`}>
                    <b>{c.n}</b> {c.clue} <i>({c.answer.length})</i>
                  </li>
                ))}
              </ol>
              <h3>Down</h3>
              <ol>
                {crossword.down.map((c) => (
                  <li key={`d${c.n}`}>
                    <b>{c.n}</b> {c.clue} <i>({c.answer.length})</i>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <figure className="m5-pasted print-print m5b-pencil">
            <PrintPhoto photo={pencil} sizes="(max-width: 760px) 80vw, 200px" position="50% 55%" />
            <span className="print-tape m5b-pencil-tape" aria-hidden />
            <figcaption className="m5-credit">{credit(pencil)}</figcaption>
          </figure>

          <section className="m5b-ladder" aria-labelledby="ladder">
            <h2 id="ladder" className="m5-display m5b-h">
              {wordLadder.title}
            </h2>
            <p className="m5b-small">{wordLadder.instructions}</p>
            <ol className="m5b-rungs">
              {ladderRows.map((word, i) => (
                <li key={`${i}-${word}`}>
                  {Array.from({ length: 3 }, (_, k) => (
                    <span key={k} className={word ? "m5b-tile m5b-tile--set" : "m5b-tile"}>
                      {word[k] ?? ""}
                    </span>
                  ))}
                </li>
              ))}
            </ol>
            <p className="m5-note m5b-ladder-note" aria-hidden>
              two steps, promise
            </p>
            <Mark name="arrows-02" className="m5-hm m5b-ladder-arrow" />
          </section>

          <section className="m5b-riddle" aria-labelledby="riddle">
            <h2 id="riddle" className="m5-display m5b-h">
              {riddle.title}
            </h2>
            <p className="m5-display m5b-riddle-q">{riddle.question}</p>
            <details className="m5b-answer">
              <summary>Answer, printed upside down</summary>
              <p className="m5-display">{riddle.answer}</p>
            </details>
            <p className="m5b-yesterday">{yesterday}</p>
          </section>

          <p className="m5-display m5-cross m5b-bye">You’re done for today.</p>
        </article>

        {/* ---------------- Page 12: the back page ---------------- */}
        <article className="print-sheet print-sheet--bright m5b-right" aria-label="Page 12">
          <Folio page={12} section="The back page" />
          <p className="m5-display m5-cross m5-cross--r m5b-bye" aria-hidden>
            You’re done for today.
          </p>

          <section className="m5b-comic" aria-labelledby="comic">
            <div className="m5b-comic-head">
              <h2 id="comic" className="m5-display m5b-h">
                {edition.comic.title}
              </h2>
              <p className="m5-credit">
                Starring otters by {otters.credit} and retrievers by {dog.credit} · unsplash.com
              </p>
            </div>
            <ol className="m5b-panels">
              {panels.map((p, i) => (
                <li key={p.text} className="m5b-panel">
                  <PrintPhoto
                    photo={p.photo}
                    sizes="(max-width: 760px) 45vw, 170px"
                    position={p.position}
                  />
                  <p className={`m5b-bubble ${i % 2 ? "m5b-bubble--r" : ""}`}>
                    <b>{p.who}</b> {p.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="m5b-corrections" aria-labelledby="corrections">
            <h2 id="corrections" className="m5-display m5b-h">
              Corrections
            </h2>
            <div className="m5-body">
              {edition.corrections.map((c) => (
                <p key={c.slice(0, 20)}>{c}</p>
              ))}
            </div>
            <p className="m5b-tomorrow-teaser">
              <b>Tomorrow</b> A postman’s dog who learned every door on the round, and the Mini
              grows a sixth letter.
            </p>
          </section>

          <section className="m5b-classifieds" aria-labelledby="classifieds">
            <h2 id="classifieds" className="m5-display m5b-h">
              Classifieds
            </h2>
            <p className="m5b-small m5b-class-sub">Small ads, free to place and kind to read.</p>
            <div className="m5b-ads">
              {[...ads].reverse().map((ad) => (
                <p key={ad.heading}>
                  <b>{ad.heading.toLowerCase()}.</b> {ad.text}
                </p>
              ))}
              {forHire ? (
                <p className="m5b-ad-boxed print-worn">
                  <b>{forHire.heading.toLowerCase()}.</b> {forHire.text}
                </p>
              ) : null}
            </div>
          </section>

          <div className="m5b-signoff">
            <p className="m5b-tomorrow">See you tomorrow.</p>
            <p className="m5b-colophon">
              The Yay News, Vol. 1, No. 42. A sample edition: every story invented, every photograph
              from unsplash.com and credited where it sits.
            </p>
          </div>
          <Burst
            fill="var(--rose)"
            points={12}
            depth={0.14}
            wobble={1}
            className="m5b-sticker print-worn"
          >
            <p className="m5-display m5b-sticker-text">
              All good
              <br />
              news
            </p>
          </Burst>
        </article>
      </div>
    </div>
  );
}
