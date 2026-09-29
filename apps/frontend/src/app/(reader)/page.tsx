import type { Metadata } from "next";
import { getToday } from "@/features/editions/api";
import { EditionPageView } from "@/features/papers/edition-view";
import { frontPreview } from "@/features/reader/previews";
import { previewFrom } from "./_preview";

const description = "A daily newspaper of only good news: happy, fun and occasionally weird.";

export async function generateMetadata({ searchParams }: PageProps<"/">): Promise<Metadata> {
  const edition = await getToday(await previewFrom(searchParams));
  const preview = frontPreview(edition, "/");
  return {
    title: "The Yay News · Only good news",
    description,
    ...preview,
    openGraph: { ...preview.openGraph, title: "The Yay News · Only good news", description },
    twitter: { ...preview.twitter, title: "The Yay News · Only good news", description },
  };
}

/** Today's front page, for wherever the reader is. */
export default async function TodayPage({ searchParams }: PageProps<"/">) {
  const preview = await previewFrom(searchParams);
  const edition = await getToday(preview);
  const front = edition.pages.find((p) => p.layout === "front") ?? edition.pages[0]!;
  return <EditionPageView edition={edition} page={front} design={preview.design} />;
}
