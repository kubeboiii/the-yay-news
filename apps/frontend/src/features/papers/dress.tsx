import type { StoryItem } from "./types";
import "./brief-art.css";
import "./spreads.css";

// Section dressings: a strip of printed furniture that tells you which page you're on before you
// read a word. Music prints as a gig poster, Screen as a cinema ticket or a video box, Play as a
// cartridge label, Startups as a pitch-deck title slide, Internet as a browser window with a
// notification, sports as the fixtures board, money as a ticker tape, discoveries as a specimen
// label, tech as a spec sheet. Everything on them comes from the page's own stories
// (their kickers, read times) and the edition (issue, date) — never invented figures.

type Props = { slug: string; stories: StoryItem[]; issue: number; page: number; date: string };

const hash = (s: string) =>
  [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
const minutes = (stories: StoryItem[]) => stories.reduce((n, s) => n + s.readMinutes, 0);
const kickers = (stories: StoryItem[]) => [...new Set(stories.map((s) => s.kicker))];

export type DressKind =
  | "gig"
  | "ticket"
  | "vhs"
  | "board"
  | "tape"
  | "cart"
  | "specimen"
  | "spec"
  | "deck"
  | "browser"
  | GuestKind
  | null;

/** Guest sections' dresses: one printed object each, all drawn from one ruled-label template. */
type GuestKind =
  | "almanac"
  | "certificate"
  | "postmark"
  | "dictionary"
  | "menu"
  | "shoebox"
  | "crt"
  | "countdown"
  | "classified"
  | "plate"
  | "live"
  | "pettag"
  | "notice"
  | "report"
  | "badge"
  | "listing";

const GUEST: Record<string, GuestKind> = {
  "time-machine": "almanac",
  "world-records": "certificate",
  postcards: "postmark",
  "word-nerd": "dictionary",
  "food-and-drink": "menu",
  drops: "shoebox",
  nostalgia: "crt",
  "future-stuff": "countdown",
  "letters-and-classifieds": "classified",
  wheels: "plate",
  creators: "live",
  "pets-corner": "pettag",
  "weird-local": "notice",
  "kids-and-schools": "report",
  "weird-jobs": "badge",
  homes: "listing",
  // Weekend sections
  "hall-of-fame": "certificate",
  "next-week": "almanac",
  "make-and-do": "menu",
  "weekend-guide": "notice",
};

export function dressFor(slug: string, stories: StoryItem[], issue: number): DressKind {
  switch (slug) {
    case "music":
      return stories.length ? "gig" : null;
    case "screen":
      return issue % 2 ? "ticket" : "vhs";
    case "startups":
      return "deck";
    case "internet":
      return "browser";
    case "sports":
    case "sports-weekend":
      return "board";
    case "money":
      return "tape";
    case "play":
      return "cart";
    case "discoveries":
      return "specimen";
    case "tech":
      return "spec";
    default:
      return GUEST[slug] ?? null;
  }
}

/** Whether a page carries its dressing today: most days, not every day. */
export const dressed = (slug: string, issue: number, page: number) =>
  hash(`${issue}:${page}:${slug}:dress`) % 4 !== 0;

/**
 * A guest dress's words: a small line above, the big line, and a row of fields. Every value is the
 * page's own (its kickers, headline, story count, read time) or the edition's (issue, page, date).
 */
function guestLabel(
  kind: GuestKind,
  { ks, main, n, mins, issue, page, day, year }: GuestFacts,
): { top: string; title: string; fields: [string, string][] } {
  const rest = ks.slice(1).join(" · ") || main.headline;
  switch (kind) {
    case "almanac":
      return {
        top: `The almanac · ${day} ${year}`,
        title: main.kicker,
        fields: [
          ["Also on this date", rest],
          ["Pages turned back", `${n}`],
        ],
      };
    case "certificate":
      return {
        top: "Official record certificate",
        title: main.kicker,
        fields: [
          ["Awarded", `${day} ${year}`],
          ["Entries", `${n}`],
          ["Certificate", `No. ${issue}.${page}`],
        ],
      };
    case "postmark":
      return {
        top: `Yay Post · ${day} ${year}`,
        title: `Greetings from ${main.kicker}`,
        fields: [
          ["Also stamped", rest],
          ["Postcards", `${n}`],
        ],
      };
    case "dictionary":
      return {
        top: "yay·news (n.)",
        title: main.kicker.toLowerCase(),
        fields: [
          ["See also", rest],
          ["Reading time", `${mins} min`],
        ],
      };
    case "menu":
      return {
        top: "Today’s menu",
        title: main.kicker,
        fields: [
          ["Also serving", rest],
          ["Courses", `${n}`],
          ["Table", `${page}`],
        ],
      };
    case "shoebox":
      return {
        top: "Drop · limited run",
        title: main.kicker,
        fields: [
          ["Style", `No. ${issue}-${page}`],
          ["Pairs in the box", `${n}`],
          ["Released", day],
        ],
      };
    case "crt":
      return {
        top: `C:\\YAY\\ISSUE${issue}>`,
        title: main.kicker,
        fields: [
          ["Files", `${n}`],
          ["Loading", `${mins} min`],
        ],
      };
    case "countdown":
      return {
        top: `Mission ${issue} · T-minus`,
        title: main.kicker,
        fields: [
          ["Payload", rest],
          ["Stages", `${n}`],
          ["Launch", day],
        ],
      };
    case "classified":
      return {
        top: "Classified · box no. " + issue,
        title: main.kicker,
        fields: [
          ["Also listed", rest],
          ["Ads", `${n}`],
        ],
      };
    case "plate":
      return {
        top: "Registered",
        title: `YAY ${issue}·${page}`,
        fields: [
          ["Route", ks.join(" → ")],
          ["Journey", `${mins} min`],
        ],
      };
    case "live":
      return {
        top: "● Live now",
        title: main.kicker,
        fields: [
          ["Up next", rest],
          ["Videos", `${n}`],
        ],
      };
    case "pettag":
      return {
        top: "If found, please return to page " + page,
        title: main.kicker,
        fields: [["Friends", rest]],
      };
    case "notice":
      return {
        top: `Public notice · ${day} ${year}`,
        title: main.kicker,
        fields: [
          ["Also noted", rest],
          ["Items", `${n}`],
          ["Ref.", `${issue}/${page}`],
        ],
      };
    case "report":
      return {
        top: `Report card · ${day}`,
        title: main.kicker,
        fields: [
          ["Also in class", rest],
          ["Gold stars", "★".repeat(Math.min(n, 5))],
        ],
      };
    case "badge":
      return {
        top: "Staff ID · visitor",
        title: main.kicker,
        fields: [
          ["Department", rest],
          ["Badge", `${issue}-${page}`],
        ],
      };
    case "listing":
      return {
        top: "Just listed",
        title: main.kicker,
        fields: [
          ["Rooms", `${n}`],
          ["Features", rest],
          ["Viewing", day],
        ],
      };
  }
}

type GuestFacts = {
  ks: string[];
  main: StoryItem;
  n: number;
  mins: number;
  issue: number;
  page: number;
  day: string;
  year: string;
};

const isGuest = (kind: DressKind): kind is GuestKind =>
  Boolean(kind) && Object.values(GUEST).includes(kind as GuestKind);

export function SectionDress({ slug, stories, issue, page, date }: Props) {
  const kind = dressFor(slug, stories, issue);
  if (!kind || !stories.length) return null;
  const ks = kickers(stories);
  const main = stories[0]!;
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00Z`));
  const body = (() => {
    if (isGuest(kind)) {
      const facts: GuestFacts = {
        ks,
        main,
        n: stories.length,
        mins: minutes(stories),
        issue,
        page,
        day,
        year: date.slice(0, 4),
      };
      const { top, title, fields } = guestLabel(kind, facts);
      return (
        <>
          <p className="dr-g-top">{top}</p>
          <p className="dr-g-title">{title}</p>
          <dl className="dr-g-fields">
            {fields.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </>
      );
    }
    switch (kind) {
      case "gig": {
        const act = main;
        return (
          <>
            <p className="dr-gig-presents">The Yay News presents</p>
            <p className="dr-gig-act">{act.kicker}</p>
            <p className="dr-gig-support">
              with {ks.filter((k) => k !== act.kicker).join(" · ") || "special guests"}
            </p>
            <p className="dr-gig-foot">
              <span>{day}</span>
              <span>Page {page}</span>
              <span>All ages · free entry</span>
            </p>
          </>
        );
      }
      case "ticket":
        return (
          <>
            <p className="dr-ticket-stub">
              <b>Admit one</b>
              <span>No. {String(issue).padStart(4, "0")}</span>
            </p>
            <div className="dr-ticket-main">
              <p className="dr-small">Now showing · Screen {page}</p>
              <p className="dr-ticket-title">{ks.join(" · ")}</p>
              <p className="dr-small">
                {day} · running time {minutes(stories)} min · no trailers
              </p>
            </div>
          </>
        );
      case "vhs":
        return (
          <>
            <span className="dr-vhs-sp">SP</span>
            <p className="dr-vhs-title">{ks.join(" / ")}</p>
            <span className="dr-vhs-run">{minutes(stories)} min</span>
            <span className="dr-vhs-rewind">Be kind, rewind</span>
          </>
        );
      case "board":
        return (
          <>
            <p className="dr-board-head">
              <span>Today&rsquo;s fixtures</span>
              <span>{day}</span>
            </p>
            <ol className="dr-board-rows">
              {stories.map((s, i) => (
                <li key={s.slug}>
                  <span className="dr-board-no">{i + 1}</span>
                  <span className="dr-board-team">{s.kicker}</span>
                  <span className="dr-board-res">W</span>
                </li>
              ))}
            </ol>
          </>
        );
      case "tape": {
        const items = stories.map((s) => (
          <span key={s.slug} className="dr-tape-item">
            {s.kicker.toUpperCase()} <b>&#9650;</b>
          </span>
        ));
        return (
          <p className="dr-tape-run">
            <span className="dr-tape-item">
              YAY <b>&#9650;</b> No.{issue}
            </span>
            {items}
          </p>
        );
      }
      case "cart":
        return (
          <>
            <span className="dr-cart-notch" aria-hidden />
            <p className="dr-cart-label">
              <span className="dr-small">Player 1 · Stage {page}</span>
              <b>{ks.join(" · ")}</b>
            </p>
            <p className="dr-cart-score">
              <span className="dr-small">Hi-score</span>
              <b>{String(issue * 100).padStart(6, "0")}</b>
              <span className="dr-small dr-blink">Press start</span>
            </p>
          </>
        );
      case "deck":
        return (
          <>
            <div className="dr-deck-slide">
              <p className="dr-small">Pitch deck · slide {page}</p>
              <p className="dr-deck-title">{main.kicker}</p>
              <p className="dr-deck-sub">{ks.slice(1).join(" · ") || main.headline}</p>
            </div>
            <dl className="dr-deck-terms">
              <div>
                <dt>Round</dt>
                <dd>Issue {issue}</dd>
              </div>
              <div>
                <dt>Ideas on the table</dt>
                <dd>{stories.length}</dd>
              </div>
              <div>
                <dt>Due diligence</dt>
                <dd>{minutes(stories)} min read</dd>
              </div>
            </dl>
          </>
        );
      case "browser":
        return (
          <>
            <p className="dr-br-bar">
              <span className="dr-br-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span className="dr-br-url">yay.news/issue/{issue}/internet</span>
            </p>
            <p className="dr-br-tabs">
              {ks.map((k) => (
                <span key={k}>{k}</span>
              ))}
            </p>
            <p className="dr-br-note">
              <b>{stories.length} new</b> things worth a look · {day}
            </p>
          </>
        );
      case "specimen":
        return (
          <dl className="dr-spec-grid">
            <div>
              <dt>Specimen no.</dt>
              <dd>
                {issue}.{page}
              </dd>
            </div>
            <div>
              <dt>Classification</dt>
              <dd>{ks.join(", ")}</dd>
            </div>
            <div>
              <dt>Collected</dt>
              <dd>{day}</dd>
            </div>
            <div>
              <dt>Condition</dt>
              <dd>Delightful</dd>
            </div>
          </dl>
        );
      case "spec":
        return (
          <dl className="dr-spec-grid dr-spec-grid--tech">
            <div>
              <dt>Model</dt>
              <dd>Page {page}</dd>
            </div>
            <div>
              <dt>Components</dt>
              <dd>{ks.join(" · ")}</dd>
            </div>
            <div>
              <dt>Runtime</dt>
              <dd>{minutes(stories)} min read</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>All working</dd>
            </div>
          </dl>
        );
    }
  })();
  return (
    <aside
      className={`dr dr--${kind} ${isGuest(kind) ? "dr--guest" : ""}`}
      aria-label="Section"
      data-dress={kind}
    >
      {body}
    </aside>
  );
}
