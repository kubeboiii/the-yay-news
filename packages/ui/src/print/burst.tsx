import type { ReactNode } from "react";

/**
 * A jagged badge like a printer's sticker. Points are computed rather than random, so the shape
 * is identical on every render. `wobble` > 0 rounds the teeth into a cloud-like edge. `fill`
 * accepts any CSS colour, including var(--…), so a theme can recolour stickers.
 */
export function Burst({
  children,
  fill,
  points = 26,
  depth = 0.1,
  wobble = 0,
  className,
}: {
  children: ReactNode;
  fill: string;
  points?: number;
  depth?: number;
  wobble?: number;
  className?: string;
}) {
  const pts = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? 50 : 50 * (1 - depth);
    const a = (Math.PI * i) / points - Math.PI / 2;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)] as const;
  });
  const d =
    wobble > 0
      ? pts
          .map(([x, y], i) => {
            const [nx, ny] = pts[(i + 1) % pts.length] ?? pts[0]!;
            const mx = (x + nx) / 2;
            const my = (y + ny) / 2;
            return `${i === 0 ? `M${mx.toFixed(2)},${my.toFixed(2)}` : ""} Q${x.toFixed(2)},${y.toFixed(2)} ${mx.toFixed(2)},${my.toFixed(2)}`;
          })
          .join(" ") + " Z"
      : `M${pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L")} Z`;
  return (
    <div className={`relative ${className ?? ""}`}>
      <svg viewBox="0 0 100 100" className="block h-auto w-full" aria-hidden>
        <path d={d} style={{ fill }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-[15%]">{children}</div>
    </div>
  );
}
