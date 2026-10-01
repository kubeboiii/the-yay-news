import type { Metadata } from "next";
import "./b.css";

// Direction B is built from the riot kit (features/riot): its RiotTheme loads the type and sets
// the day's inks; b.css only lays out these mockup screens.

export const metadata: Metadata = { title: "B · Riso Zine Riot · Site mockup" };

export default function SiteBLayout({ children }: { children: React.ReactNode }) {
  return children;
}
