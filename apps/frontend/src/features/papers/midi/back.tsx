import type { Edition } from "@repo/shared";
import type { CSSProperties } from "react";
import {
  Crossword,
  CrosswordAnswers,
  FortuneTeller,
  type PlayInks,
  Riddle,
  WordLadder,
  WordSearch,
} from "@/features/play";
import { Mark } from "@/features/print/mark";
import { BackKeepsakes, backPlay } from "../back-play";
import type { PageProps } from "../types";
import { backComposition } from "./compose";
import { feature, features, Folio, longDate, spreadNumbers, splitSignOff } from "./print";

// The back page prints as the closing spread: puzzles on lilac (left) and the back page on paper
// (right) — comic, corrections, letters, classifieds, word of the day — with the sign-off set once
// across both pages at the foot. The puzzles are playable in pencil (and print blank); today's
// answers are never on the page, yesterday's are.

/** The inks the reader's pencil and marker take on the midi's pastel spread. */
const INKS: PlayInks = {
  ink: "var(--ink)",
  print: "var(--ink)",
  paper: "var(--paper)",
  highlight: "var(--butter-deep)",
  mark: "var(--rose-deep)",
};

function Yesterday({ edition }: { edition: Edition }) {
  const y = backPlay(edition).yesterday;
  if (!y || (!y.crossword && !y.ladder)) return null;
  return (
    <section className="m5b-yesterday" aria-labelledby="m5b-yesterday">
      <h2 id="m5b-yesterday" className="m5b-yesterday-h">
        Yesterday’s answers <span>No. {y.issue}</span>
      </h2>
      <div className="m5b-yesterday-body">
        {y.crossword ? (
          <CrosswordAnswers
            data={y.crossword.data}
            solution={y.crossword.solution}
            inks={INKS}
            hideTitle
            className="yn-play m5b-answers"
          />
        ) : null}
        <div className="m5b-yesterday-text">
          {y.ladder ? (
            <p>
              <b>{y.ladder.data.title}.</b> {y.ladder.solution.ladder.join(" → ")}
            </p>
          ) : null}
          {y.riddle ? <p>Yesterday’s riddle is under the folded corner of today’s.</p> : null}
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
  const play = backPlay(edition);
  const { issue, crossword, ladder, riddle, search, fortune } = play;
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

  const composition = backComposition(edition);
  const puzzlesFirst = composition === "puzzles-left";
  const [pz, bk] = puzzlesFirst ? [left, right] : [right, left];
  const bye1 = (
    <p className="m5-display m5-cross m5b-bye" style={byeStyle}>
      {bye}
    </p>
  );
  const bye2 = (
    <p className="m5-display m5-cross m5-cross--r m5b-bye" style={byeStyle} aria-hidden>
      {bye}
    </p>
  );

  const puzzles = (
    <article
      className="print-sheet print-sheet--bright m5-sheet-flow m5b-left"
      aria-label={`Page ${pz}`}
      key="puzzles"
    >
      <Folio page={pz} section="Puzzles" date={edition.date} />
      {puzzlesFirst ? null : bye2}
      <div className="m5-page-flow m5b-page">
        <h1 className="m5-display m5b-title">Puzzles</h1>
        {crossword ? (
          <Crossword
            issue={issue}
            data={crossword.data}
            inks={INKS}
            headingLevel={2}
            className="yn-play m5b-pz m5b-pz--xw"
          />
        ) : null}
        <div className="m5b-row">
          {ladder ? (
            <WordLadder
              issue={issue}
              data={ladder.data}
              inks={INKS}
              headingLevel={2}
              className="yn-play m5b-pz"
            />
          ) : null}
          <div className="m5b-row-r">
            {riddle ? (
              <Riddle
                issue={issue}
                data={riddle.data}
                yesterday={play.yesterday?.riddle}
                inks={INKS}
                headingLevel={2}
                className="yn-play m5b-pz"
              />
            ) : null}
            <Yesterday edition={edition} />
          </div>
        </div>
        {search || fortune ? (
          <div className="m5b-row m5b-row--play">
            {search ? (
              <WordSearch
                issue={issue}
                data={search.data}
                inks={INKS}
                headingLevel={2}
                className="yn-play m5b-pz"
              />
            ) : null}
            {fortune ? (
              <FortuneTeller
                issue={issue}
                data={fortune.data}
                inks={INKS}
                headingLevel={2}
                className="yn-play m5b-pz"
              />
            ) : null}
          </div>
        ) : null}
      </div>
      {puzzlesFirst ? bye1 : <SignOff after={after} edition={edition} />}
    </article>
  );

  const backPage = (
    <article
      className="print-sheet print-sheet--bright m5-sheet-flow m5b-right"
      aria-label={`Page ${bk}`}
      key="back"
    >
      <Folio page={bk} section="The back page" date={edition.date} />
      {puzzlesFirst ? bye2 : null}
      <div className="m5-page-flow m5b-page">
        {comic ? <Comic comic={comic} /> : null}
        <div className="m5b-lower">
          <div className="m5b-col">
            {corrections.length ? (
              <section className="m5b-corrections" aria-labelledby="m5b-corrections">
                <h2 id="m5b-corrections" className="m5-display m5b-h">
                  Corrections
                </h2>
                <div className="m5-body m5-read m5-read--1">
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
          {classifieds.length ? (
            <section
              className="m5b-col m5b-col--wide m5b-classifieds"
              aria-labelledby="m5b-classifieds"
            >
              <h2 id="m5b-classifieds" className="m5-display m5b-h">
                Classifieds
              </h2>
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
        </div>
        <BackKeepsakes edition={edition} className="m5b-keepsakes" />
      </div>
      {puzzlesFirst ? <SignOff after={after} edition={edition} /> : bye1}
    </article>
  );

  return (
    <div className="print-sheet-wrap">
      <div
        className={`print-spread m5b-spread m5b-spread--${composition}`}
        data-composition={composition}
      >
        {puzzlesFirst ? [puzzles, backPage] : [backPage, puzzles]}
      </div>
    </div>
  );
}

function SignOff({ after, edition }: { after: string; edition: Edition }) {
  return (
    <div className="m5b-signoff">
      <p className="m5b-tomorrow">{after || "See you tomorrow."}</p>
      <p className="m5b-colophon">
        The Yay News · Vol. {edition.volume}, No. {edition.issueNumber} · {longDate(edition.date)}
      </p>
    </div>
  );
}
