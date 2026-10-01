import type { Metadata } from "next";
import Link from "next/link";
import {
  CutNav,
  FindItBox,
  GAP,
  GoButton,
  HandArrow,
  Halftone,
  Heading,
  MarkerCircle,
  Mascot,
  MASCOT_NAME,
  MASCOT_POSES,
  Misprint,
  Poster,
  RansomHeading,
  Receipt,
  RiotTheme,
  riotInks,
  RubberStamp,
  Scrap,
  Sticker,
  TapeBar,
  TearTabs,
  Tracklist,
  type TrackPage,
} from "@/features/riot";
import "./kit.css";

export const metadata: Metadata = { title: "Riot kit · sheet" };

const SHEETS = [
  { design: "broadsheet", colourway: "original" },
  { design: "broadsheet", colourway: "tropic-punch" },
  { design: "zine", colourway: "gelato-counter" },
] as const;

const PAGES: TrackPage[] = [
  { order: 1, label: "Front", colour: "#e9ff1f" },
  { order: 2, label: "Animals", colour: "#36f28a" },
  { order: 3, label: "Space", colour: "#2f5bff" },
  { order: 4, label: "Money", colour: "#ff6a1f" },
  { order: 5, label: "Screen and sound", colour: "#ff3d9a" },
  { order: 6, label: "Back", colour: "#ff4fb8" },
].map((p) => ({ ...p, href: `/mockups/riot-kit?p=${p.order}` }));

const NAV = [
  { id: "today", label: "Today", sub: "No. 46", href: "/mockups/riot-kit" },
  { id: "pile", label: "Pile", sub: "9 back issues", href: "/mockups/riot-kit" },
  { id: "wall", label: "Wall", sub: "19-day run", href: "/mockups/riot-kit" },
];

const PHOTO = "/editions/40/bird-photographer-gannet.jpg";

export default function RiotKit() {
  return (
    <div className="rk">
      <p className="rk-note">
        <Link href="/mockups/site-b">B · Riso Zine Riot</Link>
        <span>
          The kit (features/riot), every part on three colourways. Two plates, the paper and black;
          one condensed face; ransom only for the biggest head; {MASCOT_NAME} once.
        </span>
      </p>
      {SHEETS.map((s, n) => {
        const inks = riotInks(s);
        const id = `sheet-${s.colourway}`;
        return (
          <RiotTheme key={s.colourway} inks={inks} as="section" aria-labelledby={id}>
            <div className="rk-sheet">
              <header className="rk-head">
                <RansomHeading
                  as="h2"
                  text={inks.name}
                  seed={s.colourway}
                  photo={n === 1 ? PHOTO : undefined}
                  className="rk-ransom"
                />
                <p id={id} className="rt-meta">
                  {s.design} · {s.colourway}
                </p>
                <ul className="rk-plates" aria-label="Inks">
                  {(
                    [
                      ["paper", inks.paper, "#111"],
                      ["plate A", inks.a, inks.aOn],
                      ["plate B", inks.b, inks.bOn],
                      ["A × B", inks.over, inks.overOn],
                      ["black", inks.k, inks.paper],
                    ] as const
                  ).map(([l, bg, fg]) => (
                    <li key={l} style={{ background: bg, color: fg }}>
                      <b>{l}</b>
                      <span className="rt-meta">{bg}</span>
                    </li>
                  ))}
                </ul>
              </header>

              <section className="rk-block" aria-label="Type">
                <Heading as="h3" className="rk-label">
                  Type
                </Heading>
                <RansomHeading
                  as="p"
                  text="NOT YET"
                  seed="kit-hand"
                  cuts={[
                    { ch: "N", from: "slab", size: 1.18, lift: -0.04 },
                    { ch: "O", from: "didone", size: 0.92, lift: 0.08, tuck: 0.06, turn: 3 },
                    { ch: "T", from: "gothic", size: 1.05, tuck: 0.04, ground: "ink" },
                    GAP,
                    { ch: "Y", from: "roman", size: 1.1, turn: -2 },
                    { ch: "E", from: "slab", size: 0.86, lift: 0.1, tuck: 0.05 },
                    { ch: "T", from: "grot", size: 1.0, tuck: 0.03, ground: "a", turn: 4 },
                  ]}
                  className="rk-ransom rk-ransom--big"
                />
                <Heading as="p" className="rk-gothic">
                  One condensed face for everything else
                </Heading>
                <p className="rk-read">
                  Reading text is Libre Franklin, black on paper: a 34-tonne whale was freed from a
                  crab-pot line off Maine on Tuesday by a crew of four in a rubber boat.
                </p>
                <p className="rt-meta">No. 46 · Sun 4 Oct · metadata only</p>
                <p className="rt-hand rk-scrawl">a scrawl, once a screen</p>
              </section>

              <section className="rk-block" aria-label="Paper">
                <Heading as="h3" className="rk-label">
                  Paper, tape, edges
                </Heading>
                <div className="rk-row">
                  <Scrap seed={`${s.colourway}-cut`} ground="white">
                    Guillotine cut
                  </Scrap>
                  <Scrap seed={`${s.colourway}-torn`} ground="a" edge="torn" sides={["bottom"]}>
                    Torn along the bottom
                  </Scrap>
                  <Scrap seed={`${s.colourway}-deck`} ground="paper" edge="deckle" tape="top">
                    Deckled, taped
                  </Scrap>
                  <Scrap
                    seed={`${s.colourway}-zig`}
                    ground="b"
                    edge="zigzag"
                    sides={["left", "right"]}
                    tilt={-3}
                  >
                    Pinking shears, the hero tilt
                  </Scrap>
                  <Scrap seed={`${s.colourway}-ink`} ground="ink">
                    White only on black
                  </Scrap>
                </div>
              </section>

              <section className="rk-block" aria-label="Marks and print">
                <Heading as="h3" className="rk-label">
                  Marks, screens, misprints
                </Heading>
                <div className="rk-row rk-row--marks">
                  <span className="rk-ringed">
                    you are here
                    <MarkerCircle seed={`${s.colourway}-ring`} ink="a" aspect={2.6} />
                  </span>
                  <HandArrow
                    seed={`${s.colourway}-arrow`}
                    w={140}
                    h={70}
                    points={[
                      [6, 10],
                      [50, 58],
                      [132, 44],
                    ]}
                    className="rk-arrow"
                  />
                  <div className="rk-screen">
                    <Halftone seed={`${s.colourway}-ht`} fade="corner" ink="b" w={260} h={160} />
                    <Halftone
                      seed={`${s.colourway}-ht2`}
                      fade="left"
                      ink="a"
                      angle={75}
                      w={260}
                      h={160}
                    />
                  </div>
                  <Misprint className="rk-mis">1h 14m</Misprint>
                  <RubberStamp seed={`${s.colourway}-stamp`}>Read</RubberStamp>
                  <Sticker seed={`${s.colourway}-st`} ground="a" shape="burst">
                    3 puzzles
                  </Sticker>
                </div>
              </section>

              <section className="rk-block" aria-label="Actions">
                <Heading as="h3" className="rk-label">
                  One action
                </Heading>
                <div className="rk-row">
                  <GoButton href="/mockups/riot-kit" sub="No. 46 · Sun 4 Oct">
                    Read yesterday&rsquo;s
                  </GoButton>
                  <GoButton tone="a" sub="1 waiting on your wall">
                    Scratch your card
                  </GoButton>
                  <GoButton tone="paper">Buzz me at 7</GoButton>
                  <GoButton tone="quiet" href="/mockups/riot-kit">
                    Dig in the pile
                  </GoButton>
                </div>
              </section>

              <div className="rk-grid">
                <Poster
                  seed={`${s.colourway}-poster`}
                  aria-label="Poster"
                  screen={{ fade: "corner", density: 0.55, area: "0 0 45% 45%", w: 300, h: 240 }}
                  className="rk-poster"
                >
                  <Heading as="p" className="rk-poster__h">
                    That&rsquo;s today
                  </Heading>
                  <p className="rk-poster__run">
                    <Misprint className="rk-poster__n">19</Misprint>
                    <span>days running. Tomorrow&rsquo;s has an octopus in it.</span>
                  </p>
                  <Mascot pose="on-pile" className="rk-poster__odin" />
                </Poster>
                <Receipt
                  issue={46}
                  date="2026-10-04"
                  stampedAt="09:12"
                  pageSquares={PAGES.map((p) => ({ colour: p.colour, read: p.order < 6 }))}
                  puzzles={{ solved: 3, total: 5 }}
                  streak={19}
                  tags={["whales", "Mars", "a choir"]}
                  lines={[{ label: "kept", value: "2 stories" }]}
                  headingId={`${id}-proof`}
                >
                  <TearTabs
                    prompt="Pass it on: take one"
                    tabs={[
                      { label: "Copy link" },
                      { label: "Send the front" },
                      { label: "Save the pic" },
                    ]}
                  />
                </Receipt>
                <FindItBox
                  action="/mockups/riot-kit"
                  id={`${id}-q`}
                  placeholder="octopus, Mars, Elvis…"
                  defaultValue="dinosaur"
                  count="4 papers mention dinosaurs"
                  hits={[
                    {
                      key: "a",
                      href: "/mockups/riot-kit",
                      meta: "No. 41 · Tue 29 Sep",
                      title: "A teenager found a T. rex tooth on a school trip",
                    },
                    {
                      key: "b",
                      href: "/mockups/riot-kit",
                      meta: "No. 37 · Fri 25 Sep",
                      title: "The museum let the night guard name the new sauropod",
                    },
                  ]}
                />
              </div>

              <section className="rk-block" aria-label="Navigation">
                <Heading as="h3" className="rk-label">
                  Navigation
                </Heading>
                <div className="rk-navs">
                  <CutNav items={NAV} active="today" phone="inline" label={`Main (${inks.name})`} />
                  <TapeBar
                    items={NAV}
                    active="pile"
                    docked={false}
                    label={`Phone nav (${inks.name})`}
                  />
                </div>
                <Tracklist
                  pages={PAGES}
                  current={3}
                  read={[1, 2]}
                  doneHref="/mockups/riot-kit"
                  sideNote="No. 46"
                  docked={false}
                  keys={n === 0}
                  label={`Pages (${inks.name})`}
                  mascot={<Mascot pose="deliver" label="" />}
                />
              </section>

              <section className="rk-block" aria-label={MASCOT_NAME}>
                <Heading as="h3" className="rk-label">
                  {MASCOT_NAME}, photocopied
                </Heading>
                <ul className="rk-poses">
                  {MASCOT_POSES.map((p) => (
                    <li key={p}>
                      <Mascot pose={p} />
                      <span className="rt-meta">{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </RiotTheme>
        );
      })}
    </div>
  );
}
