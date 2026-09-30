import { Reenie_Beanie } from "next/font/google";

/**
 * The reader's handwriting: Reenie Beanie was drawn from real pencil lettering, so it has the thin,
 * uneven, slightly scratchy line of a graphite HB rather than the rounded marker look of most
 * "handwriting" faces. Everything the reader writes uses it; nothing printed does.
 */
export const hand = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  variable: "--play-hand",
  display: "swap",
  fallback: ["Bradley Hand", "Segoe Print", "cursive"],
});
