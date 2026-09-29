"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TZ_COOKIE } from "./timezone";

/**
 * Tells the server the reader's timezone, so the API serves the edition that has reached 07:00
 * where they are. The first visit renders with UTC; if the browser's zone differs, the cookie is
 * set and the page re-renders once with the right edition.
 */
export function TimezoneCookie() {
  const router = useRouter();
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;
    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${TZ_COOKIE}=`))
      ?.slice(TZ_COOKIE.length + 1);
    if (current && decodeURIComponent(current) === tz) return;
    document.cookie = `${TZ_COOKIE}=${encodeURIComponent(tz)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.refresh();
  }, [router]);
  return null;
}
