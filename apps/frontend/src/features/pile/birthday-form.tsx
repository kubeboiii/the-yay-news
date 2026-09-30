const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Day and month (no year: nobody needs to tell us that), sent to /pile/birthday. */
export function BirthdayForm({ month, day }: { month?: number; day?: number }) {
  return (
    <form action="/pile/birthday" method="get" className="pl-bday">
      <label htmlFor="pl-bday-d" className="pl-search__label">
        The paper from your birthday
      </label>
      <div className="pl-search__row">
        <select id="pl-bday-d" name="d" defaultValue={day ?? ""} required className="pl-bday__sel">
          <option value="" disabled>
            Day
          </option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <select
          name="m"
          defaultValue={month ?? ""}
          required
          className="pl-bday__sel"
          aria-label="Month"
        >
          <option value="" disabled>
            Month
          </option>
          {MONTHS.map((name, i) => (
            <option key={name} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
        <button type="submit" className="pl-search__go">
          Find it
        </button>
      </div>
    </form>
  );
}
