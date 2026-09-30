import type { Metadata } from "next";
import { habitFonts } from "@/features/habits/fonts";
import { PressFilter } from "@/features/print/press-filter";
import { HabitsReview } from "./review";
import "./review.css";

export const metadata: Metadata = { title: "Habits & rituals · review" };

/** Review page for the Phase 3 habits: every piece on one desk, on demo data by default. */
export default function HabitsReviewPage() {
  return (
    <div className={habitFonts}>
      <PressFilter />
      <HabitsReview />
    </div>
  );
}
