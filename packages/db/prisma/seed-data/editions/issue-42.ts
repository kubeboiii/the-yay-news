// Issue 42, Wednesday 30 September 2026. Ported from the Phase 1 mockup data
// (apps/frontend/src/app/mockups/_data/sample-edition.ts), which the v1 broadsheet is designed around.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue42: SeedEdition = {
  issueNumber: 42,
  date: "2026-09-30",
  status: "published",
  design: "broadsheet",
  colourway: "original",

  front: [
    {
      slug: "dancing-octopus",
      section: "discoveries",
      kicker: "Deep sea",
      headline: "Deep-sea camera films an octopus that appears to dance",
      dek: "Researchers watched it sway, spin and flash colours for eleven minutes, and nobody is quite sure why.",
      body: [
        "A remote camera parked 1,200 metres below the surface was meant to record nothing more exciting than drifting sediment. Instead, it caught a small, pale octopus performing what the research team can only describe as a routine.",
        "For eleven minutes the animal swayed from side to side, lifted two arms in slow arcs, spun on the spot and rippled through a sequence of colours — pink, cream, a flash of copper — before settling back onto the seabed as if nothing had happened.",
        "“We rewatched it about forty times,” said one of the team. “Every time, somebody in the room started humming.” The leading theory is that it was displaying to another octopus just out of frame. The more popular theory in the lab is that it simply felt like it.",
        "The species hasn't been formally identified yet, which means it doesn't have a name. The team has received several hundred suggestions from the public. The front-runner is currently “Disco Pete”.",
        "The camera will stay in place for another six months. The researchers say they are hoping for an encore.",
      ],
      source: "Ocean Research Journal (sample)",
      readMinutes: 3,
      sticker: "Wow!",
      photo: "octopus",
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "moonbeam-diner-musical",
          kicker: "TV",
          headline: "Cult cartoon ‘Moonbeam Diner’ returns — with a musical episode",
          dek: "The third season opens with twelve original songs, one of them sung entirely by a toaster.",
          body: [
            "After a two-year wait, the animated comedy about a diner on the Moon is back, and it has decided to open with a full musical episode.",
            "The creators say the toaster's ballad was written in a single afternoon and then rewritten nine times because it kept making the voice cast cry.",
          ],
          source: "Screen Weekly (sample)",
          readMinutes: 1,
          sticker: "New season",
          photo: "retroTv",
        },
        {
          slug: "village-choir-power-ballad",
          kicker: "Music",
          headline: "Village choir's power-ballad cover passes 10 million streams",
          dek: "Forty singers, one church hall, and a key change that has the internet in tears.",
          body: [
            "The choir recorded it on a phone propped against a hymn book. Three weeks later it is the most-streamed choral recording in the country.",
            "The oldest member, 91, says she has never heard of the original band but thinks the drummer should be proud.",
          ],
          source: "Music Notes (sample)",
          readMinutes: 1,
          photo: "choir",
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "bread-and-butter",
          kicker: "Indie",
          headline: "Cosy game about a cat running a bakery tops the charts",
          dek: "‘Bread & Butter’ was made by two people in a spare bedroom and outsold three blockbusters in its first week.",
          body: [
            "Players run a tiny bakery as a cat named Butter, serving pastries to a village of increasingly specific customers.",
            "The developers say the most requested feature is the ability to pet the customers. It is coming in the next update.",
          ],
          source: "Indie Arcade (sample)",
          readMinutes: 1,
          sticker: "#1",
          photo: "bakeryCat",
        },
        {
          slug: "fishing-patch",
          kicker: "Updates",
          headline: "Studio patches its 25-year-old game to add a fishing minigame",
          dek: "Nobody asked for it. Everybody is playing it.",
          body: [
            "The patch arrived with no announcement and a one-line note: “You can fish now.” Fans have already caught a fish that should not exist.",
          ],
          source: "Patch Notes Daily (sample)",
          readMinutes: 1,
          photo: "fishing",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "pit-crew-dance",
          kicker: "Motorsport",
          headline: "Rookie's first podium celebrated with a synchronised pit-crew dance",
          dek: "Twenty mechanics, one routine, rehearsed in secret for a whole season.",
          body: [
            "The crew had practised the dance for months, waiting for a result worth celebrating. It finally came in the season's last race.",
          ],
          source: "Grid Talk (sample)",
          readMinutes: 1,
          photo: "pitStop",
        },
        {
          slug: "six-into-fruit-bowl",
          kicker: "Cricket",
          headline: "Winning six lands perfectly in a bakery's fruit bowl",
          dek: "The club has offered the baker free membership. The baker has offered free scones.",
          body: [
            "A last-ball six cleared the boundary, the car park and the street, and came to rest among the bakery's display apples without breaking a single one.",
          ],
          source: "Village Green Gazette (sample)",
          readMinutes: 1,
          photo: "cricket",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "birdsong-phones",
          kicker: "Open source",
          headline: "Free app turns old phones into birdsong identifiers",
          dek: "Volunteers have already put 3,000 retired phones in parks and gardens.",
          body: [
            "The open-source project listens for birdsong, names the species on a tiny screen, and keeps a running tally for anyone passing by.",
          ],
          source: "Open Tech Digest (sample)",
          readMinutes: 1,
          photo: "songbird",
        },
        {
          slug: "fitted-sheet-robot",
          kicker: "Startups",
          headline: "Robot learns to fold a fitted sheet, finally",
          dek: "It took 40,000 attempts. Engineers say the robot now ‘understands the corners’.",
          body: [
            "The team calls it the hardest problem in household robotics, and they are only half joking.",
          ],
          source: "Robo Review (sample)",
          readMinutes: 1,
          sticker: "Finally",
          photo: "bedSheets",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "pay-it-forward-cafe",
          kicker: "Small business",
          headline: "Pay-it-forward café serves its 100,000th free coffee",
          dek: "Customers buy an extra cup for a stranger. The board of prepaid coffees has never been empty.",
          body: [
            "The owner started the scheme with one sticky note on the counter. There are now so many notes that they have their own wall.",
          ],
          source: "High Street News (sample)",
          readMinutes: 1,
          photo: "coffee",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "tiny-wins-thread",
          kicker: "Reddit",
          headline: "A thread of ‘tiny wins’ passes one million upvotes",
          dek: "Top post: “I remembered why I walked into the kitchen.”",
          body: [
            "What started as one person celebrating a parallel-park turned into the internet's longest list of small victories.",
          ],
          source: "Around the Web (sample)",
          readMinutes: 1,
          photo: "stickyNotes",
        },
        {
          slug: "benches-with-views",
          kicker: "Newsletters",
          headline: "A weekly map of benches with the best views goes viral",
          dek: "Each bench gets a rating out of ten, plus notes on sunsets, pigeons and sandwich suitability.",
          body: [
            "The newsletter began as a walking hobby. It now has readers sending in benches from 60 countries.",
          ],
          source: "The Bench Letter (sample)",
          readMinutes: 1,
          photo: "bench",
        },
      ],
    },
    {
      section: "food-and-words",
      stories: [
        {
          slug: "pickle-ice-cream",
          kicker: "Weird food",
          headline: "The internet has decided pickle ice cream is actually good",
          dek: "A small creamery made one tub as a joke. They now make four hundred a week.",
          body: [
            "It started as a dare between two staff members at the end of a slow shift. The first tub sold out before lunch the next day.",
          ],
          source: "The Scoop (sample)",
          readMinutes: 1,
          photo: "pickles",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "12,408",
        caption:
          "picnic blankets laid end to end at a village fête — a new, entirely unofficial record",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Sunny with scattered memes",
        detail: "80% chance of cat videos by lunchtime. Light drizzle of dad jokes in the evening.",
      },
    },
    {
      type: "quote",
      content: {
        text: "We didn't plan a record. We just kept saying yes to more sandwiches.",
        by: "Organiser of the Longest Picnic, probably",
      },
    },
    {
      type: "word_of_the_day",
      content: {
        word: "Apricity",
        pronunciation: "a·PRIS·i·tee",
        meaning: "The warmth of the sun in winter.",
        example: "We sat on the bench and soaked up the apricity like two contented lizards.",
      },
    },
    {
      type: "correction",
      content: {
        text: "Yesterday we reported that otters hold hands while they sleep. They hold hands more than we said. We regret the understatement.",
      },
    },
    {
      type: "correction",
      content: {
        text: "In Monday's edition we described a golden retriever as ‘a very good boy’. He is, in fact, an excellent boy.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Beta testers for a gardening game where the vegetables have opinions. Must enjoy being judged by a carrot.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FREE",
        text: "An open-source typeface that looks like handwriting on a steamy window. Download and fog up your posters.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "LOST",
        text: "One sense of urgency, last seen on Friday afternoon. No reward; please do not return.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FOR HIRE",
        text: "Retired lighthouse keeper offers calm, reliable waving at passing boats. References from several ferries.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: Did you see the news today?",
          "PIGEON: All of it was nice.",
          "PIP: Suspicious.",
          "PIGEON: No. Just Wednesday.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. See you tomorrow." } },
  ],

  puzzles: [
    mini(
      [
        ["HEART", "Organ that does the ‘aww’"],
        ["PLANT", "Green housemate, or what you do with a seed"],
        ["YODEL", "Sing like a cheerful Alpine goatherd"],
      ],
      [
        ["HAPPY", "How this paper hopes you feel"],
        ["TOTAL", "The sum of it all"],
      ],
    ),
    ladder(["SAD", "SAY", "SOY", "JOY"]),
    riddle("What has keys but can't open a single door?", "A piano"),
  ],
};
