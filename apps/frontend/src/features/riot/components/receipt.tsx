import type { CSSProperties, ReactNode } from "react";
import { edgePath } from "../tokens/edges";
import "../riot.css";

export type ReceiptLine = { label: string; value: string };

const DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/**
 * Proof of yay: a till receipt for today's paper that prints in line by line (instantly under
 * reduced motion). Plain data in; it does the wording. Put TearTabs in `children` to tear the
 * bottom into tabs.
 */
export function Receipt({
  issue,
  date,
  pageSquares,
  puzzles,
  streak,
  tags,
  lines = [],
  stampedAt,
  title = "Proof of yay",
  total = "Total: 100% good news",
  headingId,
  className,
  children,
}: {
  issue: number;
  /** YYYY-MM-DD. */
  date: string;
  /** One square per page, in its section ink; filled once read. */
  pageSquares: readonly { colour: string; read: boolean }[];
  puzzles: { solved: number; total: number };
  /** Days in a row. */
  streak: number;
  /** What the paper was about. */
  tags: readonly string[];
  /** Extra lines, printed after puzzles. */
  lines?: readonly ReceiptLine[];
  /** "09:12" */
  stampedAt?: string;
  title?: string;
  total?: string;
  headingId?: string;
  className?: string;
  children?: ReactNode;
}) {
  const read = pageSquares.filter((p) => p.read).length;
  const rows: { label: string; value: ReactNode }[] = [
    {
      label: "pages",
      value: (
        <>
          <span className="rt-receipt__squares" aria-hidden>
            {pageSquares.map((p, i) => (
              <span
                key={i}
                className={p.read ? "is-read" : undefined}
                style={{ "--sq": p.colour } as CSSProperties}
              />
            ))}
          </span>
          {read}/{pageSquares.length}
        </>
      ),
    },
    { label: "puzzles", value: `${puzzles.solved}/${puzzles.total}` },
    ...lines,
    { label: "run", value: `${streak} ${streak === 1 ? "day" : "days"}` },
  ];
  if (tags.length) rows.push({ label: "about", value: tags.slice(0, 3).join(", ") });
  return (
    <section className={`rt-receipt ${className ?? ""}`} aria-labelledby={headingId}>
      <span
        className="rt-receipt__sheet"
        aria-hidden
        style={{ clipPath: edgePath("zigzag", `receipt-${issue}`, ["top"], 26) }}
      />
      <h2 id={headingId} className="rt-receipt__h">
        {title}
      </h2>
      <p className="rt-receipt__meta">
        No. {issue} · {DAY.format(new Date(`${date}T00:00:00Z`))}
        {stampedAt ? ` · ${stampedAt}` : ""}
      </p>
      <ol className="rt-receipt__lines">
        {rows.map((row, i) => (
          <li key={row.label} style={{ "--i": i } as CSSProperties}>
            <span>{row.label}</span>
            <span className="rt-receipt__dots" aria-hidden />
            <b>{row.value}</b>
          </li>
        ))}
      </ol>
      <p className="rt-receipt__total" style={{ "--i": rows.length } as CSSProperties}>
        {total}
      </p>
      {children}
    </section>
  );
}
