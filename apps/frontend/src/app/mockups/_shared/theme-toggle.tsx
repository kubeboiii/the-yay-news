"use client";

import { useEffect, useState } from "react";
import { themes } from "../colours/themes";

const ORIGINAL = "original";

const known = (slug: string | null): slug is string =>
  !!slug && themes.some((t) => t.slug === slug);

const readSaved = (): string => {
  // ?theme=<slug> in the URL wins, so a colourway can be linked or screenshotted. A saved choice
  // that has since been discarded falls back to the original.
  const fromUrl = new URLSearchParams(window.location.search).get("theme");
  if (known(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem("yn-theme");
    return known(saved) ? saved : ORIGINAL;
  } catch {
    return ORIGINAL;
  }
};

const groups = [
  { label: "The original", list: themes.filter((t) => t.slug === "original") },
  { label: "Two-ink", list: themes.filter((t) => t.slug !== "original" && t.inks.length <= 2) },
  {
    label: "Three-ink and more",
    list: themes.filter((t) => t.slug !== "original" && t.inks.length > 2),
  },
];

/** Switches the broadsheet between its colourways and remembers the choice. */
export function ThemeToggle() {
  const [theme, setTheme] = useState(ORIGINAL);

  useEffect(() => {
    setTheme(readSaved());
  }, []);

  useEffect(() => {
    if (theme === ORIGINAL) delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("yn-theme", theme);
    } catch {
      // Storage blocked: the choice still applies to this page view.
    }
  }, [theme]);

  return (
    <label className="flex items-center gap-1.5 rounded-full bg-white/15 py-0.5 pr-1 pl-2.5">
      <span>Colours</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="rounded-full bg-white px-2 py-0.5 text-black"
      >
        {groups
          .filter((g) => g.list.length > 0)
          .map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.list.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
    </label>
  );
}
