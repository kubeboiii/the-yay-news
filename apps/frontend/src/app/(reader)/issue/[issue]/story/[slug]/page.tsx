import type { Metadata } from "next";
import { Suspense } from "react";
import { getEdition, getStory, getToday, issueParam } from "@/features/editions/api";
import { StoryView } from "@/features/papers/edition-view";
import { storyHref } from "@/features/papers/reading";
import { storyPreview } from "@/features/reader/previews";
import { PassedNote } from "@/features/site/pass-it-on";
import { PileBand } from "@/features/site/pile-band";
import { StoryStrip } from "@/features/site/story-strip";
import { previewFrom } from "../../../../_preview";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/issue/[issue]/story/[slug]">): Promise<Metadata> {
  const { issue, slug } = await params;
  const data = await getStory(issueParam(issue), slug, await previewFrom(searchParams));
  return {
    title: `${data.story.headline} · The Yay News`,
    description: data.story.dek,
    ...storyPreview(
      data.edition.issueNumber,
      data.story,
      storyHref(data.edition.issueNumber, slug),
    ),
  };
}

export default async function StoryPage({
  params,
  searchParams,
}: PageProps<"/issue/[issue]/story/[slug]">) {
  const { issue, slug } = await params;
  const preview = await previewFrom(searchParams);
  const n = issueParam(issue);
  const [data, edition, today] = await Promise.all([
    getStory(n, slug, preview),
    getEdition(n, preview),
    getToday(preview).catch(() => null),
  ]);
  return (
    <>
      <PileBand issue={data.edition.issueNumber} date={data.edition.date} today={today} />
      <div>
        <Suspense>
          <PassedNote />
        </Suspense>
      </div>
      <StoryView data={data} design={preview.design} />
      <StoryStrip data={data} edition={edition} todayIssue={today?.issueNumber ?? null} />
    </>
  );
}
