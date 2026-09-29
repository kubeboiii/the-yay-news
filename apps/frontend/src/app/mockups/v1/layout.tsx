import type { Metadata } from "next";
import { League_Gothic, Libre_Caslon_Text, Libre_Franklin } from "next/font/google";
import { MockupNav } from "@/app/mockups/_shared/mockup-nav";
import "@/features/print/print.css";
import "./broadsheet.css";
import "./sections.css";
import "./paste-up.css";
import "./type.css";

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

export const metadata: Metadata = { title: "Fluoro Broadsheet · Mockup" };

export default function BroadsheetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className={`${head.variable} ${text.variable} ${sans.variable} yn-table`}>
      {children}
      <MockupNav version="v1" name="Fluoro Broadsheet" />
    </div>
  );
}
