import type { Puzzle, SolvedPuzzle } from "@repo/shared";

// Issue 42's back page as the seed prints it, plus the two newer puzzle types (word search and the
// fortune teller) for when the API doesn't serve them yet. Shapes match packages/shared.

export const samplePuzzles: Puzzle[] = [
  {
    type: "crossword",
    order: 0,
    data: {
      title: "The Mini",
      rows: [".....", ".###.", ".....", ".###.", "....."],
      numbers: [
        { row: 0, col: 0, n: 1 },
        { row: 0, col: 4, n: 2 },
        { row: 2, col: 0, n: 3 },
        { row: 4, col: 0, n: 4 },
      ],
      across: [
        { n: 1, clue: "Organ that does the ‘aww’", length: 5 },
        { n: 3, clue: "Green housemate, or what you do with a seed", length: 5 },
        { n: 4, clue: "Sing like a cheerful Alpine goatherd", length: 5 },
      ],
      down: [
        { n: 1, clue: "How this paper hopes you feel", length: 5 },
        { n: 2, clue: "The sum of it all", length: 5 },
      ],
    },
  },
  {
    type: "word_ladder",
    order: 1,
    data: {
      title: "Word Ladder",
      instructions: "Change one letter at a time to climb from SAD to JOY.",
      start: "SAD",
      end: "JOY",
      steps: 2,
    },
  },
  {
    type: "riddle",
    order: 2,
    data: { title: "The Riddle", question: "What has keys but can't open a single door?" },
  },
  {
    type: "word_search",
    order: 3,
    data: {
      title: "Word Search",
      theme: "Things in today’s paper",
      grid: [
        "SHYCOCTCW",
        "EEETTWJFI",
        "EUPRTGOWG",
        "BLIPEOYKN",
        "TSCIRUISD",
        "RHNAHTCMA",
        "AYINEWHYH",
        "EACOCBHCB",
        "HMCSCONEU",
      ],
      words: ["OTTER", "PIANO", "SCONE", "KITE", "JOY", "PICNIC", "HEART", "BEES"],
    },
  },
  {
    type: "fortune_teller",
    order: 4,
    data: {
      title: "The Fortune Teller",
      colours: ["Pink", "Blue", "Gold", "Green"],
      numbers: [3, 7, 1, 5, 8, 2, 6, 4],
      fortunes: [
        "A stranger will laugh at your joke today.",
        "Toast lands butter side up. Every time.",
        "You will find a coin in an old coat.",
        "A dog will choose you as its favourite.",
        "Someone is about to say your name kindly.",
        "The next song on the radio is your song.",
        "Your plant has grown a new leaf. Check!",
        "A very good sandwich is in your future.",
      ],
    },
  },
];

/** Issue 41's puzzles with their answers, as served in issue 42's `yesterday`. */
export const sampleYesterday: { issueNumber: number; puzzles: SolvedPuzzle[] } = {
  issueNumber: 41,
  puzzles: [
    {
      type: "crossword",
      order: 0,
      data: {
        title: "The Mini",
        rows: [".....", ".###.", ".....", ".###.", "....."],
        numbers: [
          { row: 0, col: 0, n: 1 },
          { row: 0, col: 4, n: 2 },
          { row: 2, col: 0, n: 3 },
          { row: 4, col: 0, n: 4 },
        ],
        across: [
          { n: 1, clue: "The friendliest word there is", length: 5 },
          { n: 3, clue: "Frothy coffee, often with a heart on top", length: 5 },
          { n: 4, clue: "What Gary the smiling cluster is made of", length: 5 },
        ],
        down: [
          { n: 1, clue: "A cyclist's favourite enemies", length: 5 },
          { n: 2, clue: "Where the bakery's scones get brave", length: 5 },
        ],
      },
      solution: {
        grid: ["HELLO", "I###V", "LATTE", "L###N", "STARS"],
        across: [
          { n: 1, answer: "HELLO" },
          { n: 3, answer: "LATTE" },
          { n: 4, answer: "STARS" },
        ],
        down: [
          { n: 1, answer: "HILLS" },
          { n: 2, answer: "OVENS" },
        ],
      },
    },
    {
      type: "riddle",
      order: 2,
      data: { title: "The Riddle", question: "What gets wetter the more it dries?" },
      solution: { answer: "A towel" },
    },
  ],
};
