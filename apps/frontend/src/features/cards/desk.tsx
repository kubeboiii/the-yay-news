import type { ReactNode } from "react";
import { type Cut, GAP, GoButton, RansomHeading, RiotTheme } from "@/features/riot";
import { SoundToggle } from "@/features/sound/sound-toggle";
import { CARDS_COLOURWAY } from "./colourway";
import "./desk.css";

// The Yay Attax pages' chrome, in the riot kit: copier paper with its grain, the house's two
// plates, and the sound switch at the foot. The album makes its own head (a poster); the games
// get a ransom head, a line saying how to play, and the way back to the album.

export { CARDS_COLOURWAY };

export function CardsDesk({ children }: { children: ReactNode }) {
  return (
    <RiotTheme as="main" colourway={CARDS_COLOURWAY} className="yk-desk">
      {children}
      <p className="yk-desk__corner">
        <SoundToggle />
      </p>
    </RiotTheme>
  );
}

export const CLASH_CUTS: readonly (Cut | typeof GAP)[] = [
  { ch: "CA", from: "gothic", size: 1.12 },
  { ch: "R", from: "didone", size: 0.96, lift: 0.06, tuck: 0.03, turn: -3 },
  { ch: "D", from: "slab", size: 1, tuck: 0.03 },
  GAP,
  { ch: "CL", from: "slab", size: 0.98, turn: 2 },
  { ch: "A", from: "gothic", size: 1.1, tuck: 0.03, ground: "ink" },
  { ch: "SH", from: "roman", size: 1.02, tuck: 0.02, lift: 0.04 },
];

export const BATTLE_CUTS: readonly (Cut | typeof GAP)[] = [
  { ch: "DE", from: "slab", size: 1 },
  { ch: "CK", from: "gothic", size: 1.12, tuck: 0.03, turn: 2 },
  GAP,
  { ch: "BA", from: "gothic", size: 1.12 },
  { ch: "T", from: "didone", size: 0.98, lift: 0.08, tuck: 0.03, turn: -3 },
  { ch: "T", from: "slab", size: 0.94, tuck: 0.02, ground: "a" },
  { ch: "LE", from: "roman", size: 1.02, tuck: 0.03 },
];

/** A game's head: the one ransom heading on the screen, how to play, and the way back. */
export function GameHead({
  text,
  cuts,
  children,
}: {
  text: string;
  cuts: readonly (Cut | typeof GAP)[];
  children: ReactNode;
}) {
  return (
    <header className="yk-head">
      <p className="yk-head__kicker rt-meta">Yay Attax · a game for your cards</p>
      <RansomHeading as="h1" text={text} seed={text} cuts={cuts} className="yk-head__h" />
      <p className="yk-head__note">{children}</p>
      <GoButton tone="quiet" href="/cards" className="yk-head__back">
        Back to your album
      </GoButton>
    </header>
  );
}
