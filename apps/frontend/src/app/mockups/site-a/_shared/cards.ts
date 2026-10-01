import { ALL_CARDS } from "@/features/cards/leagues";
import type { Card, LeagueId } from "@/features/cards/types";

// A believable binder page for the mockups: one pictured card from each of six leagues, as if
// the reader had pulled them from scratch cards this month.

const LEAGUES: LeagueId[] = ["pokemon", "marvel", "football", "f1", "anime", "nba"];

export function binderCards(): Card[] {
  return LEAGUES.flatMap((l) => {
    const pictured = ALL_CARDS.filter((c) => c.league === l && c.image);
    const pick = pictured.find((c) => c.rarity !== "common") ?? pictured[0];
    return pick ? [pick] : [];
  });
}
