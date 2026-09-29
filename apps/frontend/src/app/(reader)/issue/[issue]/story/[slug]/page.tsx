import type { Metadata } from "next";
import { getStory, issueParam } from "@/features/editions/api";
import { StoryView } from "@/features/papers/edition-view";
import { storyHref } from "@/features/papers/reading";
import { storyPreview } from "@/features/reader/previews";
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
  const data = await getStory(issueParam(issue), slug, preview);
  return <StoryView data={data} design={preview.design} />;
}
