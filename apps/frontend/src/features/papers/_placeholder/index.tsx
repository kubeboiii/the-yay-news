import type { EditionDesign } from "@repo/shared";
import Link from "next/link";
import type { Paper, PageProps, StoryProps } from "../types";

// A plain, unstyled stand-in used for a design until its templates are built, so every route
// renders real edition data from the start.

function Page({ edition, page, reading }: PageProps) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-10 font-serif">
      <p className="text-sm">
        The Yay News · No. {edition.issueNumber} · {edition.date} · {edition.design}/
        {edition.colourway}
      </p>
      <h1 className="mt-2 text-3xl font-bold">{reading.current.label}</h1>
      {page.stories.map((s) => (
        <section key={s.slug} className="mt-8">
          <p className="text-sm uppercase">{s.kicker}</p>
          <h2 className="text-2xl font-bold">
            <Link href={reading.storyHref(s.slug)}>{s.headline}</Link>
          </h2>
          <p className="mt-1 italic">{s.dek}</p>
        </section>
      ))}
    </article>
  );
}

function Story({ data, links }: StoryProps) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-10 font-serif">
      <Link href={links.page} className="text-sm underline">
        Back to the page
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{data.story.headline}</h1>
      <p className="mt-2 italic">{data.story.dek}</p>
      {data.story.body.map((p, i) => (
        <p key={i} className="mt-4">
          {p}
        </p>
      ))}
    </article>
  );
}

export const placeholderPaper = (design: EditionDesign): Paper => ({
  design,
  Frame: ({ children }) => <>{children}</>,
  Front: Page,
  Section: Page,
  Guest: Page,
  Back: Page,
  Story,
});
