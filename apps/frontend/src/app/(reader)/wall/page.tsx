import type { Metadata } from "next";
import { Wall } from "@/features/wall/wall";

export const metadata: Metadata = {
  title: "Your Wall · The Yay News",
  description: "Your clippings, stamps, cards and stickers, stuck up on this device.",
  robots: { index: false },
};

/** Everything the reader has kept, as a zine they made by reading (see features/wall). */
export default function WallPage() {
  return <Wall />;
}
