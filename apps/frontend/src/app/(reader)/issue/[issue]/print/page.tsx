import type { Metadata } from "next";
import Link from "next/link";
import { getEdition, issueParam } from "@/features/editions/api";
import { EditionPrintView } from "@/features/papers/edition-view";
import { issueHref } from "@/features/papers/reading";
import { PrintButton } from "@/features/reader/print-button";
import { previewFrom } from "../../../_preview";
import "@/features/reader/print-edition.css";

export async function generateMetadata({
  params,
}: PageProps<"/issue/[issue]/print">): Promise<Metadata> {
  const { issue } = await params;
  // A copy of pages that already have their own URLs; keep it out of search results.
  return { title: `Printable edition · No. ${issue} · The Yay News`, robots: { index: false } };
}

/**
 * The whole edition, every page in order, ready to print or save as a PDF from the browser's print
 * dialog. (No server-side PDF: the browser's own "Save as PDF" draws exactly what is on screen.)
 */
export default async function PrintableEditionPage({
  params,
  searchParams,
}: PageProps<"/issue/[issue]/print">) {
  const preview = await previewFrom(searchParams);
  const edition = await getEdition(issueParam((await params).issue), preview);
  return (
    <>
      <div className="sticky top-[env(safe-area-inset-top,0px)] z-40 flex justify-center px-3 pt-3 print:hidden">
        <nav
          aria-label="Printable edition"
          className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-3xl bg-black/85 px-3 py-2 font-sans text-xs text-white shadow-lg backdrop-blur sm:rounded-full"
        >
          <Link
            href={issueHref(edition.issueNumber)}
            className="rounded-full px-3 py-1 hover:bg-white/15"
          >
            ← Back to No. {edition.issueNumber}
          </Link>
          <span className="px-1 opacity-80">{edition.pages.length} pages · one sheet each</span>
          <PrintButton />
        </nav>
      </div>
      <main>
        <h1 className="sr-only">
          The Yay News, No. {edition.issueNumber}, {edition.date}: printable edition
        </h1>
        <EditionPrintView edition={edition} design={preview.design} />
      </main>
    </>
  );
}
