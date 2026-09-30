import type { Metadata } from "next";
import Link from "next/link";
import { Album } from "@/features/cards/album";
import { habitFonts } from "@/features/habits/fonts";
import { SoundToggle } from "@/features/sound/sound-toggle";
import "@/features/habits/saved.css";

export const metadata: Metadata = {
  title: "Yay Attax · your card album · The Yay News",
  description:
    "Collect cards of the biggest stars in twelve leagues: finish a paper for a scratch card and a blind box, complete sets, and play Card Clash and Deck Battle.",
  robots: { index: false },
};

/** The Yay Attax album: twelve leagues of cards, collected by reading. */
export default function CardsPage() {
  return (
    <main className={`hb-desk ${habitFonts}`}>
      <header className="hb-desk__head">
        <p className="hb-desk__kicker">The Yay News presents</p>
        <h1 className="hb-desk__title">Yay Attax</h1>
        <p className="hb-desk__note">
          Finish a paper for a scratch card and a blind box.{" "}
          <Link href="/">Today&rsquo;s paper</Link> is waiting.
        </p>
      </header>
      <Album />
      <p className="hb-desk__corner">
        <SoundToggle />
      </p>
    </main>
  );
}
