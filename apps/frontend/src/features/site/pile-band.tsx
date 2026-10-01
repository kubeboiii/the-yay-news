import Link from "next/link";
import { issueHref } from "@/features/papers/reading";
import { SetPlace } from "./place";
import "./pile-band.css";

// Across the top of any paper that isn't today's: where it came from, how old it is, and the way
// to today's paper, so nobody arriving from a link or a search mistakes it for this morning's.
// The paper itself stays exactly as it was printed.

const DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function age(date: string, today: string): string {
  const days = Math.round((Date.parse(today) - Date.parse(date)) / 86_400_000);
  if (days <= 0) return "";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days} days old`;
  if (days < 60) return `${Math.round(days / 7)} weeks old`;
  return `${Math.round(days / 30)} months old`;
}

export function PileBand({
  issue,
  date,
  today,
}: {
  issue: number;
  date: string;
  today: { issueNumber: number; date: string } | null;
}) {
  if (!today || issue >= today.issueNumber) return null;
  const old = age(date, today.date);
  const newer = issue + 1 >= today.issueNumber ? "/" : issueHref(issue + 1);
  return (
    <aside className="ys-band" aria-label="A paper from your pile">
      <SetPlace place="pile" />
      <p className="ys-band__where">
        <span className="ys-band__k">From the pile</span>
        <span>
          No. {issue} · {DAY.format(new Date(`${date}T00:00:00Z`))}
          {old ? ` · ${old}` : ""}
        </span>
      </p>
      <nav className="ys-band__nav" aria-label="Nearby papers">
        {issue > 1 ? (
          <Link href={issueHref(issue - 1)} aria-label={`No. ${issue - 1}, the paper before`}>
            ‹
          </Link>
        ) : null}
        <Link href={newer} aria-label="The paper after">
          ›
        </Link>
        <Link href="/" className="ys-band__today">
          Today&rsquo;s paper →
        </Link>
      </nav>
    </aside>
  );
}
