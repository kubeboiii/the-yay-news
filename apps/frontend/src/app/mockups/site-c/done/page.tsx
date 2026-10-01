import Link from "next/link";
import type { CSSProperties } from "react";
import { loadSite, shortDate } from "@/app/mockups/site-a/_shared/data";
import { addDays } from "@/features/habits/core";
import { Shell } from "../_ui/chrome";
import { Balloon, Caption, Panel, Sfx, ToonPip } from "../_ui/comic";

export default async function Done({ searchParams }: PageProps<"/mockups/site-c/done">) {
  const data = await loadSite(searchParams);
  const { edition, streakDone } = data;
  const lines: [string, string][] = [
    ["Pages read", `${edition.pages.length} of ${edition.pages.length}`],
    ["Puzzles", `3 of ${data.puzzles}`],
    ["Stories kept", "2"],
    ["New sticker", "gold star"],
    ["Scratch card", "1 to open"],
    ["Run", `${streakDone.current} days`],
  ];
  return (
    <Shell
      data={data}
      place="today"
      finished
      note="The end of today is the end of an episode: a title card that says you're done and when the next one airs, the receipt of what you did, and Pip asking one question with three answers. Every share option is a big balloon you can't miss."
    >
      <div className="sc-strip sc-strip--done">
        <Panel ground="l3" dots className="sc-end" label="The end of today's episode">
          <Caption>And so, our hero finished the paper…</Caption>
          <h1 className="sc-end__h sc-inked">The End!</h1>
          <p className="sc-end__next">
            Next episode: No. {edition.issueNumber + 1}, {shortDate(addDays(edition.date, 1))} at
            7:00
          </p>
          <div className="sc-end__scene" aria-hidden>
            <span className="sc-end__door">
              <span>see you at 7!</span>
            </span>
            <ToonPip pose="sit" className="sc-end__pip" label="" />
          </div>
          <p className="sc-end__run">
            <span className="sc-end__n">{streakDone.current}</span>
            <span>days in a row!</span>
          </p>
          <Sfx className="sc-end__sfx">ta-da!</Sfx>
          <div className="sc-end__cta">
            <Link href="/mockups/site-c/wall" className="sc-btn sc-btn--big">
              Open your scratch card
              <span>it&rsquo;s waiting on your wall</span>
            </Link>
          </div>
        </Panel>

        <div className="sc-donecol">
          <Panel ground="s1" className="sc-tillpanel" label="Your receipt">
            <div className="sc-till" aria-hidden>
              <span className="sc-till__screen">thank you!</span>
            </div>
            <div className="sc-receipt">
              <h2 className="sc-receipt__h">Pip&rsquo;s kiosk · No. {edition.issueNumber}</h2>
              <ol>
                {lines.map(([k, v], i) => (
                  <li key={k} style={{ "--i": i } as CSSProperties}>
                    <span>{k}</span>
                    <b>{v}</b>
                  </li>
                ))}
              </ol>
              <p className="sc-receipt__total" style={{ "--i": lines.length } as CSSProperties}>
                Total: one good morning
              </p>
            </div>
          </Panel>
          <Panel ground="s4" className="sc-sharepanel" label="Pass it on">
            <Balloon tail="bl" as="h2" className="sc-sharepanel__ask">
              Tell a friend?
            </Balloon>
            <ToonPip pose="stand" className="sc-sharepanel__pip" label="" />
            <ul className="sc-answers">
              {["Copy the link", "Send today's front", "Save the receipt"].map((t, i) => (
                <li key={t}>
                  <button
                    type="button"
                    className="sc-answer"
                    style={{ "--ab": `var(--sc-l${[0, 2, 4][i]})` } as CSSProperties}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}
