import Link from "next/link";
import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";
import {
  Barcode,
  Bars,
  FOLIO_DATE,
  Folio,
  Masthead,
  Photo,
  Stamp,
  Sheet,
  Tape,
} from "./_components/parts";

const BLUE = "var(--blue)";
const ORANGE = "var(--orange)";

const index: [string, number][] = [
  ["Screen & Sound", 2],
  ["Gaming", 3],
  ["Sports", 4],
  ["Tech", 5],
  ["Money", 6],
  ["Internet & Culture", 6],
  ["Food & Words", 7],
  ["Puzzles & the back", 8],
];

/** Rings one phrase in a paragraph with a loose marker circle. */
function Ring({ children, ink }: { children: string; ink: string }) {
  return (
    <span className="tb-ring">
      {children}
      <Mark name="ellipse-01" ink={ink} className="tb-mark" />
    </span>
  );
}

export default function TabloidFront() {
  const { lead, numberOfTheDay, weather } = edition;
  const gaming = edition.sections.find((s) => s.slug === "gaming")?.stories[0];
  const choir = edition.sections.find((s) => s.slug === "screen-and-sound")?.stories[1];
  const [p1, p2, p3, p4, p5] = lead.body;
  const [beforePete, afterPete] = (p4 ?? "").split("“Disco Pete”");

  return (
    <Sheet theme="front">
      <Masthead
        title="The Yay News"
        specTitle="Today's paper"
        spec={[
          ["Date", FOLIO_DATE],
          ["Issue", `Vol. ${edition.volume} · No. ${edition.issue}`],
          ["Read time", `${edition.readMinutes} min, then done`],
        ]}
        box={
          <>
            <span className="tb-box-words">
              Free
              <small>forever · No. {edition.issue}</small>
            </span>
            <Barcode />
          </>
        }
      />

      <section className="tb-front2-teasers" aria-label="Also inside">
        <div className="tb-pasted print-print tb-front2-cat">
          <Photo
            photo={pick("bakeryCat")}
            sizes="(max-width: 760px) 70vw, 160px"
            position="50% 35%"
          />
          <Tape />
          <span className="tb-pasted-cap" aria-hidden>
            Butter, head baker
          </span>
        </div>
        {gaming ? (
          <Link href="/mockups/v3/gaming">
            <p className="tb-teaser-head tb-cond">A cat runs a bakery. It&rsquo;s number one.</p>
            <p className="tb-teaser-jump">
              Game of the week, <b>page 3 →</b>
            </p>
          </Link>
        ) : null}
        {choir ? (
          <Link href="/mockups/v3/screen-and-sound" className="tb-teaser2">
            <p className="tb-teaser-head tb-cond">
              Forty singers, one church hall, ten million streams
            </p>
            <p className="tb-teaser-jump">
              The key change, <b>page 2 →</b>
            </p>
          </Link>
        ) : null}
      </section>

      <Photo
        photo={pick("octopus")}
        sizes="(max-width: 760px) 100vw, 1100px"
        className="tb-grow tb-bleed"
        position="50% 45%"
        priority
      >
        <Burst fill={BLUE} points={20} depth={0.13} className="tb-sticker tb-front2-sticker">
          <span aria-hidden>
            <span className="tb-sticker-big">{lead.sticker}</span>
            <span className="tb-sticker-hand">it&rsquo;s got moves</span>
          </span>
        </Burst>
        <p className="tb-note tb-front2-note" aria-hidden>
          eleven whole
          <br />
          minutes of this!
        </p>
        <Mark name="arrows-09" ink={ORANGE} className="tb-mark tb-front2-arrow" />
        <Mark name="stars-06" ink={ORANGE} className="tb-mark tb-front2-sparks" />
        <div className="tb-onphoto">
          <p className="tb-kicker">{lead.kicker}:</p>
          <h2 className="tb-splash">
            <Bars className="tb-bars--over">{lead.headline}</Bars>
          </h2>
        </div>
        <Stamp className="tb-front2-stamp">
          Sample edition
          <small>Invented news · real paper</small>
        </Stamp>
      </Photo>

      <section className="tb-band tb-front2-band" aria-label="Today's stories">
        <article className="tb-col">
          <div className="tb-story-cols">
            <p className="tb-byline">
              By our deep-sea correspondent · <b>Filed from 1,200 m down</b>
            </p>
            <p className="tb-dek">{lead.dek}</p>
            <p className="tb-dropcap tb-first">{p1}</p>
            <p>{p2}</p>
            <p>{p3}</p>
            <p>
              {beforePete}
              <Ring ink={ORANGE}>&ldquo;Disco Pete&rdquo;</Ring>
              {afterPete}
            </p>
            <p>{p5}</p>
            <p className="tb-source">
              Source: {lead.source} · {lead.readMinutes} min read · Photo: {pick("octopus").credit}
            </p>
          </div>
        </article>

        <nav className="tb-col" aria-labelledby="inside-today">
          <div className="tb-colhead">
            <p className="tb-kicker">Inside today:</p>
            <h2 id="inside-today" className="tb-cond tb-h3">
              Eight pages, all good
            </h2>
          </div>
          <ol className="tb-index">
            {index.map(([name, page]) => (
              <li key={name}>
                {name}
                <b>{page}</b>
              </li>
            ))}
          </ol>
        </nav>

        <aside className="tb-col" aria-labelledby="number-of-the-day">
          <p className="tb-kicker" id="number-of-the-day">
            Number of the day:
          </p>
          <p className="tb-front2-num tb-cond">
            <span className="tb-underline">
              {numberOfTheDay.value}
              <Mark name="brush-03" ink={ORANGE} className="tb-mark tb-over" />
            </span>
          </p>
          <p>
            <span className="tb-runin">Picnic blankets, </span>
            {numberOfTheDay.caption.replace(/^picnic blankets /, "")}.
          </p>
          <div className="tb-weather">
            <p className="tb-kicker">Weather:</p>
            <h2 className="tb-weather-head tb-cond">{weather.headline}</h2>
            <p>{weather.detail}</p>
          </div>
        </aside>
      </section>

      <Folio page={1} section="Front page" />
    </Sheet>
  );
}
