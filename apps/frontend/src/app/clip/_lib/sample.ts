// The Phase 1 sample edition as clipping subjects, for /mockups/clippings (`?story=<slug>` with no
// `?issue=`). Invented content only.

import "server-only";
import { allStories, edition } from "@/app/mockups/_data/sample-edition";
import { type PhotoKey, pick } from "@/app/mockups/_data/photos";
import { type Picture, photoSrc } from "./assets";
import type { ClipIssue, Subject } from "./clipping";

// Which photograph runs with which story. The picture editor's choice, not an algorithm.
const PICTURES: Record<string, { key: PhotoKey; n?: number; focus?: string }> = {
  "dancing-octopus": { key: "octopus", focus: "50% 40%" },
  "moonbeam-diner-musical": { key: "retroTv", focus: "50% 55%" },
  "village-choir-power-ballad": { key: "choir", focus: "50% 45%" },
  "bread-and-butter": { key: "bakeryCat", focus: "50% 35%" },
  "fishing-patch": { key: "fishing", focus: "50% 55%" },
  "pit-crew-dance": { key: "pitStop" },
  "six-into-fruit-bowl": { key: "cricket" },
  "birdsong-phones": { key: "songbird", focus: "50% 40%" },
  "fitted-sheet-robot": { key: "robot", focus: "50% 35%" },
  "pay-it-forward-cafe": { key: "coffee" },
  "tiny-wins-thread": { key: "stickyNotes" },
  "benches-with-views": { key: "bench", focus: "50% 60%" },
};

function pictureFor(slug: string): Picture | null {
  const choice = PICTURES[slug];
  if (!choice) return null;
  const p = pick(choice.key, choice.n);
  return {
    src: photoSrc(p.id),
    alt: p.alt,
    credit: `Photograph: ${p.credit} / Unsplash`,
    focus: choice.focus ?? "50% 50%",
  };
}

const ISSUE: ClipIssue = {
  date: edition.date,
  shortDate: edition.date.replace(/^\w+, /, ""),
  volume: edition.volume,
  issue: edition.issue,
  tagline: edition.tagline,
  inside: edition.sections.map((s) => ({ name: s.name, head: s.stories[0]?.headline ?? "" })),
};

/** A sample story (or "front"), or null when there is no such story. */
export function sampleSubject(slug: string): Subject | null {
  const story = slug === "front" ? edition.lead : allStories.find((s) => s.slug === slug);
  if (!story) return null;
  return {
    kind: slug === "front" ? "front" : "story",
    story,
    issue: ISSUE,
    picture: pictureFor(story.slug),
    continuedOn: story.section === "Discoveries" ? 3 : 7,
  };
}
