import type { CSSProperties, ReactNode } from "react";
import { type Edge, edgePath, type Side } from "../tokens/edges";
import { type Fade } from "../tokens/halftone";
import { Halftone, Tape } from "./paper";
import "../riot.css";

/**
 * A poster: one big flat area of plate A (or B, or paper), the loud thing on a screen. `paste`
 * wheatpastes it to the wall: xerox grain and toner speckle in the ink, wrinkles where the paste
 * dried, darker at the edges, torn along the bottom and taped at the top corners.
 */
export function Poster({
  children,
  seed,
  ground = "a",
  paste = true,
  screen,
  edge,
  sides,
  as: Tag = "section",
  className,
  style,
  ...aria
}: {
  children: ReactNode;
  seed: string;
  ground?: "a" | "b" | "paper";
  paste?: boolean;
  /** Defaults to torn (bottom and right) when pasted, guillotine-cut otherwise. */
  edge?: Edge;
  sides?: readonly Side[];
  /**
   * A halftone screen of the other plate printed into the sheet (clipped to its edge), so it
   * overprints. `area` is where it sits, as CSS inset.
   */
  screen?: {
    fade?: Fade;
    ink?: "a" | "b" | "k";
    density?: number;
    pitch?: number;
    area?: string;
    w?: number;
    h?: number;
  };
  as?: "section" | "div" | "article";
  className?: string;
  style?: CSSProperties;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}) {
  const e = edge ?? (paste ? "torn" : "cut");
  const s = sides ?? (paste ? ["bottom", "right"] : undefined);
  return (
    <Tag
      className={`rt-poster rt-poster--${ground} ${paste ? "rt-poster--paste" : ""} ${className ?? ""}`}
      style={style}
      {...aria}
    >
      <span className="rt-poster__sheet" aria-hidden style={{ clipPath: edgePath(e, seed, s) }}>
        {screen ? (
          <Halftone
            seed={`${seed}-screen`}
            fade={screen.fade}
            ink={screen.ink ?? (ground === "b" ? "a" : "b")}
            density={screen.density}
            pitch={screen.pitch}
            w={screen.w}
            h={screen.h}
            style={screen.area ? { inset: screen.area, width: "auto", height: "auto" } : undefined}
          />
        ) : null}
      </span>
      {paste ? (
        <>
          <Tape at="top-left" seed={`${seed}-tl`} className="rt-poster__tape" />
          <Tape at="top-right" seed={`${seed}-tr`} className="rt-poster__tape" />
        </>
      ) : null}
      {children}
    </Tag>
  );
}
