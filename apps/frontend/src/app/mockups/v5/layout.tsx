import type { Metadata } from "next";
import { Bodoni_Moda, Crimson_Pro, IBM_Plex_Sans_Condensed } from "next/font/google";
import "@/features/print/print.css";
import { MockupNav } from "@/app/mockups/_shared/mockup-nav";
import "./midi.css";

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

export const metadata: Metadata = { title: "Midi Magazine · Mockup" };

export default function MidiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      lang="en"
      className={`${display.variable} ${text.variable} ${sans.variable} m5 print-desk`}
    >
      {children}
      <MockupNav version="v5" name="Midi Magazine" />
    </div>
  );
}
