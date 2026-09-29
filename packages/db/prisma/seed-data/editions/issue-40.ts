// Issue 40, Monday 28 September 2026. Back to the broadsheet for the week.
// Everything here is invented: the people, places, sources and numbers.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue40: SeedEdition = {
  issueNumber: 40,
  date: "2026-09-28",
  status: "published",
  design: "broadsheet",
  colourway: "pool-party",

  front: [
    {
      slug: "smiley-star-cluster",
      section: "discoveries",
      kicker: "Space",
      headline: "Amateur astronomer's garden photo shows a star cluster that seems to be smiling",
      dek: "Two bright stars for eyes, a curve of fainter ones for a grin, and a whole astronomy club now calling it ‘Gary’.",
      body: [
        "Priya Vantongeren has been photographing the night sky from her back garden in Oakhollow for eleven years, with a second-hand telescope and a great deal of patience. On Thursday night she stacked 300 exposures of a patch of sky she had never looked at closely, and a face looked back.",
        "The arrangement is a coincidence of perspective — the stars are nowhere near each other — but that has not stopped her astronomy club from adopting it. They have named it Gary and are planning a viewing night for anyone with binoculars.",
        "“I've spent years looking for faint, serious things,” she said. “And the universe sends me a smiley face. I'll take it.”",
        "She has shared her settings online so other backyard astronomers can find Gary for themselves. Clear skies are forecast for the weekend.",
      ],
      source: "Backyard Skies (sample)",
      sticker: ":)",
      photo: "space",
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "cassette-album-tops-chart",
          kicker: "Music",
          headline: "Cassette-only album tops the indie chart in Merrow",
          dek: "The band say they chose tape ‘because you have to listen to the whole thing’.",
          body: [
            "The Lanternfish released their second album only on cassette, with a pencil tucked into every case for rewinding. It went to number one in the city's independent chart in its first week.",
            "Record shops report that they have sold out of blank tapes too. Nobody is quite sure what people are recording.",
          ],
          source: "Music Notes (sample)",
          photo: "cassette",
        },
        {
          slug: "paddleboard-cinema",
          kicker: "Film",
          headline: "Open-air cinema screens a film to 300 people sitting on paddleboards",
          dek: "The screen floated on the lake. So did most of the popcorn.",
          body: [
            "The Lake Orrin summer cinema ended its season with a floating screening. Viewers paddled out at dusk, tied their boards together in rows and watched a comedy about a lighthouse that wanted to be a disco.",
          ],
          source: "Picture House Post (sample)",
          photo: ["cinema", 1],
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "lighthouse-keeper-sim",
          kicker: "Indie",
          headline: "A game where you just keep a lighthouse reaches one million players",
          dek: "There are no enemies. There is a kettle, a lamp, and a lot of very nice waves.",
          body: [
            "‘Keeper’ was made by a solo developer on the island of Stray over three winters. Players trim the wick, log passing ships and make tea. On stormy nights the game gets slightly more exciting: you can put on a jumper.",
            "Reviewers have called it ‘the calmest hour you'll spend this year’.",
          ],
          source: "Indie Arcade (sample)",
          photo: "lighthouse",
        },
        {
          slug: "sofa-stairs-coop",
          kicker: "Co-op",
          headline:
            "Two-player game about carrying a sofa up the stairs becomes a family favourite",
          dek: "‘Pivot!’ is now, apparently, the most shouted word in living rooms across the country.",
          body: [
            "The game gives each player one end of an enormous sofa and a staircase that gets narrower every level. It has no timer and no score, just a running count of how many times you have scraped the wallpaper.",
          ],
          source: "Couch Co-op (sample)",
          photo: "neonRoom",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "cyclist-returns-hat",
          kicker: "Cycling",
          headline: "Rider stops mid-race to return a spectator's hat, and still wins",
          dek: "The hat had blown on to the course on the final climb.",
          body: [
            "In the closing kilometres of the Tollbridge hill race, Amaru Castell braked, picked up a flat cap from the road, handed it back to its owner at the barrier, and set off again. He caught the leading group on the descent and won by a wheel.",
            "The hat's owner has had it framed.",
          ],
          source: "Grid Talk (sample)",
        },
        {
          slug: "under-nines-trick-play",
          kicker: "Football",
          headline: "Under-nines' rehearsed free kick fools everyone, including their own coach",
          dek: "It involved a fake shoelace problem and a lot of pointing at the sky.",
          body: [
            "The Pennyfield Juniors had practised the routine in secret at break times. It worked perfectly. Their coach admits he was looking at the sky too.",
          ],
          source: "Sunday League Weekly (sample)",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "school-weather-stations",
          kicker: "Open source",
          headline: "900 schools now run home-made weather stations on one shared map",
          dek: "Each station was built by pupils from a free kit and a lot of sticky tape.",
          body: [
            "The project gives schools the plans for a weather station made from cheap sensors and a jam jar. The readings go on a public map that updates every ten minutes, and the most accurate school each month gets a trophy shaped like a cloud.",
          ],
          source: "Open Tech Digest (sample)",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "pay-what-you-think-coffee",
          kicker: "Small business",
          headline: "Café's pay-what-you-think day earns more than a normal day",
          dek: "The average cup went for a little over its usual price, plus a lot of kind notes.",
          body: [
            "The owners of the Kettle & Crumb in Dunmore Cross expected to lose money when they let customers choose what to pay for a day. Instead the till came out slightly ahead, and the tip jar was full of doodles.",
            "They plan to do it again on the café's birthday.",
          ],
          source: "High Street News (sample)",
          photo: ["coffee", 1],
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "caretaker-sticky-note-mural",
          kicker: "Schools",
          headline: "Pupils cover a corridor in 4,000 sticky notes to thank their school caretaker",
          dek: "He retires on Friday after 31 years. The notes spell out ‘THANK YOU, MR OKAFOR’.",
          body: [
            "Every pupil wrote a message on at least one note. The most common one was about the time he rescued a football from the roof. The second most common was about his whistling.",
          ],
          source: "Around the Web (sample)",
          photo: "stickyNotes",
        },
      ],
    },
    {
      section: "art-design-and-books",
      stories: [
        {
          slug: "shop-sign-typeface",
          kicker: "Type",
          headline: "A free typeface drawn from a century of hand-painted shop signs",
          dek: "Its designer photographed 600 signs in one market town and drew every letter again.",
          body: [
            "‘Parade’ has chunky capitals, a slightly wonky lowercase and an ampersand its designer describes as ‘the one I'm proudest of’. It is free for anyone to use, and several of the shops whose signs inspired it have already repainted their windows in it.",
          ],
          source: "Letterform Review (sample)",
        },
        {
          slug: "book-lamplighters-almanac",
          kicker: "Book of the week",
          headline: "One good read: ‘The Lamplighter's Almanac’",
          dek: "A year in the life of a town's last lamplighter, one short chapter per evening.",
          body: [
            "This invented novel is our pick for the week: 365 chapters, each about a page long, each ending as a lamp comes on. It is gentle, funny and designed to be read one evening at a time, which is exactly how we recommend you read it.",
          ],
          source: "The Reading Room (sample)",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "300",
        caption: "exposures it took to find Gary, the smiling star cluster",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Monday: bright spells of optimism",
        detail:
          "A ridge of fresh starts builds through the morning. Isolated inbox showers, clearing by lunch.",
      },
    },
    {
      type: "quote",
      content: {
        text: "I've spent years looking for faint, serious things. And the universe sends me a smiley face.",
        by: "Priya Vantongeren, backyard astronomer",
      },
    },
    {
      type: "correction",
      content: {
        text: "Sunday's edition said the otters in Selkie Bay were ‘dozing’. They were napping. There is a difference, and the otters were very clear about it.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "A name for a free open-source to-do app that only lets you add three things a day. ‘Enough’ is taken.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "OFFERED",
        text: "Indie puzzle game about untangling fairy lights. Seven levels, no swearing required.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "SEEKING",
        text: "Sensible adult to explain Mondays to a golden retriever. Previous applicants have failed.",
      },
    },
    {
      type: "letter",
      content: {
        text: "Dear Editor, my grandson read me your paper on Saturday and we finished it before the tea went cold. That has not happened with a newspaper since 1987. Thank you.",
        from: "A reader in Pellinghurst",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: It's Monday.",
          "PIGEON: I know.",
          "PIP: How do you feel about it?",
          "PIGEON: I'm a pigeon. Every day is Monday. Every day is great.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. See you tomorrow." } },
  ],

  puzzles: [
    mini(
      [
        ["COMET", "A space snowball with a tail"],
        ["DANCE", "What Disco Pete does best"],
        ["ROBOT", "It might fold your sheets, eventually"],
      ],
      [
        ["CEDAR", "A tree that smells like a nice drawer"],
        ["TWEET", "A small bird's big announcement"],
      ],
    ),
    ladder(["HEAD", "HEAL", "TEAL", "TELL", "TALL", "TAIL"]),
    riddle("What has lots of teeth but can't bite?", "A comb"),
  ],
};
