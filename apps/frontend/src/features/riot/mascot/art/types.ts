// A traced illustration: flat fills in named inks (drawn first), then black line work. Each path
// carries its own placement (translate, then scale) from the tracer. Generated from the owner's
// reference drawings (see README); edit the overlays in the pose files, not these paths.

export type ArtInk = "coat" | "soft" | "white" | "cream" | "eye" | "tongue";

export type Art = {
  w: number;
  h: number;
  /** [ink, d, translateX, translateY, scale] */
  fills: readonly (readonly [ArtInk, string, number, number, number])[];
  /** [d, translateX, translateY, scale] */
  lines: readonly (readonly [string, number, number, number])[];
};
