import Link from "next/link";
import type { ReactNode } from "react";
import "../riot.css";

/**
 * The one thing to do on a screen: a big guillotine-cut slab of black (or plate A), with a line
 * under the label saying where it goes. `quiet` is the secondary action: a plain underlined link.
 * A link when given `href`, otherwise a button.
 */
export function GoButton({
  children,
  sub,
  href,
  tone = "ink",
  type = "button",
  scroll,
  className,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  /** Where it goes / what happens, in plain words. */
  sub?: ReactNode;
  href?: string;
  tone?: "ink" | "a" | "paper" | "quiet";
  type?: "button" | "submit";
  scroll?: boolean;
  className?: string;
  /** A button's action, or a link's side effect (closing an overlay). From client callers. */
  onClick?: () => void;
  /** Buttons only. */
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const cls = `rt-go rt-go--${tone} ${className ?? ""}`;
  const body = (
    <>
      <span className="rt-go__label">{children}</span>
      {sub ? <span className="rt-go__sub">{sub}</span> : null}
    </>
  );
  return href ? (
    <Link href={href} scroll={scroll} className={cls} aria-label={ariaLabel} onClick={onClick}>
      {body}
    </Link>
  ) : (
    <button
      type={type}
      className={cls}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {body}
    </button>
  );
}
