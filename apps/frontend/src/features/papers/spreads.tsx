import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { handwriting } from "@/features/habits/fonts";
import { hand } from "@/features/play/fonts";
import { Arrow } from "@/features/play/rough";
import { imageAspect, printedPhoto } from "@repo/ui/print/photo";
import { BriefArt, type BriefFlavour, type BriefMeasure, planBriefs } from "./brief-art";
import type { StoryItem } from "./types";
import { weekendKind } from "./weekend-lineup";
import "./spreads.css";

// Special pages. Most days a section page is set on the design's own grid; now and then an art
// director throws the grid away for the day's stories:
//
//   bigpicture — the main photograph across the page, its headline overprinted on a band of ink
//   bigtype    — the opposite: no picture, the headline as big as the words allow
//   scrapbook  — a pin-board: prints taped on, clippings, sticky notes, arrows drawn in pen
//   listicle   — "N things that made us smile": every story numbered big, a picture each
//
// Each design prints them in its own faces and inks (brief-art.css maps them), on one page or
// across the two pages of a spread. Every story is still printed whole, exactly once.

export const SPECIALS = ["bigpicture", "bigtype", "scrapbook", "listicle"] as const;
export type SpecialKind = (typeof SPECIALS)[number];

export type SpecialParts = {
  main: StoryItem;
  more: StoryItem[];
  briefs: StoryItem[];
  href: (slug: string) => string;
  flavour: BriefFlavour;
  /** Stable for the page (issue and page), for the seeded choices inside. */
  seed: string;
};

/** Whether a page's stories can make the special page. */
export function fitsSpecial(kind: SpecialKind, stories: StoryItem[]): boolean {
  const pictured = stories.filter((s) => s.images[0]);
  const main = stories.find((s) => s.slot !== "brief") ?? stories[0];
  switch (kind) {
    case "bigpicture":
      return Boolean(main?.images[0]);
    case "bigtype":
      return Boolean(main);
    case "scrapbook":
      return pictured.length >= 2;
    case "listicle":
      return stories.length >= 3 && pictured.length >= 2;
  }
}

export const hash = (s: string) =>
  [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** A display size in container widths for `text`, by its longest word and its length. */
export function fit(text: string, lines: number, max: number): CSSProperties {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  const c = Math.min(max, 96 / longest, (96 * lines) / Math.max(text.length, 1));
  return { "--c": c.toFixed(3) } as CSSProperties;
}

export function Pic({
  story,
  sizes,
  width,
  lo = 0.75,
  hi = 2,
  className,
}: {
  story: StoryItem;
  sizes: string;
  width: number;
  lo?: number;
  hi?: number;
  className?: string;
}) {
  const image = story.images[0];
  if (!image) return null;
  return (
    <div
      className={`sp-pic ${className ?? ""}`}
      style={{ "--ar": clamp(imageAspect(image.url), lo, hi).toFixed(3) } as CSSProperties}
    >
      <Image
        src={printedPhoto(image.url, width)}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

export function Head({
  story,
  href,
  size,
  dek = true,
}: {
  story: StoryItem;
  href: string;
  size: "xl" | "lg" | "md";
  dek?: boolean;
}) {
  return (
    <>
      <p className="sp-kick">{story.kicker}</p>
      <h3 className={`sp-hed sp-hed--${size}`}>
        <Link href={href}>{story.headline}</Link>
      </h3>
      {dek && story.dek ? <p className="sp-dek">{story.dek}</p> : null}
    </>
  );
}

export function Copy({ story, cols, drop }: { story: StoryItem; cols: 1 | 2 | 3; drop?: boolean }) {
  return (
    <div className={`sp-copy sp-copy--${cols} ${drop ? "sp-drop" : ""}`}>
      {story.body.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

/** A story set whole in the special page's type: picture on top, head, text. */
function Story({
  story,
  href,
  cols = 1,
  photo = true,
  side = false,
}: {
  story: StoryItem;
  href: string;
  cols?: 1 | 2 | 3;
  photo?: boolean;
  /** The picture beside the story rather than over it (a story running the page's width). */
  side?: boolean;
}) {
  if (side && photo && story.images[0])
    return (
      <article className="sp-story sp-story--side">
        <figure className="sp-fig">
          <Pic
            story={story}
            sizes="(max-width: 760px) 100vw, 480px"
            width={1000}
            lo={0.8}
            hi={1.8}
            className="sp-fill"
          />
        </figure>
        <div>
          <Head story={story} href={href} size="md" />
          <Copy story={story} cols={1} />
        </div>
      </article>
    );
  return (
    <article className="sp-story">
      {photo ? (
        <figure className="sp-fig">
          <Pic story={story} sizes="(max-width: 760px) 100vw, 520px" width={1000} lo={1.1} />
        </figure>
      ) : null}
      <Head story={story} href={href} size="md" />
      <Copy story={story} cols={cols} />
    </article>
  );
}

function Briefs({
  stories,
  p,
  measure,
}: {
  stories: StoryItem[];
  p: SpecialParts;
  measure: BriefMeasure;
}) {
  if (!stories.length) return null;
  const plan = planBriefs(stories, { measure, flavour: p.flavour, seed: `${p.seed}:sp` });
  return (
    <section className={`sp-briefs sp-briefs--${measure}`} aria-label="In brief">
      <h2 className="sp-label">In brief</h2>
      <div className="sp-briefs-list" style={{ "--n": stories.length } as CSSProperties}>
        {stories.map((s, i) => (
          <article key={s.slug} className="sp-brief" data-art={plan.arts[i]}>
            <BriefArt story={s} art={plan.arts[i]!} kicker={<p className="sp-kick">{s.kicker}</p>}>
              <h3 className="sp-hed sp-hed--sm">
                <Link href={p.href(s.slug)}>{s.headline}</Link>
              </h3>
            </BriefArt>
            {s.dek ? <p className="sp-dek sp-dek--sm">{s.dek}</p> : null}
            <Copy story={s} cols={1} />
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * The pieces a spread shares between its two pages. Each page's share is set from the weights;
 * the balancer (balance.tsx) then moves pieces across the fold, keeping their order, until the two
 * pages end level.
 */
export function Flow({ id, half, children }: { id: string; half: 0 | 1; children: ReactNode }) {
  return (
    <div className="sp-flow" data-sp-flow={id} data-half={half}>
      {children}
    </div>
  );
}

/** The rest of a spread after a big opening: the further stories and the briefs, as pieces. */
function RestPieces({ p, half }: { p: SpecialParts; half: 0 | 1 }) {
  return (
    <Flow id={`${p.seed}:rest`} half={half}>
      {half === 1
        ? [
            ...p.more.map((s) => <Story key={s.slug} story={s} href={p.href(s.slug)} />),
            p.briefs.length ? (
              <Briefs key="briefs" stories={p.briefs} p={p} measure="narrow" />
            ) : null,
          ]
        : null}
    </Flow>
  );
}

/** The rest of the page after a big opening: further stories, then the briefs. */
function Rest({ p, side }: { p: SpecialParts; side: boolean }) {
  const { more, briefs } = p;
  const stories = more.length ? (
    <div className={more.length > 1 ? "sp-more sp-more--grid" : "sp-more"}>
      {more.map((s) => (
        <Story
          key={s.slug}
          story={s}
          href={p.href(s.slug)}
          cols={more.length > 1 || side ? 1 : 2}
          side={more.length === 1 && !side}
        />
      ))}
    </div>
  ) : null;
  if (side && more.length && briefs.length) {
    return (
      <div className="sp-foot">
        <div>{stories}</div>
        <Briefs stories={briefs} p={p} measure="narrow" />
      </div>
    );
  }
  return (
    <>
      {stories}
      <Briefs stories={briefs} p={p} measure="wide" />
    </>
  );
}

/**
 * How much a story fills, roughly, in characters of text: its head, its words (set in `cols`
 * columns) and its picture at its own shape across the column.
 */
export const weight = (s: StoryItem, cols = 1) =>
  s.headline.length * 2 +
  s.dek.length +
  s.body.join(" ").length / cols +
  (s.images[0] ? 1150 / clamp(imageAspect(s.images[0].url), 0.8, 2) : 0);

/**
 * Two columns of whole pieces, split where they come out nearest level (the order kept: the
 * first column reads down, then the second); the balancer levels what's left.
 */
export function Columns({
  id,
  children,
  weights,
  className,
}: {
  id: string;
  children: ReactNode[];
  weights: number[];
  className: string;
}) {
  const total = weights.reduce((n, w) => n + w, 0);
  let best = 1;
  let diff = Infinity;
  let run = 0;
  for (let i = 0; i < weights.length - 1; i++) {
    run += weights[i]!;
    const d = Math.abs(total - 2 * run);
    if (d < diff) {
      diff = d;
      best = i + 1;
    }
  }
  if (children.length < 2) return <div className={className}>{children}</div>;
  return (
    <div className={`sp-cols ${className}`} data-balance-span="0.2">
      <div className="sp-col" data-sp-flow={id} data-half={0}>
        {children.slice(0, best)}
      </div>
      <div className="sp-col" data-sp-flow={id} data-half={1}>
        {children.slice(best)}
      </div>
    </div>
  );
}

// ——— The four pages ———

function BigPicture({ p, half }: { p: SpecialParts; half: 0 | 1 | "all" }) {
  const s = p.main;
  const open = (
    <>
      <figure className="sp-bleed">
        <Pic
          story={s}
          sizes="(max-width: 760px) 100vw, 1100px"
          width={1800}
          lo={1.25}
          hi={2.1}
          className="sp-fill"
        />
      </figure>
      <header className="sp-over">
        <p className="sp-kick">{s.kicker}</p>
        <h2 className="sp-over-hed" style={fit(s.headline, 3, 9)}>
          <Link href={p.href(s.slug)}>{s.headline}</Link>
        </h2>
      </header>
      {s.images[0]?.alt ? <p className="sp-cap">{s.images[0].alt}</p> : null}
      <p className="sp-dek sp-dek--big">{s.dek}</p>
      <Copy story={s} cols={3} drop />
    </>
  );
  if (half !== "all")
    return (
      <>
        {half === 0 ? open : null}
        <RestPieces p={p} half={half} />
      </>
    );
  return (
    <>
      {open}
      <hr className="sp-rule" />
      <Rest p={p} side={false} />
    </>
  );
}

function BigType({ p, half }: { p: SpecialParts; half: 0 | 1 | "all" }) {
  const s = p.main;
  const open = (
    <>
      <header className="sp-type">
        <p className="sp-kick sp-kick--rule">{s.kicker}</p>
        <h2 className="sp-type-hed" style={fit(s.headline, 4, 16)}>
          <Link href={p.href(s.slug)}>{s.headline}</Link>
        </h2>
        <p className="sp-dek sp-dek--big">{s.dek}</p>
      </header>
      <Copy story={s} cols={3} drop />
    </>
  );
  if (half !== "all")
    return (
      <>
        {half === 0 ? open : null}
        <RestPieces p={p} half={half} />
      </>
    );
  return (
    <>
      {open}
      <hr className="sp-rule" />
      <Rest p={p} side />
    </>
  );
}

const NOTES = ["look!", "this one", "aww", "best bit", "yes!!", "keep", "ha!", "saw this"];

/** A clipping pinned to the board, its print taped on beside it and an arrow drawn between. */
function Scrap({ s, p, big, i }: { s: StoryItem; p: SpecialParts; big?: boolean; i: number }) {
  const seed = hash(`${p.seed}:${s.slug}`);
  const tilt = ((seed % 7) - 3) * 0.7;
  const note = NOTES[seed % NOTES.length]!;
  return (
    <article
      className={`sp-scrap ${big ? "sp-scrap--big" : ""}`}
      style={{ "--tilt": `${tilt}deg` } as CSSProperties}
    >
      {s.images[0] ? (
        <div
          data-balance-span="0.3"
          className={`sp-scrap-top ${i % 2 ? "sp-scrap-top--flip" : ""}`}
        >
          <figure className="sp-polaroid">
            <span className="sp-tape" aria-hidden />
            <Pic
              story={s}
              sizes="(max-width: 760px) 80vw, 420px"
              width={900}
              lo={0.8}
              hi={1.6}
              className="sp-fill"
            />
            <figcaption className="sp-hand sp-polaroid-cap">{s.kicker}</figcaption>
          </figure>
          <div className="sp-scrap-head">
            <p className="sp-hand sp-note" aria-hidden>
              {note}
              <Arrow
                seed={seed}
                viewBox="0 0 120 60"
                points={
                  i % 2
                    ? [
                        [110, 10],
                        [70, 30],
                        [14, 40],
                      ]
                    : [
                        [10, 10],
                        [50, 32],
                        [106, 40],
                      ]
                }
                className="sp-arrow"
              />
            </p>
            <Head story={s} href={p.href(s.slug)} size={big ? "lg" : "md"} />
          </div>
        </div>
      ) : (
        <Head story={s} href={p.href(s.slug)} size={big ? "lg" : "md"} />
      )}
      <Copy story={s} cols={big ? 2 : 1} />
    </article>
  );
}

function Sticky({ s, p, i }: { s: StoryItem; p: SpecialParts; i: number }) {
  const tilt = ((hash(`${p.seed}:${s.slug}`) % 5) - 2) * 0.9;
  return (
    <article
      className={`sp-sticky sp-sticky--${i % 3}`}
      style={{ "--tilt": `${tilt}deg` } as CSSProperties}
    >
      <BriefArt
        story={s}
        art={s.images[0] ? (i % 2 ? "taped" : "top") : "plain"}
        kicker={<p className="sp-kick">{s.kicker}</p>}
      >
        <h3 className="sp-hand sp-sticky-hed">
          <Link href={p.href(s.slug)}>{s.headline}</Link>
        </h3>
      </BriefArt>
      <Copy story={s} cols={1} />
    </article>
  );
}

function Scrapbook({ p, half }: { p: SpecialParts; half: 0 | 1 | "all" }) {
  const title = (
    <header className="sp-board-title">
      <h2 className="sp-hand">Pinned up today</h2>
      <p className="sp-label">Everything on the board, in full</p>
    </header>
  );
  const pieces = [
    ...p.more.map((s, i) => ({
      s,
      w: weight(s),
      el: <Scrap key={s.slug} s={s} p={p} i={i + 1} />,
    })),
    ...p.briefs.map((s, i) => ({ s, w: weight(s), el: <Sticky key={s.slug} s={s} p={p} i={i} /> })),
  ];
  const main = <Scrap s={p.main} p={p} big i={0} />;
  if (half === "all")
    return (
      <>
        {title}
        {main}
        <Columns id={`${p.seed}:cols`} className="sp-board" weights={pieces.map((x) => x.w)}>
          {pieces.map((x) => x.el)}
        </Columns>
      </>
    );
  // Across a spread, each page of the pair a single column of the board: the heaviest pieces go
  // first, each to the lighter page (the left carries the main clipping), so the pages end level.
  const side = new Map<string, 0 | 1>();
  const load = [weight(p.main, 2) * 0.8 + 500, 0];
  for (const x of [...pieces].sort((a, b) => b.w - a.w)) {
    const to = load[0]! <= load[1]! ? 0 : 1;
    side.set(x.s.slug, to);
    load[to]! += x.w;
  }
  if (![...side.values()].includes(1) && pieces.length) side.set(pieces.at(-1)!.s.slug, 1);
  const mine = pieces.filter((x) => side.get(x.s.slug) === half);
  return (
    <>
      {half === 0 ? title : null}
      {half === 0 ? main : null}
      <div className="sp-board sp-board--page">
        <Flow id={`${p.seed}:board`} half={half}>
          {mine.map((x) => x.el)}
        </Flow>
      </div>
    </>
  );
}

/**
 * Where to part a spread's pieces: the left page carries the opening (weighing `first`) and as many
 * of the pieces, in order, as leave the two pages nearest level.
 */
function halves(first: number, weights: number[]): number {
  const total = first + weights.reduce((n, w) => n + w, 0);
  let left = first;
  let best = 0;
  let diff = Math.abs(total - 2 * left);
  weights.forEach((w, i) => {
    left += w;
    const d = Math.abs(total - 2 * left);
    if (d < diff) {
      diff = d;
      best = i + 1;
    }
  });
  // The right page always carries something.
  return Math.min(best, Math.max(0, weights.length - 1));
}

const NUMBERS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

function Item({ s, n, p }: { s: StoryItem; n: number; p: SpecialParts }) {
  return (
    <article className="sp-item">
      <header className="sp-item-top">
        <span className="sp-num" aria-hidden>
          {n}
        </span>
        {s.images[0] ? (
          <figure className="sp-fig">
            <Pic
              story={s}
              sizes="(max-width: 760px) 100vw, 520px"
              width={1000}
              lo={1}
              hi={1.9}
              className="sp-fill"
            />
          </figure>
        ) : null}
        <Head story={s} href={p.href(s.slug)} size="md" />
      </header>
      <Copy story={s} cols={1} />
    </article>
  );
}

function Listicle({ p, half }: { p: SpecialParts; half: 0 | 1 | "all" }) {
  const all = [p.main, ...p.more, ...p.briefs];
  const n = all.length;
  const cut = 1 + halves(weight(all[0]!) + 400, all.slice(1).map(weight));
  const title = (
    <header className="sp-list-title">
      <span className="sp-list-n" aria-hidden>
        {n}
      </span>
      <h2
        className="sp-list-hed"
        style={fit(`${NUMBERS[n - 1] ?? n} things that made us smile`, 2, 11)}
      >
        {NUMBERS[n - 1] ?? n} things that made us smile
        <span className="sp-hand sp-list-note"> (we counted)</span>
      </h2>
    </header>
  );
  const items = (list: StoryItem[], from: number) =>
    half === "all" ? (
      <Columns id={`${p.seed}:cols`} className="sp-list" weights={list.map(weight)}>
        {list.map((s, i) => (
          <Item key={s.slug} s={s} n={from + i + 1} p={p} />
        ))}
      </Columns>
    ) : (
      <div className="sp-list sp-list--page">
        <Flow id={`${p.seed}:list`} half={from ? 1 : 0}>
          {list.map((s, i) => (
            <Item key={s.slug} s={s} n={from + i + 1} p={p} />
          ))}
        </Flow>
      </div>
    );
  if (half === 0)
    return (
      <>
        {title}
        {items(all.slice(0, cut), 0)}
      </>
    );
  if (half === 1) return items(all.slice(cut), cut);
  return (
    <>
      {title}
      {items(all, 0)}
    </>
  );
}

/**
 * A special page. `half` sets one page of a spread (0 the left, 1 the right); a single-page design
 * prints it all.
 */
export function Special({
  kind,
  parts,
  half = "all",
  className,
}: {
  kind: SpecialKind;
  parts: SpecialParts;
  half?: 0 | 1 | "all";
  className?: string;
}) {
  const body =
    kind === "bigpicture" ? (
      <BigPicture p={parts} half={half} />
    ) : kind === "bigtype" ? (
      <BigType p={parts} half={half} />
    ) : kind === "scrapbook" ? (
      <Scrapbook p={parts} half={half} />
    ) : (
      <Listicle p={parts} half={half} />
    );
  return (
    <div
      className={`sp sp--${kind} sp--${parts.flavour} ${handwriting.variable} ${hand.variable} ${className ?? ""}`}
      data-special={kind}
    >
      {body}
    </div>
  );
}

// ——— Choosing a special page ———

/**
 * Which pages of an edition go special, for the designs that keep their own grid most days: at
 * most two pages an edition, each a different kind, chosen by a seed from the issue so the same
 * edition always prints the same way; `prefer` is the kind that suits the design best.
 */
export function specialPages<
  P extends {
    order: number;
    layout: string;
    section?: { slug: string } | null;
    stories: StoryItem[];
  },
>(issue: number, pages: P[], prefer?: SpecialKind, rate = 3): Map<number, SpecialKind> {
  const out = new Map<number, SpecialKind>();
  const used = new Set<SpecialKind>();
  // The weekend's own pages (the long reads, the album…) already have a shape of their own.
  const inside = pages
    .filter((p) => p.layout === "section" && !weekendKind(p.section?.slug))
    .sort((a, b) => a.order - b.order);
  for (const p of inside) {
    if (out.size >= 2) break;
    const h = hash(`${issue}:${p.order}:${p.section?.slug ?? ""}:special`);
    if (h % rate !== 0) continue;
    const start = (h >>> 4) % SPECIALS.length;
    const turn = [...SPECIALS.slice(start), ...SPECIALS.slice(0, start)];
    // The design's own favourite comes first, once an edition (a zine's scrapbook, say).
    const order = prefer && !used.size ? [prefer, ...turn.filter((k) => k !== prefer)] : turn;
    const pick = order.find((k) => !used.has(k) && fitsSpecial(k, p.stories));
    if (!pick) continue;
    used.add(pick);
    out.set(p.order, pick);
  }
  return out;
}

/** A page's stories as a special page takes them: the main story, the rest, the briefs. */
export function specialParts(
  stories: StoryItem[],
  href: (slug: string) => string,
  flavour: BriefFlavour,
  seed: string,
): SpecialParts | null {
  const rank = { lead: 0, feature: 1, brief: 2 } as const;
  const sorted = [...stories].sort((a, b) => rank[a.slot] - rank[b.slot] || a.order - b.order);
  const long = sorted.filter((s) => s.slot !== "brief");
  const briefs = sorted.filter((s) => s.slot === "brief");
  const [main, ...more] = long.length ? long : briefs;
  if (!main) return null;
  return { main, more, briefs: long.length ? briefs : briefs.slice(1), href, flavour, seed };
}
