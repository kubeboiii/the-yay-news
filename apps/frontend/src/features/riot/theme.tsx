import type { EditionDesign } from "@repo/shared";
import type { CSSProperties, ReactNode } from "react";
import { riotFonts } from "./tokens/fonts";
import { type RiotInks, riotInks } from "./tokens/inks";
import "./riot.css";

/**
 * Sets the day's inks and the kit's type on a subtree. Pass `inks` computed once on the server
 * (`riotInks({ design, colourway })`), or a `colourway` (and `design`) to compute them here.
 * `surface` paints the paper and its grain on the element itself.
 */
export function RiotTheme({
  inks,
  colourway = "original",
  design = "broadsheet",
  as: Tag = "div",
  surface = true,
  className,
  style,
  children,
  ...rest
}: {
  inks?: RiotInks;
  colourway?: string;
  design?: EditionDesign;
  as?: "div" | "main" | "section" | "body";
  surface?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const t = inks ?? riotInks({ design, colourway });
  return (
    <Tag
      className={`rt ${surface ? "rt--surface" : ""} ${riotFonts} ${className ?? ""}`}
      style={{ ...(t.vars as CSSProperties), ...style }}
      data-colourway={t.slug}
      {...rest}
    >
      {children}
    </Tag>
  );
}
