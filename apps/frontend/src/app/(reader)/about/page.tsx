import type { Metadata } from "next";
import Link from "next/link";
import { GAP, GoButton, Heading, Mascot, MASCOT_NAME, RansomHeading, Scrap } from "@/features/riot";
import "@/features/site/about.css";

export const metadata: Metadata = {
  title: "How it's made · The Yay News",
  description:
    "The rules we print by, how the robot newsroom finds and checks every story, and where the pictures come from.",
};

// How it's made: the paper's rules, and an honest account of the automated newsroom behind it.
// Slow News Day editions credit this page as their source, and every story's receipts point here
// for how sourcing works.

const RULES = [
  {
    head: "It ends.",
    body: "One paper a day, about fifteen minutes long, with a back page. No endless feed, no “recommended for you”, no autoplay.",
  },
  {
    head: "Delight, not positivity.",
    body: "The bar is “would you enjoy this?”, not “is this uplifting?”. A brilliant overtake, a strange deep-sea creature and an absurd internet thread all count.",
  },
  {
    head: "Absolutely no bad news.",
    body: "No tragedy, conflict, politics, health scares, crime, disasters, layoffs, market fear or drama, not even told nicely. When we’re unsure, it stays out.",
  },
  {
    head: "Our own words, with receipts.",
    body: "Every story is our own short write-up, with a credited link to where it came from. We never republish someone else’s article or photo.",
  },
  {
    head: "Only what the source says.",
    body: "A funny headline is fine. An invented fact is not.",
  },
];

const STEPS = [
  [
    "Gather",
    "Every night it reads about 40 approved sources: news feeds, Reddit, NASA, Spaceflight News, Wikipedia’s On This Day and more.",
  ],
  [
    "The delight check",
    "A blocklist runs first, then an AI check against our rules. Anything grim is thrown out, and anything uncertain goes with it.",
  ],
  [
    "Dedup",
    "Stories we’ve run in the last two weeks, and the same story from three outlets, are dropped.",
  ],
  [
    "Pick",
    "Around 30 stories plus spares, with a quota per section and never more than three on one topic, so it isn’t twelve stories about AI.",
  ],
  ["Write", "Each story is written from its source text only, in its section’s voice."],
  [
    "Fact check",
    "A check that isn’t an AI makes sure every number and every name in the story appears in the source. A story that fails gets one rewrite, then a spare takes its place.",
  ],
  [
    "Pictures",
    "A picture runs only when its licence is recorded, and its credit is printed under it. No licence, no picture.",
  ],
  [
    "Lay out and publish",
    "The stories go onto pages, the puzzles are generated, and the paper waits until it’s 7:00 where you are.",
  ],
] as const;

export default function AboutPage() {
  return (
    <div className="ys-page ab-desk">
      <header className="sb-pile__head ab-head-row">
        <div>
          <RansomHeading
            text="HOW IT'S MADE"
            seed="how-its-made"
            as="h1"
            className="sb-pile__h"
            cuts={[
              { ch: "HO", from: "slab", size: 1.08 },
              { ch: "W", from: "didone", size: 0.92, lift: 0.06, turn: -3 },
              GAP,
              { ch: "IT'", from: "gothic", size: 1.04, ground: "a" },
              { ch: "S", from: "roman", size: 0.96, turn: 2 },
              GAP,
              { ch: "MA", from: "slab", size: 0.98, tuck: 0.03 },
              { ch: "DE", from: "gothic", size: 1.1, tuck: 0.02 },
            ]}
          />
          <p className="sb-pile__sub">
            Only good news. Mostly fun. Occasionally weird. Written by robots, checked like mad.
          </p>
        </div>
        <Mascot pose="standing" label={`${MASCOT_NAME}, the paper's husky`} className="ab-odin" />
      </header>

      <section aria-labelledby="ab-rules" className="ab-sheet">
        <Scrap seed="rules" ground="white" tape="top-left">
          <Heading as="h2" id="ab-rules" className="sb-h">
            The rules we print by
          </Heading>
          <ol className="ab-rules">
            {RULES.map((r) => (
              <li key={r.head}>
                <b>{r.head}</b> {r.body}
              </li>
            ))}
          </ol>
        </Scrap>
      </section>

      <section aria-labelledby="ab-newsroom" className="ab-sheet">
        <Scrap seed="newsroom" ground="white">
          <Heading as="h2" id="ab-newsroom" className="sb-h">
            The robot newsroom
          </Heading>
          <p className="ab-lede">
            Nobody sits up at night writing this paper. An automated newsroom builds each edition a
            day or two ahead, and every decision it makes is written down, so a bad call can always
            be traced. It works like this:
          </p>
          <ol className="ab-steps">
            {STEPS.map(([head, body], i) => (
              <li key={head}>
                <span className="ab-steps__n" aria-hidden>
                  {i + 1}
                </span>
                <span>
                  <b>{head}.</b> {body}
                </span>
              </li>
            ))}
          </ol>
          <p className="ab-note">
            The writing and the checking are done by AI models from Anthropic (Claude), with
            Google&rsquo;s Gemini standing by if Claude is unavailable. If a day can&rsquo;t fill a
            paper, you get a <b>Slow News Day</b> edition from our own bank of evergreen pieces,
            never a blank front page.
          </p>
        </Scrap>
      </section>

      <section aria-labelledby="ab-receipts" className="ab-sheet">
        <Scrap seed="receipts" ground="white">
          <Heading as="h2" id="ab-receipts" className="sb-h">
            Receipts and corrections
          </Heading>
          <p>
            Every story ends with its <b>receipts</b>: the name of the outlet it came from and a
            link to the original. Read the real thing whenever you like; they did the reporting.
          </p>
          <p>
            If something slips through, it can be pulled from the paper and replaced with a spare,
            and the next day&rsquo;s Corrections column says what changed.
          </p>
        </Scrap>
      </section>

      <section aria-labelledby="ab-you" className="ab-sheet">
        <Scrap seed="you" ground="white" tape="top-right">
          <Heading as="h2" id="ab-you" className="sb-h">
            You, and what we keep
          </Heading>
          <p>
            There are no accounts and no ads. Your stamps, clippings, cards and stickers are kept on
            your device, not on our servers, and you can move them to a new phone from{" "}
            <Link href="/wall">Your Wall</Link>.
          </p>
          <p>Your timezone is kept in a cookie, only so your paper lands at 7:00 where you are.</p>
        </Scrap>
      </section>

      <p className="ab-links">
        <GoButton href="/" sub="the one that's out now">
          Read today&rsquo;s paper
        </GoButton>
        <GoButton tone="quiet" href="/pile">
          Dig through the pile
        </GoButton>
      </p>
    </div>
  );
}
