import type { CardType, Rarity } from "./types";

// Small printed marks for the cards: one glyph per type (the type badge) and one per rarity (the
// rarity mark), drawn as simple filled shapes so they print in one ink like a rubber stamp.

export function TypeGlyph({ type, className }: { type: CardType; className?: string }) {
  const p = { className, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (type) {
    case "animal":
      return (
        <svg {...p}>
          <ellipse cx="12" cy="16" rx="5" ry="4.2" />
          <ellipse cx="6" cy="10" rx="2" ry="2.6" />
          <ellipse cx="10" cy="6.5" rx="2" ry="2.6" />
          <ellipse cx="14.5" cy="6.5" rx="2" ry="2.6" />
          <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
        </svg>
      );
    case "hero":
      return (
        <svg {...p}>
          <path d="M12 1.8l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9l7.1-.6z" />
        </svg>
      );
    case "record":
      return (
        <svg {...p}>
          <path d="M6 3h12v3h3v2.5c0 2.6-2 4.6-4.4 4.9A6 6 0 0 1 13.3 16v2.2H17V21H7v-2.8h3.7V16a6 6 0 0 1-3.3-2.6A5 5 0 0 1 3 8.5V6h3zm0 5V8H5v.5c0 1.3.8 2.4 2 2.8A6 6 0 0 1 6 9zm12 0v1a6 6 0 0 1-1 2.3c1.2-.4 2-1.5 2-2.8V8z" />
        </svg>
      );
    case "internet":
      return (
        <svg {...p}>
          <path d="M5 2h2v2h2v2h2v2h2v2h2v2h2v2h-4v2h2v2h-2v2h-2v-2h-2v-2H9v2H5z" />
        </svg>
      );
    case "sports":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M12 7.2l3.3 2.4-1.3 3.9h-4l-1.3-3.9z" fill="var(--glyph-cut, #fff)" />
        </svg>
      );
    case "music":
      return (
        <svg {...p}>
          <path d="M9 4.5l11-2.5v13.2a3.2 3.2 0 1 1-2-3V6.6L11 8.2v9.5a3.2 3.2 0 1 1-2-3z" />
        </svg>
      );
    case "play":
      return (
        <svg {...p}>
          <path d="M7 6h10a5 5 0 0 1 5 5v2a5 5 0 0 1-8.6 3.4h-2.8A5 5 0 0 1 2 13v-2a5 5 0 0 1 5-5zm-.8 3v2h-2v2h2v2h2v-2h2v-2h-2V9zm10.3 1a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm-2.4 2.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
        </svg>
      );
    case "screen":
      return (
        <svg {...p}>
          <path d="M3 8h18v12H3zm0-1.5L19.5 2l.8 2.9L6.6 8.6H3.4zM6 3.4l2.4 2.1M12 2.3l2.4 2" />
        </svg>
      );
    case "space":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="5.6" />
          <path
            d="M3 16.5c-1.5-1.8 2.5-5 8.8-7.4s12-2.6 12.2-.3-2.4 3.6-6 5.3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            transform="translate(-1.5 0)"
          />
        </svg>
      );
    case "tech":
      return (
        <svg {...p}>
          <path d="M13.5 1.5L4 13.5h6.5L9 22.5l10.5-12.8h-6.8z" />
        </svg>
      );
    case "money":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9.5" />
          <path
            d="M14.6 8.6c-.5-.9-1.5-1.4-2.7-1.4-1.6 0-2.7.9-2.7 2.1 0 2.9 5.6 1.6 5.6 4.6 0 1.3-1.2 2.2-2.9 2.2-1.3 0-2.4-.6-2.9-1.6M12 5.6v12.8"
            fill="none"
            stroke="var(--glyph-cut, #fff)"
            strokeWidth="1.6"
          />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="5" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect
              key={i}
              x="11"
              y="1"
              width="2"
              height="4.5"
              rx="1"
              transform={`rotate(${i * 45} 12 12)`}
            />
          ))}
        </svg>
      );
  }
}

export function RarityGlyph({ rarity, className }: { rarity: Rarity; className?: string }) {
  const p = { className, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (rarity) {
    case "common":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="6" />
        </svg>
      );
    case "rare":
      return (
        <svg {...p}>
          <path d="M12 2.5l7.5 9.5-7.5 9.5-7.5-9.5z" />
        </svg>
      );
    case "epic":
      return (
        <svg {...p}>
          <path d="M12 1.5l2.6 7.1 7.4.3-5.8 4.6 2 7.2L12 16.6l-6.2 4.1 2-7.2L2 8.9l7.4-.3z" />
        </svg>
      );
    case "legendary":
      return (
        <svg {...p}>
          <path d="M2.5 7.5l5 4 4.5-7 4.5 7 5-4-2 11.5h-15zM5 20h14v2H5z" />
        </svg>
      );
  }
}
