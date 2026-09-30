import { Gochi_Hand, League_Gothic, Libre_Caslon_Text, Special_Elite } from "next/font/google";

// The faces for the reader's own things: a felt-tip/pencil hand for anything the reader (or the
// paper's editor) writes by hand, a worn typewriter face for rubber-stamp lettering, the
// broadsheet's condensed gothic for big stamped numbers, and the paper's serif for clippings.

export const handwriting = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--hb-hand",
});

export const stampFace = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--hb-stamp",
});

export const gothic = League_Gothic({ subsets: ["latin"], variable: "--hb-gothic" });

export const serif = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--hb-serif",
});

/** Class names defining every --hb-* font variable; put on any wrapper of habits components. */
export const habitFonts = [handwriting, stampFace, gothic, serif].map((f) => f.variable).join(" ");
