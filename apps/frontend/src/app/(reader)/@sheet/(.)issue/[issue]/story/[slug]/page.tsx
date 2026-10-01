import { Suspense } from "react";
import { getStory, issueParam } from "@/features/editions/api";
import { StoryView } from "@/features/papers/edition-view";
import { storyHref } from "@/features/papers/reading";
import { PassedNote, PassItOn } from "@/features/site/pass-it-on";
import { StorySheet } from "@/features/site/story-sheet";
import { previewFrom } from "../../../../../_preview";

/** A story opened from inside the paper: on a sheet over the page (see ../../../../../layout). */
export default async function StorySheetPage({
  params,
  searchParams,
}: PageProps<"/issue/[issue]/story/[slug]">) {
  const { issue, slug } = await params;
  const preview = await previewFrom(searchParams);
  const data = await getStory(issueParam(issue), slug, preview);
  return (
    <StorySheet label={data.story.headline}>
      <div>
        <Suspense>
          <PassedNote />
        </Suspense>
      </div>
      <StoryView data={data} design={preview.design} />
      <div className="ys-sheet__pass">
        <PassItOn
          path={storyHref(data.edition.issueNumber, data.story.slug)}
          headline={data.story.headline}
        />
      </div>
    </StorySheet>
  );
}
