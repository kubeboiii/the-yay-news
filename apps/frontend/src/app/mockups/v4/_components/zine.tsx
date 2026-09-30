import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Photo as PhotoData } from "@/app/mockups/_data/photos";
import { unsplash } from "@/app/mockups/_data/photos";
import { Mark } from "@repo/ui/print/mark";

export const FOLIO_DATE = "Wed 30 Sep 2026";

/** A spread of two mini pages, 170 × 250 mm each. */
export function Spread({ children, label }: { children: ReactNode; label: string }) {
  return (
    <main className="print-desk z-desk">
      <div className="print-sheet-wrap z-wrap">
        <div className="print-spread z-spread" aria-label={label}>
          {children}
        </div>
      </div>
    </main>
  );
}

export function Page({
  ground,
  side,
  children,
  className,
}: {
  ground: "mint" | "pink" | "lilac" | "blue" | "butter" | "peach";
  side: "left" | "right";
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`print-sheet print-sheet--bright z-page z-${ground} z-${side} ${className ?? ""}`}
    >
      {children}
    </article>
  );
}

/** The small centred line at the head of every mini page. */
export function RunningHead({ children }: { children: ReactNode }) {
  return <p className="z-run">{children}</p>;
}

export function Folio({ n }: { n: number }) {
  return (
    <p className="z-folio">
      <b>{String(n).padStart(2, "0")}</b>
      <span>
        Page {n} · The Yay News · {FOLIO_DATE}
      </span>
    </p>
  );
}

export function Zig({ short, className }: { short?: boolean; className?: string }) {
  return <div aria-hidden className={`z-zig ${short ? "z-zig--short" : ""} ${className ?? ""}`} />;
}

/**
 * The two-line headline: a condensed line flanked by halftone bars, then a heavy line across the
 * full measure. `as` picks the heading level so each page keeps one h1.
 */
export function Head({
  top,
  bottom,
  as: Tag = "h2",
  bottomSize,
  id,
}: {
  top: string;
  bottom: string;
  as?: "h1" | "h2" | "div";
  bottomSize?: number;
  id?: string;
}) {
  const hidden = Tag === "div" ? true : undefined;
  const style = bottomSize ? ({ "--hb": bottomSize } as CSSProperties) : undefined;
  return (
    <Tag className="z-head" id={id} aria-hidden={hidden}>
      <span className="z-head__top">
        <span aria-hidden className="z-dots" />
        <span className="z-head__cond">{top}</span>
        <span aria-hidden className="z-dots" />
      </span>
      <span className="z-head__heavy" style={style}>
        {bottom}
      </span>
    </Tag>
  );
}

/** A photograph printed onto the page, sized by aspect ratio so it reflows on phones. */
export function Photo({
  photo,
  ratio,
  sizes,
  position,
  className,
  priority,
  zoom,
}: {
  photo: PhotoData;
  ratio: string;
  sizes: string;
  position?: string;
  className?: string;
  priority?: boolean;
  /** Scale the picture inside its frame for a tighter crop, centred on `position`. */
  zoom?: number;
}) {
  const style: CSSProperties = {};
  if (position) style.objectPosition = position;
  if (zoom) {
    style.transform = `scale(${zoom})`;
    style.transformOrigin = position ?? "50% 50%";
  }
  return (
    <div className={`z-photo ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      <Image
        src={unsplash(photo.id, 1600)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="print-photo object-cover"
        style={style}
      />
    </div>
  );
}

export function Credit({ photo, children }: { photo: PhotoData; children?: ReactNode }) {
  return (
    <p className="z-cap">
      {children ? <>{children} </> : null}
      <span className="z-cap__credit">Photo: {photo.credit} · unsplash.com</span>
    </p>
  );
}

/** A strip of masking tape over a corner of a pasted print. */
export function Tape({ at }: { at: "tl" | "tr" | "br" | "t" }) {
  return <span aria-hidden className={`print-tape z-tape-${at}`} />;
}

/**
 * A photographic print pasted onto the page at an angle, held on with tape. The caption is written
 * on the print's white bottom border by hand.
 */
export function Print({
  photo,
  ratio,
  sizes,
  rotate = -2,
  tape = ["tl", "tr"],
  note,
  position,
  className,
  style,
  priority,
}: {
  photo: PhotoData;
  ratio: string;
  sizes: string;
  rotate?: number;
  tape?: ("tl" | "tr" | "br" | "t")[];
  note?: string;
  position?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  return (
    <figure
      className={`z-print print-print ${className ?? ""}`}
      style={{ margin: 0, ["--r" as string]: `${rotate}deg`, ...style }}
    >
      <Photo photo={photo} ratio={ratio} sizes={sizes} position={position} priority={priority} />
      {note ? <figcaption className="z-print__cap">{note}</figcaption> : null}
      {tape.map((t) => (
        <Tape key={t} at={t} />
      ))}
    </figure>
  );
}

/** A word ringed by hand with a loose marker ellipse. */
export function Ring({ children, ink = "var(--ink)" }: { children: ReactNode; ink?: string }) {
  return (
    <span className="z-ring">
      {children}
      <Mark name="ellipse-01" ink={ink} className="z-ring__mark" />
    </span>
  );
}

/** A handwritten note beside a marker arrow, positioned by the caller. */
export function Anno({
  arrow,
  children,
  style,
  arrowSize = [16, 10],
  arrowFirst = true,
  ink = "var(--ink)",
  arrowStyle,
}: {
  arrow: string;
  children: ReactNode;
  style?: CSSProperties;
  arrowSize?: [number, number];
  arrowFirst?: boolean;
  ink?: string;
  arrowStyle?: CSSProperties;
}) {
  const mark = (
    <span className="z-anno__arrow" style={{ flex: "none" }}>
      <Mark
        name={arrow}
        ink={ink}
        style={{
          width: `calc(var(--u) * ${arrowSize[0]})`,
          height: `calc(var(--u) * ${arrowSize[1]})`,
          display: "block",
          ...arrowStyle,
        }}
      />
    </span>
  );
  return (
    <p className="z-anno" style={style}>
      {arrowFirst ? mark : null}
      <span>{children}</span>
      {arrowFirst ? null : mark}
    </p>
  );
}

/**
 * A line that runs across both pages of a spread. Each page renders the whole line and crops it at
 * its own edge; the right-hand copy is hidden from assistive tech so it is read once.
 */
export function Across({
  side,
  height,
  children,
}: {
  side: "left" | "right";
  height: number;
  children: ReactNode;
}) {
  return (
    <div
      className="z-across"
      style={{ ["--ah" as string]: height }}
      aria-hidden={side === "right" ? true : undefined}
    >
      <div className="z-across__line">{children}</div>
    </div>
  );
}
