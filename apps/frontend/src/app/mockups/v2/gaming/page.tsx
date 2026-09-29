import { edition } from "@/app/mockups/_data/sample-edition";
import { pick } from "@/app/mockups/_data/photos";
import { Folio, Pencil, Photo, SectionFlag, Sheet, Stars } from "../_components/parts";

const gaming = edition.sections.find((s) => s.slug === "gaming");

const reviewMore = [
  "The premise is small and the game never pretends otherwise. You are Butter, a cat of some seniority, and you run the only bakery in a village of animals who each want one particular thing, done one particular way, every single morning.",
  "The heron wants one bun and will not pay for it. The mice want everything sliced, and then want the slices sliced. The tortoise arrives just as you are closing and orders, very slowly, the thing you have just put away.",
  "It sounds like a chore. It is the opposite. The pleasure is in learning the village the way you learn a street you have lived on for years — who is early, who is sad on Thursdays, who will come back if you remember their name.",
  "There is no score and no way to lose. If a loaf burns, Butter eats it, and a small line of text says only that it was still quite nice. Very few games have been this kind to the person holding the controller.",
  "The two developers made it in a spare bedroom over three years, with a real cat asleep on the desk for most of it. You can tell. Everything in the game moves the way a cat moves when it thinks nobody is looking.",
  "If there is a fault, it is that the days end too soon. Next week’s update, which lets you pet the customers, should not help with that at all.",
];

const fishingMore = [
  "The update arrived at two in the morning on a Sunday, with no trailer and no announcement, and a one-line note: “You can fish now.” Within an hour the game had more players than it had had since the turn of the century.",
  "Fishing takes place at a single wooden jetty that was always in the game and never did anything. You cast, you wait, and sometimes a fish comes. The waiting, players agree, is the best part.",
  "On Monday a player in Norway landed a fish the studio says it did not put there. It is blue, it has a small hat, and it has been named Gordon by acclaim. The studio has declined to explain Gordon.",
];

const grandText = [
  "Every Tuesday for a year, Irene Marsh, 84, and her grandson Tom, 11, have played the same racing game after school. On Saturday she beat him for the first time, by a tenth of a second, on the last bend.",
  "“She took the inside line,” Tom said. “I didn’t know she knew about the inside line.” Mrs Marsh said she had been practising while he was at football.",
];

// Set like a closing-prices table: name, version, change, and a remark in the smallest type.
const patches: [string, string, string, string][] = [
  ["Bread & Butter", "1.0.3", "+0.0.1", "Pet the customers (next week)"],
  ["Harbour Lights", "25.0.1", "+0.0.1", "Fishing; one fish, Gordon"],
  ["Moonbeam Kart", "3.2.0", "+0.2.0", "Toaster added as a driver"],
  ["Tidy Meadow", "2.4.1", "+0.0.1", "Sheep now follow you home"],
  ["Linen", "0.9.0", "+0.9.0", "Fold a fitted sheet, finally"],
  ["Lighthouse Keeper", "1.1.0", "+0.1.0", "Wave at boats; boats wave back"],
  ["Pip & Pigeon", "4.0.0", "+1.0.0", "Pigeon can now say “Tuesday”"],
  ["Deep Six", "1.2.2", "+0.0.2", "Octopus dance, eleven minutes"],
  ["Allotment", "7.0.3", "+0.0.3", "Carrots judge you less"],
  ["Choir Practice", "2.0.0", "+0.5.0", "Second key change unlocked"],
  ["Bench Letter", "1.4.0", "+0.1.0", "Sandwich suitability ratings"],
  ["Pickle Parlour", "3.3.3", "+0.0.3", "Four hundred tubs a week"],
  ["Cricket Green", "5.1.0", "+0.1.0", "Sixes may land in fruit"],
  ["Night Café", "2.2.0", "+0.2.0", "Notes wall; you’re doing fine"],
  ["Quiet Library", "1.0.1", "+0.0.1", "Books reshelve themselves"],
  ["Paper Round", "9.0.0", "+2.0.0", "Every doorstep says thank you"],
];

const results: [string, string, string, string][] = [
  ["The Anchor", "1,204,350", "Mill Road", "998,120"],
  ["Pier Arcade", "876,400", "The Rex", "874,990"],
  ["St Anne’s Youth", "651,020", "Harbour St.", "651,020"],
  ["Station Café", "540,775", "The Lido", "402,300"],
];

const careText = [
  "The grey console arrived at Elm Court in a box of donations in the spring, with two joysticks and a single cartridge: a tennis game in which the ball is a square. Nobody expected it to work. It did.",
  "It now runs every afternoon from two until tea. There is a waiting list, a knock-out tournament and a champion, Mr Desmond Achebe, 91, who has not dropped a game since June and plays, staff say, with a terrifying calm.",
  "His secret, he says, is to watch the square and not the paddle. “Same as dancing,” he said. “Watch the other person, not your feet.” The home has written to the manufacturer, who replied with a signed photograph and two new joysticks.",
  "Visiting grandchildren have begun to arrive early to watch. None has yet beaten him.",
];

const ladder: [string, string, string][] = [
  ["1", "D. Achebe (Elm Court)", "31"],
  ["2", "I. Marsh (Harbour St.)", "27"],
  ["3", "The Anchor Postman", "24"],
  ["4", "T. Marsh (St Anne’s)", "22"],
  ["5", "Butter (a cat)", "19"],
  ["6", "P. E. T. (unclaimed)", "17"],
];

const swaps = [
  ["Swap.", "Two racing wheels, one wobbly, for a jigsaw of a lighthouse. Must have all the sky."],
  ["Wanted.", "Somebody to explain the inside line to a grandson. Apply Mrs Marsh."],
  ["For sale.", "Chess set, one knight replaced by a cotton reel. Plays perfectly well. 50p."],
  ["Club.", "Tuesday board games, the church hall, 7 p.m. Biscuits provided; winners wash up."],
  ["Found.", "A high score of 88,810 on the Pier Arcade pinball, initials P.E.T. Please claim it."],
  ["Lessons.", "Knitting for beginners, by a goat, as seen on Puppet Farm. Tuesdays at five."],
];

export default function Pastimes() {
  const cat = gaming?.stories[0];
  const fishing = gaming?.stories[1];

  return (
    <Sheet page="gaming">
      <SectionFlag
        page={3}
        title="Pastimes"
        sub="Games, hobbies and the arcade, reviewed by people who finished them"
        earLeft={
          <>
            <b>This week’s game</b> was played for eleven evenings, on a sofa, with a real cat supervising.
          </>
        }
        earRight={
          <>
            <b>Arcade League:</b> Saturday’s results and the full table of patch notes, this page.
          </>
        }
      />

      <div className="me-pa-main">
        {cat ? (
          <article className="me-pa-review">
            <p className="me-kicker">Game of the week</p>
            <h2 className="me-pa-head">{cat.headline}</h2>
            <p className="me-deck3">{cat.dek}</p>
            <div className="me-pa-reviewgrid">
              <Photo
                photo={pick("bakeryCat", 1)}
                sizes="(max-width: 760px) 100vw, 560px"
                className="me-pa-cat"
                position="50% 35%"
                priority
                caption={
                  <>
                    <b>The head baker</b> at work. In the game, as in life, a burnt loaf is simply eaten.
                  </>
                }
              />
              <aside className="me-verdict" aria-labelledby="me-verdict-head">
                <p className="me-box-head me-box-head--big" id="me-verdict-head">
                  The verdict
                </p>
                <p className="me-verdict-stars">
                  <Stars n={5} />
                </p>
                <p className="me-verdict-line">
                  <i>Bread &amp; Butter,</i> for one player and one cat. Made by two people in a spare bedroom. Costs
                  about as much as a sandwich.
                </p>
                <p className="me-verdict-say">Buy it, and play it slowly.</p>
                <Pencil name="stars-06" className="me-verdict-mark" />
              </aside>
            </div>
            <p className="me-byline">
              By Ellis Varga
              <span>Games Correspondent</span>
            </p>
            <div className="me-body me-pa-reviewbody">
              <p className="me-first me-dropcap">{cat.body[0]}</p>
              {reviewMore.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <p>{cat.body[1]}</p>
            </div>
            <section className="me-pa-care" aria-labelledby="me-care-head">
              <h3 className="me-head me-head--wide" id="me-care-head">
                A console from 1983 is played every afternoon at a care home, and Mr Achebe, 91, is unbeaten
              </h3>
              <div className="me-pa-caregrid">
                <Photo
                  photo={pick("retroConsole")}
                  sizes="(max-width: 760px) 100vw, 160px"
                  className="me-pa-console"
                  caption={<>The donated console, two joysticks and one cartridge.</>}
                />
                <div className="me-body me-pa-carebody">
                  {careText.map((p, i) => (
                    <p key={p.slice(0, 24)} className={i === 0 ? "me-first" : undefined}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          </article>
        ) : null}

        <section className="me-patch me-rule" aria-labelledby="me-patch-head">
          <h2 className="me-patch-head" id="me-patch-head">
            The Patch Exchange
          </h2>
          <p className="me-listings-sub">Closing versions, Monday. Changes since last week’s close.</p>
          <div className="me-patch-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Game</th>
                  <th scope="col">Close</th>
                  <th scope="col">Chg.</th>
                  <th scope="col">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {patches.map(([game, ver, chg, note]) => (
                  <tr key={game} className={game === "Harbour Lights" ? "me-patch-ringed" : undefined}>
                    <th scope="row">{game}</th>
                    <td>{ver}</td>
                    <td>{chg}</td>
                    <td>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pencil name="ellipse-01" className="me-patch-ring" />
          </div>
          <p className="me-patch-foot">
            <b>Market report.</b> A quiet session lifted by an overnight surge in Harbour Lights, up a full patch on
            the arrival of fishing. Paper Round led the risers. No game closed lower; none ever does here.
          </p>
          <Photo
            photo={pick("arcade", 1)}
            sizes="(max-width: 760px) 100vw, 480px"
            className="me-pa-arcade"
            position="50% 40%"
            caption={
              <>
                <b>The Pier Arcade,</b> Saturday night, where the pinball league was decided by eleven points.
              </>
            }
          />
          <div className="me-ladder">
            <h3 className="me-box-head">The Tennis Ladder</h3>
            <p className="me-listings-sub">Square-ball tennis, all comers. Games won this season.</p>
            <table>
              <tbody>
                {ladder.map(([n, who, won]) => (
                  <tr key={n}>
                    <td>{n}</td>
                    <th scope="row">{who}</th>
                    <td>{won}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="me-ad me-ad--b me-col-ad">
            <p className="me-ad-big">The Pier Arcade</p>
            <p className="me-ad-text">Pinball, two plays a penny, Tuesdays. Grandparents admitted free with a grandchild to beat.</p>
          </div>
        </section>
      </div>

      <div className="me-pa-lower">
        {fishing ? (
          <article className="me-pa-fish">
            <p className="me-kicker">Updates</p>
            <h2 className="me-head me-head--wide">{fishing.headline}</h2>
            <p className="me-deck2 me-deck2--small">{fishing.dek}</p>
            <div className="me-pa-fishgrid">
              <Photo
                photo={pick("fishing")}
                sizes="(max-width: 760px) 100vw, 320px"
                className="me-pa-boat"
                duotone
                caption={<>The jetty, as it has looked for twenty-five years. It now has a use.</>}
              />
              <div className="me-body me-body--2">
                <p className="me-first">{fishing.body[0]}</p>
                {fishingMore.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        ) : null}

        <aside className="me-results me-rule" aria-labelledby="me-results-head">
          <div className="me-results-ink">
            <h2 className="me-box-head me-box-head--big" id="me-results-head">
              Arcade League
            </h2>
            <p className="me-listings-sub">Saturday’s results. Pinball, Division One.</p>
            <table>
              <tbody>
                {results.map(([a, sa, b, sb]) => (
                  <tr key={a}>
                    <th scope="row">{a}</th>
                    <td>{sa}</td>
                    <td className="me-results-v">v</td>
                    <td>{sb}</td>
                    <th scope="row">{b}</th>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="me-results-note">
              <b>Highest score:</b> 1,204,350, The Anchor, by a retired postman on his first ever go.{" "}
              <b>Drawn:</b> St Anne’s Youth and Harbour St., to the point, then shared a pizza.
            </p>
          </div>
        </aside>

        <article className="me-pa-grand me-rule">
          <p className="me-kicker">Hobbies</p>
          <h2 className="me-head">Grandmother, 84, wins her first race against her grandson</h2>
          <Photo
            photo={pick("controller", 1)}
            sizes="(max-width: 760px) 100vw, 320px"
            className="me-pa-sofa"
          />
          <div className="me-body me-body--2">
            {grandText.map((p, i) => (
              <p key={p.slice(0, 24)} className={i === 0 ? "me-first" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </article>
      </div>

      <section className="me-swaps" aria-labelledby="me-swaps-head">
        <h2 className="me-swaps-head" id="me-swaps-head">
          Swaps &amp; Wants
        </h2>
        <div className="me-swaps-cols">
          {swaps.map(([head, text]) => (
            <p key={text}>
              <b>{head}</b> {text}
            </p>
          ))}
        </div>
      </section>

      <Folio page={3} section="Pastimes" />
    </Sheet>
  );
}
