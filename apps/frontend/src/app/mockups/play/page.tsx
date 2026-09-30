import { editionSchema, type Puzzle, type SolvedPuzzle } from "@repo/shared";
import type { Metadata } from "next";
import { Libre_Franklin, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { z } from "zod";
import { env } from "@/config/env";
import {
  Crossword,
  CrosswordAnswers,
  FortuneTeller,
  type PlayInks,
  Riddle,
  WordLadder,
  WordSearch,
} from "@/features/play";
import { sampleYesterday, samplePuzzles } from "./sample";
import "./play-sheet.css";

export const metadata: Metadata = { title: "Puzzles · Mockups · The Yay News" };

const serif = Source_Serif_4({ subsets: ["latin"], variable: "--ps-serif" });
const sans = Libre_Franklin({ subsets: ["latin"], weight: ["500", "800"], variable: "--ps-sans" });

const ISSUE = 42;
const NOW = "2026-10-03T12:00:00Z";

/** How each design might recolour the reader's marks. */
const INKS: Record<string, { name: string; inks: PlayInks }> = {
  graphite: { name: "Graphite (default)", inks: {} },
  riso: {
    name: "Riso blue",
    inks: { ink: "#2d3a66", highlight: "#ff6a2b", mark: "#0078bf", paper: "#f6f1e6" },
  },
  pastel: {
    name: "Pastel zine",
    inks: { ink: "#4b4152", highlight: "#8fd9b6", mark: "#e0527d", paper: "#fbf3f6" },
  },
};

async function load() {
  try {
    const res = await fetch(`${env.BACKEND_URL}/api/v1/editions/${ISSUE}?now=${NOW}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const { data } = z.object({ data: editionSchema }).parse(await res.json());
    return { puzzles: data.puzzles, yesterday: data.yesterday, from: "api" as const };
  } catch {
    return { puzzles: [] as Puzzle[], yesterday: null, from: "sample" as const };
  }
}

type Of<T extends Puzzle["type"]> = Extract<Puzzle, { type: T }>;
type SolvedOf<T extends SolvedPuzzle["type"]> = Extract<SolvedPuzzle, { type: T }>;

export default async function PlayMockup({ searchParams }: PageProps<"/mockups/play">) {
  const { ink, debug } = await searchParams;
  const preset = INKS[typeof ink === "string" ? ink : "graphite"] ?? INKS.graphite!;
  const api = await load();
  const pick = <T extends Puzzle["type"]>(type: T) =>
    (api.puzzles.find((p) => p.type === type) ?? samplePuzzles.find((p) => p.type === type)) as
      Of<T> | undefined;
  const yesterday = api.yesterday ?? sampleYesterday;
  const solved = <T extends SolvedPuzzle["type"]>(type: T) =>
    (yesterday.puzzles.find((p) => p.type === type) ??
      sampleYesterday.puzzles.find((p) => p.type === type)) as SolvedOf<T> | undefined;
  const fromApi = (type: Puzzle["type"]) => api.puzzles.some((p) => p.type === type);

  const xword = pick("crossword");
  const ladder = pick("word_ladder");
  const riddle = pick("riddle");
  const search = pick("word_search");
  const teller = pick("fortune_teller");
  const yRiddle = solved("riddle");
  const yXword = solved("crossword");
  const inks = preset.inks;

  return (
    <main className={`ps-table ${serif.variable} ${sans.variable}`}>
      <nav className="ps-nav" aria-label="Mockup options">
        <Link href="/mockups">← Mockups</Link>
        <span>Ink:</span>
        {Object.entries(INKS).map(([slug, p]) => (
          <Link
            key={slug}
            href={`/mockups/play?ink=${slug}`}
            aria-current={p === preset || undefined}
          >
            {p.name}
          </Link>
        ))}
      </nav>
      <article className="ps-sheet">
        <header className="ps-masthead">
          <p className="ps-kicker">The back page · No. {ISSUE}</p>
          <h1>Puzzles &amp; Play</h1>
          {debug !== undefined ? (
            <p className="ps-source">
              {(["crossword", "word_ladder", "riddle", "word_search", "fortune_teller"] as const)
                .map((t) => `${t.replace("_", " ")}: ${fromApi(t) ? "API" : "sample"}`)
                .join(" · ")}
            </p>
          ) : null}
        </header>

        <div className="ps-grid">
          {xword ? (
            <div className="ps-cell ps-wide">
              <Crossword issue={ISSUE} data={xword.data} inks={inks} />
            </div>
          ) : null}
          {ladder ? (
            <div className="ps-cell">
              <WordLadder issue={ISSUE} data={ladder.data} inks={inks} />
            </div>
          ) : null}
          {riddle ? (
            <div className="ps-cell">
              <Riddle
                issue={ISSUE}
                data={riddle.data}
                inks={inks}
                yesterday={
                  yRiddle
                    ? {
                        issue: yesterday.issueNumber,
                        question: yRiddle.data.question,
                        answer: yRiddle.solution.answer,
                      }
                    : null
                }
              />
            </div>
          ) : null}
          {search ? (
            <div className="ps-cell ps-wide">
              <WordSearch issue={ISSUE} data={search.data} inks={inks} />
            </div>
          ) : null}
          {teller ? (
            <div className="ps-cell">
              <FortuneTeller issue={ISSUE} data={teller.data} inks={inks} />
            </div>
          ) : null}
          {yXword ? (
            <div className="ps-cell">
              <CrosswordAnswers
                data={{ ...yXword.data, title: `Yesterday’s Mini · No. ${yesterday.issueNumber}` }}
                solution={yXword.solution}
                inks={inks}
              />
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}
