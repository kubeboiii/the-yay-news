import type { CSSProperties, ReactNode } from "react";
import { Pip, type PipInks } from "@/app/mockups/site-a/_shared/pip";

// Direction C's comic-book parts: inked panels, speech balloons with a tail, caption boxes,
// sound effects, and Pip in his Saturday-cartoon ink.

export const TOON_PIP: Partial<PipInks> = {
  line: "var(--sc-ink)",
  cap: "var(--sc-l1)",
  bag: "var(--sc-l0)",
  neck: "var(--sc-l4)",
  neck2: "var(--sc-l3)",
};

export function Panel({
  children,
  ground = "s0",
  className,
  style,
  label,
  dots,
}: {
  children: ReactNode;
  /** A palette ground: s0…s5 or l0…l5. */
  ground?: string;
  className?: string;
  style?: CSSProperties;
  label?: string;
  /** Ben-Day dots in the panel's ground. */
  dots?: boolean;
}) {
  return (
    <section
      className={`sc-panel ${dots ? "sc-panel--dots" : ""} ${className ?? ""}`}
      style={{ "--pg": `var(--sc-${ground})`, ...style } as CSSProperties}
      aria-label={label}
    >
      {children}
    </section>
  );
}

export function Balloon({
  children,
  tail = "bl",
  className,
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Where the tail points: bottom-left, bottom-right, left, right. */
  tail?: "bl" | "br" | "l" | "r";
  className?: string;
  style?: CSSProperties;
  as?: "div" | "p" | "h1" | "h2";
}) {
  return (
    <Tag className={`sc-balloon sc-balloon--${tail} ${className ?? ""}`} style={style}>
      {children}
      <svg viewBox="0 0 34 34" className="sc-balloon__tail" aria-hidden focusable="false">
        <path d="M2 0 L32 0 L6 32 Z" fill="#fff" />
        <path
          d="M2 0.5 L6 32 L32 0.5"
          fill="none"
          stroke="var(--sc-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </Tag>
  );
}

export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`sc-caption ${className ?? ""}`}>{children}</p>;
}

export function Sfx({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span aria-hidden className={`sc-sfx ${className ?? ""}`} style={style}>
      {children}
    </span>
  );
}

export function ToonPip(props: Omit<Parameters<typeof Pip>[0], "look" | "inks">) {
  return <Pip {...props} look="toon" inks={TOON_PIP} />;
}
