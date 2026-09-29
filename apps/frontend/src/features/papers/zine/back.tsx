import type { Puzzle, SolvedPuzzle } from "@repo/shared";
import { Fragment, type ReactNode } from "react";
import { Mark } from "@/features/print/mark";
import type { PageProps } from "../types";
import { Folio, Head, OnFold, Page, Ring, RunningHead, Spread, Tape, Zig } from "./parts";
import { byOrder, feature, features, folios, shortDate, signOffLines } from "./text";

/*
 * The back route prints the last spread. Left: the puzzles, printed not interactive (the Mini
 * crossword from `rows`/`numbers` with its clues, the word ladder and the riddle). Right: the comic
 * (a drawn strip: the edition carries its lines, not pictures), yesterday's answers, then whichever
 * of corrections, classifieds, letters, word of the day and the quote the edition has, and the
 * sign-off.
 */

type Crossword = Extract<Puzzle, { type: "crossword" }>["data"];
type Ladder = Extract<Puzzle, { type: "word_ladder" }>["data"];
type Riddle = Extract<Puzzle, { type: "riddle" }>["data"];

export function Back({ edition, page, reading }: PageProps) {
  const [lf, rf] = folios(reading, page.order);
  const date = shortDate(edition.date);
  const puzzles = byOrder(edition.puzzles);
  const crossword = puzzles.find((p) => p.type === "crossword")?.data as Crossword | undefined;
  const ladder = puzzles.find((p) => p.type === "word_ladder")?.data as Ladder | undefined;
  const riddle = puzzles.find((p) => p.type === "riddle")?.data as Riddle | undefined;

  const comic = feature(edition, "comic");
  const corrections = features(edition, "correction");
  const classifieds = features(edition, "classified");
  const letters = features(edition, "letter");
  const word = feature(edition, "word_of_the_day");
  const quote = feature(edition, "quote");
  const [signBig, signRest] = signOffLines(edition);
  const yesterday = edition.yesterday;

  // The small features share two columns (narrow, wide). Classifieds keep the wide one, as in the
  // mockup; the rest go, in order, to whichever column is shorter so far.
  const blocks: { key: string; height: (w: number) => number; node: ReactNode; wide?: boolean }[] =
    [];
  if (yesterday && yesterday.puzzles.length) {
    blocks.push({
      key: "yday",
      height: () => 44,
      node: <Yesterday issue={yesterday.issueNumber} puzzles={byOrder(yesterday.puzzles)} />,
    });
  }
  if (corrections.length) {
    blocks.push({
      key: "corr",
      height: (w) =>
        7 + corrections.reduce((n, c) => n + lines(c.content.text, w, 2.8) * 3.8 + 1.5, 0),
      node: (
        <section className="z-corr" aria-labelledby="corrections">
          <h2 className="z-label" id="corrections">
            Corrections
          </h2>
          {corrections.map((c, i) => (
            <p key={i}>{c.content.text}</p>
          ))}
        </section>
      ),
    });
  }
  if (classifieds.length) {
    blocks.push({
      key: "class",
      wide: true,
      height: (w) =>
        9 +
        classifieds.reduce(
          (n, c) => n + lines(c.content.text + c.content.heading, w / 2 - 2, 2.8) * 3.6 + 1.4,
          0,
        ) /
          2,
      node: (
        <section aria-labelledby="classifieds">
          <h2 className="z-label" id="classifieds">
            Classifieds
          </h2>
          <div className="z-class">
            {classifieds.map((c, i) => (
              <p key={i}>
                <b>{c.content.heading.toLowerCase()}.</b> {c.content.text}
              </p>
            ))}
            <p className="z-class__rate">Lines free. Kindness preferred.</p>
          </div>
        </section>
      ),
    });
  }
  if (letters.length) {
    blocks.push({
      key: "letters",
      height: (w) =>
        7 + letters.reduce((n, l) => n + (lines(l.content.text, w, 2.9) + 1) * 3.9 + 1.5, 0),
      node: (
        <section className="zb-letters" aria-labelledby="letters">
          <h2 className="z-label" id="letters">
            {letters.length === 1 ? "A letter" : "Letters"}
          </h2>
          {letters.map((l, i) => (
            <blockquote key={i} className="zb-letter">
              <p>{l.content.text}</p>
              <footer>— {l.content.from}</footer>
            </blockquote>
          ))}
        </section>
      ),
    });
  }
  if (word) {
    blocks.push({
      key: "word",
      height: (w) =>
        26 +
        (lines(word.content.meaning, w - 8, 3.1) + lines(word.content.example, w - 8, 2.9)) * 4,
      node: (
        <section className="zb-word print-print" aria-labelledby="word">
          <Tape at="t" />
          <h2 className="z-kicker" id="word">
            Word of the day
          </h2>
          <p className="zb-word__w">{word.content.word}</p>
          <p className="zb-word__say">{word.content.pronunciation}</p>
          <p className="zb-word__means">{word.content.meaning}</p>
          <p className="zb-word__eg">“{word.content.example}”</p>
        </section>
      ),
    });
  }
  // Each block's height is estimated for the column it would go in (56 mm or about 84 mm wide).
  const WIDTH = [56, 84] as const;
  const columns: (typeof blocks)[] = [[], []];
  const load = [0, 0];
  for (const b of blocks.filter((x) => x.wide)) {
    columns[1]!.push(b);
    load[1]! += b.height(WIDTH[1]) + 5;
  }
  for (const b of blocks.filter((x) => !x.wide)) {
    const i = load[0]! + b.height(WIDTH[0]) <= load[1]! + b.height(WIDTH[1]) ? 0 : 1;
    columns[i]!.push(b);
    load[i]! += b.height(WIDTH[i]!) + 5;
  }

  return (
    <Spread label="Back page spread">
      <Page ground="butter" side="left">
        <RunningHead>The Yay Zine · The back page</RunningHead>
        <Head as="h1" top="Pencils out, it’s the back page" bottom="Puzzles" size={18} />

        {crossword ? <CrosswordBlock data={crossword} /> : null}

        {ladder || riddle ? (
          <div className="z-puzz">
            {ladder ? <LadderBlock data={ladder} /> : <div />}
            {riddle ? (
              <section className="z-riddle" aria-labelledby="riddle">
                <h2 className="z-h3" id="riddle">
                  {riddle.title}
                </h2>
                <p className="z-riddle__q">{riddle.question}</p>
                <p className="z-stamp print-worn z-answers" aria-hidden>
                  Answers
                  <small>tomorrow, as ever</small>
                </p>
                <p className="z-yday">Answers to today’s puzzles are printed in tomorrow’s zine.</p>
              </section>
            ) : null}
          </div>
        ) : null}

        <Folio n={lf} date={date} />
      </Page>

      <Page ground="peach" side="right">
        <RunningHead>The Yay Zine · The back page</RunningHead>

        {comic ? (
          <section aria-labelledby="comic" className="zb-comic">
            <div className="z-comic__head">
              <h2 id="comic">{comic.content.title}</h2>
              <p className="z-comic__byline">
                A strip in {comic.content.panels.length}{" "}
                {comic.content.panels.length === 1 ? "panel" : "panels"}
              </p>
            </div>
            <div
              className={`z-comic zb-strip zb-strip--${Math.min(comic.content.panels.length, 4)}`}
            >
              {comic.content.panels.map((line, i) => {
                const { who, said } = splitLine(line);
                return (
                  <figure
                    className={`zb-panel zb-panel--${i % 4}`}
                    key={i}
                    style={{ ["--r" as string]: `${[-1.4, 1.1, 0.9, -1.2][i % 4]}deg` }}
                  >
                    <Mark
                      name={DOODLES[i % DOODLES.length]!}
                      ink="var(--ink)"
                      className="zb-panel__doodle"
                    />
                    <figcaption className="z-bubble zb-bubble">
                      {who ? <b>{who}</b> : null}
                      {said}
                    </figcaption>
                    <span className="z-panel__n" aria-hidden>
                      {i + 1}
                    </span>
                  </figure>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className="z-back__lower zb-lower">
          {columns.map((col, i) => (
            <div className="zb-col" key={i}>
              {col.map((b) => (
                <Fragment key={b.key}>{b.node}</Fragment>
              ))}
            </div>
          ))}
        </div>

        {quote ? (
          <figure className="z-pull zb-quote">
            <Zig short />
            <blockquote>
              <p>“{quote.content.text}”</p>
            </blockquote>
            <figcaption>
              <cite>{quote.content.by}</cite>
            </figcaption>
          </figure>
        ) : null}

        <div className="z-signoff">
          <p>
            <SignOff text={signBig} />
          </p>
          {signRest ? <p>{signRest}</p> : null}
        </div>

        <Folio n={rf} date={date} />
      </Page>

      <OnFold gx={0} gy={24} rotate={-12}>
        <p className="z-roundel">
          <span>No. {edition.issueNumber + 1}</span>
          out tomorrow
        </p>
      </OnFold>
    </Spread>
  );
}

/** Rough line count for `chars` of text at `font` mm in a `width` mm column. */
const lines = (text: string, width: number, font: number) =>
  Math.max(1, Math.ceil(text.length / (width / (font * 0.47))));

const DOODLES = ["stars-22", "sketch-11", "sketch-53", "stars-10"];

function splitLine(line: string) {
  const m = /^([A-Z][\w .'’-]{0,24}):\s*(.+)$/.exec(line);
  return m ? { who: m[1]!, said: m[2]! } : { who: "", said: line };
}

/** Rings "done" in the sign-off, the way the mockup closes. */
function SignOff({ text }: { text: string }) {
  const i = text.indexOf("done");
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <Ring>done</Ring>
      {text.slice(i + 4)}
    </>
  );
}

function CrosswordBlock({ data }: { data: Crossword }) {
  const rows = data.rows;
  const cols = Math.max(...rows.map((r) => r.length), 1);
  const numbers = new Map(data.numbers.map((n) => [`${n.row},${n.col}`, n.n]));
  const blacks = rows
    .join("")
    .split("")
    .filter((c) => c === "#").length;
  const words = data.title.split(" ");
  const the = words[0]?.toLowerCase() === "the" ? words.shift() : null;
  return (
    <section aria-labelledby="xw-title">
      <div className="z-xw zb-xw z-offset-block">
        <h2 className="z-xw__side" id="xw-title">
          <span>{the ?? ""}</span>
          <span>{words.join(" ")}</span>
          <span>Crossword</span>
        </h2>
        <div
          className="z-grid zb-grid"
          role="img"
          aria-label={`A ${cols} by ${rows.length} crossword grid with ${blacks} black squares`}
          style={{ ["--cols" as string]: cols, ["--rows" as string]: rows.length }}
        >
          {rows.flatMap((row, r) =>
            [...row.padEnd(cols, "#")].map((ch, c) => {
              const n = numbers.get(`${r},${c}`);
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
        {(["across", "down"] as const).map((dir) => (
          <div key={dir}>
            <h3 className="z-label">{dir === "across" ? "Across" : "Down"}</h3>
            <ol>
              {data[dir].map((c) => (
                <li key={c.n}>
                  <b>{c.n}</b>
                  <span>
                    {c.clue} ({c.length})
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

function LadderBlock({ data }: { data: Ladder }) {
  const width = Math.max(data.start.length, data.end.length);
  const rungs = data.steps + 2;
  const cell = Math.min(7, Math.max(4.4, 40 / rungs));
  return (
    <section aria-labelledby="ladder">
      <h2 className="z-h3" id="ladder">
        {data.title}
      </h2>
      <p className="zb-ladder__how">{data.instructions}</p>
      <div
        className="z-ladder"
        role="img"
        aria-label={`${data.start}, then ${data.steps} blank ${data.steps === 1 ? "rung" : "rungs"}, then ${data.end}`}
        style={{ ["--cell" as string]: cell }}
      >
        <div className="z-ladder__row z-ladder__row--given">
          {[...data.start].map((l, i) => (
            <span key={`s${i}`}>{l}</span>
          ))}
        </div>
        {Array.from({ length: data.steps }, (_, r) => (
          <div className="z-ladder__row" key={`r${r}`}>
            {Array.from({ length: width }, (_, i) => (
              <span key={`b${r}${i}`} />
            ))}
          </div>
        ))}
        <div className="z-ladder__row z-ladder__row--given">
          {[...data.end].map((l, i) => (
            <span key={`e${i}`}>{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Yesterday({ issue, puzzles }: { issue: number; puzzles: SolvedPuzzle[] }) {
  return (
    <section className="zb-yday" aria-labelledby="yday">
      <h2 className="z-label" id="yday">
        Yesterday’s answers <span className="zb-yday__no">No. {issue}</span>
      </h2>
      {puzzles.map((p) => {
        if (p.type === "crossword") {
          const cols = Math.max(...p.solution.grid.map((r) => r.length), 1);
          return (
            <div className="zb-yday__xw" key="xw">
              <div
                className="zb-mini"
                role="img"
                aria-label={`Yesterday's crossword, solved: across ${p.solution.across
                  .map((a) => `${a.n} ${a.answer}`)
                  .join(
                    ", ",
                  )}; down ${p.solution.down.map((a) => `${a.n} ${a.answer}`).join(", ")}`}
                style={{ ["--cols" as string]: cols }}
              >
                {p.solution.grid.flatMap((row, r) =>
                  [...row.padEnd(cols, "#")].map((ch, c) => (
                    <span key={`${r}-${c}`} className={ch === "#" ? "zb-mini--black" : undefined}>
                      {ch === "#" ? "" : ch}
                    </span>
                  )),
                )}
              </div>
              <p className="zb-yday__list">
                <b>Across</b> {p.solution.across.map((a) => `${a.n} ${a.answer}`).join(" · ")}
                <br />
                <b>Down</b> {p.solution.down.map((a) => `${a.n} ${a.answer}`).join(" · ")}
              </p>
            </div>
          );
        }
        if (p.type === "word_ladder") {
          return (
            <p className="zb-yday__line" key="ladder">
              <b>{p.data.title}:</b> {p.solution.ladder.join(" → ")}
            </p>
          );
        }
        return (
          <p className="zb-yday__line" key="riddle">
            <b>{p.data.title}:</b> {p.data.question} <i>{p.solution.answer}.</i>
          </p>
        );
      })}
    </section>
  );
}
