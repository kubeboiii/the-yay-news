import Image from "next/image";
import type { StoryItem } from "./types";
import { printedPhoto } from "@/features/print/photo";
import "./plates.css";

// Plates: how a story with more than one picture is printed. A paper that has three photographs
// of a story doesn't run the best one and bin the rest; it makes a picture of them — a main shot
// with an inset, a pair side by side, a big one with two stacked beside it, a strip of frames off
// the contact sheet. Every design uses these, set in its own sheet units (--u) and inks, and every
// picture goes through printedPhoto() like any other photo in the paper.

type EditionImage = StoryItem["images"][number];

/** Arrangements that fill a box the design has already sized (its usual picture slot). */
export const FILL = ["inset", "diptych", "mosaic", "strip"] as const;
export type FillArrangement = (typeof FILL)[number];

/** Arrangements that set their own height: a band across the page. */
export type BandArrangement = "filmstrip" | "contact" | "grid";

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11);

/**
 * The fill arrangement for a story's pictures, fixed by its slug so it prints the same every
 * time, among those its number of pictures suits: two pictures make an inset or a pair, three or
 * more a mosaic, a strip or an inset.
 */
export function fillFor(story: Pick<StoryItem, "slug" | "images">): FillArrangement | null {
  const n = story.images.length;
  if (n < 2) return null;
  const pool: FillArrangement[] = n === 2 ? ["inset", "diptych"] : ["mosaic", "strip", "inset"];
  return pool[hash(story.slug) % pool.length]!;
}

/** Captions keyed to each picture's place, the way a paper labels a picture group. */
function places(a: FillArrangement | BandArrangement, n: number): string[] {
  switch (a) {
    case "inset":
      return ["Main picture", ...Array.from({ length: n - 1 }, () => "Inset")];
    case "diptych":
      return ["Left", "Right"];
    case "mosaic":
      return ["Main picture", "Top right", "Bottom right"];
    case "strip":
      return ["Main picture", ...Array.from({ length: n - 1 }, (_, i) => `Strip ${i + 1}`)];
    default:
      return Array.from({ length: n }, (_, i) => `${i + 1}`);
  }
}

const limit = (a: FillArrangement, n: number) =>
  a === "diptych" ? 2 : a === "mosaic" ? 3 : a === "inset" ? Math.min(n, 3) : Math.min(n, 5);

function Cell({
  image,
  sizes,
  priority,
  width,
  className,
}: {
  image: EditionImage;
  sizes: string;
  priority?: boolean;
  width: number;
  className?: string;
}) {
  return (
    <div className={`pl-cell ${className ?? ""}`}>
      <Image
        src={printedPhoto(image.url, width)}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

/**
 * A story's pictures filling the box the design gave its photo (the parent must be positioned
 * and sized, as every design's photo slot already is).
 */
export function FillPlates({
  story,
  sizes,
  priority,
  arrangement,
}: {
  story: Pick<StoryItem, "slug" | "images">;
  sizes: string;
  priority?: boolean;
  arrangement?: FillArrangement;
}) {
  const a = arrangement ?? fillFor(story) ?? "inset";
  const images = story.images.slice(0, limit(a, story.images.length));
  return (
    <div
      className={`pl-fill pl-fill--${a}`}
      data-plates={a}
      style={{ ["--n" as string]: images.length - 1 }}
    >
      {images.map((img, i) => (
        <Cell
          key={img.url}
          image={img}
          sizes={i === 0 ? sizes : "(max-width: 760px) 50vw, 360px"}
          priority={priority && i === 0}
          width={i === 0 ? 1600 : 800}
          className={i === 0 ? "pl-main" : `pl-sub pl-sub-${i}`}
        />
      ))}
    </div>
  );
}

/** The caption for a picture group: each picture's place and what it shows. */
export function PlatesCaption({
  story,
  arrangement,
  className,
}: {
  story: Pick<StoryItem, "slug" | "images">;
  arrangement?: FillArrangement;
  className?: string;
}) {
  const a = arrangement ?? fillFor(story) ?? "inset";
  const images = story.images.slice(0, limit(a, story.images.length));
  const where = places(a, images.length);
  return (
    <figcaption className={className}>
      {images.map((img, i) => (
        <span key={img.url} className="pl-cap">
          <b className="pl-cap-where">{where[i]}:</b> {img.alt}
        </span>
      ))}
    </figcaption>
  );
}

/**
 * A band of pictures that sets its own height: a filmstrip of frames on black stock, a contact
 * sheet with the editor's pick ringed in grease pencil, or a plain picture grid.
 */
export function Band({
  images,
  arrangement,
  className,
  pick = 0,
  labels,
}: {
  images: EditionImage[];
  arrangement: BandArrangement;
  className?: string;
  /** The contact sheet frame the picture editor ringed. */
  pick?: number;
  /** Optional line under each frame (a contact sheet's story key, say). */
  labels?: string[];
}) {
  if (!images.length) return null;
  // A grid prints a full set: five with the first doubled, or a single row of up to four.
  const lead = arrangement === "grid" && images.length >= 5;
  const frames = arrangement === "grid" ? images.slice(0, lead ? 5 : 4) : images;
  return (
    <div
      className={`pl-band pl-band--${arrangement} ${className ?? ""}`}
      data-plates={arrangement}
      data-lead={lead ? "" : undefined}
      style={{
        // A strip keeps its frames frame-sized: one or two pictures don't stretch across it.
        ["--n" as string]: arrangement === "grid" ? frames.length : Math.max(frames.length, 3),
      }}
    >
      {arrangement === "filmstrip" ? <span className="pl-sprockets" aria-hidden /> : null}
      <div className="pl-frames">
        {frames.map((img, i) => (
          <figure
            key={img.url}
            className={`pl-frame ${arrangement === "contact" && i === pick ? "pl-frame--pick" : ""}`}
          >
            <Cell image={img} sizes="(max-width: 760px) 50vw, 400px" width={800} />
            {arrangement === "grid" ? null : (
              <span className="pl-frame-no" aria-hidden>
                {arrangement === "filmstrip" ? `▸ ${12 + i}A` : `${i + 1}`}
              </span>
            )}
            {labels?.[i] ? <figcaption className="pl-frame-label">{labels[i]}</figcaption> : null}
          </figure>
        ))}
      </div>
      {arrangement === "filmstrip" ? <span className="pl-sprockets" aria-hidden /> : null}
    </div>
  );
}

/**
 * A story page's further pictures, after the one printed at the top: a contact sheet of every
 * frame, each with its caption and credit, numbered as the plates of a picture story.
 */
export function Gallery({
  story,
  className,
  captionClass,
}: {
  story: Pick<StoryItem, "slug" | "images">;
  className?: string;
  captionClass?: string;
}) {
  const rest = story.images.slice(1);
  if (!rest.length) return null;
  return (
    <section
      className={`pl-gallery ${className ?? ""}`}
      aria-label="More pictures"
      data-plates="gallery"
      style={{ ["--n" as string]: rest.length }}
    >
      <p className="pl-gallery-head">
        More pictures <span aria-hidden>·</span> {rest.length + 1} in all
      </p>
      <div className="pl-gallery-grid">
        {rest.map((img, i) => (
          <figure
            key={img.url}
            className={`pl-plate ${i === 0 && rest.length % 2 === 1 ? "pl-plate--wide" : ""}`}
          >
            <Cell image={img} sizes="(max-width: 760px) 100vw, 600px" width={1200} />
            <figcaption className={captionClass}>
              <b className="pl-cap-where">Plate {i + 2}.</b> {img.alt}
              {img.credit ? <span className="pl-credit"> Image: {img.credit}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/** Every picture on a page, story by story, for a page that leads with its pictures. */
export function pagePictures(stories: StoryItem[]) {
  return stories.flatMap((s) => s.images.map((image) => ({ image, story: s })));
}

/**
 * A picture group is a treat, not a template: in any one edition only one story — the first,
 * page by page, that genuinely has three or more pictures — prints as a group; every other story
 * prints its one best picture. (A story's own page still shows all of its pictures.)
 */
export function withOnePictureGroup<E extends { pages: { order: number; stories: StoryItem[] }[] }>(
  edition: E,
): E {
  const rank = { lead: 0, feature: 1, brief: 2 } as const;
  const chosen = [...edition.pages]
    .sort((a, b) => a.order - b.order)
    .flatMap((p) => [...p.stories].sort((a, b) => rank[a.slot] - rank[b.slot] || a.order - b.order))
    .find((s) => s.slot !== "brief" && s.images.length >= 3)?.slug;
  return {
    ...edition,
    pages: edition.pages.map((p) => ({
      ...p,
      stories: p.stories.map((s) =>
        s.slug === chosen || s.images.length <= 1 ? s : { ...s, images: s.images.slice(0, 1) },
      ),
    })),
  };
}
