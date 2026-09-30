import { permanentRedirect } from "next/navigation";

/** Kept stories are the clippings pinned to Your Wall. */
export default function SavedPage() {
  permanentRedirect("/wall");
}
