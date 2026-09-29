import type { Metadata } from "next";
import { Courier_Prime, Kalam } from "next/font/google";
import { PressFilter } from "@/app/mockups/_shared/press-filter";
import { Pinboard } from "./board";
import "./pinboard.css";

// A hand for the note pinned to an empty board, and a typewriter for the labels on each clipping.
const hand = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--pb-hand" });
const type = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--pb-type" });

export const metadata: Metadata = { title: "Your board · The Yay News" };

export default function PinboardPage() {
  return (
    <div lang="en" className={`${hand.variable} ${type.variable}`}>
      <PressFilter />
      <Pinboard />
    </div>
  );
}
