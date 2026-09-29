import { Courier_Prime, Libre_Franklin, Tinos } from "next/font/google";
import type { ReactNode } from "react";
import "./tabloid.css";

// Franklin Gothic is the tabloid face: the splash, the masthead, the headlines.
const franklin = Libre_Franklin({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-head",
});
// A Times-style text face for body copy, standfirsts and captions.
const tinos = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-text",
});
// Typewriter for listings, patch notes and the spec table.
const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
});

/**
 * The desk every tabloid sheet lies on, with the fonts and the colourway: the house inks are
 * orange and blue; any other colourway is a pastel set keyed off `data-pastel`.
 */
export function Frame({ colourway, children }: { colourway: string; children: ReactNode }) {
  return (
    <main
      className={`print-desk tb-desk ${franklin.variable} ${tinos.variable} ${courier.variable}`}
      data-pastel={colourway === "house" ? undefined : colourway}
    >
      {children}
    </main>
  );
}
