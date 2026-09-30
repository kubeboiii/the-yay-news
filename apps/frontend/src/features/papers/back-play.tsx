import type { Edition, Puzzle, SolvedPuzzle } from "@repo/shared";
import { MoodPicker } from "@/features/habits/mood";
import { PaperPlaneEnding } from "@/features/habits/paper-plane";
import { StickerSheet } from "@/features/habits/stickers";
import type { YesterdaysRiddle } from "@/features/play";
import "./back-play.css";

// What every design's back page shares now the puzzles are playable: today's puzzles and
// yesterday's answers picked out of the edition, and the sign-off keepsakes (the sticker sheet,
// the mood faces and the paper plane). Each design places them in its own layout and inks; the
// interactive keepsakes don't print (see back-play.css), the puzzles print as blank grids.

type Of<T extends Puzzle["type"]> = Extract<Puzzle, { type: T }>;
type SolvedOf<T extends SolvedPuzzle["type"]> = Extract<SolvedPuzzle, { type: T }>;

export function backPlay(edition: Edition) {
  const today = <T extends Puzzle["type"]>(type: T) =>
    (edition.puzzles.find((p) => p.type === type) as Of<T> | undefined) ?? null;
  const y = edition.yesterday;
  const past = <T extends SolvedPuzzle["type"]>(type: T) =>
    (y?.puzzles.find((p) => p.type === type) as SolvedOf<T> | undefined) ?? null;
  const yRiddle = past("riddle");
  const riddleYesterday: YesterdaysRiddle | undefined =
    y && yRiddle
      ? { issue: y.issueNumber, question: yRiddle.data.question, answer: yRiddle.solution.answer }
      : undefined;
  return {
    issue: edition.issueNumber,
    crossword: today("crossword"),
    ladder: today("word_ladder"),
    riddle: today("riddle"),
    search: today("word_search"),
    fortune: today("fortune_teller"),
    yesterday: y
      ? {
          issue: y.issueNumber,
          crossword: past("crossword"),
          ladder: past("word_ladder"),
          riddle: riddleYesterday,
        }
      : null,
  };
}

/**
 * The sticker sheet beside "how did today leave you?" and the paper plane that ends the edition,
 * stacked in the second column so the two columns run to about the same depth.
 */
export function BackKeepsakes({ edition, className }: { edition: Edition; className?: string }) {
  return (
    <section className={`yn-keepsakes ${className ?? ""}`} aria-label="Stickers, mood and plane">
      <StickerSheet className="yn-keepsakes-sheet" />
      <div className="yn-keepsakes-side">
        <MoodPicker issue={edition.issueNumber} date={edition.date} className="yn-keepsakes-mood" />
        <BackPlane edition={edition} className="yn-keepsakes-plane" />
      </div>
    </section>
  );
}

/** The paper plane that ends the edition: fold it and throw it once you're done. */
export function BackPlane({ edition, className }: { edition: Edition; className?: string }) {
  return (
    <div className={`yn-plane ${className ?? ""}`}>
      <PaperPlaneEnding issue={edition.issueNumber} title="Fold it up and send it off." />
    </div>
  );
}
