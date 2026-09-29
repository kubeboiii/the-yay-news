import Image from "next/image";
import type { ReactNode } from "react";
import { edition } from "@/app/mockups/_data/sample-edition";
import type { Photo as PhotoData } from "@/app/mockups/_data/photos";
import { unsplash } from "@/app/mockups/_data/photos";
import { Mark } from "@/app/mockups/_shared/mark";

/** The reader's blue pencil: every hand mark on this paper is made with it. */
export const PENCIL = "#43699e";

/** One folded broadsheet on standard newsprint. */
export function Sheet({ page, children }: { page: string; children: ReactNode }) {
  return (
    <main className="print-desk me-desk">
      <div className="print-sheet-wrap me-wrap">
        <article lang="en" className={`print-sheet print-sheet--fold me-sheet me-page-${page}`}>
          {children}
        </article>
      </div>
    </main>
  );
}

/** The bar under a nameplate or section flag: volume and number, the date, the edition. */
export function Dateline({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  return (
    <div className="me-dateline">
      <span>
        {left ?? (
          <>
            Vol. {edition.volume} · No. {edition.issue}
          </>
        )}
      </span>
      <span className="me-dateline-mid">{edition.date}</span>
      <span>{right ?? "Sample edition"}</span>
    </div>
  );
}

/** A section page's flag: the paper's small nameplate, the section name, the running dateline. */
export function SectionFlag({
  title,
  sub,
  page,
  earLeft,
  earRight,
}: {
  title: ReactNode;
  sub: ReactNode;
  page: number;
  earLeft: ReactNode;
  earRight: ReactNode;
}) {
  return (
    <header className="me-flag">
      <div className="me-flag-row">
        <div className="me-flag-ear">{earLeft}</div>
        <div className="me-flag-centre">
          <p className="me-flag-paper">The Yay News</p>
          <h1 className="me-flag-title">{title}</h1>
          <p className="me-flag-sub">{sub}</p>
        </div>
        <div className="me-flag-ear me-flag-ear--right">{earRight}</div>
      </div>
      <Dateline left={<>Page {page}</>} right={<>Vol. {edition.volume} · No. {edition.issue}</>} />
    </header>
  );
}

/** A halftone printed onto the page, with its credit set small and its cutline beneath. */
export function Photo({
  photo,
  sizes,
  className,
  position,
  duotone,
  priority,
  caption,
}: {
  photo: PhotoData;
  sizes: string;
  className?: string;
  position?: string;
  duotone?: boolean;
  priority?: boolean;
  caption?: ReactNode;
}) {
  return (
    <figure className={`me-photo ${duotone ? "me-photo--duo" : ""} ${className ?? ""}`}>
      <div className="me-photo-plate">
        <Image
          src={unsplash(photo.id, 1600)}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="print-photo object-cover"
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
      <p className="me-credit">{photo.credit} for Unsplash</p>
      {caption ? <figcaption className="me-cutline">{caption}</figcaption> : null}
    </figure>
  );
}

/** A star rating set as type, the way a review column printed it. */
export function Stars({ n, of = 5 }: { n: number; of?: number }) {
  return (
    <span className="me-stars" role="img" aria-label={`${n} stars out of ${of}`}>
      {"★".repeat(n)}
      <span className="me-stars-off">{"☆".repeat(of - n)}</span>
    </span>
  );
}

/** A mark made on the printed page by whoever is reading it. */
export function Pencil({ name, className }: { name: string; className: string }) {
  return <Mark name={name} ink={PENCIL} className={`me-pencil ${className}`} />;
}

export function Folio({ page, section }: { page: number; section: string }) {
  return (
    <footer className="me-folio">
      <span>{page}</span>
      <span>The Yay News, {edition.date}</span>
      <span>{section}</span>
    </footer>
  );
}
