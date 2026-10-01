import type { Metadata } from "next";
import { GAP, Mascot, MASCOT_NAME, Poster, RansomHeading, Scrap } from "@/features/riot";
import { KeptPapers } from "@/features/site/offline";

export const metadata: Metadata = {
  title: "You're offline · The Yay News",
  robots: { index: false },
};

// Served by the service worker when there's no connection and no kept copy of the page asked for.
// Static, so the worker can keep it from the first visit.
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <div className="ys-page ys-page--hero">
      <Poster
        seed="offline"
        paste={false}
        edge="torn"
        sides={["bottom"]}
        screen={{ fade: "corner", density: 0.5, area: "0 0 0 55%", w: 560, h: 520 }}
        className="sb-shut"
        aria-labelledby="off-sub"
      >
        <div className="sb-shut__type">
          <RansomHeading
            text="NO SIGNAL"
            seed="no-signal"
            as="h1"
            className="sb-shut__h"
            cuts={[
              { ch: "NO", from: "slab", size: 1.1 },
              GAP,
              { ch: "SI", from: "didone", size: 0.94, turn: -2 },
              { ch: "G", from: "gothic", size: 1.04, ground: "ink" },
              { ch: "NAL", from: "roman", size: 1.0, turn: 2 },
            ]}
          />
          <p className="sb-shut__sub" id="off-sub">
            No connection, but the papers you&rsquo;ve opened on this phone are still here.
          </p>
          <KeptPapers />
        </div>
      </Poster>
      <div className="sb-shut__odin">
        <Mascot pose="asleep" label="" />
        <Scrap seed="offline-zzz" ground="white" tape="top" className="sb-shut__caption">
          {MASCOT_NAME}&rsquo;s having a nap until the signal&rsquo;s back.
        </Scrap>
      </div>
    </div>
  );
}
