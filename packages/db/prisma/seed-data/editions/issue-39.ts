// Issue 39, Sunday 27 September 2026. A Sunday midi: gentle, slow and snack-adjacent.
// Everything here is invented: the people, places, sources and numbers.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue39: SeedEdition = {
  issueNumber: 39,
  date: "2026-09-27",
  status: "published",
  design: "midi",
  colourway: "gelato-counter",

  front: [
    {
      slug: "otter-raft-record",
      section: "discoveries",
      kicker: "Wildlife",
      headline: "Sixty sea otters drift together in the biggest raft Selkie Bay has seen",
      dek: "Volunteer counters needed three attempts and a very patient boat driver to get the number right.",
      body: [
        "Every autumn, volunteers with the Selkie Bay Otter Watch count the otters that gather in the kelp beds off the headland. Most years they see a few loose groups of ten or fifteen.",
        "Last Sunday morning, they found sixty in a single raft, floating on their backs, many of them loosely holding paws or wrapped in kelp so they wouldn't drift apart while they dozed.",
        "“We counted, lost count, laughed, and counted again,” said the group's coordinator. “There was one pup right in the middle who kept rolling over to look at us. I think he was counting us back.”",
        "The volunteers say the kelp beds have been unusually thick this year, which gives the otters plenty of places to anchor. They have asked boaters to keep a gentle distance so the raft can snooze in peace.",
      ],
      source: "Selkie Bay Otter Watch (sample)",
      sticker: "Awww",
      photo: "otters",
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "radio-requests-for-dogs",
          kicker: "Radio",
          headline: "Sunday-night radio show plays only songs requested on behalf of dogs",
          dek: "Owners write in with what their dog would pick. The playlist is heavy on songs about walks.",
          body: [
            "‘Paws for Music’ began as a one-off on a small community station in Brackenford. It is now in its third year and has a waiting list of four months.",
            "The presenter reads out every dedication in full. Last week's favourite was for a spaniel called Toast, ‘who would like this played loudly, as she cannot hear the song over her own excitement’.",
          ],
          source: "Airwaves (sample)",
          photo: "microphone",
        },
        {
          slug: "family-film-rerun-sells-out",
          kicker: "Film",
          headline: "Cinema re-runs a 40-year-old family film and sells out every seat for a month",
          dek: "Parents who saw it as children are now taking their own children, and crying at the same bit.",
          body: [
            "The Roxy in Callander Street brought back ‘The Kite That Went to Sea’ for one weekend. Demand was so high that it has now run every Sunday afternoon for a month, with free popcorn for anyone wearing a kite badge.",
          ],
          source: "Picture House Post (sample)",
          photo: ["popcorn", 0],
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "do-nothing-button",
          kicker: "Updates",
          headline:
            "Cosy fishing game adds a button that does absolutely nothing, and players adore it",
          dek: "Press it and your character simply sits on the jetty and watches the water.",
          body: [
            "The developers of ‘Still Waters’ added the button after noticing that players were leaving the game running just to look at it. In the first week, people pressed it 1.3 million times.",
            "The patch notes describe the feature as ‘a place to be’. The average sit lasts six minutes.",
          ],
          source: "Patch Notes Daily (sample)",
          photo: ["controller", 0],
        },
        {
          slug: "thirty-hour-board-game",
          kicker: "Tabletop",
          headline: "Board-game café finishes a 30-hour game of its longest board game",
          dek: "The winner was a retired geography teacher who had never played before.",
          body: [
            "Twelve players took it in turns through the night, with snacks delivered by the café's owner at two-hour intervals. The final move was greeted with applause from people who had come in for breakfast and stayed to watch.",
          ],
          source: "Meeple Weekly (sample)",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "cricket-ducks-crossing",
          kicker: "Cricket",
          headline:
            "Village cricket match pauses for twenty minutes so a family of ducks can cross",
          dek: "Both teams formed a guard of honour. The umpire kept time.",
          body: [
            "The mother duck and eight ducklings wandered on to the pitch at Upper Brampton just after tea. Nobody wanted to hurry them, so the players stood aside and waited while the family took the scenic route past the stumps.",
            "The home side went on to win by three runs. Both captains agreed the ducks were the highlight.",
          ],
          source: "Village Green Gazette (sample)",
          photo: "cricket",
        },
        {
          slug: "teapot-marathon-runner",
          kicker: "Running",
          headline: "Marathon runner dressed as a teapot finishes with the spout still attached",
          dek: "He had been told the spout would fall off by mile ten. It did not.",
          body: [
            "Ollie Penhale ran the Harrowgate marathon in a papier-mâché teapot costume to raise money for his local swimming pool. He finished in just under five hours and was handed a cup of tea at the line.",
          ],
          source: "Finish Line (sample)",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "candybar-joke-hotline",
          kicker: "Makers",
          headline: "Retired candybar phones become a free joke hotline around town",
          dek: "Pick one up at the bus stop and it tells you a joke. The jokes are mostly about buses.",
          body: [
            "A group of volunteers in Ferrisham rewired twenty old phones to play a random joke from a library of 2,000 whenever someone lifts them. Residents record new jokes by calling a number on the side.",
            "The most-played joke so far involves a bus, a goose and a very long queue.",
          ],
          source: "Open Tech Digest (sample)",
          photo: "oldPhones",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "lemonade-stand-ice-cream",
          kicker: "Enterprise",
          headline: "Children's lemonade stand makes enough to buy the whole street an ice cream",
          dek: "Their business plan fitted on a single Post-it note. It worked.",
          body: [
            "Three siblings on Linden Row sold lemonade every Sunday afternoon over the summer. On the last weekend of the season they counted their takings, walked to the ice-cream van, and ordered forty-seven cones.",
            "The oldest, aged nine, says the secret was ‘a lot of lemons and a very good sign’.",
          ],
          source: "Pocket Money Times (sample)",
          photo: ["iceCream", 1],
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "keyboard-cat-guest-post",
          kicker: "Blogs",
          headline:
            "Cat who keeps sitting on the keyboard gets his own guest post on a coding blog",
          dek: "It is 400 characters long and mostly the letter J. Readers call it ‘his best work’.",
          body: [
            "The blog's author decided that if Miso was going to contribute to every post anyway, he deserved a byline. The post has had more readers than anything else on the blog this year.",
          ],
          source: "Around the Web (sample)",
          photo: "catLaptop",
        },
        {
          slug: "puddle-map",
          kicker: "Maps",
          headline: "An online map of the best puddles for jumping in gets 10,000 entries",
          dek: "Each puddle is rated for splash, depth and ‘how cross a parent will be’.",
          body: [
            "The map was started by a father and his five-year-old after a rainy walk. It now covers puddles in more than 200 towns, with a strict rule that every entry must be jump-tested before it is added.",
          ],
          source: "Around the Web (sample)",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: { value: "60", caption: "sea otters snoozing in a single raft in Selkie Bay" },
    },
    {
      type: "weather",
      content: {
        headline: "Mostly cosy, turning pancakes",
        detail:
          "Light breezes of newspaper rustling. Visibility good all the way to the biscuit tin.",
      },
    },
    {
      type: "quote",
      content: {
        text: "A lot of lemons and a very good sign.",
        by: "Nine-year-old entrepreneur, Linden Row",
      },
    },
    {
      type: "correction",
      content: {
        text: "Saturday's edition said Barnaby the tortoise stopped at every dandelion. He missed one. He would like us to say it was on purpose.",
      },
    },
    {
      type: "correction",
      content: {
        text: "We described the grandparents' arcade hour as ‘quiet’. It is not quiet. It has never been quiet.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FOR SALE",
        text: "Nothing. It's Sunday. Please come back tomorrow.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Testers for a free pocket-sized game about tidying a tiny room. Satisfying corners guaranteed.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "OFFERED",
        text: "An open-source bird-feeder camera that sends you a photo every time a robin says hello.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: Shall we go for a walk?",
          "PIGEON: Where to?",
          "PIP: Nowhere in particular.",
          "PIGEON: My favourite place.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. Have a slow Sunday." } },
  ],

  puzzles: [
    mini(
      [
        ["LUNCH", "The meal between elevenses and afternoon tea"],
        ["TRAIN", "It goes choo-choo, or what you do before a marathon"],
        ["ENJOY", "What we hope you do with this paper"],
      ],
      [
        ["LATTE", "A coffee with a leaf drawn on top"],
        ["HONEY", "What bees make, and what you might call your sweetheart"],
      ],
    ),
    ladder(["COLD", "CORD", "CARD", "WARD", "WARM"]),
    riddle("What has a neck but no head?", "A bottle"),
  ],
};
