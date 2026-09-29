import "server-only";
import type { EditionDesign, EditionSummary } from "@repo/shared";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { editionLook } from "@/app/clip/_lib/looks";
import { issueHref } from "@/features/papers/reading";
import { printedPhoto } from "@/features/print/photo";
import { aged, daysSince, seeded } from "./age";

// The newsstand rack: back issues standing folded in wire racks, a week to a rack, each copy in the
// look of the paper it was printed in (its masthead face and its colourway's inks), with its date,
// number, and the lead story's headline and photograph above the fold.

const PAPER_NAMES: Record<EditionDesign, { name: string; short: string }> = {
  broadsheet: { name: "the Broadsheet", short: "Broadsheet" },
  tabloid: { name: "the Tabloid", short: "Tabloid" },
  zine: { name: "the Mini Zine", short: "Zine" },
  midi: { name: "the Midi Magazine", short: "Midi" },
};

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" });
const LONG = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const SHORT = fmt({ weekday: "short", day: "numeric", month: "short", year: "numeric" });
const DAY = fmt({ day: "numeric", month: "short" });
const at = (date: string) => new Date(`${date}T00:00:00Z`);

/** WCAG relative luminance of a #rrggbb colour. */
const lum = (hex: string) =>
  [1, 3, 5].reduce((s, i, k) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    const lin = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    return s + lin * [0.2126, 0.7152, 0.0722][k]!;
  }, 0);
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m) as [number, number];
  return (x + 0.05) / (y + 0.05);
};
/** The paper's ink or white, whichever reads better on a ground. */
const on = (ground: string, ink: string) =>
  contrast(ground, ink) >= contrast(ground, "#ffffff") ? ink : "#ffffff";

/** The Monday a date's week starts on, as YYYY-MM-DD. */
function weekOf(date: string): string {
  const d = at(date);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

/** Issues grouped into racks by week, newest first. */
export function racksOf(items: EditionSummary[]) {
  const racks: { week: string; items: EditionSummary[] }[] = [];
  for (const e of items) {
    const week = weekOf(e.date);
    const last = racks.at(-1);
    if (last?.week === week) last.items.push(e);
    else racks.push({ week, items: [e] });
  }
  return racks;
}

function Masthead({ design }: { design: EditionDesign }) {
  if (design === "tabloid") return <>YAY!</>;
  if (design === "zine") {
    return (
      <>
        The
        <br />
        Yay News
      </>
    );
  }
  return <>The Yay News</>;
}

/** One folded front page standing in the rack: masthead up, the lead above the fold. */
function Copy({
  edition: e,
  index,
  now,
  today,
}: {
  edition: EditionSummary;
  index: number;
  now: number;
  today: boolean;
}) {
  const look = editionLook(e);
  const paper = PAPER_NAMES[e.design];
  const r = seeded(e.issueNumber * 97);
  const style = {
    ...aged(daysSince(e.date, now), e.issueNumber),
    "--ar-tilt": `${((r() - 0.5) * 3.2).toFixed(2)}deg`,
    "--ar-drop": `${Math.round(r() * 10)}px`,
    "--ar-a": look.a,
    "--ar-a-deep": look.aDeep,
    "--ar-b": look.b,
    "--ar-on-a": on(look.a, look.ink),
    "--ar-print": look.ink,
    "--ar-tint": look.tint ?? look.b,
    zIndex: 10 - index,
  } as CSSProperties;
  const lead = e.lead;
  const long = LONG.format(at(e.date));
  return (
    <li className="ar-slot">
      <Link
        href={issueHref(e.issueNumber)}
        className={`ar-front ar-front--${e.design}`}
        style={style}
        aria-label={`No. ${e.issueNumber}, ${long}, in ${paper.name}${lead ? `: ${lead.headline}` : ""}`}
      >
        <span className="ar-front__sheet">
          <span className="ar-front__ear">{today ? "Today" : `No. ${e.issueNumber}`}</span>
          <span className="ar-front__mast">
            <Masthead design={e.design} />
          </span>
          <span className="ar-front__line">
            <span>{SHORT.format(at(e.date))}</span>
            <span>
              Vol. {e.volume} · No. {e.issueNumber}
            </span>
          </span>
          {lead ? (
            <span className="ar-front__lead">
              <span className="ar-front__kicker">{lead.kicker}</span>
              <span className="ar-front__head">{lead.headline}</span>
              {lead.image ? (
                <span className="ar-front__photo">
                  <Image
                    src={printedPhoto(lead.image.url, 600)}
                    alt=""
                    fill
                    sizes="(max-width: 560px) 45vw, 220px"
                  />
                </span>
              ) : null}
            </span>
          ) : (
            <span className="ar-front__lead ar-front__lead--quiet">
              <em>Only good news. Mostly fun. Occasionally weird.</em>
            </span>
          )}
          <span className="ar-front__age" aria-hidden />
        </span>
        <span className="ar-front__tag" aria-hidden>
          {paper.short}
        </span>
      </Link>
    </li>
  );
}

export function Rack({
  week,
  items,
  now,
  todayIssue,
}: {
  week: string;
  items: EditionSummary[];
  now: number;
  todayIssue: number | null;
}) {
  const first = items.at(-1)!;
  const last = items[0]!;
  const nos =
    first.issueNumber === last.issueNumber
      ? `No. ${first.issueNumber}`
      : `Nos. ${first.issueNumber}–${last.issueNumber}`;
  const label = `Week of ${DAY.format(at(week))} · ${nos}`;
  return (
    <section className="ar-rack" aria-label={label}>
      <p className="ar-ticket">{label}</p>
      <ol className="ar-rack__row">
        {items.map((e, i) => (
          <Copy
            key={e.issueNumber}
            edition={e}
            index={i}
            now={now}
            today={e.issueNumber === todayIssue}
          />
        ))}
      </ol>
      <div className="ar-rack__rail" aria-hidden />
    </section>
  );
}
