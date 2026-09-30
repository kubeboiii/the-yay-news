import { SEARCH_MAX, SEARCH_MIN } from "@repo/shared";

/** A plain GET form to /pile/search, so it works before (and without) any JavaScript. */
export function SearchBox({ initial = "" }: { initial?: string }) {
  return (
    <form action="/pile/search" method="get" role="search" className="pl-search">
      <label htmlFor="pl-q" className="pl-search__label">
        Find a story again
      </label>
      <div className="pl-search__row">
        <input
          id="pl-q"
          name="q"
          type="search"
          defaultValue={initial}
          minLength={SEARCH_MIN}
          maxLength={SEARCH_MAX}
          required
          placeholder="octopus, Mars, Elvis…"
          className="pl-search__input"
        />
        <button type="submit" className="pl-search__go">
          Search
        </button>
      </div>
    </form>
  );
}
