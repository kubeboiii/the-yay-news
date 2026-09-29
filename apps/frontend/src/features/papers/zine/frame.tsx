import { Alfa_Slab_One, Courier_Prime, PT_Serif } from "next/font/google";
import type { ReactNode } from "react";
import "./zine.css";
import "./edition.css";

// Wood-type slab: the cover masthead, the big heads and the contents numerals.
const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--z-slab" });
// The text face: body, standfirsts, captions, bylines.
const serif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--z-serif",
});
// Typewriter: labels, listings and the odd note typed onto a print.
const type = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--z-type" });

/** The desk every zine spread sits on, in the edition's pastel colourway ("house" is the default). */
export function Frame({ colourway, children }: { colourway: string; children: ReactNode }) {
  return (
    <div
      lang="en"
      data-zine-frame=""
      data-pastel={colourway === "house" ? undefined : colourway}
      className={`print-desk z-desk ${slab.variable} ${serif.variable} ${type.variable}`}
    >
      {children}
    </div>
  );
}
