import type { Metadata } from "next";
import Link from "next/link";
import { habitFonts } from "@/features/habits/fonts";
import { SavedList } from "@/features/habits/saved-list";
import "@/features/habits/saved.css";

export const metadata: Metadata = {
  title: "Kept stories · The Yay News",
  description: "The stories you kept, clipped out and saved on this device.",
  robots: { index: false },
};

/** The stories the reader ticked "Keep this one" on, as clippings. */
export default function SavedPage() {
  return (
    <main className={`hb-desk ${habitFonts}`}>
      <header className="hb-desk__head">
        <p className="hb-desk__kicker">The Yay News</p>
        <h1 className="hb-desk__title">Kept stories</h1>
        <p className="hb-desk__note">
          Clipped out and kept on this device. <Link href="/stamps">Your stamp book</Link> ·{" "}
          <Link href="/">Today&rsquo;s paper</Link>
        </p>
      </header>
      <SavedList />
    </main>
  );
}
