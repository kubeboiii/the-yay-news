import type { Metadata } from "next";
import Link from "next/link";
import { DeckBattle } from "@/features/cards/battle-view";
import { habitFonts } from "@/features/habits/fonts";
import { SoundToggle } from "@/features/sound/sound-toggle";
import "@/features/habits/saved.css";

export const metadata: Metadata = {
  title: "Deck Battle · Yay Attax · The Yay News",
  description: "Build a deck of five Yay Attax cards and battle the computer's, turn by turn.",
  robots: { index: false },
};

/** Deck Battle: five cards against the computer's five. */
export default function BattlePage() {
  return (
    <main className={`hb-desk ${habitFonts}`}>
      <header className="hb-desk__head">
        <p className="hb-desk__kicker">Yay Attax</p>
        <h1 className="hb-desk__title">Deck Battle</h1>
        <p className="hb-desk__note">
          Five cards a side, knock them all out. <Link href="/cards">Back to your album</Link>
        </p>
      </header>
      <DeckBattle />
      <p className="hb-desk__corner">
        <SoundToggle />
      </p>
    </main>
  );
}
