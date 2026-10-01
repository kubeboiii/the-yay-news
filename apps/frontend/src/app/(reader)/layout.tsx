import { getToday } from "@/features/editions/api";
import { KeepPreview } from "@/features/editions/keep-preview";
import { TimezoneCookie } from "@/features/editions/timezone-cookie";
import { RiotTheme, riotInks } from "@/features/riot";
import { ServiceWorker } from "@/features/site/offline";
import { SiteBar } from "@/features/site/site-bar";
import { PastelStyles } from "@repo/ui/print/colourways/pastel-styles";
import { PressFilter } from "@repo/ui/print/press-filter";
import "@repo/ui/print/print.css";
import "@repo/ui/print/colourways/neon.css";
import "@/features/site/riot-site.css";

// Every reader page sits in the riot kit's theme, inked in today's paper's two plates (Direction B,
// "Riso Zine Riot"), under the masthead. `sheet` is the story sheet: a story opened from inside the
// paper slides up over the page it was on (app/(reader)/@sheet), so closing it leaves the reader
// exactly where they were. Opened from anywhere else (a shared link, a search), it gets its own page.
export default async function ReaderLayout({ children, sheet }: LayoutProps<"/">) {
  const today = await getToday().catch(() => null);
  const inks = riotInks({
    design: today?.design,
    colourway: today?.colourway ?? "original",
  });
  return (
    <RiotTheme inks={inks} className="sb">
      <PressFilter />
      <PastelStyles />
      <TimezoneCookie />
      <ServiceWorker />
      {process.env.NODE_ENV !== "production" ? <KeepPreview /> : null}
      <a className="sb-skip" href="#main">
        Skip to the page
      </a>
      <SiteBar todayIssue={today?.issueNumber ?? null} />
      <div id="main">{children}</div>
      {sheet}
    </RiotTheme>
  );
}
