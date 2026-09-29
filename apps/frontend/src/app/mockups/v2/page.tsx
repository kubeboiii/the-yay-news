import Link from "next/link";
import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { birdMore, cafeMore, catMore, choirMore, leadMore, pitMore, robotMore, stopPress } from "./_components/copy";
import { Dateline, Folio, Pencil, Photo, Sheet } from "./_components/parts";

const find = (section: string, n: number) => edition.sections.find((s) => s.slug === section)?.stories[n];

const index: [string, number][] = [
  ["Stage, Screen & Wireless", 2],
  ["Pastimes", 3],
  ["Sport", 4],
  ["Science & Invention", 5],
  ["Money", 6],
  ["Food & Words", 7],
  ["Puzzles", 8],
  ["Classified", 8],
  ["Corrections", 8],
];

export default function MorningFront() {
  const { lead, weather, numberOfTheDay, quoteOfTheDay } = edition;
  const choir = find("screen-and-sound", 1);
  const cat = find("gaming", 0);
  const robot = find("tech", 1);
  const cafe = find("money", 0);
  const birds = find("tech", 0);
  const pit = find("sports", 0);
  const [first, ...rest] = lead.body;

  return (
    <Sheet page="front">
      <header className="me-mast">
        <div className="me-ear">
          <p className="me-ear-head">Today’s weather</p>
          <p className="me-ear-big">{weather.headline}.</p>
          <p className="me-ear-small">{weather.detail}</p>
        </div>
        <div className="me-nameplate">
          <h1 className="me-nameplate-title">The Yay News</h1>
          <p className="me-motto">“{edition.tagline}”</p>
        </div>
        <div className="me-ear me-ear--right">
          <p className="me-ear-head">Late city edition</p>
          <p className="me-ear-big">Price: free, forever.</p>
          <p className="me-ear-small">
            Ten minutes to read, then you are done. Delivered to every doorstep that wants one.
          </p>
        </div>
      </header>
      <Dateline right="Sample edition · Eight pages" />

      <h2 className="me-banner">Octopus Dances on the Sea Floor</h2>

      <div className="me-front-main">
        <div className="me-leftcol">
        <article className="me-lead">
          <h3 className="me-deck1">{lead.headline}</h3>
          <hr className="me-dash" />
          <p className="me-deck2">Researchers Watch It Sway, Spin and Flash Colours for Eleven Minutes</p>
          <hr className="me-dash" />
          <p className="me-deck3">Nobody is quite sure why; the lab’s favourite theory is that it simply felt like it</p>
          <p className="me-byline">
            By Marina Lowe
            <span>Science Correspondent</span>
          </p>
          <div className="me-body me-body--2">
            <p className="me-first me-dropcap">
              <span className="me-placeline">Aboard the R.V. Curiosity, Sept. 29 —</span> {first}
            </p>
            {rest.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p className="me-crosshead">Humming in the lab</p>
            {leadMore.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p className="me-jump">Continued on Page 5, Column 3</p>
          </div>
        </article>

        {birds ? (
          <article className="me-birds">
            <h3 className="me-head">{birds.headline}</h3>
            <p className="me-deck3 me-deck3--small">{birds.dek}</p>
            <div className="me-cat-cols">
              <Photo
                photo={pick("songbird")}
                sizes="(max-width: 760px) 100vw, 160px"
                className="me-cat-photo"
                caption={
                  <>
                    <b>Heard 212 times</b> on Monday, by one phone.
                  </>
                }
              />
              <div className="me-body">
                <p className="me-first">{birds.body[0]}</p>
                {birdMore.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        ) : null}
        </div>

        <Photo
          photo={pick("octopus")}
          sizes="(max-width: 760px) 100vw, 620px"
          className="me-lead-photo me-rule"
          position="50% 40%"
          duotone
          priority
          caption={
            <>
              <b>Eleven minutes on the sea floor.</b> A still from the remote camera, 1,200 metres down, at the
              moment the octopus the lab calls “Disco Pete” lifts two arms and begins to turn.
            </>
          }
        />

        {choir ? (
          <article className="me-choir me-rule">
            <h3 className="me-head me-head--2col">{choir.headline}</h3>
            <p className="me-deck2 me-deck2--small">Forty Singers, One Church Hall and a Key Change</p>
            <p className="me-byline">By Hester Quill</p>
            <Photo
              photo={pick("choir")}
              sizes="(max-width: 760px) 100vw, 320px"
              className="me-choir-photo"
              position="50% 40%"
              caption={<>Thursday night, the hall behind the post office. The tenors are at the back, by request.</>}
            />
            <div className="me-body me-body--2">
              <p className="me-first">{choir.body[0]}</p>
              <p>{choir.body[1]}</p>
              {choirMore.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <p className="me-jump">
                <Link href="/mockups/v2/screen-and-sound">Record review, Page 2</Link>
              </p>
            </div>
          </article>
        ) : null}


        {cat ? (
          <article className="me-cat me-rule">
            <h3 className="me-head">{cat.headline}</h3>
            <p className="me-deck3 me-deck3--small">{cat.dek}</p>
            <div className="me-cat-cols">
              <Photo
                photo={pick("bakeryCat")}
                sizes="(max-width: 760px) 100vw, 160px"
                className="me-cat-photo"
                position="50% 30%"
                caption={
                  <>
                    <b>Butter,</b> head baker.
                  </>
                }
              />
              <div className="me-body">
                <p className="me-first">{cat.body[0]}</p>
                {catMore.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <p>{cat.body[1]}</p>
                <p className="me-jump">
                  <Link href="/mockups/v2/gaming">Review, Page 3</Link>
                </p>
              </div>
            </div>
          </article>
        ) : null}

        {robot ? (
          <article className="me-robot me-rule">
            <div className="me-ringed">
              <h3 className="me-head">{robot.headline}</h3>
              <Pencil name="ellipse-01" className="me-ring" />
              <Pencil name="arrows-10" className="me-note-arrow" />
              <Pencil name="sketch-16" className="me-note-word" />
            </div>
            <hr className="me-dash" />
            <p className="me-deck2 me-deck2--small">Forty Thousand Tries, and Now It ‘Understands the Corners’</p>
            <p className="me-byline">By T. R. Pellow</p>
            <div className="me-body">
              <p className="me-first">
                <span className="me-placeline">Cambridge, Sept. 29 —</span> {robot.body[0]}
              </p>
              {robotMore.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            {pit ? (
              <section className="me-pit" aria-labelledby="me-pit-head">
                <h3 className="me-head me-head--small" id="me-pit-head">
                  {pit.headline}
                </h3>
                <p className="me-deck3 me-deck3--small">{pit.dek}</p>
                <Photo
                  photo={pick("pitStop")}
                  sizes="(max-width: 760px) 100vw, 160px"
                  className="me-pit-photo"
                />
                <div className="me-body">
                  {pitMore.map((p, i) => (
                    <p key={p.slice(0, 24)} className={i === 0 ? "me-first" : undefined}>
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}
            <aside className="me-number" aria-labelledby="me-number-head">
              <p className="me-box-head" id="me-number-head">
                The number of the day
              </p>
              <p className="me-number-fig">{numberOfTheDay.value}</p>
              <p className="me-number-cap">{numberOfTheDay.caption}.</p>
            </aside>
          </article>
        ) : null}
      </div>

      <div className="me-front-lower">
        {cafe ? (
          <article className="me-cafe">
            <h3 className="me-head me-head--wide">{cafe.headline}</h3>
            <p className="me-deck3 me-deck3--small">{cafe.dek}</p>
            <div className="me-cafe-cols">
              <Photo
                photo={pick("stickyNotes")}
                sizes="(max-width: 760px) 100vw, 160px"
                className="me-cafe-photo"
                caption={<>The wall of prepaid coffees, Tuesday morning.</>}
              />
              <div className="me-body me-body--2">
                <p className="me-first">
                  <span className="me-placeline">Leeds, Sept. 29 —</span> {cafe.body[0]}
                </p>
                {cafeMore.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        ) : null}

        <nav className="me-index me-rule" aria-labelledby="me-index-head">
          <p className="me-box-head" id="me-index-head">
            Inside today
          </p>
          <ol>
            {index.map(([name, page]) => (
              <li key={name}>
                <span>{name}</span>
                <span className="me-leader" aria-hidden />
                <span>{page}</span>
              </li>
            ))}
          </ol>
          <p className="me-index-note">Eight pages. Every one of them good news.</p>
        </nav>

        <aside className="me-stop me-rule" aria-labelledby="me-stop-head">
          <div className="me-stop-ink print-worn">
            <p className="me-stop-head" id="me-stop-head">
              Stop Press
            </p>
            <p className="me-stop-sub">Received after the paper went to bed</p>
            {stopPress.map((s) => (
              <p key={s.head} className="me-stop-item">
                <b>{s.head}</b> {s.text}
              </p>
            ))}
          </div>
        </aside>

        <aside className="me-quote me-rule" aria-label="Quote of the day">
          <p className="me-box-head">They are saying</p>
          <blockquote>
            <p>“{quoteOfTheDay.text}”</p>
          </blockquote>
          <p className="me-quote-by">— {quoteOfTheDay.by}</p>
        </aside>
      </div>

      <section className="me-ads" aria-label="Advertisements">
        <div className="me-ad me-ad--a">
          <p className="me-ad-small">Mill Lane, since Tuesday</p>
          <p className="me-ad-big">Butter’s Bakery</p>
          <p className="me-ad-text">Croissants every hour. Cats welcome. Herons, please pay.</p>
        </div>
        <div className="me-ad me-ad--b">
          <p className="me-ad-big">Pickle Ice Cream</p>
          <p className="me-ad-text">Four hundred tubs a week and it is, honestly, good. Try one.</p>
        </div>
        <div className="me-ad me-ad--c">
          <p className="me-ad-text">The weekly letter of</p>
          <p className="me-ad-big">Benches With Views</p>
          <p className="me-ad-small">Sunsets · pigeons · sandwich suitability</p>
        </div>
        <div className="me-ad me-ad--d">
          <p className="me-ad-big">The Palace</p>
          <p className="me-ad-text">
            Nightly at 7.30 — <i>Moonbeam Diner: The Musical</i>. Toaster sings.
          </p>
        </div>
        <div className="me-ad me-ad--e">
          <p className="me-ad-small">Wanted at once</p>
          <p className="me-ad-big">Encore</p>
          <p className="me-ad-text">One octopus, pale, good sense of rhythm. Camera provided.</p>
        </div>
      </section>

      <Folio page={1} section="Front page" />
    </Sheet>
  );
}
