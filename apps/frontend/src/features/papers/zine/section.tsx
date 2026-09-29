import type { Edition, StoryItem } from "@repo/shared";
import Link from "next/link";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";
import type { PageProps, Reading } from "../types";
import {
  AlsoInside,
  Across,
  Doodle,
  Body,
  Byline,
  Credit,
  Folio,
  Head,
  OnFold,
  Page,
  Photo,
  Print,
  printNote,
  Pull,
  ReadOn,
  Ringed,
  RunningHead,
  Spread,
  Tape,
  TurnOver,
} from "./parts";
import { byOrder, fitSize, folios, groundsFor, headSize, pullQuote, shortDate } from "./text";

/*
 * A core section prints as one spread. The first story (the page's lead or feature) opens on the
 * left page under the section's head; the others run as briefs on the right. With a single story
 * the story takes the whole spread: its head and picture on the left, its text on the right. Every
 * spread ends with a "turn over" card for the next page.
 *
 * Screen & Sound and Gaming keep the mockup's flourishes (a film strip and an admission ticket; the
 * pixel-mosaic head and a game cartridge); every other section prints through the generic template.
 */

type Flavour = "plain" | "screen" | "gaming";

const flavourOf = (slug: string): Flavour =>
  slug === "screen-and-sound" ? "screen" : slug === "gaming" ? "gaming" : "plain";

export function Section({ edition, page, reading }: PageProps) {
  const slug = page.section?.slug ?? reading.current.slug;
  const name = page.section?.name ?? reading.current.label;
  const tagline = page.section?.tagline ?? "";
  const flavour = flavourOf(slug);
  const stories = byOrder(page.stories);
  const [first, ...rest] = stories;
  const [gl, gr] = groundsFor(slug, page.order);
  const [lf, rf] = folios(reading, page.order);
  const date = shortDate(edition.date);
  const size = fitSize(name, 300, 23, 12);
  // The right page's spare room: a brief with a picture fills most of it.
  const rightPictures = rest.filter((s) => s.images.length > 0).length;
  const roomy = rest.length === 0 || (rest.length === 1 && rightPictures === 0);
  // A lone story's right page also carries the big teasers, so its pull quote only fits a short body.
  const bodyChars = stories.reduce((n, s) => n + s.body.join("").length, 0);
  const pull =
    (rest.length === 0 && bodyChars < 260) || (rest.length === 1 && rightPictures === 0)
      ? pullQuote(stories)
      : null;
  const sticker = stories.find((s) => s.sticker)?.sticker ?? null;
  // A single story takes the whole spread: its head (and print) left, its text right.
  const textRight = !!first && rest.length === 0;
  // Short days set bigger, so a spread with little copy still reads as a full page.
  const chars = stories.reduce((n, s) => n + s.body.join("").length + s.dek.length, 0);
  const density = chars < 420 * Math.max(stories.length, 1) ? "zs-sparse" : "";
  const head = (side: "left" | "right") =>
    flavour === "gaming" ? null : (
      <Across side={side} height={size + 9}>
        <Head as={side === "left" ? "h1" : "div"} top={tagline} bottom={name} size={size} />
      </Across>
    );

  return (
    <Spread label={`${name} spread`}>
      <Page ground={gl} side="left" className={density}>
        <RunningHead>The Yay Zine · {name}</RunningHead>
        {flavour === "gaming" ? (
          <GamingMast name={name} tagline={tagline} issue={edition.issueNumber} />
        ) : (
          head("left")
        )}
        {first ? (
          <>
            <Lead story={first} flavour={flavour} reading={reading} alone={rest.length === 0} />
            {textRight ? null : (
              <LeadText
                story={first}
                flavour={flavour}
                reading={reading}
                edition={edition}
                folio={lf}
              />
            )}
          </>
        ) : (
          <p className="zs-empty">Nothing in {name} today. Back tomorrow.</p>
        )}
        {density && first && first.images.length === 0 ? (
          <Doodle slug={slug} next={reading.next?.label ?? null} />
        ) : null}
        <Folio n={lf} date={date} />
      </Page>

      <Page ground={gr} side="right" className={density}>
        <RunningHead>The Yay Zine · {name}</RunningHead>
        {head("right")}
        {first && textRight ? (
          <LeadText
            story={first}
            flavour={flavour}
            reading={reading}
            edition={edition}
            folio={lf}
            alone
          />
        ) : rest.length ? (
          <div className={`zs-briefs zs-briefs--${rest.length}`}>
            {rest.map((s, i) => (
              <Brief
                key={s.slug}
                story={s}
                flavour={flavour}
                reading={reading}
                i={i}
                count={rest.length}
              />
            ))}
          </div>
        ) : null}
        {pull ? <Pull text={pull} className="zs-pull" /> : null}
        {roomy ? (
          <AlsoInside edition={edition} reading={reading} count={2} big={rest.length === 0} />
        ) : null}
        <TurnOver edition={edition} reading={reading} />
        <Folio n={rf} date={date} />
      </Page>

      {sticker ? (
        <OnFold gx={1} gy={96} rotate={9}>
          <Burst
            fill="var(--butter)"
            points={20}
            depth={0.14}
            className="z-fold-sticker z-fold-sticker--sm"
          >
            <p>{sticker}</p>
          </Burst>
        </OnFold>
      ) : null}
    </Spread>
  );
}

// ——— Gaming's head: a player bar and the section name as a mosaic of lit cells ———

// A 5 × 7 bitmap for each letter of "GAMING"; "1" is a lit cell.
const GLYPHS: Record<string, string[]> = {
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
};

function GamingMast({ name, tagline, issue }: { name: string; tagline: string; issue: number }) {
  const word = "GAMING";
  return (
    <>
      <p className="z-player" aria-hidden>
        <span>PLAYER 1</span>
        <span>HI-SCORE {String(issue).padStart(6, "0")}</span>
        <span>CREDIT 01</span>
      </p>
      <h1 className="z-sr">{name}</h1>
      <div className="z-mosaic" aria-hidden>
        {[...word].map((ch, i) => (
          <div className="z-mosaic__letter" key={`${ch}${i}`}>
            {(GLYPHS[ch] ?? []).flatMap((row, r) =>
              [...row].map((bit, c) => (
                <span key={`${r}-${c}`} className={bit === "1" ? "on" : undefined} />
              )),
            )}
          </div>
        ))}
      </div>
      {tagline ? <p className="z-game__tag">{tagline}</p> : null}
    </>
  );
}

// ——— The first story's head: headline and picture ———

function Lead({
  story,
  flavour,
  reading,
  alone,
}: {
  story: StoryItem;
  flavour: Flavour;
  reading: Reading;
  alone?: boolean;
}) {
  const href = reading.storyHref(story.slug);
  const image = story.images[0] ?? null;

  if (flavour === "gaming") {
    return (
      <article
        aria-labelledby={`h-${story.slug}`}
        className={`z-gotw ${image ? "" : "zs-gotw--bare"}`}
      >
        {image ? (
          <Print
            photo={image}
            ratio="4 / 5"
            sizes="(max-width: 900px) 70vw, 220px"
            rotate={-4}
            tape={["tl", "tr"]}
            note={printNote(story.kicker, 18)}
            className="z-gotw__print"
            priority
          />
        ) : null}
        <div className="z-cart">
          <div className="z-cart__ridges" aria-hidden />
          <div className="z-cart__label">
            <p className="z-kicker">{story.kicker}</p>
            <h2 className="z-cart__title" id={`h-${story.slug}`}>
              <Link href={href} className="z-link-head">
                {story.headline}
              </Link>
            </h2>
            <p className="z-cart__verdict">{story.dek}</p>
            <p className="z-cart__scores">
              {story.readMinutes}-minute read · {story.sourceName}
            </p>
          </div>
        </div>
        {image ? (
          <div className="zs-gotw__credit">
            <Credit photos={story.images.slice(0, 1)} />
          </div>
        ) : null}
      </article>
    );
  }

  const size = headSize(story.headline, alone ? [12.5, 11, 9.6, 8.6] : [10, 8.4, 7.4, 6.6]);
  const headline = (
    <h2 className="z-h2 zs-lead__head" style={{ ["--zh" as string]: size }} id={`h-${story.slug}`}>
      <Link href={href} className="z-link-head">
        <Ringed text={story.headline} />
      </Link>
    </h2>
  );

  if (flavour === "screen" && image) {
    const frames = story.images.slice(0, 2);
    return (
      <div className="zs-lead">
        <div className="z-film zs-film">
          <div
            className={`z-film__frames ${frames.length === 1 ? (alone ? "zs-film__one" : "zs-film__one zs-film__wide") : ""}`}
          >
            {frames.map((img, i) => (
              <Photo
                key={img.url}
                photo={img}
                ratio={i === 0 ? "16 / 10" : "4 / 5"}
                sizes="(max-width: 900px) 66vw, 400px"
                priority={i === 0}
              />
            ))}
          </div>
          <p className="z-film__edge" aria-hidden>
            <span>YAY 400</span>
            <span>▸ 23A</span>
            <span>▸ 24</span>
            <span>▸ 24A</span>
          </p>
        </div>
        <Credit photos={frames} />
        <p className="z-kicker zs-lead__kicker">{story.kicker}</p>
        {headline}
      </div>
    );
  }

  return (
    <div className={`zs-lead ${alone ? "zs-lead--alone" : ""}`}>
      <p className="z-kicker zs-lead__kicker">{story.kicker}</p>
      {headline}
      {image ? (
        <>
          <div className="zs-lead__photo z-offset-block">
            <Print
              photo={image}
              ratio={alone ? "3 / 2" : "2 / 1"}
              sizes="(max-width: 900px) 100vw, 600px"
              rotate={-1.6}
              tape={["tl", "br"]}
              note={printNote(image.alt, 44)}
              priority
            />
          </div>
          <div className="zf-credit">
            <Credit photos={[image]} />
          </div>
        </>
      ) : (
        <div className="zs-bare">
          <p className="zs-bare__dek">{story.dek}</p>
          <Mark name="sketch-52" ink="var(--ink)" className="zs-bare__doodle" />
        </div>
      )}
    </div>
  );
}

// ——— The first story's text: standfirst, furniture and body ———

function LeadText({
  story,
  flavour,
  reading,
  edition,
  folio,
  alone,
}: {
  story: StoryItem;
  flavour: Flavour;
  reading: Reading;
  edition: Edition;
  folio: number;
  alone?: boolean;
}) {
  const href = reading.storyHref(story.slug);
  // Gaming's cartridge label and the bare (pictureless) head already carry the standfirst.
  const showDek = flavour !== "gaming" && story.images.length > 0;
  const text = (
    <div>
      {showDek ? <p className="z-dek">{story.dek}</p> : null}
      <Byline story={story} />
      <Body story={story} drop={alone} className={`zs-body ${alone ? "zs-body--alone" : ""}`}>
        <ReadOn href={href} />
      </Body>
    </div>
  );
  if (flavour === "screen") {
    return (
      <article className="z-ss__story zs-text" aria-labelledby={`h-${story.slug}`}>
        {text}
        <div className="zs-ticket-wrap">
          <div className="z-ticket" aria-label={`Ticket: ${story.kicker}, page ${folio}`}>
            <div className="z-ticket__main">
              <span>Admit one · {story.section.name}</span>
              <b>{story.kicker}</b>
              <span>
                No. {edition.issueNumber} · page {folio}
              </span>
              <span>{story.readMinutes}-minute read</span>
            </div>
            <div className="z-ticket__stub" aria-hidden>
              No. {String(edition.issueNumber).padStart(6, "0")}
            </div>
          </div>
        </div>
      </article>
    );
  }
  return (
    <article
      className={`zs-text ${alone ? "zs-text--alone" : ""}`}
      aria-labelledby={`h-${story.slug}`}
    >
      {text}
    </article>
  );
}

// ——— Briefs on the right page ———

function Brief({
  story,
  flavour,
  reading,
  i,
  count,
}: {
  story: StoryItem;
  flavour: Flavour;
  reading: Reading;
  i: number;
  count: number;
}) {
  const href = reading.storyHref(story.slug);
  const image = story.images[0] ?? null;
  const compact = count > 1;
  const headline = (
    <h2
      className="z-h2 zs-brief__head"
      style={{
        ["--zh" as string]: headSize(
          story.headline,
          compact ? [6.6, 6, 5.4, 5] : [8.4, 7.4, 6.6, 6],
        ),
      }}
    >
      <Link href={href} className="z-link-head">
        <Ringed text={story.headline} />
      </Link>
    </h2>
  );
  const text = (
    <>
      <p className="z-dek">{story.dek}</p>
      <Byline story={story} />
      <Body story={story} className="zs-body">
        <ReadOn href={href} />
      </Body>
    </>
  );

  if (image && flavour === "gaming" && !compact) {
    return (
      <article className="zs-brief">
        <p className="z-kicker">{story.kicker}</p>
        {headline}
        <div className="z-fish__photo">
          <Photo photo={image} ratio="2 / 1" sizes="(max-width: 900px) 100vw, 640px" />
        </div>
        <Credit photos={[image]} />
        <div className="zs-brief__cols">{text}</div>
      </article>
    );
  }

  if (image) {
    return (
      <article className={`zs-brief ${compact ? "zs-brief--compact" : ""}`}>
        <p className="z-kicker">{story.kicker}</p>
        {headline}
        <div className={`z-choir__grid zs-brief__grid ${i % 2 ? "zs-brief__grid--flip" : ""}`}>
          <div>
            <Print
              photo={image}
              ratio="4 / 3"
              sizes="(max-width: 900px) 100vw, 300px"
              rotate={i % 2 ? 2.4 : -3}
              tape={i % 2 ? ["tr"] : ["tl", "br"]}
              note={printNote(image.alt, 30)}
            />
            <Credit photos={[image]} />
          </div>
          <div>{text}</div>
        </div>
      </article>
    );
  }

  return (
    <article className={`zs-brief zs-brief--bare ${compact ? "zs-brief--compact" : ""}`}>
      {i === 0 ? <Tape at="t" /> : null}
      <p className="z-kicker">{story.kicker}</p>
      {headline}
      <div className="zs-brief__cols">{text}</div>
    </article>
  );
}
