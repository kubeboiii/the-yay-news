import Image from "next/image";
import { edition } from "@/app/mockups/_data/sample-edition";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";
import { Barcode, STRETCH, Stamp, Zigzag } from "./_components/parts";

const pageNumbers: Record<string, number> = {
  "screen-and-sound": 2,
  gaming: 3,
  sports: 4,
  tech: 5,
  money: 6,
  "internet-and-culture": 6,
};

export default function BroadsheetFront() {
  const { lead, numberOfTheDay, weather, puzzles } = edition;
  const gaming = edition.sections.find((s) => s.slug === "gaming")?.stories[0];

  return (
    <div className="yn-sheet-wrap">
      <article className="yn-sheet">
        {/* Banner: the day's number, printed big, with the picnic print pasted over its edge. */}
        <section className="yn-banner" aria-label="Number of the day">
          <div className="yn-banner-stack">
            <div className="yn-hand">Today&rsquo;s</div>
            <div className="yn-chunk">Number</div>
          </div>
          <div className="yn-vrule" />
          <div className="yn-banner-number">
            <span className="yn-fat fr-number">
              <Mark
                name="brush-03"
                ink="var(--neon-pink)"
                className="fr-number-swipe"
                style={STRETCH}
              />
              <span className="relative">{numberOfTheDay.value}</span>
            </span>
            <span className="yn-hand">
              picnic blankets,
              <br />
              laid end to end
              <br />
              at a village fête
            </span>
          </div>
          <figure className="fr-picnic print-print">
            <span className="print-tape fr-picnic-tape" aria-hidden />
            <div className="relative h-full w-full">
              <Image
                src="/mockup/picnic.jpg"
                alt="A red gingham picnic blanket laid with food and drinks"
                fill
                sizes="(max-width: 760px) 70vw, 260px"
                className="object-cover"
              />
            </div>
            <figcaption>The fête, 11.02 am</figcaption>
          </figure>
          <Burst
            fill="var(--neon-pink)"
            points={22}
            depth={0.1}
            className="yn-banner-badge print-worn"
          >
            <span className="yn-burst-text text-[calc(var(--u)*5.2)]">
              a new
              <br />
              record!*
            </span>
          </Burst>
        </section>

        <Zigzag word="finishable" />

        {/* Masthead row: spec table · wordmark · read time. */}
        <header className="yn-mast">
          <div className="yn-spec">
            <h2 className="yn-chunk">The Daily</h2>
            <dl>
              <div>
                <dt>Edition:</dt>
                <dd>
                  Vol. {edition.volume} · No. {edition.issue}
                </dd>
              </div>
              <div>
                <dt>Date:</dt>
                <dd>Wed 30 Sep 2026</dd>
              </div>
              <div>
                <dt>Stories:</dt>
                <dd>15, all good</dd>
              </div>
              <div>
                <dt>Price:</dt>
                <dd>{edition.price}</dd>
              </div>
            </dl>
          </div>
          <div className="yn-vrule" />
          <div className="yn-wordmark">
            <h1 className="yn-chunk">The Yay News</h1>
            <p className="yn-hand">Only good news. Mostly fun. Occasionally weird.</p>
          </div>
          <div className="yn-vrule" />
          <div className="yn-readtime print-worn" aria-label={`${edition.readMinutes} minute read`}>
            <span className="yn-fat">{edition.readMinutes}</span>
            <span className="yn-hand">
              minutes
              <br />
              of good news,
              <br />
              then you&rsquo;re done
            </span>
          </div>
        </header>

        <Zigzag word="unputdownable" />

        {/* Lead photo, with the headline card pasted on and a note scribbled over the print. */}
        <figure className="yn-hero">
          <div className="yn-hero-photo">
            <Image
              src="/mockup/hero-octopus.jpg"
              alt="An orange octopus with its arms curled, photographed underwater"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 1100px"
              className="object-cover object-[center_40%]"
            />
          </div>

          <Stamp className="fr-stamp">
            Sample
            <br />
            edition
          </Stamp>

          <p className="fr-note" aria-hidden>
            Look — she&rsquo;s
            <br />
            mid-twirl
          </p>
          <Mark name="arrows-09" ink="var(--neon-yellow)" className="fr-note-arrow" />

          <Burst fill="var(--neon-yellow)" points={24} depth={0.08} className="yn-hero-sticker">
            <span className="yn-burst-text text-[calc(var(--u)*8.4)]">
              <span className="block text-[0.62em] tracking-wide">happy fact:</span>
              it really
              <br />
              does dance!
            </span>
          </Burst>

          <div className="yn-hero-card">
            <span className="print-tape fr-card-tape-l" aria-hidden />
            <span className="print-tape fr-card-tape-r" aria-hidden />
            <p className="yn-kicker">Today&rsquo;s lead story</p>
            <h2 className="yn-chunk">
              Deep-sea camera films an octopus that appears to{" "}
              <span className="fr-ringed">
                dance
                <Mark name="ellipse-01" className="fr-ring" style={STRETCH} />
              </span>
            </h2>
            <span className="yn-credit">@theyaynews via NOAA · unsplash.com</span>
          </div>
        </figure>

        <Zigzag word="good news only" />

        {/* Footer: five columns, each a different width and a different kind of thing. */}
        <section className="fr-foot" aria-label="Also on the front page">
          <article className="fr-col fr-lead">
            <p className="yn-kicker">Down in the deep</p>
            <h2 className="yn-chunk">Eleven minutes of dancing, and nobody knows why</h2>
            <p className="yn-dek">{lead.dek}</p>
            <p className="yn-byline fr-byline">By Marnie Holt, science correspondent</p>
            <div className="yn-body yn-dropcap">
              <p>{lead.body[0]}</p>
              <p>{lead.body[1]}</p>
              <p>{lead.body[3]}</p>
            </div>
            <p className="yn-jump">Continued on page 6</p>
          </article>

          <article className="fr-col fr-cat">
            <figure className="fr-cat-print print-print">
              <span className="print-tape fr-cat-tape" aria-hidden />
              <div className="relative h-full w-full">
                <Image
                  src="/mockup/bakery-cat.jpg"
                  alt="A cat in a small chef's hat among loaves and pastries"
                  fill
                  sizes="(max-width: 760px) 90vw, 240px"
                  className="object-cover"
                />
              </div>
            </figure>
            <p className="yn-caption">
              Butter, head baker. <span className="yn-credit">Photo: Reba Spike</span>
            </p>
            <h2 className="yn-chunk mt-[calc(var(--u)*3)]">
              A cat runs a bakery and tops the charts
            </h2>
            <p className="yn-body">{gaming?.dek}</p>
            <p className="yn-jump">Gaming, page 3</p>
          </article>

          <div className="fr-col fr-inside">
            <p className="yn-kicker">Internet weather</p>
            <h2 className="yn-chunk fr-weather-head">
              Sunny, with scattered memes
              <Mark name="stars-06" className="fr-weather-stars" />
            </h2>
            <p className="yn-body fr-weather">{weather.detail}</p>
            <h2 className="fr-inside-head">Inside today</h2>
            <ul className="yn-index yn-body">
              {edition.sections.map((s) => (
                <li key={s.slug}>
                  <span>{s.name}</span>
                  <span>p.{pageNumbers[s.slug]}</span>
                </li>
              ))}
              <li>
                <span>Puzzles</span>
                <span>p.8</span>
              </li>
            </ul>
          </div>

          <aside className="fr-col fr-riddle">
            <div className="fr-riddle-ink print-worn" aria-hidden />
            <Burst fill="var(--neon-yellow)" points={20} depth={0.12} className="yn-riddle-badge">
              <span className="yn-burst-text text-[calc(var(--u)*4.4)]">
                back
                <br />
                page!
              </span>
            </Burst>
            <p className="yn-kicker">Riddle me this</p>
            <p className="yn-chunk fr-riddle-q">{puzzles.riddle.question}</p>
            <p className="yn-body">
              Answer on the back page, next to the crossword. No peeking before your coffee.
            </p>
          </aside>

          <aside className="fr-col fr-price">
            <div className="fr-pricebox">
              <p className="yn-chunk">Free</p>
              <p className="yn-hand">forever, and ever</p>
              <Barcode />
              <p className="fr-issn">No. 42 · 30.09.26</p>
            </div>
            <div className="fr-ad">
              <p className="yn-ad-label">Advertisement</p>
              <p className="yn-chunk">This space was for sale.</p>
              <p className="yn-body">
                Nobody bought it, so here is a nice thought instead: drink some water.
              </p>
            </div>
          </aside>
        </section>

        <div className="yn-zigzag fr-last" role="separator" aria-hidden />
      </article>
      <p className="mx-auto mt-4 max-w-[1180px] text-center text-[11px] text-black/55">
        Sample edition · all stories invented · *entirely unofficial · photos: NOAA, Kyrie Isaac,
        Reba Spike on Unsplash
      </p>
    </div>
  );
}
