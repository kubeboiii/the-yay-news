import type { Metadata } from "next";
import { rackFonts } from "@/features/archive/fonts";
import { KeptPapers } from "@/features/site/offline";
import "@/features/archive/archive.css";

export const metadata: Metadata = {
  title: "You're offline · The Yay News",
  robots: { index: false },
};

// Served by the service worker when there's no connection and no kept copy of the page asked for.
// Static, so the worker can keep it from the first visit.
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className={`ar-desk ${rackFonts}`}>
      <div className="ar-sign" role="group" aria-labelledby="off-title">
        <span className="ar-tape ar-tape--l" aria-hidden />
        <span className="ar-tape ar-tape--r" aria-hidden />
        <p className="ar-sign__kicker">The Yay News · no signal</p>
        <h1 id="off-title" className="ar-sign__title">
          You&rsquo;re offline
        </h1>
        <p className="ar-sign__sub">
          No connection, but the papers you&rsquo;ve opened are still here.
        </p>
        <KeptPapers />
      </div>
    </main>
  );
}
