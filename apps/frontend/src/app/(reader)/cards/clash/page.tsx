import type { Metadata } from "next";
import Link from "next/link";
import { Clash } from "@/features/cards/clash";
import { habitFonts } from "@/features/habits/fonts";
import { SoundToggle } from "@/features/sound/sound-toggle";
import "@/features/habits/saved.css";

export const metadata: Metadata = {
  title: "Card Clash · Yay Attax · The Yay News",
  description:
    "Top Trumps with your Yay Attax cards: pick a league, pick a stat, beat the computer.",
  robots: { index: false },
};

/** Card Clash: Top Trumps against the computer, one league at a time. */
export default function ClashPage() {
  return (
    <main className={`hb-desk ${habitFonts}`}>
      <header className="hb-desk__head">
        <p className="hb-desk__kicker">Yay Attax</p>
        <h1 className="hb-desk__title">Card Clash</h1>
        <p className="hb-desk__note">
          Best of five against the computer. <Link href="/cards">Back to your album</Link>
        </p>
      </header>
      <Clash />
      <p className="hb-desk__corner">
        <SoundToggle />
      </p>
    </main>
  );
}
