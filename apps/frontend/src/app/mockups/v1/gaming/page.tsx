import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { Burst } from "@repo/ui/print/burst";
import { Mark } from "@repo/ui/print/mark";
import { Folio, Photo, PixelText, RunningHead, STRETCH, Zigzag } from "../_components/parts";

const patch = [
  { tag: "Added", text: "Fishing. You can fish now." },
  { tag: "Added", text: "A pond behind the castle that was not there in 2001." },
  { tag: "Fixed", text: "Guards no longer walk into the same wall forever." },
  { tag: "Fixed", text: "The fish that should not exist. It stays. It is loved." },
  { tag: "Removed", text: "Nothing. We would never." },
  { tag: "Known", text: "The big carp stares at you. This is intended." },
  { tag: "Known", text: "Fishing at night catches boots. Also intended." },
  { tag: "Thanks", text: "To everyone who kept playing for 25 years." },
];

export default function Gaming() {
  const section = edition.sections.find((s) => s.slug === "gaming");
  const [bread, fishing] = section?.stories ?? [];
  const cat = pick("bakeryCat");
  const boat = pick("fishing");

  return (
    <div className="yn-sheet-wrap">
      <article className="yn-sheet yn-inside yn-theme-gaming">
        <RunningHead page={3} section="Gaming" tagline="Releases, indie gems and gaming culture" />

        <Zigzag word="press start" />

        <div className="gm-hud" aria-label="Player 1, high score 12408">
          <PixelText text="PLAYER 1" />
          <p className="gm-hud-mid" aria-hidden>
            Credits 99 · free play, forever
          </p>
          <PixelText text="HI-SCORE 012408" />
        </div>

        <section className="gm-top" aria-label="Game of the week">
          {/* The cartridge is the page's one grid-breaker: tilted, and pushed up over the HUD. */}
          <div className="gm-cart-wrap">
            <div className="yn-cart">
              <div className="yn-cart-ridges" aria-hidden>
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="yn-cart-label">
                <Photo photo={cat} sizes="(max-width: 760px) 100vw, 560px" priority />
                <div className="yn-cart-title">
                  <p className="yn-chunk yn-caps" aria-hidden>
                    Bread &amp; Butter
                  </p>
                  <p className="meta">
                    1 player · cosy
                    <br />
                    made in a spare bedroom
                  </p>
                </div>
              </div>
              <div className="yn-cart-foot" aria-hidden>
                <span>Cart. no. BB-001</span>
                <span>Insert this side up</span>
              </div>
            </div>
            <Burst
              fill="var(--neon-green)"
              points={20}
              depth={0.12}
              className="gm-sticker print-worn"
            >
              <span className="yn-burst-text text-[calc(var(--u)*7)]">
                No. 1
                <br />
                this week
              </span>
            </Burst>
            <p className="yn-note gm-note" aria-hidden>
              the hat is canon
            </p>
            <Mark name="arrows-02" ink="var(--neon-violet)" className="yn-mark-abs gm-note-arrow" />
          </div>

          <article className="gm-review">
            <p className="yn-kicker">Game of the week</p>
            <h2 className="yn-chunk yn-hed">
              A cosy game about a cat running a bakery tops the charts
            </h2>
            <p className="yn-dek">{bread?.dek}</p>
            <p className="yn-byline">Reviewed by Sam Okafor · Indie, £6</p>
            <div className="yn-body">
              {bread?.body.map((p) => (
                <p key={p.slice(0, 16)}>{p}</p>
              ))}
              <p>
                There is no timer, no way to lose and no villain. The hardest decision in the game
                is whether a croissant needs one more minute. Players say it is the first game in
                years that sent them to bed early, and calmer than when they started.
              </p>
            </div>

            {/* The verdict, set as type rather than as a table. */}
            <div className="gm-verdict">
              <p className="gm-verdict-line">
                Cosiness <b>10</b> · Pastries <b>9</b> · Customers <b>9</b> · Cat <b>11</b>
              </p>
              <div className="gm-total">
                <span className="yn-fat">9.5</span>
                <p className="yn-hand">
                  out of ten.
                  <br />
                  The cat marked itself.
                </p>
              </div>
            </div>

            <div className="gm-also">
              <p className="yn-label">Also out this week</p>
              <ul>
                <li>
                  <span>
                    <b>Moss Garden</b> — grow moss. Very slowly. It is wonderful.
                  </span>
                  <span>All ages</span>
                </li>
                <li>
                  <span>
                    <b>Post Office Sim 2</b> — now with a second stamp.
                  </span>
                  <span>Free</span>
                </li>
                <li>
                  <span>
                    <b>Tiny Tugboat</b> — push a ferry home before tea.
                  </span>
                  <span>£3</span>
                </li>
              </ul>
            </div>
          </article>
        </section>

        <Zigzag word="patch notes" />

        <section className="gm-mid" aria-label="Updates">
          <div className="gm-collage">
            <div className="gm-collage-ink" aria-hidden />
            <figure className="gm-boat print-print">
              <span className="print-tape gm-boat-tape" aria-hidden />
              <Photo photo={boat} tag={false} sizes="(max-width: 760px) 100vw, 330px" />
            </figure>
            <p className="yn-caption gm-boat-cap">
              The pond, which was not there in 2001.{" "}
              <span className="yn-credit">Photo: {boat.credit}</span>
            </p>
          </div>
          <article className="gm-fish">
            <p className="yn-kicker">Updates</p>
            <h2 className="yn-chunk yn-hed-sm">
              A 25-year-old game just got a{" "}
              <span className="ss-ringed">
                fishing
                <Mark name="ellipse-01" className="ss-ring" style={STRETCH} />
              </span>{" "}
              minigame
            </h2>
            <p className="yn-dek">{fishing?.dek}</p>
            <div className="yn-body">
              <p>{fishing?.body[0]}</p>
              <p>
                The studio has not said why it went back. Players have stopped asking and started
                comparing catches, and the old forums have more posts this week than in the last ten
                years put together.
              </p>
            </div>
            <figure>
              <blockquote className="yn-pullquote">&ldquo;You can fish now.&rdquo;</blockquote>
              <figcaption className="yn-pullquote-by">The patch note, in full</figcaption>
            </figure>
          </article>
          {/* The notes themselves, torn out of the printed readme. */}
          <div className="yn-patch print-torn">
            <p className="yn-patch-head">readme.txt — patch 25.0.1</p>
            <ul>
              {patch.map((p) => (
                <li key={p.text}>
                  <b>{p.tag}</b>
                  <span>{p.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Zigzag word="save point" />

        <section className="gm-row" aria-label="Also in Gaming">
          <article className="gm-hiscore">
            <div className="gm-hiscore-ink print-worn" aria-hidden />
            <p className="yn-kicker">High score of the day</p>
            <PixelText text="99999" />
            <p className="yn-body">
              A grandmother in a seaside arcade has held the top score on the pier&rsquo;s oldest
              machine since 1987. She signs it GRN. Nobody has come close.
            </p>
          </article>
          <article className="gm-speedrun">
            <p className="yn-kicker">Speedrun of the week</p>
            <h3 className="yn-chunk yn-hed-sm">
              Four minutes and two seconds to bake a hundred loaves
            </h3>
            <p className="yn-body">
              Set in Bread &amp; Butter by a player whose only advice is &ldquo;never pet the
              customers, however much you want to.&rdquo;
            </p>
          </article>
          <aside className="gm-classified">
            <p className="yn-ad-label">Classified</p>
            <p className="yn-chunk yn-caps">Player two wanted</p>
            <p className="yn-body">
              Thursday games night, village hall, over-70s. Must bring biscuits. Must let Doreen win
              at least once.
            </p>
          </aside>
        </section>

        <div className="gm-hud gm-hud-end" aria-label="Continue? Yes">
          <PixelText text="CONTINUE? YES" />
          <p className="gm-hud-mid" aria-hidden>
            Tomorrow: the octopus gets a game
          </p>
        </div>

        <Folio page={3} section="Gaming" />
      </article>
      <p className="yn-note-foot">
        Sample edition · all stories invented · photos: {cat.credit}, {boat.credit} on Unsplash
      </p>
    </div>
  );
}
