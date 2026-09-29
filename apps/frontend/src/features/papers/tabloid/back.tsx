import type { Puzzle, SolvedPuzzle } from "@repo/shared";
import type { CSSProperties } from "react";
import { Mark } from "@/features/print/mark";
import type { PageProps } from "../types";
import {
  featureOf,
  featuresOf,
  folioDate,
  issueLine,
  pad2,
  speech,
  splitFirstSentence,
  titleCase,
} from "./edition-data";
import { Folio, Masthead, MiniMark, Sheet, Stamp, fit } from "./parts";
import { fs } from "./story-bits";

// The back page: today's puzzles printed to be done in pencil (interactivity comes later),
// yesterday's answers, the comic, the small print — corrections, classifieds, letters — and the
// sign-off that tells you you're finished.

type PuzzleOf<T extends Puzzle["type"]> = Extract<Puzzle, { type: T }>;
type SolvedOf<T extends SolvedPuzzle["type"]> = Extract<SolvedPuzzle, { type: T }>;

const puzzleOf = <T extends Puzzle["type"]>(list: Puzzle[], type: T) =>
  (list.find((p) => p.type === type) as PuzzleOf<T> | undefined) ?? null;
const solvedOf = <T extends SolvedPuzzle["type"]>(list: SolvedPuzzle[], type: T) =>
  (list.find((p) => p.type === type) as SolvedOf<T> | undefined) ?? null;

type Grid = PuzzleOf<"crossword">["data"];

/** A crossword grid in ink: black squares, numbered squares, and (for answers) the letters. */
function CrosswordGrid({ data, fill, small }: { data: Grid; fill?: string[]; small?: boolean }) {
  const width = Math.max(...data.rows.map((r) => r.length), 1);
  const number = new Map(data.numbers.map((n) => [`${n.row},${n.col}`, n.n]));
  const blacks = data.rows.reduce((n, r) => n + [...r].filter((c) => c === "#").length, 0);
  return (
    <div
      className={`tb-xw-grid ${small ? "tb-xw-grid--small" : ""}`}
      style={{
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        aspectRatio: `${width} / ${data.rows.length}`,
      }}
      role="img"
      aria-label={
        fill
          ? `The solved grid: ${fill.map((r) => r.replace(/#/g, " ")).join(", ")}`
          : `A ${width} by ${data.rows.length} crossword grid with ${blacks} black squares`
      }
    >
      {data.rows.flatMap((row, r) =>
        [...row.padEnd(width, "#")].map((ch, c) => {
          const n = number.get(`${r},${c}`);
          const letter = fill?.[r]?.[c];
          return (
            <div
              key={`${r}-${c}`}
              className={`tb-xw-cell ${ch === "#" ? "tb-xw-cell--black" : ""}`}
            >
              {n && !small ? <span>{n}</span> : null}
              {letter && letter !== "#" ? <b>{letter}</b> : null}
            </div>
          );
        }),
      )}
    </div>
  );
}

function Clues({ data }: { data: Grid }) {
  return (
    <div className="tb-clues">
      {(
        [
          ["Across", data.across],
          ["Down", data.down],
        ] as const
      ).map(([label, clues]) =>
        clues.length ? (
          <div key={label}>
            <h3>{label}</h3>
            <ol>
              {clues.map((c) => (
                <li key={`${label}${c.n}`}>
                  <b>{c.n}</b>
                  <span>
                    {c.clue} ({c.length})
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null,
      )}
    </div>
  );
}

/** A comic character, drawn in ink: the pigeon, or a round little someone for anyone else. */
function Character({ who, flip }: { who: string; flip?: boolean }) {
  const pigeon = /pigeon|bird/i.test(who);
  return (
    <svg
      viewBox="0 0 100 80"
      className={`tb-char ${flip ? "tb-char--flip" : ""}`}
      aria-hidden
      fill="none"
      stroke="var(--ink)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {pigeon ? (
        <>
          <path
            d="M22 62c-6-14 2-30 18-34 4-12 20-16 27-6 3 4 3 9 1 13l12 2-11 5c6 10 2 22-10 27-12 5-30 3-37-7z"
            fill="var(--rev-paper)"
          />
          <path d="M34 50c8 6 20 6 28-2" />
          <circle cx="58" cy="26" r="2.6" fill="var(--ink)" stroke="none" />
          <path d="M40 76l-2 4M52 76l2 4" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="48" rx="30" ry="27" fill="var(--rev-paper)" />
          <path d="M28 30c-6-10-2-18 4-20M72 30c6-10 2-18-4-20" />
          <circle cx="40" cy="44" r="2.8" fill="var(--ink)" stroke="none" />
          <circle cx="60" cy="44" r="2.8" fill="var(--ink)" stroke="none" />
          <path d="M42 56c5 5 11 5 16 0" />
        </>
      )}
    </svg>
  );
}

export function Back({ edition, page, reading }: PageProps) {
  const date = folioDate(edition.date);
  const crossword = puzzleOf(edition.puzzles, "crossword");
  const ladder = puzzleOf(edition.puzzles, "word_ladder");
  const riddle = puzzleOf(edition.puzzles, "riddle");
  const y = edition.yesterday;
  const yCrossword = y ? solvedOf(y.puzzles, "crossword") : null;
  const yLadder = y ? solvedOf(y.puzzles, "word_ladder") : null;
  const yRiddle = y ? solvedOf(y.puzzles, "riddle") : null;
  const comic = featureOf(edition, "comic");
  const corrections = featuresOf(edition, "correction");
  const classifieds = featuresOf(edition, "classified");
  const letters = featuresOf(edition, "letter");
  const word = featureOf(edition, "word_of_the_day");
  const quote = featureOf(edition, "quote");
  const signOff =
    featureOf(edition, "sign_off")?.content.text ?? "You're done for today. See you tomorrow.";
  const [signHead, signRest] = splitFirstSentence(signOff);
  const [boxed, ...plain] = [...classifieds].reverse();
  const puzzleCount = [crossword, ladder, riddle].filter(Boolean).length;
  const onPage = [
    crossword
      ? `a ${crossword.data.rows.length}-by-${crossword.data.rows[0]?.length ?? 0} crossword`
      : null,
    ladder ? `a ${ladder.data.steps}-step ladder` : null,
    riddle ? "one riddle" : null,
    comic ? comic.content.title : null,
  ].filter(Boolean);

  return (
    <Sheet theme="back" label={`The back page, page ${page.order}`}>
      <Masthead
        eyebrow={
          <MiniMark href={reading.pages[0]?.href ?? "/"}>
            Page {page.order} · The back page · {date}
          </MiniMark>
        }
        title="Puzzles & play"
        size={{ measure: 150, max: 17.5 }}
        aside={
          <>
            <p className="tb-kicker">On today&rsquo;s back page:</p>
            <p>
              {onPage.length ? `${onPage.join(", ").replace(/^a/, "A")}. ` : ""}Pencil optional,
              answers tomorrow.
            </p>
          </>
        }
        box={
          <>
            <span className="tb-box-num">{pad2(page.order)}</span>
            <span className="tb-box-words">
              Pencils ready
              <small>The back page</small>
            </span>
          </>
        }
      />

      {puzzleCount ? (
        <section className={`tb-puzzles tb-puzzles--${puzzleCount}`} aria-label="Puzzles">
          {crossword ? (
            <article className="tb-tile tb-tile--xw" aria-labelledby="xw-title">
              <h2 id="xw-title" className="tb-tile-head tb-cond">
                {crossword.data.title}
              </h2>
              <p className="tb-note tb-back2-note" aria-hidden>
                start with 1 across
              </p>
              <Mark name="arrows-10" ink="var(--b)" className="tb-mark tb-back2-arrow" />
              <div className="tb-xw">
                <CrosswordGrid data={crossword.data} />
                <Clues data={crossword.data} />
              </div>
            </article>
          ) : null}

          {ladder ? (
            <article className="tb-tile tb-tile--ladder" aria-labelledby="ladder-title">
              <h2 id="ladder-title" className="tb-tile-head tb-cond">
                {ladder.data.title}
              </h2>
              <p>{ladder.data.instructions}</p>
              <ol
                className="tb-ladder"
                style={
                  {
                    "--rung": Math.max(ladder.data.start.length, ladder.data.end.length),
                  } as CSSProperties
                }
              >
                <li className="tb-rung tb-rung--end" aria-label={`From ${ladder.data.start}`}>
                  {[...ladder.data.start].map((ch, i) => (
                    <i key={`s${i}`}>{ch}</i>
                  ))}
                </li>
                {Array.from({ length: ladder.data.steps }, (_, s) => (
                  <li
                    key={`step${s}`}
                    className="tb-rung"
                    aria-label={`Step ${s + 1}: ${ladder.data.start.length} empty letters`}
                  >
                    {Array.from({ length: ladder.data.start.length }, (_, i) => (
                      <i key={i} />
                    ))}
                  </li>
                ))}
                <li className="tb-rung tb-rung--end" aria-label={`To ${ladder.data.end}`}>
                  {[...ladder.data.end].map((ch, i) => (
                    <i key={`e${i}`}>{ch}</i>
                  ))}
                </li>
              </ol>
              <Stamp className="tb-back2-stamp2">
                Answers
                <small>in tomorrow&rsquo;s paper</small>
              </Stamp>
            </article>
          ) : null}

          {riddle ? (
            <article className="tb-tile tb-tile--riddle" aria-labelledby="riddle-title">
              <h2 id="riddle-title" className="tb-tile-head tb-cond">
                {riddle.data.title}
              </h2>
              <p
                className="tb-riddle-q tb-cond"
                style={fs(
                  fit(riddle.data.question, { max: 8, min: 4.6, measure: 62, lines: 5, em: 0.52 }),
                )}
              >
                {riddle.data.question}
              </p>
              <p className="tb-riddle-foot">The answer is printed in tomorrow&rsquo;s paper.</p>
            </article>
          ) : null}
        </section>
      ) : null}

      {y && (yCrossword || yLadder || yRiddle) ? (
        <section className="tb-yday" aria-labelledby="yday-title">
          <h2 id="yday-title" className="tb-cond tb-yday-head">
            Yesterday&rsquo;s answers
            <small>from No. {y.issueNumber}</small>
          </h2>
          <div className="tb-yday-body">
            {yCrossword ? (
              <div className="tb-yday-xw">
                <CrosswordGrid data={yCrossword.data} fill={yCrossword.solution.grid} small />
                <p>
                  <span className="tb-runin">{yCrossword.data.title}. </span>
                  Across: {yCrossword.solution.across.map((a) => `${a.n} ${a.answer}`).join(", ")}.
                  Down: {yCrossword.solution.down.map((a) => `${a.n} ${a.answer}`).join(", ")}.
                </p>
              </div>
            ) : null}
            {yLadder ? (
              <p className="tb-yday-ladder">
                <span className="tb-runin">{yLadder.data.title}. </span>
                {yLadder.solution.ladder.map((w, i) => (
                  <span key={i}>
                    {i ? <span aria-hidden> → </span> : null}
                    <b className="tb-mono">{w}</b>
                  </span>
                ))}
              </p>
            ) : null}
            {yRiddle ? (
              <p className="tb-yday-riddle">
                <span className="tb-runin">{yRiddle.data.title}. </span>
                {yRiddle.data.question}{" "}
                <span className="tb-yday-flip" aria-label={`Answer: ${yRiddle.solution.answer}`}>
                  <span aria-hidden>{yRiddle.solution.answer}</span>
                </span>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {comic ? (
        <section className="tb-comic tb-grow" aria-labelledby="comic-title">
          <div className="tb-comic-head">
            <h2 id="comic-title" className="tb-tile-head tb-cond">
              {comic.content.title}
            </h2>
            <p className="tb-source">
              A strip in {comic.content.panels.length} panels, drawn by the desk
            </p>
          </div>
          <ol
            className="tb-comic-panels"
            style={{ "--panels": Math.min(comic.content.panels.length, 4) } as CSSProperties}
          >
            {comic.content.panels.map((line, i) => {
              const { who, said } = speech(line);
              return (
                <li key={i} className={`tb-panel tb-panel--${i % 2 ? "b" : "a"}`}>
                  <p className="tb-balloon">
                    {who ? <b>{who}</b> : null}
                    {said}
                  </p>
                  <Character who={who} flip={i % 2 === 1} />
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      <section className="tb-band tb-back-band" aria-label="Corrections, classifieds and letters">
        <article className="tb-col tb-body">
          {corrections.length ? (
            <>
              <h2 className="tb-cond tb-h3 tb-colhead">Corrections</h2>
              {corrections.map((c, i) => (
                <p key={i}>{c.content.text}</p>
              ))}
            </>
          ) : null}
          {letters.map((l, i) => (
            <div key={i} className="tb-letter-box">
              <h2 className="tb-cond tb-mini-head">Letter to the editor</h2>
              <p className="tb-first">{l.content.text}</p>
              <p className="tb-pull-by">{l.content.from}</p>
            </div>
          ))}
        </article>

        <article className="tb-col">
          {classifieds.length ? (
            <>
              <h2 className="tb-cond tb-h3 tb-colhead">Classifieds</h2>
              <div className={`tb-back2-cls ${classifieds.length < 3 ? "tb-back2-cls--one" : ""}`}>
                {plain.reverse().map((ad, i) => (
                  <p key={i} className="tb-ad-p">
                    <b>{titleCase(ad.content.heading)}.</b> {ad.content.text}
                  </p>
                ))}
                {boxed ? (
                  <p className="tb-ad-p tb-back2-ad">
                    <b>{titleCase(boxed.content.heading)}.</b> {boxed.content.text}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </article>

        <aside className="tb-col" aria-label={word ? "Word of the day" : "Quote of the day"}>
          <div className="tb-share">
            <Mark name="stars-14" ink="var(--a)" className="tb-mark tb-over tb-share-stars" />
            {word ? (
              <>
                <p className="tb-kicker">Word of the day:</p>
                <h2
                  className="tb-share-head tb-cond"
                  style={fs(fit(word.content.word, { max: 10.5, min: 6, measure: 50, em: 0.6 }))}
                >
                  {word.content.word}
                </h2>
                <p className="tb-word-say">{word.content.pronunciation}</p>
                <p>{word.content.meaning}</p>
                <p className="tb-word-eg">&ldquo;{word.content.example}&rdquo;</p>
              </>
            ) : quote ? null : (
              <>
                <h2 className="tb-share-head tb-cond">Share your answers</h2>
                <p>Solved the Mini before the kettle boiled? Photograph your page and tag us.</p>
              </>
            )}
            {quote ? (
              <blockquote
                className={word ? "tb-share-quote" : "tb-share-quote tb-share-quote--solo"}
              >
                <p className="tb-kicker">Quote of the day:</p>
                <p className="tb-share-quote-text">&ldquo;{quote.content.text}&rdquo;</p>
                <footer className="tb-pull-by">{quote.content.by}</footer>
              </blockquote>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="tb-signoff2 print-worn" aria-label="Sign-off">
        <p
          className="tb-signoff2-big tb-wide"
          style={
            {
              "--so": fit(signHead, { max: 30, min: 10, measure: 250, lines: 1, em: 0.6 }).toFixed(
                2,
              ),
              "--so-phone": fit(signHead, {
                max: 24,
                min: 10,
                measure: 140,
                lines: 3,
                em: 0.62,
              }).toFixed(2),
            } as CSSProperties
          }
        >
          {signHead}
        </p>
        {signRest ? <p className="tb-hand">{signRest}</p> : null}
      </section>

      <Folio page={page.order} section="The back page" date={date} issue={issueLine(edition)} />
    </Sheet>
  );
}
