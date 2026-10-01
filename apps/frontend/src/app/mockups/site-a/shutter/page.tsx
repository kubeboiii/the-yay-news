import Link from "next/link";
import { Burst } from "@repo/ui/print/burst";
import { loadSite, longDate, pressLabel } from "@/app/mockups/site-a/_shared/data";
import { Pip } from "@/app/mockups/site-a/_shared/pip";
import { Shell } from "../_ui/chrome";
import { Kraft, Sticker, Tape } from "../_ui/kit";

export default async function KioskShutter({ searchParams }: PageProps<"/mockups/site-a/shutter">) {
  const data = await loadSite(searchParams);
  const { edition } = data;
  const lead = edition.lead ?? data.pile[0]!.lead;
  const next = edition.issueNumber + 1;
  return (
    <Shell
      data={data}
      place="today"
      scene="kiosk"
      note="Before 7am the kiosk is shuttered. One fact (when), one primary action (read yesterday's), one optional one (a 7am ring). The countdown is printed big on cardboard, not hidden in a pill."
    >
      <div className="sa-kioskrow">
        <section className="sa-kiosk" aria-labelledby="kiosk-h">
          <div className="sa-kiosk__roof" aria-hidden>
            <Pip
              pose="sleep"
              className="sa-kiosk__pip"
              inks={{ cap: "var(--sa-l1)", shadow: "var(--sa-s3)" }}
            />
          </div>
          <div className="sa-kiosk__sign">
            <span>Pip&rsquo;s kiosk</span>
            <span className="sa-kiosk__signsub">papers · puzzles · good news</span>
          </div>
          <div className="sa-awning" aria-hidden />
          <div className="sa-shutter">
            <div className="sa-shutter__slats" aria-hidden />
            <Sticker shape="burst" ink="var(--sa-l0)" seed="s-back" className="sa-shutter__s1">
              back at <b>7:00</b>
            </Sticker>
            <Sticker shape="round" ink="var(--sa-l4)" seed="s-only" className="sa-shutter__s2">
              only good news
            </Sticker>
            <Sticker shape="rect" ink="var(--sa-l2)" seed="s-shh" className="sa-shutter__s3">
              shh. Pip&rsquo;s asleep
            </Sticker>
            <Sticker shape="blob" ink="var(--sa-l5)" seed="s-pip" className="sa-shutter__s4">
              <Pip pose="stand" still label="" className="sa-shutter__pipface" />
            </Sticker>
            <Kraft seed="k-press" className="sa-shutter__sign">
              <h1 id="kiosk-h">No. {next} is still on the press</h1>
              <p className="sa-countdown">
                <span className="sa-countdown__big">{pressLabel(data.pressIn)}</span>
                <span>till it lands, 7:00 sharp</span>
              </p>
              <Tape className="sa-tape--tl" ink="var(--sa-s0)" />
              <Tape className="sa-tape--tr" ink="var(--sa-s2)" />
            </Kraft>
            <span className="sa-shutter__handle" aria-hidden />
          </div>
          <div className="sa-counter">
            <Link href="/mockups/site-a/today" className="sa-btn sa-btn--go">
              <span className="sa-btn__kicker">While you wait</span>
              Read yesterday&rsquo;s paper
              <span className="sa-btn__meta">
                No. {edition.issueNumber} · {longDate(edition.date)}
              </span>
            </Link>
            <button type="button" className="sa-btn sa-btn--quiet">
              Ring my bell at 7
            </button>
          </div>
        </section>

        <aside className="sa-rail" aria-label="Yesterday's paper">
          <span className="sa-rail__peg" aria-hidden />
          <Link href="/mockups/site-a/today" className="sa-hung">
            <span className="sa-hung__mast">The Yay News</span>
            <span className="sa-hung__no">No. {edition.issueNumber} · yesterday</span>
            <span className="sa-hung__kick">{lead.kicker}</span>
            <span className="sa-hung__head">{lead.headline}</span>
            <span className="sa-hung__inside">Inside: {data.tags.join(" · ")}</span>
          </Link>
          <div className="sa-rail__note">
            <Burst fill="var(--sa-l1)" points={18} depth={0.14} className="sa-rail__burst">
              <span>{data.puzzles} puzzles on the back</span>
            </Burst>
            <p>
              Missed it? It&rsquo;s still on the rail. Finish it late and it still counts for your
              run; it just gets a crooked stamp.
            </p>
          </div>
        </aside>
      </div>
    </Shell>
  );
}
