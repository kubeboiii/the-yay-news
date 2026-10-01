import type { CSSProperties } from "react";
import { MASCOT_NAME } from "./name";
import type { Art, ArtInk } from "./art/types";

// Odin, the paper's husky. His look comes from the owner's reference drawings, traced into flat
// ink layers (art/*.ts): the colour-pencil sitting husky is the master character, the flat
// peeking husky is the small icon. Everything that makes him ours (the plate-A cap, the plate-B
// satchel, the props, eyelids for blinking) is a small separate SVG layer on top (overlays.tsx).
//
// Idle life is CSS only (mascot.css): a blink (eyelid overlay) and a gentle breath. All of it
// stops under prefers-reduced-motion, or with `still`.

export type MascotPose =
  "standing" | "peek" | "deliver" | "asleep" | "on-pile" | "lights" | "confused";

export const MASCOT_POSES: readonly MascotPose[] = [
  "standing",
  "peek",
  "deliver",
  "asleep",
  "on-pile",
  "lights",
  "confused",
];

export type MascotInks = {
  line: string;
  /** The coat: a warm slate grey. */
  coat: string;
  /** A lighter grey where the coat meets the white. */
  soft: string;
  white: string;
  /** Ear insides. */
  cream: string;
  eye: string;
  tongue: string;
  cap: string;
  bag: string;
  paper: string;
};

export const MASCOT_INKS: MascotInks = {
  line: "var(--rt-k, #111)",
  coat: "#535861",
  soft: "#8a9099",
  white: "#fbf9f3",
  cream: "#ead7bb",
  eye: "#c4e8ff",
  tongue: "#f27a9c",
  cap: "var(--rt-a, #ff4fa3)",
  bag: "var(--rt-b, #2fa8ff)",
  paper: "#fffdf7",
};

export const LABEL: Record<MascotPose, string> = {
  standing: `${MASCOT_NAME} the husky, sitting and grinning`,
  peek: `${MASCOT_NAME} the husky peeking over the edge`,
  deliver: `${MASCOT_NAME} the husky delivering the paper on a skateboard`,
  asleep: `${MASCOT_NAME} the husky dozing on the bundles`,
  "on-pile": `${MASCOT_NAME} the husky sitting on a pile of papers`,
  lights: `${MASCOT_NAME} the husky tangled in fairy lights`,
  confused: `${MASCOT_NAME} the husky, puzzled, with a torn page`,
};

export const VIEW: Record<MascotPose, string> = {
  standing: "76 0 326 456",
  peek: "64 96 290 190",
  deliver: "20 0 404 486",
  asleep: "40 -40 400 520",
  "on-pile": "60 0 360 496",
  lights: "60 -10 360 466",
  confused: "20 -60 400 520",
};

export type Ctx = { k: MascotInks; w: number };

export const ln = (c: Ctx, f = 1) => ({
  stroke: c.k.line,
  strokeWidth: c.w * f,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
});

/** A traced drawing: its fills in the mascot's inks, then its black line work. */
export function ArtLayers({
  art,
  c,
  style,
  omitLines,
}: {
  art: Art;
  c: Ctx;
  style?: CSSProperties;
  /** Line paths (by index) to leave out, where an overlay redraws them. */
  omitLines?: readonly number[];
}) {
  const ink = (i: ArtInk) => c.k[i];
  return (
    <g style={style}>
      {art.fills.map(([i, d, x, y, s], n) => (
        <path key={n} d={d} fill={ink(i)} transform={`translate(${x} ${y}) scale(${s})`} />
      ))}
      {art.lines.map(([d, x, y, s], n) =>
        omitLines?.includes(n) ? null : (
          <path
            key={`l${n}`}
            d={d}
            fill={c.k.line}
            transform={`translate(${x} ${y}) scale(${s})`}
          />
        ),
      )}
    </g>
  );
}
