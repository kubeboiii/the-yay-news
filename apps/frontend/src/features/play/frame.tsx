"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { hand } from "./fonts";
import { paperStyle } from "./paper-style";
import { PlayDefs } from "./pencil";
import type { PlayStyleProps } from "./types";
import "./play.css";

/**
 * The box every puzzle sits in: its printed title, the handwriting font and ink variables, and
 * the pencil filters. It adds no background or border of its own, so it prints straight onto
 * whatever page it is embedded in.
 */
export function PlayFrame({
  kind,
  title,
  kicker,
  children,
  inks,
  className,
  style,
  headingLevel = 3,
  hideTitle,
}: {
  kind: string;
  title: string;
  kicker?: ReactNode;
  children: (headingId: string) => ReactNode;
} & PlayStyleProps) {
  const id = useId();
  const H = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <section
      className={`pl-root pl-${kind} ${hand.variable} ${className ?? ""}`}
      style={paperStyle(inks, style)}
      aria-labelledby={id}
    >
      <PlayDefs />
      <header className={hideTitle ? "pl-sr" : "pl-head"}>
        <H id={id} className="pl-title">
          {title}
        </H>
        {kicker ? <p className="pl-kicker">{kicker}</p> : null}
      </header>
      {children(id)}
    </section>
  );
}
