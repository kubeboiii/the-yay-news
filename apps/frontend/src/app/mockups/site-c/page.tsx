import Link from "next/link";
import type { CSSProperties } from "react";
import { loadSite } from "@/app/mockups/site-a/_shared/data";
import { paletteVars } from "@/app/mockups/site-a/_shared/palette";
import type { PipPose } from "@/app/mockups/site-a/_shared/pip";
import { Balloon, Caption, Panel, ToonPip } from "./_ui/comic";

const SCREENS = [
  {
    href: "shutter",
    name: "Today · before 7",
    what: "Three-panel strip: asleep, the clock, Pip's idea",
  },
  {
    href: "today",
    name: "Today · reading",
    what: "The paper, and Pip's paper round as the page-turner",
  },
  {
    href: "done",
    name: "Today · finished",
    what: "The End title card, the till receipt, tell a friend",
  },
  { href: "pile", name: "Pile", what: "Pip on the tower, search balloon, gold-star chart" },
  {
    href: "wall",
    name: "Wall",
    what: "One comic page: clippings, binder, stars, stickers, recap, moving day",
  },
];

const POSES: [PipPose, string][] = [
  ["bike", "Delivering (reading)"],
  ["sleep", "Asleep (before 7)"],
  ["sit", "On the pile"],
  ["hang", "On the lights (wall)"],
  ["confused", "Lost a page (empty, errors)"],
];

export default async function DirectionC({ searchParams }: PageProps<"/mockups/site-c">) {
  const data = await loadSite(searchParams);
  return (
    <main className="sc sc-intro" style={paletteVars(data.palette, "sc") as CSSProperties}>
      <div className="sc-main">
        <p>
          <Link href="/mockups/site" className="sc-w-link">
            All three directions
          </Link>
        </p>
        <h1 className="sc-wall__h sc-inked">C · Saturday Cartoon</h1>
        <div className="sc-intro__grid">
          <Panel ground="s0" className="sc-intro__why" label="Why it works">
            <Caption>Why it works</Caption>
            <ul>
              <li>
                <b>A guide, not a manual.</b> Pip is in every screen and says the one thing to do in
                a balloon; that sentence replaces a paragraph of UI copy.
              </li>
              <li>
                <b>Panels are sections.</b> One panel, one collection, one title, one big button. On
                a phone they stack in reading order.
              </li>
              <li>
                <b>Progress you can see.</b> Reading is Pip&rsquo;s paper round: the route is the
                contents, the progress bar and the page-turner at once.
              </li>
              <li>
                <b>Chunky means tappable.</b> Every button is a fat inked blob, 56&ndash;64px tall,
                with a thick base you press down; focus is a dashed ink ring.
              </li>
              <li>
                <b>Bouncy, then still.</b> Pip squashes and stretches, buttons boing, panels pop in
                once. All of it stops for reduced motion.
              </li>
            </ul>
          </Panel>
          <Panel ground="s4" className="sc-intro__screens" label="The screens">
            <Caption>The screens</Caption>
            <ol>
              {SCREENS.map((s) => (
                <li key={s.href}>
                  <Link href={`/mockups/site-c/${s.href}`} className="sc-intro__screen">
                    <b>{s.name}</b>
                    <span>{s.what}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </Panel>
          <Panel ground="paper" className="sc-intro__kit" label="The kit">
            <Caption>The kit</Caption>
            <dl>
              <dt>Type</dt>
              <dd>
                Alfa Slab One, inked and extruded · Gochi Hand capitals for balloons · IBM Plex Sans
                Condensed to read
              </dd>
              <dt>Colour</dt>
              <dd>
                {data.palette.name}: loud inks as flat fills, softs as panel skies, Ben-Day dots for
                shade, one ink line
              </dd>
              <dt>Shapes</dt>
              <dd>
                4px ink outlines · wobbly radii · balloons with tails · caption boxes · sound
                effects
              </dd>
              <dt>Motion</dt>
              <dd>Squash 1.6s · boing 0.38s · pop-in 0.45s staggered · off for reduced motion</dd>
            </dl>
          </Panel>
          <Panel ground="l3" dots className="sc-intro__pip" label="Pip, model sheet">
            <Caption>Pip · model sheet</Caption>
            <Balloon tail="bl" className="sc-intro__hi">
              Hi! I deliver the paper.
            </Balloon>
            <ul>
              {POSES.map(([p, l]) => (
                <li key={p}>
                  <ToonPip pose={p} />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </main>
  );
}
