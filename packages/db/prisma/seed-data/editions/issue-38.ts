// Issue 38, Saturday 26 September 2026. A weekend tabloid: a little slower, a little sillier.
// Everything here is invented: the people, places, sources and numbers.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue38: SeedEdition = {
  issueNumber: 38,
  date: "2026-09-26",
  status: "published",
  design: "tabloid",
  colourway: "carousel",

  front: [
    {
      slug: "tortoise-grand-tour",
      section: "discoveries",
      kicker: "Animals",
      headline: "Sanctuary's oldest tortoise completes his first lap of the new garden",
      dek: "Barnaby, 104, took eleven days, stopped at every dandelion, and was met at the finish by a small crowd with a banner.",
      body: [
        "When the Little Hollowmere tortoise sanctuary opened its new walled garden in early September, the keepers wondered whether Barnaby would bother exploring it. He is 104, he likes his lawn, and he has never been one for change.",
        "He set off on a Tuesday. Keepers tracked his progress on a chalkboard by the gate: past the rosemary on day two, a long lunch under the plum tree on day five, a detour to inspect a watering can on day eight.",
        "By the time he rounded the last corner, word had got out. About forty visitors were waiting with a hand-painted banner reading ‘GO ON, BARNABY’. He walked under it, ate a strawberry that was held out for him, and went to sleep.",
        "“He did the whole thing at his own pace, which is the only pace he has,” said the head keeper. “Honestly, it was the most exciting week we've had in years.”",
        "The sanctuary says it will mark the route with small wooden signs, so visitors can walk the Barnaby Loop themselves. It should take about four minutes.",
      ],
      source: "Hollowmere Herald (sample)",
      sticker: "104 yrs young",
      photo: "tortoise",
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "kazoo-orchestra-silent-film",
          kicker: "Film",
          headline: "Silent-film festival hires a live orchestra of 60 kazoos",
          dek: "The organisers wanted something ‘period-appropriate but more fun’. They got both.",
          body: [
            "The Fennick Silent Film Weekend usually accompanies its screenings with a lone pianist. This year, after a vote among regulars, it booked the Brassless Kazoo Ensemble instead.",
            "Sixty players buzzed their way through a ninety-minute comedy about a runaway pram. Several audience members reported that the chase scene was improved by at least forty per cent.",
          ],
          source: "Picture House Post (sample)",
          photo: ["cinema", 0],
        },
        {
          slug: "mystery-vinyl-pen-pals",
          kicker: "Music",
          headline: "Record shop's ‘mystery vinyl’ bin turns strangers into pen pals",
          dek: "Every wrapped record carries a note from the last person who loved it.",
          body: [
            "Customers who trade in an album at Groove Street Records are asked to write a short note about why it mattered to them. The record is wrapped in brown paper with the note tucked inside and sold for a fiver.",
            "More than 300 buyers have now written back, via a corkboard by the till. Two of them have discovered they went to the same school.",
          ],
          source: "Needle Drop (sample)",
          photo: ["vinyl", 1],
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "attic-console-high-score",
          kicker: "Retro",
          headline:
            "Console found in an attic still holds a 1994 high score — and its owner just beat it",
          dek: "It took her 32 years and one very determined afternoon.",
          body: [
            "Clearing her parents' loft, Imogen Tarrow found the grey console she had played as a ten-year-old. It still switched on. Her name was still at the top of the leaderboard of a game about a jumping frog.",
            "She beat her own score by 180 points on the third try, then called her brother, who had been second on that list since 1994, to let him know.",
          ],
          source: "Save State (sample)",
          photo: "retroConsole",
        },
        {
          slug: "grandparents-arcade-hour",
          kicker: "Arcades",
          headline:
            "Seaside arcade opens a ‘grandparents only’ hour, and it is extremely competitive",
          dek: "Tuesday mornings at the Port Calloway pier have become a league.",
          body: [
            "The hour was meant to be a quiet time for older visitors. Within a month it had a scoreboard, a rivalry on the air-hockey table and a trophy made from a gold-painted teapot.",
          ],
          source: "Coin-Op Chronicle (sample)",
          photo: ["arcade", 0],
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "last-place-rowing-trophy",
          kicker: "Rowing",
          headline:
            "Crew finishes last by four minutes, celebrates like champions, gets a trophy anyway",
          dek: "Organisers were so charmed that they invented a new award on the spot.",
          body: [
            "The Wexby Allotment Rowing Club had only started training in June. At the Lark River regatta they came in so far behind the field that the next race had to wait for them.",
            "They crossed the line singing. The judges presented them with the first ever ‘Best Time Had’ cup, which will now be awarded every year.",
          ],
          source: "Riverbank Sport (sample)",
        },
        {
          slug: "keeper-signed-ball",
          kicker: "Football",
          headline:
            "Goalkeeper saves a penalty — then the whole opposing team signs the ball for her",
          dek: "It was her first match back after moving towns.",
          body: [
            "The save came in the last minute of an amateur league game in Dunmore Cross. The striker who took the penalty was the first to shake her hand, and by full time the ball had eleven signatures on it, none of them her own teammates'.",
          ],
          source: "Sunday League Weekly (sample)",
          photo: "stadium",
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "jellyfish-new-glow",
          kicker: "Ocean",
          headline: "Jellyfish seen glowing in an unusual shade of peach off the Fennick Isles",
          dek: "Divers say it looked ‘like a tiny sunset going for a swim’.",
          body: [
            "Night divers from a local club filmed the jellyfish drifting near a kelp bed. Marine biologists they sent the footage to say the colour is unusual and they would love to see more of it.",
            "The club has already planned three more night dives. Everyone has volunteered.",
          ],
          source: "Tidewatch (sample)",
          photo: ["jellyfish", 0],
        },
        {
          slug: "school-sunflowers-taller-than-school",
          kicker: "Plants",
          headline: "Sunflowers in a primary-school garden grow taller than the school",
          dek: "The tallest is 5.2 metres. The school is 4.8.",
          body: [
            "Pupils at Ashgrove Primary planted the seeds in April as a science project. They measured them every Friday, and on the last Friday of the summer the tallest one passed the gutter.",
            "The children have named it Gerald and asked that it be allowed to attend assemblies.",
          ],
          source: "Garden Gazette (sample)",
          photo: ["sunflowers", 0],
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "high-five-robot",
          kicker: "Makers",
          headline: "Hobbyist builds a robot whose only job is to give you a high five",
          dek: "It waits by the front door and never leaves anyone hanging.",
          body: [
            "The robot uses a small camera to spot a raised hand and meets it with a padded palm at exactly the right height. Its builder, a retired clockmaker, says it has delivered 2,400 high fives since spring.",
            "He has published the plans for free. Several schools have already built their own.",
          ],
          source: "Maker Monthly (sample)",
          photo: ["robot", 0],
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "compliments-as-payment",
          kicker: "Small business",
          headline: "Bakery accepts compliments as payment for one day, and takes in 3,112 of them",
          dek: "The most common one was about the cinnamon buns. The best was about the baker's hat.",
          body: [
            "To celebrate ten years in business, a bakery in Pellinghurst let customers pay for one item each with a sincere compliment. Staff wrote every one on a paper bag and hung them in the window.",
            "The owner says it was the most profitable day she has ever had, ‘in every way except money’.",
          ],
          source: "High Street News (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "cloud-spotting-club",
          kicker: "Online",
          headline: "Online cloud-spotting club passes 200,000 members",
          dek: "This week's favourite: a cloud that looks exactly like a sheep looking at a smaller sheep.",
          body: [
            "Members post a photo of the sky and a description of what they see. Nobody is allowed to say a cloud just looks like a cloud. Moderators are, by all accounts, very strict about this.",
          ],
          source: "Around the Web (sample)",
        },
      ],
    },
    {
      section: "on-this-day",
      stories: [
        {
          slug: "lampposts-given-names",
          kicker: "100 years ago",
          headline: "From the archive: the town that gave every lamppost a name",
          dek: "In 1926, Wickerby council decided numbers were ‘cold’. It named all 212 of them instead.",
          body: [
            "According to our (entirely imaginary) back issues, the council held a public vote for each name. The most popular was ‘Old Reg’, who stood outside the post office for sixty years.",
            "Residents still give directions by lamppost. ‘Turn left at Doris’ remains a perfectly normal sentence in Wickerby.",
          ],
          source: "Yay News Archive (sample)",
        },
        {
          slug: "first-umbrella-parade",
          kicker: "Fun firsts",
          headline: "On this day: the first umbrella parade, held on the sunniest day of the year",
          dek: "Organisers had planned for rain. Nobody went home.",
          body: [
            "The Marlow Green umbrella parade went ahead under a clear blue sky, with 400 people carrying open umbrellas as parasols. It has been held on the last Saturday of September ever since, weather regardless.",
          ],
          source: "Yay News Archive (sample)",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: { value: "11", caption: "days it took Barnaby the tortoise to see his new garden" },
    },
    {
      type: "weather",
      content: {
        headline: "Weekend high of pure lazing",
        detail:
          "Warm front of brunch moving in from the east. Pockets of napping likely after two.",
      },
    },
    {
      type: "quote",
      content: {
        text: "He did the whole thing at his own pace, which is the only pace he has.",
        by: "Barnaby's head keeper",
      },
    },
    {
      type: "correction",
      content: {
        text: "Yesterday we said the kazoo orchestra had 50 players. It had 60. The extra ten would like it known that they were the loud ones.",
      },
    },
    {
      type: "correction",
      content: {
        text: "A caption on Thursday called a pigeon ‘unremarkable’. We have since met the pigeon, and we were wrong.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Players for a free co-op game about two snails building a house. Patience essential; speed not required.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FREE TO A GOOD HOME",
        text: "An open-source recipe manager that tells you which leftovers get along. Tested on 41 fridges.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FOUND",
        text: "One perfect skimming stone, Lark River beach. Owner may collect it by proving they can skim it seven times.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: What are you doing this weekend?",
          "PIGEON: Nothing.",
          "PIP: Sounds boring.",
          "PIGEON: I've been looking forward to it all week.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. Enjoy your Saturday." } },
  ],

  puzzles: [
    mini(
      [
        ["CAMPS", "Summer holidays with tents and too many marshmallows"],
        ["OCEAN", "Where Disco Pete's cousins live"],
        ["DRUMS", "The loud end of the band"],
      ],
      [
        ["CHORD", "Three notes that get along"],
        ["SONGS", "What a choir does all day"],
      ],
    ),
    ladder(["CAT", "COT", "COG", "DOG"]),
    riddle("What has hands but can't clap?", "A clock"),
  ],
};
