import type { Metadata } from "next";
import { Clash } from "@/features/cards/clash";
import { CardsDesk, CLASH_CUTS, GameHead } from "@/features/cards/desk";

export const metadata: Metadata = {
  title: "Card Clash · Yay Attax · The Yay News",
  description:
    "Top Trumps with your Yay Attax cards: pick a league, pick a stat, beat the computer.",
  robots: { index: false },
};

/** Card Clash: Top Trumps against the computer, one league at a time. */
export default function ClashPage() {
  return (
    <CardsDesk>
      <GameHead text="CARD CLASH" cuts={CLASH_CUTS}>
        Best of five against the computer. Pick a stat; the higher number takes the round.
      </GameHead>
      <Clash />
    </CardsDesk>
  );
}
