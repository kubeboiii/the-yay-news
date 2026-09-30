import type { Metadata } from "next";
import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { Burst } from "@repo/ui/print/burst";
import {
  Anno,
  Credit,
  Folio,
  Page,
  Photo,
  Print,
  RunningHead,
  Spread,
  Tape,
  Zig,
} from "../_components/zine";

export const metadata: Metadata = { title: "Gaming · Mini Zine · Mockup" };

const section = edition.sections.find((s) => s.slug === "gaming");
const [bakery, fishing] = section?.stories ?? [];

const cat = pick("bakeryCat");
const boat = pick("fishing");

// A 5 × 7 bitmap for each letter of the headline; "1" is a lit cell.
const GLYPHS: Record<string, string[]> = {
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
};

function Mosaic({ word }: { word: string }) {
  return (
    <div className="z-mosaic" aria-hidden>
      {[...word].map((ch, i) => (
        <div className="z-mosaic__letter" key={`${ch}${i}`}>
          {(GLYPHS[ch] ?? []).flatMap((row, r) =>
            [...row].map((bit, c) => (
              <span key={`${r}-${c}`} className={bit === "1" ? "on" : undefined} />
            )),
          )}
        </div>
      ))}
    </div>
  );
}

// Invented, obviously fictional items to fill the section.
const patchNotes = [
  "+ You can fish now.",
  "+ Added 14 fish. Added 1 fish that should not exist.",
  "~ The lake is now slightly wetter.",
  "~ Villagers comment on your catch (politely).",
  "- Removed the bug where the moon was a square.",
];

const cosyGames = [
  { title: "Moss & Mortar", note: "build a cottage, one stone a day" },
  { title: "Postbox Pals", note: "deliver letters to very small frogs" },
  { title: "Teapot Tycoon", note: "the steam physics are unreasonably good" },
];

export default function GamingPage() {
  if (!bakery || !fishing) return null;
  return (
    <Spread label="Gaming spread">
      <Page ground="blue" side="left">
        <RunningHead>The Yay Zine · Gaming</RunningHead>
        <p className="z-player" aria-hidden>
          <span>PLAYER 1</span>
          <span>HI-SCORE 000042</span>
          <span>CREDIT 01</span>
        </p>
        <h1 className="z-sr">Gaming</h1>
        <Mosaic word="GAMING" />
        <p className="z-game__tag">{section?.tagline}</p>

        <article aria-labelledby="gotw" className="z-gotw">
          <Print
            photo={cat}
            ratio="4 / 5"
            sizes="(max-width: 900px) 70vw, 220px"
            position="50% 40%"
            rotate={-4}
            tape={["tl", "tr"]}
            note="Butter, on shift"
            className="z-gotw__print"
            priority
          />
          <div className="z-cart">
            <div className="z-cart__ridges" aria-hidden />
            <div className="z-cart__label">
              <p className="z-kicker">Game of the week</p>
              <h2 className="z-cart__title" id="gotw">
                Bread &amp; Butter
              </h2>
              <p className="z-cart__verdict">
                Two developers, one spare bedroom, and the warmest bakery you will visit all year.
              </p>
              <p className="z-cart__scores">Gameplay 9 · Cosiness 11 · Cat 10 · Pastry 8</p>
              <p className="z-bigscore">
                <b>9.5</b>
                <span>out of ten, and the cat would like a word about the half</span>
              </p>
            </div>
          </div>
        </article>

        <div className="z-game__body">
          <div>
            <h3 className="z-h2">{bakery.headline}</h3>
            <p className="z-dek">{bakery.dek}</p>
            <p className="z-byline">By Juno Pell</p>
          </div>
          <div className="z-body">
            {bakery.body.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <p>Our tip: the grumpy baker customer wants rye. Always rye.</p>
          </div>
        </div>

        <div className="z-pull z-game__pull">
          <Zig short />
          <blockquote>
            <p>“The most requested feature is the ability to pet the customers.”</p>
          </blockquote>
          <Zig short />
        </div>

        <Folio n={5} />
      </Page>

      <Page ground="butter" side="right">
        <RunningHead>The Yay Zine · Gaming</RunningHead>

        <article>
          <p className="z-kicker">Updates — patch 25.0.1</p>
          <h2 className="z-h2 z-fish__head">{fishing.headline}</h2>
          <div className="z-fish__photo">
            <Photo
              photo={boat}
              ratio="2 / 1"
              sizes="(max-width: 900px) 100vw, 640px"
              position="50% 55%"
            />
          </div>
          <Credit photo={boat}>The lake, now open for business.</Credit>

          <div className="z-fish__text">
            <div>
              <p className="z-dek">{fishing.dek}</p>
              <p className="z-byline">By Juno Pell</p>
              <div className="z-body" style={{ marginTop: "calc(var(--u) * 2)" }}>
                {fishing.body.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
                <p>The studio has not commented. The fish, reportedly, has.</p>
              </div>
            </div>
            <section className="z-patch print-torn" aria-labelledby="patch">
              <Tape at="t" />
              <h3 id="patch">Patch notes 25.0.1</h3>
              <ul>
                {patchNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </section>
          </div>
        </article>

        <div className="z-game__lower">
          <section className="z-hiscore" aria-labelledby="hiscore">
            <h3 className="z-label" id="hiscore">
              High score of the day
            </h3>
            <p className="z-hiscore__num print-misreg">999,999</p>
            <p className="z-hiscore__text">
              A reader’s nan, on a pub arcade cabinet, in one go. She says she was “only warming
              up”.
            </p>
            <Anno
              arrow="arrows-04"
              arrowFirst={false}
              arrowSize={[6, 10]}
              arrowStyle={{ rotate: "-40deg" }}
              style={{
                left: "calc(var(--u) * 30)",
                top: "calc(var(--u) * 29)",
                ["--r" as string]: "-5deg",
              }}
            >
              her nan!
            </Anno>
          </section>
          <section aria-labelledby="cosy">
            <h3 className="z-label" id="cosy">
              Three to play in pyjamas
            </h3>
            <ol className="z-top5">
              {cosyGames.map((g, i) => (
                <li key={g.title}>
                  <b>{i + 1}</b>
                  <span>
                    <b>{g.title}</b> — {g.note}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <Folio n={6} />
      </Page>

      <div
        className="z-onfold"
        style={{ ["--gx" as string]: 1, ["--gy" as string]: 96, ["--r" as string]: "9deg" }}
      >
        <Burst
          fill="var(--butter)"
          points={20}
          depth={0.14}
          className="z-fold-sticker z-fold-sticker--sm"
        >
          <p aria-hidden>
            Number one
            <span>this week</span>
          </p>
        </Burst>
      </div>
    </Spread>
  );
}
