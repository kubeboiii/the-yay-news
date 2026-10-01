import Link from "next/link";
import { loadSite, pressLabel, shortDate } from "@/app/mockups/site-a/_shared/data";
import { Shell } from "../_ui/chrome";
import { Balloon, Caption, Panel, Sfx, ToonPip } from "../_ui/comic";

export default async function Shutter({ searchParams }: PageProps<"/mockups/site-c/shutter">) {
  const data = await loadSite(searchParams);
  const { edition } = data;
  return (
    <Shell
      data={data}
      place="today"
      note="Before 7 the page is a three-panel strip you read left to right: where we are (asleep), when it lands (the clock), what to do now (Pip asks, with one big button). Pip's balloon is the instruction, so there's never a wall of UI copy."
    >
      <div className="sc-strip sc-strip--three">
        <Panel ground="s2" className="sc-night" label="Panel 1: the kiosk at night">
          <Caption>05:46. Up on the kiosk roof…</Caption>
          <div className="sc-night__stars" aria-hidden />
          <div className="sc-kiosk" aria-hidden>
            <ToonPip pose="sleep" className="sc-kiosk__pip" label="" />
            <span className="sc-kiosk__roof" />
            <span className="sc-kiosk__door">
              <span>closed</span>
            </span>
          </div>
          <Sfx className="sc-night__z">zzz</Sfx>
          <p className="sc-sr">Pip the pigeon is asleep on the roof of the closed kiosk.</p>
        </Panel>

        <Panel ground="l0" dots className="sc-clockpanel" label="Panel 2: the clock">
          <Caption>The press runs at 7:00 sharp.</Caption>
          <div className="sc-clock" aria-hidden>
            <span className="sc-clock__hand sc-clock__hand--h" />
            <span className="sc-clock__hand sc-clock__hand--m" />
            <span className="sc-clock__pin" />
          </div>
          <h1 className="sc-bigtime">
            <span className="sc-bigtime__n">{pressLabel(data.pressIn)}</span>
            <span className="sc-bigtime__l">till No. {edition.issueNumber + 1} lands</span>
          </h1>
          <Sfx className="sc-clockpanel__tick">tick… tock…</Sfx>
        </Panel>

        <Panel ground="s4" className="sc-askpanel" label="Panel 3: Pip has an idea">
          <Balloon tail="bl" className="sc-askpanel__balloon">
            Psst! Yesterday&rsquo;s paper is still warm. Read it while we wait?
          </Balloon>
          <ToonPip
            pose="stand"
            className="sc-askpanel__pip"
            label="Pip the pigeon, awake and pointing at yesterday's paper"
          />
          <div className="sc-askpanel__actions">
            <Link href="/mockups/site-c/today" className="sc-btn sc-btn--big">
              Read yesterday&rsquo;s
              <span>
                No. {edition.issueNumber} · {shortDate(edition.date)}
              </span>
            </Link>
            <button type="button" className="sc-btn sc-btn--small">
              Wake me at 7
            </button>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}
