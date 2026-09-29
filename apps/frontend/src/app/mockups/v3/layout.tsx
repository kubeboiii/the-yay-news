import type { Metadata } from "next";
import { Courier_Prime, Libre_Franklin, Tinos } from "next/font/google";
import "@/features/print/print.css";
import { MockupNav } from "@/app/mockups/_shared/mockup-nav";
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

export const metadata: Metadata = { title: "Tabloid Brights · Mockup" };

export default function TabloidLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${franklin.variable} ${tinos.variable} ${courier.variable}`}>
      {children}
      <MockupNav version="v3" name="Tabloid Brights" />
    </div>
  );
}
