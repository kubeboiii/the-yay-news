// Issue 44, Friday 2 October 2026. Scheduled.
// Everything here is invented: the people, places, sources and numbers.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue44: SeedEdition = {
  issueNumber: 44,
  date: "2026-10-02",
  status: "scheduled",
  design: "broadsheet",
  colourway: "tropic-punch",

  front: [
    {
      slug: "ferry-terminal-choir",
      section: "screen-and-sound",
      kicker: "Music",
      headline:
        "Surprise choir fills a ferry terminal with song, and the 7:40 sails four minutes late",
      dek: "The captain asked them to finish the chorus first. Nobody on board complained.",
      body: [
        "Commuters waiting for the early crossing from Stray to Port Calloway on Thursday were queuing quietly with their coffees when a man by the ticket machine began to sing. Then the woman next to him joined in. Then about sixty other people who had, it turned out, been rehearsing for weeks.",
        "The Harbour Voices community choir had planned the performance as a thank-you to the ferry crew, who have kept the service running through every kind of weather for twenty years.",
        "The crew came down the gangway to listen. The captain radioed ahead to say the boat would be a little late, ‘for a very good reason’.",
        "“It was the best four minutes I've ever lost,” said one passenger. The choir says it has no plans to do it again, which is exactly what it said last time.",
      ],
      source: "Harbour Times (sample)",
      sticker: "Encore",
      photo: ["choir", 1],
    },
  ],

  inside: [
    {
      section: "gaming",
      stories: [
        {
          slug: "friday-game-jam",
          kicker: "Game jams",
          headline: "Friday-night game jam's theme was ‘snacks’; 400 games were made",
          dek: "The winner is about a biscuit trying to avoid being dunked.",
          body: [
            "Entrants had 48 hours to make a game about snacks. The winning entry, ‘Don't Dunk Me’, has a biscuit hero, a menacing mug of tea and a soundtrack played entirely on a kazoo.",
            "Every game is free to play online. The organisers recommend starting with the crisps one.",
          ],
          source: "Save State (sample)",
          photo: ["controller", 0],
        },
        {
          slug: "retro-racer-rerelease",
          kicker: "Retro",
          headline:
            "A forgotten 1990s kart racer comes back, restored by the fans who never stopped playing",
          dek: "They recreated the lost final track from a single blurry magazine photo.",
          body: [
            "The small community kept the game alive on old hardware for decades. The original developer has now given them permission to release their restoration for free.",
          ],
          source: "Coin-Op Chronicle (sample)",
          photo: "retroConsole",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "tug-of-war-sixty-years",
          kicker: "Tug of war",
          headline: "Village wins the county tug-of-war after 60 years of coming second",
          dek: "They credit a new technique: ‘everyone leaning back a bit more’.",
          body: [
            "Upper Brampton's team had reached the final every year since 1966 and lost it every time. This year they won in eleven seconds, then sat down on the grass and laughed until the medals arrived.",
          ],
          source: "Village Green Gazette (sample)",
        },
        {
          slug: "mascot-race-photo-finish",
          kicker: "Races",
          headline: "Charity mascot race ends in a photo finish between a carrot and a lighthouse",
          dek: "The judges called it for the carrot, by one leaf.",
          body: [
            "Twenty mascots ran 200 metres around a rugby pitch in Dunmore Cross. The lighthouse was leading until the final bend, where its lamp got caught on the bunting.",
          ],
          source: "Sunday League Weekly (sample)",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "toy-robot-museum-guide",
          kicker: "Robots",
          headline:
            "Museum's new tour guide is a small blue robot who knows 3,000 facts about spoons",
          dek: "It is technically a general museum guide. It has chosen to specialise.",
          body: [
            "The Ferrisham Museum of Everyday Things built the robot to lead school groups around the galleries. It does, but it always ends up in the cutlery room.",
            "Visitor numbers are up by a third. Staff put this down to the spoons.",
          ],
          source: "Robo Review (sample)",
          photo: ["robot", 1],
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "glow-worm-meadow",
          kicker: "Nature",
          headline: "Night survey finds a meadow's glow-worms have tripled in three years",
          dek: "Volunteers counted them with red torches and a lot of whispering.",
          body: [
            "The Lark Meadow Trust stopped mowing part of its meadow in 2023 to give insects more room. This summer's count found more than 900 glowing females, up from about 300 when the survey began.",
            "The trust plans to open the meadow for quiet evening walks next summer.",
          ],
          source: "Countryside Chronicle (sample)",
        },
        {
          slug: "songbird-ice-cream-tune",
          kicker: "Birds",
          headline: "Garden songbird has learned the tune of the local ice-cream van",
          dek: "Neighbours say they now run outside twice as often, and are disappointed half the time.",
          body: [
            "The bird, a regular on a fence post in Linden Row, has been singing the first four notes of the van's chime every afternoon for a fortnight. Bird-watchers say mimicry is well known in some species. The van's driver says he is flattered.",
          ],
          source: "Garden Gazette (sample)",
          photo: "songbird",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "honesty-box-record",
          kicker: "Small business",
          headline: "Farm-gate honesty box has balanced perfectly every week for ten years",
          dek: "Once, it was 20p over. The farmer framed the 20p.",
          body: [
            "The Marsh End egg stall runs on trust: take your eggs, leave your money in a tin. Its owner has kept a notebook of every week's takings since 2016 and says the box has never been short.",
          ],
          source: "Pocket Money Times (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "compliment-generator",
          kicker: "Websites",
          headline:
            "A website that gives you one very specific compliment a day hits a million visits",
          dek: "Today's: “You are the kind of person who always knows where the scissors are.”",
          body: [
            "The site's creator writes every compliment herself. She says the trick is to be precise: ‘Nobody believes “you're great”. Everybody believes they're good at finding scissors.’",
          ],
          source: "Around the Web (sample)",
        },
      ],
    },
    {
      section: "on-this-day",
      stories: [
        {
          slug: "self-buttering-toast-patent",
          kicker: "Odd inventions",
          headline: "From the archive: the 1926 patent for self-buttering toast",
          dek: "It worked. It worked far too well.",
          body: [
            "According to our (entirely imaginary) back issues, inventor Horace Pim demonstrated his machine at the Wickerby Fair, where it buttered 300 slices in an hour, the table, and most of a visiting mayor. He went on to invent the butter knife holder.",
          ],
          source: "Yay News Archive (sample)",
        },
        {
          slug: "first-town-kite-day",
          kicker: "Fun firsts",
          headline: "On this day: the first town kite day, when 1,000 kites flew over Merrow",
          dek: "One of them is said to still be up there.",
          body: [
            "The event was organised by a schoolteacher who wanted to see ‘the sky busy for once’. Merrow still holds kite day on the first Friday of October, and still leaves one string tied to the town-hall railings, just in case.",
          ],
          source: "Yay News Archive (sample)",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "4",
        caption: "minutes the 7:40 ferry waited so a choir could finish its chorus",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Friday: clear skies all the way to the weekend",
        detail:
          "A high-pressure system of plans building by afternoon. Gusts of ‘shall we get chips?’ by six.",
      },
    },
    {
      type: "quote",
      content: {
        text: "It was the best four minutes I've ever lost.",
        by: "A ferry passenger, Stray",
      },
    },
    {
      type: "correction",
      content: {
        text: "Thursday's edition said a library robot hums. It has since been heard whistling. We are monitoring the situation.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "A carrot costume, gently used, for next year's mascot race. The lighthouse is training.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FREE",
        text: "An open-source weekend planner with one option: ‘nothing much’. Extremely reliable.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FOR HIRE",
        text: "Experienced choir, will surprise you at a place of your choosing. Ferries preferred.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: It's Friday!",
          "PIGEON: What's different about Friday?",
          "PIP: Everyone's happier.",
          "PIGEON: So it's like every day, but for humans.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. Have a lovely weekend." } },
  ],

  puzzles: [
    mini(
      [
        ["CHIRP", "What the songbird does before the ice-cream van arrives"],
        ["EAGLE", "A big bird, or a very good golf score"],
        ["ROSES", "Red flowers, often in a bunch"],
      ],
      [
        ["CHEER", "What the ferry passengers did at the end"],
        ["POEMS", "Accidental rhymes, if you collect enough"],
      ],
    ),
    ladder(["HATE", "HAVE", "HOVE", "LOVE"]),
    riddle("The more of them you take, the more you leave behind. What are they?", "Footsteps"),
  ],
};
