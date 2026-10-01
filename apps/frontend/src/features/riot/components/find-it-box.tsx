import Link from "next/link";
import type { ReactNode } from "react";
import "../riot.css";

export type FindHit = { key: string; href: string; meta: string; title: string };

/**
 * The search box: a plain GET form (works without JavaScript), a big label, the field and one
 * button; then a count and the first few hits. Results are the caller's.
 */
export function FindItBox({
  action,
  name = "q",
  defaultValue,
  label = "Find it",
  placeholder,
  button = "Search",
  count,
  hits = [],
  id = "rt-find",
  className,
  children,
}: {
  action: string;
  name?: string;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  button?: string;
  /** "12 hits for 'octopus'" */
  count?: ReactNode;
  hits?: readonly FindHit[];
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <form className={`rt-find ${className ?? ""}`} action={action} role="search">
      <label htmlFor={id} className="rt-find__label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="search"
        defaultValue={defaultValue}
        className="rt-find__input"
        placeholder={placeholder}
        autoComplete="off"
      />
      <button type="submit" className="rt-find__go">
        {button}
      </button>
      {count ? <p className="rt-find__count">{count}</p> : null}
      {hits.length ? (
        <ul className="rt-find__hits">
          {hits.map((h) => (
            <li key={h.key}>
              <Link href={h.href}>
                <span className="rt-find__meta">{h.meta}</span>
                <span className="rt-find__head">{h.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {children}
    </form>
  );
}
