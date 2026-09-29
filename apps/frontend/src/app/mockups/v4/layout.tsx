import type { Metadata } from "next";
import { Alfa_Slab_One, Courier_Prime, PT_Serif } from "next/font/google";
import { MockupNav } from "@/app/mockups/_shared/mockup-nav";
import "@/app/mockups/_shared/print.css";
import "./zine.css";

// Wood-type slab: the cover masthead, the big heads and the contents numerals.
const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--z-slab" });
// The text face: body, standfirsts, captions, bylines.
const serif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--z-serif",
});
// Typewriter: labels, listings, patch notes and the odd note typed onto a print.
const type = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--z-type" });

export const metadata: Metadata = { title: "Mini Zine · Mockup" };

export default function MiniZineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className={`${slab.variable} ${serif.variable} ${type.variable}`}>
      {children}
      <MockupNav version="v4" name="Mini Zine" />
    </div>
  );
}
