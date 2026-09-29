import type { Metadata } from "next";
import { Old_Standard_TT, Pathway_Gothic_One, UnifrakturCook } from "next/font/google";
import "@/app/mockups/_shared/print.css";
import { MockupNav } from "@/app/mockups/_shared/mockup-nav";
import "./morning.css";

// Blackletter, cut for one job only: the nameplate.
const nameplate = UnifrakturCook({ subsets: ["latin"], weight: "700", variable: "--font-nameplate" });
// The nineteenth-century news face: every headline, deck, line of body copy and cutline.
const text = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-text",
});
// Condensed gothic for the second decks, box heads, listings, ads and the folio.
const gothic = Pathway_Gothic_One({ subsets: ["latin"], weight: "400", variable: "--font-gothic" });

export const metadata: Metadata = { title: "The Morning Edition · Mockup" };

export default function MorningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className={`${nameplate.variable} ${text.variable} ${gothic.variable}`}>
      {/* A two-plate duotone: the photograph's black plate, with powder blue printed under the mid-tones. */}
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="me-duotone" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="gamma" exponent="0.62" />
              <feFuncG type="gamma" exponent="0.62" />
              <feFuncB type="gamma" exponent="0.62" />
            </feComponentTransfer>
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.1 0.5 0.78 0.98" />
              <feFuncG type="table" tableValues="0.09 0.58 0.87 0.98" />
              <feFuncB type="table" tableValues="0.08 0.66 0.94 0.99" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      {children}
      <MockupNav version="v2" name="Morning Edition" />
    </div>
  );
}
