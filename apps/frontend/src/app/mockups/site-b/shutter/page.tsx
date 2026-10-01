import { loadSite, pressLabel, shortDate } from "@/app/mockups/site-a/_shared/data";
import {
  GAP,
  GoButton,
  Mascot,
  MASCOT_NAME,
  Misprint,
  Poster,
  RansomHeading,
  Scrap,
  Sticker,
} from "@/features/riot";
import { Shell } from "../_ui/chrome";

export default async function Shutter({ searchParams }: PageProps<"/mockups/site-b/shutter">) {
  const data = await loadSite(searchParams);
  const { edition } = data;
  return (
    <Shell
      data={data}
      place="today"
      note="One loud thing: a flat poster in plate A answering 'is it out yet?', the countdown misregistered, one black button. The husky is asleep on the bundles; the rest of the page is paper."
    >
      <Poster
        seed="shutter"
        paste={false}
        edge="torn"
        sides={["bottom"]}
        screen={{ fade: "corner", density: 0.6, area: "0 0 0 52%", w: 640, h: 700 }}
        className="sb-shut"
        aria-labelledby="sh-h"
      >
        <div className="sb-shut__type">
          <RansomHeading
            text="NOT YET"
            seed="notyet"
            className="sb-shut__h"
            cuts={[
              { ch: "N", from: "slab", size: 1.16, lift: -0.03 },
              { ch: "O", from: "didone", size: 0.9, lift: 0.1, tuck: 0.05, turn: 3 },
              { ch: "T", from: "gothic", size: 1.04, tuck: 0.03, ground: "ink" },
              GAP,
              { ch: "YE", from: "roman", size: 1.04, turn: -2 },
              { ch: "T", from: "slab", size: 0.9, lift: 0.08, tuck: 0.04, turn: 2.5 },
            ]}
          />
          <p className="sb-shut__sub" id="sh-h">
            No. {edition.issueNumber + 1} is still on the press.
          </p>
          <p className="sb-shut__count">
            <Misprint className="sb-shut__n" offset={[3, 2]}>
              {pressLabel(data.pressIn)}
            </Misprint>
            <span className="sb-shut__l">until it lands, 7:00 sharp</span>
          </p>
          <div className="sb-shut__cta">
            <GoButton
              href="/mockups/site-b/today"
              sub={`No. ${edition.issueNumber} · ${shortDate(edition.date)}`}
            >
              Read yesterday&rsquo;s
            </GoButton>
            <GoButton tone="quiet">Buzz me at 7</GoButton>
          </div>
        </div>
        {data.tags[0] ? (
          <Sticker seed="tomorrow" ground="paper" pinned className="sb-shut__sticker">
            Yesterday&rsquo;s had {data.tags[0]}
          </Sticker>
        ) : null}
      </Poster>
      <div className="sb-shut__odin">
        <Mascot pose="asleep" />
        <Scrap seed="zzz" ground="white" tape="top" className="sb-shut__caption">
          {MASCOT_NAME}&rsquo;s asleep on the bundles for No. {edition.issueNumber + 1}.
        </Scrap>
      </div>
    </Shell>
  );
}
