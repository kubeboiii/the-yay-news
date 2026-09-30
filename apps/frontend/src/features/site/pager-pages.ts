import type { Edition } from "@repo/shared";
import { pageLinks } from "@/features/papers/reading";

/** One page of the edition as the pager lists it: where it is, what it's called, its ink. */
export type PagerPage = { order: number; label: string; href: string; colour: string };

const FRONT_INK = "#e9ff1f";
const BACK_INK = "#ff4fb8";

export function pagerPages(edition: Edition): PagerPage[] {
  const byOrder = new Map(edition.pages.map((p) => [p.order, p]));
  return pageLinks(edition).map((l) => {
    const p = byOrder.get(l.order);
    const colour =
      p?.layout === "front"
        ? FRONT_INK
        : p?.layout === "back"
          ? BACK_INK
          : (p?.section?.colour ?? FRONT_INK);
    return { order: l.order, label: l.label, href: l.href, colour };
  });
}
