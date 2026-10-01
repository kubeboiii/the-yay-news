import Link from "next/link";
import type { CSSProperties } from "react";
import { loadSite } from "@/app/mockups/site-a/_shared/data";
import { KeyTurn } from "@/app/mockups/site-a/_shared/key-turn";
import { PrintedPaper } from "@/app/mockups/site-a/_shared/paper";
import { Shell } from "../_ui/chrome";
import { ToonPip } from "../_ui/comic";
import { GlyphArrow } from "../_ui/glyphs";

const href = (order: number) => `/mockups/site-c/today?p=${order}`;

export default async function Today({ searchParams }: PageProps<"/mockups/site-c/today">) {
  const data = await loadSite(searchParams);
  const sp = await searchParams;
  const pages = data.pages;
  const order = Math.min(Math.max(Number(sp.p) || 1, 1), pages.length);
  const i = pages.findIndex((p) => p.order === order);
  const current = pages[i]!;
  const prev = pages[i - 1] ?? null;
  const next = pages[i + 1] ?? null;
  const at = (i / Math.max(pages.length - 1, 1)) * 100;
  return (
    <Shell
      data={data}
      place="today"
      note="Reading is Pip's paper round: every page is a stop on his route, he cycles to the one you're on, and the two biggest buttons on screen are Back and Next (which says where it goes). The route doubles as a progress bar and a contents. ← → keys too."
    >
      <KeyTurn prev={prev ? href(prev.order) : null} next={next ? href(next.order) : null} />
      <div className="sc-reading">
        <PrintedPaper edition={data.edition} order={order} />
      </div>
      <nav className="sc-route" aria-label="Pages in today's paper">
        {prev ? (
          <Link
            href={href(prev.order)}
            scroll={false}
            className="sc-btn sc-route__btn sc-route__btn--prev"
          >
            <GlyphArrow className="sc-route__arrow sc-route__arrow--back" />
            Back
            <span className="sc-sr">to {prev.label}</span>
          </Link>
        ) : (
          <span className="sc-route__start" aria-hidden>
            Start
          </span>
        )}
        <div className="sc-route__road">
          <span className="sc-route__fill" style={{ width: `${at}%` }} aria-hidden />
          <ToonPip
            pose="bike"
            className="sc-route__pip"
            label=""
            style={{ left: `${at}%` } as CSSProperties}
          />
          <ol className="sc-route__stops">
            {pages.map((p, k) => (
              <li
                key={p.order}
                style={
                  { left: `${(k / (pages.length - 1)) * 100}%`, "--st": p.colour } as CSSProperties
                }
              >
                <Link
                  href={href(p.order)}
                  scroll={false}
                  className={`sc-stop ${k < i ? "is-done" : ""}`}
                  aria-current={p.order === order ? "page" : undefined}
                >
                  <span className="sc-stop__n">{k + 1}</span>
                  <span className="sc-stop__label">{p.label}</span>
                </Link>
              </li>
            ))}
          </ol>
          <details className="sc-route__now">
            <summary>
              Stop {i + 1} of {pages.length}: {current.label}
              <span className="sc-route__all">all stops</span>
            </summary>
            <ol>
              {pages.map((p, k) => (
                <li key={p.order}>
                  <Link
                    href={href(p.order)}
                    scroll={false}
                    aria-current={p.order === order ? "page" : undefined}
                  >
                    {k + 1}. {p.label}
                  </Link>
                </li>
              ))}
            </ol>
          </details>
        </div>
        {next ? (
          <Link
            href={href(next.order)}
            scroll={false}
            className="sc-btn sc-route__btn sc-route__btn--next"
          >
            <span className="sc-route__next">
              Next
              <span>{next.label}</span>
            </span>
            <GlyphArrow className="sc-route__arrow" />
          </Link>
        ) : (
          <Link href="/mockups/site-c/done" className="sc-btn sc-route__btn sc-route__btn--next">
            <span className="sc-route__next">
              The end!
              <span>get your star</span>
            </span>
          </Link>
        )}
      </nav>
    </Shell>
  );
}
