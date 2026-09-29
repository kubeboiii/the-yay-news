import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEdition, issueParam } from "@/features/editions/api";
import { EditionPageView } from "@/features/papers/edition-view";
import { pageHref, pageLabel, pageSlug } from "@/features/papers/reading";
import { frontPreview, storyPreview } from "@/features/reader/previews";
import { previewFrom } from "../../../_preview";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/issue/[issue]/[page]">): Promise<Metadata> {
  const { issue, page: slug } = await params;
  const edition = await getEdition(issueParam(issue), await previewFrom(searchParams));
  const page = edition.pages.find((p) => p.layout !== "front" && pageSlug(p) === slug);
  const path = pageHref(edition.issueNumber, slug);
  const title = `${page ? pageLabel(page) : "Page"} · No. ${issue} · The Yay News`;
  // An inside page unfurls as its first story's clipping; one with no stories (the back page) as
  // the front page.
  const first = page?.stories[0];
  if (!first) return { title, ...frontPreview(edition, path) };
  const preview = storyPreview(edition.issueNumber, first, path);
  const card = { title, description: first.headline };
  return {
    title,
    ...preview,
    openGraph: { ...preview.openGraph, ...card },
    twitter: { ...preview.twitter, ...card },
  };
}

export default async function IssuePage({
  params,
  searchParams,
}: PageProps<"/issue/[issue]/[page]">) {
  const { issue, page: slug } = await params;
  const preview = await previewFrom(searchParams);
  const edition = await getEdition(issueParam(issue), preview);
  const page = edition.pages.find((p) => p.layout !== "front" && pageSlug(p) === slug);
  if (!page) notFound();
  return <EditionPageView edition={edition} page={page} design={preview.design} />;
}
