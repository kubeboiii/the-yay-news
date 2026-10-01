import Link from "next/link";
import { MarkerCircle, MarkerUnderline } from "./marks";
import "../riot.css";

export type CutNavItem = {
  id: string;
  label: string;
  /** A short true line under the label: "No. 46", "9 back issues". */
  sub?: string;
  href: string;
};

/**
 * The main nav as slips of paper cut from the same sheet: straight, set in the one condensed
 * face, the place you're on ringed in marker (and aria-current). Presentational: pass the items
 * and which one is active. With `phone="tape"` (the default) it becomes the TapeBar on phones.
 */
export function CutNav({
  items,
  active,
  label = "Main",
  phone = "tape",
  className,
}: {
  items: readonly CutNavItem[];
  active?: string;
  label?: string;
  phone?: "tape" | "inline";
  className?: string;
}) {
  return (
    <nav
      className={`rt-cutnav ${phone === "tape" ? "rt-cutnav--tape" : ""} ${className ?? ""}`}
      aria-label={label}
    >
      <ul>
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <Link href={it.href} className="rt-slip" aria-current={on ? "page" : undefined}>
                <span className="rt-slip__label">{it.label}</span>
                {it.sub ? <span className="rt-slip__sub">{it.sub}</span> : null}
                {on ? (
                  <>
                    <MarkerCircle seed={`nav-${it.id}`} ink="a" className="rt-slip__ring" />
                    <MarkerUnderline seed={`navu-${it.id}`} ink="a" className="rt-slip__under" />
                  </>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * The phone nav: the same slips stuck to a strip of black tape along the bottom of the screen,
 * the active one underlined in marker. `docked={false}` lays it inline (kit sheets).
 */
export function TapeBar({
  items,
  active,
  label = "Main",
  docked = true,
  className,
}: {
  items: readonly CutNavItem[];
  active?: string;
  label?: string;
  docked?: boolean;
  className?: string;
}) {
  return (
    <nav
      className={`rt-tapebar ${docked ? "rt-tapebar--docked" : ""} ${className ?? ""}`}
      aria-label={label}
    >
      <ul>
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <Link href={it.href} className="rt-slip" aria-current={on ? "page" : undefined}>
                <span className="rt-slip__label">{it.label}</span>
                {it.sub ? <span className="rt-slip__sub">{it.sub}</span> : null}
                {on ? (
                  <MarkerUnderline seed={`tapeu-${it.id}`} ink="a" className="rt-slip__under" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
