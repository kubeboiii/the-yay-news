// Issue 43, Thursday 1 October 2026. Scheduled: it exists, but is not served until it is published.
// Real good-news stories, rewritten in the paper's own voice, each with its source article; images
// fetched with apps/frontend/scripts/fetch_image.py.
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
      slug: "bumble-bees-roll-a-ball-to-reach-a-flower",
      section: "discoveries",
      kicker: "Clever bees",
      headline: "Bumble bees work out, untaught, how to roll a ball and reach a flower",
      dek: "A Finnish team gave bees an insect version of a famous chimpanzee puzzle, and many of them solved it on the spot.",
      body: [
        "More than a hundred years ago, the psychologist Wolfgang Köhler hung a banana out of reach and watched chimpanzees stack boxes to get it. Scientists in Finland have now set the same kind of puzzle for bumble bees, and the bees rose to it, quite literally.",
        "Researchers from the universities of Oulu, Helsinki and Turku first taught bumble bees two separate things: that a blue artificial flower held a reward, and that a small ball in their arena was harmless and could be moved. Then they fixed the flower to the ceiling of the see-through arena, out of reach.",
        "Nobody showed the bees what to do next. Many of them rolled the ball underneath the flower, climbed on top and helped themselves.",
        "“This is essentially an insect version of the classic ‘box-and-banana’ problem,” said Olli Loukola, the study’s senior author. “The animal must realize that an object can be repositioned and then used as a tool to reach an otherwise inaccessible goal.”",
        "“What makes this behavior especially remarkable is that the bees had never been trained to roll the ball,” said the lead author, Akshaye Bhambore of the University of Oulu. The team ran strict checks to rule out lucky accidents, play and trial and error. In some tests the flower was hidden from view while the bees pushed, and many still rolled the ball to exactly the right spot.",
        "Even the researchers were caught off guard by how suddenly it happened. “One moment the animal is exploring seemingly without direction, and the next it performs a highly efficient sequence of actions leading directly to the solution,” said Ece Nur Akmeşe of the University of Helsinki. “Watching the bees solving the task was genuinely fascinating.”",
        "The results, published in the journal Science, add to a growing pile of evidence that bees are cleverer than their pinhead-sized brains suggest. The team is careful not to overclaim. “We are not claiming that bees think like humans,” Loukola said, but the findings show small brains can come up with flexible answers to brand-new problems.",
        "“For over a century, spontaneous object-based problem-solving has mostly been studied in vertebrates,” he added. “Our study suggests insects may belong in that conversation too.”",
        "Köhler’s chimpanzees, one imagines, would have been happy to make room on the bench.",
      ],
      source: "ScienceDaily (University of Oulu)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/06/260625014755.htm",
      image: {
        file: "/editions/43/bumble-bees-roll-a-ball-to-reach-a-flower.jpg",
        alt: "A bumble bee with a small tag on its back stands on a white ball, reaching up to a blue artificial flower above it",
        credit: "Mikko Törmänen / University of Oulu",
        from: "https://www.sciencedaily.com/releases/2026/06/260625014755.htm",
      },
      sticker: "Big brain",
    },
    {
      slug: "norfolk-field-left-alone-fills-with-orchids",
      slot: "feature",
      section: "discoveries",
      kicker: "Wild patience",
      headline: "A family field left to its own devices fills with thousands of orchids",
      dek: "No seed packets, just a yearly hay cut: a Norfolk meadow shows how much nature can do when it is simply given time.",
      body: [
        "When the Sayer family stopped farming a soggy two-hectare field in Bodham, North Norfolk, after a last crop of oilseed rape in 2005, the usual advice was to sow it with wildflower seed. Carl Sayer, a professor at University College London, decided to wait instead.",
        "Apart from a traditional hay cut each year, the field was left alone. From 2011 to 2022, Sayer and his collaborator Pete Robinson surveyed every plant in it every two or three years. The number of species in each survey patch doubled, from about 10 to nearly 20, and locally rare plants moved in, including southern marsh orchids, yellow rattle and common centaury. Some may have hitched a ride on passing deer.",
        "“When the first orchids started appearing in our surveys, we were thrilled and now the meadow is unbelievably diverse, with thousands of orchids that delight locals in the village,” Sayer said. The study, in Restoration Ecology, asks whether meadow-makers should be “employing patience over seed packet more often”.",
        "The field belongs to his father, Derek, a co-author. It is, by all accounts, a very good listener.",
      ],
      source: "ScienceDaily (University College London)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/08/260822015208.htm",
      image: {
        file: "/editions/43/norfolk-field-left-alone-fills-with-orchids.jpg",
        alt: "Pink-purple spikes of wild orchids among tall grasses in a meadow at sunset, with trees on the horizon",
        credit: "Joanna Atherton",
        from: "https://www.sciencedaily.com/releases/2026/08/260822015208.htm",
      },
    },
    {
      slug: "taiwan-tree-seekers-tallest-tree-east-asia",
      slot: "feature",
      section: "discoveries",
      kicker: "Moon-hitters",
      headline: "Volunteers help tree hunters find East Asia’s tallest tree in Taiwan",
      dek: "Hundreds of people checking laser maps from home steered climbers to an 84-metre fir the Rukai people would call a moon-hitter.",
      body: [
        "Taiwan’s tallest trees have a lovely name among the Indigenous Rukai people: “the tree that hits the moon”. For more than a decade, a band of climbers, ecologists and mapping experts calling themselves the Taiwan tree seekers has been hunting for them.",
        "Searching some 950 million trees on foot proved hopeless, so the team turned to laser scans taken from aircraft. The software kept mistaking cliffs for giants: it got 93% of its trees wrong. From 2020, hundreds of Taiwanese volunteers pored over the scans and weeded out tens of thousands of false leads, producing a Giant Tree Map of 941 trees taller than 65 metres.",
        "The map’s best bet took a 20-kilometre river trek and two days of climbing to reach, over the Lunar New Year holiday in 2023. Climbers lowered a tape from its crown: 84.1 metres, the tallest known tree in East Asia. It is a Taiwania fir now called the Heaven Sword of the Da’an River.",
        "The team has since climbed ten Taiwanias over 70 metres. Mind the moon.",
      ],
      source: "ScienceDaily (Frontiers)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/08/260802223431.htm",
      image: {
        file: "/editions/43/taiwan-tree-seekers-tallest-tree-east-asia.jpg",
        alt: "A climber, small against the scale of it, ascends the moss-covered trunk of a giant tree in a misty Taiwanese forest",
        credit: "Steven Pearce",
        from: "https://www.sciencedaily.com/releases/2026/08/260802223431.htm",
      },
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "nigella-joins-bake-off-tent",
          kicker: "New judge",
          headline: "Nigella Lawson takes her seat in the Bake Off tent, and critics swoon",
          dek: "She admitted to nerves before her first episode; the reviews suggest she needn’t have worried.",
          body: [
            "The Great British Bake Off has a new judge, and she arrived blowing a kiss. Nigella Lawson joined Paul Hollywood at the judging table for the show’s 17th series, which opened on Channel 4 on Tuesday 22 September, taking the seat Prue Leith held for nine years.",
            "Before the episode aired, Lawson posted on Instagram: “I can’t pretend I’m not nervous about tonight but I’m excited, too.” She called it “a huge honour to be part of something as cherished (and rightly so) as Bake Off”.",
            "Cake Week handed the twelve new bakers a chocolate stout cake, a coffee and walnut technical and a self-portrait showstopper. Mo, a 21-year-old law student and the youngest in the tent, took Star Baker with a peanut and caramel chocolate stout cake. Gabe’s self-portrait hid a drag persona beneath a breakable mirror, which is more than most of us can manage with fondant.",
            "The critics approved. The Telegraph said she “brings glamour, intelligence and poise. And, of course, a hefty dollop of innuendo.” The Times called her the “icing on the cake”, and The Independent decided that by the end of her first day “she feels part of the fabric”.",
            "With Alison Hammond and Noel Fielding still hosting, the tent carries on every Tuesday at 8pm. Paul Hollywood’s handshake now has competition.",
          ],
          source: "HuffPost UK",
          sourceUrl:
            "https://www.huffingtonpost.co.uk/entry/great-british-bake-off-nigella-lawson-reviews_uk_6ab391e2e4b085277b54b9bb",
          image: {
            file: "/editions/43/nigella-joins-bake-off-tent.jpg",
            alt: "Nigella Lawson smiling and holding a chocolate cake topped with raspberries",
            credit: "Patch Dolan/Channel 4",
            from: "https://www.huffingtonpost.co.uk/entry/great-british-bake-off-nigella-lawson-reviews_uk_6ab391e2e4b085277b54b9bb",
          },
          sticker: "Star judge",
        },
        {
          slug: "van-ar-chy-found-in-sendai",
          slot: "feature",
          kicker: "Reel find",
          headline: "Lost 1919 comedy from New Hampshire turns up in a Japanese antique shop",
          dek: "A film student bought the reels while researching the word “anarchy”, and the film goes home for a screening on 1 November.",
          body: [
            "A silent comedy shot in New Hampshire in 1919 has turned up in an antique shop in Japan. Kohei Okita, a film student in Sendai, bought several old reels while researching early cinema linked to the word “anarchy”, and found a comedy starring a man he did not recognise.",
            "Some internet sleuthing put him in touch with John Tariot, an archivist of Billy B Van, the Broadway and vaudeville entertainer who ran a studio at Georges Mills and shot comedies around Lake Sunapee. Tariot identified the reel as Van-ar-chy, filmed in the towns of Newport and Sunapee.",
            "It is due to be shown on 1 November at the Newport Opera House, alongside Where Are Your Husbands?, another Van comedy rediscovered at the Library of Congress in 2017. “We aren’t just seeing where Billy B Van made movies,” Tariot said. “We’re seeing the world in which he made them.” The title pun has survived the journey intact.",
          ],
          source: "The Guardian",
          sourceUrl:
            "https://www.theguardian.com/film/2026/sep/28/century-old-silent-comedy-new-hampshire-found-japan",
          image: {
            file: "/editions/43/van-ar-chy-found-in-sendai.jpg",
            alt: "Black-and-white still from the 1919 silent comedy Van-ar-chy: a young man in a bow tie and hat between two bearded men by a wooden barn",
            credit: "Film Video Digital via YouTube / The Guardian",
            from: "https://www.theguardian.com/film/2026/sep/28/century-old-silent-comedy-new-hampshire-found-japan",
          },
        },
        {
          slug: "stevie-wonder-key-of-life-ep",
          slot: "brief",
          kicker: "Fresh keys",
          headline: "Stevie Wonder releases four unheard tracks from Songs in the Key of Life",
          dek: "He chose the outtakes himself, ahead of a tour playing the 1976 album in full.",
          body: [
            "Fifty years on from Songs in the Key of Life, Stevie Wonder has released Songs in the Key of Life: The EP, four tracks from the original sessions: It’s Easier, My Life Story of Love, I Can See the Sun in Late December and I’m Into Livin’.",
            "“We’ve lived with Songs in the Key of Life for fifty years, but there’s still more to hear,” he said.",
          ],
          source: "Euronews",
          sourceUrl:
            "https://www.euronews.com/2026/09/29/stevie-wonder-celebrates-50-years-of-songs-in-the-key-of-life-with-four-unreleased-songs",
        },
        {
          slug: "steve-reich-90-southbank-wander",
          slot: "brief",
          kicker: "Pulse check",
          headline:
            "Steve Reich’s 90th birthday concert lets the audience wander among the players",
          dek: "Paraorchestra swapped fixed seats for podiums, a dance floor and a spot of line dancing.",
          body: [
            "London’s Southbank Centre marked two birthdays at once: Steve Reich turns 90 on 3 October, and his Music for 18 Musicians turns 50 this year. Paraorchestra played it with musicians dotted on podiums around the Clore Ballroom, while dancers coaxed children and grandparents into a groove in the middle. Radiohead’s Jonny Greenwood followed in the Festival Hall with the London Sinfonietta. Minimalism, maximal grins.",
          ],
          source: "The Guardian",
          sourceUrl:
            "https://www.theguardian.com/music/2026/sep/28/paraorchestra-sinfonietta-greenwood-steve-reich-at-90-review-southbank-london",
        },
        {
          slug: "porthcawl-elvis-festival",
          slot: "brief",
          kicker: "All shook up",
          headline: "Porthcawl fills with Elvises again, including one who came from Australia",
          dek: "The Welsh seaside town hosts Europe’s largest gathering of Elvis fans every September.",
          body: [
            "Europe’s largest gathering of Elvis fans has taken over Porthcawl in south Wales again, with a Cadillac parked by the beach and Elvis flags across town. Maria Phillips, known as Platinum Elvis, came from Australia; she started impersonating him at the age of three. Paul Dumayne, a plumber for 50 years, was at his tenth festival. The King, as ever, has not left the building.",
          ],
          source: "The Guardian",
          sourceUrl:
            "https://www.theguardian.com/music/gallery/2026/sep/28/porthcawl-elvis-festival-in-pictures",
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "dressmaker-steam-hit",
          kicker: "Indie gem",
          headline: "Cosy sewing game Dressmaker stitches its way past Diablo 4 on Steam",
          dek: "Players are beading Van Gogh onto gowns, and the game’s programmer suspects he has peaked.",
          body: [
            "The biggest new thing on Steam this month comes with a tape measure. Dressmaker, a cosy sim about running a small boutique, launched on 21 September and a day later had climbed above Diablo 4 on Steam’s top-sellers chart.",
            "The pitch, in its own words, is to “choose fabric, cut out patterns, and sew them all together to satisfy (or sabotage!) townsfolk.” Made by Cozy Lives and published by Free Lives, the studio behind Broforce and Gorn, it sits at 98% positive reviews and hit a peak of 35,650 players at once on 27 September.",
            "Then the players got ambitious. Placing beads one at a time, they have stitched The Starry Night onto a gown, turned the Mona Lisa and Pokémon into dresses, and made a monarch butterfly frock, traditional Balkan wear and a suit of “dress armour”. Under one showpiece, a fan replied: “We aren’t even playing the same game.”",
            "Ruan Rothmann, the game’s programmer, took it well. “I used to be worried that I peaked way too early in my career. Now it seems I may have peaked with a dressmaking game,” he wrote, adding: “Dressmaker is awesome and I couldn’t be more proud.”",
            "The next update will hide the pins of other trims while you work on one. As for the studio’s next game, a fan asked for a horse game; Rothmann declined: “I dont trust horses or horse people sorry.”",
            "Measure twice, cut once, and budget an afternoon for the Mona Lisa.",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/simulation/i-couldnt-be-more-proud-with-98-percent-overwhelmingly-positive-steam-reviews-and-surging-player-numbers-indie-dev-says-it-seems-i-may-have-peaked-with-a-dressmaking-game/",
          image: {
            file: "/editions/43/dressmaker-steam-hit.jpg",
            alt: "An antique sewing machine surrounded by thread spools, a pincushion, scissors and a blue dress in Dressmaker",
            credit: "Cozy Lives / Free Lives via GamesRadar+",
            from: "https://www.gamesradar.com/games/simulation/new-steam-indie-hit-reaches-crucial-cozy-game-milestone-fans-wondering-if-theyre-even-playing-the-same-thing-as-geniuses-make-it-all-from-the-mona-lisa-to-pokemon-in-dress-form/",
          },
          sticker: "98% positive",
        },
        {
          slug: "gabe-newell-throat-singing",
          slot: "feature",
          kicker: "Office legends",
          headline:
            "Gabe Newell confirms his Mongolian throat-singing phase, and admits it was annoying",
          dek: "A fan emailed the Valve boss to check an old office story, and he wrote back with a candid self-review.",
          body: [
            "An old Valve office legend has been confirmed by the man at its centre. Last week Counter-Strike co-creator Minh “Gooseman” Le recalled that co-founder Gabe Newell spent about five months practising Mongolian throat singing around the office. “I remember a lot of people in the office, they were kind of annoyed with this,” Le said.",
            "A fan on Twitter, tbaszt, emailed Newell to check, and he replied. “I am entirely self taught and it shows,” he wrote, explaining that he worked through styles such as Sygyt and Kargyraa until he “got to the point where I was really… annoying.”",
            "He has not given it up, either. “Every once in a while, I’ll pick it back up,” he admitted, though “it takes a couple of weeks to condition my throat.”",
            "Colleagues may wish to check the calendar.",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/valve-boss-gabe-newell-admits-his-mongolian-throat-singing-phase-was-annoying-and-hes-apparently-not-very-good-at-it-either-i-am-entirely-self-taught-and-it-shows/",
          image: {
            file: "/editions/43/gabe-newell-throat-singing.jpg",
            alt: "Valve co-founder Gabe Newell, in glasses and a white shirt, seated at a table",
            credit: "GamesRadar+",
            from: "https://www.gamesradar.com/games/valve-boss-gabe-newell-admits-his-mongolian-throat-singing-phase-was-annoying-and-hes-apparently-not-very-good-at-it-either-i-am-entirely-self-taught-and-it-shows/",
          },
        },
        {
          slug: "yoshida-hair-removal-salon-simulator",
          slot: "brief",
          kicker: "Show picks",
          headline:
            "Shuhei Yoshida’s favourite Tokyo Game Show find is a hair-removal salon simulator",
          dek: "The tools include sticky tape, swords and a goat.",
          body: [
            "Former PlayStation executive Shuhei Yoshida has shared his Tokyo Game Show favourites, from Finding Polka to Sonic Pico Park, but saved his loudest praise for Hair Removal Salon Simulator, in which hairy customers are de-fuzzed with sticky tape, swords and a small goat. “It’s like Power Wash Simulator except you relentlessly remove hair from hairy men,” he said.",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/simulation/former-playstation-boss-shuhei-yoshidas-highlights-of-tokyo-game-show-include-sonics-new-indie-spinoff-and-a-game-about-removing-hair/",
        },
        {
          slug: "tcg-card-shop-simulator-1-0",
          slot: "brief",
          kicker: "Version 1.0",
          headline: "TCG Card Shop Simulator hits 1.0, and its pretend card game is now playable",
          dek: "The cards on the shelves finally do something.",
          body: [
            "After two years in early access and 4 million players, TCG Card Shop Simulator has reached version 1.0. Its in-house card brand, Tetramon, is no longer just stock on the shelves: it is now a real card game you can play, with nearly 2,000 new cards taking the total to 4,436. PS5, Switch and Switch 2 versions arrived too.",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/simulation/tcg-card-shop-simulator-finally-hits-1-0-on-steam-after-4-million-players-96-percent-positive-reviews-and-2-years-in-early-access/",
        },
        {
          slug: "tornekos-mystery-dungeon-english",
          slot: "brief",
          kicker: "Lost in translation",
          headline: "Dragon Quest’s Torneko finally gets an English release after 33 years",
          dek: "The roguelike that launched the Mystery Dungeon games arrives at last.",
          body: [
            "Torneko’s Mystery Dungeon, the Super Famicom roguelike that laid the blueprint for the whole Mystery Dungeon family, Pokémon’s included, is out in English for the first time in 33 years. The Classic HD version costs $25 on Switch, Switch 2, PS5, Xbox Series X|S and PC, and on Steam free extra content lets stream viewers set off “mysterious events”.",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/roguelike/after-33-years-japans-most-beloved-dragon-quest-spin-off-and-the-progenitor-of-the-entire-roguelike-mystery-dungeon-series-is-out-in-english-for-the-first-time/",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "eleven-year-old-puyo-puyo-asian-games-gold",
          kicker: "Esports",
          headline: "Primary school pupil, 11, wins Asian Games gold at Puyo Puyo",
          dek: "Yuki Kurihara beat a 24-year-old 10–2 in the final, then reviewed his medal like a jeweller.",
          body: [
            "Yuki Kurihara has school, cram school and, since Saturday, an Asian Games gold medal. The 11-year-old won the Puyo Puyo Champions event in Aichi-Nagoya, becoming the youngest athlete in host nation Japan’s Asian Games history.",
            "Puyo Puyo is a puzzle game in which players line up coloured blobs and pop them to clear their screen, and Kurihara pops them faster than grown-ups. He beat Thailand’s Tanarak Wongkitkun, 28, 10–1 in the semi-final, then dropped the first game of the final before sweeping past South Korea’s Kang Dongshin, 24, 10–2.",
            "He did not crack a smile when the winning blob fell, which he later explained with total honesty. “To be completely honest, I felt a bit embarrassed, so I couldn’t really show my expressions or change my face much,” he said. On the podium he managed a small bow and a small wave.",
            "His review of the prize was more expansive. “I’m really happy. The gold medal is really beautiful, shiny and heavy,” he said, before turning to the other important item: “Also, the plush toy is super cute, and it’s cool that it is gold-coloured too.”",
            "Kurihara started playing in his first year of primary school, earned his professional licence in April and now regularly beats adults. He admits the schedule takes juggling. “It’s hard having to balance it with school and cram school, but it’s really fun,” he said before the Games.",
            "Somewhere in Japan, a homework diary is about to get the most impressive “what I did at the weekend” entry of the term.",
          ],
          source: "Al Jazeera",
          sourceUrl:
            "https://www.aljazeera.com/sports/2026/9/26/yuki-kurihara-esports-gold-medal-japan-asian-games-2026-aichi-nagoya",
          image: {
            file: "/editions/43/eleven-year-old-puyo-puyo-asian-games-gold.jpg",
            alt: "Yuki Kurihara in a red Japan jacket, gold medal round his neck, holding up a signed Japanese flag",
            credit: "Toru Hanai / Getty Images",
            from: "https://www.aljazeera.com/sports/2026/9/26/yuki-kurihara-esports-gold-medal-japan-asian-games-2026-aichi-nagoya",
          },
          sticker: "Gold!",
        },
        {
          slug: "gravy-wrestling-moves-to-the-cricket-club",
          slot: "feature",
          kicker: "Gravy wrestling",
          headline: "World Gravy Wrestling outgrows its pub lawn and moves to the cricket club",
          dek: "Roughly 1,500 litres of gravy, one slippery referee and a potato in the line-up.",
          body: [
            "The World Gravy Wrestling Championships have outgrown their pub lawn. For its 18th year the contest moved to Bacup Cricket Club in Lancashire, where hundreds watched costumed wrestlers slither through two-minute bouts in roughly 1,500 litres of gravy, with a fresh dousing waiting at the final whistle.",
            "The line-up included Spider-Man, Miss Trunchbull, Bisto the Clown, a sausage roll and a potato. The aim is the biggest splash rather than any harm, and the referee skidded out of the ring more than once. A panel of former contestants did the judging.",
            "Granny Granules drove three and a half hours from Milton Keynes for her sixth go. Betty Bisto, runner-up last year, gave the verdict of a true connoisseur: “The gravy is surprisingly warm, it’s not as gravy-y as you’d expect. It’s a lot more watery. Last year was actually nicer and tasted better.”",
            "It all started in 2007 in a supermarket car park in Wigan. The gravy has been going up in the world ever since.",
          ],
          source: "Manchester Evening News",
          sourceUrl:
            "https://www.manchestereveningnews.co.uk/whats-on/whats-on-news/i-drove-three-half-hours-34547002",
          image: {
            file: "/editions/43/gravy-wrestling-moves-to-the-cricket-club.jpg",
            alt: "A wrestler in a red costume flips backwards into the gravy ring as a referee and a crowd watch, with green hills behind",
            credit: "Kenny Brown / Manchester Evening News",
            from: "https://www.manchestereveningnews.co.uk/whats-on/whats-on-news/i-drove-three-half-hours-34547002",
          },
        },
        {
          slug: "myanmar-wins-first-teqball-gold",
          slot: "brief",
          kicker: "Teqball",
          headline: "Myanmar wins the first ever Asian Games teqball gold as Puyol watches",
          dek: "Football, table tennis and a curved table walk into the Asian Games.",
          body: [
            "Myanmar’s Wai Khin Hnin became the first Asian Games teqball champion, coming from a set down to beat Indonesia’s Sumaya 2–1 as Barcelona great Carles Puyol watched. Teqball, invented in a Hungarian garage 14 years ago, is football played over a curved table. Japan’s entrant, 40-year-old comedian Takahiro Nodomi, said he had released some “old guy power”.",
          ],
          source: "AFP",
          sourceUrl:
            "https://www.msn.com/en-us/sports/general/myanmar-win-first-asian-games-teqball-gold-as-spain-great-puyol-watches/ar-AA2cBtEu",
        },
        {
          slug: "lawn-mower-racing-blades-off",
          slot: "brief",
          kicker: "Motorsport",
          headline: "Lawn mower racers keep the engines and ditch the blades",
          dek: "Built from whatever is at the bottom of the garden.",
          body: [
            "Lawn mower racing was dreamt up in a West Sussex pub in 1973. It has kept one rule sacred ever since: the blades come off. Photographer Harry George Hall visited a British Championships round in Braintree, Essex. Callum McIntyre of the British Lawn Mower Racing Association said the sport aims to be “the last outpost of non-chequebook racing”.",
          ],
          source: "BBC News",
          sourceUrl: "https://www.bbc.co.uk/news/articles/c39ep822217o",
        },
        {
          slug: "lacroix-hole-in-one-wins-bmw",
          slot: "brief",
          kicker: "Golf",
          headline: "Frédéric Lacroix’s first DP World Tour ace drives off with a BMW",
          dek: "One swing of a 7-iron, one electric car.",
          body: [
            "Frédéric Lacroix picked a good moment for the first hole-in-one of his DP World Tour career. The Frenchman aced Wentworth’s 149-metre 14th with a 7-iron at the BMW PGA Championship and won the car on offer, a new all-electric BMW iX5. J.J. Spaun won the tournament; Lacroix won the drive home.",
          ],
          source: "BimmerToday",
          sourceUrl:
            "https://www.bimmertoday.de/2026/09/20/hole-in-one-frederic-lacroix-gewinnt-mit-perfektem-schlag-neuen-bmw-ix5/",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "flip-dot-fluid-display",
          kicker: "Mechanical pixels",
          headline: "Engineer pours a simulated liquid across thousands of clattering flip dots",
          dek: "Built for the Electromagnetic Field festival, the display sloshes audibly as visitors steer gravity with a joystick, and the pun came first.",
          body: [
            "Flip-dot displays, the little discs that click from black to yellow on old bus signs, make a noise every time they change. The engineer known as mitxela realised that made them ideal for showing water: a fluid simulation that actually sounds as if it is sloshing.",
            "There was a second reason. The simulation method he uses is called FLIP, short for Fluid Implicit Particle. “Yes, the primary motivation behind doing this was the wordplay,” he wrote.",
            "New flip-dot displays are very expensive, so the dots came from a donated heap at the obsolete-technology museum run by Sam, better known as Look Mum No Computer. Mitxela designed his own driver boards so the panels could be tiled and refreshed quickly. He then prepared eight panels, each 13 dots by 28, with about 400 joints to solder on every one. A fast STM32 chip runs the physics.",
            "The finished display stood in the festival’s lounge tent in England. Visitors used a joystick to choose which way gravity pointed and watched the yellow liquid pour. It ran for all four days without a fault, and the joystick got so much use that it wore a grimy patch.",
            "Next he hopes to adapt the design for the rest of the donated panels, which come in other sizes, and recruit volunteers for the soldering. “The length of this writeup conveys only a fraction of the tedium in all that soldering,” he noted.",
            "Every splash comes with its own percussion section.",
          ],
          source: "mitxela.com",
          sourceUrl: "https://mitxela.com/projects/flipflip",
          image: {
            file: "/editions/43/flip-dot-fluid-display.jpg",
            alt: "A large flip-dot panel labelled ‘FLIP Fluid on Flip Dots’ showing yellow dots splashing like liquid, with a hand on a joystick beside it",
            credit: "mitxela",
            from: "https://mitxela.com/projects/flipflip",
          },
          sticker: "Splash!",
        },
        {
          slug: "student-solar-cars-cross-country",
          slot: "feature",
          kicker: "Sun racers",
          headline: "Student solar cars cross 1,500 miles of America, and two finish minutes apart",
          dek: "Belgium’s KU Leuven beat TU Delft by under four minutes after more than 62 hours on the road.",
          body: [
            "Fourteen student-built cars powered only by sunshine rolled into Amarillo, Texas, in early August to finish the 2026 Electrek American Solar Challenge. The route ran south from the Minneapolis area and followed stretches of historic Route 66.",
            "In the single-seater class, KU Leuven of Belgium covered 2,671.2 official miles in 62 hours, 7 minutes and 2 seconds. TU Delft of the Netherlands matched its 43.4mph average and crossed less than four minutes behind, with penalties deciding the gap.",
            "The multi-passenger class is scored on distance, energy efficiency and practicality. Appalachian State University won it with 92.7 points, even though Polytechnique Montréal drove further. Organiser Gail Lueck called it “a record setting year for the event.”",
            "Not bad for cars whose fuel tank is the sky.",
          ],
          source: "American Solar Challenge",
          sourceUrl:
            "http://www.americansolarchallenge.org/news/2026/08/appalachian-state-and-ku-leuven-win-2026-electrek-american-solar-challenge-as-student-solar-cars-complete-cross-country-journey/",
          image: {
            file: "/editions/43/student-solar-cars-cross-country.jpg",
            alt: "Appalachian State University’s solar car crosses the finish line under a Route 66 arch as team members cheer",
            credit: "American Solar Challenge, IEF",
            from: "https://www.pv-magazine.com/2026/08/07/students-steer-solar-powered-racing-cars-to-glory-in-american-solar-challenge/",
          },
        },
        {
          slug: "pocket-pico-packet-radio",
          slot: "brief",
          kicker: "On the air",
          headline: "Raspberry Pi Pico brings a 1980s pocket radio modem back on the air",
          dek: "It runs the original box’s own firmware on an emulated Z80.",
          body: [
            "Radio hobbyist btech has recreated the Heathkit HK-21 Pocket Packet, a late-1980s box for sending data over amateur radio. His Pocket Pico runs the original firmware on a Z80 processor emulated inside a Raspberry Pi Pico. The Pico also generates the 1200-baud audio tones itself, so old packet-radio software works with it, and it even includes a mini bulletin board where other stations can leave messages.",
          ],
          source: "Hackaday",
          sourceUrl:
            "https://hackaday.com/2026/09/25/pi-pico-recreates-the-heathkit-pocket-packet/",
        },
        {
          slug: "cern-colibri-fpga-library",
          slot: "brief",
          kicker: "Open hardware",
          headline: "CERN gives away colibri, a free toolbox of over 100 chip-design parts",
          dek: "The particle-physics lab built it in house so it would never be tied to one supplier.",
          body: [
            "CERN has open-sourced colibri, a library of more than 100 VHDL components, functions and procedures for programming FPGA chips, under the CERN Open Hardware Licence. Built to speed up the lab’s own gateway devices, it works with chips from any maker, comes with self-checking tests and covers everyday protocols such as SPI and I2C. It is free to download from GitLab.",
          ],
          source: "Hackaday",
          sourceUrl:
            "https://hackaday.com/2026/09/24/fpga-for-all-cern-releases-colibri-vhdl-library/",
        },
        {
          slug: "kite-powered-island-cinema",
          slot: "brief",
          kicker: "Clever engineering",
          headline: "An island’s monthly cinema night now runs on a kite flying 200 metres up",
          dek: "The projectionist spends each film outside, watching the kite.",
          body: [
            "On Inishcarrow, the island school’s physics class built a 12-square-metre kite wing that pulls on a winch and spins a generator. On a breezy evening it powers the projector, the speakers and the popcorn machine in the old net loft. Projectionist Colm Ó Briain keeps watch outside with a torch. “People tell me the endings in the pub,” he said.",
          ],
          source: "Open Tech Digest (sample)",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "patek-philippe-jewellery-box-watch",
          kicker: "Time well kept",
          headline: "Watch from a Cornish jewellery box ticks its way to £59,000",
          dek: "Estimated at up to £10,000, the 1930s Patek Philippe drew bidders from New York, Japan and China.",
          body: [
            "For years, a small steel wristwatch sat among the necklaces in a family jewellery box in Camborne, Cornwall. Its owner always said she had a valuable watch, and even mentioned an expensive timepiece in her 2011 diary. On 25 August, a saleroom full of bidders agreed with her, loudly.",
            "It is a Patek Philippe Calatrava Reference 448 from around the 1930s, 28mm across and cased in stainless steel. That last detail makes collectors sit up, because the Swiss maker produced very few steel watches at the time. It came down the family from the vendor’s grandfather, a solicitor’s clerk in Bodmin, though relatives now wonder whether his wife, who loved designer clothes and luxury things, bought it for him as a gift.",
            "Darren Ashley, senior valuer at Hansons Cornwall, was taken by more than its rarity. “This was a watch dating back around 90 years which had spent decades within the same Cornish family and, when it was placed in my hands, it was still finely ticking away,” he said.",
            "Hansons entered it in its August sale at £5,000 to £10,000, and interest arrived from America, Japan, China, Saudi Arabia and the UK. A New York collector stayed in until about £52,000, leaving an internet bidder in Japan to duel a telephone bidder in China. China won, at a hammer price of £59,000, almost six times the top estimate.",
            "Three family members watched from the saleroom while others followed live on laptops and phones at work, keeping a closer eye on the time than usual. The watch is now heading to a new home in Hong Kong.",
          ],
          source: "Hansons Auctioneers",
          sourceUrl:
            "https://hansonsauctioneers.co.uk/jewellery-box-watch-valued-at-5000-10000-sparks-global-bidding-battle-to-sell-for-59000/",
          image: {
            file: "/editions/43/patek-philippe-jewellery-box-watch.jpg",
            alt: "Three views of the 1930s Patek Philippe Calatrava: its cream dial, its gold-toned movement, and the watch on a black leather strap held in an open hand",
            credit: "Hansons Auctioneers",
            from: "https://hansonsauctioneers.co.uk/jewellery-box-watch-valued-at-5000-10000-sparks-global-bidding-battle-to-sell-for-59000/",
          },
          sticker: "Tick tock",
        },
        {
          slug: "jurassic-park-mosquito-prop",
          slot: "feature",
          kicker: "Spared no expense",
          headline: "Jurassic Park’s amber mosquito prop sells for $403,200, double its estimate",
          dek: "Propstore proved it was the very one from the film’s close-up by matching the bubbles in the resin.",
          body: [
            "The tiny bug that started the whole dinosaur business has fetched a sum fit for a T. rex. The mosquito-in-amber prop from the opening of Steven Spielberg’s 1993 film Jurassic Park sold for $403,200, including buyer’s premium, at Propstore’s summer memorabilia auction in Los Angeles on 26 August. It was estimated at $100,000 to $200,000 and had never been offered at public auction before.",
            "The 4-by-6-inch prop is resin painted to look like amber set in stone. Propstore matched it to the on-screen close-up using its bubbles, the angle of the mosquito and the line where amber meets rock. Elsewhere in the four-day sale, Doc Brown’s OUTATIME number plate from Back to the Future reached $69,300 and a Golden Snitch from Harry Potter fluttered to $63,000.",
            "The park’s founder did say to spare no expense.",
          ],
          source: "Antique Trader",
          sourceUrl: "https://www.antiquetrader.com/a-403200-bite-of-jurassic-park-history",
          image: {
            file: "/editions/43/jurassic-park-mosquito-prop.jpg",
            alt: "The Jurassic Park prop: a craggy lump of painted resin ‘stone’ with a window of yellow amber holding a small mosquito",
            credit: "Propstore Auction, via Antique Trader",
            from: "https://www.antiquetrader.com/a-403200-bite-of-jurassic-park-history",
          },
        },
        {
          slug: "richard-e-grant-oxfam-coat",
          slot: "brief",
          kicker: "Charity shop chic",
          headline: "Richard E Grant credits a secondhand Oxfam coat with his big break",
          dek: "He wore it, soaking wet, to his 1986 audition for ‘Withnail & I’.",
          body: [
            "Richard E Grant is fronting Oxfam’s Second Hand September this year, and his credentials are impeccable. “My life-changing career break happened because I was wearing a second hand coat I bought in an Oxfam shop,” he said. It was a pre-loved Burberry trench, worn to his rain-soaked 1986 audition for Withnail & I. Oxfam has more than 500 shops, should anyone else fancy their chances.",
          ],
          source: "Positive News",
          sourceUrl:
            "https://www.positive.news/society/richard-e-grant-fronts-second-hand-september-as-britons-try-to-buy-fewer-clothes/",
        },
        {
          slug: "corticeira-amorim-cork",
          slot: "brief",
          kicker: "Pop goes the cork",
          headline: "A 150-year-old cork company now makes parts for spacecraft",
          dek: "Portugal’s Corticeira Amorim turns tree bark into ship decks, football pitches and heat shields.",
          body: [
            "Portugal’s Corticeira Amorim has been in the cork business for 150 years, and its bark now travels a long way. Its 4,000 staff make about 30 cork-based products, including ship decking, 3D-printer filament and a heat shield for the European Space Agency’s IXV re-entry vehicle. Real Madrid trains on pitches filled with its cork, and each cork oak can be stripped nine times in its life.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/portuguese-company-turns-cork-wood-into-limitless-material-even-to-insulate-spacecraft/",
        },
        {
          slug: "knitting-circle-minibus",
          slot: "brief",
          kicker: "Purl of wisdom",
          headline:
            "Knitting circle’s scarf stall saves up long enough to buy the village a minibus",
          dek: "It took 25 winters, about 9,000 scarves and one unchanging price.",
          body: [
            "The Tuesday Knitters of Glenrossie have sold hand-knitted scarves at the winter market since 2001, at a price that has never gone up, and banked every penny in an account labelled ‘Minibus’. This month they handed over the keys to a 16-seat bus for the village football team, walking group and choir. They offered to knit it a cover; the garage advised against it.",
          ],
          source: "Village Post (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "seattle-inconvenience-store",
          kicker: "Aisle be back",
          headline: "Seattle’s new corner shop sells pre-tangled cables, and that’s the point",
          dek: "Artists have turned a former 7-Eleven into the Inconvenience Store, where every item is handmade, deliberately impractical and for sale.",
          body: [
            "Most corner shops promise to save you time. The one at Third Avenue and Pine Street in downtown Seattle would rather waste it beautifully. Its shelves hold a USB cord that comes already tangled, shoulder bags made from Cheetos and Lays wrappers, and candles that double as yardsticks, at least until you light them.",
            "This is the Inconvenience Store, a pop-up gallery in a building that used to house a 7-Eleven. It is the work of artists Lilia Deering and Mary Anne Carter, whose last project was STÖR, a 2024 spoof of IKEA. More than 70 mostly local artists made the stock, spread across 14 departments from pantry to office supplies, plus one called “everyday inconveniences” for things like mugs with holes in them.",
            "The layout plays it straight. There is a hot bar of imitation hot dogs and pizza slices, a sound-sculpture ATM, a coin machine that dispenses prints and stickers, and a walk-in fridge that has become a small, not at all chilly, gallery.",
            "Everything has a clear price tag, from $1 to $10,000, because Deering wants buying art to feel approachable. “Sometimes white-wall galleries can feel really intimidating to people,” she told The Seattle Times.",
            "Carter is proud of how slow it all is. “Artists take painstaking measures to make things by hand,” she said. “It’s not the most efficient process. It’s certainly not the cheapest, but it makes something truly special.”",
            "The store officially opened on 19 September and is due to stay until mid-2027. Plenty of time, then, to untangle your purchase.",
          ],
          source: "The Seattle Times",
          sourceUrl:
            "https://www.seattletimes.com/entertainment/visual-arts/old-7-eleven-in-downtown-seattle-becomes-inconvenience-store-exhibit/",
          image: {
            file: "/editions/43/seattle-inconvenience-store.jpg",
            alt: "Two visitors browse Inconvenience Store tote bags with smiley faces hanging on a pink pegboard wall",
            credit: "The Seattle Times",
            from: "https://www.seattletimes.com/entertainment/visual-arts/old-7-eleven-in-downtown-seattle-becomes-inconvenience-store-exhibit/",
          },
          sticker: "Open late-ish",
        },
        {
          slug: "accidental-rhymes-billboard",
          slot: "feature",
          kicker: "Found poetry",
          headline:
            "Poet’s inbox of 9,000 accidental rhymes becomes a daily line on a station billboard",
          dek: "Recent favourite: “I’ll grab a pear and meet you there.”",
          body: [
            "Last year the poet Salome Nwachukwu noticed she had rhymed while ordering lunch (“the brie on rye for me, and a tea”) and asked online whether anyone else did this. She included an email address. Her inbox has since received more than 9,000 accidental rhymes, each one said out loud, in real life, without meaning to.",
            "Every morning she picks one for a digital billboard above the ticket barriers at Carrow Street station, where about 30,000 commuters pass beneath it. Recent choices include “I’ll grab a pear and meet you there” and, from a nine-year-old, “I’m not a snake, I’m just awake”.",
            "“It turns out people are writing poetry all day by accident,” said Nwachukwu, “mostly in queues.” Station staff say commuters now stop under the board and try to rhyme back.",
          ],
          source: "Around the Web (sample)",
          photo: "microphone",
        },
        {
          slug: "jigsaw-by-post",
          slot: "brief",
          kicker: "Puzzles",
          headline: "A 1,000-piece jigsaw finishes after travelling between 400 strangers by post",
          dek: "Each member added a few pieces and a line in a notebook, then posted the box on.",
          body: [
            "The puzzle, a painting of an old harbour, left Lucia Ferrante’s kitchen in Vallombra two years ago in a flat box with a notebook. Every member of her online jigsaw club placed a few pieces, wrote a line and posted it on. It reached its 41st country last month, and the final piece went in on Sunday, back in the same kitchen.",
          ],
          source: "Around the Web (sample)",
        },
        {
          slug: "garden-wildlife-documentary",
          slot: "brief",
          kicker: "Video",
          headline: "Retired teacher narrates her garden like a wildlife documentary, in a whisper",
          dek: "Her most-watched episode follows a snail across a patio for four hours.",
          body: [
            "Winifred Castellane, 79, films her back garden in Tully Bridge and narrates in a hushed, dramatic whisper. Episodes cover the robin’s daily inspection of the bird table, a long-running dispute between two blackbirds over one worm and, most popular of all, the snail. Her grandson edits; she allows no music, only “the sound of nature, and me”.",
          ],
          source: "Around the Web (sample)",
        },
        {
          slug: "burlington-sheep-school-visit",
          slot: "brief",
          kicker: "Flock to school",
          headline: "Escaped sheep drop by Burlington’s new high school for an early tour",
          dek: "The school district took the visit as a compliment.",
          body: [
            "A group of sheep slipped out of their enclosure at a nearby Episcopal Diocese property in Burlington, Vermont, and wandered onto the grounds of the new Burlington High School and Burlington Technical Center. Staff rounded them up and took them home.",
            "“It seems EVERYONE wants to get a look at the new Burlington High School and Burlington Technical Center,” the school district posted.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/23/Burlington-High-School-sheep-Vermont/2081790176220/",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "84.1",
        caption:
          "metres from roots to crown: Taiwan’s ‘Heaven Sword of the Da’an River’, the tallest known tree in East Asia",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Bright, with a cheerful front",
        detail:
          "Bees rolling in from the east by mid-morning. Scattered flip-dot showers, audible from some distance. Orchids opening across Norfolk and a light breeze of throat singing around the office.",
      },
    },
    {
      type: "correction",
      content: {
        text: "Yesterday we said a Gloucester cucumber grew to 7.6 metres. It reached 7.598 metres. We regret the rounding and apologise to the missing two millimetres.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Sticky tape, one sword, one small goat. For a salon. Please do not ask what kind.",
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
          "PIP: Did you hear bees can use tools now?",
          "PIGEON: I can use tools.",
          "PIP: Name one.",
          "PIGEON: The bench.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. See you tomorrow." } },
  ],

  puzzles: [
    mini(
      [
        ["TUNES", "What a seaside brass band plays"],
        ["SCONE", "Jam first or cream first?"],
        ["YACHT", "A boat that's fancier than a dinghy"],
      ],
      [
        ["TASTY", "How a peanut and caramel stout cake turns out, ideally"],
        ["SWEET", "Like this paper, and like most puddings"],
      ],
    ),
    ladder(["LEAD", "LOAD", "GOAD", "GOLD"]),
    riddle("What runs but never walks, and has a mouth but never talks?", "A river"),
  ],
};
