import type { Metadata } from "next";
import { GAP, GoButton, Mascot, MASCOT_NAME, Poster, RansomHeading } from "@/features/riot";

export const metadata: Metadata = { title: "This page blew away · The Yay News" };

/**
 * For a page the paper doesn't have: an unknown issue, page or story, or an edition that exists
 * but hasn't reached 07:00 where the reader is yet.
 */
export default function ReaderNotFound() {
  return (
    <div className="ys-page ys-page--hero">
      <Poster
        seed="blew-away"
        paste={false}
        edge="torn"
        sides={["bottom", "right"]}
        screen={{ fade: "corner", density: 0.5, area: "0 0 0 55%", w: 560, h: 520 }}
        className="sb-shut"
        aria-labelledby="nf-sub"
      >
        <div className="sb-shut__type">
          <RansomHeading
            text="BLEW AWAY"
            seed="blew-away"
            as="h1"
            className="sb-shut__h"
            cuts={[
              { ch: "BL", from: "slab", size: 1.1 },
              { ch: "E", from: "didone", size: 0.92, lift: 0.08, turn: -3 },
              { ch: "W", from: "gothic", size: 1.04, tuck: 0.03, ground: "ink" },
              GAP,
              { ch: "AW", from: "roman", size: 1.04, turn: 2 },
              { ch: "AY", from: "slab", size: 0.94, tuck: 0.04, lift: 0.04 },
            ]}
          />
          <p className="sb-shut__sub" id="nf-sub">
            This page isn&rsquo;t anywhere on the stand. Either it never existed, or it&rsquo;s
            still on the press: each paper lands at 7am where you are.
          </p>
          <div className="sb-shut__cta">
            <GoButton href="/" sub="the one that's out now">
              Today&rsquo;s paper
            </GoButton>
            <GoButton tone="quiet" href="/pile">
              Dig in the pile
            </GoButton>
          </div>
        </div>
      </Poster>
      <div className="sb-shut__odin">
        <Mascot pose="confused" label={`${MASCOT_NAME} the husky, looking for the page`} />
      </div>
    </div>
  );
}
