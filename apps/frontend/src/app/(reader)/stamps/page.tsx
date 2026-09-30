import type { Metadata } from "next";
import Link from "next/link";
import { habitFonts } from "@/features/habits/fonts";
import { StampBook } from "@/features/habits/stamp-book";
import { SoundToggle } from "@/features/sound/sound-toggle";
import "@/features/habits/saved.css";

export const metadata: Metadata = {
  title: "Your stamp book · The Yay News",
  description: "A stamp for every paper you finish, and your streak, kept on this device.",
  robots: { index: false },
};

/** The reader's stamp book: one rubber stamp per finished paper, the streak and the month. */
export default function StampsPage() {
  return (
    <main className={`hb-desk ${habitFonts}`}>
      <header className="hb-desk__head">
        <p className="hb-desk__kicker">The Yay News</p>
        <h1 className="hb-desk__title">Your stamp book</h1>
        <p className="hb-desk__note">
          Finish a paper, get a stamp. <Link href="/">Today&rsquo;s paper</Link> is waiting.
        </p>
      </header>
      <StampBook start={1} />
      <p className="hb-desk__corner">
        <SoundToggle />
      </p>
    </main>
  );
}
