// Invented sample content for design mockups. Every story, name and number here is fictional,
// so the mockups can be judged on design without anyone mistaking them for real news.

export type Story = {
  slug: string;
  section: string;
  kicker: string;
  headline: string;
  dek: string;
  body: string[];
  source: string;
  readMinutes: number;
  sticker?: string;
};

export type Section = {
  slug: string;
  name: string;
  tagline: string;
  stories: Story[];
};

export const edition = {
  name: "The Yay News",
  tagline: "Only good news. Mostly fun. Occasionally weird.",
  date: "Wednesday, 30 September 2026",
  volume: 1,
  issue: 42,
  price: "Free, forever",
  readMinutes: 10,

  weather: {
    headline: "Sunny with scattered memes",
    detail: "80% chance of cat videos by lunchtime. Light drizzle of dad jokes in the evening.",
  },

  numberOfTheDay: {
    value: "12,408",
    caption:
      "picnic blankets laid end to end at a village fête — a new, entirely unofficial record",
  },

  quoteOfTheDay: {
    text: "We didn't plan a record. We just kept saying yes to more sandwiches.",
    by: "Organiser of the Longest Picnic, probably",
  },

  lead: {
    slug: "dancing-octopus",
    section: "Discoveries",
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
  } satisfies Story,

  sections: [
    {
      slug: "screen-and-sound",
      name: "Screen & Sound",
      tagline: "Shows, films, music and the odd trailer",
      stories: [
        {
          slug: "moonbeam-diner-musical",
          section: "Screen & Sound",
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
        },
        {
          slug: "village-choir-power-ballad",
          section: "Screen & Sound",
          kicker: "Music",
          headline: "Village choir's power-ballad cover passes 10 million streams",
          dek: "Forty singers, one church hall, and a key change that has the internet in tears.",
          body: [
            "The choir recorded it on a phone propped against a hymn book. Three weeks later it is the most-streamed choral recording in the country.",
            "The oldest member, 91, says she has never heard of the original band but thinks the drummer should be proud.",
          ],
          source: "Music Notes (sample)",
          readMinutes: 1,
        },
      ],
    },
    {
      slug: "gaming",
      name: "Gaming",
      tagline: "Releases, indie gems and gaming culture",
      stories: [
        {
          slug: "bread-and-butter",
          section: "Gaming",
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
        },
        {
          slug: "fishing-patch",
          section: "Gaming",
          kicker: "Updates",
          headline: "Studio patches its 25-year-old game to add a fishing minigame",
          dek: "Nobody asked for it. Everybody is playing it.",
          body: [
            "The patch arrived with no announcement and a one-line note: “You can fish now.” Fans have already caught a fish that should not exist.",
          ],
          source: "Patch Notes Daily (sample)",
          readMinutes: 1,
        },
      ],
    },
    {
      slug: "sports",
      name: "Sports",
      tagline: "The moments worth talking about",
      stories: [
        {
          slug: "pit-crew-dance",
          section: "Sports",
          kicker: "Motorsport",
          headline: "Rookie's first podium celebrated with a synchronised pit-crew dance",
          dek: "Twenty mechanics, one routine, rehearsed in secret for a whole season.",
          body: [
            "The crew had practised the dance for months, waiting for a result worth celebrating. It finally came in the season's last race.",
          ],
          source: "Grid Talk (sample)",
          readMinutes: 1,
        },
        {
          slug: "six-into-fruit-bowl",
          section: "Sports",
          kicker: "Cricket",
          headline: "Winning six lands perfectly in a bakery's fruit bowl",
          dek: "The club has offered the baker free membership. The baker has offered free scones.",
          body: [
            "A last-ball six cleared the boundary, the car park and the street, and came to rest among the bakery's display apples without breaking a single one.",
          ],
          source: "Village Green Gazette (sample)",
          readMinutes: 1,
        },
      ],
    },
    {
      slug: "tech",
      name: "Tech",
      tagline: "Clever things people made",
      stories: [
        {
          slug: "birdsong-phones",
          section: "Tech",
          kicker: "Open source",
          headline: "Free app turns old phones into birdsong identifiers",
          dek: "Volunteers have already put 3,000 retired phones in parks and gardens.",
          body: [
            "The open-source project listens for birdsong, names the species on a tiny screen, and keeps a running tally for anyone passing by.",
          ],
          source: "Open Tech Digest (sample)",
          readMinutes: 1,
        },
        {
          slug: "fitted-sheet-robot",
          section: "Tech",
          kicker: "Startups",
          headline: "Robot learns to fold a fitted sheet, finally",
          dek: "It took 40,000 attempts. Engineers say the robot now ‘understands the corners’.",
          body: [
            "The team calls it the hardest problem in household robotics, and they are only half joking.",
          ],
          source: "Robo Review (sample)",
          readMinutes: 1,
          sticker: "Finally",
        },
      ],
    },
    {
      slug: "money",
      name: "Money",
      tagline: "Only the fun kind",
      stories: [
        {
          slug: "pay-it-forward-cafe",
          section: "Money",
          kicker: "Small business",
          headline: "Pay-it-forward café serves its 100,000th free coffee",
          dek: "Customers buy an extra cup for a stranger. The board of prepaid coffees has never been empty.",
          body: [
            "The owner started the scheme with one sticky note on the counter. There are now so many notes that they have their own wall.",
          ],
          source: "High Street News (sample)",
          readMinutes: 1,
        },
      ],
    },
    {
      slug: "internet-and-culture",
      name: "Internet & Culture",
      tagline: "The best of the internet, so you don't have to scroll",
      stories: [
        {
          slug: "tiny-wins-thread",
          section: "Internet & Culture",
          kicker: "Reddit",
          headline: "A thread of ‘tiny wins’ passes one million upvotes",
          dek: "Top post: “I remembered why I walked into the kitchen.”",
          body: [
            "What started as one person celebrating a parallel-park turned into the internet's longest list of small victories.",
          ],
          source: "Around the Web (sample)",
          readMinutes: 1,
        },
        {
          slug: "benches-with-views",
          section: "Internet & Culture",
          kicker: "Newsletters",
          headline: "A weekly map of benches with the best views goes viral",
          dek: "Each bench gets a rating out of ten, plus notes on sunsets, pigeons and sandwich suitability.",
          body: [
            "The newsletter began as a walking hobby. It now has readers sending in benches from 60 countries.",
          ],
          source: "The Bench Letter (sample)",
          readMinutes: 1,
        },
      ],
    },
  ] satisfies Section[],

  guest: {
    slug: "food-and-words",
    name: "Food & Words",
    tagline: "Guest section — rotates every other day",
    wordOfTheDay: {
      word: "Apricity",
      pronunciation: "a·PRIS·i·tee",
      meaning: "The warmth of the sun in winter.",
      example: "We sat on the bench and soaked up the apricity like two contented lizards.",
    },
    food: {
      headline: "The internet has decided pickle ice cream is actually good",
      dek: "A small creamery made one tub as a joke. They now make four hundred a week.",
    },
  },

  puzzles: {
    crossword: {
      title: "The Mini",
      // "#" is a black square. Numbered cells are where answers start.
      grid: ["HEART", "A###O", "PLANT", "P###A", "YODEL"],
      numbers: { "0,0": 1, "0,4": 2, "2,0": 3, "4,0": 4 } as Record<string, number>,
      across: [
        { n: 1, clue: "Organ that does the ‘aww’", answer: "HEART" },
        { n: 3, clue: "Green housemate, or what you do with a seed", answer: "PLANT" },
        { n: 4, clue: "Sing like a cheerful Alpine goatherd", answer: "YODEL" },
      ],
      down: [
        { n: 1, clue: "How this paper hopes you feel", answer: "HAPPY" },
        { n: 2, clue: "The sum of it all", answer: "TOTAL" },
      ],
    },
    wordLadder: {
      title: "Word Ladder",
      instructions: "Change one letter at a time to climb from SAD to JOY.",
      start: "SAD",
      end: "JOY",
      steps: 2,
      solution: ["SAD", "SAY", "SOY", "JOY"],
    },
    riddle: {
      title: "The Riddle",
      question: "What has keys but can't open a single door?",
      answer: "A piano",
    },
    yesterday: "Yesterday's riddle: a towel gets wetter the more it dries.",
  },

  corrections: [
    "Yesterday we reported that otters hold hands while they sleep. They hold hands more than we said. We regret the understatement.",
    "In Monday's edition we described a golden retriever as ‘a very good boy’. He is, in fact, an excellent boy.",
  ],

  classifieds: [
    {
      heading: "WANTED",
      text: "Beta testers for a gardening game where the vegetables have opinions. Must enjoy being judged by a carrot.",
    },
    {
      heading: "FREE",
      text: "An open-source typeface that looks like handwriting on a steamy window. Download and fog up your posters.",
    },
    {
      heading: "LOST",
      text: "One sense of urgency, last seen on Friday afternoon. No reward; please do not return.",
    },
    {
      heading: "FOR HIRE",
      text: "Retired lighthouse keeper offers calm, reliable waving at passing boats. References from several ferries.",
    },
  ],

  comic: {
    title: "Pip & Pigeon",
    panels: [
      "PIP: Did you see the news today?",
      "PIGEON: All of it was nice.",
      "PIP: Suspicious.",
      "PIGEON: No. Just Wednesday.",
    ],
  },

  signOff: "You're done for today. See you tomorrow.",
};

export const allStories: Story[] = [edition.lead, ...edition.sections.flatMap((s) => s.stories)];
