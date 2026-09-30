import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { StoryItem } from "./types";
import { imageAspect, printedPhoto } from "@repo/ui/print/photo";
import "./brief-art.css";

// How a brief carries its picture. An art director doesn't drop the same small square above
// every item in the "In brief" column; each picture gets the treatment its spot suits: set into
// the text with the words running round and under it, across the top of the column at its own
// shape, as a print taped on at an angle and over the margin, or behind the headline of a very
// short item. A brief with no picture is set as type: its kicker big. And a block of briefs can
// gather its pictures into a band across the top, numbered to the items beneath. The choice is
// made from the column's width, the text's length, the picture's own shape and the neighbours,
// so two briefs side by side never share a treatment.

export type BriefArtKind = "wrap-r" | "wrap-l" | "top" | "taped" | "behind" | "type" | "plain";
/** A rail or column (narrow), or a strip of briefs across two or more columns (wide). */
export type BriefMeasure = "narrow" | "wide";
/** The design's character: which treatments suit it. */
export type BriefFlavour = "news" | "loud" | "scrappy" | "mag";
export type BriefPlan = { band: boolean; arts: BriefArtKind[] };

const hash = (s: string) =>
  [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;

const textLength = (s: StoryItem) => s.dek.length + s.body.join(" ").length;
const family = (a: BriefArtKind) => (a.startsWith("wrap") ? "wrap" : a);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * The treatment of every brief in a block. `seed` is anything stable for the block (the issue and
 * page), so the paper prints the same way every time it is opened.
 */
export function planBriefs(
  stories: StoryItem[],
  { measure, flavour, seed }: { measure: BriefMeasure; flavour: BriefFlavour; seed: string },
): BriefPlan {
  const pictured = stories.filter((s) => s.images[0]);
  // A band of pictures across the top wants a strip of three or more pictured briefs.
  const band =
    measure === "wide" &&
    pictured.length >= 3 &&
    pictured.length === stories.length &&
    stories.length <= 4 &&
    hash(`${seed}:band`) % 3 === 0;
  if (band) return { band, arts: stories.map((s) => (s.images[0] ? "plain" : "type")) };

  const arts: BriefArtKind[] = [];
  let wraps = hash(seed) % 2;
  for (const s of stories) {
    const image = s.images[0];
    if (!image) {
      arts.push("type");
      continue;
    }
    const ar = imageAspect(image.url);
    const len = textLength(s);
    const pool: BriefArtKind[] = [];
    // A very short item can take its headline on the picture itself.
    if (len < 330 && ar >= 1.2) pool.push("behind");
    // Across the top at its own shape: a landscape, or anything in a narrow rail.
    if (ar >= 1.15 || (measure === "narrow" && ar >= 0.9)) pool.push("top");
    // Set into the text, the words running round and under it (enough words to run under).
    if (len > 180) pool.push("wrap-r");
    if (flavour === "scrappy" || flavour === "loud") pool.push("taped");
    if (!pool.length) pool.push("top");
    const start = hash(`${seed}:${s.slug}`) % pool.length;
    const order = [...pool.slice(start), ...pool.slice(0, start)];
    const prev = arts.at(-1);
    let pick = order.find((a) => !prev || family(a) !== family(prev)) ?? order[0]!;
    if (pick === "wrap-r") pick = wraps++ % 2 ? "wrap-l" : "wrap-r";
    arts.push(pick);
  }
  return { band: false, arts };
}

function Pic({ story, sizes, width }: { story: StoryItem; sizes: string; width: number }) {
  const image = story.images[0]!;
  return (
    <div className="ba-pic">
      <Image
        src={printedPhoto(image.url, width)}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

/**
 * A brief's picture and head, in its treatment. `kicker` is the design's own kicker line and
 * `children` its headline; the design sets the standfirst and text after this.
 */
export function BriefArt({
  story,
  art,
  kicker,
  keyNo,
  children,
}: {
  story: StoryItem;
  art: BriefArtKind;
  kicker: ReactNode;
  /** The brief's number in a band of pictures above. */
  keyNo?: number;
  children: ReactNode;
}) {
  const image = story.images[0];
  const kind: BriefArtKind = !image && art !== "plain" ? "type" : art;
  const ar = image ? imageAspect(image.url) : 1.5;
  const key = keyNo ? (
    <span className="ba-key" aria-hidden>
      {keyNo}
    </span>
  ) : null;
  switch (kind) {
    case "wrap-r":
    case "wrap-l":
    case "taped":
      return (
        <>
          <figure
            className={`ba-fig ba-float ba-${kind === "taped" ? "taped" : "wrap"} ${kind === "wrap-l" ? "ba-float--l" : ""}`}
            style={{ "--ar": clamp(ar, 0.72, 1.7).toFixed(3) } as CSSProperties}
            data-ba={kind}
          >
            {kind === "taped" ? <span className="ba-tape" aria-hidden /> : null}
            <Pic story={story} sizes="(max-width: 760px) 50vw, 240px" width={600} />
          </figure>
          {key}
          {kicker}
          {children}
        </>
      );
    case "top":
      return (
        <>
          <figure
            className="ba-fig ba-top"
            style={{ "--ar": clamp(ar, 1, 2.2).toFixed(3) } as CSSProperties}
            data-ba="top"
          >
            <Pic story={story} sizes="(max-width: 760px) 100vw, 420px" width={900} />
          </figure>
          {key}
          {kicker}
          {children}
        </>
      );
    case "behind":
      return (
        <div
          className="ba-fig ba-behind"
          style={{ "--ar": clamp(ar, 1.2, 1.8).toFixed(3) } as CSSProperties}
          data-ba="behind"
        >
          <Pic story={story} sizes="(max-width: 760px) 100vw, 420px" width={900} />
          <div className="ba-behind-head">
            {key}
            {kicker}
            {children}
          </div>
        </div>
      );
    case "type":
      return (
        <>
          {key}
          <div className="ba-bigkick" data-ba="type">
            {kicker}
          </div>
          {children}
        </>
      );
    default:
      return (
        <>
          {key}
          {kicker}
          {children}
        </>
      );
  }
}

/** The pictures of a block of briefs as a band across its top, each numbered to its item. */
export function BriefBand({ stories }: { stories: StoryItem[] }) {
  const items = stories.flatMap((s, i) => (s.images[0] ? [{ s, n: i + 1 }] : []));
  if (!items.length) return null;
  return (
    <div
      className="ba-band"
      style={{ "--n": Math.min(items.length, 4) } as CSSProperties}
      data-ba="band"
    >
      {items.slice(0, 4).map(({ s, n }) => (
        <figure key={s.slug} className="ba-band-frame">
          <Pic story={s} sizes="(max-width: 760px) 50vw, 300px" width={700} />
          <figcaption className="ba-band-cap">
            <b className="ba-key">{n}</b> {s.images[0]!.alt}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
