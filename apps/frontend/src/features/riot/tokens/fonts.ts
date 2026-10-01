import {
  Alfa_Slab_One,
  Bodoni_Moda,
  Courier_Prime,
  Gochi_Hand,
  League_Gothic,
  Libre_Franklin,
} from "next/font/google";

// The riot kit's type. One strong condensed face (League Gothic) does every heading and label;
// the reading text is one sturdy grotesque (Libre Franklin). The ransom heads cut letters from
// wood slab, a fashion Didone and the gothic. Courier Prime is for metadata only (dates, issue
// numbers, the receipt); Gochi Hand is the one marker scrawl.

const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--rt-ff-slab" });
const didone = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--rt-ff-didone",
});
const gothic = League_Gothic({ subsets: ["latin"], variable: "--rt-ff-gothic" });
const type = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--rt-ff-type",
});
const grot = Libre_Franklin({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--rt-ff-grot",
});
const scrawl = Gochi_Hand({ subsets: ["latin"], weight: "400", variable: "--rt-ff-scrawl" });

/** The class names that load the kit's faces (RiotTheme applies them). */
export const riotFonts = [slab, didone, gothic, type, grot, scrawl]
  .map((f) => f.variable)
  .join(" ");
