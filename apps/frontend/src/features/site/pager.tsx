"use client";

import { useMemo } from "react";
import { useEditionToday, useHabitLog, useHabitsReady } from "@/features/habits/api";
import { isFinished, pagesRead } from "@/features/habits/core";
import { Mascot, Tracklist } from "@/features/riot";
import type { PagerPage } from "./pager-pages";

// Where you are in the paper, at the foot of every page: the riot kit's mixtape J-card, every page
// a numbered track, Back on the left and the biggest button naming the next page. ← → keys turn
// too. From the back page, Next is the fold: "3 to go" (to the first unread page) until the paper
// is finished, then "Fold it", which closes up shop for the day, or for an older paper puts it
// back on the pile.

type Props = { issue: number; date: string; pages: PagerPage[]; current: number };

export function Pager({ issue, date, pages, current }: Props) {
  const events = useHabitLog();
  const ready = useHabitsReady();
  const today = useEditionToday();
  const read = useMemo(() => pagesRead(events, issue), [events, issue]);
  const finished = ready && isFinished(events, issue);
  const isToday = today !== null && date >= today;
  const left = pages.filter((p) => !read.has(p.order) && p.order !== current);

  let done: { href: string; label: string; sub: string };
  if (finished) {
    done = isToday
      ? { href: "/", label: "Fold it", sub: "close up shop" }
      : { href: "/pile", label: "Fold it", sub: "back on the pile" };
  } else if (ready && left[0]) {
    done = {
      href: left[0].href,
      label: `${left.length} to go`,
      sub: `page${left.length === 1 ? "" : "s"} still unread`,
    };
  } else {
    done = { href: isToday ? "/" : "/pile", label: "Done!", sub: "get your stamp" };
  }

  return (
    <Tracklist
      pages={pages}
      current={current}
      read={[...read]}
      finished={finished}
      doneHref={done.href}
      doneLabel={done.label}
      doneSub={done.sub}
      sideNote={`No. ${issue}`}
      scroll
      // One Odin per screen: the front page's poster (the shutter, the finished paper) has its own.
      mascot={current === pages[0]?.order ? undefined : <Mascot pose="deliver" label="" />}
    />
  );
}
