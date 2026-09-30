// Issue 43, Thursday 1 October 2026. Scheduled: it exists, but is not served until it is published.
// Real good-news stories, rewritten in the paper's own voice, each with its source article; images
// fetched with apps/frontend/scripts/fetch_image.py.
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
            "New flip-dot displays are very expensive, so the dots came from a donated heap at the obsolete-technology museum run by Sam, better known as Look Mum No Computer. Mitxela designed his own driver boards so the panels could be tiled and refreshed quickly. He then prepared eight panels, each 13 dots by 28, with about 400 joints to solder on every one. A fast STM32 chip runs the physics. Altogether the display has 2,912 dots, and the whole installation cost under £500.",
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
            "Fourteen student-built cars powered only by sunshine rolled into Amarillo, Texas, on 5 August to finish the 2026 Electrek American Solar Challenge. Eighteen had set off, and the 1,547-mile route crossed eight states. The route ran south from the Minneapolis area and followed stretches of historic Route 66.",
            "In the single-seater class, KU Leuven of Belgium covered 2,671.2 official miles in 62 hours, 7 minutes and 2 seconds. TU Delft of the Netherlands matched its 43.4mph average and crossed less than four minutes behind, with penalties deciding the gap.",
            "The multi-passenger class is scored on distance, energy efficiency and practicality. Appalachian State University won it with 92.7 points, even though Polytechnique Montréal drove further and took second on 88.8, ahead of Georgia Tech. Organiser Gail Lueck called it “a record setting year for the event.”",
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
          image: {
            file: "/editions/43/cern-colibri-fpga-library.jpg",
            alt: "The Colibri library's logo over a circuit board",
            credit: "Hackaday",
            from: "https://hackaday.com/2026/09/24/fpga-for-all-cern-releases-colibri-vhdl-library/",
          },
        },
      ],
    },
    {
      section: "startups",
      stories: [
        {
          slug: "space-king-kickstarter-millions",
          kicker: "Crowdfunding",
          headline:
            "An animation studio asks Kickstarter for $50,000 and gets more than $3 million",
          dek: "Flashgitz turned its cartoon Space King into a board game, and backers poured in more than $2 million on the first day.",
          body: [
            "Most crowdfunding campaigns spend their first day nervously refreshing the page. Space King: The Board Game spent its first day raising 40 times its target. The Kickstarter from Flashgitz, an independent animation studio, asked for $50,000 when it launched on 30 August, the same day the studio released the fifth Space King cartoon.",
            "Flashgitz is the work of Tom Hinchliffe and Don Greger, an English-American pair who met through the animation website Newgrounds. Their YouTube channel, known for gleefully cheeky parodies of games, films and internet culture, has more than 5 million subscribers, and a good number of them turned out to own a wallet.",
            "The game is for two to four players, who control Psycho Warriors fighting aliens while quietly undermining one another, which makes it semi-cooperative. It comes with big PVC miniatures: the warriors stand about 50mm tall and the bosses top 100mm. The campaign passed $2 million in under 24 hours, some 40 times its goal.",
            "The pledge levels went well beyond the $99 base game. At $699 came a metal box and a medal signed by the creators; at $1,999, a custom audio message. The top tier, called Globulus Maximus, cost $7,777 and promised an appearance in a future Space King episode. All 15 places sold out. More than 5,500 backers chose the $299 Psycho Warrior tier, which adds two expansions and a lore book.",
            "Before long it had passed $3 million from around 8,000 backers, who pledged just over $375 each on average, far more than the price of the base game.",
            "Somewhere, a very small plastic warrior is preparing for a very large shelf.",
          ],
          source: "Tabletop Sentinel",
          sourceUrl:
            "https://www.tabletopsentinel.com/news/scifi/from-warhammer-parody-to-3-million-phenomenon",
          image: {
            file: "/editions/43/space-king-kickstarter-millions.jpg",
            alt: "The box for Space King: The Board Game, showing armoured warriors in battle, set against a smoky backdrop",
            credit: "Flashgitz via Tabletop Sentinel",
            from: "https://www.tabletopsentinel.com/news/scifi/from-warhammer-parody-to-3-million-phenomenon",
          },
          sticker: "40x",
        },
        {
          slug: "livia-student-startup-award",
          slot: "feature",
          kicker: "Young founders",
          headline:
            "Cypriot students’ crop-watching drone startup is crowned Europe’s innovation of the year",
          dek: "LIVIA went from a school-style company competition in April to the top prize at Europe’s largest entrepreneurship festival.",
          body: [
            "A team of students from Cyprus has flown home from Riga with the biggest prize at Gen-E 2026, Europe’s largest entrepreneurship festival. Their startup, LIVIA, was named European Innovation of the Year and also picked up the FedEx Access Signature Award.",
            "LIVIA helps farmers look after their fields from above, combining AI, autonomous drones, satellite pictures and Earth observation data to track crop health and irrigation needs and keep costs down. The team is Christos Charalambous, the chief executive; Theofanis Orfanou, the technology chief; Ariadni Pashouli, who leads on biology; and Antreas Leonidou, who handles machine learning.",
            "They qualified by winning JA Cyprus Company of the Year in April. Charalambous said the difference was “our ability to move beyond just having an idea”. JA Cyprus chief executive Antigoni Komodiki said the win showed young people from the island can “compete and lead at the highest European level”.",
          ],
          source: "Cyprus Mail",
          sourceUrl:
            "https://cyprus-mail.com/2026/07/14/cypriot-student-startup-wins-european-innovation-award",
          image: {
            file: "/editions/43/livia-student-startup-award.jpg",
            alt: "The LIVIA team on stage at Gen-E 2026 holding a Cyprus flag and a first-place certificate",
            credit: "Cyprus Mail",
            from: "https://cyprus-mail.com/2026/07/14/cypriot-student-startup-wins-european-innovation-award",
          },
        },
        {
          slug: "lofi-cities-pixel-music",
          slot: "brief",
          kicker: "Fresh launch",
          headline: "Lofi Cities plays fresh background music composed live inside your browser",
          dek: "Sixteen pixel-art cities, nine music styles and no account needed.",
          body: [
            "Maker Safa Elmali has launched Lofi Cities on Product Hunt: animated pixel-art cityscapes with lofi music that is composed as you listen, not played from recordings. “The Web Audio API synthesizes the instruments as you listen,” he explained. There are 16 cities, nine music styles, weather effects, focus and sleep timers, and shared lanterns to release with other visitors. It is free and keeps working offline.",
          ],
          source: "Product Hunt",
          sourceUrl: "https://www.producthunt.com/products/lofi-cities",
          image: {
            file: "/editions/43/lofi-cities-pixel-music.jpg",
            alt: "A pixel-art Munich Christmas market at night in the snow, with the Lofi Cities music controls along the bottom",
            credit: "Safa Elmali / Lofi Cities",
            from: "https://www.producthunt.com/products/lofi-cities",
          },
        },
      ],
    },
    {
      section: "screen",
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
            "The critics approved. The Telegraph said she “brings glamour, intelligence and poise. And, of course, a hefty dollop of innuendo.” The Times called her the “icing on the cake”, and The Independent decided that by the end of her first day “she feels part of the fabric”. Metro gave the episode four stars for “the obvious fit with everything Bake Off stands for”, while The Guardian gave it five and found her “a much quieter, more soothing presence”.",
            "With Alison Hammond and Noel Fielding still hosting, the tent carries on every Tuesday at 8pm. Paul Hollywood’s famous handshake now has serious competition.",
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
          more: [
            {
              file: "/editions/43/nigella-joins-bake-off-tent-2.jpg",
              alt: "Nigella Lawson with her new co-stars and the bakers on the first day in the tent",
              credit: "HuffPost UK",
              from: "https://www.huffingtonpost.co.uk/entry/great-british-bake-off-nigella-lawson-reviews_uk_6ab391e2e4b085277b54b9bb",
            },
          ],
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
          image: {
            file: "/editions/43/richard-e-grant-oxfam-coat.jpg",
            alt: "Richard E. Grant in a yellow waistcoat holding books",
            credit: "Positive News",
            from: "https://www.positive.news/society/richard-e-grant-fronts-second-hand-september-as-britons-try-to-buy-fewer-clothes/",
          },
        },
      ],
    },
    {
      section: "play",
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
            "Measure twice, cut once, and budget a whole afternoon for the Mona Lisa and her smile.",
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
          more: [
            {
              file: "/editions/43/dressmaker-steam-hit-2.jpg",
              alt: "An enormous blue ball gown fills the frame in Dressmaker’s painted style",
              credit: "GamesRadar+",
              from: "https://www.gamesradar.com/games/simulation/new-steam-indie-hit-reaches-crucial-cozy-game-milestone-fans-wondering-if-theyre-even-playing-the-same-thing-as-geniuses-make-it-all-from-the-mona-lisa-to-pokemon-in-dress-form/",
            },
            {
              file: "/editions/43/dressmaker-steam-hit-3.jpg",
              alt: "A pink gown on a mannequin at the foot of a grand double staircase",
              credit: "GamesRadar+",
              from: "https://www.gamesradar.com/games/simulation/new-steam-indie-hit-reaches-crucial-cozy-game-milestone-fans-wondering-if-theyre-even-playing-the-same-thing-as-geniuses-make-it-all-from-the-mona-lisa-to-pokemon-in-dress-form/",
            },
          ],
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
          more: [
            {
              file: "/editions/43/gabe-newell-throat-singing-2.jpg",
              alt: "Gabe Newell leans back in a pink shirt, grinning",
              credit: "GamesRadar+",
              from: "https://www.gamesradar.com/games/valve-boss-gabe-newell-admits-his-mongolian-throat-singing-phase-was-annoying-and-hes-apparently-not-very-good-at-it-either-i-am-entirely-self-taught-and-it-shows/",
            },
          ],
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
          image: {
            file: "/editions/43/yoshida-hair-removal-salon-simulator.jpg",
            alt: "A laser at work on a customer's face in the salon simulator",
            credit: "GamesRadar+",
            from: "https://www.gamesradar.com/games/simulation/former-playstation-boss-shuhei-yoshidas-highlights-of-tokyo-game-show-include-sonics-new-indie-spinoff-and-a-game-about-removing-hair/",
          },
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
          image: {
            file: "/editions/43/tcg-card-shop-simulator-1-0.jpg",
            alt: "The shopkeeper throws his arms up among the card shop's shelves",
            credit: "GamesRadar+",
            from: "https://www.gamesradar.com/games/simulation/tcg-card-shop-simulator-finally-hits-1-0-on-steam-after-4-million-players-96-percent-positive-reviews-and-2-years-in-early-access/",
          },
        },
      ],
    },
    {
      section: "music",
      stories: [
        {
          slug: "stevie-wonder-key-of-life-ep",
          kicker: "Fresh keys",
          headline: "Stevie Wonder releases four unheard tracks from Songs in the Key of Life",
          dek: "He chose the outtakes himself, ahead of a tour playing the 1976 album in full.",
          body: [
            "Fifty years after Songs in the Key of Life, Stevie Wonder has opened the vault. Songs in the Key of Life: The EP collects four tracks from the original sessions that never made it onto the 1976 double album: It’s Easier, My Life Story of Love, I Can See the Sun in Late December and I’m Into Livin’. All four are out now.",
            "“We’ve lived with Songs in the Key of Life for fifty years, but there’s still more to hear,” he said. “We didn’t add these songs to the album, but they were part of what I was feeling and discovering as we made it.”",
            "Wonder wrote and produced all four. My Life Story of Love shares a writing credit with Susaye Greene, formerly of the Supremes, and I’m Into Livin’ has background vocals from Shirley Brewer, Thelma Houston and Deniece Williams. Engineers from the original sessions, John Fischbach among them, came back to remix the tracks for release.",
            "The album they belong with hardly needs an introduction. It gave the world Sir Duke, As and I Wish, won Wonder his third Grammy for Album of the Year and sits in the US Library of Congress’s National Recording Registry.",
            "It is also going back on the road. Wonder’s 50th-anniversary tour opens in Birmingham on 13 October and plays major European cities until 11 November in Glasgow, with every show performing the original album from start to finish.",
            "Fifty years on, the key of life clearly still has a few notes left in it.",
          ],
          source: "Euronews",
          sourceUrl:
            "https://www.euronews.com/2026/09/29/stevie-wonder-celebrates-50-years-of-songs-in-the-key-of-life-with-four-unreleased-songs",
          image: {
            file: "/editions/43/stevie-wonder-key-of-life-ep.jpg",
            alt: "Stevie Wonder singing into a studio microphone",
            credit: "Motown Records / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Stevie_Wonder_1973.JPG",
          },
        },
        {
          slug: "steve-reich-90-southbank-wander",
          slot: "feature",
          kicker: "Pulse check",
          headline:
            "Steve Reich’s 90th birthday concert lets the audience wander among the players",
          dek: "Paraorchestra swapped fixed seats for podiums, a dance floor and a spot of line dancing.",
          body: [
            "London’s Southbank Centre marked two birthdays at once. Steve Reich turns 90 on 3 October, and his Music for 18 Musicians turns 50 this year. Paraorchestra, Charles Hazlewood’s collective of disabled and non-disabled musicians, played it with the players dotted on podiums around the Clore Ballroom, so the audience could wander between them like visitors at an exhibition, marvelling at the marimba players up close.",
            "In the middle, a quintet of dancers coaxed children and grandparents into a groove, with line dancing and disco lights thrown in. The Guardian’s reviewer called the performance “immaculate and exhilarating”.",
            "Upstairs in the Festival Hall, the London Sinfonietta and Radiohead’s Jonny Greenwood followed with Pulse, Radio Rewrite, which riffs on two Radiohead songs, and Electric Counterpoint, with Greenwood playing live guitar against his own recording. Minimalism, maximal grins.",
          ],
          source: "The Guardian",
          sourceUrl:
            "https://www.theguardian.com/music/2026/sep/28/paraorchestra-sinfonietta-greenwood-steve-reich-at-90-review-southbank-london",
          image: {
            file: "/editions/43/steve-reich-90-southbank-wander.jpg",
            alt: "The audience in the Southbank hall under blue stage lights",
            credit: "the Guardian",
            from: "https://www.theguardian.com/music/2026/sep/28/paraorchestra-sinfonietta-greenwood-steve-reich-at-90-review-southbank-london",
          },
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
          image: {
            file: "/editions/43/porthcawl-elvis-festival.jpg",
            alt: "An Elvis tribute act with a guitar in a doorway at Porthcawl",
            credit: "the Guardian",
            from: "https://www.theguardian.com/music/gallery/2026/sep/28/porthcawl-elvis-festival-in-pictures",
          },
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
          image: {
            file: "/editions/43/corticeira-amorim-cork.jpg",
            alt: "Stacks of harvested cork oak bark drying outdoors",
            credit: "Good News Network",
            from: "https://www.goodnewsnetwork.org/portuguese-company-turns-cork-wood-into-limitless-material-even-to-insulate-spacecraft/",
          },
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
          more: [
            {
              file: "/editions/43/gravy-wrestling-moves-to-the-cricket-club-2.jpg",
              alt: "A wrestler in spotty pyjamas flies feet-first across the gravy pit",
              credit: "Manchester Evening News",
              from: "https://www.manchestereveningnews.co.uk/whats-on/whats-on-news/i-drove-three-half-hours-34547002",
            },
            {
              file: "/editions/43/gravy-wrestling-moves-to-the-cricket-club-3.jpg",
              alt: "The referee pours a jug of fresh gravy over a wrestler’s head",
              credit: "Manchester Evening News",
              from: "https://www.manchestereveningnews.co.uk/whats-on/whats-on-news/i-drove-three-half-hours-34547002",
            },
            {
              file: "/editions/43/gravy-wrestling-moves-to-the-cricket-club-4.jpg",
              alt: "Two wrestlers raise their arms with the referee after a bout",
              credit: "Manchester Evening News",
              from: "https://www.manchestereveningnews.co.uk/whats-on/whats-on-news/i-drove-three-half-hours-34547002",
            },
            {
              file: "/editions/43/gravy-wrestling-moves-to-the-cricket-club-5.jpg",
              alt: "A wrestler lifts his opponent clean off the canvas in front of the moors",
              credit: "Manchester Evening News",
              from: "https://www.manchestereveningnews.co.uk/whats-on/whats-on-news/i-drove-three-half-hours-34547002",
            },
          ],
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
          image: {
            file: "/editions/43/lawn-mower-racing-blades-off.jpg",
            alt: "A lawn mower racer in helmet and goggles in the pits",
            credit: "BBC News",
            from: "https://www.bbc.co.uk/news/articles/c39ep822217o",
          },
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
          image: {
            file: "/editions/43/lacroix-hole-in-one-wins-bmw.jpg",
            alt: "Frederic Lacroix at the wheel of the BMW he won",
            credit: "BimmerToday Deutschland",
            from: "https://www.bimmertoday.de/2026/09/20/hole-in-one-frederic-lacroix-gewinnt-mit-perfektem-schlag-neuen-bmw-ix5/",
          },
        },
      ],
    },
    {
      section: "internet",
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
          slug: "fat-dogs-of-delhi-contest",
          slot: "feature",
          kicker: "Chonk election",
          headline:
            "Delhi votes for its roundest street dog, and an Instagram page gains 94,000 followers",
          dek: "Sixty-four well-fed neighbourhood dogs, one knockout tournament and a final with polling stations.",
          body: [
            "Delhi has been gripped by an election, and every candidate is a very good, very round dog. An Instagram account called Fat Dogs of Delhi launched a knockout contest on 24 September with 64 plump pooches nominated by its followers, pitting them against each other two at a time.",
            "The page was run by a Delhi University journalism student who asked to stay anonymous, and it had about 1,500 followers when the contest began. It soon had more than 96,000. Many of the candidates are community dogs, looked after by the residents and shopkeepers of their neighbourhoods rather than a single owner, so whole streets have been campaigning.",
            "The final added online votes to in-person voting at three spots around the city, with the winner due to be crowned on 1 October. The organiser said she hopes it will “raise money and awareness for stray dogs in Delhi”. It lands neatly in the same week as Katmai National Park’s Fat Bear Week and America’s National Dog Week.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/29/india-fat-dogs-of-delhi-contest/1711790704060/",
          image: {
            file: "/editions/43/fat-dogs-of-delhi-contest.jpg",
            alt: "Four of the contest’s plump street dogs arranged around a red heart on a pink background",
            credit: "Fat Dogs of Delhi via The Nod Mag",
            from: "https://thenodmag.com/content/fat-dogs-of-delhi-instagram-competition",
          },
        },
        {
          slug: "moriyama-emu-two-hour-chase",
          slot: "brief",
          kicker: "On the loose",
          headline:
            "Young emu slips out of a Japanese mobile zoo and leads police on a two-hour chase",
          dek: "A passer-by reported an ostrich. It was not an ostrich.",
          body: [
            "At about 6.45am, a passer-by in Moriyama, Shiga Prefecture, reported that “an ostrich ran by”. It was an emu, hatched last year and about 1.8 metres tall, that had squeezed past a gate at Horii Zoo’s mobile zoo. Police followed it for two hours before it was cornered, unhurt, at an apartment complex.",
          ],
          source: "The Star (Kyodo News)",
          sourceUrl:
            "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/09/23/emu-briefly-escapes-from-mobile-zoo-in-western-japan-no-injuries",
          image: {
            file: "/editions/43/moriyama-emu-two-hour-chase.jpg",
            alt: "The young emu standing on a paved path between bird cages at Horii Zoo",
            credit: "Kyodo News / ANN via The Star",
            from: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/09/23/emu-briefly-escapes-from-mobile-zoo-in-western-japan-no-injuries",
          },
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "blacktip-sharks-hear-from-afar",
          kicker: "Good listeners",
          headline:
            "Blacktip sharks can hear a sound from 243 feet away and tell where it came from",
          dek: "A drifting speaker, a drone and a crowd of wild sharks off Florida gave scientists the first measured proof.",
          body: [
            "Sharks have a reputation for their sense of smell, but it turns out they are rather good listeners too. A study from Florida Atlantic University has found that wild blacktip sharks can pick up low sounds from as far as 74 metres, or 243 feet, away, and turn sharply away from where they came from.",
            "Blacktips were ideal volunteers. Large numbers of them gather along the Palm Beach County coast every winter, in clear, shallow water that can be watched from above. The team anchored a boat, let an underwater speaker drift up to 19 metres away on the current, and played three bands of low-frequency sound, plus a high 10 kilohertz tone that sharks are not known to hear. A drone hovering 40 to 50 metres up filmed the results, which the scientists then went through frame by frame.",
            "The sharks reacted to all three low bands and ignored the control. More than 70% of the reactions came in what physicists call the acoustic far field, well away from the speaker, and the sharks often turned sharply away, showing they knew the direction of the sound as well as hearing it. That is impressive for an animal with no swim bladder, the air-filled organ that helps many fish sense sound.",
            "“Trying to do hearing experiments in a tank results in the sound bouncing off the walls which causes complex and confusing signals — it is like being in a house of mirrors,” said lead author Caroline Sullivan, who did the work for her master’s degree.",
            "“The ocean is an acoustic environment, and sharks are clearly tuned into it in ways we are only beginning to understand,” said senior author Stephen Kajiura. The study is published in Integrative Organismal Biology.",
          ],
          source: "ScienceDaily (Florida Atlantic University)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260929053536.htm",
          image: {
            file: "/editions/43/blacktip-sharks-hear-from-afar.jpg",
            alt: "A blacktip shark glides through deep blue water off Florida",
            credit: "Stephen Kajiura / Florida Atlantic University",
            from: "https://www.sciencedaily.com/releases/2026/09/260929053536.htm",
          },
          sticker: "Ears on",
        },
        {
          slug: "webb-tiniest-brown-dwarfs-ic-348",
          slot: "feature",
          kicker: "Space",
          headline: "Webb spots brown dwarfs only twice as heavy as Jupiter in a starry nursery",
          dek: "One of the telescope’s biggest pictures yet sets a new low for these not-quite-stars.",
          body: [
            "Brown dwarfs are the in-betweeners of space: too heavy to be planets, too light to shine like proper stars. Astronomers using the James Webb Space Telescope have now found some of the smallest ones ever, in IC 348, a star-forming region about 1,000 light-years away in the constellation Perseus.",
            "The newly found brown dwarfs weigh as little as twice the mass of Jupiter, or 0.19% of the mass of the Sun, which the team says makes them the least massive brown dwarfs known. In 2022 the same group had found ones three to four times Jupiter’s mass in the same patch of sky.",
            "Webb’s near-infrared camera took the pictures in 2024 and its spectrograph checked the candidates in 2025. The resulting panorama, released on 15 September, is one of the largest Webb images made public so far. Its upper-right corner holds young stars blowing jets, including one with a propeller-shaped outflow called HH 211.",
          ],
          source: "ESA/Webb",
          sourceUrl: "https://esawebb.org/news/weic2619/",
          image: {
            file: "/editions/43/webb-tiniest-brown-dwarfs-ic-348.jpg",
            alt: "Glowing orange and blue clouds of gas and dust studded with bright stars in the star-forming region IC 348",
            credit: "ESA/Webb, NASA & CSA",
            from: "https://esawebb.org/news/weic2619/",
          },
        },
        {
          slug: "sundarbans-captive-crocodiles-stay-put",
          slot: "brief",
          kicker: "Settling in",
          headline: "Crocodiles raised in captivity move to the mangroves and happily stay put",
          dek: "Satellite tags showed three released females made themselves at home in the Sundarbans.",
          body: [
            "Scientists tracked five saltwater crocodiles by satellite in Bangladesh’s Sundarbans mangroves, including three females that had spent between 8 and 22 years in a breeding centre. None tried to head back. Instead they “settled into small, well-defined areas and moved in much the same way as the local wild crocodile.” The team, led by Ru Somaweera of Murdoch University, says grown-up crocodiles could help boost wild numbers. The study is in Wildlife Research.",
          ],
          source: "ScienceDaily (Murdoch University)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260913081913.htm",
          image: {
            file: "/editions/43/sundarbans-captive-crocodiles-stay-put.jpg",
            alt: "Researchers in blue gloves fix a satellite tracker to the back of a saltwater crocodile in the Sundarbans",
            credit: "Murdoch University",
            from: "https://www.murdoch.edu.au/news/articles/do-saltwater-crocodiles-raised-in-captivity-go-home-after-being-released-into-the-wild",
          },
        },
      ],
    },
    {
      section: "nostalgia",
      stories: [
        {
          slug: "tornekos-mystery-dungeon-english",
          kicker: "Lost in translation",
          headline: "Dragon Quest’s Torneko finally gets an English release after 33 years",
          dek: "The roguelike that launched the Mystery Dungeon games arrives at last.",
          body: [
            "Some games take the long way round. Torneko’s Mystery Dungeon came out on the Super Famicom in 1993, the first spin-off ever made from the Dragon Quest series, published by Square Enix, and it has taken 33 years to be released in English. Torneko’s Mystery Dungeon: Classic HD is now out on modern consoles and PC, after an announcement at a Nintendo Direct in September.",
            "Its hero is Torneko, the cheerful merchant from Dragon Quest IV, who heads into a labyrinth whose layout and treasure are shuffled every time he goes in. Each attempt starts afresh, which is the core of what players now call a roguelike, and it was a big part of why the game was such a hit in Japan.",
            "That success started a whole family. Its developer, now called Spike Chunsoft, went on to make Shiren the Wanderer, and later worked with Nintendo and Game Freak on Pokémon Mystery Dungeon, which Kotaku calls one of the Pokémon franchise’s most beloved spin-offs. Plenty of today’s younger players first met the idea through Pikachu without ever knowing Torneko came first.",
            "The new version is more than a straight port. The sprites and pixel art have been remastered for widescreen, there are quality-of-life tweaks and difficulty options, and a streamer mode designed for content creators lets people watching online vote on effects that shake up the game.",
            "For those who spent the 1990s staring enviously at import shelves, the mysterious dungeon door is finally, officially open to them in English.",
          ],
          source: "Kotaku",
          sourceUrl:
            "https://kotaku.com/torneko-mystery-dungeon-classic-hd-pokemon-shiren-wanderer-roguelike-2000733006",
          image: {
            file: "/editions/43/tornekos-mystery-dungeon-english.jpg",
            alt: "Torneko and friends in the game's hand-painted art",
            credit: "GamesRadar+",
            from: "https://www.gamesradar.com/games/roguelike/after-33-years-japans-most-beloved-dragon-quest-spin-off-and-the-progenitor-of-the-entire-roguelike-mystery-dungeon-series-is-out-in-english-for-the-first-time/",
          },
        },
        {
          slug: "roblox-20-hunt-classic-theme",
          slot: "feature",
          kicker: "Happy birthday",
          headline: "Roblox turns 20 and sends players back through a game from every year",
          dek: "The Hunt: Roblox 20 travels back to 2006 and brings back the old logo for a spell.",
          body: [
            "Roblox launched in 2006, and for its 20th birthday it built a time machine. The Hunt: Roblox 20, which ran from 17 to 28 September, took players through 20 games, one for each year of the platform’s history, including Lumber Tycoon 2, Jailbreak, Adopt Me! and Grow a Garden.",
            "Finishing a year’s quest unlocked the next one and a limited virtual item. Clearing all 20 opened Year Infinity, with 20 more games for 2026 and beyond. For anyone feeling wistful, a limited-time throwback app theme brought back the original Roblox logo, colours and fonts. Roblox Plus subscribers got in early, at 9am Pacific time on 17 September, and get to keep the classic look afterwards.",
            "“What I love about Roblox is that anyone can come and build a game that reaches millions of players,” said asimo3089 and badcc, the creators of Jailbreak.",
          ],
          source: "Roblox",
          sourceUrl: "https://about.roblox.com/newsroom/2026/09/join-the-hunt-roblox-20",
          image: {
            file: "/editions/43/roblox-20-hunt-classic-theme.jpg",
            alt: "Roblox avatars skydive through a blue sky around the title The Hunt: Roblox 20",
            credit: "Roblox",
            from: "https://about.roblox.com/newsroom/2026/09/join-the-hunt-roblox-20",
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
          image: {
            file: "/editions/43/pocket-pico-packet-radio.jpg",
            alt: "The packet radio board with its Raspberry Pi Pico and jacks",
            credit: "Hackaday",
            from: "https://hackaday.com/2026/09/25/pi-pico-recreates-the-heathkit-pocket-packet/",
          },
        },
      ],
    },
    {
      section: "good-humans",
      stories: [
        {
          slug: "everett-students-push-stalled-car",
          kicker: "Everyday heroes",
          headline: "High school basketball players push a stranger’s stalled car to safety",
          dek: "They pushed her out of the traffic on Revere Beach Parkway, then turned down her money.",
          body: [
            "Robin Gay had just finished a Friday evening volunteering at the Phunk Phenomenon Dance Complex when things went wrong. “When I pulled out of the parking lot, my car just died,” she said. It died on Revere Beach Parkway, in heavy traffic. She had spent the evening volunteering, and suddenly needed a few volunteers of her own.",
            "“Cars were literally flying, so I kind of went into a panic state, and my biggest fear was that someone was going to hit me,” she said.",
            "Help arrived in the shape of the Everett High School boys basketball team. The players got behind her car and pushed it out of the way of the oncoming traffic and into a parking lot next to the road.",
            "Gay offered them money for their trouble. They turned it down. “We are taught here at this high school that it doesn’t matter if we don’t know the person – if you see somebody in trouble, go help them,” said Emanuel Lerbot.",
            "His teammate Gerardo Cubias was plainly glad he had stopped. “You feel great after doing something good. It was amazing to help her,” he said. Senior captain Jayden Alsaindor kept his advice simple: “Regardless of who you are, just be you and just show kindness and to whoever needs help, just help and that’s it.”",
            "The story went on to Boston’s WCVB-TV Channel 5, where reporter Peter Eliopoulos covered it and anchor Ed Harding praised the group on air. The team, it seems, is already good at assists.",
          ],
          source: "Everett Independent",
          sourceUrl:
            "https://everettindependent.com/2026/09/23/champions-of-kindness-everett-high-basketball-players-aid-motorist-on-revere-beach-parkway/",
          image: {
            file: "/editions/43/everett-students-push-stalled-car.jpg",
            alt: "Everett High School students push Robin Gay’s stalled car across the road at dusk",
            credit: "WCVB via Sunny Skyz",
            from: "https://www.sunnyskyz.com/good-news/6314/-It-Was-Unbelievable-High-School-Students-Help-Woman-Stranded-In-Middle-Of-Busy-Highway",
          },
          sticker: "Assist",
        },
        {
          slug: "christian-bale-foster-village-siblings",
          slot: "feature",
          kicker: "Home together",
          headline:
            "Christian Bale opens a village of 12 homes where foster siblings can stay together",
          dek: "Together California in Palmdale is the first place of its kind in the state.",
          body: [
            "Christian Bale has swapped the film set for a building site, and the result has just opened its doors. Together California, in Palmdale, is an 11,000-square-foot community of 12 furnished homes built so that brothers and sisters in foster care can grow up together rather than being split between different families. It is the first village of its kind in California.",
            "The Austrian American Council West raised nearly $9 million for the project, and the first residents are due to move in next month. Executive director Tim McCormick described it as “a place where everyone is welcomed, a place that keeps families together, a place that creates community”.",
            "Los Angeles County Supervisor Kathryn Barger was confident: “I guarantee you this project is going to change the trajectory of each and every child.”",
          ],
          source: "ABC7 Los Angeles",
          sourceUrl:
            "https://abc7.com/post/actor-christian-bale-opens-together-california-foster-care-village-palmdale-aimed-keeping-siblings/19816433/",
          image: {
            file: "/editions/43/christian-bale-foster-village-siblings.jpg",
            alt: "Christian Bale with supporters in front of a Together California banner at the opening",
            credit: "ABC7",
            from: "https://abc7.com/post/actor-christian-bale-opens-together-california-foster-care-village-palmdale-aimed-keeping-siblings/19816433/",
          },
        },
        {
          slug: "jalen-hurts-school-air-conditioning",
          slot: "brief",
          kicker: "Cool move",
          headline:
            "Jalen Hurts gives $600,000 so a Philadelphia high school can finally cool down",
          dek: "The Eagles quarterback surprised more than 1,000 students, teachers and staff.",
          body: [
            "Philadelphia Eagles quarterback Jalen Hurts has donated $600,000 to upgrade the heating and cooling system at Northeast High School in Rhawnhurst, the biggest gift yet from his foundation. More than 1,000 students, teachers and staff came to the announcement. “Growing up in the South, I was very blown away about school being canceled not for snow, but for lack of AC,” he said.",
          ],
          source: "6abc Philadelphia",
          sourceUrl:
            "https://6abc.com/post/philadelphia-eagles-quarterback-jalen-hurts-donates-600000-upgrade-hvac-system-northeast-high-school/19835937/",
          image: {
            file: "/editions/43/jalen-hurts-school-air-conditioning.jpg",
            alt: "Jalen Hurts speaks at a lectern crowded with microphones at Northeast High School",
            credit: "6abc",
            from: "https://6abc.com/post/philadelphia-eagles-quarterback-jalen-hurts-donates-600000-upgrade-hvac-system-northeast-high-school/19835937/",
          },
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
};
