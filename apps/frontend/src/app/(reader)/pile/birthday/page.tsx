import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { findByDate } from "@/features/editions/api";
import { BirthdayForm } from "@/features/pile/birthday-form";
import { GAP, Mascot, RansomHeading } from "@/features/riot";
import { readerClock } from "@/features/site/clock";
import { previewFrom } from "../../_preview";
import "@/features/pile/pile.css";

export const metadata: Metadata = {
  title: "The paper from your birthday · The Yay News",
  robots: { index: false },
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const pad = (n: number) => String(n).padStart(2, "0");
/** How many years back to look; the paper started in 2026. */
const YEARS_BACK = 5;

function validDay(m: number, d: number) {
  if (!Number.isInteger(m) || !Number.isInteger(d) || m < 1 || m > 12 || d < 1) return false;
  return d <= new Date(Date.UTC(2024, m, 0)).getUTCDate(); // a leap year allows 29 February
}

/**
 * The most recent paper printed on the reader's birthday: this year's if it has come round, else
 * last year's, and so on. Before the first one exists, says when it will.
 */
export default async function BirthdayPage({ searchParams }: PageProps<"/pile/birthday">) {
  const preview = await previewFrom(searchParams);
  const params = await searchParams;
  const m = Number(params.m);
  const d = Number(params.d);
  const asked = validDay(m, d);

  let next: string | null = null;
  if (asked) {
    const clock = await readerClock(preview);
    const year = Number(clock.date.slice(0, 4));
    for (let y = year; y > year - YEARS_BACK; y--) {
      const date = `${y}-${pad(m)}-${pad(d)}`;
      if (date > clock.date) continue;
      if (m === 2 && d === 29 && new Date(Date.UTC(y, 1, 29)).getUTCMonth() !== 1) continue;
      const edition = await findByDate(date, preview);
      if (edition) redirect(`/issue/${edition.issueNumber}`);
    }
    const thisYear = `${year}-${pad(m)}-${pad(d)}`;
    next = thisYear > clock.date ? thisYear : `${year + 1}-${pad(m)}-${pad(d)}`;
  }

  return (
    <div className="ys-page sb-pile">
      <div className="sb-pile__head">
        <p className="rt-meta">
          <Link href="/pile">← Your Pile</Link>
        </p>
        <RansomHeading
          text="BIRTHDAY PAPER"
          seed="birthday"
          as="h1"
          className="sb-pile__h"
          cuts={[
            { ch: "BIR", from: "slab", size: 1.08 },
            { ch: "TH", from: "didone", size: 0.92, lift: 0.06, turn: -2 },
            { ch: "DAY", from: "gothic", size: 1.04, tuck: 0.03, ground: "a" },
            GAP,
            { ch: "PA", from: "roman", size: 1.0, turn: 2 },
            { ch: "PER", from: "slab", size: 0.94, tuck: 0.03 },
          ]}
        />
        {asked && next ? (
          <p className="sb-pile__sub">
            There&rsquo;s no paper from {d} {MONTHS[m - 1]} yet. Yours comes out on {d}{" "}
            {MONTHS[m - 1]} {next.slice(0, 4)}. Save the date.
          </p>
        ) : (
          <p className="sb-pile__sub">Pick your birthday and read the paper printed that day.</p>
        )}
      </div>
      <div className="ys-pile__foot">
        <BirthdayForm month={asked ? m : undefined} day={asked ? d : undefined} />
        <Mascot pose="lights" label="" className="ys-bday__odin" />
      </div>
    </div>
  );
}
