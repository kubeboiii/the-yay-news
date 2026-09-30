import type { Metadata } from "next";
import { getEdition, getToday, issueParam } from "@/features/editions/api";
import { EditionPageView } from "@/features/papers/edition-view";
import { issueHref } from "@/features/papers/reading";
import { PileBand } from "@/features/site/pile-band";
import { frontPreview } from "@/features/reader/previews";
import { previewFrom } from "../../_preview";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/issue/[issue]">): Promise<Metadata> {
  const { issue } = await params;
  const edition = await getEdition(issueParam(issue), await previewFrom(searchParams));
  return {
    title: `No. ${issue} · The Yay News`,
    ...frontPreview(edition, issueHref(edition.issueNumber)),
  };
}

export default async function IssueFrontPage({
  params,
  searchParams,
}: PageProps<"/issue/[issue]">) {
  const preview = await previewFrom(searchParams);
  const [edition, today] = await Promise.all([
    getEdition(issueParam((await params).issue), preview),
    getToday(preview).catch(() => null),
  ]);
  const front = edition.pages.find((p) => p.layout === "front") ?? edition.pages[0]!;
  return (
    <>
      <PileBand issue={edition.issueNumber} date={edition.date} today={today} />
      <EditionPageView edition={edition} page={front} design={preview.design} />
    </>
  );
}
