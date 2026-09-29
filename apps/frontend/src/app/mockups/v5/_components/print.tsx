import Image from "next/image";
import type { ReactNode } from "react";
import { type Photo, unsplash } from "@/app/mockups/_data/photos";

export const DATE_SHORT = "Wed 30 Sep 2026";

/** Running head and page number, placed like a magazine: even pages left, odd pages right. */
export function Folio({ page, section, top }: { page: number; section: string; top?: string }) {
  const side = page % 2 === 0 ? "m5-folio--even" : "m5-folio--odd";
  return (
    <>
      <div className={`m5-runhead ${side}`} aria-hidden>
        {top ?? `The Yay News · ${section}`}
      </div>
      <div className={`m5-folio ${side}`}>
        <span className="m5-folio-num" aria-hidden>
          {String(page).padStart(2, "0")}
        </span>
        <span className="m5-folio-line">
          Page {page} · The Yay News · {DATE_SHORT}
        </span>
      </div>
    </>
  );
}

export const credit = (photo: Photo) => `Photo: ${photo.credit} · unsplash.com`;

/** A photograph printed onto the sheet, cropped by its frame. */
export function PrintPhoto({
  photo,
  sizes,
  className,
  priority,
  position,
  children,
}: {
  photo: Photo;
  sizes: string;
  className?: string;
  priority?: boolean;
  position?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`m5-photo ${className ?? ""}`}>
      <Image
        src={unsplash(photo.id, 1600)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="print-photo object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
      {children}
    </div>
  );
}
