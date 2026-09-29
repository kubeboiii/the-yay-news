import type { Edition, Puzzle, SolvedPuzzle } from "@repo/shared";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";
import type { PageProps } from "../types";
import { feature, features, Folio, spreadNumbers, splitSignOff } from "./print";

// The back page prints as the closing spread: puzzles on lilac (left) and the back page on paper
// (right) — comic, corrections, letters, classifieds, word of the day — with the sign-off set once
// across both pages at the foot. Puzzles are printed, not interactive; today's answers are never
// on the page, yesterday's are.

type Of<T extends Puzzle["type"]> = Extract<Puzzle, { type: T }>["data"];
type Solved<T extends SolvedPuzzle["type"]> = Extract<SolvedPuzzle, { type: T }>;

const puzzle = <T extends Puzzle["type"]>(edition: Edition, type: T) =>
  (edition.puzzles.find((p) => p.type === type)?.data ?? null) as Of<T> | null;
const solved = <T extends SolvedPuzzle["type"]>(edition: Edition, type: T) =>
  (edition.yesterday?.puzzles.find((p) => p.type === type) ?? null) as Solved<T> | null;

function Crossword({ data }: { data: Of<"crossword"> }) {
  const cols = Math.max(...data.rows.map((r) => r.length), 1);
  const numbers = new Map(data.numbers.map((n) => [`${n.row},${n.col}`, n.n]));
  return (
    <section className="m5b-mini" aria-labelledby="m5b-mini">
      <h2 id="m5b-mini" className="m5-display m5b-h">
        {data.title}
      </h2>
      <div
        className="m5b-grid"
        role="img"
        aria-label={`A ${cols} by ${data.rows.length} crossword grid`}
        style={{ "--cols": cols, "--rows": data.rows.length } as CSSProperties}
      >
        {data.rows.flatMap((row, r) =>
          Array.from({ length: cols }, (_, c) => {
            const n = numbers.get(`${r},${c}`);
            const black = (row[c] ?? "#") === "#";
            return (
              <span key={`${r}-${c}`} className={black ? "m5b-cell m5b-cell--black" : "m5b-cell"}>
                {n ? <b>{n}</b> : null}
              </span>
            );
          }),
        )}
      </div>
      <div className="m5b-clues">
        {(["across", "down"] as const).map((dir) =>
          data[dir].length ? (
            <div key={dir}>
              <h3>{dir === "across" ? "Across" : "Down"}</h3>
              <ol>
                {data[dir].map((c) => (
                  <li key={`${dir}${c.n}`}>
                    <b>{c.n}</b> {c.clue} <i>({c.length})</i>
                  </li>
                ))}
              </ol>
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}

function Ladder({ data }: { data: Of<"word_ladder"> }) {
  const letters = Math.max(data.start.length, data.end.length, 1);
  const rows = [data.start, ...Array.from({ length: data.steps }, () => ""), data.end];
  return (
    <section className="m5b-ladder" aria-labelledby="m5b-ladder">
      <h2 id="m5b-ladder" className="m5-display m5b-h">
        {data.title}
      </h2>
      <p className="m5b-small">{data.instructions}</p>
      <ol
        className={rows.length > 5 ? "m5b-rungs m5b-rungs--tall" : "m5b-rungs"}
        aria-label={`${data.start} to ${data.end} in ${data.steps + 1} changes`}
      >
        {rows.map((word, i) => (
          <li key={i}>
            {Array.from({ length: letters }, (_, k) => (
              <span key={k} className={word ? "m5b-tile m5b-tile--set" : "m5b-tile"}>
                {word[k] ?? ""}
              </span>
            ))}
          </li>
        ))}
      </ol>
      <p className="m5-note m5b-ladder-note" aria-hidden>
        {data.steps} {data.steps === 1 ? "step" : "steps"} between
      </p>
    </section>
  );
}

function Yesterday({ edition }: { edition: Edition }) {
  if (!edition.yesterday) return null;
  const xw = solved(edition, "crossword");
  const ladder = solved(edition, "word_ladder");
  const riddle = solved(edition, "riddle");
  if (!xw && !ladder && !riddle) return null;
  const cols = xw ? Math.max(...xw.solution.grid.map((r) => r.length), 1) : 0;
  return (
    <section className="m5b-yesterday" aria-labelledby="m5b-yesterday">
      <h2 id="m5b-yesterday" className="m5b-yesterday-h">
        Yesterday’s answers <span>No. {edition.yesterday.issueNumber}</span>
      </h2>
      <div className="m5b-yesterday-body">
        {xw ? (
          <div
            className="m5b-solved"
            role="img"
            aria-label={`Yesterday's ${xw.data.title}, filled in: across ${xw.solution.across.map((a) => `${a.n} ${a.answer}`).join(", ")}; down ${xw.solution.down.map((a) => `${a.n} ${a.answer}`).join(", ")}`}
            style={{ "--cols": cols } as CSSProperties}
          >
            {xw.solution.grid.flatMap((row, r) =>
              Array.from({ length: cols }, (_, c) => {
                const ch = row[c] ?? "#";
                return (
                  <span key={`${r}-${c}`} className={ch === "#" ? "m5b-solved--black" : undefined}>
                    {ch === "#" ? "" : ch}
                  </span>
                );
              }),
            )}
          </div>
        ) : null}
        <div className="m5b-yesterday-text">
          {ladder ? (
            <p>
              <b>{ladder.data.title}.</b> {ladder.solution.ladder.join(" → ")}
            </p>
          ) : null}
          {riddle ? (
            <p>
              <b>{riddle.data.title}.</b> {riddle.data.question} <i>{riddle.solution.answer}.</i>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Comic({ comic }: { comic: { title: string; panels: string[] } }) {
  const speakers: string[] = [];
  const panels = comic.panels.map((line) => {
    const m = /^([^:]{1,24}):\s*(.+)$/.exec(line);
    const who = m ? m[1]!.trim() : "";
    if (who && !speakers.includes(who.toLowerCase())) speakers.push(who.toLowerCase());
    return { who, text: m ? m[2]! : line };
  });
  const cast = (who: string) => Math.max(speakers.indexOf(who.toLowerCase()), 0) % 2;
  const title = (who: string) => who.charAt(0) + who.slice(1).toLowerCase();
  return (
    <section className="m5b-comic" aria-labelledby="m5b-comic">
      <div className="m5b-comic-head">
        <h2 id="m5b-comic" className="m5-display m5b-h">
          {comic.title}
        </h2>
        <p className="m5-credit">A strip in {panels.length} panels, drawn in words</p>
      </div>
      <ol className="m5b-panels" style={{ "--panels": panels.length } as CSSProperties}>
        {panels.map((p, i) => (
          <li key={i} className={`m5b-panel m5b-panel--${cast(p.who)}`}>
            <p className={`m5b-bubble ${i % 2 ? "m5b-bubble--r" : ""}`}>
              {p.who ? <b>{p.who.toLowerCase()}</b> : null} {p.text}
            </p>
            <Mark
              name={cast(p.who) ? "doodles-02" : "doodles-06"}
              className={`m5b-face ${i % 2 ? "m5b-face--r" : ""}`}
            />
            {p.who ? (
              <span className="m5-display m5b-who" aria-hidden>
                {title(p.who)}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Back({ edition, reading }: PageProps) {
  const [left, right] = spreadNumbers(reading);
  const crossword = puzzle(edition, "crossword");
  const ladder = puzzle(edition, "word_ladder");
  const riddle = puzzle(edition, "riddle");
  const comic = feature(edition, "comic");
  const corrections = features(edition, "correction");
  const letters = features(edition, "letter");
  const classifieds = features(edition, "classified");
  const word = feature(edition, "word_of_the_day");
  const signOff = feature(edition, "sign_off")?.text ?? "You’re done for today. See you tomorrow.";
  const [bye, after] = splitSignOff(signOff);
  const byeStyle = {
    "--fs": Math.min(30, 640 / Math.max(bye.length, 1)).toFixed(2),
  } as CSSProperties;
  // The last small ad is set in a box, like the one a reader paid a little extra for.
  const boxed = classifieds.length > 2 ? classifieds[classifieds.length - 1] : null;
  const ads = boxed ? classifieds.slice(0, -1) : classifieds;

  return (
    <div className="print-sheet-wrap">
      <div className="print-spread">
        {/* ---------------- The puzzles, on lilac ---------------- */}
        <article
          className="print-sheet print-sheet--bright m5-sheet-flow m5b-left"
          aria-label={`Page ${left}`}
        >
          <Folio page={left} section="Puzzles" date={edition.date} />
          <p className="m5b-stand">Pencils out. Ten minutes, tops, and nobody is timing you.</p>
          <div className="m5-page-flow m5b-page">
            <h1 className="m5-display m5b-title">Puzzles</h1>
            {crossword ? <Crossword data={crossword} /> : null}
            <div className="m5b-row">
              {ladder ? <Ladder data={ladder} /> : null}
              <div className="m5b-row-r">
                {riddle ? (
                  <section className="m5b-riddle" aria-labelledby="m5b-riddle">
                    <h2 id="m5b-riddle" className="m5-display m5b-h">
                      {riddle.title}
                    </h2>
                    <p className="m5-display m5b-riddle-q">{riddle.question}</p>
                    <p className="m5b-answer">Answer in tomorrow’s paper, printed upside down.</p>
                  </section>
                ) : null}
                <Yesterday edition={edition} />
              </div>
            </div>
          </div>
          <p className="m5-display m5-cross m5b-bye" style={byeStyle}>
            {bye}
          </p>
        </article>

        {/* ---------------- The back page ---------------- */}
        <article
          className="print-sheet print-sheet--bright m5-sheet-flow m5b-right"
          aria-label={`Page ${right}`}
        >
          <Folio page={right} section="The back page" date={edition.date} />
          <p className="m5-display m5-cross m5-cross--r m5b-bye" style={byeStyle} aria-hidden>
            {bye}
          </p>
          <div className="m5-page-flow m5b-page">
            {comic ? <Comic comic={comic} /> : null}

            <div className="m5b-lower">
              <div className="m5b-col">
                {corrections.length ? (
                  <section className="m5b-corrections" aria-labelledby="m5b-corrections">
                    <h2 id="m5b-corrections" className="m5-display m5b-h">
                      Corrections
                    </h2>
                    <div className="m5-body">
                      {corrections.map((c, i) => (
                        <p key={i}>{c.text}</p>
                      ))}
                    </div>
                  </section>
                ) : null}
                {letters.length ? (
                  <section className="m5b-letters" aria-labelledby="m5b-letters">
                    <h2 id="m5b-letters" className="m5-display m5b-h">
                      Letters
                    </h2>
                    {letters.map((l, i) => (
                      <blockquote key={i} className="m5b-letter">
                        <p>{l.text}</p>
                        <cite className="m5-byline">{l.from}</cite>
                      </blockquote>
                    ))}
                  </section>
                ) : null}
              </div>

              <div className="m5b-col m5b-col--wide">
                {classifieds.length ? (
                  <section className="m5b-classifieds" aria-labelledby="m5b-classifieds">
                    <h2 id="m5b-classifieds" className="m5-display m5b-h">
                      Classifieds
                    </h2>
                    <p className="m5b-small m5b-class-sub">
                      Small ads, free to place and kind to read.
                    </p>
                    <div className="m5b-ads">
                      {ads.map((ad, i) => (
                        <p key={i}>
                          <b>{ad.heading.toLowerCase()}.</b> {ad.text}
                        </p>
                      ))}
                      {boxed ? (
                        <p className="m5b-ad-boxed print-worn">
                          <b>{boxed.heading.toLowerCase()}.</b> {boxed.text}
                        </p>
                      ) : null}
                    </div>
                  </section>
                ) : null}
                {word ? (
                  <section className="m5b-word" aria-labelledby="m5b-word">
                    <h2 id="m5b-word" className="m5b-word-label">
                      Word of the day
                    </h2>
                    <p className="m5-display m5b-word-word">{word.word}</p>
                    <p className="m5b-word-say">{word.pronunciation}</p>
                    <p className="m5b-word-means">{word.meaning}</p>
                    <p className="m5b-word-eg">“{word.example}”</p>
                  </section>
                ) : null}
              </div>
            </div>
          </div>

          <div className="m5b-signoff">
            <p className="m5b-tomorrow">{after || "See you tomorrow."}</p>
            <p className="m5b-colophon">
              The Yay News, Vol. {edition.volume}, No. {edition.issueNumber}. Every story is from a
              real source, credited on its own page; every photograph is credited where it sits.{" "}
              <Link href={reading.pages[0]?.href ?? "/"}>Back to the front page</Link>.
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
