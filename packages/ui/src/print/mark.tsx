import type { CSSProperties } from "react";

/**
 * A real hand-drawn mark (arrow, circle, scribble, star, doodle) from public/mockup/marks, printed
 * in any ink. The file supplies only the stroke shape; the colour comes from `ink` (or
 * currentColor), so the same arrow can be fluoro pink on one page and ink black on another.
 * Size it with width/height classes; it keeps the drawing's proportions.
 */
export function Mark({
  name,
  ink = "currentColor",
  className,
  style,
}: {
  name: string;
  ink?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const url = `url(/mockup/marks/${name}.png)`;
  return (
    <span
      aria-hidden
      className={`inline-block ${className ?? ""}`}
      style={{
        backgroundColor: ink,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        ...style,
      }}
    />
  );
}
