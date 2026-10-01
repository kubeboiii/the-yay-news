import Link from "next/link";
import { loadSite } from "@/app/mockups/site-a/_shared/data";
import {
  GAP,
  Heading,
  Mascot,
  MASCOT_NAME,
  MASCOT_POSES,
  RansomHeading,
  RiotTheme,
} from "@/features/riot";
import { inksOf } from "./_ui/chrome";

const SCREENS = [
  {
    href: "shutter",
    name: "Today · before 7",
    what: "Not yet: one poster, a countdown, one button",
  },
  {
    href: "today",
    name: "Today · reading",
    what: "The paper on plain stock, a mixtape J-card of its pages",
  },
  {
    href: "done",
    name: "Today · finished",
    what: "Wheatpasted poster, proof of yay, tear-off tabs",
  },
  { href: "pile", name: "Pile", what: "Covers in each day's ink, find it, the stamp tour" },
  { href: "wall", name: "Wall", what: "Cut-outs, sleeves, punch card, stickers, film strip" },
];

export default async function DirectionB({ searchParams }: PageProps<"/mockups/site-b">) {
  const data = await loadSite(searchParams);
  const inks = inksOf(data);
  return (
    <RiotTheme inks={inks} as="main" className="sb sb-intro">
      <div className="sb-main">
        <p>
          <Link href="/mockups/site" className="sb-intro__back">
            All three directions
          </Link>
        </p>
        <RansomHeading
          text="RISO ZINE RIOT"
          seed="intro"
          className="sb-pile__h"
          cuts={[
            { ch: "R", from: "slab", size: 1.14 },
            { ch: "IS", from: "gothic", size: 1.06, tuck: 0.03, lift: -0.04 },
            { ch: "O", from: "didone", size: 0.92, lift: 0.08, tuck: 0.04, ground: "a" },
            GAP,
            { ch: "ZI", from: "roman", size: 1.02, turn: -2 },
            { ch: "NE", from: "grot", size: 0.9, tuck: 0.04, lift: 0.06 },
            GAP,
            { ch: "RI", from: "gothic", size: 1.12 },
            { ch: "O", from: "slab", size: 0.94, ground: "ink", tuck: 0.03, turn: 3 },
            { ch: "T", from: "didone", size: 1.04, tuck: 0.02 },
          ]}
        />
        <div className="sb-intro__grid">
          <section className="sb-intro__why" aria-labelledby="why-h">
            <Heading id="why-h" className="sb-h">
              Why it works
            </Heading>
            <ul>
              <li>
                <b>One loud thing a screen.</b> A flat poster, a ransom head, one button. The middle
                stays paper, and reading is one plain grotesque, black on it.
              </li>
              <li>
                <b>Two plates and the paper.</b> The day&rsquo;s lead ink as big flat areas, the
                second where it overprints the first. White only ever sits on black.
              </li>
              <li>
                <b>Words, not just colour.</b> States are said (new, half read, sold out), so they
                survive colour-blindness and the photocopier.
              </li>
              <li>
                <b>Big obvious moves.</b> The next page is the biggest button and names where it
                goes; every target is at least 44px, most 56px.
              </li>
              <li>
                <b>Motion is print.</b> Lines print in, {MASCOT_NAME} blinks and wags. All of it off
                for reduced motion.
              </li>
            </ul>
          </section>
          <section aria-labelledby="scr-h">
            <Heading id="scr-h" className="sb-h">
              The screens
            </Heading>
            <ol className="sb-intro__screens">
              {SCREENS.map((s) => (
                <li key={s.href}>
                  <Link href={`/mockups/site-b/${s.href}`} className="sb-intro__screen">
                    <b>{s.name}</b>
                    <span>{s.what}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/mockups/riot-kit" className="sb-intro__screen">
                  <b>The kit</b>
                  <span>Every part on three colourways</span>
                </Link>
              </li>
            </ol>
          </section>
          <section aria-labelledby="kit-h" className="sb-intro__kit">
            <Heading id="kit-h" className="sb-h">
              The kit
            </Heading>
            <dl>
              <dt>Type</dt>
              <dd>
                League Gothic for every head and label · Libre Franklin to read · Courier Prime for
                metadata · ransom cut from Alfa Slab, Bodoni Moda and the gothic, for the biggest
                head only
              </dd>
              <dt>Colour</dt>
              <dd>{inks.name}: plate A, plate B, their overprint, black, paper</dd>
              <dt>Texture</dt>
              <dd>
                Xerox grain and toner speckle, a tone-graded halftone, one misregistered number
              </dd>
              <dt>Parts</dt>
              <dd>Guillotine-cut, torn, deckled and pinked paper · masking tape · rubber stamps</dd>
            </dl>
            <ul className="sb-intro__plates" aria-label="Today's inks">
              {(
                [
                  ["plate A", inks.a, inks.aOn],
                  ["plate B", inks.b, inks.bOn],
                  ["A × B", inks.over, inks.overOn],
                  ["black", inks.k, inks.paper],
                ] as const
              ).map(([l, bg, fg]) => (
                <li key={l} style={{ background: bg, color: fg }}>
                  {l}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="pip-h">
            <Heading id="pip-h" className="sb-h">
              {MASCOT_NAME}, photocopied
            </Heading>
            <ul className="sb-intro__pips">
              {MASCOT_POSES.map((p) => (
                <li key={p}>
                  <Mascot pose={p} still />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </RiotTheme>
  );
}
