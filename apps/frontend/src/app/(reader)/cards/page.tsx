import type { Metadata } from "next";
import { Album } from "@/features/cards/album";
import { CardsDesk } from "@/features/cards/desk";

export const metadata: Metadata = {
  title: "Yay Attax · your card album · The Yay News",
  description:
    "Collect cards of the biggest stars in twelve leagues: finish a paper for a scratch card and a blind box, complete sets, and play Card Clash and Deck Battle.",
  robots: { index: false },
};

/** The Yay Attax album: twelve leagues of cards, collected by reading. */
export default function CardsPage() {
  return (
    <CardsDesk>
      <Album />
    </CardsDesk>
  );
}
