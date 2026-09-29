// Issue 43, Thursday 1 October 2026. Scheduled: it exists, but is not served until it is published.
// Everything here is invented: the people, places, sources and numbers.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue43: SeedEdition = {
  issueNumber: 43,
  date: "2026-10-01",
  status: "scheduled",
  design: "broadsheet",
  colourway: "blacklight",

  front: [
    {
      slug: "forgotten-sunflower-blooms",
      section: "discoveries",
      kicker: "Plants",
      headline: "A sunflower nobody had grown for 50 years blooms again from a seed-bank envelope",
      dek: "The packet was labelled, in pencil, ‘very tall, very cheerful, do not lose’.",
      body: [
        "Volunteers sorting the back shelves of the Marlow Green community seed bank found a small brown envelope that did not match anything in their catalogue. Inside were twelve seeds and a handwritten note from 1976.",
        "They planted all twelve. Four came up. This week, the first one opened: a deep orange flower with a dark centre and petals that curl slightly at the tips, like it is about to laugh.",
        "“We think somebody grew these in the village for years and then everyone just forgot,” said one of the volunteers. “Now we've got four of them, and by next spring we'll have hundreds of seeds.”",
        "The seed bank plans to give the seeds away free next year to anyone who promises to save a few and bring them back.",
      ],
      source: "Garden Gazette (sample)",
      sticker: "Hello again",
      photo: ["sunflowers", 1],
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "lullabies-for-houseplants",
          kicker: "Music",
          headline: "Orchestra records an album of lullabies for houseplants",
          dek: "The liner notes suggest playing it ‘at a volume a fern would appreciate’.",
          body: [
            "The Brackenford Chamber Players wrote the album after their cellist noticed that her spider plant seemed happier during rehearsals. There is no evidence that plants enjoy it. The orchestra says the people listening definitely do.",
          ],
          source: "Music Notes (sample)",
          photo: ["vinyl", 1],
        },
        {
          slug: "weather-cat-spin-off",
          kicker: "TV",
          headline: "Local TV weather report's resident cat gets her own spin-off show",
          dek: "‘Cloud, with Pickles’ will be five minutes long and mostly about windowsills.",
          body: [
            "Pickles wandered into shot during a live forecast last winter and has appeared in the background most evenings since. The station says viewers asked for more of her and less of the isobars.",
          ],
          source: "Screen Weekly (sample)",
          photo: ["retroTv", 1],
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "paper-plane-post",
          kicker: "Indie",
          headline: "Game about delivering letters by paper plane gets a sequel with bigger planes",
          dek: "And, for the first time, parcels.",
          body: [
            "‘Airmail 2’ lets players fold their own planes from a library of 40 designs and fly them across a seaside town. The parcel planes are slower, wobblier and, early players report, much funnier.",
          ],
          source: "Indie Arcade (sample)",
        },
        {
          slug: "hats-for-every-animal",
          kicker: "Mods",
          headline: "Fan mod gives every animal in a farming game a tiny hat",
          dek: "There are 212 animals and 212 hats. The chickens have berets.",
          body: [
            "The mod's creator made each hat by hand over six months. It has been downloaded 800,000 times, and the game's developers have asked whether they can make it official.",
          ],
          source: "Patch Notes Daily (sample)",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "soapbox-derby-teacups",
          kicker: "Racing",
          headline: "Soapbox derby won by a cart shaped like a giant teacup",
          dek: "It was not the fastest. It was the only one that stayed in a straight line.",
          body: [
            "The Tollbridge hill soapbox race drew 60 homemade carts this year. The teacup, built by a team of retired engineers, won by steadily trundling past three faster carts that had spun into the hay bales.",
          ],
          source: "Grid Talk (sample)",
          photo: "pitStop",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "solar-ice-cream-cart",
          kicker: "Clever engineering",
          headline:
            "Students build a solar-powered ice-cream cart that stays cold on the sunniest day",
          dek: "The sunnier it gets, the colder the ice cream.",
          body: [
            "Engineering students in Oakhollow built the cart as their final-year project. It uses rooftop panels to run a small freezer, and on its first outing it sold out by two o'clock.",
          ],
          source: "Open Tech Digest (sample)",
          photo: ["iceCream", 0],
        },
        {
          slug: "tiny-library-robot",
          kicker: "Robots",
          headline: "Small library's new robot reshelves books and hums while it works",
          dek: "Librarians say the humming was not programmed. They have decided not to ask.",
          body: [
            "The robot was donated by a local engineering firm and trained to return books to the right shelf. Its favourite section, according to staff, is poetry, where it seems to hum slightly louder.",
          ],
          source: "Robo Review (sample)",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "spare-change-piano",
          kicker: "Community",
          headline: "A café's spare-change jar pays for the town's first street piano",
          dek: "It took three years and roughly 40,000 coins.",
          body: [
            "Customers at a café in Wickerby dropped their coppers into a jar labelled ‘PIANO’. The piano now sits in the square, painted in bright stripes, and was played for the first time by a boy who knew one song very well.",
          ],
          source: "High Street News (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "accidental-rhymes-thread",
          kicker: "Online",
          headline: "Thread of people's best accidental rhymes becomes an unofficial poetry book",
          dek: "Favourite so far: “I'll grab a pear and meet you there.”",
          body: [
            "The thread began when someone noticed they had rhymed while ordering a sandwich. Contributors have since collected 9,000 accidental rhymes, and a small press has asked to print the best hundred.",
          ],
          source: "Around the Web (sample)",
        },
        {
          slug: "dog-walk-leaderboard",
          kicker: "Apps",
          headline: "A town's dog-walking app now ranks walks by how many dogs say hello",
          dek: "The top-rated route passes nine gardens and a very sociable bulldog.",
          body: [
            "The app was built by a teenager in Harrowgate to help new residents find friendly routes. It now has 3,000 users and a strict no-rushing policy.",
          ],
          source: "Around the Web (sample)",
          photo: ["goldenRetriever", 1],
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "1976",
        caption: "the year someone wrote ‘do not lose’ on a packet of sunflower seeds",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Bright, with a cheerful front",
        detail:
          "Petals opening across the region. A light breeze of humming, mostly from libraries.",
      },
    },
    {
      type: "correction",
      content: {
        text: "We said pickle ice cream was ‘actually good’. Several readers have written in to say it is ‘actually great’. We stand corrected and slightly confused.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Small hats. Any size. For a mod. You know which one.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FREE",
        text: "A little open-source game where you arrange a bookshelf by colour. No timer. No wrong answers.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: Do you think plants like music?",
          "PIGEON: I asked one.",
          "PIP: What did it say?",
          "PIGEON: Nothing. But it did lean a bit.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. See you tomorrow." } },
  ],

  puzzles: [
    mini(
      [
        ["TUNES", "What the houseplant orchestra plays"],
        ["SCONE", "Jam first or cream first?"],
        ["YACHT", "A boat that's fancier than a dinghy"],
      ],
      [
        ["TASTY", "How the solar ice cream turned out"],
        ["SWEET", "Like this paper, and like most puddings"],
      ],
    ),
    ladder(["LEAD", "LOAD", "GOAD", "GOLD"]),
    riddle("What runs but never walks, and has a mouth but never talks?", "A river"),
  ],
};
