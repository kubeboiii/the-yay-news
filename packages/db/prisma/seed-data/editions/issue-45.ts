// Issue 45, Saturday 3 October 2026. Scheduled. A weekend zine: short, loud and pastry-forward.
// Everything here is invented: the people, places, sources and numbers.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue45: SeedEdition = {
  issueNumber: 45,
  date: "2026-10-03",
  status: "scheduled",
  design: "zine",
  colourway: "paint-box",

  front: [
    {
      slug: "croissant-relay",
      section: "internet-and-culture",
      kicker: "Weekend",
      headline:
        "A town hands one croissant from bakery to bakery until all eleven have added something",
      dek: "It started plain. It finished with jam, custard, almonds, a candle and a tiny flag.",
      body: [
        "The Merrow Croissant Relay began as a joke between two bakers who shared a delivery van. Last Saturday it became a town event: one croissant, carried in a glass box, passed along all eleven bakeries on the high street, each one adding a single finishing touch.",
        "Crowds followed it from door to door. By the halfway point it had acquired a light dusting of cinnamon, a swirl of custard and a small paper crown. The final bakery added a birthday candle, ‘because it had been through a lot’.",
        "The croissant was then cut into forty pieces and shared among the people who had followed it the whole way. Reviews were mixed but enthusiastic.",
        "Organisers say next year's relay will feature a doughnut. The bakers have already started arguing about the order.",
      ],
      source: "Merrow Mercury (sample)",
      sticker: "Ta-da!",
      photo: ["picnic", 1],
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "confetti-cannon-encore",
          kicker: "Gigs",
          headline:
            "Band's confetti cannon misfires and covers only the band, who carry on regardless",
          dek: "The crowd says it was the best encore of the summer.",
          body: [
            "The Paper Moons were two songs into their encore at the Lark Fields festival when the cannon, pointed the wrong way, emptied itself over the stage. They finished the set looking like a birthday cake.",
          ],
          source: "Music Notes (sample)",
          photo: ["concert", 0],
        },
        {
          slug: "festival-field-singalong",
          kicker: "Festivals",
          headline: "A whole festival field sings the same song at sunrise, unplanned",
          dek: "Someone started it by a tent. Twenty minutes later, 3,000 people knew the words.",
          body: [
            "Festival-goers at Lark Fields said the singalong started at about 6am with one person and a ukulele. Nobody is sure who it was. The song, fittingly, was about mornings.",
          ],
          source: "Airwaves (sample)",
          photo: ["concert", 1],
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "weekend-picnic-game",
          kicker: "Indie",
          headline: "A game about packing the perfect picnic basket is this weekend's favourite",
          dek: "Every item must fit. The watermelon never fits.",
          body: [
            "‘Hamper’ is a small puzzle game made by a couple in Stray who say they argued about picnic packing for fifteen years before turning it into a game. It has 80 levels and a secret one involving a flask.",
          ],
          source: "Indie Arcade (sample)",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "parkrun-in-pyjamas",
          kicker: "Running",
          headline: "Weekend fun run held in pyjamas draws its biggest field ever",
          dek: "The winner wore slippers. Organisers are reviewing the rules, but not very seriously.",
          body: [
            "The Oakhollow Saturday five-kilometre run holds a pyjama day once a year. This year 740 runners turned up in nightwear, and the post-race hot chocolate ran out in eleven minutes.",
          ],
          source: "Finish Line (sample)",
        },
        {
          slug: "beach-volleyball-seagull",
          kicker: "Beach",
          headline:
            "Beach volleyball final paused after a seagull steals the ball and plays with it",
          dek: "Both teams agreed the seagull had a good touch.",
          body: [
            "The gull carried the ball a short distance down the beach at Selkie Bay, bounced it twice and left it on the sand. The match resumed with a replayed point and an extra round of applause.",
          ],
          source: "Sunday League Weekly (sample)",
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "tortoise-pen-pal",
          kicker: "Animals",
          headline:
            "Barnaby the tortoise now has a pen pal: a 90-year-old tortoise three towns away",
          dek: "Their keepers send each other a photo and one fact a week.",
          body: [
            "Readers may remember Barnaby's grand garden tour. After his keepers were contacted by a sanctuary in Ambleside Cross, the two tortoises began ‘corresponding’. This week's fact from Barnaby: he likes strawberries. This week's reply: so does she.",
          ],
          source: "Hollowmere Herald (sample)",
          photo: "tortoise",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "doorbell-plays-guess-the-tune",
          kicker: "Makers",
          headline:
            "Home-made doorbell plays a different tune each time, and visitors must guess it to come in",
          dek: "The postman is currently on a nine-day streak.",
          body: [
            "The doorbell was built by a teenager in Wexby from a small speaker and a free music library. Her family say it has made every delivery ‘a bit of a quiz’, which they consider an improvement.",
          ],
          source: "Maker Monthly (sample)",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "bakery-loyalty-card",
          kicker: "Small business",
          headline:
            "Bakery's loyalty card has no reward, just stamps. It is the most popular card in town",
          dek: "Collectors compare them at the bus stop.",
          body: [
            "The stamps change every week — a croissant, a cat, a tiny sun — and customers have started collecting them for fun. The bakery says nobody has ever asked what the full card is for.",
          ],
          source: "High Street News (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "tidy-shelf-videos",
          kicker: "Video",
          headline:
            "Hour-long videos of one person tidying a single shelf are the internet's new lullaby",
          dek: "No talking. No music. Just the soft click of books being straightened.",
          body: [
            "The channel's creator says she started filming to stay focused. Her viewers say they fall asleep before she gets to the end, and that this is a compliment.",
          ],
          source: "Around the Web (sample)",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "11",
        caption: "bakeries one croissant visited before it was finally eaten",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Saturday: warm spells of doing nothing",
        detail: "Picnic conditions from late morning. Patchy confetti over festival fields.",
      },
    },
    {
      type: "quote",
      content: { text: "It had been through a lot.", by: "The eleventh baker, on adding a candle" },
    },
    {
      type: "correction",
      content: {
        text: "Friday's edition said the carrot won the mascot race by one leaf. It was two leaves. The lighthouse has asked us to stop bringing it up.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "A doughnut willing to be passed along eleven bakeries. Must be brave. Jam optional.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "OFFERED",
        text: "A free, open-source app that tells you which park bench is sunniest right now.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: Want to share a croissant?",
          "PIGEON: How much of it?",
          "PIP: Half?",
          "PIGEON: I was hoping you'd say crumbs. I love crumbs.",
        ],
      },
    },
    {
      type: "sign_off",
      content: { text: "You're done for today. Go and have a lovely Saturday." },
    },
  ],

  puzzles: [
    mini(
      [
        ["TREES", "Where the conkers come from"],
        ["COCOA", "Hot drink after a pyjama fun run"],
        ["SMILE", "What we hope this paper leaves on your face"],
      ],
      [
        ["TACOS", "Folded food, best eaten over a plate"],
        ["STAGE", "Where the confetti cannon went off"],
      ],
    ),
    ladder(["FOUR", "FOUL", "FOOL", "FOOT", "FORT", "FORE", "FIRE", "FIVE"]),
    riddle("What has one eye but can't see?", "A needle"),
  ],
};
