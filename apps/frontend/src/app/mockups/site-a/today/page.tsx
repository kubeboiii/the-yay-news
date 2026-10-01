import Link from "next/link";
import type { CSSProperties } from "react";
import { loadSite } from "@/app/mockups/site-a/_shared/data";
import { KeyTurn } from "@/app/mockups/site-a/_shared/key-turn";
import { PrintedPaper } from "@/app/mockups/site-a/_shared/paper";
import { Pip } from "@/app/mockups/site-a/_shared/pip";
import { Tick } from "@/features/play/rough";
import { Shell } from "../_ui/chrome";

const href = (order: number) => `/mockups/site-a/today?p=${order}`;

export default async function TodayOpen({ searchParams }: PageProps<"/mockups/site-a/today">) {
  const data = await loadSite(searchParams);
  const sp = await searchParams;
  const pages = data.pages;
  const order = Math.min(Math.max(Number(sp.p) || 1, 1), pages.length);
  const i = pages.findIndex((p) => p.order === order);
  const current = pages[i]!;
  const prev = pages[i - 1] ?? null;
  const next = pages[i + 1] ?? null;
  return (
    <Shell
      data={data}
      place="today"
      scene="desk"
      note="The paper lies on the desk; the chrome gets out of its way. Turning is a folded corner (always in the same spot, labelled with where it goes), the thumb-index shows every page and where you are. ← → keys turn too."
    >
      <KeyTurn prev={prev ? href(prev.order) : null} next={next ? href(next.order) : null} />
      <div className="sa-route" aria-hidden>
        <span className="sa-route__line" />
        <Pip
          pose="bike"
          className="sa-route__pip"
          label=""
          style={{ left: `calc(${(i / Math.max(pages.length - 1, 1)) * 100}% - 40px)` }}
        />
      </div>
      <p className="sa-delivered">
        <span>Delivered 07:00 by Pip</span>
        <span>
          Page {i + 1} of {pages.length} · {current.label}
        </span>
      </p>
      <div className="sa-deskrow">
        <div className="sa-desk" id="paper">
          <PrintedPaper edition={data.edition} order={order} />
        </div>
        <nav className="sa-index" aria-label="Pages in today's paper">
          <ol>
            {pages.map((p, k) => (
              <li key={p.order} style={{ "--tab": p.colour, "--k": k } as CSSProperties}>
                <Link
                  href={href(p.order)}
                  scroll={false}
                  className="sa-tab"
                  aria-current={p.order === order ? "page" : undefined}
                >
                  <span className="sa-tab__n">{k + 1}</span>
                  <span className="sa-tab__label">{p.label}</span>
                  {k < i ? <Tick seed={k} className="sa-tab__read" label="read" /> : null}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      {prev ? (
        <Link
          href={href(prev.order)}
          scroll={false}
          className="sa-corner sa-corner--prev"
          style={{ "--under": prev.colour } as CSSProperties}
        >
          <span className="sa-corner__fold" aria-hidden />
          <span className="sa-corner__text">
            <span className="sa-corner__dir">Back</span>
            <span className="sa-corner__label">{prev.label}</span>
          </span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={href(next.order)}
          scroll={false}
          className="sa-corner sa-corner--next"
          style={{ "--under": next.colour } as CSSProperties}
        >
          <span className="sa-corner__fold" aria-hidden />
          <span className="sa-corner__text">
            <span className="sa-corner__dir">Turn over</span>
            <span>
              {i + 2} · {next.label}
            </span>
          </span>
        </Link>
      ) : (
        <Link href="/mockups/site-a/done" className="sa-corner sa-corner--next sa-corner--end">
          <span className="sa-corner__fold" aria-hidden />
          <span className="sa-corner__text">
            <span className="sa-corner__dir">All read</span>
            <span>Get your stamp</span>
          </span>
        </Link>
      )}
    </Shell>
  );
}
