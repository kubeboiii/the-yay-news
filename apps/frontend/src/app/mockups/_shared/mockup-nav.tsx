import Link from "next/link";
import { PaperToggle } from "./paper-toggle";
import { PastelToggle } from "./pastel-toggle";
import { EditionInsert } from "./inserts";
import { LifeControls, PaperLife } from "./life";
import { PressFilter } from "@/features/print/press-filter";
import { ThemeToggle } from "./theme-toggle";
import "@/features/print/colourways/neon.css";
import { ReaderTools } from "./tools";

export const mockupPages = [
  { path: "", label: "Front page" },
  { path: "/screen-and-sound", label: "Screen & Sound" },
  { path: "/gaming", label: "Gaming" },
  { path: "/back", label: "Back page" },
];

/** Floating switcher between a mockup's pages and the other versions. Not part of any design. */
export function MockupNav({ version, name }: { version: string; name: string }) {
  return (
    <>
      <PressFilter />
      <PaperLife version={version} />
      <EditionInsert version={version} />
      <nav
        aria-label="Mockup pages"
        className="fixed inset-x-0 bottom-3 z-50 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] flex-wrap items-center justify-center gap-1 rounded-full bg-black/85 px-2 py-1.5 font-sans text-xs text-white shadow-lg backdrop-blur"
      >
        <Link href="/mockups" className="rounded-full px-3 py-1 hover:bg-white/15">
          ← All
        </Link>
        <span className="px-2 font-semibold">{name}</span>
        {mockupPages.map((p) => (
          <Link
            key={p.label}
            href={`/mockups/${version}${p.path}`}
            className="rounded-full px-3 py-1 hover:bg-white/15"
          >
            {p.label}
          </Link>
        ))}
        {version === "v1" ? <ThemeToggle /> : null}
        {["v3", "v4", "v5"].includes(version) ? <PastelToggle /> : null}
        <PaperToggle />
        <LifeControls />
        <ReaderTools version={version} />
      </nav>
    </>
  );
}
