"use client";

import { useEffect } from "react";
import { type Pastel, pastels, pastelVars } from "../colours/pastels";
import { useStoredChoice } from "./use-stored-choice";

const HOUSE = "house";

// ?pastel=<slug> in the URL wins, so a colourway can be linked or screenshotted.
const known = (slug: string | null): slug is string =>
  slug === HOUSE || (!!slug && pastels.some((p) => p.slug === slug));

/**
 * Every colourway as html[data-pastel="slug"] { --pz-*: … }. Each pastel version maps the --pz-*
 * vocabulary onto its own tokens in its stylesheet, so only the attribute changes on switch.
 */
export function PastelStyles() {
  const css = pastels
    .map(
      (p) =>
        `html[data-pastel="${p.slug}"]{${Object.entries(pastelVars(p))
          .map(([k, v]) => `${k}:${v}`)
          .join(";")}}`,
    )
    .join("\n");
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

const groups: { label: string; list: Pastel[] }[] = [{ label: "Six-ink", list: pastels }];

/** Switches a pastel version between its own house inks and the shared pastel colourways. */
export function PastelToggle() {
  const [pastel, setPastel] = useStoredChoice("yn-pastel", "pastel", known, HOUSE);

  useEffect(() => {
    if (pastel === HOUSE) delete document.documentElement.dataset.pastel;
    else document.documentElement.dataset.pastel = pastel;
    return () => {
      delete document.documentElement.dataset.pastel;
    };
  }, [pastel]);

  return (
    <label className="flex items-center gap-1.5 rounded-full bg-white/15 py-0.5 pr-1 pl-2.5">
      <PastelStyles />
      <span>Pastels</span>
      <select
        value={pastel}
        onChange={(e) => setPastel(e.target.value)}
        className="rounded-full bg-white px-2 py-0.5 text-black"
      >
        <option value={HOUSE}>House inks</option>
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.list.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
