import { loadSite, shortDate } from "@/app/mockups/site-a/_shared/data";
import { addDays } from "@/features/habits/core";
import {
  GAP,
  GoButton,
  Mascot,
  MASCOT_NAME,
  Misprint,
  Poster,
  RansomHeading,
  Receipt,
  RubberStamp,
  TearTabs,
} from "@/features/riot";
import { Shell } from "../_ui/chrome";

export default async function Done({ searchParams }: PageProps<"/mockups/site-b/done">) {
  const data = await loadSite(searchParams);
  const { edition, streakDone } = data;
  const run = streakDone.current;
  return (
    <Shell
      data={data}
      place="today"
      finished
      note="The end is a wheatpasted poster: done, your run, when the next one lands. The receipt prints line by line, and sharing is literal: tear a tab off the bottom. Three tabs, three actions, nothing in a menu."
    >
      <div className="sb-done">
        <Poster
          seed="done"
          screen={{ fade: "corner", density: 0.55, area: "0 0 40% 50%", w: 440, h: 360 }}
          className="sb-paste"
          aria-labelledby="done-h"
        >
          <RansomHeading
            text="THAT'S TODAY"
            seed="done"
            className="sb-paste__h"
            cuts={[
              { ch: "TH", from: "gothic", size: 1.12 },
              { ch: "A", from: "didone", size: 0.94, lift: 0.08, tuck: 0.04, turn: -3 },
              { ch: "T'S", from: "slab", size: 0.98, tuck: 0.03, lift: -0.02 },
              GAP,
              { ch: "T", from: "roman", size: 1.06, turn: 2 },
              { ch: "O", from: "slab", size: 0.9, tuck: 0.05, lift: 0.1, ground: "ink" },
              { ch: "DAY", from: "gothic", size: 1.14, tuck: 0.02, turn: -1 },
            ]}
          />
          <p className="sb-paste__line" id="done-h">
            Cover to cover. No. {edition.issueNumber + 1} lands{" "}
            {shortDate(addDays(edition.date, 1))} at 7.
          </p>
          <p className="sb-paste__run">
            <Misprint className="sb-paste__n">{run}</Misprint>
            <span className="sb-paste__l">
              days running. Your best is {streakDone.best}
              {run >= streakDone.best ? ", and this is it." : "."}
            </span>
          </p>
          <div className="sb-paste__cta">
            <GoButton href="/mockups/site-b/wall" sub="1 waiting on your wall">
              Scratch your card
            </GoButton>
            <GoButton tone="quiet" href="/mockups/site-b/pile">
              Dig in the pile
            </GoButton>
          </div>
          <RubberStamp seed="done-stamp" tilt={-12} className="sb-paste__stamp">
            Read
          </RubberStamp>
          <Mascot
            pose="on-pile"
            className="sb-paste__odin"
            label={`${MASCOT_NAME} the husky, sitting on today's finished paper`}
          />
        </Poster>

        <Receipt
          className="sb-receipt"
          headingId="proof-h"
          issue={edition.issueNumber}
          date={edition.date}
          stampedAt="09:12"
          pageSquares={data.pages.map((p) => ({ colour: p.colour, read: true }))}
          puzzles={{ solved: 3, total: data.puzzles }}
          streak={run}
          tags={data.tags}
          lines={[
            { label: "kept", value: "2 stories" },
            { label: "sticker", value: "gold star" },
          ]}
          total="Bad news: 0"
        >
          <TearTabs
            prompt="Pass it on: take one"
            tabs={[{ label: "Copy link" }, { label: "Send the front" }, { label: "Save the pic" }]}
          />
        </Receipt>
      </div>
    </Shell>
  );
}
