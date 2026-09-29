import type { Metadata } from "next";
import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import {
  Anno,
  Folio,
  Head,
  Page,
  Photo,
  Ring,
  RunningHead,
  Spread,
  Tape,
} from "../_components/zine";

export const metadata: Metadata = { title: "Back page · Mini Zine · Mockup" };

const { crossword, wordLadder, riddle, yesterday } = edition.puzzles;

const panelPhotos = [
  { photo: pick("otters"), position: "30% 50%" },
  { photo: pick("goldenRetriever"), position: "50% 30%" },
  { photo: pick("otters"), position: "52% 48%", zoom: 2.4 },
  { photo: pick("goldenRetriever", 1), position: "50% 40%" },
];

function splitLine(line: string) {
  const i = line.indexOf(":");
  return i === -1
    ? { who: "", said: line }
    : { who: line.slice(0, i), said: line.slice(i + 1).trim() };
}

const signOffRest = edition.signOff.split(". ")[1] ?? "";

export default function BackPage() {
  const cols = crossword.grid[0]?.length ?? 5;
  return (
    <Spread label="Back page spread">
      <Page ground="butter" side="left">
        <RunningHead>The Yay Zine · The back page</RunningHead>
        <Head as="h1" top="Pencils out, it’s the back page" bottom="Puzzles" bottomSize={20} />

        <section aria-labelledby="xw-title">
          <div className="z-xw z-offset-block">
            <h2 className="z-xw__side" id="xw-title">
              <span>The</span>
              <span>{crossword.title.replace(/^The /, "")}</span>
              <span>Crossword</span>
            </h2>
            <div
              className="z-grid"
              role="img"
              aria-label={`A ${cols} by ${crossword.grid.length} crossword grid with four black squares`}
            >
              {crossword.grid.flatMap((row, r) =>
                [...row].map((ch, c) => {
                  const n = crossword.numbers[`${r},${c}`];
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`z-grid__cell ${ch === "#" ? "z-grid__cell--black" : ""}`}
                    >
                      {n ? <sup>{n}</sup> : null}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          <div className="z-clues">
            <div>
              <h3 className="z-label">Across</h3>
              <ol>
                {crossword.across.map((c) => (
                  <li key={c.n}>
                    <b>{c.n}</b>
                    <span>
                      {c.clue} ({c.answer.length})
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="z-label">Down</h3>
              <ol>
                {crossword.down.map((c) => (
                  <li key={c.n}>
                    <b>{c.n}</b>
                    <span>
                      {c.clue} ({c.answer.length})
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <div className="z-puzz">
          <section aria-labelledby="ladder">
            <h2 className="z-h3" id="ladder">
              {wordLadder.title}
            </h2>
            <p style={{ marginTop: "calc(var(--u) * 1.5)" }}>{wordLadder.instructions}</p>
            <div className="z-ladder" role="img" aria-label="SAD, then two blank rungs, then JOY">
              <div className="z-ladder__row z-ladder__row--given">
                {[...wordLadder.start].map((l, i) => (
                  <span key={`s${i}`}>{l}</span>
                ))}
              </div>
              {Array.from({ length: wordLadder.steps }, (_, r) => (
                <div className="z-ladder__row" key={`r${r}`}>
                  {[...wordLadder.start].map((_, i) => (
                    <span key={`b${r}${i}`} />
                  ))}
                </div>
              ))}
              <div className="z-ladder__row z-ladder__row--given">
                {[...wordLadder.end].map((l, i) => (
                  <span key={`e${i}`}>{l}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="z-riddle" aria-labelledby="riddle">
            <h2 className="z-h3" id="riddle">
              {riddle.title}
            </h2>
            <p className="z-riddle__q">{riddle.question}</p>
            <p className="z-stamp print-worn z-answers" aria-hidden>
              Answers
              <small>tomorrow, as ever</small>
            </p>
            <details>
              <summary>Stuck? Peek — it’s printed upside down</summary>
              <p className="z-riddle__a">{riddle.answer}</p>
            </details>
            <p className="z-yday">{yesterday}</p>
          </section>
        </div>

        <Folio n={7} />
      </Page>

      <Page ground="peach" side="right">
        <RunningHead>The Yay Zine · The back page</RunningHead>

        <section aria-labelledby="comic">
          <div className="z-comic__head">
            <h2 id="comic">{edition.comic.title}</h2>
            <p className="z-comic__byline">A photo strip · Pip is an otter, Pigeon is a dog</p>
          </div>
          <div className="z-comic">
            {edition.comic.panels.map((line, i) => {
              const { who, said } = splitLine(line);
              const p = panelPhotos[i] ?? panelPhotos[0];
              if (!p) return null;
              return (
                <figure
                  className="z-panel print-print"
                  key={line}
                  style={{ ["--r" as string]: `${[-1.8, 1.4, 1.1, -1.3][i] ?? 0}deg` }}
                >
                  <Tape at={i % 2 === 0 ? "tl" : "tr"} />
                  <Photo
                    photo={p.photo}
                    ratio="3 / 2"
                    sizes="(max-width: 900px) 100vw, 300px"
                    position={p.position}
                    zoom={"zoom" in p ? p.zoom : undefined}
                  />
                  <figcaption className="z-bubble">
                    <b>{who}</b>
                    {said}
                  </figcaption>
                  <span className="z-panel__n" aria-hidden>
                    {i + 1}
                  </span>
                </figure>
              );
            })}
          </div>
          <Anno
            arrow="arrows-09"
            arrowSize={[8, 12]}
            arrowFirst={false}
            style={{
              right: "calc(var(--u) * -2)",
              top: "calc(var(--u) * 58)",
              ["--r" as string]: "-4deg",
            }}
          >
            not a pigeon
          </Anno>
          <p className="z-cap">
            <span className="z-cap__credit">
              Photos: {pick("otters").credit}; {pick("goldenRetriever").credit};{" "}
              {pick("goldenRetriever", 1).credit} · unsplash.com
            </span>
          </p>
        </section>

        <div className="z-back__lower">
          <section className="z-corr" aria-labelledby="corrections">
            <h2 className="z-label" id="corrections">
              Corrections
            </h2>
            {edition.corrections.map((c) => (
              <p key={c.slice(0, 20)}>{c}</p>
            ))}
          </section>
          <section aria-labelledby="classifieds">
            <h2 className="z-label" id="classifieds">
              Classifieds
            </h2>
            <div className="z-class">
              {edition.classifieds.map((c) => (
                <p key={c.heading}>
                  <b>{c.heading.toLowerCase()}.</b> {c.text}
                </p>
              ))}
              <p className="z-class__rate">Lines free. Kindness preferred. Box 42, The Yay News.</p>
            </div>
          </section>
        </div>

        <div className="z-signoff">
          <p>
            You’re <Ring>done</Ring> for today.
          </p>
          <p>{signOffRest}</p>
        </div>

        <Folio n={8} />
      </Page>
      <div
        className="z-onfold"
        style={{ ["--gx" as string]: 0, ["--gy" as string]: 24, ["--r" as string]: "-12deg" }}
      >
        <p className="z-roundel" aria-hidden>
          <span>No. 43</span>
          out tomorrow
        </p>
      </div>
    </Spread>
  );
}
