import { rackFonts } from "@/features/archive/fonts";
import { KeepPreview } from "@/features/editions/keep-preview";
import { TimezoneCookie } from "@/features/editions/timezone-cookie";
import { PastelStyles } from "@/features/print/colourways/pastel-styles";
import { PressFilter } from "@/features/print/press-filter";
import { SiteBar } from "@/features/site/site-bar";
import "@/features/print/print.css";
import "@/features/print/colourways/neon.css";

// `sheet` is the story sheet: a story opened from inside the paper slides up over the page it was
// on (app/(reader)/@sheet), so closing it leaves the reader exactly where they were. Opened from
// anywhere else (a shared link, a search result), a story gets its own page.
export default function ReaderLayout({ children, sheet }: LayoutProps<"/">) {
  return (
    <>
      <PressFilter />
      <PastelStyles />
      <TimezoneCookie />
      {process.env.NODE_ENV !== "production" ? <KeepPreview /> : null}
      <SiteBar fonts={rackFonts} />
      {children}
      {sheet}
    </>
  );
}
