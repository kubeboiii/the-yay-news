import type { PageProps } from "../types";
import { guestComposition } from "./compose";
import { folioDate, pad2 } from "./edition-data";
import { Folio, Masthead, MiniMark, Sheet, themeFor } from "./parts";
import { StoriesGrid } from "./section";

// The guest section: a visiting desk that has this page every other day. It prints as a pull-out
// inside the paper — a striped "Guest section" strip under the masthead and the stories on a tinted
// ground — in one of its own two compositions.

export function Guest({ edition, page, reading }: PageProps) {
  const section = page.section;
  const name = section?.name ?? "Guest section";
  const date = folioDate(edition.date);
  const composition = guestComposition(edition, page);

  return (
    <Sheet theme={themeFor(page.order + 1)} label={`${name}, page ${page.order}`}>
      <Masthead
        eyebrow={
          <MiniMark href={reading.pages[0]?.href ?? "/"}>
            Page {page.order} · Guest section · {date}
          </MiniMark>
        }
        title={name}
        size={{ measure: 158, max: 17.5 }}
        box={
          <>
            <span className="tb-box-num">{pad2(page.order)}</span>
            <span className="tb-box-words">
              Guest
              <small>section</small>
            </span>
          </>
        }
      />

      <div className="tb-guest-strip">
        <span className="tb-guest-strip-in tb-cond">Guest section</span>
        {section ? <span className="tb-guest-strip-note">{section.tagline}</span> : null}
      </div>

      <div className="tb-guest-ground">
        <StoriesGrid
          page={page}
          reading={reading}
          composition={composition}
          slug={section?.slug ?? ""}
        />
      </div>

      <Folio page={page.order} section={`Guest: ${name}`} date={date} next={reading.next} />
    </Sheet>
  );
}
