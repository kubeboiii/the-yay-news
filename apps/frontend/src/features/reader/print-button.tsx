"use client";

/** Opens the browser's print dialog, where "Save as PDF" is one of the printers. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-white px-4 py-1.5 font-semibold text-black hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      Print or save as PDF
    </button>
  );
}
