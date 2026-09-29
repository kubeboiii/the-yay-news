import type { Metadata } from "next";
import { getEdition, issueParam } from "@/features/editions/api";
import { EditionPageView } from "@/features/papers/edition-view";
import { issueHref } from "@/features/papers/reading";
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
  const edition = await getEdition(issueParam((await params).issue), preview);
  const front = edition.pages.find((p) => p.layout === "front") ?? edition.pages[0]!;
  return <EditionPageView edition={edition} page={front} design={preview.design} />;
}
