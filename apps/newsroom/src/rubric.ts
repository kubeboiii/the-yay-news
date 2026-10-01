// The written rubric for the delight check and the voice guide for the writers (PLAN §5, §9).
// These are the newsroom's standing instructions; prompts quote them verbatim.

/**
 * What each section should favour. The Yay News is mainstream, not niche: big names a Gen Z reader
 * already knows beat obscure ones, and a famous franchise beats an indie curiosity.
 */
export const SECTION_FOCUS: Partial<Record<string, string>> = {
  tech: "Gadgets, AI, software, robots and the internet's plumbing: launches people use (Apple, Google, Samsung, AI tools) and clever builds.",
  startups:
    "Young companies doing something fun or clever: launches, funding rounds, founders' stories, Indian startups (Zepto, Zerodha, boAt) and Product Hunt / Show HN finds. Upbeat only: no layoffs, shutdowns or down rounds.",
  screen:
    "Films, TV, anime, trailers and streaming: Marvel, DC and Batman, Dune, Game of Thrones, major anime (Attack on Titan, One Piece, Jujutsu Kaisen), big stars (Robert Pattinson, Anne Hathaway, Zendaya), Avengers: Doomsday, major trailers, remakes and releases. Not niche.",
  play: "Games and comics: big franchises and platforms (Nintendo, PlayStation, Xbox, GTA, Pokémon, Zelda, Minecraft, Fortnite), releases everyone is waiting for, indie gems, fun esports moments, and comics and manga (Marvel, DC, One Piece, webcomics).",
  music:
    "Albums, singles, tours, festivals and artists: big current and classic names Gen Z knows (Kanye West, Travis Scott, Billie Eilish, Olivia Dean, Drake, Oasis, Coldplay, The Beatles, big Indian artists) and global festivals (Tomorrowland, Coachella, Glastonbury, Lollapalooza India).",
  money:
    "Finance, the economy, markets and business, only the upbeat or curious kind: markets hitting records and big listings, curious economics (odd indexes, surprising charts), quirky businesses and famous brands doing fun things, personal-finance wins and clever money habits, and India's markets and companies (Sensex, Nifty, Tata, Zerodha). Never price rises, job cuts, lawsuits or losses.",
  sports:
    "Football first (Premier League, La Liga, Champions League, internationals, the big clubs); then MMA, mainly the UFC (ONE or PFL when interesting); boxing; the Olympics when on; cricket now and then; the major tennis events; the best of basketball; F1 races; marathons and ultras; fun oddball sports stories. Only upbeat framing.",
  internet:
    "What people are talking about online: memes, trends, creators, big platforms, viral moments, lifestyle, and odd news (the delightfully weird: record-breaking vegetables, strange contests). Light and fun.",
  discoveries:
    "Space, animals, plants, physics, chemistry, biology, the Earth and the oceans, with a wow: famous missions, charismatic animals, new species.",
  "brain-snacks":
    "Fun facts, general knowledge and social-science curiosities: why people do the odd things they do, surprising studies, trivia worth repeating.",
  "your-small-wins":
    "Real, reported small triumphs of ordinary people: a first marathon at 70, a grandmother's first degree, a kid's lemonade stand that went big, a neighbour's clever fix. Only people named in the source; never invented readers.",
  "kids-and-schools":
    "Kid inventors, school wins, young champions and clever classroom projects, from kids' news desks and good-news outlets.",
  "weird-local":
    "Gloriously odd local news: dog mayors, strange by-laws, a town's giant vegetable contest, a council's funny sign. Oddness with no victim.",
  "weird-jobs":
    "Unusual careers, brave (happy) career switches and very cool internships: the professional cuddler, the ice-cream taster, the 80-year-old who became a DJ.",
};

export const DELIGHT_SCORING = `
SCORING. Score 1 to 10. Favour mainstream prominence: a story about a widely known name, franchise,
club or event that a Gen Z reader already knows scores 2 to 3 points higher than a niche one of equal
charm. Section focus:
${Object.entries(SECTION_FOCUS)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}
`;

export const DELIGHT_RUBRIC = `
THE DELIGHT CHECK. The Yay News prints only news that makes a reader's day better. For each item,
decide "allow", "reject" or "uncertain", and give a one-line reason.

ALLOW only when every one of these is true:
1. The story is genuinely delightful, fun, charming, clever or impressive: a discovery, a record, a
   creative project, a kind act, a funny moment, a release people are excited about.
2. Nothing bad is part of it, not even as backstory. No death, illness, injury, disaster, war,
   crime, cruelty, grief, poverty, job losses, political fights, lawsuits or fear, even when the
   story "ends well". A survivor story is still about the bad thing: reject it.
   That includes hints: an event moved, cancelled or renamed because of unrest, conflict or
   security worries is still about the bad thing.
   Always reject, however cheerful the headline:
   - illness, disease or a death anywhere in the story (the charity run "in memory of", the
     inventor who started "after her diagnosis", the late founder);
   - layoffs, job cuts, redundancies or restructuring, even at a company that is also launching
     something fun;
   - lawsuits, court cases, legal fights, settlements or regulators' fines;
   - prices rising, bills, inflation or the cost of living, even a "how to save" piece built on it;
   - war or conflict, including a team, festival or person relocated because of it;
   - scandal, allegations, misconduct, resignations or sackings;
   - "sad but…" framing: a happy ending to a sad start (loss, grief, hardship, a bad diagnosis);
   - animals harmed, injured, abandoned, neglected, stranded, trapped or rescued from danger;
   - disasters (storms, floods, fires, quakes, crashes), even with a happy ending, unless the
     happy part is the whole story and the disaster is not mentioned;
   - politics: governments, ministers, elections, parties, policies, politicians;
   - crime of any kind: thefts, arrests, charges, prison, even a quirky heist.
3. It is not about politics, elections, governments arguing, markets falling or anyone losing money.
   Money stories must be unambiguously fun (a quirky record, a charming business, a big launch).
4. It is not an advert, a deal, a listicle, a rumour, a review of something bad, a controversy,
   an opinion piece, or celebrity gossip.
5. It is safe for a general audience at breakfast, including children.
6. It is actually news or a fresh find, with enough facts to write a short story from.
7. The tone is bright all the way through. Reject grumbles and discomfort pieces even when light:
   heatwaves and "sweltering" commutes, workplace gripes (bosses, return-to-office, burnout,
   layoffs, "quiet quitting"), cost-of-living moans, travel chaos, rows between fans, and anything
   whose hook is annoyance, awkwardness or embarrassment.
8. Sports: only wins, records, signings, debuts, milestones, fixtures to look forward to and fun
   oddball moments. Reject injuries, bans, doping, scandals, sackings, arrests, feuds and results
   framed around a loss or a collapse. Money: only upbeat or curious angles (a record, a launch, a
   quirky business, a big deal that people will enjoy); never downturns, cuts, debt or fear.

REJECT when any of those fails. Answer "uncertain" whenever you are not sure: uncertain items are
rejected. A false reject costs nothing; a false allow costs the reader's trust.

For allowed items also give: the best section (from the item's allowed sections), the best beat
within that section (from the BEATS list for that section; "other" if none fits), a one- or two-word
topic tag (e.g. "ai", "space", "dogs", "f1", "retro games"), and a score from 1 to 10 for how
delightful it is and how well it would lead the front page.
${DELIGHT_SCORING}
`;

export const VOICES: Record<"witty" | "quirky" | "warm", string> = {
  witty:
    "Witty but informative: clear facts first, a playful headline, at most one joke per brief.",
  quirky:
    "Full quirky: puns, absurd asides and running gags are welcome, but the facts stay exact.",
  warm: "Warm and gentle: kind, curious and unhurried; wonder rather than jokes.",
};

export const VOICE_GUIDE = `
VOICE GUIDE.
- British English spelling. Plain, confident sentences. Present facts precisely.
- Headlines: a complete, playful sentence in sentence case, 8 to 16 words, no clickbait, no question
  headlines, no colon-headlines. Kickers: one to three words. Deks: one sentence that adds a fact.
- Banned: "heartwarming", "you won't believe", "wholesome", "internet is losing it", "viral
  sensation", "game-changer", "in a world where", exclamation marks in headlines, emoji.
- Never mention anything sad, dangerous or bad, even as backstory or contrast. If the source
  mentions something bad, leave it out entirely.
- GROUNDING: every fact, number, name, place and quotation must come from the SOURCE TEXT given for
  that story. Do not add facts from memory. Do not invent quotes. Write numbers exactly as the source
  writes them (as digits if the source uses digits). If unsure of a detail, leave it out.
- Real people only: never invent readers, letter-writers, customers or quotes. A "small win" is a
  real person's win as the source reports it, named only as the source names them.
- One source per story: its facts come from that story's source text alone. The exception is a
  weekend long read (Deep Dive, Slow Read), whose source text gathers several named outlets; it may
  use all of them, and credits them all.
- Write in our own words, never the source's sentences; quote at most a sentence or two, in curly
  quotes, attributed.
- Lead with the famous name. If the story involves a well-known star, franchise, club or event, put
  it in the headline and the first sentence.
- Keep every sentence bright. No grumbles, heat, commutes, office gripes, losses, injuries or
  rivalries, not even as a joke or a contrast.
- A story marked "summaryOnly" has only a short feed summary (and perhaps other outlets' text) to go
  on: write the brief length, from those facts only.
`;

/** Rough length per story, in paragraphs and words (the sample editions' shape). */
export const LENGTHS = {
  /** A weekend long read (Deep Dive, Slow Read): about five minutes. */
  long: { paragraphs: "8 to 12", words: "800 to 1100" },
  /** The front-page lead, or the first story on an inside page. */
  main: { paragraphs: "4 to 6", words: "250 to 380" },
  /** The second story on a page (or a front-page feature). */
  second: { paragraphs: "2 to 3", words: "130 to 200" },
  /** A one-paragraph brief. */
  brief: { paragraphs: "1", words: "50 to 90" },
} as const;

export type Length = keyof typeof LENGTHS;
