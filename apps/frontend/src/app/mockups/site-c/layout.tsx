import type { Metadata } from "next";
import { Alfa_Slab_One, Gochi_Hand, IBM_Plex_Sans_Condensed } from "next/font/google";
import "./c.css";

// Direction C's type is Saturday-morning cartoon: a fat wood slab for titles, inked with a thick
// outline and a solid extrusion; comic-book hand lettering (Gochi Hand, in capitals) for every
// speech balloon and sound effect; and a condensed sans for captions and anything you read.
const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--sc-slab" });
const letter = Gochi_Hand({ subsets: ["latin"], weight: "400", variable: "--sc-letter" });
const plex = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--sc-plex",
});

export const metadata: Metadata = { title: "C · Saturday Cartoon · Site mockup" };

export default function SiteCLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${slab.variable} ${letter.variable} ${plex.variable}`}>{children}</div>;
}
