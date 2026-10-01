"use client";

import type { ReactNode } from "react";

/**
 * The riot kit's GoButton as an action rather than a link: the same slab (its .rt-go classes),
 * wired to a click handler, for the few screens whose one action happens on the page (accept the
 * welcome note, pack the wall into a code, add to the home screen).
 */
export function GoAction({
  children,
  sub,
  tone = "ink",
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  sub?: ReactNode;
  tone?: "ink" | "a" | "paper" | "quiet";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`rt-go rt-go--${tone} ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="rt-go__label">{children}</span>
      {sub ? <span className="rt-go__sub">{sub}</span> : null}
    </button>
  );
}
