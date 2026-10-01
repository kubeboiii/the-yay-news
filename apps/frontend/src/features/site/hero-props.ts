import "server-only";
import type { Edition } from "@repo/shared";
import { minutesToPress, type ReaderClock } from "./clock";
import { pagerPages } from "./pager-pages";
import type { HeroPage } from "./today-hero";

const SHORT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** Everything the front door needs from the served edition and the reader's clock. */
export function heroProps(edition: Edition, clock: ReaderClock) {
  const pages: HeroPage[] = pagerPages(edition);
  const tags = [...edition.pages]
    .sort((a, b) => a.order - b.order)
    .flatMap((p) => (p.layout === "front" || p.layout === "back" ? [] : [p.stories[0]?.kicker]))
    .filter((k): k is string => Boolean(k))
    .slice(0, 3);
  return {
    issue: edition.issueNumber,
    pages,
    tags,
    pressIn: minutesToPress(clock, edition.date),
    date: edition.date,
    servedShort: SHORT.format(new Date(`${edition.date}T00:00:00Z`)),
  };
}
