import { Burst } from "@repo/ui/print/burst";
import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import {
  Anno,
  Credit,
  Folio,
  Page,
  Print,
  Ring,
  RunningHead,
  Spread,
  Zig,
} from "./_components/zine";

const lead = edition.lead;
const octopus = pick("octopus");
const robot = pick("robot");

const contents = [
  { n: "03", sec: "Screen & Sound", tease: "A toaster sings a ballad. A choir hits ten million." },
  {
    n: "05",
    sec: "Gaming",
    tease: "The cat who runs a bakery, and a 25-year-old game goes fishing.",
  },
  { n: "07", sec: "The Back Page", tease: "The Mini crossword, a riddle, and an excellent boy." },
];

export default function FrontPage() {
  return (
    <Spread label="Front page spread">
      <Page ground="mint" side="left" className="z-cover">
        <div className="z-cover__top">
          <p className="z-stamp print-worn z-cover__stamp">
            Sample edition
            <small>Not a real paper · free, forever</small>
          </p>

          <div className="z-spec">
            <div>
              <p className="z-spec__name">
                <b>ZINE</b>
                <span>
                  170mm ×<br />
                  250mm
                </span>
              </p>
              <dl>
                <dt>Vol. · No.</dt>
                <dd>
                  Vol. {edition.volume} · No. {edition.issue}
                </dd>
                <dt>Date</dt>
                <dd>Wed 30 Sep 2026</dd>
                <dt>Price</dt>
                <dd>{edition.price}</dd>
                <dt>Weather</dt>
                <dd>{edition.weather.headline}</dd>
              </dl>
            </div>
            <div className="z-spec__num">
              <b className="print-misreg" style={{ ["--misreg" as string]: "var(--rose)" }}>
                {edition.numberOfTheDay.value}
              </b>
              <span>Number of the day: picnic blankets, end to end</span>
            </div>
          </div>
        </div>
        <div className="z-cover__stack">
          {/* The extrusion is a second impression under the letters, and it is the one that wore. */}
          <p className="z-cover__title z-cover__title--shade print-worn" aria-hidden>
            <span className="z-cover__the">The</span>
            <span className="z-cover__yay">Yay</span>
            <span className="z-cover__news">News</span>
          </p>
          <h1 className="z-cover__title z-cover__title--ink">
            <span className="z-cover__the">The</span>
            <span className="z-cover__yay">Yay</span>
            <span className="z-cover__news">News</span>
          </h1>
          <Print
            photo={robot}
            ratio="4 / 5"
            sizes="(max-width: 900px) 50vw, 200px"
            rotate={5}
            tape={["t"]}
            note="40,000th go"
            className="z-cover__print"
          />
          <Anno
            arrow="arrows-10"
            arrowFirst={false}
            arrowSize={[12, 7]}
            style={{
              right: "calc(var(--u) * 42)",
              top: "calc(100% + var(--u) * 26)",
              ["--r" as string]: "-5deg",
            }}
            arrowStyle={{ rotate: "170deg" }}
          >
            he understands the corners now
          </Anno>
        </div>

        <div className="z-cover__foot">
          <p className="z-cover__tag">{edition.tagline}</p>
          <p className="z-cover__also">
            <b>Robot folds a fitted sheet, finally</b>
            40,000 attempts later, it “understands the corners”. Also: a six lands in a fruit bowl.
          </p>
        </div>
      </Page>

      <Page ground="pink" side="right">
        <RunningHead>The Yay Zine · Only good newsprint</RunningHead>

        <h2 className="z-head">
          <span className="z-head__top">
            <span aria-hidden className="z-dots" />
            <span className="z-head__cond">Deep-sea camera films</span>
            <span aria-hidden className="z-dots" />
          </span>
          <span className="z-head__heavy" style={{ ["--hb" as string]: 10.4 }}>
            A <Ring>dancing</Ring> octopus
          </span>
        </h2>

        <div className="z-lead__photo z-offset-block">
          <Print
            photo={octopus}
            ratio="2 / 1"
            sizes="(max-width: 900px) 100vw, 600px"
            rotate={-2.2}
            tape={["tl", "br"]}
            note="Disco Pete, frame 4,112"
            priority
          />
          <Burst fill="var(--butter)" points={18} depth={0.16} className="z-lead__burst">
            <p>{lead.sticker}</p>
          </Burst>
          <Anno
            arrow="arrows-04"
            arrowFirst={false}
            arrowSize={[7, 12]}
            arrowStyle={{ rotate: "-35deg" }}
            style={{
              right: "calc(var(--u) * 22)",
              bottom: "calc(var(--u) * -13)",
              ["--r" as string]: "-3deg",
            }}
          >
            the spin move!
            <br />
            (about 6 min in)
          </Anno>
        </div>
        <div style={{ marginTop: "calc(var(--u) * 3)" }}>
          <Credit photo={octopus}>Researchers’ footage, 1,200 m down.</Credit>
        </div>

        <div className="z-lead__text">
          <div>
            <p className="z-kicker">Deep sea — a three-minute read</p>
            <p className="z-dek">{lead.dek}</p>
            <p className="z-byline">
              By Wren Aldous <i>at the</i> Ocean Research Journal
            </p>
          </div>
          <div className="z-lead__body z-body z-cols-2">
            {lead.body.slice(0, 3).map((para, i) => (
              <p key={para.slice(0, 24)} className={i === 0 ? "z-drop" : undefined}>
                {para}
              </p>
            ))}
            <p className="z-jump">Disco Pete’s encore, continued on page 3 of tomorrow’s paper</p>
          </div>
        </div>

        <section className="z-contents" aria-labelledby="inside-today">
          <div className="z-contents__title">
            <h2 className="z-label" id="inside-today">
              Inside today
            </h2>
            <Zig />
          </div>
          <ol>
            {contents.map((c) => (
              <li key={c.n}>
                <span className="z-contents__n" aria-hidden>
                  {c.n}
                </span>
                <span className="z-contents__sec z-h3">
                  <span className="z-sr">Page {Number(c.n)}: </span>
                  {c.sec}
                </span>
                <span className="z-contents__tease">{c.tease}</span>
              </li>
            ))}
          </ol>
        </section>

        <Folio n={2} />
      </Page>
      <div
        className="z-onfold"
        style={{ ["--gx" as string]: -1, ["--gy" as string]: 52, ["--r" as string]: "-8deg" }}
      >
        <Burst fill="var(--blue)" points={13} depth={0.16} wobble={1} className="z-fold-sticker">
          <p aria-hidden>
            Only good news
            <span>inside!</span>
          </p>
        </Burst>
      </div>
    </Spread>
  );
}
