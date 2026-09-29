import type { Edition, Image as EditionImage, Puzzle } from "@repo/shared";
import type { CSSProperties } from "react";
import { Mark } from "@/features/print/mark";
import type { PageProps } from "../types";
import { WordCard, guestTakes } from "./guest";
import { backComp, featureOf, featuresOf, fitSize, puzzleOf, solvedOf } from "./lib";
import { Folio, Photo, RunningHead, Zigzag } from "./parts";

// The back page: the comic, the puzzles with yesterday's answers, the small print (corrections,
// classifieds, letters, the quote and the word of the day, whichever the edition has) and the
// sign-off, set too big for the sheet.

const photo = (id: string, alt: string, credit: string): EditionImage => ({
  url: `https://images.unsplash.com/${id}`,
  alt,
  credit,
  licence: "Unsplash License",
  licenceUrl: "https://unsplash.com/license",
  kind: "photo",
});

/*
 * The strip's cast, photographed once and reused every day like any recurring comic: Pip is the
 * otters, Pigeon is the golden retriever. A speaker the cast doesn't know gets the next photo.
 */
const CAST: Record<string, { photo: EditionImage; position: string }[]> = {
  PIP: [
    {
      photo: photo(
        "photo-1633967920376-33b2d94f091f",
        "Sea otters floating together",
        "Kedar Gadge",
      ),
      position: "center 60%",
    },
    {
      photo: photo(
        "photo-1633967920376-33b2d94f091f",
        "Sea otters floating together",
        "Kedar Gadge",
      ),
      position: "20% 70%",
    },
  ],
  PIGEON: [
    {
      photo: photo(
        "photo-1633722715463-d30f4f325e24",
        "A golden retriever sitting in grass",
        "Shayna Douglas",
      ),
      position: "center 35%",
    },
    {
      photo: photo(
        "photo-1626736637845-53045bb9695b",
        "A golden retriever puppy",
        "Anthony Persegol",
      ),
      position: "center 40%",
    },
  ],
};
const EXTRAS = [...(CAST.PIP ?? []), ...(CAST.PIGEON ?? [])];

/** Splits a comic line like "PIP: Hello" into the speaker and what they said. */
function splitLine(line: string) {
  const i = line.indexOf(":");
  return i < 0 || i > 24
    ? { who: "", said: line }
    : { who: line.slice(0, i).trim(), said: line.slice(i + 1).trim() };
}

const titleCase = (w: string) =>
  w
    .toLowerCase()
    .split(" ")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");

function Comic({ comic, grid }: { comic: { title: string; panels: string[] }; grid?: boolean }) {
  const seen: Record<string, number> = {};
  const speakers: string[] = [];
  const panels = comic.panels.slice(0, 6).map((line, i) => {
    const { who, said } = splitLine(line);
    const key = who.toUpperCase();
    if (who && !speakers.includes(who)) speakers.push(who);
    const k = seen[key] ?? 0;
    seen[key] = k + 1;
    const cast = CAST[key]?.[k % 2] ?? EXTRAS[i % EXTRAS.length]!;
    const side = speakers.indexOf(who) % 2 === 1 ? "right" : "left";
    return { who, said, cast, side, key: `${i}-${line}` };
  });
  return (
    <section aria-labelledby="bs-comic-title">
      <div className="bk-comic-title">
        <h2 id="bs-comic-title" className="yn-chunk">
          {comic.title}
        </h2>
        <p className="yn-caption">
          {speakers.length
            ? `Starring ${speakers.map(titleCase).join(" and ")}.`
            : "Today’s strip."}
        </p>
      </div>
      <ol
        className={`bk-strip bs-strip ${grid ? "bs-strip--grid" : ""}`}
        style={{ "--cols": panels.length } as CSSProperties}
      >
        {panels.map((p) => (
          <li key={p.key} className="bk-panel">
            <Photo
              image={p.cast.photo}
              position={p.cast.position}
              sizes="(max-width: 760px) 50vw, 280px"
              width={800}
            />
            <p className={`yn-balloon ${p.side === "right" ? "right" : ""}`}>
              {p.who ? <span className="who">{titleCase(p.who)}</span> : null}
              <span className="said">{p.said}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Crossword({ data }: { data: Extract<Puzzle, { type: "crossword" }>["data"] }) {
  const cols = Math.max(...data.rows.map((r) => r.length), 1);
  const numbers = new Map(data.numbers.map((x) => [`${x.row},${x.col}`, x.n]));
  return (
    <div className="bk-xword-wrap">
      <h2 className="yn-chunk bk-head">{data.title}</h2>
      <div
        className="yn-xword bs-xword"
        role="img"
        aria-label={`A ${cols} by ${data.rows.length} crossword grid`}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          aspectRatio: `${cols} / ${data.rows.length}`,
        }}
      >
        {data.rows.flatMap((row, r) =>
          [...row.padEnd(cols, "#")].map((ch, c) => {
            const n = numbers.get(`${r},${c}`);
            return (
              <div key={`${r}-${c}`} className={ch === "#" ? "block" : undefined}>
                {n ? <span>{n}</span> : null}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

function Yesterday({ edition }: { edition: Edition }) {
  const y = edition.yesterday;
  if (!y || !y.puzzles.length) return null;
  const xword = solvedOf(edition, "crossword");
  const ladder = solvedOf(edition, "word_ladder");
  const riddle = solvedOf(edition, "riddle");
  return (
    <div className="bk-yesterday bs-yesterday">
      <p className="yn-kicker">Yesterday&rsquo;s answers · No. {y.issueNumber}</p>
      {xword ? (
        <div className="bs-y-xword">
          <div
            className="bs-mini"
            aria-hidden
            style={{
              gridTemplateColumns: `repeat(${Math.max(...xword.solution.grid.map((r) => r.length), 1)}, 1fr)`,
            }}
          >
            {xword.solution.grid.flatMap((row, r) =>
              [...row].map((ch, c) => (
                <span key={`${r}-${c}`} className={ch === "#" ? "block" : undefined}>
                  {ch === "#" ? "" : ch}
                </span>
              )),
            )}
          </div>
          <p>
            <b>Across</b> {xword.solution.across.map((a) => `${a.n} ${a.answer}`).join(", ")}.{" "}
            <b>Down</b> {xword.solution.down.map((a) => `${a.n} ${a.answer}`).join(", ")}.
          </p>
        </div>
      ) : null}
      {ladder ? (
        <p>
          <b>{ladder.data.title}</b> {ladder.solution.ladder.join(" → ")}
        </p>
      ) : null}
      {riddle ? (
        <p>
          <b>{riddle.data.title}</b> {riddle.data.question} <i>{riddle.solution.answer}.</i>
        </p>
      ) : null}
    </div>
  );
}

export function Back({ edition, reading }: PageProps) {
  const crossword = puzzleOf(edition, "crossword");
  const ladder = puzzleOf(edition, "word_ladder");
  const riddle = puzzleOf(edition, "riddle");
  const comic = featureOf(edition, "comic");
  const corrections = featuresOf(edition, "correction");
  const classifieds = featuresOf(edition, "classified");
  const taken = guestTakes(edition);
  const letters = taken === "letter" ? [] : featuresOf(edition, "letter");
  const word = taken === "word_of_the_day" ? null : featureOf(edition, "word_of_the_day");
  const quote = featureOf(edition, "quote");
  const signOff =
    featureOf(edition, "sign_off")?.text ?? "You're done for today. See you tomorrow.";
  const cut = signOff.search(/[.!?]\s/);
  const [signFirst, signSecond] =
    cut < 0
      ? ["You’re done for today.", signOff]
      : [signOff.slice(0, cut + 1), signOff.slice(cut + 2)];
  const bigSize = fitSize(signSecond, 350, 78, 0.29);
  const hasPuzzles = crossword || ladder || riddle;
  const hasOdds = Boolean(letters.length || word || quote);
  const comp = backComp(edition);
  const odds = (
    <section className="bs-odds" aria-label="Letters and odds">
      {letters.map((l, i) => (
        <figure key={i} className="bs-odd bs-odd-letter">
          <p className="yn-label">Letter to the editor</p>
          <blockquote className="yn-body">{l.text}</blockquote>
          <figcaption className="yn-pullquote-by">— {l.from}</figcaption>
        </figure>
      ))}
      {quote ? (
        <figure className="bs-odd bs-odd-quote">
          <p className="yn-label">Quote of the day</p>
          <blockquote className="yn-pullquote">&ldquo;{quote.text}&rdquo;</blockquote>
          <figcaption className="yn-pullquote-by">{quote.by}</figcaption>
        </figure>
      ) : null}
      {word ? <WordCard word={word} /> : null}
    </section>
  );

  return (
    <div className="yn-sheet-wrap">
      <article
        className={`yn-sheet yn-inside yn-theme-back bs-inside bs-back bs-back--${comp}`}
        data-comp={comp}
      >
        <RunningHead
          edition={edition}
          reading={reading}
          title="The Back Page"
          tagline="Puzzles, small print, and the bit where you’re done"
        />

        {comic && comp === "strip-first" ? (
          <>
            <Zigzag word="the funnies" />
            <Comic comic={comic} />
          </>
        ) : null}

        {hasPuzzles ? (
          <>
            <Zigzag word="puzzles" />
            <section
              className={`bk-puzzles bs-puzzles ${crossword ? "" : "bs-puzzles--nogrid"}`}
              aria-label="Puzzles"
            >
              {crossword ? <Crossword data={crossword.data} /> : null}

              <div className="bk-clues">
                {crossword ? (
                  <>
                    <h3>Across</h3>
                    <ol>
                      {crossword.data.across.map((c) => (
                        <li key={`a${c.n}`}>
                          <b>{c.n}</b>
                          <span>
                            {c.clue} ({c.length})
                          </span>
                        </li>
                      ))}
                    </ol>
                    <h3>Down</h3>
                    <ol>
                      {crossword.data.down.map((c) => (
                        <li key={`d${c.n}`}>
                          <b>{c.n}</b>
                          <span>
                            {c.clue} ({c.length})
                          </span>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : null}
                <Yesterday edition={edition} />
              </div>

              {ladder || riddle ? (
                <div className="bk-side">
                  <div className="bk-side-ink print-worn" aria-hidden />
                  {ladder ? <Ladder data={ladder.data} /> : null}
                  {riddle ? (
                    <div className="bk-riddle">
                      <p className="yn-kicker">{riddle.data.title}</p>
                      <p className="yn-chunk">{riddle.data.question}</p>
                      <p className="yn-body">The answer is printed in tomorrow&rsquo;s paper.</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          </>
        ) : null}

        {comp === "puzzles-first" && (comic || hasOdds) ? (
          <>
            <Zigzag word="the funnies" />
            <div className={`bs-grid ${comic && hasOdds ? "bs-b-funnies" : ""}`}>
              {comic ? <Comic comic={comic} grid={Boolean(hasOdds)} /> : null}
              {hasOdds ? odds : null}
            </div>
          </>
        ) : null}

        {corrections.length || classifieds.length ? (
          <>
            <Zigzag word="small print" />
            <section
              className={`bk-small bs-small ${corrections.length && classifieds.length ? "" : "bs-small--one"}`}
              aria-label="Corrections and classifieds"
            >
              {corrections.length ? (
                <div className="bk-corrections">
                  <h2 className="yn-chunk bk-head">Corrections and clarifications</h2>
                  <div className="yn-body">
                    {corrections.map((c, i) => (
                      <p key={i}>{c.text}</p>
                    ))}
                  </div>
                  <p className="yn-jump">
                    Spotted a mistake that was too kind? Tell the readers&rsquo; editor.
                  </p>
                </div>
              ) : null}
              {classifieds.length ? (
                <div className="bk-classifieds">
                  <h2 className="yn-chunk bk-head">Classifieds</h2>
                  <ul
                    className="bs-classifieds"
                    style={{ "--cols": Math.min(classifieds.length, 4) } as CSSProperties}
                  >
                    {classifieds.map((c, i) => (
                      <li key={i}>
                        <h3 className="yn-chunk yn-caps">{c.heading}</h3>
                        <p>{c.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          </>
        ) : null}

        {comp === "strip-first" && hasOdds ? odds : null}

        <section className="bk-signoff" aria-label="Sign-off">
          <div className="bk-signoff-ink" aria-hidden />
          <p className="yn-chunk bk-signoff-small">{signFirst}</p>
          <p
            className="yn-chunk bk-signoff-big"
            style={{ fontSize: `calc(var(--u) * ${bigSize})` }}
          >
            {signSecond}
          </p>
          <Mark name="stars-06" className="yn-mark-abs bk-stars" />
        </section>

        <Folio edition={edition} reading={reading} section="The back page" />
      </article>
    </div>
  );
}

function Ladder({ data }: { data: Extract<Puzzle, { type: "word_ladder" }>["data"] }) {
  const width = Math.max(data.start.length, data.end.length);
  const rungs = [data.start, ...Array.from({ length: data.steps }, () => ""), data.end];
  return (
    <div className="bk-ladder">
      <h2 className="yn-chunk bk-head">{data.title}</h2>
      <p className="yn-body">{data.instructions}</p>
      <ol aria-label={`From ${data.start} to ${data.end} in ${data.steps} steps`}>
        {rungs.map((word, i) => (
          <li key={`rung-${i}`}>
            {Array.from({ length: width }, (_, k) => (
              <span key={k}>{word[k] ?? ""}</span>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
