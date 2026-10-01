// Hand-drawn nav glyphs for direction C (authored paths, not an icon library): a folded paper, a
// wobbly stack, a push-pin. Chunky ink, one fill each.

const LINE = {
  stroke: "var(--sc-ink)",
  strokeWidth: 3.2,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

export function GlyphToday() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden focusable="false" className="sc-glyph">
      <path d="M7 9 L27 7 L33 12 L32 33 L8 34 Z" fill="var(--sc-paper)" {...LINE} />
      <path d="M27 7 L27.5 12.5 L33 12" fill="none" {...LINE} />
      <path d="M12 15 H25 M12 20 H28 M12 25 H22" fill="none" {...LINE} strokeWidth={2.4} />
    </svg>
  );
}

export function GlyphPile() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden focusable="false" className="sc-glyph">
      <path d="M6 28 L33 26 L34 33 L7 35 Z" fill="var(--sc-l2)" {...LINE} />
      <path d="M8 20 L32 19 L32.5 26 L8.5 27.5 Z" fill="var(--sc-l0)" {...LINE} />
      <path d="M10 12 L30 11.5 L31 19 L9.5 20 Z" fill="var(--sc-l3)" {...LINE} />
      <path d="M13 5.5 L28 5 L29 11.5 L12.5 12 Z" fill="var(--sc-paper)" {...LINE} />
    </svg>
  );
}

export function GlyphWall() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden focusable="false" className="sc-glyph">
      <path d="M8 12 L32 10 L33 34 L9 35 Z" fill="var(--sc-paper)" {...LINE} />
      <path
        d="M13 22 L19 17 L24 23 L28 20 L30 30 L12 31 Z"
        fill="var(--sc-l4)"
        {...LINE}
        strokeWidth={2.4}
      />
      <circle cx="20" cy="9" r="4.5" fill="var(--sc-l1)" {...LINE} />
    </svg>
  );
}

/** A chunky hand-drawn arrow, pointing right (flip it with CSS for left). */
export function GlyphArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" aria-hidden focusable="false" className={className}>
      <path
        d="M4 13 C14 12 24 13 30 12 L28 4 L45 16 L28 28 L30 20 C22 20 13 21 4 20 Z"
        fill="var(--sc-paper)"
        {...LINE}
      />
    </svg>
  );
}
