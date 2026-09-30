import Link from "next/link";
import { issueHref } from "@/features/papers/reading";
import type { Reading } from "@/features/papers/types";
import { SoundToggle } from "@/features/sound/sound-toggle";
import { ZineLink } from "@/features/zine/zine-link";

/**
 * The reader's way through the paper: previous page, where you are, next page, and every page of
 * the edition, plus the stamp book, cards, kept stories, the printable mini zine and the
 * paper-sounds switch. It sits outside the printed sheet, like a hand turning pages, so it is plain on
 * purpose.
 */
export function PageBar({ issue, reading }: { issue: number; reading: Reading }) {
  const { pages, current, prev, next } = reading;
  const n = pages.indexOf(current) + 1;
  return (
    <nav
      aria-label="Pages"
      className="fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-40 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] items-center gap-1 rounded-full bg-black/85 px-2 py-1.5 font-sans text-xs text-white shadow-lg backdrop-blur print:hidden"
    >
      {prev ? (
        <Link href={prev.href} rel="prev" className="rounded-full px-3 py-1 hover:bg-white/15">
          ← <span className="sr-only sm:not-sr-only">{prev.label}</span>
        </Link>
      ) : (
        <span className="px-3 py-1 opacity-40" aria-hidden>
          ←
        </span>
      )}
      <details className="relative">
        <summary className="cursor-pointer list-none rounded-full px-3 py-1 hover:bg-white/15">
          No. {issue} · {current.label}{" "}
          <span className="opacity-70">
            ({n} of {pages.length})
          </span>
        </summary>
        <ol className="absolute bottom-full left-1/2 mb-2 w-56 -translate-x-1/2 rounded-2xl bg-black/90 p-2 shadow-lg">
          {pages.map((p) => (
            <li key={p.order}>
              <Link
                href={p.href}
                aria-current={p === current ? "page" : undefined}
                className="block rounded-lg px-3 py-1.5 hover:bg-white/15 aria-[current=page]:bg-white aria-[current=page]:text-black"
              >
                {p.label}
              </Link>
            </li>
          ))}
          <li className="mt-1 border-t border-white/20 pt-1">
            <Link
              href={`${issueHref(issue)}/print`}
              className="block rounded-lg px-3 py-1.5 hover:bg-white/15"
            >
              Printable edition
            </Link>
          </li>
          <li>
            <ZineLink issue={issue} className="block rounded-lg px-3 py-1.5 hover:bg-white/15">
              Download today&rsquo;s zine
            </ZineLink>
          </li>
          <li>
            <Link href="/archive" className="block rounded-lg px-3 py-1.5 hover:bg-white/15">
              Back issues
            </Link>
          </li>
          <li>
            <Link href="/stamps" className="block rounded-lg px-3 py-1.5 hover:bg-white/15">
              Your stamps
            </Link>
          </li>
          <li>
            <Link href="/cards" className="block rounded-lg px-3 py-1.5 hover:bg-white/15">
              Your cards
            </Link>
          </li>
          <li>
            <Link href="/saved" className="block rounded-lg px-3 py-1.5 hover:bg-white/15">
              Kept stories
            </Link>
          </li>
        </ol>
      </details>
      {next ? (
        <Link href={next.href} rel="next" className="rounded-full px-3 py-1 hover:bg-white/15">
          <span className="sr-only sm:not-sr-only">{next.label}</span> →
        </Link>
      ) : (
        <span className="px-3 py-1 opacity-40" aria-hidden>
          →
        </span>
      )}
      <SoundToggle className="ml-1 shrink-0" />
    </nav>
  );
}
