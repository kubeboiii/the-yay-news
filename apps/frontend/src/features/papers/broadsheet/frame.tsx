import { League_Gothic, Libre_Caslon_Text, Libre_Franklin } from "next/font/google";
import type { ReactNode } from "react";
import "./broadsheet.css";
import "./sections.css";
import "./paste-up.css";
import "./type.css";
import "./templates.css";
import "./compose.css";

// The condensed gothic newspapers have set headlines in for a century: masthead, heads, numerals.
const head = League_Gothic({ subsets: ["latin"], axes: ["wdth"], variable: "--font-head" });
// An old-style serif for reading: body, standfirsts and captions, with real italics and old-style figures.
const text = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-text",
});
// A small workhorse sans for the furniture: datelines, folios, bylines, spec lines.
const sans = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

/**
 * The table the broadsheet is laid on. The colourway rules in features/print/colourways/neon.css
 * are written `[data-theme] .yn-table`, so the attribute goes on a wrapper around the table;
 * "original" is the broadsheet's own fluoro set and needs none.
 */
export function Frame({ colourway, children }: { colourway: string; children: ReactNode }) {
  return (
    <div data-theme={colourway === "original" ? undefined : colourway}>
      <div lang="en" className={`${head.variable} ${text.variable} ${sans.variable} yn-table`}>
        {children}
      </div>
    </div>
  );
}
