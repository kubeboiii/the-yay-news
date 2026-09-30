import type { Edition, Image as EditionImage } from "@repo/shared";
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
import { Mark } from "@repo/ui/print/mark";
import { BackKeepsakes, backPlay } from "../back-play";
import type { PageProps } from "../types";
import { WordCard, guestTakes } from "./guest";
import { backComp, featureOf, featuresOf, fitSize } from "./lib";
import { Folio, Photo, RunningHead, Zigzag } from "./parts";

// The back page: the comic, the puzzles (played in pencil, printed blank) with yesterday's answers, the small print (corrections,
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

/** The reader's pencil on newsprint; the marker is the colourway's pop. */
const INKS: PlayInks = {
  ink: "var(--ink)",
  print: "var(--ink)",
  paper: "var(--paper)",
  highlight: "color-mix(in srgb, var(--pop), transparent 30%)",
  mark: "var(--neon-pink-type)",
};
/** On the pop-coloured side panel, pencil and print take the panel's own ink. */
const SIDE_INKS: PlayInks = {
  ...INKS,
  ink: "var(--pop-ink)",
  print: "var(--pop-ink)",
  highlight: "color-mix(in srgb, var(--pop2), transparent 20%)",
};

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

function Yesterday({ edition }: { edition: Edition }) {
  const y = backPlay(edition).yesterday;
  if (!y || (!y.crossword && !y.ladder && !y.riddle)) return null;
  return (
    <div className="bk-yesterday bs-yesterday">
      <p className="yn-kicker">Yesterday&rsquo;s answers · No. {y.issue}</p>
      {y.crossword ? (
        <div className="bs-y-xword">
          <CrosswordAnswers
            data={y.crossword.data}
            solution={y.crossword.solution}
            inks={INKS}
            hideTitle
            className="yn-play bs-y-grid"
          />
          <p>
            <b>Across</b> {y.crossword.solution.across.map((a) => `${a.n} ${a.answer}`).join(", ")}.{" "}
            <b>Down</b> {y.crossword.solution.down.map((a) => `${a.n} ${a.answer}`).join(", ")}.
          </p>
        </div>
      ) : null}
      {y.ladder ? (
        <p>
          <b>{y.ladder.data.title}</b> {y.ladder.solution.ladder.join(" → ")}
        </p>
      ) : null}
      {y.riddle ? (
        <p>
          <b>The riddle</b> is under the folded corner of today&rsquo;s.
        </p>
      ) : null}
    </div>
  );
}

export function Back({ edition, reading }: PageProps) {
  const play = backPlay(edition);
  const { issue, crossword, ladder, riddle, search, fortune } = play;
  const comic = featureOf(edition, "comic");
  const corrections = featuresOf(edition, "correction");
  const taken = guestTakes(edition);
  const classifieds = taken.includes("classified") ? [] : featuresOf(edition, "classified");
  const letters = taken.includes("letter") ? [] : featuresOf(edition, "letter");
  const word = taken.includes("word_of_the_day") ? null : featureOf(edition, "word_of_the_day");
  const quote = featureOf(edition, "quote");
  const signOff =
    featureOf(edition, "sign_off")?.text ?? "You're done for today. See you tomorrow.";
  const cut = signOff.search(/[.!?]\s/);
  const [signFirst, signSecond] =
    cut < 0
      ? ["You’re done for today.", signOff]
      : [signOff.slice(0, cut + 1), signOff.slice(cut + 2)];
  const bigSize = fitSize(signSecond, 350, 78, 0.29);
  const hasPuzzles = crossword || ladder || riddle || search || fortune;
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
          <blockquote
            className="yn-pullquote"
            style={
              // Beside the strip with nothing else in its column, the quote is set as big as the
              // column's depth allows (about 145 × 190 sheet units), so it fills it.
              comic && !letters.length && !word
                ? {
                    fontSize: `calc(var(--u) * ${Math.min(13, Math.sqrt(40_000 / Math.max(quote.text.length, 40))).toFixed(2)})`,
                  }
                : undefined
            }
          >
            &ldquo;{quote.text}&rdquo;
          </blockquote>
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
              className={`bk-puzzles bs-puzzles bs-puzzles--play ${crossword ? "" : "bs-puzzles--nogrid"}`}
              aria-label="Puzzles"
            >
              {crossword ? (
                <Crossword
                  issue={issue}
                  data={crossword.data}
                  inks={INKS}
                  headingLevel={2}
                  className="yn-play bs-play bs-play-xw"
                />
              ) : null}

              {ladder || riddle ? (
                <div className="bk-side">
                  <div className="bk-side-ink print-worn" aria-hidden />
                  {ladder ? (
                    <WordLadder
                      issue={issue}
                      data={ladder.data}
                      inks={SIDE_INKS}
                      headingLevel={2}
                      className="yn-play bs-play"
                    />
                  ) : null}
                  {riddle ? (
                    <Riddle
                      issue={issue}
                      data={riddle.data}
                      yesterday={play.yesterday?.riddle}
                      inks={SIDE_INKS}
                      headingLevel={2}
                      className="yn-play bs-play"
                    />
                  ) : null}
                </div>
              ) : null}
            </section>
            <section className="bs-play-row" aria-label="More puzzles">
              {search ? (
                <WordSearch
                  issue={issue}
                  data={search.data}
                  inks={INKS}
                  headingLevel={2}
                  className="yn-play bs-play"
                />
              ) : null}
              {fortune ? (
                <FortuneTeller
                  issue={issue}
                  data={fortune.data}
                  inks={INKS}
                  headingLevel={2}
                  className="yn-play bs-play"
                />
              ) : null}
              <Yesterday edition={edition} />
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

        <BackKeepsakes edition={edition} className="bs-keepsakes" />

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
