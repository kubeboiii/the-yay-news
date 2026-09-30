import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { handwriting } from "@/features/habits/fonts";
import { hand } from "@/features/play/fonts";
import { printedPhoto } from "@repo/ui/print/photo";
import type { BriefFlavour } from "./brief-art";
import { Columns, Flow, Head, Pic, clamp, fit, hash, weight } from "./spreads";
import type { PageProps, StoryItem } from "./types";
import { editionName, weekendDay, type WeekendKind } from "./weekend-lineup";
import "./spreads.css";
import "./weekend.css";

export { editionName, weekendDay, weekendKind, type WeekendKind } from "./weekend-lineup";

// The weekend editions. Saturday's "The Big Weekend" and Sunday's "The Scrapbook" print their own
// sections in place of the daily ones, and six of those have pages of their own shape rather than
// the design's usual grid:
//
//   ten       — The Week in 10: a numbered list, each item a short retelling of one of the week's
//               best stories, linking back to the original
//   longread  — Deep Dive and Slow Read: one long story, a big headline, standfirst, drop cap,
//               columns of text, a pull quote lifted from it and its picture
//   album     — Photo Album: the week's pictures taped in as polaroids, each captioned
//   fame      — Hall of Fame: four winners, each on a trophy card under a rosette
//   makedo    — Make & Do: a recipe card, a make, a playlist and a doodle to draw
//   calendar  — Next Week: the week ahead as a strip of days over the listings
//
// Like the special pages (spreads.tsx) each prints in the design's faces and inks, on one page or
// across the two pages of a spread, and every story is printed whole, once.

const RANK = { lead: 0, feature: 1, brief: 2 } as const;
const ranked = (stories: StoryItem[]) =>
  [...stories].sort((a, b) => RANK[a.slot] - RANK[b.slot] || a.order - b.order);
const byOrder = (stories: StoryItem[]) => [...stories].sort((a, b) => a.order - b.order);

type Parts = {
  stories: StoryItem[];
  href: (slug: string) => string;
  seed: string;
  /** The edition's date, for the week ahead. */
  date: string;
  /** The section's name, for the long read's label. */
  name: string;
};

type Half = 0 | 1 | "all";

/** A sentence someone said, lifted out of the text for a pull quote, if the story has one. */
function pullQuote(body: string[]): string | null {
  for (const p of body) {
    for (const m of p.matchAll(/[“"]([^”"]{30,140})[”"]/g)) {
      const said = m[1]!.trim().replace(/[,;:]$/, ".");
      if (said.split(" ").length >= 6) return /[.!?…]$/.test(said) ? said : `${said}.`;
    }
  }
  return null;
}

/** Where the week's story first ran, from its link back ("/issue/41/…"), if it says. */
function ranIn(url: string): string | null {
  const m = url.match(/\/issue\/(\d+)(?:\/([a-z0-9-]+))?/);
  return m ? `From No. ${m[1]}` : null;
}

// ——— The Week in 10 ———

function TenItem({ s, n }: { s: StoryItem; n: number }) {
  const from = ranIn(s.sourceUrl);
  const text = s.body.length ? s.body : [s.dek];
  return (
    <article className="wk-ten-item" data-balance="off">
      <span className="wk-ten-n" aria-hidden>
        {n}
      </span>
      <div className="wk-ten-text">
        {s.images[0] ? (
          <Pic
            story={s}
            sizes="(max-width: 760px) 40vw, 200px"
            width={500}
            lo={1}
            hi={1.5}
            className="wk-ten-pic"
          />
        ) : null}
        <p className="sp-kick">{s.kicker}</p>
        <h3 className="sp-hed sp-hed--sm">
          <a href={s.sourceUrl}>{s.headline}</a>
        </h3>
        {text.map((p, i) => (
          <p key={i} className="wk-ten-copy">
            {p}
          </p>
        ))}
        <p className="wk-ten-from">
          <a href={s.sourceUrl}>
            {from ? `${from} · read the whole story` : "Read the whole story"}
          </a>
        </p>
      </div>
    </article>
  );
}

function Ten({ p, half }: { p: Parts; half: Half }) {
  const items = byOrder(p.stories).slice(0, 10);
  const n = items.length;
  const title = (
    <header className="wk-ten-title">
      <span className="wk-ten-big" aria-hidden>
        {n}
      </span>
      <div>
        <h2 className="wk-ten-hed">
          The week in {n === 10 ? "ten" : n}
          <span className="sp-hand wk-ten-note"> (the best bits, again)</span>
        </h2>
        <p className="sp-label">Monday to Friday&rsquo;s best stories, told again in short</p>
      </div>
    </header>
  );
  const el = (s: StoryItem, i: number) => <TenItem key={s.slug} s={s} n={i + 1} />;
  if (half === "all")
    return (
      <>
        {title}
        <Columns
          id={`${p.seed}:ten`}
          className="wk-ten-list"
          weights={items.map((s) => weight(s) * 0.6 + 400)}
        >
          {items.map(el)}
        </Columns>
      </>
    );
  const cut = Math.ceil(n / 2);
  return (
    <>
      {half === 0 ? title : null}
      <div className="wk-ten-list wk-ten-list--page">
        <Flow id={`${p.seed}:ten`} half={half}>
          {half === 0
            ? items.slice(0, cut).map(el)
            : items.slice(cut).map((s, i) => el(s, cut + i))}
        </Flow>
      </div>
    </>
  );
}

// ——— The long read ———

function LongHead({ s, p }: { s: StoryItem; p: Parts }) {
  return (
    <header className="wk-long-head">
      <p className="sp-kick sp-kick--rule">
        {p.name} · {s.kicker}
      </p>
      <h2 className="wk-long-hed" style={fit(s.headline, 4, 12)}>
        <Link href={p.href(s.slug)}>{s.headline}</Link>
      </h2>
      {s.dek ? <p className="sp-dek sp-dek--big">{s.dek}</p> : null}
      <p className="wk-long-by">
        A {s.readMinutes}-minute read · via {s.sourceName}
      </p>
    </header>
  );
}

function LongPic({ s, n, big }: { s: StoryItem; n: number; big?: boolean }) {
  const image = s.images[n];
  if (!image) return null;
  return (
    <figure className={big ? "wk-long-fig" : "wk-long-fig wk-long-fig--in"}>
      <Pic
        story={{ ...s, images: [image] }}
        sizes={big ? "(max-width: 760px) 100vw, 1000px" : "(max-width: 760px) 100vw, 360px"}
        width={big ? 1600 : 700}
        lo={big ? 1.35 : 1}
        hi={big ? 2.1 : 1.6}
        className="sp-fill"
      />
      <figcaption className="sp-cap">
        {image.alt}
        {image.credit ? <span className="wk-credit"> · {image.credit}</span> : null}
      </figcaption>
    </figure>
  );
}

function Pull({ text }: { text: string }) {
  return (
    <blockquote className="wk-pull">
      <p>&ldquo;{text.replace(/^[“"]|[”"]$/g, "")}&rdquo;</p>
    </blockquote>
  );
}

/** The long read's text as pieces: paragraphs, the pull quote a third of the way in, a picture. */
function longPieces(s: StoryItem): ReactNode[] {
  const quote = pullQuote(s.body) ?? s.dek;
  const at = Math.max(1, Math.round(s.body.length * 0.4));
  const picAt = Math.max(at + 2, Math.round(s.body.length * 0.75));
  const out: ReactNode[] = [];
  s.body.forEach((para, i) => {
    if (i === at && quote) out.push(<Pull key="pull" text={quote} />);
    if (i === picAt && s.images[1]) out.push(<LongPic key="pic2" s={s} n={1} />);
    out.push(
      <p key={i} className={i === 0 ? "wk-first" : undefined}>
        {para}
      </p>,
    );
  });
  return out;
}

function LongRead({ p, half }: { p: Parts; half: Half }) {
  const s = ranked(p.stories)[0];
  if (!s) return null;
  const pieces = longPieces(s);
  const rest = ranked(p.stories).slice(1);
  if (half === "all")
    return (
      <>
        <LongHead s={s} p={p} />
        <LongPic s={s} n={0} big />
        <div className="sp-copy sp-copy--3 sp-drop wk-long-copy">{pieces}</div>
        {rest.length ? <Also stories={rest} p={p} /> : null}
      </>
    );
  // Across a spread: the head and picture open the left page, the text runs on over the fold.
  // The left page takes about a third of the text; the balancer moves paragraphs over to level.
  const cut = Math.max(2, Math.round(pieces.length * 0.34));
  return half === 0 ? (
    <>
      <LongHead s={s} p={p} />
      <LongPic s={s} n={0} big />
      <div
        className="sp-copy sp-copy--2 sp-drop wk-long-copy"
        data-sp-flow={`${p.seed}:long`}
        data-half={0}
      >
        {pieces.slice(0, cut)}
      </div>
    </>
  ) : (
    <>
      <div
        className="sp-copy sp-copy--2 wk-long-copy"
        data-sp-flow={`${p.seed}:long`}
        data-half={1}
      >
        {pieces.slice(cut)}
      </div>
      {rest.length ? <Also stories={rest} p={p} /> : null}
    </>
  );
}

/** Anything else on a long read's page, printed small after it. */
function Also({ stories, p }: { stories: StoryItem[]; p: Parts }) {
  return (
    <section className="wk-also" aria-label="Also this weekend">
      {stories.map((s) => (
        <article key={s.slug}>
          <Head story={s} href={p.href(s.slug)} size="md" />
          <div className="sp-copy">
            {s.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

// ——— The photo album ———

function Polaroid({ s, p, i }: { s: StoryItem; p: Parts; i: number }) {
  const h = hash(`${p.seed}:${s.slug}`);
  const tilt = ((h % 9) - 4) * 0.6 || (i % 2 ? 1.4 : -1.4);
  return (
    <article className="wk-snap" style={{ "--tilt": `${tilt}deg` } as CSSProperties}>
      {s.images[0] ? (
        <figure className="sp-polaroid wk-snap-print">
          <span className={`sp-tape ${h % 2 ? "wk-tape--r" : ""}`} aria-hidden />
          <Pic
            story={s}
            sizes="(max-width: 760px) 90vw, 420px"
            width={900}
            lo={0.8}
            hi={1.55}
            className="sp-fill"
          />
          <figcaption className="sp-hand sp-polaroid-cap">{s.kicker}</figcaption>
        </figure>
      ) : (
        <p className="sp-kick">{s.kicker}</p>
      )}
      <div className="wk-snap-note">
        <h3 className="sp-hed sp-hed--sm">
          <Link href={p.href(s.slug)}>{s.headline}</Link>
        </h3>
        {s.body.map((para, k) => (
          <p key={k} className="wk-snap-copy">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}

function Album({ p, half }: { p: Parts; half: Half }) {
  const items = byOrder(p.stories);
  const title = (
    <header className="sp-board-title wk-album-title">
      <h2 className="sp-hand">Stuck in this week</h2>
      <p className="sp-label">{items.length} pictures, and the stories behind them</p>
    </header>
  );
  const el = (s: StoryItem, i: number) => <Polaroid key={s.slug} s={s} p={p} i={i} />;
  if (half === "all")
    return (
      <>
        {title}
        <div className="wk-album wk-album--3">{items.map(el)}</div>
      </>
    );
  const cut = Math.ceil(items.length / 2);
  const mine = half === 0 ? items.slice(0, cut) : items.slice(cut);
  return (
    <>
      {half === 0 ? title : null}
      <div className="wk-album wk-album--2">{mine.map((s, i) => el(s, i + (half ? cut : 0)))}</div>
    </>
  );
}

// ——— The hall of fame ———

function Rosette({ n, seed }: { n: number; seed: number }) {
  const petals = 16;
  const pts = Array.from({ length: petals * 2 }, (_, k) => {
    const a = (Math.PI * k) / petals;
    const r = k % 2 ? 40 : 48;
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 150" className="wk-rosette" aria-hidden>
      <path d="M34 80 L22 146 L36 134 L46 148 L50 84 Z" className="wk-ros-tail" />
      <path d="M66 80 L78 146 L64 134 L54 148 L50 84 Z" className="wk-ros-tail wk-ros-tail--b" />
      <polygon points={pts} className="wk-ros-petals" transform={`rotate(${seed % 20} 50 50)`} />
      <circle cx="50" cy="50" r="31" className="wk-ros-ring" />
      <circle cx="50" cy="50" r="25" className="wk-ros-core" />
      <text x="50" y="47" textAnchor="middle" className="wk-ros-no">
        No.
      </text>
      <text x="50" y="66" textAnchor="middle" className="wk-ros-n">
        {n}
      </text>
    </svg>
  );
}

function Award({ s, p, n }: { s: StoryItem; p: Parts; n: number }) {
  return (
    <article className="wk-award">
      <div className="wk-award-top">
        <Rosette n={n} seed={hash(s.slug)} />
        <div>
          <p className="wk-award-cat">{s.kicker}</p>
          <p className="sp-label wk-award-sub">This week&rsquo;s winner</p>
        </div>
      </div>
      {s.images[0] ? (
        <figure className="wk-award-frame">
          <Pic
            story={s}
            sizes="(max-width: 760px) 90vw, 480px"
            width={900}
            lo={1.2}
            hi={1.8}
            className="sp-fill"
          />
        </figure>
      ) : null}
      <h3 className="sp-hed sp-hed--md">
        <Link href={p.href(s.slug)}>{s.headline}</Link>
      </h3>
      {s.dek ? <p className="sp-dek sp-dek--sm">{s.dek}</p> : null}
      <div className="sp-copy">
        {s.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}

function Fame({ p, half }: { p: Parts; half: Half }) {
  const items = byOrder(p.stories);
  const title = (
    <header className="wk-plaque">
      <p className="sp-label">Awarded every Sunday</p>
      <h2 className="wk-plaque-hed">The week&rsquo;s winners</h2>
      <p className="wk-plaque-sub">{items.map((s) => s.kicker).join(" · ")}</p>
    </header>
  );
  const el = (s: StoryItem, i: number) => <Award key={s.slug} s={s} p={p} n={i + 1} />;
  if (half === "all")
    return (
      <>
        {title}
        <div className="wk-awards">{items.map(el)}</div>
      </>
    );
  const cut = Math.ceil(items.length / 2);
  return (
    <>
      {half === 0 ? title : null}
      <div className="wk-awards wk-awards--page">
        {(half === 0 ? items.slice(0, cut) : items.slice(cut)).map((s, i) =>
          el(s, i + (half ? cut : 0)),
        )}
      </div>
    </>
  );
}

// ——— Make & Do ———

type MakeKind = "recipe" | "diy" | "playlist" | "doodle";
const MAKES: MakeKind[] = ["recipe", "diy", "playlist", "doodle"];
const MAKE_TEST: Record<MakeKind, RegExp> = {
  recipe: /recipe|cook|bake|kitchen|food|snack/i,
  diy: /diy|make|craft|build|fold|sew/i,
  playlist: /playlist|listen|songs?|music|mixtape|tracks?/i,
  doodle: /doodle|draw|sketch|colour/i,
};
const MAKE_LABEL: Record<MakeKind, string> = {
  recipe: "Recipe card",
  diy: "Make it",
  playlist: "Side A",
  doodle: "Doodle prompt",
};

/** Which card each item prints on: by its kicker, else the next card not yet used. */
function makeKinds(stories: StoryItem[]): MakeKind[] {
  const used = new Set<MakeKind>();
  const found = stories.map((s) => {
    const k = MAKES.find((m) => !used.has(m) && MAKE_TEST[m].test(s.kicker));
    if (k) used.add(k);
    return k;
  });
  return found.map((k) => {
    if (k) return k;
    const free = MAKES.find((m) => !used.has(m)) ?? "diy";
    used.add(free);
    return free;
  });
}

function MakeCard({ s, p, kind }: { s: StoryItem; p: Parts; kind: MakeKind }) {
  const steps = kind === "recipe" || kind === "diy" || kind === "playlist";
  const [intro, ...rest] = s.body;
  return (
    <article className={`wk-make wk-make--${kind}`}>
      <p className="wk-make-tab">{MAKE_LABEL[kind]}</p>
      {s.images[0] && kind !== "doodle" ? (
        <figure className="wk-make-pic">
          <Pic
            story={s}
            sizes="(max-width: 760px) 90vw, 420px"
            width={800}
            lo={1.4}
            hi={2}
            className="sp-fill"
          />
        </figure>
      ) : null}
      <p className="sp-kick">{s.kicker}</p>
      <h3 className="sp-hed sp-hed--md">
        <Link href={p.href(s.slug)}>{s.headline}</Link>
      </h3>
      {s.dek ? <p className="sp-dek sp-dek--sm">{s.dek}</p> : null}
      {steps && rest.length ? (
        <>
          {intro ? <p className="wk-make-intro">{intro}</p> : null}
          <ol className="wk-make-steps" data-balance="off">
            {rest.map((para, i) => (
              <li key={i}>
                <span className="wk-make-no" aria-hidden>
                  {kind === "playlist" ? `A${i + 1}` : i + 1}
                </span>
                <p>{para}</p>
              </li>
            ))}
          </ol>
        </>
      ) : (
        s.body.map((para, i) => (
          <p key={i} className="wk-make-intro">
            {para}
          </p>
        ))
      )}
      {kind === "doodle" ? (
        <div className="wk-doodle" aria-label="Space to draw">
          <span className="sp-hand">draw it here</span>
        </div>
      ) : null}
    </article>
  );
}

function MakeAndDo({ p, half }: { p: Parts; half: Half }) {
  const items = byOrder(p.stories);
  const kinds = makeKinds(items);
  const el = (s: StoryItem, i: number) => <MakeCard key={s.slug} s={s} p={p} kind={kinds[i]!} />;
  const title = (
    <header className="wk-make-title">
      <h2 className="sp-hand">Things to do with your hands this Sunday</h2>
      <p className="sp-label">Cook one, make one, play one, draw one</p>
    </header>
  );
  if (half === "all")
    return (
      <>
        {title}
        <div className="wk-makes">{items.map(el)}</div>
      </>
    );
  const cut = Math.ceil(items.length / 2);
  return (
    <>
      {half === 0 ? title : null}
      <div className="wk-makes wk-makes--page">
        {(half === 0 ? items.slice(0, cut) : items.slice(cut)).map((s, i) =>
          el(s, i + (half ? cut : 0)),
        )}
      </div>
    </>
  );
}

// ——— Next week ———

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** The seven days after the edition's date. */
function weekAhead(date: string) {
  const start = new Date(`${date}T00:00:00Z`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start.getTime() + (i + 1) * 86_400_000);
    return {
      day: DAYS[d.getUTCDay()]!,
      date: d.getUTCDate(),
      month: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }),
    };
  });
}

/** The day of the week a listing is on, from its kicker or headline. */
function dayOf(s: StoryItem): string | null {
  for (const text of [s.kicker, s.headline, s.dek]) {
    const m = text.match(/\b(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\b/i);
    if (m) return DAYS.find((d) => d.toLowerCase() === m[0].toLowerCase()) ?? null;
  }
  return null;
}

function Listing({ s, p, week }: { s: StoryItem; p: Parts; week: ReturnType<typeof weekAhead> }) {
  const day = dayOf(s);
  const d = day ? week.find((w) => w.day === day) : undefined;
  return (
    <article className="wk-list-item" data-balance="off">
      <p className="wk-list-date" aria-label={d ? `${d.day} ${d.date} ${d.month}` : s.kicker}>
        {d ? (
          <>
            <span>{d.day.slice(0, 3)}</span>
            <b>{d.date}</b>
          </>
        ) : (
          <span className="wk-list-any">{s.kicker}</span>
        )}
      </p>
      <div>
        {d && s.kicker.toLowerCase() !== d.day.toLowerCase() ? (
          <p className="sp-kick">{s.kicker}</p>
        ) : null}
        <h3 className="sp-hed sp-hed--sm">
          <Link href={p.href(s.slug)}>{s.headline}</Link>
        </h3>
        {s.dek ? <p className="sp-dek sp-dek--sm">{s.dek}</p> : null}
        <div className="sp-copy">
          {s.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

function Calendar({ p, half }: { p: Parts; half: Half }) {
  const items = byOrder(p.stories);
  const week = weekAhead(p.date);
  const on = new Set(items.map(dayOf).filter(Boolean));
  const strip = (
    <ol className="wk-week" aria-label="The week ahead" data-balance="off">
      {week.map((w) => (
        <li key={w.day} className={on.has(w.day) ? "wk-week--on" : undefined}>
          <span>{w.day.slice(0, 3)}</span>
          <b>{w.date}</b>
          <small>{w.month}</small>
        </li>
      ))}
    </ol>
  );
  const el = (s: StoryItem) => <Listing key={s.slug} s={s} p={p} week={week} />;
  if (half === "all")
    return (
      <>
        {strip}
        <Columns
          id={`${p.seed}:week`}
          className="wk-listings"
          weights={items.map((s) => weight(s) + 300)}
        >
          {items.map(el)}
        </Columns>
      </>
    );
  const cut = Math.ceil(items.length / 2);
  return (
    <>
      {half === 0 ? strip : null}
      <div className="wk-listings wk-listings--page">
        <Flow id={`${p.seed}:week`} half={half}>
          {(half === 0 ? items.slice(0, cut) : items.slice(cut)).map(el)}
        </Flow>
      </div>
    </>
  );
}

/**
 * A weekend page. `half` sets one page of a spread (0 the left, 1 the right); a single-page design
 * prints it all.
 */
export function Weekend({
  kind,
  edition,
  page,
  reading,
  flavour,
  half = "all",
  className,
}: PageProps & { kind: WeekendKind; flavour: BriefFlavour; half?: Half; className?: string }) {
  const p: Parts = {
    stories: page.stories,
    href: reading.storyHref,
    seed: `${edition.issueNumber}:${page.order}`,
    date: edition.date,
    name: page.section?.name ?? reading.current.label,
  };
  const body =
    kind === "ten" ? (
      <Ten p={p} half={half} />
    ) : kind === "longread" ? (
      <LongRead p={p} half={half} />
    ) : kind === "album" ? (
      <Album p={p} half={half} />
    ) : kind === "fame" ? (
      <Fame p={p} half={half} />
    ) : kind === "makedo" ? (
      <MakeAndDo p={p} half={half} />
    ) : (
      <Calendar p={p} half={half} />
    );
  return (
    <div
      className={`sp wk wk--${kind} sp--${flavour} ${handwriting.variable} ${hand.variable} ${className ?? ""}`}
      data-weekend={kind}
    >
      {body}
    </div>
  );
}

// ——— On the front ———

/** The weekend edition's name, as a flag for the masthead. */
export function EditionFlag({ date, className }: { date: string; className?: string }) {
  const name = editionName(date);
  if (!name) return null;
  return <p className={`wk-flag ${className ?? ""}`}>{name}</p>;
}

/**
 * Sunday's cover line, "The Week in Pictures": a row of the photo album's prints, each taped on,
 * linking to the album's page.
 */
export function WeekInPictures({
  edition,
  reading,
  max = 5,
  className,
}: Pick<PageProps, "edition" | "reading"> & { max?: number; className?: string }) {
  if (weekendDay(edition.date) !== "sunday") return null;
  const album = edition.pages.find((p) => p.section?.slug === "photo-album");
  const pictured = (album?.stories ?? edition.pages.flatMap((p) => p.stories))
    .filter((s) => s.images[0])
    .slice(0, max);
  if (!pictured.length) return null;
  const to = album ? reading.pageFor("photo-album") : null;
  return (
    <section
      className={`wk-wip ${handwriting.variable} ${className ?? ""}`}
      aria-label="The Week in Pictures"
    >
      <header className="wk-wip-head">
        <h2 className="wk-wip-hed">The Week in Pictures</h2>
        {to ? (
          <Link href={to.href} className="wk-wip-to">
            The whole album →
          </Link>
        ) : null}
      </header>
      <ol className="wk-wip-row">
        {pictured.map((s, i) => (
          <li
            key={s.slug}
            style={
              {
                "--tilt": `${clamp(((hash(s.slug) % 7) - 3) * 1.1, -3, 3) || (i % 2 ? 2 : -2)}deg`,
              } as CSSProperties
            }
          >
            <Link href={to?.href ?? reading.storyHref(s.slug)}>
              <span className="wk-wip-pic">
                <Image
                  src={printedPhoto(s.images[0]!.url, 400)}
                  alt={s.images[0]!.alt}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </span>
              <span className="wk-wip-cap">{s.kicker}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
