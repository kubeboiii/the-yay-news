import type { Metadata } from "next";
import Link from "next/link";
import { mockupPages } from "@/app/mockups/_shared/mockup-nav";

export const metadata: Metadata = { title: "Design mockups" };

const versions = [
  {
    slug: "v1",
    name: "Fluoro Broadsheet",
    family: "Neon",
    basis: "Newspaper Club 45gsm broadsheet",
    description:
      "A folded 380 × 578 mm broadsheet: zigzag rules, spec-table masthead, one big photo, fluoro ink blocks on newsprint.",
    swatch: ["#e9ff1f", "#ff3d9a", "#36f28a", "#2f5bff"],
  },
  {
    slug: "v3",
    name: "Tabloid Brights",
    family: "Neon",
    basis: "Newspaper Club 80gsm bright tabloid",
    description:
      "Bright 289 × 380 mm tabloid printed like a two-ink risograph: fluoro orange and riso blue, overprinting where they meet.",
    swatch: ["#ff5a1f", "#0078bf", "#151515"],
  },
  {
    slug: "v4",
    name: "Mini Zine",
    family: "Pastel",
    basis: "Newspaper Club 70gsm mini",
    description:
      "Two-page spreads of 170 × 250 mm mini pages, each spread its own pastel ground, stacked cover letters and big condensed quotes.",
    swatch: ["#9fe8bf", "#f8c6d8", "#c9b8f5", "#a9dcef"],
  },
  {
    slug: "v5",
    name: "Midi Magazine",
    family: "Pastel",
    basis: "Newspaper Club midi × Positive News",
    description:
      "A 220 × 310 mm magazine: colour-block cover, extended masthead, serif teasers, annotated picks and a calm editorial grid.",
    swatch: ["#ffc9a8", "#d9ccff", "#cdf3df", "#ffd6e0"],
  },
];

export default function MockupsIndex() {
  return (
    <main className="min-h-screen bg-[#e4ded3] px-4 py-12 font-sans text-neutral-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium tracking-wide text-neutral-600 uppercase">
          The Yay News · design exploration
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Four papers, one sample edition</h1>
        <p className="mt-3 max-w-2xl text-neutral-700">
          Each version prints the same invented edition across four section pages, on real newsprint
          with halftone-printed photos. The broadsheet switches between neon colourways; the other
          three switch between pastel ones. Compare them all on the{" "}
          <Link href="/mockups/colours" className="underline underline-offset-4">
            colour proofs
          </Link>
          .
        </p>
        <ol className="mt-10 divide-y divide-neutral-400/60 border-y border-neutral-400/60">
          {versions.map((v) => (
            <li
              key={v.slug}
              className="grid gap-4 py-6 sm:grid-cols-[4rem_1fr_auto] sm:items-start"
            >
              <span className="text-3xl font-bold tabular-nums">{v.slug}</span>
              <div>
                <h2 className="text-xl font-semibold">
                  <Link href={`/mockups/${v.slug}`} className="underline-offset-4 hover:underline">
                    {v.name}
                  </Link>{" "}
                  <span className="text-sm font-medium text-neutral-600">
                    · {v.family} · {v.basis}
                  </span>
                </h2>
                <p className="mt-1 max-w-2xl text-neutral-700">{v.description}</p>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {mockupPages.map((p) => (
                    <Link
                      key={p.label}
                      href={`/mockups/${v.slug}${p.path}`}
                      className="font-medium underline underline-offset-4"
                    >
                      {p.label}
                    </Link>
                  ))}
                </p>
              </div>
              <div className="flex gap-1">
                {v.swatch.map((c) => (
                  <span
                    key={c}
                    className="size-7 border border-black/15"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
