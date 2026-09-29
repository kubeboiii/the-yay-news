"use client";

import { useEffect } from "react";

/** Printable sheet height (mm) for each design, matching the @page sizes in print-edition.css. */
const SHEET_MM: Record<string, number> = { broadsheet: 600, tabloid: 510, midi: 280, zine: 310 };
const PAGE_WIDTH_MM = 380;
const PX_PER_MM = 96 / 25.4;

/**
 * Pages grow with the day's stories, so a page can run longer than its printed sheet. The print
 * view lays every page out on screen exactly as it prints (380 mm wide, flat), so each page can be
 * measured here and given a reduction, --fit, that print-edition.css applies only in print: every
 * page then prints on one sheet, reduced like a long page on a copier (never enlarged). Narrow
 * screens get the whole edition scaled to fit their width with --screen-fit.
 */
export function PrintFit() {
  useEffect(() => {
    const edition = document.querySelector<HTMLElement>(".yn-print-edition");
    if (!edition) return;
    const measure = () => {
      edition.style.setProperty("--screen-fit", "1");
      for (const page of edition.querySelectorAll<HTMLElement>(".yn-print-page")) {
        const sheet = (SHEET_MM[page.dataset.design ?? ""] ?? 600) * PX_PER_MM;
        const height = page.offsetHeight;
        // A hair of room for rounding between the screen layout and the printed one.
        const fit = height > sheet ? Math.floor((sheet / height) * 0.98 * 1000) / 1000 : 1;
        page.style.setProperty("--fit", String(fit));
      }
      const screenFit = Math.min(1, (window.innerWidth - 16) / (PAGE_WIDTH_MM * PX_PER_MM));
      edition.style.setProperty("--screen-fit", String(Math.floor(screenFit * 1000) / 1000));
    };
    measure();
    void document.fonts.ready.then(measure);
    const images = [...edition.querySelectorAll("img")].filter((i) => !i.complete);
    images.forEach((i) => i.addEventListener("load", measure, { once: true }));
    window.addEventListener("resize", measure);
    window.addEventListener("beforeprint", measure);
    return () => {
      images.forEach((i) => i.removeEventListener("load", measure));
      window.removeEventListener("resize", measure);
      window.removeEventListener("beforeprint", measure);
    };
  }, []);
  return null;
}
