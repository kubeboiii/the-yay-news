// Issue 41, Tuesday 29 September 2026.
// Everything here is invented: the people, places, sources and numbers.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue41: SeedEdition = {
  issueNumber: 41,
  date: "2026-09-29",
  status: "published",
  design: "broadsheet",
  colourway: "acid-garden",

  front: [
    {
      slug: "stadium-sings-happy-birthday",
      section: "sports",
      kicker: "Football",
      headline: "Whole stadium sings happy birthday to its oldest fan, who turned 100 at half-time",
      dek: "Edna Mulvaney has missed four home games since 1946. She was not going to miss this one.",
      body: [
        "Wexby Rovers have never been a big club, but on Saturday their ground held 6,000 people, and at half-time every one of them was singing to the same person.",
        "Edna Mulvaney, who first watched the team from her father's shoulders, celebrated her 100th birthday in her usual seat in the old stand. The club had kept it a secret: the scoreboard lit up with her name, the players came out in shirts with ‘EDNA 100’ on the back, and the away fans joined in the singing without being asked.",
        "“I've seen them win, I've seen them lose, and I've seen them do both in the same afternoon,” she said afterwards. “I've never seen them organise anything this well.”",
        "Rovers won 2–1. The winning goal was scored by a nineteen-year-old midfielder who ran straight to the old stand to celebrate. The club has named the stand after her.",
      ],
      source: "Rovers Review (sample)",
      sticker: "100!",
      photo: "stadium",
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "brass-band-game-soundtrack",
          kicker: "Music",
          headline:
            "Brass band plays a whole video-game soundtrack in the park, boss battle included",
          dek: "The tuba section did the explosions.",
          body: [
            "The Ferrisham Silver Band spent the summer arranging the score of a much-loved platform game for 28 brass players. The Sunday concert drew 2,000 people, many of whom hummed the level-up jingle all the way home.",
            "The band says its next project is a medley of loading-screen music. It will be ‘very relaxing, with occasional progress’.",
          ],
          source: "Music Notes (sample)",
          photo: ["concert", 0],
        },
        {
          slug: "sixty-second-film-festival",
          kicker: "Film",
          headline: "A film festival where every film is shorter than a minute sells out",
          dek: "The winner was 41 seconds long and starred a very dramatic goose.",
          body: [
            "The Minute Festival screened 180 films in three hours, with a strict one-minute limit enforced by a man with a whistle. The audience gave the goose film a standing ovation that lasted longer than the film.",
          ],
          source: "Screen Weekly (sample)",
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "twelve-year-old-puzzle-award",
          kicker: "Awards",
          headline: "Puzzle game designed by a twelve-year-old wins best debut at a games festival",
          dek: "She built it on a school laptop during wet lunchtimes.",
          body: [
            "‘Moth & Lamp’ asks players to guide a moth home by switching lights on and off around a village. Its designer, Wren Adeyemi, made it in a free game engine and entered it in the festival's open category ‘just to see’.",
            "Accepting the award, she thanked her teacher, her cat, and ‘everyone who didn't tell me it was too hard’.",
          ],
          source: "Indie Arcade (sample)",
          photo: ["controller", 1],
        },
        {
          slug: "arcade-cabinet-restored",
          kicker: "Retro",
          headline: "Restored arcade cabinet goes back into the chip shop it stood in for 30 years",
          dek: "The regulars' initials are still on the leaderboard.",
          body: [
            "When the Harbour Fry in Port Calloway was refitted, its old arcade machine was taken away to be mended. It came back last week, gleaming, and the first person to play it was the owner's mum.",
          ],
          source: "Coin-Op Chronicle (sample)",
          photo: ["arcade", 1],
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "rubber-duck-lake-swim",
          kicker: "Swimming",
          headline: "Swimmer crosses Lake Orrin escorted by a flotilla of 500 rubber ducks",
          dek: "Each duck was sponsored by a local child. She has promised to return them all.",
          body: [
            "Tamsin Holloway swam the four-kilometre crossing to raise money for her town's new paddling pool. A support boat released the ducks at the start line, and the wind blew most of them along beside her the entire way.",
          ],
          source: "Finish Line (sample)",
        },
        {
          slug: "grandmother-first-kickflip",
          kicker: "Skateboarding",
          headline: "Grandmother lands her first kickflip at 71, on her 400th try",
          dek: "Her granddaughter filmed every attempt. She has asked for only the last one to be shared.",
          body: [
            "Maureen Castle took up skateboarding two years ago after borrowing her granddaughter's board ‘to see what the fuss was about’. The skatepark's regulars cheered so loudly that a dog walker came over to check what had happened.",
          ],
          source: "Deck Talk (sample)",
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "truffle-retriever",
          kicker: "Animals",
          headline: "Golden retriever trained to find truffles turns up 40 kilos in one season",
          dek: "His handler says he finds them by accident while looking for sticks.",
          body: [
            "Biscuit, four, began truffle training in the woods near Ambleside Cross in the spring. He has since found more truffles than any dog his trainer has worked with, and has been rewarded with a sausage every time.",
            "He has not yet been told that truffles are valuable. His trainer thinks it is better that way.",
          ],
          source: "Countryside Chronicle (sample)",
          photo: ["goldenRetriever", 0],
        },
        {
          slug: "bike-shed-moss",
          kicker: "Plants",
          headline: "Students find an unusual moss growing on their university's bike shed",
          dek: "It is soft, very green and, according to the botanist who checked it, ‘genuinely exciting’.",
          body: [
            "Two first-year biology students noticed the moss while locking their bikes. A lecturer confirmed it was a species rarely recorded in the region. The shed has been given a small sign and a ‘please don't lean here’ notice.",
          ],
          source: "Garden Gazette (sample)",
        },
        {
          slug: "hedgehog-highway",
          kicker: "Wildlife",
          headline:
            "A street cuts hedgehog-sized holes in every fence and makes a hedgehog highway",
          dek: "Reserve story: kept in case another is pulled.",
          body: [
            "Residents of Orchard Close linked all 22 gardens with small gaps at the bottom of their fences. A night camera has since recorded hedgehogs using the route most evenings.",
          ],
          source: "Countryside Chronicle (sample)",
          reserve: true,
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "purring-robot-vacuum",
          kicker: "Open source",
          headline: "Free update makes robot vacuums purr when they finish a room",
          dek: "Owners report that their actual cats are unimpressed.",
          body: [
            "An open-source firmware project for old robot vacuums has added a feature that plays a soft purr when the machine returns to its dock. Its maintainers say it started as a joke and is now the most-downloaded change they have ever made.",
          ],
          source: "Open Tech Digest (sample)",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "pet-portrait-banknotes",
          kicker: "Local currency",
          headline: "Town's new local banknotes feature residents' pets",
          dek: "The five-pound note is a tortoise called Colin. The ten is a very serious rabbit.",
          body: [
            "The Pellinghurst Pound, which shops in the town accept alongside normal money, is now printed with pets chosen by public vote. The notes have become so popular that people are keeping them rather than spending them.",
          ],
          source: "Pocket Money Times (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "sunset-review-blog",
          kicker: "Blogs",
          headline: "A blog that reviews one sunset a day reaches its 1,000th post",
          dek: "Scores are out of ten. Nothing has ever scored below six.",
          body: [
            "Its author, a night-shift nurse in Harrowgate, started writing the reviews on her walks home. Readers now send in their own sunsets for her to judge. The only ten so far was ‘a pink one over the gasworks that nobody expected’.",
          ],
          source: "Around the Web (sample)",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: { value: "400", caption: "tries it took Maureen, 71, to land her first kickflip" },
    },
    {
      type: "weather",
      content: {
        headline: "Warm with a strong chance of singing",
        detail:
          "Scattered applause spreading from the north. Birthday cake expected across most areas by teatime.",
      },
    },
    {
      type: "quote",
      content: {
        text: "I've never seen them organise anything this well.",
        by: "Edna Mulvaney, 100, on her football club",
      },
    },
    {
      type: "correction",
      content: {
        text: "Monday's edition said a star cluster looked like it was smiling. It was, in fact, grinning. We apologise to Gary.",
      },
    },
    {
      type: "correction",
      content: {
        text: "We said the paddleboard cinema audience ‘stayed dry’. Around a third of them did.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Moths, for a game about moths. Real moths not required. Imaginary moths preferred.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FREE",
        text: "An open-source app that reminds you to water your plants in the voice of a disappointed fern.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "LOST",
        text: "Several hundred rubber ducks, last seen heading east across Lake Orrin. Answer to ‘Duck’.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: Have you ever been to a football match?",
          "PIGEON: I've been to all of them.",
          "PIP: Did you watch?",
          "PIGEON: I watched the chips.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. See you tomorrow." } },
  ],

  puzzles: [
    mini(
      [
        ["HELLO", "The friendliest word there is"],
        ["LATTE", "Frothy coffee, often with a heart on top"],
        ["STARS", "What Gary the smiling cluster is made of"],
      ],
      [
        ["HILLS", "A cyclist's favourite enemies"],
        ["OVENS", "Where the bakery's scones get brave"],
      ],
    ),
    ladder(["LESS", "LOSS", "LOSE", "LORE", "MORE"]),
    riddle("What gets wetter the more it dries?", "A towel"),
  ],
};
