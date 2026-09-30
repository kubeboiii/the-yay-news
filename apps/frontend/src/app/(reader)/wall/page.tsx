import type { Metadata } from "next";
import { rackFonts } from "@/features/archive/fonts";
import { habitFonts } from "@/features/habits/fonts";
import { Wall } from "@/features/wall/wall";
import "@/features/wall/wall.css";

export const metadata: Metadata = {
  title: "Your Wall · The Yay News",
  description: "Your clippings, stamps, cards and stickers, pinned up on this device.",
  robots: { index: false },
};

/** Everything the reader has kept, pinned to a corkboard (see features/wall). */
export default function WallPage() {
  return (
    <main className={`wl-board ${rackFonts} ${habitFonts}`}>
      <header className="wl-head">
        <h1 className="wl-title">Your Wall</h1>
        <p className="wl-sub">Everything you tore out, stamped and collected.</p>
      </header>
      <Wall />
    </main>
  );
}
