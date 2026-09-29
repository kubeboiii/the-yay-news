import { Bodoni_Moda, Crimson_Pro, IBM_Plex_Sans_Condensed } from "next/font/google";
import type { ReactNode } from "react";
import "./midi.css";
import "./front.css";
import "./section.css";
import "./back.css";
import "./story.css";

// High-contrast Didone for the masthead, headlines, pull quotes and the big numerals.
const display = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--f-display",
});
// Old-style book face for body copy, standfirsts and captions.
const text = Crimson_Pro({ subsets: ["latin"], style: ["normal", "italic"], variable: "--f-text" });
// Narrow sans for folios, contents, spec tables and listings times.
const sans = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-sans",
});

/** The desk every Midi sheet lies on, in the edition's colourway ("house" prints the house inks). */
export function Frame({ colourway, children }: { colourway: string; children: ReactNode }) {
  return (
    <div
      lang="en"
      data-pastel={colourway === "house" ? undefined : colourway}
      className={`${display.variable} ${text.variable} ${sans.variable} m5 print-desk`}
    >
      {children}
    </div>
  );
}
