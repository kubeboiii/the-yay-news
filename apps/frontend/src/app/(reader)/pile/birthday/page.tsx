import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { rackFonts } from "@/features/archive/fonts";
import { findByDate } from "@/features/editions/api";
import { habitFonts } from "@/features/habits/fonts";
import { BirthdayForm } from "@/features/pile/birthday-form";
import { readerClock } from "@/features/site/clock";
import { previewFrom } from "../../_preview";
import "@/features/archive/archive.css";
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
    <main className={`ar-desk pl-desk ${rackFonts} ${habitFonts}`}>
      <header className="ar-sign pl-sign">
        <span className="ar-tape ar-tape--l" aria-hidden />
        <span className="ar-tape ar-tape--r" aria-hidden />
        <p className="ar-sign__kicker">
          <Link href="/pile">Your Pile</Link>
        </p>
        <h1 className="ar-sign__title">Your birthday paper</h1>
        {asked && next ? (
          <p className="ar-sign__sub">
            There&rsquo;s no paper from {d} {MONTHS[m - 1]} yet. Yours comes out on{" "}
            <b>
              {d} {MONTHS[m - 1]} {next.slice(0, 4)}
            </b>
            . Save the date.
          </p>
        ) : (
          <p className="ar-sign__sub">Pick your birthday and read the paper printed that day.</p>
        )}
        <BirthdayForm month={asked ? m : undefined} day={asked ? d : undefined} />
      </header>
    </main>
  );
}
