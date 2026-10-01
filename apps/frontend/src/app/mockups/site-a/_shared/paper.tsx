import type { Edition } from "@repo/shared";
import type { CSSProperties } from "react";
import { PastelStyles } from "@repo/ui/print/colourways/pastel-styles";
import { PressFilter } from "@repo/ui/print/press-filter";
import { Balance } from "@/features/papers/balance";
import { withOnePictureGroup } from "@/features/papers/plates";
import { readingFor } from "@/features/papers/reading";
import { papers } from "@/features/papers/registry";
import type { PageProps } from "@/features/papers/types";
import "@repo/ui/print/print.css";
import "@repo/ui/print/colourways/neon.css";

/**
 * One real page of the edition, printed by its own design, with none of the live site's chrome
 * around it (no pill pager, no share bar): the mockups supply their own.
 */
export function PrintedPaper({ edition: whole, order = 1 }: { edition: Edition; order?: number }) {
  const edition = withOnePictureGroup(whole);
  const page = edition.pages.find((p) => p.order === order) ?? edition.pages[0]!;
  const paper = papers[edition.design];
  const props: PageProps = { edition, page, reading: readingFor(edition, page) };
  const printed =
    page.layout === "front" ? (
      <paper.Front {...props} />
    ) : page.layout === "back" ? (
      <paper.Back {...props} />
    ) : page.layout === "guest" ? (
      <paper.Guest {...props} />
    ) : (
      <paper.Section {...props} />
    );
  return (
    <>
      <PressFilter />
      <PastelStyles />
      <paper.Frame colourway={edition.colourway}>
        <Balance />
        <div
          className="yn-sec"
          data-section={page.section?.slug}
          style={
            page.section
              ? ({ "--section-colour": page.section.colour } as CSSProperties)
              : undefined
          }
        >
          {printed}
        </div>
      </paper.Frame>
    </>
  );
}
