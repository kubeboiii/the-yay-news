import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { Folio, Pencil, Photo, SectionFlag, Sheet, Stars } from "../_components/parts";

const section = edition.sections.find((s) => s.slug === "screen-and-sound");

const moonbeamMore = [
  "It is a brave way to come back. The first two seasons of the cartoon about a greasy spoon on the Moon ran on small jokes — the milkshake that floats, the regular who orders “the usual” and is never told what it is — and a musical asks those jokes to carry a tune. Remarkably, they do.",
  "The opening number, sung by the whole diner as the lunch rush arrives in low gravity, is the sort of song you find yourself humming at the bus stop. The second, a duet between the cook and the till, is better still.",
  "And then there is the toaster. Its ballad, a slow lament about only ever being asked for one thing, arrives two-thirds of the way through and stops the episode dead. It is funny for eight bars and then, without warning, it is not funny at all, and then it is funny again. The voice cast, the creators admit, could not get through it without stopping.",
  "Not every song lands. A number about the diner’s broken jukebox goes on a verse too long, and the finale leans on a key change it has not quite earned. These are small complaints.",
  "What the episode understands is that a musical is only a comedy that has decided to be honest about its feelings. Moonbeam Diner has always had feelings. Now it sings them.",
];

const choirMore = [
  "There is no production to speak of: the phone was propped against a hymn book in the second row, and you can hear a chair scrape in the first verse and somebody’s car keys in the bridge.",
  "It does not matter at all. The sopranos take the chorus a touch fast, the basses arrive with the weight of forty years of Thursday evenings, and when the key change comes the whole hall seems to lift off the floor.",
];

const bandText = [
  "The Harbour Street Silver Band has played the same bandstand every Sunday for sixty years. This summer, at the suggestion of its youngest member, it began playing nothing but theme tunes.",
  "The crowds, which used to be counted in dozens, now fill the park. On Sunday a gentleman in his eighties conducted the band through a cartoon theme from his own childhood, then asked for it again.",
];

const usherText = [
  "For fifty years Walter Albright showed people to their seats at the Regal with a torch and a whisper. On Saturday, at the end of his last evening, the lights went up before the credits and the whole house rose to its feet.",
  "He had kept seat 23 free every night, he explained, for whoever came in late and flustered. “Somebody always does,” he said. “They shouldn’t have to climb over anyone.” The cinema has had a small brass plate made for it.",
  "His successor has been given the torch.",
];

const radioText = [
  "The eleven o’clock forecast, read by an announcer who lowers her voice a little more for every sea area, has become the most listened-to programme after ten at night. Parents report that most children are asleep by Dogger.",
  "The announcer says she does nothing special. “I just imagine all the boats,” she said, “and I try not to wake them.”",
];

const tapeText = [
  "The cassette turned up in a shoebox of Christmas cards, labelled in felt pen and never played since the summer it was made. Its owner, the class’s old music teacher, borrowed a machine from a neighbour and listened to it alone first, “in case it was awful.”",
  "It was not awful. It was forty-one minutes of recorders, one very brave solo and a closing song in which somebody can clearly be heard laughing. She found thirty-one of the thirty-four pupils through the parish newsletter.",
  "On Saturday they gathered in the same hall, now in their fifties, and listened in silence. The laughing, it turned out, had been the teacher.",
];

const letters: [string, string][] = [
  [
    "Sir, — Your critic says the toaster’s ballad stops the episode dead. In our house it stopped the washing-up, which has never happened before.",
    "M. Pryor, Harrogate",
  ],
  [
    "Sir, — I sang second alto on the choir’s recording and would like it known that the car keys in the bridge were not mine.",
    "Name withheld, St Anne’s",
  ],
  [
    "Sir, — May I thank the Silver Band, who played my late husband’s favourite theme tune on Sunday without being asked. He would have conducted.",
    "E. Watts, Harbour Street",
  ],
  [
    "Sir, — The usher at the Regal once found my glove under seat 23 in 1971 and posted it back. I have kept the envelope. Congratulations, Mr Albright.",
    "J. Okafor, Mill Road",
  ],
];

type Listing = { house: string; films: [string, string][] };

const listings: Listing[] = [
  {
    house: "The Palace, High Street",
    films: [
      ["Moonbeam Diner: The Musical (U)", "1.10, 3.40, 6.15, 8.50"],
      ["Short: The Octopus Encore (U)", "with all programmes"],
    ],
  },
  {
    house: "The Regal, Mill Road",
    films: [
      ["A Bench With a View (PG)", "2.00, 5.20, 8.30"],
      ["Butter Rises Early (U)", "11.00 Saturday"],
    ],
  },
  {
    house: "Electric Picture House",
    films: [
      ["The Longest Picnic (U)", "12.30, 4.00, 7.30"],
      ["Grandmother’s Key Change (PG)", "9.40"],
    ],
  },
  {
    house: "The Rex, by the station",
    films: [
      ["Forty Thousand Folds (U)", "1.45, 6.00"],
      ["The Lighthouse Waves Back (PG)", "3.50, 8.10"],
    ],
  },
  {
    house: "Odeum Kids’ Club",
    films: [["Pip & Pigeon Save Tuesday (U)", "10.00 Sat & Sun"]],
  },
];

const stage: Listing[] = [
  {
    house: "Theatre Royal",
    films: [["The Toaster’s Lament, a play in one act", "7.45; mat. Sat 2.30"]],
  },
  {
    house: "The Corn Exchange",
    films: [["Village choirs’ gala, forty voices", "7.30, doors 7.00"]],
  },
  {
    house: "Park Bandstand",
    films: [["Harbour Street Silver Band: themes", "Sunday 3.00, free"]],
  },
  {
    house: "St Anne’s Hall",
    films: [["Choir rehearsal, all welcome", "Thursday 7.00, tea"]],
  },
];

const concerts: Listing[] = [
  {
    house: "Town Hall",
    films: [["Lunchtime organ: requests taken", "Wed 1.05, free"]],
  },
  {
    house: "The Assembly Rooms",
    films: [["String quartet plays cartoon themes", "Fri 8.00"]],
  },
  {
    house: "The Lido",
    films: [["Swing band and a very slow swim", "Sat 6.30"]],
  },
];

const chart: [string, string][] = [
  ["Every Time the Kettle Boils", "St Anne’s Village Choir"],
  ["The Toaster’s Lament", "Moonbeam Diner cast"],
  ["Sunny With Scattered Memes", "The Weathermen"],
  ["Forty Thousand Folds", "Linen & the Engineers"],
  ["Disco Pete", "The Deep Six"],
  ["Tuesday (Just Tuesday)", "Pip & Pigeon"],
  ["A Bench With a View", "Harbour St. Silver Band"],
  ["Pickle Ice Cream Waltz", "The Creamery Four"],
  ["Scones for the Six", "Village Green XI"],
  ["You’re Doing Fine", "The Café Wall"],
];

const television: [string, string][] = [
  ["5.00", "Puppet Farm. The goat learns to knit."],
  ["6.00", "Good News at Six."],
  ["6.40", "Bench of the Week, from the pier."],
  ["7.30", "Moonbeam Diner. The musical."],
  ["8.30", "Bake It Slow: croissants, with a cat."],
  ["10.00", "The Late Film: Forty Thousand Folds."],
];

const wireless: [string, string][] = [
  ["6.00", "The Morning Garden. Questions about tomatoes answered kindly."],
  ["9.15", "Songs From the Hall. This week: the village choir, in full."],
  ["12.30", "The Lunchtime Quiz, in which nobody loses."],
  ["4.00", "Children’s Hour: a tortoise tells a story, very slowly."],
  ["6.30", "The News, which is good."],
  ["7.30", "Moonbeam Diner. Season three begins; see review."],
  ["9.00", "Late Records, with the toaster’s ballad twice."],
  ["11.00", "Shipping forecast, read as a lullaby. Close."],
];

const picks = [
  {
    head: "Watch",
    text: "Moonbeam Diner, 7.30. Clear the evening, and have a tissue near the toaster.",
  },
  {
    head: "Listen",
    text: "Songs From the Hall, 9.15. The choir, the hymn book, the key change.",
  },
  {
    head: "Go",
    text: "The bandstand, Sunday at three. Bring a chair and a theme tune to request.",
  },
];

export default function StageScreenWireless() {
  const moonbeam = section?.stories[0];
  const choir = section?.stories[1];

  return (
    <Sheet page="screen">
      <SectionFlag
        page={2}
        title="Stage, Screen & Wireless"
        sub="Reviews, the pictures, and what is on the air tonight"
        earLeft={
          <>
            <b>Our stars.</b> Five, don’t miss it; four, very good; three, worth an evening; two and one we
            never print, because we never review what we did not enjoy.
          </>
        }
        earRight={
          <>
            <b>Tonight at 7.30:</b> the Moon’s only diner reopens, and this time everybody sings. Review
            below.
          </>
        }
      />

      <div className="me-ss-main">
        {moonbeam ? (
          <article className="me-ss-lead">
            <p className="me-kicker">Television · The review</p>
            <h2 className="me-ss-head">{moonbeam.headline}</h2>
            <p className="me-ss-rating">
              <Stars n={5} /> <i>Moonbeam Diner,</i> Season 3, Episode 1. Tonight, 7.30.
            </p>
            <div className="me-ss-leadgrid">
              <Photo
                photo={pick("retroTv")}
                sizes="(max-width: 760px) 100vw, 520px"
                className="me-ss-tv"
                position="50% 55%"
                priority
                caption={
                  <>
                    <b>Season three</b> arrives tonight on the set in the corner, and it sings.
                  </>
                }
              />
              <div className="me-ss-leadside">
                <p className="me-deck3">{moonbeam.dek}</p>
                <p className="me-byline">
                  By Rosalind Fane
                  <span>Television Critic</span>
                </p>
                <div className="me-body">
                  <p className="me-first me-dropcap">{moonbeam.body[0]}</p>
                  <p>{moonbeam.body[1]}</p>
                  {moonbeamMore.slice(0, 3).map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="me-body me-ss-leadrest">
              {moonbeamMore.slice(3).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </article>
        ) : null}

        <article className="me-ss-usher">
          <p className="me-kicker">At the pictures</p>
          <h2 className="me-head">Usher retires after fifty years, and the whole house stands</h2>
          <Photo
            photo={pick("cinema", 1)}
            sizes="(max-width: 760px) 100vw, 320px"
            className="me-ss-seat"
            position="50% 50%"
            caption={<>Seat 23, which Mr Albright kept free every night for whoever came in late.</>}
          />
          <div className="me-body me-body--2">
            {usherText.map((p, i) => (
              <p key={p.slice(0, 24)} className={i === 0 ? "me-first" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </article>

        <article className="me-ss-tape me-rule">
          <p className="me-kicker">Found in a loft</p>
          <h2 className="me-head me-head--wide">A school concert taped in 1979 is played again, to the class that sang it</h2>
          <p className="me-deck3 me-deck3--small">Thirty-one former pupils, one cassette and a teacher who kept the recorder.</p>
          <div className="me-ss-tapegrid">
            <Photo
              photo={pick("cassette")}
              sizes="(max-width: 760px) 100vw, 220px"
              className="me-ss-cassette"
              caption={<>Side A, labelled in felt pen: “Summer concert — do not tape over.”</>}
            />
            <div className="me-body me-body--2">
              {tapeText.map((p, i) => (
                <p key={p.slice(0, 24)} className={i === 0 ? "me-first" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="me-ss-radio">
            <h3 className="me-head me-head--small">Shipping forecast read as a lullaby tops the late listening figures</h3>
            <div className="me-ss-radiogrid">
              <Photo photo={pick("microphone")} sizes="(max-width: 760px) 100vw, 160px" className="me-ss-mic" />
              <div className="me-body me-body--2">
                {radioText.map((p, i) => (
                  <p key={p.slice(0, 24)} className={i === 0 ? "me-first" : undefined}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </article>

        <section className="me-ss-listings me-rule" aria-labelledby="me-pictures">
          <h2 className="me-box-head me-box-head--big" id="me-pictures">
            At the Pictures
          </h2>
          <p className="me-listings-sub">Programmes for Tuesday. Times are for the start of the main feature.</p>
          {listings.map((l) => (
            <div key={l.house} className="me-listing">
              <p className="me-listing-house">{l.house}</p>
              {l.films.map(([film, times]) => (
                <p key={film} className="me-listing-film">
                  <span>{film}</span>
                  <span className="me-listing-times">{times}</span>
                </p>
              ))}
            </div>
          ))}
          <h2 className="me-box-head me-box-head--big me-stage-head">On the Stage</h2>
          {stage.map((l) => (
            <div key={l.house} className="me-listing">
              <p className="me-listing-house">{l.house}</p>
              {l.films.map(([film, times]) => (
                <p key={film} className="me-listing-film">
                  <span>{film}</span>
                  <span className="me-listing-times">{times}</span>
                </p>
              ))}
            </div>
          ))}
          <h2 className="me-box-head me-box-head--big me-stage-head">Concerts</h2>
          {concerts.map((l) => (
            <div key={l.house} className="me-listing">
              <p className="me-listing-house">{l.house}</p>
              {l.films.map(([film, times]) => (
                <p key={film} className="me-listing-film">
                  <span>{film}</span>
                  <span className="me-listing-times">{times}</span>
                </p>
              ))}
            </div>
          ))}
          <div className="me-ringed me-ss-ringed">
            <p className="me-listing-note">Saturday morning pictures return to the Regal this week. Sixpence, or a smile.</p>
            <Pencil name="ellipse-01" className="me-ring" />
          </div>
          <div className="me-ad me-ad--b me-col-ad">
            <p className="me-ad-big">The Palace</p>
            <p className="me-ad-text">Popcorn by the bucket. Seats that lean back. Toaster sings nightly.</p>
          </div>
        </section>

        <aside className="me-ss-side me-rule">
          <div className="me-picks" aria-labelledby="me-picks-head">
            <p className="me-box-head me-box-head--big print-misreg" id="me-picks-head">
              Tonight’s picks
            </p>
            {picks.map((p) => (
              <p key={p.head} className="me-pick">
                <b>{p.head}.</b> {p.text}
              </p>
            ))}
            <Pencil name="sketch-07" className="me-pick-tick" />
          </div>
          <section className="me-wireless" aria-labelledby="me-wireless-head">
            <h2 className="me-box-head" id="me-wireless-head">
              On the Wireless
            </h2>
            <p className="me-listings-sub">Home Service, 330 m.</p>
            <dl>
              {wireless.map(([t, what]) => (
                <div key={t}>
                  <dt>{t}</dt>
                  <dd>{what}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="me-wireless" aria-labelledby="me-tv-head">
            <h2 className="me-box-head" id="me-tv-head">
              Television
            </h2>
            <p className="me-listings-sub">Channel One, from five.</p>
            <dl>
              {television.map(([t, what]) => (
                <div key={t}>
                  <dt>{t}</dt>
                  <dd>{what}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="me-chart" aria-labelledby="me-chart-head">
            <h2 className="me-box-head" id="me-chart-head">
              The Top Ten Records
            </h2>
            <p className="me-listings-sub">As requested on the wireless this week.</p>
            <ol>
              {chart.map(([title, artist]) => (
                <li key={title}>
                  <b>{title}</b> {artist}
                </li>
              ))}
            </ol>
          </section>
          <div className="me-ad me-ad--a me-col-ad">
            <p className="me-ad-small">Every Friday</p>
            <p className="me-ad-big">Open Microphone</p>
            <p className="me-ad-text">The Anchor, Quay Street. Bring a song; everyone claps.</p>
          </div>
        </aside>
      </div>

      <div className="me-ss-lower">
        {choir ? (
          <article className="me-ss-record">
            <p className="me-kicker">On the gramophone</p>
            <h2 className="me-head me-head--wide">{choir.headline}</h2>
            <p className="me-ss-rating">
              <Stars n={4} /> <i>Every Time the Kettle Boils,</i> St Anne’s Village Choir. Home recording.
            </p>
            <div className="me-ss-recordgrid">
              <Photo
                photo={pick("vinyl", 1)}
                sizes="(max-width: 760px) 100vw, 220px"
                className="me-ss-vinyl"
                duotone
                caption={<>Pressed at last: the choir’s single is to be issued on a record, in forty copies.</>}
              />
              <div className="me-body me-body--2">
                <p className="me-first">
                  <span className="me-placeline">Reviewed by Hester Quill —</span> {choir.body[0]}
                </p>
                {choirMore.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <p>{choir.body[1]}</p>
              </div>
            </div>
          </article>
        ) : null}

        <article className="me-ss-band me-rule">
          <p className="me-kicker">At the bandstand</p>
          <h2 className="me-head">A brass band now plays only theme tunes, and the park is full</h2>
          <Photo
            photo={pick("concert")}
            sizes="(max-width: 760px) 100vw, 320px"
            className="me-ss-concert"
            position="50% 60%"
          />
          <div className="me-body">
            {bandText.map((p, i) => (
              <p key={p.slice(0, 24)} className={i === 0 ? "me-first" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </article>

        <section className="me-ss-letters me-rule" aria-labelledby="me-letters-head">
          <h2 className="me-box-head me-box-head--big" id="me-letters-head">
            Letters to the Arts Page
          </h2>
          {letters.map(([text, by]) => (
            <p key={by} className="me-letter">
              {text} <span className="me-letter-by">{by}</span>
            </p>
          ))}
        </section>
      </div>

      <Folio page={2} section="Stage, Screen & Wireless" />
    </Sheet>
  );
}
