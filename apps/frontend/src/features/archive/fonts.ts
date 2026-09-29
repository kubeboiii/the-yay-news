import {
  Alfa_Slab_One,
  Bodoni_Moda,
  Courier_Prime,
  League_Gothic,
  Libre_Caslon_Text,
  Libre_Franklin,
} from "next/font/google";

// Each paper's own display face, so a back issue on the rack reads as the paper it was printed in.
const gothic = League_Gothic({ subsets: ["latin"], variable: "--ar-gothic" });
const franklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["500", "800", "900"],
  style: ["normal", "italic"],
  variable: "--ar-franklin",
});
const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--ar-slab" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--ar-bodoni" });
const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--ar-caslon",
});
const typewriter = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--ar-type",
});

/** Class names that define the --ar-* font variables. */
export const rackFonts = [gothic, franklin, slab, bodoni, caslon, typewriter]
  .map((f) => f.variable)
  .join(" ");
