import Link from "next/link";
import type { CSSProperties } from "react";
import { loadSite, shortDate } from "@/app/mockups/site-a/_shared/data";
import { Pip } from "@/app/mockups/site-a/_shared/pip";
import { addDays } from "@/features/habits/core";
import { Shell } from "../_ui/chrome";
import { Kraft, Stamp, Sticker, Tape } from "../_ui/kit";

export default async function KioskDone({ searchParams }: PageProps<"/mockups/site-a/done">) {
  const data = await loadSite(searchParams);
  const { edition, streakDone } = data;
  const lines: [string, string][] = [
    ["Pages read", `${edition.pages.length}/${edition.pages.length}`],
    ["Puzzles solved", `3 of ${data.puzzles}`],
    ["Stories kept", "2"],
    ["Sticker", "+1 Gold star"],
    ["Scratch card", "1 waiting"],
    ["Run", `${streakDone.current} days`],
    ["Best run", `${streakDone.best} days`],
  ];
  return (
    <Shell
      data={data}
      place="today"
      scene="kiosk"
      finished
      note="Finishing is a ritual, not a dead end: the shutter comes down, the till prints what you did today line by line, and the three ways to pass it on are right under the receipt. Nothing else asks for attention."
    >
      <div className="sa-kioskrow sa-kioskrow--done">
        <section className="sa-kiosk" aria-labelledby="done-h">
          <div className="sa-kiosk__roof sa-kiosk__roof--sit" aria-hidden>
            <Pip pose="sit" className="sa-kiosk__pip" inks={{ cap: "var(--sa-l1)" }} label="" />
          </div>
          <div className="sa-kiosk__sign">
            <span>Pip&rsquo;s kiosk</span>
            <span className="sa-kiosk__signsub">closed till 7:00</span>
          </div>
          <div className="sa-awning" aria-hidden />
          <div className="sa-shutter sa-shutter--down">
            <div className="sa-shutter__slats" aria-hidden />
            <Kraft seed="k-done" className="sa-shutter__sign">
              <h1 id="done-h">That&rsquo;s today, read cover to cover.</h1>
              <p className="sa-done__next">
                No. {edition.issueNumber + 1} lands {shortDate(addDays(edition.date, 1))}, 7:00.
              </p>
              <Tape className="sa-tape--tl" ink="var(--sa-s0)" />
              <Tape className="sa-tape--tr" ink="var(--sa-s3)" />
            </Kraft>
            <Stamp seed="st-done" ink="var(--sa-ink)" className="sa-done__stamp">
              <span className="sa-done__stampbig">Stamped</span>
              <span>
                No. {edition.issueNumber} · {shortDate(edition.date)}
              </span>
            </Stamp>
            <Sticker shape="burst" ink="var(--sa-l0)" seed="s-run" className="sa-shutter__s1">
              <b>{streakDone.current}</b> days
            </Sticker>
            <span className="sa-shutter__handle" aria-hidden />
          </div>
          <div className="sa-counter">
            <Link href="/mockups/site-a/wall" className="sa-btn sa-btn--go">
              <span className="sa-btn__kicker">Your scratch card is waiting</span>
              Open it on your wall
            </Link>
            <Link href="/mockups/site-a/pile" className="sa-btn sa-btn--quiet">
              Read an older one
            </Link>
          </div>
        </section>

        <aside className="sa-till" aria-labelledby="receipt-h">
          <div className="sa-till__box" aria-hidden>
            <span className="sa-till__name">Pip-o-matic 2000</span>
            <span className="sa-till__slot" />
          </div>
          <div className="sa-receipt">
            <h2 id="receipt-h" className="sa-receipt__head">
              <span>Pip&rsquo;s kiosk</span>
              <span>
                No. {edition.issueNumber} · {shortDate(edition.date)} · 09:12
              </span>
            </h2>
            <ol className="sa-receipt__lines">
              {lines.map(([k, v], i) => (
                <li key={k} style={{ "--i": i } as CSSProperties}>
                  <span>{k}</span>
                  <span className="sa-receipt__dots" aria-hidden />
                  <span>{v}</span>
                </li>
              ))}
              <li className="sa-receipt__total" style={{ "--i": lines.length } as CSSProperties}>
                <span>Total good news</span>
                <span className="sa-receipt__dots" aria-hidden />
                <span>100%</span>
              </li>
            </ol>
            <p
              className="sa-receipt__bar"
              aria-hidden
              style={{ "--i": lines.length + 1 } as CSSProperties}
            />
            <p className="sa-receipt__thanks" style={{ "--i": lines.length + 2 } as CSSProperties}>
              thank you, come again
            </p>
          </div>
          <div className="sa-pass">
            <h2 className="sa-pass__h">Pass it on</h2>
            <div className="sa-pass__row">
              <button
                type="button"
                className="sa-pass__btn"
                style={{ "--tk": "var(--sa-l2)" } as CSSProperties}
              >
                Copy the link
              </button>
              <button
                type="button"
                className="sa-pass__btn"
                style={{ "--tk": "var(--sa-l4)" } as CSSProperties}
              >
                Send today&rsquo;s front
              </button>
              <button
                type="button"
                className="sa-pass__btn"
                style={{ "--tk": "var(--sa-l3)" } as CSSProperties}
              >
                Save this receipt
              </button>
            </div>
          </div>
        </aside>
      </div>
    </Shell>
  );
}
