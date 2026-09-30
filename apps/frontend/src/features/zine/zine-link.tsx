"use client";

import type { ReactNode } from "react";

/**
 * A link that downloads an edition's mini zine PDF (/issue/<n>/zine), keeping a `?now=` preview
 * clock outside production so a previewed paper's zine matches it.
 */
export function ZineLink({
  issue,
  className,
  children,
}: {
  issue: number;
  className?: string;
  children: ReactNode;
}) {
  const href = `/issue/${issue}/zine`;
  return (
    <a
      href={href}
      download={`the-yay-news-${issue}-mini-zine.pdf`}
      className={className}
      onClick={(e) => {
        const now = new URLSearchParams(window.location.search).get("now");
        if (now) e.currentTarget.href = `${href}?now=${encodeURIComponent(now)}`;
      }}
    >
      {children}
    </a>
  );
}
