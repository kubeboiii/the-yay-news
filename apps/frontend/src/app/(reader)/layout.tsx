import { KeepPreview } from "@/features/editions/keep-preview";
import { TimezoneCookie } from "@/features/editions/timezone-cookie";
import { PastelStyles } from "@/features/print/colourways/pastel-styles";
import { PressFilter } from "@/features/print/press-filter";
import "@/features/print/print.css";
import "@/features/print/colourways/neon.css";

export default function ReaderLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <PressFilter />
      <PastelStyles />
      <TimezoneCookie />
      {process.env.NODE_ENV !== "production" ? <KeepPreview /> : null}
      {children}
    </>
  );
}
