import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import type { Photo as PhotoData } from "@/app/mockups/_data/photos";
import { Folio, Pencil, Photo, SectionFlag, Sheet } from "../_components/parts";

const { crossword, wordLadder, riddle, yesterday } = edition.puzzles;
const word = edition.guest.wordOfTheDay;

// Classified advertisements, grouped under the headings a small-ads page always ran.
const classified: { head: string; ads: [string, string][] }[] = [
  {
    head: "Announcements",
    ads: [
      ["Births.", "To Anna and Tom Reyes, a daughter, Rose, who smiled on Thursday and has not stopped."],
      ["Engagements.", "Mr G. Holt and Miss P. Amadi, on the pier, at sunset, on the nine-out-of-ten bench."],
      ["Anniversaries.", "Joan and Walter Albright, fifty years. He still saves her a seat."],
      ["Thanks.", "To whoever returned my bicycle, oiled, with a note that said “it squeaked.” It did."],
      ["Retirements.", "Mrs D. Fenn, lollipop lady, after thirty-one years and not one bad morning."],
    ],
  },
  {
    head: "Wanted",
    ads: [
      ["Beta testers", "for a gardening game where the vegetables have opinions. Must enjoy being judged by a carrot."],
      ["Octopus,", "pale, good sense of rhythm, for encore. Camera provided. Apply the R.V. Curiosity."],
      ["Tenor,", "any age, for village choir. Must bring own tea and tolerate a second key change."],
      ["Someone to explain", "the inside line to a grandson. Apply Mrs Marsh, Harbour St."],
      ["Jam jars,", "any number, for the church fête. Lids optional; enthusiasm essential."],
      ["Knitting circle", "seeks a goat, as seen on Puppet Farm, to demonstrate. Tuesdays at five."],
    ],
  },
  {
    head: "Free to a good home",
    ads: [
      ["Typeface,", "open-source, looks like handwriting on a steamy window. Fog up your posters."],
      ["Forty sticky notes,", "each reading “you’re doing fine.” Collect from the café, any morning."],
      ["Bench,", "sea view, rated nine out of ten. Must be sat on at sunset. Not to be removed."],
      ["Kittens,", "four, all opinionated, all house-trained, one already applying for a bakery."],
      ["Rhubarb,", "far too much of it. Take as much as you like from the box by the gate."],
      ["Upright piano,", "keys work, no doors to open. You collect; we will play you out."],
    ],
  },
  {
    head: "Lost & found",
    ads: [
      ["Lost.", "One sense of urgency, last seen on Friday afternoon. No reward; please do not return."],
      ["Found.", "A high score of 88,810 on the Pier Arcade pinball, initials P.E.T. Please claim it."],
      ["Found.", "A glove, under seat 23, 1971. Returned. Thank you, Mr Albright."],
      ["Lost.", "Track of time, in a very good book. Finder may keep it."],
    ],
  },
  {
    head: "For hire",
    ads: [
      ["Retired lighthouse keeper", "offers calm, reliable waving at passing boats. References from several ferries."],
      ["Robot, one careful owner,", "folds fitted sheets in ninety seconds. Corners understood."],
      ["Brass band,", "theme tunes only, weddings and bandstands. Conductor may be a member of the public."],
      ["Choir of forty", "for weddings, birthdays and lighthouses. One key change included; two by arrangement."],
      ["Man with van", "and a good singing voice. Removals, and he will hum while he lifts."],
    ],
  },
  {
    head: "Situations",
    ads: [
      ["Head baker", "required, whiskers an advantage. Early mornings. Herons need not apply."],
      ["Usher,", "torch provided. Must keep one seat free for whoever comes in late."],
      ["Announcer,", "late nights, for shipping forecast. Soft voice; must imagine the boats."],
      ["Beach hut attendant,", "summer season. Duties: unlocking, sweeping sand, admiring the view."],
      ["Crossword setter", "for this newspaper. Clues must be kind. Five-by-five minimum."],
    ],
  },
  {
    head: "Lessons",
    ads: [
      ["Swimming,", "very slowly, at the Lido, to swing music. Saturdays at half past six."],
      ["Piano,", "for grown-ups who stopped at eleven. No scales unless you ask."],
      ["Square-ball tennis", "with Mr Achebe, Elm Court. He will not let you win; he will teach you."],
      ["Folding.", "Fitted sheets, taught by Linen, a robot. Bring your own corners."],
    ],
  },
  {
    head: "Personal",
    ads: [
      ["Tortoise,", "slow but sincere, seeks bakery that stays open a minute longer. Will be worth the wait."],
      ["To the person", "who paid for my coffee on Tuesday: I paid for the next two. — A nurse."],
      ["Disco Pete —", "the whole lab is humming. Please come back. We have more light."],
      ["Mum,", "I read the octopus one to you on the phone. Ring me when you have seen the picture."],
    ],
  },
];

// The strip's four panels: who is speaking, what they say, and the photograph behind them.
const panelPhotos: { photo: PhotoData; position: string }[] = [
  { photo: pick("goldenRetriever"), position: "50% 30%" },
  { photo: pick("songbird"), position: "50% 40%" },
  { photo: pick("goldenRetriever", 1), position: "50% 35%" },
  { photo: pick("bench"), position: "50% 60%" },
];

export default function BackPage() {
  const size = crossword.grid.length;

  return (
    <Sheet page="back">
      <SectionFlag
        page={8}
        title="The Back Page"
        sub="Puzzles, corrections, classified advertisements and the strip"
        earLeft={
          <>
            <b>Solutions</b> to today’s puzzles are printed upside down at the foot of each, for the honest.
          </>
        }
        earRight={
          <>
            <b>Small advertisements</b> are accepted until six in the evening, free, if they are nice.
          </>
        }
      />

      <div className="me-bk-top">
        <section className="me-xword" aria-labelledby="me-xword-head">
          <h2 className="me-bk-head" id="me-xword-head">
            {crossword.title} Crossword
          </h2>
          <p className="me-listings-sub">No. {edition.issue}. Five across, five down, one cup of tea.</p>
          <div className="me-xword-body">
            <div className="me-xword-wrap">
              <div
                className="me-xword-grid"
                role="img"
                aria-label={`A ${size} by ${size} crossword grid with black squares`}
                style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
              >
                {crossword.grid.flatMap((row, r) =>
                  row.split("").map((cell, c) => {
                    const n = crossword.numbers[`${r},${c}`];
                    return (
                      <span key={`${r}-${c}`} className={cell === "#" ? "me-xcell me-xcell--black" : "me-xcell"}>
                        {n ? <small>{n}</small> : null}
                      </span>
                    );
                  }),
                )}
              </div>
              <Pencil name="sketch-07" className="me-xword-tick" />
            </div>
            <div className="me-clues">
              <div>
              <p className="me-clues-head">Across</p>
              {crossword.across.map((c) => (
                <p key={`a${c.n}`}>
                  <b>{c.n}</b> {c.clue} ({c.answer.length})
                </p>
              ))}
              </div>
              <div>
              <p className="me-clues-head">Down</p>
              {crossword.down.map((c) => (
                <p key={`d${c.n}`}>
                  <b>{c.n}</b> {c.clue} ({c.answer.length})
                </p>
              ))}
              </div>
            </div>
          </div>
          <p className="me-upside" aria-label={`Solution: across ${crossword.across.map((c) => c.answer).join(", ")}`}>
            Across: {crossword.across.map((c) => `${c.n} ${c.answer}`).join(", ")}. Down:{" "}
            {crossword.down.map((c) => `${c.n} ${c.answer}`).join(", ")}.
          </p>
        </section>

        <div className="me-bk-mid me-rule">
          <section className="me-ladder-box" aria-labelledby="me-ladder-head">
            <h2 className="me-bk-head" id="me-ladder-head">
              {wordLadder.title}
            </h2>
            <p className="me-bk-instr">{wordLadder.instructions}</p>
            <div className="me-rungs" aria-label={`From ${wordLadder.start} to ${wordLadder.end} in ${wordLadder.steps} steps`}>
              {[wordLadder.end, ...Array<string>(wordLadder.steps).fill(""), wordLadder.start].map((w, i) => (
                <div key={i} className="me-rung">
                  {Array.from({ length: wordLadder.start.length }, (_, k) => (
                    <span key={k}>{w[k] ?? ""}</span>
                  ))}
                </div>
              ))}
            </div>
            <p className="me-upside">{wordLadder.solution.join(", ")}</p>
          </section>

          <section className="me-riddle" aria-labelledby="me-riddle-head">
            <h2 className="me-bk-head" id="me-riddle-head">
              {riddle.title}
            </h2>
            <p className="me-riddle-q">{riddle.question}</p>
            <p className="me-upside">{riddle.answer}.</p>
            <p className="me-bk-instr">{yesterday}</p>
          </section>

          <section className="me-tomorrow print-worn" aria-labelledby="me-tomorrow-head">
            <p className="me-box-head me-box-head--big" id="me-tomorrow-head">
              Tomorrow
            </p>
            <p>
              <b>A tortoise</b> finishes the marathon it started in April, to a crowd.
            </p>
            <p>
              <b>Pickle ice cream</b> meets its match: a creamery tries marmalade.
            </p>
            <p>
              <b>Disco Pete:</b> the camera has been checked. Nobody is saying anything yet.
            </p>
          </section>
        </div>

        <div className="me-bk-side me-rule">
          <section className="me-corr" aria-labelledby="me-corr-head">
            <h2 className="me-bk-head" id="me-corr-head">
              Corrections &amp; Clarifications
            </h2>
            {edition.corrections.map((c) => (
              <p key={c.slice(0, 20)}>{c}</p>
            ))}
            <p>
              A caption on page two described the Regal’s red seats as “worn.” They are, the management asks us to
              say, “loved.”
            </p>
          </section>

          <section className="me-word" aria-labelledby="me-word-head">
            <p className="me-box-head" id="me-word-head">
              A word for today
            </p>
            <p className="me-word-w">{word.word}</p>
            <p className="me-word-p">{word.pronunciation}, noun</p>
            <p className="me-word-m">{word.meaning}</p>
            <p className="me-word-e">“{word.example}”</p>
          </section>

          <section className="me-bk-quote" aria-label="Said this week">
            <p className="me-box-head">Said this week</p>
            <blockquote>
              <p>“{edition.quoteOfTheDay.text}”</p>
            </blockquote>
            <p className="me-quote-by">— {edition.quoteOfTheDay.by}</p>
          </section>
        </div>
      </div>

      <section className="me-strip" aria-labelledby="me-strip-head">
        <h2 className="me-strip-head" id="me-strip-head">
          {edition.comic.title}
          <span>A strip in four photographs</span>
        </h2>
        <ol className="me-panels">
          {edition.comic.panels.map((line, i) => {
            const [who, ...said] = line.split(": ");
            const panel = panelPhotos[i];
            if (!panel) return null;
            return (
              <li key={line} className={`me-panel me-panel--${i + 1}`}>
                <Photo photo={panel.photo} sizes="(max-width: 760px) 100vw, 280px" position={panel.position} />
                <p className="me-balloon">
                  <span className="me-balloon-who">{who === "PIP" ? "Pip" : "Pigeon"}</span>
                  {said.join(": ")}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="me-classified" aria-labelledby="me-class-head">
        <h2 className="me-class-head" id="me-class-head">
          Classified Advertisements
        </h2>
        <div className="me-class-cols">
          {classified.map((group, gi) => (
            <div key={group.head} className="me-class-group">
              <h3>{group.head}</h3>
              {group.ads.map(([run, text]) => (
                <p key={run + text.slice(0, 12)}>
                  <b>{run}</b> {text}
                </p>
              ))}
              {gi === 1 ? (
                <div className="me-ad me-ad--a me-class-display">
                  <p className="me-ad-small">Open daily from six</p>
                  <p className="me-ad-big">Butter’s Bakery</p>
                  <p className="me-ad-text">Mill Lane. Cats welcome. Herons, please pay.</p>
                </div>
              ) : null}
              {gi === 4 ? (
                <div className="me-ad me-ad--b me-class-display">
                  <p className="me-ad-big">Pickle Ice Cream</p>
                  <p className="me-ad-text">Four hundred tubs a week. It is, honestly, good.</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <Pencil name="arrows-02" className="me-class-arrow" />
      </section>

      <section className="me-signoff" aria-label="Sign-off">
        <p className="me-signoff-big">{edition.signOff}</p>
        <p className="me-colophon">
          The Yay News is written, set and printed for anyone who wants a little good news with their breakfast. Every
          story in this sample edition is invented. Photographs from Unsplash, credited where they appear. Printed on
          recycled newsprint; when you have finished with it, wrap something nice in it.
        </p>
      </section>

      <Folio page={8} section="The Back Page" />
    </Sheet>
  );
}
