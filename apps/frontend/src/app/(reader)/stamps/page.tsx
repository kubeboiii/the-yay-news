import { permanentRedirect } from "next/navigation";

/** The stamp book now hangs on Your Wall. */
export default function StampsPage() {
  permanentRedirect("/wall#stamps");
}
