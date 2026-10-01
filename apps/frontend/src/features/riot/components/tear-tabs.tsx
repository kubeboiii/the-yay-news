import Link from "next/link";
import "../riot.css";

export type TearTab = {
  label: string;
  /** A link, or a button the caller wires (`onSelect`, from a client component). */
  href?: string;
  onSelect?: () => void;
};

/**
 * Tear-off tabs along the bottom of a flyer: one tab per way to pass it on, cut apart with
 * dashed lines, the labels running up the tab. Three is plenty.
 */
export function TearTabs({
  tabs,
  prompt = "Take one",
  className,
}: {
  tabs: readonly TearTab[];
  /** The line above the tabs. */
  prompt?: string;
  className?: string;
}) {
  return (
    <div className={`rt-tearoff ${className ?? ""}`}>
      {prompt ? <p className="rt-tearoff__prompt">{prompt}</p> : null}
      <ul className="rt-tabs">
        {tabs.map((t) => (
          <li key={t.label}>
            {t.href ? (
              <Link href={t.href} className="rt-tab">
                {t.label}
              </Link>
            ) : (
              <button type="button" className="rt-tab" onClick={t.onSelect}>
                {t.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
