import type { Edition, StoryItem } from "@repo/shared";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { PageProps, Reading } from "../types";
import { StoryBlock, type HeadSize, type StoryVariant } from "./blocks";
import { frontComposition, storyMM, type FrontComposition } from "./compose";
import { Folio, Page, RunningHead, Spread, Zig } from "./parts";
import {
  byOrder,
  feature,
  fitSize,
  folios,
  longDate,
  pad2,
  shortDate,
  teaseFor,
  weekday,
  type Ground,
} from "./text";

/*
 * The front route prints the first spread (mini pages 1 and 2): the masthead, the edition's facts
 * (Vol. · No., date, weather, number of the day), the lead and the two other front stories — each in
 * full — and the one "Inside today" index. Three compositions rotate by issue (compose.ts), so
 * consecutive days never share a front:
 *
 *   cover  — the tall stacked wood-type masthead on page 1; the lead under a taped print on page 2
 *   banner — a one-line masthead with the lead beneath it (picture after its opening paragraph)
 *            on page 1; a boxed story, a floated one and a stepped index on page 2
 *   poster — a one-line masthead with the stepped index on page 1; the lead on page 2 under a
 *            big two-line head, its print floated into the text
 *
 * Every story prints in full; the other stories and the index go to whichever page is shorter.
 */

type Block = { key: string; mm: number; node: ReactNode };

export function Front({ edition, page, reading }: PageProps) {
  const [lead, a, b, ...more] = byOrder(page.stories);
  const comp = frontComposition(edition);
  const date = shortDate(edition.date);
  const [lf, rf] = folios(reading, page.order);
  const next = reading.next ? { ...reading.next, n: folios(reading, reading.next.order)[0] } : null;
  const href = reading.storyHref;
  const indexRows = Math.ceil(reading.pages.filter((p) => p.slug !== "").length / 2);

  const story = (
    s: StoryItem | undefined,
    variant: StoryVariant,
    size: HeadSize,
    extra: Partial<Parameters<typeof StoryBlock>[0]> = {},
  ): Block[] =>
    s
      ? [
          {
            key: s.slug,
            mm:
              storyMM(
                { ...s, body: extra.cut ? s.body.slice(0, extra.cut) : s.body },
                variant,
                size,
              ) + 10,
            node: (
              <StoryBlock
                key={s.slug}
                story={s}
                href={href(s.slug)}
                variant={variant}
                size={size}
                className="zc-second"
                {...extra}
              />
            ),
          },
        ]
      : [];
  const index = (variant: "stair" | "list"): Block[] => [
    {
      key: "index",
      mm: variant === "list" ? 16 + indexRows * 15 : 16 + Math.ceil(indexRows / 2) * 40,
      node: <Index key="index" edition={edition} reading={reading} variant={variant} />,
    },
  ];
  const fixed = (key: string, mm: number, node: ReactNode): Block[] => [{ key, mm, node }];
  const others = more.flatMap((s) => story(s, "float", "s"));

  // Each composition fixes the masthead and the lead; the rest go to whichever page is shorter.
  const plan: Record<
    FrontComposition,
    { grounds: [Ground, Ground]; left: Block[]; right: Block[]; movable: Block[]; cover?: boolean }
  > = {
    cover: {
      grounds: ["mint", "pink"],
      cover: true,
      left: fixed(
        "mast",
        170,
        <Fragment key="mast">
          <div className="z-cover__top">
            <Stamp edition={edition} />
            <Spec edition={edition} />
          </div>
          <Masthead stack />
        </Fragment>,
      ),
      right: story(lead, "top", "l", { dots: true, priority: true, className: "zc-lead" }),
      movable: [
        ...story(b, "float", "s", { side: "left" }),
        ...story(a, "float", "s"),
        ...others,
        ...index("list"),
      ],
    },
    banner: {
      grounds: ["peach", "lilac"],
      left: [
        ...fixed(
          "mast",
          90,
          <Fragment key="mast">
            <Masthead />
            <Spec edition={edition} strip />
          </Fragment>,
        ),
        ...story(lead, "after1", "xl", { priority: true, className: "zc-lead" }),
      ],
      right: [],
      movable: [
        ...story(a, "boxed", "m", { side: "right" }),
        ...story(b, "float", "m", { side: "left" }),
        ...others,
        ...index("stair"),
      ],
    },
    poster: {
      grounds: ["butter", "blue"],
      left: fixed(
        "mast",
        90,
        <Fragment key="mast">
          <Masthead />
          <Spec edition={edition} strip />
        </Fragment>,
      ),
      right: story(lead, "float", "xl", {
        side: "left",
        dots: true,
        priority: true,
        className: "zc-lead",
      }),
      movable: [
        ...index("stair"),
        ...story(a, "top", "m", { side: "left" }),
        ...story(b, "float", "s"),
        ...others,
      ],
    },
  };
  const p = plan[comp];
  const left = [...p.left];
  const right = [...p.right];
  const load = (xs: Block[]) => xs.reduce((n, x) => n + x.mm, 0);
  for (const blk of p.movable) (load(left) <= load(right) ? left : right).push(blk);

  return (
    <Spread label="Front page spread">
      <Page
        ground={p.grounds[0]}
        side="left"
        className={`zc-page ${p.cover ? "z-cover" : ""}`}
        composition={comp}
      >
        {left.map((x) => x.node)}
        <Folio n={lf} date={date} />
      </Page>
      <Page ground={p.grounds[1]} side="right" className="zc-page">
        <RunningHead>The Yay Zine · No. {edition.issueNumber}</RunningHead>
        {right.map((x) => x.node)}
        <Folio n={rf} date={date} next={next} />
      </Page>
    </Spread>
  );
}

function Stamp({ edition }: { edition: Edition }) {
  const day = weekday(edition.date);
  return (
    <p className="z-stamp print-worn z-cover__stamp">
      {edition.kind === "slow_news_day"
        ? "Slow news day"
        : day === "Saturday" || day === "Sunday"
          ? "Weekend edition"
          : `${day} edition`}
    </p>
  );
}

/** The masthead: the tall stacked wood type (the cover) or one line across the page. */
function Masthead({ stack }: { stack?: boolean }) {
  if (stack) {
    return (
      <div className="z-cover__stack">
        {/* The extrusion is a second impression under the letters, and it is the one that wore. */}
        <p className="z-cover__title z-cover__title--shade print-worn" aria-hidden>
          <span className="z-cover__the">The</span>
          <span className="z-cover__yay">Yay</span>
          <span className="z-cover__news">News</span>
        </p>
        <h1 className="z-cover__title z-cover__title--ink">
          <span className="z-cover__the">The</span>
          <span className="z-cover__yay">Yay</span>
          <span className="z-cover__news">News</span>
        </h1>
        <p className="z-cover__tag zf-tag">Only good news. Mostly fun. Occasionally weird.</p>
      </div>
    );
  }
  return (
    <div className="zf-mast">
      <p className="zf-mast__line zf-mast__line--shade print-worn" aria-hidden>
        The Yay News
      </p>
      <h1 className="zf-mast__line">The Yay News</h1>
      <p className="zf-mast__meta">Only good news. Mostly fun. Occasionally weird.</p>
    </div>
  );
}

/** The edition's facts: the mockup's spec table, or the same facts as a strip under a banner. */
function Spec({ edition, strip }: { edition: Edition; strip?: boolean }) {
  const number = feature(edition, "number_of_day");
  const weather = feature(edition, "weather");
  return (
    <div className={`z-spec ${strip ? "zf-spec--strip" : ""}`}>
      <div>
        {strip ? null : (
          <p className="z-spec__name">
            <b>ZINE</b>
            <span>
              170mm ×<br />
              250mm
            </span>
          </p>
        )}
        <dl>
          <dt>Vol. · No.</dt>
          <dd>
            Vol. {edition.volume} · No. {edition.issueNumber}
          </dd>
          <dt>Date</dt>
          <dd>
            <time dateTime={edition.date}>{longDate(edition.date)}</time>
          </dd>
          {weather ? (
            <>
              <dt>Weather</dt>
              <dd>{weather.content.headline}</dd>
            </>
          ) : null}
        </dl>
        {weather ? <p className="zf-weather">{weather.content.detail}</p> : null}
      </div>
      {number ? (
        <div className="z-spec__num">
          <b
            className="print-misreg"
            style={{
              ["--misreg" as string]: "var(--rose)",
              ["--nb" as string]: fitSize(number.content.value, 32, strip ? 9 : 7.6, 4.2),
            }}
          >
            {number.content.value}
          </b>
          <span>Number of the day: {number.content.caption}</span>
        </div>
      ) : null}
    </div>
  );
}

/** The one "Inside today" index: every page, its number and its main headline. */
function Index({
  edition,
  reading,
  variant,
}: {
  edition: Edition;
  reading: Reading;
  variant: "stair" | "list";
}) {
  const contents = reading.pages.filter((p) => p.slug !== "");
  return (
    <nav
      className={`z-contents zf-contents zf-contents--${variant} ${variant === "stair" && contents.length > 8 ? "zf-contents--5" : ""}`}
      aria-labelledby="inside-today"
    >
      <div className="z-contents__title">
        <h2 className="z-label" id="inside-today">
          Inside today
        </h2>
        <Zig />
      </div>
      <ol>
        {contents.map((c) => {
          const [n] = folios(reading, c.order);
          return (
            <li key={c.order}>
              <Link href={c.href} className="z-link-block">
                <span className="z-contents__n" aria-hidden>
                  {pad2(n)}
                </span>
                <span className="z-contents__sec z-h3">
                  <span className="z-sr">Page {n}: </span>
                  {c.label}
                </span>
                <span className="z-contents__tease">{teaseFor(edition, c.order)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
