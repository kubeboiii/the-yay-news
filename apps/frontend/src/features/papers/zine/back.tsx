import type { SolvedPuzzle } from "@repo/shared";
import { Fragment, type ReactNode } from "react";
import {
  Crossword,
  CrosswordAnswers,
  FortuneTeller,
  type PlayInks,
  Riddle,
  WordLadder,
  WordSearch,
} from "@/features/play";
import { Mark } from "@repo/ui/print/mark";
import { BackKeepsakes, backPlay } from "../back-play";
import type { PageProps } from "../types";
import { backComposition } from "./compose";
import { Folio, Head, Page, Ring, RunningHead, Spread, Tape, Zig } from "./parts";
import { byOrder, feature, features, folios, shortDate, signOffLines } from "./text";

/*
 * Two compositions alternate by issue (compose.ts): "puzzles-left" (puzzles on page 1, the strip,
 * features and sign-off on page 2) and "comic-left" (the strip and features first, then the
 * puzzles and sign-off).
 *
 * The back route prints the last spread. Left: the puzzles, played in pencil (the Mini crossword,
 * the word ladder, the riddle with yesterday's under its folded corner, the word search and the
 * fortune teller). Right: the comic
 * (a drawn strip: the edition carries its lines, not pictures), yesterday's answers, then whichever
 * of corrections, classifieds, letters, word of the day and the quote the edition has, and the
 * sign-off.
 */

/** The reader's pencil and marker on the zine's pastel grounds. */
const INKS: PlayInks = {
  ink: "var(--ink)",
  print: "var(--ink)",
  paper: "var(--paper)",
  highlight: "var(--deepmint)",
  mark: "var(--rosetype)",
};

export function Back({ edition, page, reading }: PageProps) {
  const [lf, rf] = folios(reading, page.order);
  const date = shortDate(edition.date);
  const play = backPlay(edition);
  const { issue, crossword, ladder, riddle, search, fortune } = play;

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
  // Yesterday's answers sit with today's puzzles.
  const yesterdayNode =
    yesterday && yesterday.puzzles.length ? (
      <Yesterday issue={yesterday.issueNumber} puzzles={byOrder(yesterday.puzzles)} />
    ) : null;
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

  const puzzlesHead = (
    <Head as="h1" top="Pencils out, it’s the back page" bottom="Puzzles" size={18} />
  );
  const crosswordNode = crossword ? (
    <Crossword
      issue={issue}
      data={crossword.data}
      inks={INKS}
      headingLevel={2}
      className="yn-play zb-pz"
    />
  ) : null;
  const ladderNode = ladder ? (
    <WordLadder
      issue={issue}
      data={ladder.data}
      inks={INKS}
      headingLevel={2}
      className="yn-play zb-pz"
    />
  ) : null;
  const riddleNode = riddle ? (
    <Riddle
      issue={issue}
      data={riddle.data}
      yesterday={play.yesterday?.riddle}
      inks={INKS}
      headingLevel={2}
      className="yn-play zb-pz"
    />
  ) : null;
  const searchNode = search ? (
    <WordSearch
      issue={issue}
      data={search.data}
      inks={INKS}
      headingLevel={2}
      className="yn-play zb-pz zb-pz--wide"
    />
  ) : null;
  const fortuneNode = fortune ? (
    <FortuneTeller
      issue={issue}
      data={fortune.data}
      inks={INKS}
      headingLevel={2}
      className="yn-play zb-pz"
    />
  ) : null;
  /**
   * The small puzzles two to a row (the word search runs on the other page, where there's room);
   * `beside` fills the cell next to the word ladder.
   */
  const puzzGrid = (beside: ReactNode) =>
    ladder || riddle || search || fortune ? (
      <div className="z-puzz zb-puzz">
        {ladderNode}
        {beside ? <div className="zb-puzz__beside">{beside}</div> : null}
        {fortuneNode}
        {riddleNode}
      </div>
    ) : (
      beside
    );
  const comicNode = comic ? (
    <section aria-labelledby="comic" className="zb-comic">
      <div className="z-comic__head">
        <h2 id="comic">{comic.content.title}</h2>
      </div>
      <div className={`z-comic zb-strip zb-strip--${Math.min(comic.content.panels.length, 4)}`}>
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
  ) : null;
  // Each column in a block of its own, so either can cross the fold on its own (balance.tsx).
  const lowerNode = (
    <>
      {columns.map((col, i) => (
        <div className="z-back__lower zb-lower" key={i}>
          <div className="zb-col">
            {col.map((b) => (
              <Fragment key={b.key}>{b.node}</Fragment>
            ))}
          </div>
        </div>
      ))}
    </>
  );
  const quoteNode = quote ? (
    <figure className="z-pull zb-quote">
      <Zig short />
      <blockquote>
        <p>“{quote.content.text}”</p>
      </blockquote>
      <figcaption>
        <cite>{quote.content.by}</cite>
      </figcaption>
    </figure>
  ) : null;
  const signoffNode = (
    <>
      <BackKeepsakes edition={edition} className="zb-keepsakes" />
      <div className="z-signoff">
        <p>
          <SignOff text={signBig} />
        </p>
        {signRest ? <p>{signRest}</p> : null}
      </div>
    </>
  );
  const comp = backComposition(edition);
  // The pieces at the fold may cross it (balance.tsx) so the two pages end level.
  const flowId = `zb:${issue}`;

  if (comp === "comic-left") {
    // The strip and the paper's short features open the spread; the puzzles and the sign-off close it.
    return (
      <Spread label="Back page spread">
        <Page ground="lilac" side="left" composition={comp}>
          <RunningHead>The Yay Zine · The back page</RunningHead>
          <div className="zb-flow" data-sp-flow={flowId} data-half={0}>
            {comicNode}
            <div className="zb-flow">
              {puzzlesHead}
              {/* Yesterday's answers and the quote share the cell beside the word ladder: either
                  alone is much shorter than the ladder and would leave bare paper under it. */}
              {puzzGrid(
                <>
                  {yesterdayNode}
                  {quoteNode}
                </>,
              )}
            </div>
            {lowerNode}
          </div>
          <Folio n={lf} date={date} />
        </Page>
        <Page ground="butter" side="right">
          <RunningHead>The Yay Zine · The back page</RunningHead>
          <div className="zb-flow" data-sp-flow={flowId} data-half={1}>
            {crosswordNode}
            {searchNode}
            {signoffNode}
          </div>
          <Folio n={rf} date={date} />
        </Page>
      </Spread>
    );
  }

  return (
    <Spread label="Back page spread">
      <Page ground="butter" side="left" composition={comp}>
        <RunningHead>The Yay Zine · The back page</RunningHead>
        <div className="zb-flow" data-sp-flow={flowId} data-half={0}>
          {puzzlesHead}
          {crosswordNode}
          {puzzGrid(yesterdayNode)}
        </div>
        <Folio n={lf} date={date} />
      </Page>
      <Page ground="peach" side="right">
        <RunningHead>The Yay Zine · The back page</RunningHead>
        <div className="zb-flow" data-sp-flow={flowId} data-half={1}>
          {searchNode}
          {comicNode}
          {lowerNode}
          {quoteNode}
          {signoffNode}
        </div>
        <Folio n={rf} date={date} />
      </Page>
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

function Yesterday({ issue, puzzles }: { issue: number; puzzles: SolvedPuzzle[] }) {
  return (
    <section className="zb-yday" aria-labelledby="yday">
      <h2 className="z-label" id="yday">
        Yesterday’s answers <span className="zb-yday__no">No. {issue}</span>
      </h2>
      {puzzles.map((p) => {
        if (p.type === "crossword") {
          return (
            <CrosswordAnswers
              key="xw"
              data={p.data}
              solution={p.solution}
              inks={INKS}
              hideTitle
              className="yn-play zb-answers"
            />
          );
        }
        if (p.type === "word_ladder") {
          return (
            <p className="zb-yday__line" key="ladder">
              <b>{p.data.title}:</b> {p.solution.ladder.join(" → ")}
            </p>
          );
        }
        if (p.type === "riddle") {
          return (
            <p className="zb-yday__line" key="riddle">
              <b>{p.data.title}:</b> lift the corner of today’s riddle.
            </p>
          );
        }
        return null;
      })}
    </section>
  );
}
