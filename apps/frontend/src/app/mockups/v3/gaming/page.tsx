import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { Burst } from "@repo/ui/print/burst";
import { Mark } from "@repo/ui/print/mark";
import {
  Bars,
  Folio,
  Masthead,
  MiniMark,
  Photo,
  PixelType,
  Sheet,
  Stamp,
  Tape,
} from "../_components/parts";

const BLUE = "var(--blue)";
const ORANGE = "var(--orange)";

const patchNotes: [string, string][] = [
  ["+", "You can fish now."],
  ["+", "Added one pond, one rod, 31 fish."],
  ["+", "Added a fish that should not exist."],
  ["~", "Rain now falls on the pond, gently."],
  ["−", "Removed sense of urgency."],
  ["!", "Known issue: the frog judges your cast."],
];

export default function TabloidGaming() {
  const section = edition.sections.find((s) => s.slug === "gaming");
  const bakery = section?.stories[0];
  const fishing = section?.stories[1];
  if (!section || !bakery || !fishing) return null;

  return (
    <Sheet theme="gaming">
      <Masthead
        eyebrow={<MiniMark section="Gaming" page={3} />}
        title="Gaming"
        titleClass="tb-mast-title--wide"
        specTitle="Hi-score"
        spec={[
          ["1UP Butter", "999,990"],
          ["2UP Pip", "812,400"],
          ["3UP Pigeon", "12,408"],
        ]}
        box={
          <>
            <PixelType text="1UP" />
            <span className="tb-box-words">
              Player 1, ready
              <small>Releases, indie gems &amp; patch notes</small>
            </span>
          </>
        }
      />

      <div className="tb-game-top tb-grow">
        <Photo
          photo={pick("arcade")}
          sizes="(max-width: 760px) 100vw, 680px"
          position="50% 50%"
          priority
        >
          <Burst fill={BLUE} points={18} depth={0.14} className="tb-sticker tb-game-sticker">
            <span aria-hidden>
              <span className="tb-sticker-big">{bakery.sticker}</span>
              <span className="tb-sticker-hand">in week one</span>
            </span>
          </Burst>
          <div className="tb-onphoto tb-onphoto--game">
            <p className="tb-kicker">The charts:</p>
            <h2 className="tb-splash">
              <Bars className="tb-bars--over">{bakery.headline}</Bars>
            </h2>
          </div>
        </Photo>

        <article className="tb-patch" style={{ position: "relative" }}>
          <div className="tb-pasted print-print tb-game2-print">
            <Photo photo={pick("fishing", 1)} sizes="(max-width: 760px) 100vw, 320px" />
            <Tape />
            <span className="tb-pasted-cap">The rod, as patched</span>
          </div>
          <Mark name="arrows-04" ink={BLUE} className="tb-mark tb-game2-arrow" />
          <p className="tb-note tb-game2-note2" aria-hidden>
            it&rsquo;s in there somewhere
          </p>
          <p className="tb-kicker">{fishing.kicker}:</p>
          <h3 className="tb-patch-head tb-cond">{fishing.headline}</h3>
          <p className="tb-first">
            <span className="tb-runin">{fishing.dek} </span>
            {fishing.body[0]}
          </p>
          <div className="tb-patch-notes">
            <h4>Patch notes, v25.0.1</h4>
            <ul>
              {patchNotes.map(([mark, line]) => (
                <li key={line}>
                  <span aria-hidden>{mark}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="tb-credit-line">Photo: {pick("fishing", 1).credit} · unsplash.com</p>
        </article>
      </div>

      <section className="tb-band tb-game-band" aria-label="Game of the week and more">
        <article className="tb-col tb-cart2" aria-labelledby="gotw">
          <div className="tb-cart2-score print-worn" aria-hidden>
            <b>9</b>
            <span>out of ten, easily</span>
          </div>
          <div className="tb-cart">
            <div className="tb-cart-grip" aria-hidden>
              {Array.from({ length: 22 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <div className="tb-cart-body">
              <Photo
                photo={pick("bakeryCat")}
                sizes="(max-width: 760px) 100vw, 220px"
                position="50% 40%"
              />
              <div className="tb-cart-text">
                <p className="tb-kicker">Game of the week:</p>
                <h3 id="gotw" className="tb-cart-title tb-cond">
                  Bread &amp; Butter
                </h3>
                <p className="tb-byline">
                  Reviewed by our games desk, <b>who were meant to be working</b>
                </p>
                <p className="tb-dek">{bakery.dek}</p>
                <p className="tb-first">{bakery.body[0]}</p>
                <p>{bakery.body[1]}</p>
                <p className="tb-verdict">
                  <b>Verdict.</b> Cosiness ten out of ten; pastries nine. The customers are very
                  specific, and petting arrives in the next update. Play it with a cup of tea.
                </p>
                <p className="tb-source">
                  Source: {bakery.source} · Photo: {pick("bakeryCat").credit}
                </p>
              </div>
            </div>
          </div>
        </article>

        <aside className="tb-col tb-body" style={{ position: "relative" }}>
          <Stamp className="tb-game2-stamp">
            Hi-score
            <small>verified, Thursday</small>
          </Stamp>
          <div className="tb-mini">
            <h4 className="tb-cond tb-mini-head">High score of the day</h4>
            <div style={{ position: "relative" }}>
              <PixelType text="999,990" className="tb-hiscore" />
              <Mark name="stars-06" ink={ORANGE} className="tb-mark tb-game2-stars" />
            </div>
            <p>
              <span className="tb-runin">A retired postman, 84,</span> has held the top score on his
              village hall&rsquo;s only arcade cabinet for eleven years. He plays one credit every
              Thursday &ldquo;to keep it honest&rdquo;.
            </p>
          </div>
          <div className="tb-mini">
            <h4 className="tb-cond tb-mini-head">Speedrun of the week</h4>
            <p>
              Four minutes, twelve seconds: the fastest anyone has served every customer in Bread
              &amp; Butter without dropping a croissant. The cat did not look impressed.
            </p>
          </div>
          <div className="tb-mini">
            <h4 className="tb-cond tb-mini-head">Wanted</h4>
            <p>
              Beta testers for a gardening game where the vegetables have opinions. Details in the
              classifieds, back page.
            </p>
          </div>
        </aside>
      </section>

      <Folio page={3} section="Gaming" />
    </Sheet>
  );
}
