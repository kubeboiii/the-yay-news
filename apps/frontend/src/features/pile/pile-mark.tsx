"use client";

import { usePaperStatuses } from "@/features/site/status";
import "./pile.css";

/**
 * What the reader did with a copy, marked on it: a pink stamp once finished (blue, "late", when it
 * was finished after its day), a folded-down corner once started, nothing while it's still crisp.
 */
export function PileMark({ issue }: { issue: number }) {
  const status = usePaperStatuses()(issue);
  if (status.state === "unread") return null;
  if (status.state === "started") {
    return (
      <span className="pl-ear" title="Started">
        <span className="sr-only">Started</span>
      </span>
    );
  }
  const late = status.state === "late";
  return (
    <span className={late ? "pl-stamp pl-stamp--late" : "pl-stamp"}>
      <span className="pl-stamp__big">{late ? "Late" : "Read"}</span>
      <span className="pl-stamp__small">No. {issue}</span>
    </span>
  );
}
