import type { Metadata } from "next";
import {
  Courier_Prime,
  Kalam,
  League_Gothic,
  Libre_Caslon_Text,
  Special_Elite,
} from "next/font/google";
import "./a.css";

// Direction A's type: the paper's own condensed gothic for anything printed big (the masthead
// strip, the kiosk sign), Libre Caslon for reading, a worn typewriter for rubber stamps and ticket
// stubs, a till-roll mono for the receipt, and one marker hand (Kalam) for notes Pip leaves.
const gothic = League_Gothic({ subsets: ["latin"], variable: "--sa-gothic" });
const serif = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--sa-serif",
});
const stamp = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--sa-stamp" });
const till = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--sa-till" });
const hand = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--sa-hand" });

export const metadata: Metadata = { title: "A · Paperboy's World · Site mockup" };

export default function SiteALayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${gothic.variable} ${serif.variable} ${stamp.variable} ${till.variable} ${hand.variable}`}
    >
      {children}
    </div>
  );
}
