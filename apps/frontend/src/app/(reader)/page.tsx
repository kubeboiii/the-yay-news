import type { Metadata } from "next";
import { rackFonts } from "@/features/archive/fonts";
import { getToday } from "@/features/editions/api";
import { habitFonts } from "@/features/habits/fonts";
import { EditionPageView } from "@/features/papers/edition-view";
import { frontPreview } from "@/features/reader/previews";
import { readerClock } from "@/features/site/clock";
import { Drop } from "@/features/site/drop";
import { heroProps } from "@/features/site/hero-props";
import { TodayHero } from "@/features/site/today-hero";
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

/**
 * Today's front page, for wherever the reader is, behind the front door: the shutter before 7,
 * the closed sign once it's finished, a note on a first visit (see features/site/today-hero).
 */
export default async function TodayPage({ searchParams }: PageProps<"/">) {
  const preview = await previewFrom(searchParams);
  const [edition, clock] = await Promise.all([getToday(preview), readerClock(preview)]);
  const front = edition.pages.find((p) => p.layout === "front") ?? edition.pages[0]!;
  return (
    <div className={`ys-today ${rackFonts} ${habitFonts}`}>
      <TodayHero {...heroProps(edition, clock)} />
      <Drop issue={edition.issueNumber}>
        <EditionPageView edition={edition} page={front} design={preview.design} />
      </Drop>
    </div>
  );
}
