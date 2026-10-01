import type { Metadata } from "next";
import { DeckBattle } from "@/features/cards/battle-view";
import { BATTLE_CUTS, CardsDesk, GameHead } from "@/features/cards/desk";

export const metadata: Metadata = {
  title: "Deck Battle · Yay Attax · The Yay News",
  description: "Build a deck of five Yay Attax cards and battle the computer's, turn by turn.",
  robots: { index: false },
};

/** Deck Battle: five cards against the computer's five. */
export default function BattlePage() {
  return (
    <CardsDesk>
      <GameHead text="DECK BATTLE" cuts={BATTLE_CUTS}>
        Five cards a side, turn by turn. Knock all of the computer&rsquo;s out.
      </GameHead>
      <DeckBattle />
    </CardsDesk>
  );
}
