"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useHabitLog, useHabitsReady, useStamps, useStreak } from "@/features/habits/api";
import { addDays, pagesRead, solvedByIssue } from "@/features/habits/core";
import {
  GAP,
  GoButton,
  Mascot,
  MASCOT_NAME,
  Misprint,
  Poster,
  RansomHeading,
  Receipt,
  RubberStamp,
  Scrap,
  Sticker,
  TearTabs,
} from "@/features/riot";
import { InstallAsk } from "./install-ask";

// What sits above today's front page, depending on the time and on what the reader has done
// (Direction B, "Riso Zine Riot", built from the riot kit):
//   · before 07:00, the NOT YET poster: today's paper is still on the press, a countdown, and
//     yesterday's paper underneath; Odin asleep on the bundles;
//   · once today's paper is finished, the wheatpasted THAT'S TODAY poster with the reader's run,
//     and the Proof of Yay receipt with tear-off tabs to pass it on;
//   · on a first visit, a note taped to the paper saying what this is;
//   · halfway through, a sticker back to the next page to read.
// The paper itself is always there underneath (#paper), so nothing is ever locked away.

export type HeroPage = { order: number; label: string; href: string; colour: string };

type Props = {
  issue: number;
  /** The served edition's date, YYYY-MM-DD. */
  date: string;
  pages: HeroPage[];
  /** A word or two per page for the receipt, from the day's kickers. */
  tags: string[];
  /** Minutes until 07:00 while today's paper is still on the press; null once it has landed. */
  pressIn: number | null;
  /** The served paper's date, for "Read yesterday's". */
  servedShort: string;
};

const WELCOMED = "yn-welcomed";
const SHORT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const shortDate = (d: string) => SHORT.format(new Date(`${d}T00:00:00Z`));

function readFlag(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeFlag(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked: the note shows again next time, which is fine */
  }
}

function useCountdown(minutes: number | null) {
  const router = useRouter();
  const [left, setLeft] = useState(minutes === null ? null : minutes * 60);
  useEffect(() => {
    if (minutes === null) return;
    const until = Date.now() + minutes * 60_000;
    const tick = () => {
      const s = Math.max(0, Math.round((until - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) router.refresh();
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [minutes, router]);
  return left;
}

function OnThePress({ issue, pressIn, servedShort, tags }: Props) {
  const left = useCountdown(pressIn) ?? 0;
  const h = Math.floor(left / 3600);
  const m = Math.ceil((left % 3600) / 60);
  const wait = h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m} min`;
  return (
    <div className="ys-page ys-page--hero">
      <Poster
        seed="shutter"
        paste={false}
        edge="torn"
        sides={["bottom"]}
        screen={{ fade: "corner", density: 0.6, area: "0 0 0 52%", w: 640, h: 700 }}
        className="sb-shut"
        aria-labelledby="sh-h"
      >
        <div className="sb-shut__type">
          <RansomHeading
            text="NOT YET"
            seed="notyet"
            as="h1"
            className="sb-shut__h"
            cuts={[
              { ch: "N", from: "slab", size: 1.16, lift: -0.03 },
              { ch: "O", from: "didone", size: 0.9, lift: 0.1, tuck: 0.05, turn: 3 },
              { ch: "T", from: "gothic", size: 1.04, tuck: 0.03, ground: "ink" },
              GAP,
              { ch: "YE", from: "roman", size: 1.04, turn: -2 },
              { ch: "T", from: "slab", size: 0.9, lift: 0.08, tuck: 0.04, turn: 2.5 },
            ]}
          />
          <p className="sb-shut__sub" id="sh-h">
            No. {issue + 1} is still on the press.
          </p>
          <p className="sb-shut__count" role="timer" aria-live="off">
            <Misprint className="sb-shut__n" offset={[3, 2]}>
              {wait}
            </Misprint>
            <span className="sb-shut__l">until it lands, 7:00 sharp</span>
          </p>
          <div className="sb-shut__cta">
            <GoButton href="#paper" sub={`No. ${issue} · ${servedShort}`}>
              Read yesterday&rsquo;s
            </GoButton>
          </div>
        </div>
        {tags[0] ? (
          <Sticker seed="tomorrow" ground="paper" pinned className="sb-shut__sticker">
            Yesterday&rsquo;s had {tags[0].toLowerCase()}
          </Sticker>
        ) : null}
      </Poster>
      <div className="sb-shut__odin">
        <Mascot pose="asleep" label="" />
        <Scrap seed="zzz" ground="white" tape="top" className="sb-shut__caption">
          {MASCOT_NAME}&rsquo;s asleep on the bundles for No. {issue + 1}. Back at 7.
        </Scrap>
      </div>
    </div>
  );
}

function localTime(at: string) {
  return new Date(at).toTimeString().slice(0, 5);
}

function Closed({ issue, date, pages, tags }: Props) {
  const events = useHabitLog();
  const streak = useStreak();
  const stamps = useStamps();
  const read = useMemo(() => pagesRead(events, issue), [events, issue]);
  const finished = events.find((e) => e.type === "edition_finished" && e.issue === issue);
  const total = finished?.type === "edition_finished" ? (finished.puzzles ?? 0) : 0;
  const solved = Math.min(solvedByIssue(events).get(issue)?.size ?? 0, total);
  const kept = events.filter((e) => e.type === "story_saved" && e.issue === issue).length;
  const run = streak?.current ?? 0;
  const best = streak?.best ?? run;
  const [msg, setMsg] = useState<string | null>(null);

  const url = () => `${window.location.origin}/issue/${issue}`;
  const receiptText = () =>
    [
      `THE YAY NEWS  No. ${issue}`,
      `${pages.map((p) => (read.has(p.order) ? "🟨" : "⬜")).join("")} ${read.size}/${pages.length} pages`,
      ...(total ? [`🧩 ${solved}/${total} puzzles`] : []),
      ...(run ? [`${run}-day run`] : []),
      tags.slice(0, 3).join(" · ").toUpperCase(),
      url(),
    ].join("\n");
  const pass = async (text: string, done: string) => {
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setMsg(done);
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setMsg("Couldn't do that. Try again?");
    }
  };

  return (
    <div className="ys-page ys-page--hero">
      <div className="sb-done">
        <Poster
          seed="done"
          screen={{ fade: "corner", density: 0.55, area: "0 0 40% 50%", w: 440, h: 360 }}
          className="sb-paste"
          aria-labelledby="done-h"
        >
          <RansomHeading
            text="THAT'S TODAY"
            seed="done"
            as="h1"
            className="sb-paste__h"
            cuts={[
              { ch: "TH", from: "gothic", size: 1.12 },
              { ch: "A", from: "didone", size: 0.94, lift: 0.08, tuck: 0.04, turn: -3 },
              { ch: "T'S", from: "slab", size: 0.98, tuck: 0.03, lift: -0.02 },
              GAP,
              { ch: "T", from: "roman", size: 1.06, turn: 2 },
              { ch: "O", from: "slab", size: 0.9, tuck: 0.05, lift: 0.1, ground: "ink" },
              { ch: "DAY", from: "gothic", size: 1.14, tuck: 0.02, turn: -1 },
            ]}
          />
          <p className="sb-paste__line" id="done-h">
            Cover to cover. No. {issue + 1} lands {shortDate(addDays(date, 1))} at 7.
          </p>
          {run ? (
            <p className="sb-paste__run">
              <Misprint className="sb-paste__n">{run}</Misprint>
              <span className="sb-paste__l">
                {run === 1 ? "day" : "days"} running. Your best is {best}
                {run >= best ? ", and this is it." : "."}
              </span>
            </p>
          ) : null}
          <div className="sb-paste__cta">
            <GoButton href="/wall" sub="stamps, clippings, cards">
              Your wall
            </GoButton>
            <GoButton tone="quiet" href="/pile">
              Dig in the pile
            </GoButton>
          </div>
          <RubberStamp seed="done-stamp" tilt={-12} className="sb-paste__stamp">
            Read
          </RubberStamp>
          <Mascot
            pose="on-pile"
            className="sb-paste__odin"
            label={`${MASCOT_NAME} the husky, sitting on today's finished paper`}
          />
        </Poster>

        <div className="ys-done__side">
          <Receipt
            className="sb-receipt"
            headingId="proof-h"
            issue={issue}
            date={date}
            stampedAt={finished ? localTime(finished.at) : undefined}
            pageSquares={pages.map((p) => ({ colour: p.colour, read: read.has(p.order) }))}
            puzzles={{ solved, total }}
            streak={run}
            tags={tags}
            lines={[
              ...(kept
                ? [{ label: "kept", value: `${kept} ${kept === 1 ? "story" : "stories"}` }]
                : []),
              { label: "stamps", value: String(stamps.length) },
            ]}
            total="Bad news: 0"
          >
            <TearTabs
              prompt="Pass it on: take one"
              tabs={[
                {
                  label: "Share the receipt",
                  onSelect: () =>
                    pass(receiptText(), "Receipt copied. Paste it in the group chat."),
                },
                { label: "Copy the link", onSelect: () => pass(url(), "Link copied.") },
                { label: "Read it again", href: "#paper" },
              ]}
            />
          </Receipt>
          {msg ? (
            <p className="ys-note rt-meta" role="status">
              {msg}
            </p>
          ) : null}
          <InstallAsk />
        </div>
      </div>
    </div>
  );
}

function Welcome() {
  // Only mounted after hydration (TodayHero waits for the habits log), so storage can be read here.
  const [open, setOpen] = useState(() => !readFlag(WELCOMED));
  if (!open) return null;
  const close = () => {
    writeFlag(WELCOMED, "1");
    setOpen(false);
  };
  return (
    <div className="ys-page ys-page--note">
      <Scrap seed="welcome" ground="white" tape="top" as="aside" className="ys-welcome">
        <p className="ys-welcome__hand rt-hand">
          new here? a fresh paper lands every morning at 7.
        </p>
        <p className="ys-welcome__text">
          Only good news, about fifteen minutes of it. Turn the pages, do the puzzles on the back,
          and then it ends. That&rsquo;s the whole idea.
        </p>
        <GoButton onClick={close}>Got it, let&rsquo;s read</GoButton>
      </Scrap>
    </div>
  );
}

function Resume({ issue, pages }: Pick<Props, "issue" | "pages">) {
  const events = useHabitLog();
  const read = useMemo(() => pagesRead(events, issue), [events, issue]);
  if (read.size === 0) return null;
  const next = pages.find((p) => !read.has(p.order) && p.order !== pages[0]?.order);
  if (!next) return null;
  return (
    <div className="ys-page ys-page--note">
      <GoButton href={next.href} tone="a" sub={`page ${pages.indexOf(next) + 1} · ${next.label}`}>
        Carry on reading
      </GoButton>
    </div>
  );
}

export function TodayHero(props: Props) {
  const ready = useHabitsReady();
  const events = useHabitLog();
  if (props.pressIn !== null) return <OnThePress {...props} />;
  if (!ready) return null;
  const finished = events.some((e) => e.type === "edition_finished" && e.issue === props.issue);
  if (finished) return <Closed {...props} />;
  return (
    <>
      {events.length === 0 ? <Welcome /> : null}
      <Resume issue={props.issue} pages={props.pages} />
    </>
  );
}
