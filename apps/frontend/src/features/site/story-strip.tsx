import type { Edition, Story } from "@repo/shared";
import Link from "next/link";
import { rackFonts } from "@/features/archive/fonts";
import { habitFonts } from "@/features/habits/fonts";
import { issueHref, pageHref, pageSlug, storyHref } from "@/features/papers/reading";
import { PassItOn } from "./pass-it-on";
import "./story-strip.css";

// Under a story opened on its own (a shared link, a search result): a strip torn from the paper
// saying what this is, the way into the whole paper, and a few more headlines from the same paper,
// so a first-time visitor has somewhere to go that isn't a feed.

const LONG = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function StoryStrip({
  data,
  edition,
  todayIssue,
}: {
  data: Story;
  edition: Edition;
  todayIssue: number | null;
}) {
  const issue = data.edition.issueNumber;
  const isToday = todayIssue === issue;
  const samePage = edition.pages.find((p) => p.order === data.page.order)?.stories ?? [];
  const elsewhere = [...edition.pages]
    .sort((a, b) => a.order - b.order)
    .flatMap((p) => p.stories.slice(0, 1));
  const seen = new Set([data.story.slug]);
  const more = [...samePage, ...elsewhere]
    .filter((s) => (seen.has(s.slug) ? false : (seen.add(s.slug), true)))
    .slice(0, 4);
  const pageLink = pageHref(issue, pageSlug(data.page));

  return (
    <aside className={`ys-strip ${rackFonts} ${habitFonts}`} aria-label="About this paper">
      <PassItOn path={storyHref(issue, data.story.slug)} headline={data.story.headline} />
      <div className="ys-strip__tear">
        <p className="ys-strip__k">
          Cut from The Yay News · No. {issue} ·{" "}
          {LONG.format(new Date(`${data.edition.date}T00:00:00Z`))}
        </p>
        <p className="ys-strip__pitch">
          A daily paper of only good news. New every morning at 7, about fifteen minutes long, and
          then it ends.
        </p>
        <p className="ys-strip__go">
          {isToday ? (
            <Link href={pageLink} className="ys-strip__btn">
              Read the rest of today&rsquo;s paper →
            </Link>
          ) : (
            <>
              <Link href="/" className="ys-strip__btn">
                Read today&rsquo;s paper →
              </Link>
              <Link href={issueHref(issue)} className="ys-strip__btn ys-strip__btn--quiet">
                Read No. {issue} from the front
              </Link>
            </>
          )}
        </p>
      </div>
      {more.length ? (
        <section className="ys-strip__more" aria-labelledby="ys-more">
          <h2 id="ys-more" className="ys-strip__h">
            More in this paper
          </h2>
          <ul>
            {more.map((s) => (
              <li key={s.slug}>
                <Link href={storyHref(issue, s.slug)}>
                  <span className="ys-strip__mk">{s.kicker}</span>
                  <span className="ys-strip__mh">{s.headline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <p className="ys-strip__how">
        <Link href="/about">How it&rsquo;s made</Link>
      </p>
    </aside>
  );
}
