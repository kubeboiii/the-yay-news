import Link from "next/link";
import type { CSSProperties } from "react";
import { loadSite } from "@/app/mockups/site-a/_shared/data";
import { paletteVars } from "@/app/mockups/site-a/_shared/palette";
import { Pip, type PipPose } from "@/app/mockups/site-a/_shared/pip";
import { Kraft, Sticker, Tape } from "./_ui/kit";

const SCREENS = [
  {
    href: "shutter",
    name: "Today · before 7",
    what: "Shuttered kiosk, countdown, read yesterday's",
  },
  {
    href: "today",
    name: "Today · reading",
    what: "Paper on the desk, thumb-index, folded-corner turn",
  },
  { href: "done", name: "Today · finished", what: "Shutter down, receipt prints, pass it on" },
  { href: "pile", name: "Pile", what: "Side-on stack, search slip, stamp calendar" },
  {
    href: "wall",
    name: "Wall",
    what: "Bedroom wall: polaroids, binder, stickers, photo dump, moving box",
  },
];

const POSES: [PipPose, string][] = [
  ["bike", "Today: delivering"],
  ["sleep", "Before 7: asleep"],
  ["sit", "Pile and finished"],
  ["hang", "Wall: fairy lights"],
  ["confused", "Empty and error states"],
];

export default async function DirectionA({ searchParams }: PageProps<"/mockups/site-a">) {
  const data = await loadSite(searchParams);
  return (
    <main
      className="sa sa--corner sa-intro"
      style={paletteVars(data.palette, "sa") as CSSProperties}
    >
      <div className="sa-main">
        <p className="sa-intro__crumb">
          <Link href="/mockups/site">All three directions</Link>
        </p>
        <h1 className="sa-room__h">
          A · Paperboy&rsquo;s World
          <span>the website as the room the paper lives in</span>
        </h1>
        <div className="sa-intro__grid">
          <Kraft seed="why" className="sa-intro__why">
            <h2>Why it works</h2>
            <ul>
              <li>
                <b>Three places, three tickets.</b> Today, Pile and Wall never move; on a phone they
                sit under your thumb. The current one is punched and pressed down.
              </li>
              <li>
                <b>Every object does one job.</b> The corner turns the page, the slip searches, the
                box moves phones. Each says what it does in words, on itself.
              </li>
              <li>
                <b>The paper stays the star.</b> On the reading screen the chrome shrinks to a desk,
                tabs and a corner, all outside the sheet.
              </li>
              <li>
                <b>Today&rsquo;s colourway paints the room.</b> Walls, tickets, tape and stamps take
                the paper&rsquo;s inks; words stay in its ink colour for 7:1+ contrast.
              </li>
              <li>
                <b>Calm motion.</b> Pip blinks and bobs, lights twinkle, the receipt prints. All of
                it stops for reduced motion; nothing moves while you read.
              </li>
            </ul>
            <Tape className="sa-tape--tl" ink="var(--sa-s2)" />
          </Kraft>
          <section className="sa-intro__screens" aria-labelledby="screens-h">
            <h2 id="screens-h" className="sa-label">
              The screens
            </h2>
            <ol>
              {SCREENS.map((s, i) => (
                <li key={s.href} style={{ "--tk": `var(--sa-l${i % 5})` } as CSSProperties}>
                  <Link
                    href={`/mockups/site-a/${s.href}`}
                    className="sa-pass__btn sa-intro__screen"
                  >
                    <b>{s.name}</b>
                    <span>{s.what}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
          <section className="sa-intro__system" aria-labelledby="sys-h">
            <h2 id="sys-h" className="sa-label">
              The kit
            </h2>
            <dl>
              <dt>Type</dt>
              <dd>
                League Gothic for signs and tickets · Libre Caslon for reading · Special Elite for
                stamps · Courier Prime for the till · Kalam for Pip&rsquo;s notes
              </dd>
              <dt>Colour</dt>
              <dd>
                {data.palette.name}: soft grounds paint walls; loud inks go on tickets, stickers and
                tape; one ink for every word
              </dd>
              <dt>Objects</dt>
              <dd>
                Ticket stubs · kraft card · washi tape · die-cut vinyl · rubber stamps · polaroids
              </dd>
              <dt>Motion</dt>
              <dd>
                Blink 4.6s · head-bob 2.8s · twinkle 2.4s · receipt feed 1.9s · all off for reduced
                motion
              </dd>
            </dl>
            <div className="sa-intro__swatches" aria-hidden>
              {data.palette.loud.slice(0, 6).map((c, i) => (
                <Sticker
                  key={c}
                  shape="round"
                  ink={c}
                  seed={`sw${i}`}
                  style={{ position: "relative" }}
                >
                  {c}
                </Sticker>
              ))}
            </div>
          </section>
          <section className="sa-intro__pip" aria-labelledby="pip-h">
            <h2 id="pip-h" className="sa-label">
              Pip, the paper&rsquo;s pigeon
            </h2>
            <ul>
              {POSES.map(([pose, when]) => (
                <li key={pose}>
                  <Pip pose={pose} inks={{ cap: "var(--sa-l1)" }} className="sa-intro__pose" />
                  <span>{when}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
