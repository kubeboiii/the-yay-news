// The riot kit: Direction B "Riso Zine Riot" as reusable, presentational parts. Data and routing
// stay with the callers. See README.md for every component's props.

export { RiotTheme } from "./theme";
export { riotInks, type RiotInks } from "./tokens/inks";
export { contrast, type Palette, paletteFor, paletteVars, textOn } from "./tokens/palette";
export { riotFonts } from "./tokens/fonts";
export { type Edge, edgePath, type Side } from "./tokens/edges";
export { type Fade, halftonePath } from "./tokens/halftone";
export { rand, tilt } from "./tokens/seed";

export { useTurnKeys } from "./hooks/use-turn-keys";

export {
  composeCuts,
  type Cut,
  type CutGround,
  type CutSource,
  GAP,
  RansomHeading,
} from "./components/ransom";
export {
  type Ground,
  Halftone,
  Heading,
  Misprint,
  RubberStamp,
  Scrap,
  Sticker,
  Tape,
  type TapeAt,
} from "./components/paper";
export { HandArrow, MarkerCircle, MarkerUnderline } from "./components/marks";
export { GoButton } from "./components/go-button";
export { Poster } from "./components/poster";
export { Receipt, type ReceiptLine } from "./components/receipt";
export { type TearTab, TearTabs } from "./components/tear-tabs";
export { type FindHit, FindItBox } from "./components/find-it-box";
export { Tracklist, type TrackPage } from "./components/tracklist";
export { CutNav, type CutNavItem, TapeBar } from "./components/cut-nav";

export { Mascot, MASCOT_INKS, MASCOT_POSES, type MascotInks, type MascotPose } from "./mascot/odin";
export { MASCOT_NAME } from "./mascot/name";
