// Issue 42, Wednesday 30 September 2026. Real good-news stories, rewritten in the paper's own voice,
// each with its source article; images fetched with apps/frontend/scripts/fetch_image.py.
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
      slug: "goblin-shark-filmed-alive-deep-pacific",
      section: "discoveries",
      kicker: "Deep sea",
      headline: "The goblin shark, the deep sea’s oddest face, is finally filmed at home",
      dek: "Two free-swimming sightings in the central Pacific, one of them hiding in a video archive for six years, show the ‘living fossil’ lives far deeper and wider than anyone knew.",
      body: [
        "For roughly 125 million years, the goblin shark’s family has kept itself to itself. Now, for the first time, scientists have watched one of these long-snouted oddities simply going about its day.",
        "Until now, every living goblin shark anyone had seen had come up by accident on a fishing line, which is rather like judging a person by how they look when dragged out of bed. Researchers from the University of Hawaiʻi at Mānoa and the Minderoo-UWA Deep-Sea Research Centre in Australia have now described two healthy sharks swimming freely in the central Pacific, in a paper in the Journal of Fish Biology.",
        "The first had been hiding in plain sight. The robot submersible Hercules filmed it in 2019 during a livestreamed dive from the exploration ship Nautilus, 1,237 metres down on an unnamed seamount north-west of Jarvis Island. The clip sat in the public archive until 2025, when colleagues mentioned a possible sighting to Aaron Judah, a doctoral candidate in Hawaiʻi, who checked the footage and confirmed it.",
        "The second swam past a baited camera lowered onto the slope of the Tonga Trench in 2024, during the Inkfish Open Ocean Expedition. It was 1,997 metres down, about 700 metres deeper than the species had ever been recorded, and a new depth record for the whole mackerel-shark order, which includes great whites and makos. Until then, the deepest trace of a goblin shark was a single tooth left behind in a seabed cable.",
        "“Seeing the most iconic of all the deep-sea sharks alive and looking healthy in its natural habitat is a unique honor,” said Judah, the paper’s lead author.",
        "Alan Jamieson, who leads the Minderoo-UWA centre, filmed the Tonga shark. His team recorded more than 50 days of continuous footage on that trip, and the goblin shark appeared for a little over 20 seconds of it. “The Goblin Shark is one of these deep-sea charismatic animals that I never thought we’d see alive, and then to do so was amazing, but to then learn that colleagues in Hawai’i also saw one was just incredible,” he said.",
        "Before these sightings, the sharks were known mainly from waters off Japan, Australia and the western United States. The new finds push their known range thousands of kilometres into the middle of the Pacific, which means countries there can now add the goblin shark to their own lists of wildlife.",
        "“New discoveries like this demonstrate that there is still so much to explore in our deep ocean home,” Judah said.",
        "As for the sharks themselves, they glided on into the dark, snouts first, entirely unbothered by the fuss.",
      ],
      source: "ScienceDaily (University of Hawaiʻi at Mānoa)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/07/260708022208.htm",
      image: {
        file: "/editions/42/goblin-shark-filmed-alive-deep-pacific.jpg",
        alt: "A pale goblin shark with its long flat snout swims low over a pebbly seabed in the dark water of the Tonga Trench",
        credit: "Minderoo-UWA Deep-Sea Research Centre and Inkfish",
        from: "https://gizmodo.com/watch-a-rare-goblin-shark-filmed-alive-in-its-natural-habitat-for-the-first-time-2000771259",
      },
      sticker: "First look",
    },
    {
      slug: "youngest-planet-elias-2-24-b",
      slot: "feature",
      section: "discoveries",
      kicker: "Space",
      headline: "Astronomers find a baby planet less than a million years old",
      dek: "Elias 2-24 b is still wrapped in the dust it was born from, and it settles a ten-year argument about a faint dot.",
      body: [
        "Astronomers in Chile have confirmed the youngest planet ever found: a world called Elias 2-24 b that is less than a million years old and still tucked inside the swirl of gas and dust it grew from.",
        "The team, led by Andrea Bernardi, a doctoral candidate at Universidad Diego Portales, found it in old observations from the W. M. Keck Observatory in Hawaii, stored in a NASA-funded archive. The planet is about as massive as Jupiter and sits some 55 times farther from its star than Earth is from the Sun, in a gap it has carved through the dusty disc. “The planets should be found within the gaps, since they are carving them,” Bernardi said. “And that’s exactly where we found Elias 2-24 b.”",
        "The previous record holders were all more than five million years old. The find, published on 16 September, also settles a question astronomers had puzzled over for a decade, ever since telescopes spotted a faint point of light in that very gap.",
        "The star is 450 light-years away, so the baby photos are a little out of date.",
      ],
      source: "ScienceDaily (NASA)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260917003712.htm",
      image: {
        file: "/editions/42/youngest-planet-elias-2-24-b.jpg",
        alt: "Artist’s impression of a glowing young star inside a ring of blue dust, with a small bright planet carving a path through the gap",
        credit: "W. M. Keck Observatory/Adam Makarenko",
        from: "https://www.sciencedaily.com/releases/2026/09/260917003712.htm",
      },
    },
    {
      slug: "luffy-beetles-named-after-one-piece",
      slot: "feature",
      section: "discoveries",
      kicker: "Name game",
      headline: "Stretchy new beetles are named after One Piece’s rubbery hero Luffy",
      dek: "Their long, bendy-looking jaws and feelers reminded two entomologists of a certain pirate captain.",
      body: [
        "Two newly described rove beetles from the forests of southern China and Laos have been given a name any manga fan will recognise: Luffy, after the rubber-limbed captain of One Piece.",
        "The name is not just a fan’s wink. Compared with their relatives, the beetles have unusually long, slender jaws, antennae and mouthparts, stretched proportions that reminded the scientists of Luffy’s bendy body. Luffy schillhammeri lives in broadleaf forest in Yunnan, China, and honours the rove-beetle expert Harald Schillhammer of the Natural History Museum Vienna. Luffy nika, from Louang Namtha in northern Laos, has bands of white hair that echo the hero’s white, cloud-wreathed ‘Gear 5’ form, known as Nika.",
        "PhD student Fang-Shuo Hu and Alexey Solodovnikov of the Natural History Museum of Denmark described the new genus in the journal ZooKeys, and concluded that it probably sits on its own branch, right beside a whole group of its relatives.",
        "They hope the name tempts more young people into naming species. Adventure, it turns out, can be very small and very leggy.",
      ],
      source: "ScienceDaily (Pensoft Publishers)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/08/260802223430.htm",
      image: {
        file: "/editions/42/luffy-beetles-named-after-one-piece.jpg",
        alt: "The anime character Luffy in his white Gear 5 form running beside photographs of two long-jawed, long-legged rove beetles",
        credit:
          "Illustration: One Piece, Toei Animation. Beetle photographs: Hu & Solodovnikov, 2026",
        from: "https://www.sciencedaily.com/releases/2026/08/260802223430.htm",
      },
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "u2-bewleys-balcony-50th",
          kicker: "Birthday gig",
          headline: "U2 turn 50 by playing their old school, then a café balcony",
          dek: "The band began the day beside the science lab where it all started and ended it above Grafton Street, where thousands sang Happy Birthday back.",
          body: [
            "Fifty years after a teenage Larry Mullen pinned a note to a school noticeboard asking for bandmates, the four people who answered it are still the band. On Friday 25 September, U2 marked the anniversary in Dublin the only sensible way: by going back to school.",
            "At about two in the afternoon they took the stage at Mount Temple Comprehensive, where they last played in 1978. Several hundred pupils waved homemade banners, one of which read “It’s a Beautiful Day, No School”. Pointing towards the nearby science lab, Bono announced, “We escaped from the lab,” then introduced his bandmates by their old class designations: Larry 2I, Adam 5D, Edge 3U. A children’s string section joined them for One.",
            "By evening the party had moved to the balcony of Bewley’s café on Grafton Street. Four large speakers had rather given the surprise away, and the crowd had been building for hours, with fans in from Michigan, Derbyshire and a Flemish U2 fan club. One teenager was overheard telling friends that Westlife were playing.",
            "Shortly before 7pm the band appeared and opened with I Will Follow, turning the street into a stadium with shop fronts. The set took in Vertigo, Beautiful Day, a breakout of Molly Malone, and 40, for which the Edge and Adam swapped instruments. “The buskers have really upped their game,” Bono said, and thousands of people sang Happy Birthday back at him.",
            "The band stay modest about how it all began. Talking to The Irish Times for the anniversary, Bono put it plainly: “Edge and Larry could play; Adam and myself were bluffing.” Half a century on, the bluff is holding up nicely.",
          ],
          source: "The Irish Times",
          sourceUrl:
            "https://www.irishtimes.com/culture/music/2026/09/25/u2-play-special-gigs-at-mount-temple-comprehensive-and-grafton-street-to-mark-50th-anniversary/",
          image: {
            file: "/editions/42/u2-bewleys-balcony-50th.jpg",
            alt: "The Edge and Bono laughing together as they lean on the balcony rail at Bewley’s on Grafton Street",
            credit: "Rich Fury/U2/LHP/PA Wire via The Irish Times",
            from: "https://www.irishtimes.com/culture/music/2026/09/25/u2-fans-gather-in-dublin-city-centre-for-surprise-appearance-by-the-band/",
          },
          sticker: "50 years",
        },
        {
          slug: "endgame-encore-tops-box-office",
          slot: "feature",
          kicker: "Encore!",
          headline: "Seven years on, Avengers: Endgame returns and wins the weekend again",
          dek: "Its $26 million opening is the third-best ever for a re-release, beaten only by Star Wars and The Lion King.",
          body: [
            "Most films leave cinemas and stay gone. Avengers: Endgame, the 2019 superhero finale, came back last weekend as Avengers: Endgame Encore and went straight to No. 1 at the North American box office with $26 million.",
            "That is the third-biggest opening ever for a re-release, behind the 1997 Special Edition of Star Wars ($35.9 million) and Disney’s 3-D Lion King from 2011, and just ahead of last year’s 20th-anniversary return of Revenge of the Sith ($25.4 million). The Encore carries extra scenes, a strong lure for fans warming up for the next Avengers film, Doomsday.",
            "It pipped Resident Evil, which took $23.3 million in its second weekend. The snap, it turns out, works on ticket queues too.",
          ],
          source: "Rotten Tomatoes",
          sourceUrl:
            "https://editorial.rottentomatoes.com/article/weekend-box-office-avengers-endgame-encore-week-1/",
          image: {
            file: "/editions/42/endgame-encore-tops-box-office.jpg",
            alt: "Captain America at the front of the assembled heroes in a still from Avengers: Endgame",
            credit: "Marvel Studios via Rotten Tomatoes",
            from: "https://editorial.rottentomatoes.com/article/weekend-box-office-avengers-endgame-encore-week-1/",
          },
        },
        {
          slug: "aperitif-tg4-dating-by-courses",
          slot: "brief",
          kicker: "Love, as Gaeilge",
          headline: "Irish-language dating show serves each date as a separate course",
          dek: "TG4’s Aperitíf is First Dates in Irish, set over a three-course dinner.",
          body: [
            "TG4’s new Aperitíf is First Dates in Irish, with a twist from the kitchen: each hopeful meets three dates at Dublin’s Iveagh Garden Hotel, one arriving with the starter, one with the main and one with dessert.",
            "Among the singletons is Isibéal, a Galway teacher who is the voice of Ring doorbells in Ireland and the UK. Chemistry is not guaranteed; a warm welcome at the door is.",
          ],
          source: "The Irish Times",
          sourceUrl:
            "https://www.irishtimes.com/culture/tv-radio/2026/09/23/aperitif-on-tg4-this-first-dates-as-gaeilge-show-is-cheap-cheerful-and-quietly-disarming/",
        },
        {
          slug: "colin-farrell-swift-video",
          slot: "brief",
          kicker: "Casting call",
          headline: "Colin Farrell becomes the latest Irishman to wander into a Taylor Swift video",
          dek: "He follows Domhnall Gleeson, Cillian Murphy and Graham Norton.",
          body: [
            "Taylor Swift’s new Encore edition of The Life of a Showgirl adds four new songs, and the video for one of them, Patient Zero, stars Colin Farrell in the lead. He joins a small but growing club of Irishmen cast in Swift videos, after Domhnall Gleeson, Cillian Murphy and Graham Norton. Dublin’s acting agencies may want to keep the phones charged.",
          ],
          source: "The Irish Times",
          sourceUrl:
            "https://www.irishtimes.com/culture/music/review/2026/09/25/taylor-swifts-showgirl-encore-three-superb-new-songs-some-newly-wed-cringe-and-a-colin-farrell-cameo/",
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "toem-2-photo-adventure",
          kicker: "New release",
          headline: "Toem 2 arrives, and its bus driver is a fluffy thing in a bowtie",
          dek: "Sweden’s Something We Made has released its black-and-white photo sequel, where snapping strangers’ problems pays your fare.",
          body: [
            "The fastest way across Toem 2’s countryside is to photograph everyone’s problems until the bus agrees to take you. Swedish studio Something We Made released its black-and-white photo adventure on 29 September for PC, Mac, Linux, PlayStation 5, Switch and Switch 2.",
            "The quiet, camera-toting hero of the first game is back several years on, heading for the Whirlhill Festival to see the Whirling Birch bloom. The bus refuses to go direct, so every stop becomes a detour: help the locals, earn stamps and tokens, move one stop closer to the tree.",
            "This time the hero can run, jump and climb through a more fully three-dimensional world, while the characters stay flat, hand-drawn cut-outs. Each region hands out a new camera attachment, starting with a pair of scissors for snipping at the scenery, and there is a floating drone and a tripod for trickier shots.",
            "The people are the point. Somewhere along the route you may meet a skeleton stuck in a hanging cage, fretting about whether it left the stove on. The wildlife gets stamps of its own, with names like Blobnuts and Mopeyrelles.",
            "Reviewing it for GamesRadar+, Sam Loveridge called Toem 2 “a game for nosy people” and “probably the gentlest Metroidvania-alike you’re ever going to find.” Her main complaint is that its roughly four hours end; 95% of critics on OpenCritic recommend it.",
            "Pack a spare memory card. The bus is patient, but the locals are chatty.",
          ],
          source: "GamesRadar+",
          sourceUrl: "https://www.gamesradar.com/games/adventure/toem-2-review/",
          image: {
            file: "/editions/42/toem-2-photo-adventure.jpg",
            alt: "A black-and-white cartoon bus driven by a fluffy creature wearing a bowtie, in Toem 2",
            credit: "Something We Made via GamesRadar+",
            from: "https://www.gamesradar.com/games/adventure/toem-2-review/",
          },
          sticker: "Out now",
        },
        {
          slug: "witcher-3-low-poly-pigeons",
          slot: "feature",
          kicker: "Remaster watch",
          headline:
            "The Witcher 3 remaster changes almost everything except its beloved blocky pigeons",
          dek: "Fans feared the 2015 game’s famously low-detail birds had been polished away; they were looking at the wrong pigeon.",
          body: [
            "The Witcher 3: Wild Hunt – Remastered arrived on 29 September as a free update for anyone who owns the 2015 game, and within hours it had beaten the game’s all-time Steam player peak. Almost everything looks new. That was the worry.",
            "A Reddit post titled “Pigeons Remastered” put an old and new bird side by side, and fans feared the game’s famously chunky, low-poly flying pigeons had been smoothed out of existence.",
            "Kotaku editor Ethan Gach called it “a false alarm”: the fancier bird was a street pigeon, which always looked like that, and the flying flock remains as angular as ever, now under path-traced light. Replying to Gach, one relieved fan announced the pigeons were still there; the top response read: “Glory to low poly.”",
            "Some things are too blocky to fix.",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/the-witcher/the-witcher-3-remastered-did-not-in-fact-change-the-rpgs-hilarious-low-poly-pigeons-much-to-fans-delight-glory-to-low-poly/",
          image: {
            file: "/editions/42/witcher-3-low-poly-pigeons.jpg",
            alt: "Geralt of Rivia in chainmail in The Witcher 3",
            credit: "CD Projekt Red via GamesRadar+",
            from: "https://www.gamesradar.com/games/the-witcher/the-witcher-3-remastered-did-not-in-fact-change-the-rpgs-hilarious-low-poly-pigeons-much-to-fans-delight-glory-to-low-poly/",
          },
        },
        {
          slug: "castlevania-40-free-on-mobile",
          slot: "brief",
          kicker: "Free game",
          headline: "Castlevania turns 40 and Konami is giving the original away on phones",
          dek: "Claim it by 24 October and it stays yours.",
          body: [
            "Konami is marking 40 years of Castlevania, whose anniversary fell on 26 September, by giving away the original NES game on the App Store and Google Play until 24 October. Anyone who grabs the 1986 vampire-whipper in time can keep playing it after the offer ends. The series now runs to more than 30 games.",
          ],
          source: "Shacknews",
          sourceUrl:
            "https://www.shacknews.com/article/150820/konami-castlevania-free-ios-android-40th-anniversary",
        },
        {
          slug: "valheim-cheaters-confession-code",
          slot: "brief",
          kicker: "Honesty policy",
          headline:
            "Valheim lets cheaters earn achievements again, if they type a confession first",
          dek: "Iron Gate Studio has left the final judgement to a Norse god.",
          body: [
            "Viking survival game Valheim has reached version 1.0 with 50 new achievements, and Iron Gate Studio has softened its rule locking them for anyone who used developer commands. To opt back in, type “yesiuseddevcommandsbutiwantmyachievementsanyway”. The patch notes leave it to your conscience: “Oden will surely know if you use it dishonourably.”",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/survival/valheim-1-0-lets-cheaters-earn-achievements-by-admitting-their-crimes-and-then-cheating-even-harder-oden-will-surely-know-if-you-use-it-dishonourably/",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "russell-pips-verstappen-baku-photo-finish",
          kicker: "Formula 1",
          headline: "Russell holds off Verstappen by 0.196 seconds on Baku’s long straight",
          dek: "Both drivers insist the real gap was about a second, which makes the photo finish even funnier.",
          body: [
            "George Russell spent most of Saturday’s Azerbaijan Grand Prix looking like a man out for a Sunday drive. Then came the final lap, and a finish so tight the timing screens needed three decimal places to settle it: Russell’s Mercedes crossed the line 0.196 seconds ahead of Max Verstappen’s Red Bull.",
            "That margin sits just outside Formula 1’s ten closest finishes of all time, according to a list Motorsport.com drew up within hours. For a race Russell had seemed to have in his pocket, it was an unusually nervy last mile.",
            "He had taken pole by 0.837 seconds, the biggest gap of the season, and was nearly ten seconds clear at half distance. Two safety cars then shuffled the field back together and delivered Verstappen, who had started eighth, straight into his mirrors for the closing laps.",
            "The twist came from a late yellow flag. “When the yellow flag came out, I lifted off the power and when I went back on, I had no turbo, so then I had no power,” Russell explained. Verstappen pulled alongside on the start-finish straight and ran out of tarmac a car’s nose short.",
            "The Dutchman reckoned the real gap across the final stint was about a second, and sounded as if he had enjoyed himself anyway. “That last stint was fun. I kissed a few walls as well, but that was just to leave my mark here in Baku!” he said.",
            "Isack Hadjar completed a Red Bull double podium in third, while championship leader Kimi Antonelli climbed from 16th on the grid to fifth. Russell called it an incredible weekend. The photo finish would not argue.",
          ],
          source: "Motorsport.com",
          sourceUrl:
            "https://www.motorsport.com/f1/news/why-max-verstappen-says-0196s-baku-finish-line-gap-to-george-russell-is-slightly-misleading/10859357/",
          image: {
            file: "/editions/42/russell-pips-verstappen-baku-photo-finish.jpg",
            alt: "George Russell in his Mercedes race suit and helmet, both fists raised in celebration",
            credit: "Getty Images via Formula1.com",
            from: "https://www.formula1.com/en/latest/article/russell-narrowly-holds-off-verstappen-to-take-victory-over-the-line-in-chaotic-azerbaijan-gp.5J4lgNh82JDL2GM302irF0",
          },
          sticker: "0.196s",
        },
        {
          slug: "easdale-stone-skimming-new-champions",
          slot: "feature",
          kicker: "Stone skimming",
          headline: "A Kiwi and a Carolinian take world skimming titles on a 60-person island",
          dek: "Stones must pass through the Ring of Truth and leave from the Skim of Destiny, naturally.",
          body: [
            "Abbey McDonald became the first New Zealander to win the women’s title at the World Stone Skimming Championships on Easdale, beating six-time champion Lucy Wood. North Carolina’s Liam Knight took the men’s trophy as the only thrower all day to reach the back wall of the flooded slate quarry, 63 metres out.",
            "Strong gusts cut distances, but the crowd was the biggest yet: about 2,000 spectators on an island of 60 people, with more than 400 competitors, over a fifth from abroad. The ferry queue was so long that some fans turned back.",
            "The rules remain gloriously specific. Stones must come from Easdale, fit through the Ring of Truth and be launched from the Skim of Destiny, with the best reaching a final called the Toss Off. Over-60s compete as the Old Tossers.",
            "“It’s nice for once that throwing stones can unite the world, rather than divide it,” said Toss Master Kyle Mathews.",
          ],
          source: "BBC News",
          sourceUrl: "https://www.bbc.co.uk/news/articles/cgqd7n9x179o",
          image: {
            file: "/editions/42/easdale-stone-skimming-new-champions.jpg",
            alt: "Women’s champion Abbey McDonald kicks a leg up and holds her trophy aloft beside the flooded quarry on Easdale",
            credit: "Tim Hamlet / BBC",
            from: "https://www.bbc.co.uk/news/articles/cgqd7n9x179o",
          },
        },
        {
          slug: "asian-games-cricket-baseball-park-tents",
          slot: "brief",
          kicker: "Cricket",
          headline: "Asian Games cricket moves into a baseball park, with tents for dressing rooms",
          dek: "Air-conditioned tents, to be fair.",
          body: [
            "Cricket at the Asian Games has set up camp in a baseball park. Korogi Athletic Park in Nagoya, ringed by thousands of trees, has air-conditioned tents for dressing rooms and pop-up stands for about 2,500 fans. After 18 straight days of rain, boundaries were set at the 60-yard minimum. India’s women took full advantage, hitting 13 sixes on the way to 216 for 3 in their final.",
          ],
          source: "RevSportz",
          sourceUrl:
            "https://revsportz.in/short-boundaries-tent-dressing-rooms-crickets-unusual-home-at-the-asian-games/",
        },
        {
          slug: "darts-final-basketball-next-door",
          slot: "brief",
          kicker: "Darts",
          headline: "Dutch darts final gets a surprise soundtrack from basketball next door",
          dek: "The oche and the hoop, separated by one wall.",
          body: [
            "The Players Championship 29 final in Den Bosch on Tuesday 22 September came with a bonus soundtrack: a basketball team was playing in the next room at the Maaspoort. Gian van Veen asked referee Franz Engerer to stop play over the din. Cameron Menzies tuned it all out, won 8–4 and banked £15,000 for the fourth title of his career.",
          ],
          source: "talkSPORT",
          sourceUrl:
            "https://talksport.com/darts/4599902/gian-van-veen-referee-players-championship/",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "doom-ported-to-sql",
          kicker: "Database games",
          headline: "Database engineer rebuilds all of 1993’s Doom in SQL, and it plays",
          dek: "The game logic takes about 5,900 lines of queries, fewer than the original C, and a four-player deathmatch came almost free.",
          body: [
            "Most databases spend their days tallying invoices. At the database company CedarDB, one has been fighting demons. Engineer Lukas Vogel has rebuilt the original 1993 Doom so that both the game’s rules and its pictures are produced by SQL queries running inside the database.",
            "He set himself strict rules. A small Python script may only read the keyboard, keep time and put the finished picture on screen. Everything else, from opening doors to rockets in flight, lives in tables. The game ticks at its original 35 times a second, and the renderer turns out a full 320-by-200 frame up to 60 times a second on Vogel’s laptop.",
            "Drawing one frame takes about 1,300 lines of SQL spread over 89 steps known as common table expressions. The game logic runs to roughly 5,900 lines, which Vogel points out is shorter than the original C code at about 9,000. “To be honest, I was surprised how easy it is to express pretty complicated game logic in SQL,” he wrote.",
            "Keeping everything as data has perks. The shotgun is a single row in a table, so when Vogel felt underpowered he edited it to fire 500 pellets at once. And because a database already handles logins, permissions and lots of users at the same time, multiplayer came almost for nothing: up to four people can join a public deathmatch, and anyone waiting in the queue can query the live match.",
            "This is his second attempt. Last year’s DOOMQL drew ASCII art that people pointed out looked more like Wolfenstein 3D. The new version looks like the real thing, and Vogel credits the original’s designer in a section titled “John Carmack was a genius.”",
            "Somewhere, a spreadsheet is feeling nervous.",
          ],
          source: "CedarDB",
          sourceUrl: "https://cedardb.com/blog/sqldoom/",
          image: {
            file: "/editions/42/doom-ported-to-sql.jpg",
            alt: "A frame of Doom rendered by SQL, with a live chart of frames per second beside it and the query along the bottom",
            credit: "Lukas Vogel / CedarDB",
            from: "https://cedardb.com/blog/sqldoom/",
          },
          sticker: "It runs!",
        },
        {
          slug: "center-pivot-lawn-mower",
          slot: "feature",
          kicker: "Garden robotics",
          headline: "YouTuber builds a tiny farm irrigation rig that mows his lawn in circles",
          dek: "It keeps its long arm straight using the same trick giant crop sprinklers use.",
          body: [
            "Fly over parts of the United States or Australia and the farmland is dotted with huge green circles, drawn by centre-pivot irrigation rigs sweeping slowly round a fixed point. The maker behind the YouTube channel rctestflight has built a small one for his garden and swapped the water for blades.",
            "Like the real thing, his rig is a chain of loosely jointed sections, each on its own wheels. The outermost wheels roll at a steady pace, and each inner section catches up whenever the joint beside it bends too far. At first simple limit switches did the job; later a smoother potentiometer-based controller took over. A carriage carrying a pair of motor-driven knives shuttles back and forth along one arm, trimming as the whole thing turns.",
            "His damp Pacific Northwest garden fought back with rust, mud and fast-growing plants. Luckily the circle was already worn in, from earlier experiments to see how much punishment RC cars could take.",
            "The result is the tidiest crop circle on the street.",
          ],
          source: "Hackaday",
          sourceUrl: "https://hackaday.com/2026/09/27/center-pivot-system-modified-to-mow-lawn/",
          image: {
            file: "/editions/42/center-pivot-lawn-mower.jpg",
            alt: "Aerial view of a lawn cut into concentric circles by a miniature centre-pivot rig with four wheeled towers",
            credit: "rctestflight via Hackaday",
            from: "https://hackaday.com/2026/09/27/center-pivot-system-modified-to-mow-lawn/",
          },
        },
        {
          slug: "pico-8-handheld-made-real",
          slot: "brief",
          kicker: "Pocket games",
          headline: "Maker gives the make-believe PICO-8 games console a real, square body",
          dek: "A 720-by-720 screen matches the virtual machine’s square picture exactly.",
          body: [
            "PICO-8 is a “fantasy console”: a pretend 8-bit games machine that exists only as software. A builder known as UncleStem has made it solid, with a Game Boy-style handheld built around a Raspberry Pi Zero 2 W and a square 720-by-720 screen to match PICO-8’s square picture. The case began as a 3D print, then was milled from aluminium by a professional once his own attempt stalled.",
          ],
          source: "Hackaday",
          sourceUrl: "https://hackaday.com/2026/09/28/this-pico-8-handheld-is-no-fantasy/",
        },
        {
          slug: "postmarketos-renamed-nura",
          slot: "brief",
          kicker: "New name",
          headline: "Phone Linux project postmarketOS picks a new name from 300 suggestions",
          dek: "The winner comes from Sardinian stone towers that have stood for thousands of years.",
          body: [
            "The open-source project that keeps old phones useful by running Linux on them is now called Nura. The name is short for nuraghe, granite towers in Sardinia built 5,000 or more years ago, many of which still stand. The old name, the team said, was hard to say. Community member Davide Depau suggested the winner, which was picked from more than 300 ideas and revealed at the project’s own conference.",
          ],
          source: "Nura",
          sourceUrl: "https://nura.eco/blog/2026/09/27/nura-rename/",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "craigslist-bob-ross-paintings",
          kicker: "Happy accident",
          headline: "Two Bob Ross paintings bought on Craigslist sell for $165,000",
          dek: "Both were signed to a friend called Jan, and came with photos of Ross painting them in front of fans in 1987.",
          body: [
            "About ten years ago, someone scrolling Craigslist bought two landscape paintings by Bob Ross. On 15 September they went under the hammer at Caza Sikes, a gallery and auction house in Cincinnati, and made $65,000 and $100,000. Happy little trees, happier little bank balance.",
            "It was not a steal at the time. Will Sikes, a partner at the firm, told the Cincinnati radio station WVXU that the consignor paid what “was probably a fair price”, though “far less than they are worth now.” Each painting carried a pre-sale estimate of $50,000 to $75,000, which the auction house itself called conservative, and “Mountain Landscape” sailed straight past it.",
            "Both canvases date from 1987, and they are not the pictures Ross painted for his television show or his instruction books. Each is inscribed on the back to “Jan”, who is believed to have run an art shop in Dayton, Ohio, where Ross gave a demonstration. The lots came with photographs of the day: Ross mid-painting, smiling for the camera, and one fan in a Bob Ross T-shirt. Bob Ross, Inc. authenticated both.",
            "“Ross was an important figure during so many people’s formative years,” said the principal auctioneer, Graydon Sikes. “He’s transcended the world of art and television and become a pop culture phenomenon.”",
            "Somewhere, a Craigslist buyer is quietly admiring a very happy accident.",
          ],
          source: "Antique Trader",
          sourceUrl:
            "https://www.antiquetrader.com/bob-ross-paintings-bought-before-the-boom-sell-at-auction",
          image: {
            file: "/editions/42/craigslist-bob-ross-paintings.jpg",
            alt: "Bob Ross’s ‘Mountain Landscape’: a snowy peak above a turquoise stream, framed by tall trees, in an ornate gold frame",
            credit: "Caza Sikes, via Antique Trader",
            from: "https://www.antiquetrader.com/bob-ross-paintings-bought-before-the-boom-sell-at-auction",
          },
          sticker: "$165k",
        },
        {
          slug: "pokemon-spam-gift-sets",
          slot: "feature",
          kicker: "Resale",
          headline: "Pokémon-themed Spam tins sell on eBay for nearly double the shop price",
          dek: "The South Korean gift sets come with lunch-box stickers, and the free keychain of Snorlax holding a bowl of Spam is worth more than the meat.",
          body: [
            "Pokémon has turned cards, cereal and snacks into collectables. In its 30th year, it has done the same for tinned meat. In South Korea, where Spam gift sets are a traditional present for the Chuseok harvest festival, the franchise released three themed bundles on 9 September: one each for Charmander, Snorlax and Ditto.",
            "Each set holds five 200g tins and a sheet of stickers (lunch-box decoration is the suggested use) and costs 19,900 won, or about $15. Two days after launch, a trio of unopened sets sold on eBay for $88 plus shipping, almost twice what they cost in the shops. The real prize is the free gift for buying all three: a fuzzy Ditto or Snorlax keychain clutching a plush bowl of rice and Spam. One Snorlax went for $126, and a Ditto for $149.99.",
            "Gotta can ’em all.",
          ],
          source: "Antique Trader",
          sourceUrl:
            "https://www.antiquetrader.com/pokemon-spam-goes-from-grocery-shelves-to-ebay-sales",
          image: {
            file: "/editions/42/pokemon-spam-gift-sets.jpg",
            alt: "Three Pokémon Spam gift sets in orange Charmander, teal Snorlax and purple Ditto packaging, each box holding five tins",
            credit: "eBay seller dokkaebi_tcg, via Antique Trader",
            from: "https://www.antiquetrader.com/pokemon-spam-goes-from-grocery-shelves-to-ebay-sales",
          },
        },
        {
          slug: "wonky-veg-price-bands",
          slot: "brief",
          kicker: "Markets",
          headline: "Farmers’ market prices its wonkiest vegetables by how strange they look",
          dek: "A carrot with legs costs almost nothing; a potato shaped like a duck is free.",
          body: [
            "Stallholders at the Saturday market in Kerrowdale now sort their misshapen vegetables into four bands, from “slightly odd” to “has a personality”. The stranger the veg, the lower the price. Sales of wonky produce have tripled, and a tomato resembling a small, grumpy owl was photographed 400 times before anyone bought it.",
          ],
          source: "Market Gazette (sample)",
        },
        {
          slug: "station-casinos-anniversary-bonus",
          slot: "brief",
          kicker: "Many happy returns",
          headline: "Company marks its 50th birthday with $1,000 per employee per year served",
          dek: "Nearly 10,000 staff at Station Casinos shared $70 million in company stock.",
          body: [
            "Station Casinos, whose story began with the Bingo Palace in 1976, marked its 50th anniversary by giving each of its nearly 10,000 team members $1,000 in company stock for every year they have worked there. The bill came to $70 million. Seven employees have been there 45 years or more, and Ida Johnson, who joined in 1977, received $49,000.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/1000-bonus-for-every-year-at-the-company-casino-employees-shocked-at-companys-50th-anniversary/",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "sea-shanty-bands-uk",
          kicker: "Heave ho",
          headline:
            "Five years after Wellerman, Britain’s sea shanty bands are still in full voice",
          dek: "Hundreds of community groups now sing the old working songs, and the audiences keep getting younger.",
          body: [
            "Every Wednesday night, eight men in Newhaven, on England’s south coast, squeeze into a shed at the bottom of one of their gardens to rehearse sea shanties. They are the Wreckers, aged 22 to 82, and by their own admission they sound nothing like a choir.",
            "“I loved their sound though it’s not a pleasant choir,” says Tony Lewis, who volunteers at the local RNLI lifeboat station and had never sung in public before joining in 2024. “We call it rum-bunctious and it’s such a good laugh, we get the audience clapping, stamping their feet and singing along with the choruses.”",
            "They are far from alone. Positive News reports that hundreds of shanty bands have formed around the UK since 2021, when Scottish postman Nathan Evans sang the whaling song Wellerman on TikTok and streaming algorithms did the rest. Groups have sprung up well inland too, from Oxford to West Yorkshire.",
            "In Ipswich, the Orwellermen first met on a Wednesday at the Steamboat Tavern beside the River Orwell, and have kept the date ever since. Founder Gareth Roberts reckons the 25 members, the oldest of them 83, have sung 180 different songs, including one they wrote about the Suffolk coast and a Japanese shanty about a samurai who goes fishing.",
            "The crowds are getting younger. Children sing along at the front of Wreckers gigs, and the Falmouth International Sea Shanty Festival, founded in 2003, now draws more than 65,000 visitors, with young people making up large parts of the audience.",
            "Roberts’ wife calls him a “shanty evangelist”. Judging by the turnout, the sermon is working.",
          ],
          source: "Positive News",
          sourceUrl:
            "https://www.positive.news/lifestyle/the-unlikely-rise-of-the-sea-shanty-band/",
          image: {
            file: "/editions/42/sea-shanty-bands-uk.jpg",
            alt: "A line of shanty singers in bright rain jackets standing together on a misty shingle beach",
            credit: "Peter Flude / Positive News",
            from: "https://www.positive.news/lifestyle/the-unlikely-rise-of-the-sea-shanty-band/",
          },
          sticker: "Yo ho!",
        },
        {
          slug: "tiny-wins-thread",
          slot: "feature",
          kicker: "Small victories",
          headline: "An online thread of ‘tiny wins’ passes a million upvotes and keeps going",
          dek: "Top post: “I remembered why I walked into the kitchen.”",
          body: [
            "It began with one post from a user called parallel_paulina: “Parked perfectly first time. Nobody saw. Needed to tell someone.” Eleven months later the thread has 84,000 replies and more than a million upvotes.",
            "The rules, enforced by volunteer moderators, are strict: the win must be small, it must be yours and it must actually have happened. “Got promoted” is gently removed. “Opened a jar on the first try” stays.",
            "The most-upvoted entry reads, in full: “I remembered why I walked into the kitchen.” Moderator Deshawn Okoro, who reads every submission before breakfast, says the thread works because nothing in it can be topped. “You can’t out-do someone else’s perfectly toasted crumpet,” he said. “You can only add yours.”",
          ],
          source: "Around the Web (sample)",
          photo: "stickyNotes",
        },
        {
          slug: "side-neck-emu-devon",
          slot: "brief",
          kicker: "Bird brain",
          headline: "Escaped emu flattens its would-be captor, then lets itself back in",
          dek: "A Devon driver filmed Side Neck winning a roadside tussle before strolling home past an alpaca.",
          body: [
            "On the A381 near Salcombe in Devon, a man tried to wrestle an escaped emu back to its field. Driver James Barker filmed the bird bouncing up, knocking the man onto his backside, then trotting home through a gate.",
            "The emu, called Side Neck, had wandered out through a gate left open accidentally, owner Mark Harrington said. “He was just trying to get back — it was hysterical,” said Barker.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/28/escaped-emu-wrestling-Devon-England/1651790611221/",
        },
        {
          slug: "cold-side-of-the-pillow-glossary",
          slot: "brief",
          kicker: "Words",
          headline: "Crowdsourced glossary collects 1,400 names for the cold side of the pillow",
          dek: "The current favourite is ‘the second chance’.",
          body: [
            "A shared online glossary started by a night-shift baker in Vellmouth asks one question: what do you call the cool side of the pillow? After six months it holds 1,400 answers in 31 languages. Front-runners include ‘the second chance’, ‘the fridge side’ and, from a seven-year-old, ‘the good bit’.",
          ],
          source: "Around the Web (sample)",
        },
      ],
    },
    {
      section: "food-and-words",
      stories: [
        {
          slug: "malvern-tallest-cucumber",
          kicker: "Tall order",
          headline: "Gloucester grower trains a cucumber up a washing line to 7.6 metres",
          dek: "The vine was one of seven Guinness titles at Malvern’s giant-veg show, alongside the heaviest single sweetcorn kernel.",
          body: [
            "Most cucumbers end up in a sandwich. Graham Barratt’s ended up coiled around a pumpkin on a flatbed truck, measuring 7.598 metres and holding the Guinness World Record for the tallest cucumber plant.",
            "The gardener from Abbeydale in Gloucester already grows giant cucumbers for the Malvern Autumn Show, and this year he had a few plants spare. He put three in his long polytunnel and went after the old record of 6.49 metres. “It is highly impractical to grow these vertically, so I trained them up a 2.5 metre bamboo cane, then along a steel cored washing line,” he told SoGlos.",
            "The secret was saying no. Barratt pinched off side shoots and flowers so the plant never got round to making fruit, because once a cucumber starts to swell, the vine all but stops climbing. A tape measure alongside kept score. On show day it took four people to move it. “We carefully coiled it around the big pumpkin and gasped a sigh of relief,” he said.",
            "He had company. The CANNA UK National Giant Vegetables Championship at the Three Counties Showground drew 597 entries from 169 growers across 33 classes, and seven Guinness records fell, among them the longest tromboncino, the heaviest beetroot and the heaviest sweetcorn kernel, a category that conjures a very serious judge with very small tweezers.",
            "Barratt collects these things: past titles include the largest elephant garlic bulb and the longest luffa. The show returns in September 2027. The washing line, presumably, goes back to socks.",
          ],
          source: "SoGlos",
          sourceUrl:
            "https://www.soglos.com/news/food-drink/gloucestershire-grower-breaks-guinness-world-record-at-malvern-autumn-show/27557/",
          image: {
            file: "/editions/42/malvern-tallest-cucumber.jpg",
            alt: "Graham Barratt kneels beside his coiled cucumber vine, holding a “New World Record” sign",
            credit: "Mikal Ludlow / SoGlos",
            from: "https://www.soglos.com/news/food-drink/gloucestershire-grower-breaks-guinness-world-record-at-malvern-autumn-show/27557/",
          },
          sticker: "7.598 m",
        },
        {
          slug: "bermuda-words-oed",
          slot: "feature",
          kicker: "Hey, hamma",
          headline: "Oxford English Dictionary adds Bermuda’s word for chorizo, via the Azores",
          dek: "Four new Bermudian entries arrive through a partnership with the island’s spelling bee for 9- to 13-year-olds.",
          body: [
            "If you want chorizo in Bermuda, ask for shadeesh. As of this month, the Oxford English Dictionary will back you up.",
            "The word is one of four Bermudian English terms in the OED’s September update, and its family tree is a small sea voyage. It comes from the Portuguese chouriço, but the spelling copies how that word sounds in the Azores, the Atlantic islands many of Bermuda’s Portuguese-speaking settlers came from. The dictionary’s earliest example dates from 2010.",
            "Joining it is hamma, Bermudian for a friend since at least 1980, which doubles as a greeting. The OED’s evidence includes a line from Vanessa Fox’s 1994 mystery novel Bermuda: “Hey, hamma. It’s a beautiful day.” It sounds like hammer and is sometimes spelled that way, but its origin is officially unknown. So is that of bimpert, a Bermudian word for a foolish person, first spotted in 2009.",
            "The additions came through a new partnership with the Bermuda Spelling Bee, a contest for 9- to 13-year-olds now in its third year. Every September schools receive a study booklet of around 2,000 words, and this year’s uses the OED as its key source. Because Bermuda spells the British and the American way, the bee accepts both, which should save a lot of arguments about colour.",
            "The island’s first batch, added in 2021, brought in Gombey and greeze. Now they have a friend in the dictionary: a hamma.",
          ],
          source: "Bernews",
          sourceUrl: "https://bernews.com/2026/09/oxford-dictionary-adds-more-bermuda-words/",
          image: {
            file: "/editions/42/bermuda-words-oed.jpg",
            alt: "Graphic of a stack of books whose spines read bimpert, hamma, shadeesh and to cut someone’s tail",
            credit: "Bernews",
            from: "https://bernews.com/2026/09/oxford-dictionary-adds-more-bermuda-words/",
          },
        },
        {
          slug: "electrified-cold-brew",
          slot: "brief",
          kicker: "Charged up",
          headline: "Massachusetts roaster runs its cold brew past electrodes to wake the flavour",
          dek: "A low-voltage current is meant to undo what brewing flattens.",
          body: [
            "Atomic Coffee Roasters in Danvers, Massachusetts, now sends its cold brew through a stretch of pipe fitted with electrodes on the way to the canning line. The low-voltage current, devised by the startup Overpotential, targets molecules that oxidised during brewing, to rescue the berry and mango notes of Ethiopian beans that cold brew tends to flatten. It launches, fittingly named Potential, on 5 October.",
          ],
          source: "Daily Coffee News",
          sourceUrl:
            "https://dailycoffeenews.com/2026/09/23/atomic-coffee-and-overpotential-combine-for-electrified-cold-brew/",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "1,997",
        caption:
          "metres down: the deepest a goblin shark has ever been seen, cruising past a camera in the Tonga Trench",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Sunny with scattered memes",
        detail:
          "Low-poly pigeons flying in formation over the remaster by lunchtime. A warm front of Happy Birthday moving up Grafton Street, clearing to a light drizzle of cucumber puns.",
      },
    },
    {
      type: "quote",
      content: {
        text: "The buskers have really upped their game.",
        by: "Bono, on a café balcony in Dublin",
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
        text: "An earlier edition described the goblin shark as ‘shy’. It has simply been busy for 125 million years. We apologise to the shark, who has not noticed.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "One steel-cored washing line, 7.6 metres or longer. Must be comfortable holding a cucumber. Socks optional.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FOUND",
        text: "Several pigeons, extremely low-poly, flying in straight lines. Unchanged since 2015. Owners may collect from Novigrad.",
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
        text: "Experienced bluffer, 50 years in the business. Can’t play, never could, has a very nice balcony.",
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
