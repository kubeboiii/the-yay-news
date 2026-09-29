import type { Metadata } from "next";
import Link from "next/link";
import { rackFonts } from "@/features/archive/fonts";
import "@/features/archive/archive.css";

export const metadata: Metadata = { title: "Not printed yet · The Yay News" };

/**
 * For a page the paper doesn't have: an unknown issue, page or story, or an edition that exists
 * but hasn't reached 07:00 where the reader is yet.
 */
export default function ReaderNotFound() {
  return (
    <main className={`ar-desk ${rackFonts}`}>
      <div className="ar-sign" role="group" aria-labelledby="nf-title">
        <span className="ar-tape ar-tape--l" aria-hidden />
        <span className="ar-tape ar-tape--r" aria-hidden />
        <p className="ar-sign__kicker">The Yay News · stop press</p>
        <h1 id="nf-title" className="ar-sign__title">
          Not printed yet
        </h1>
        <p className="ar-sign__sub">This page hasn&rsquo;t been printed yet.</p>
        <p className="ar-sign__note">
          Either it doesn&rsquo;t exist, or it&rsquo;s still on the press: each edition lands at 7am
          where you are. The presses are warm and the ink is mixed.
        </p>
        <p className="ar-nf__links">
          <Link href="/" className="ar-ticket">
            Read today&rsquo;s paper
          </Link>
          <Link href="/archive" className="ar-ticket">
            Browse back issues
          </Link>
        </p>
      </div>
    </main>
  );
}
