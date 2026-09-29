// Issue 40, Monday 28 September 2026. Back to the broadsheet for the week.
// Most stories are real good news, rewritten in our own words, each with its source article; images
// were fetched with apps/frontend/scripts/fetch_image.py. Stories marked "(sample)" are invented.
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
        "Priya Vantongeren has been photographing the night sky from her back garden in Oakhollow for eleven years, with a second-hand telescope, a folding chair and a flask of tea that is usually cold by midnight. On Thursday she stacked 300 exposures of a patch of sky she had never bothered with, pressed ‘process’, and found something looking back at her.",
        "Two bright stars sit side by side where the eyes would be. Below them, a gentle arc of eleven fainter stars curves upwards into what can only be described as a grin. Above it all, a smudge of distant gas gives the face a slightly windswept fringe.",
        "“I actually laughed out loud, which you shouldn't do at two in the morning in a residential street,” said Ms Vantongeren, 46, who teaches geography during the day. “I've spent years looking for faint, serious things. Galaxies, nebulae, the odd comet. And the universe sends me a smiley face. I'll take it.”",
        "The face is a trick of perspective. According to Dr Helga Marsh, an astrophysicist at the Oakhollow Observatory, the stars that make it up are scattered across more than 2,000 light years and would look like nothing at all from almost anywhere else in the galaxy. “We just happen to be standing in exactly the right spot to see it smile,” she said. “Statistically, that makes us very lucky. I checked the maths twice because I wanted it to be true.”",
        "Within a day, the Oakhollow & District Astronomy Club had adopted the pattern. The members shortlisted 41 names, argued for an hour and a half and then voted for Gary, because, in the words of club chair Tomasz Brevik, ‘he just looks like a Gary’. The motion passed 23 votes to two. The two dissenters wanted Gareth.",
        "The club is now planning a public viewing night on the village green for anyone with binoculars or a small telescope, with red torches handed out at the gate and a tea urn that Mr Brevik promises will stay hot. Pupils at the local primary school have already sent in drawings of Gary with arms, a hat and, in one case, a small dog.",
        "Ms Vantongeren has posted her camera settings and a finder chart online so other backyard astronomers can go looking for themselves. Early reports from as far away as Port Anselm suggest Gary is visible from both hemispheres, although southern observers insist he is standing on his head, and seems to be enjoying it.",
        "Clear skies are forecast for the weekend. Gary, as ever, will be there.",
      ],
      source: "Backyard Skies (sample)",
      sticker: ":)",
      photo: "space",
    },
    {
      slug: "vinatieri-field-goal-jungfraujoch",
      slot: "feature",
      section: "sports",
      kicker: "American football",
      headline: "Adam Vinatieri kicks a field goal 3,454 metres up a Swiss mountain",
      dek: "The kick itself was a tidy 33 yards; the record is for how far above sea level he was standing.",
      body: [
        "Adam Vinatieri spent more than two decades kicking footballs between the posts in NFL stadiums, many of them in the snow. On Tuesday 23 September he did it somewhere new: the Jungfraujoch, the high saddle in the Swiss Alps that calls itself the Top of Europe.",
        "The retired kicker lined up a 33-yard attempt at 3,454 metres, or 11,317 feet and 8 inches, and put it through. Guinness World Records has recognised it as the highest-altitude American football field goal ever scored.",
        "The stunt was organised by his old team, the New England Patriots, to promote their game against the Detroit Lions at the Allianz Arena in Munich.",
        "“Snow is simply part of my time with the Patriots,” Vinatieri said. “But kicking a field goal at 3,454 meters is something completely different from anything I've ever seen in the NFL.” Thin air, he explained, changes your heart rate and rhythm in ways you can't predict, which is why setting the record in those conditions made him “very proud”.",
      ],
      source: "UPI",
      sourceUrl:
        "https://www.upi.com/Odd_News/2026/09/23/switzerland-Guinness-World-Records-Adam-Vinatieri-fild-goal/9571790186297/",
    },
    {
      slug: "magazine-returned-132-years-late",
      slot: "feature",
      section: "internet-and-culture",
      kicker: "Libraries",
      headline: "Library magazine comes back 132 years late, and the $12,055 fine is waived",
      dek: "The September 1894 issue of The Century Illustrated Monthly is going on display instead of back on the shelf.",
      body: [
        "Concord Public Library in New Hampshire has been waiting a long time for this one. This month a patron named John walked in and handed back a copy of The Century Illustrated Monthly: the September 1894 issue.",
        "It had been sitting in his home for years, and he isn't sure how it got there. What prompted the return was news that the library had frozen its overdue fines, which turned out to be excellent timing. By the library's count, the magazine was 48,220 days late.",
        "“Thankfully, he won't have to pay the $12,055 fine for being 48,220 days overdue,” the library wrote on social media.",
        "The magazine won't be going back into circulation. At 132 years old it has earned a rest. Instead, staff say it may go on show in the building's Concord Room, which means John can now visit it whenever he likes, with no due date at all.",
      ],
      source: "UPI",
      sourceUrl:
        "https://www.upi.com/Odd_News/2026/09/15/Concord-Public-libraray-magazine-132-years-overdue/1491789490872/",
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "mozart-notebook-found-in-paris",
          kicker: "Classical",
          headline: "A notebook in a Paris library turns out to be Mozart's, aged 22",
          dek: "A curator tidying up before retirement recognised the composer's rounded, forward-leaning treble clefs.",
          body: [
            "François-Pierre Goy had set himself one last job before retiring from the music department of France's National Library: work through a pile of documents nobody had properly looked at. Somewhere in the pile was a 44-page notebook. It turned out to have been written by Wolfgang Amadeus Mozart.",
            "The notebook dates from May to July 1778, when a 22-year-old Mozart was living in Paris and earning his keep as a music tutor. His pupil was Marie-Louise-Philippine, daughter of the Duke of Guines, a much-admired flute player of the day. Inside are the daily exercises Mozart set her for the harp, plus seven pieces for flute and harp that may have been meant for father and daughter to play together.",
            "“I never imagined what I was about to find,” Goy said. He had a head start: only weeks earlier he had been studying other teaching documents in Mozart's hand, and the writing looked familiar. “The treble clefs are quite rounded and tilted slightly forward,” he explained, while the bass clefs were drawn the opposite way to the style French composers usually used.",
            "He laid the pages beside a copy of Mozart's Concerto for Flute and Harp, the piece the Duke himself commissioned, and found identical stamps on both. In April the notebook was authenticated by Armin Brinzing, director of the Mozarteum Foundation in Salzburg, and the library has called it a “major discovery”.",
            "The concerto is still one of Mozart's best-loved works. Now, 248 years on, we also have the lesson plans he wrote for the girl who played it.",
          ],
          source: "Classic FM",
          sourceUrl:
            "https://www.classicfm.com/composers/mozart/handwritten-notebook-discovered-major-paris/",
          image: {
            file: "/editions/40/mozart-notebook-paris.jpg",
            alt: "A portrait of Mozart beside the open handwritten notebook of music exercises",
            credit: "Classic FM",
            from: "https://www.classicfm.com/composers/mozart/handwritten-notebook-discovered-major-paris/",
          },
        },
        {
          slug: "vulcan-salute-record-science-museum",
          slot: "feature",
          kicker: "Television",
          headline: "Star Trek fans set a Vulcan salute record at London's Science Museum",
          dek: "1,188 people came for Star Trek Day, and 934 of them held the split-fingered salute for a full minute.",
          body: [
            "Holding up a hand with the fingers parted in a V looks easy until you try it for sixty seconds. On 10 September, Star Trek Day, 1,188 fans gathered at the Science Museum in London to try, as part of the show's 60th-anniversary celebrations.",
            "Among them was Martin Quinn, who plays the engineer Montgomery Scott in Star Trek: Strange New Worlds. Guinness World Records adjudicator Paulina Sapinska counted everyone who kept the salute steady for the whole minute: 934 people, enough for a new world record.",
            "“For an attempt that lasted only one minute, there was a lot of excitement,” Sapinska said, “and it was a huge bonding moment for the fans.”",
            "Live long, and keep your fingers apart.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/15/Guinness-World-Records-Star-Trek-Vulcan-salute/3451789489055/",
        },
        {
          slug: "cassette-album-tops-chart",
          slot: "brief",
          kicker: "Music",
          headline: "Cassette-only album tops Merrow's indie chart, with a pencil in every case",
          dek: "The Lanternfish chose tape ‘because you have to listen to the whole thing’.",
          body: [
            "The Lanternfish released their second album, ‘Low Tide Radio’, only on cassette: 2,000 copies, each with a small yellow pencil for rewinding. It went straight to number one on Merrow's independent chart. Shops report that blank tapes have sold out too, and one now has a wall of mixtapes made for strangers.",
          ],
          source: "Music Notes (sample)",
        },
        {
          slug: "sock-vote-encore",
          slot: "brief",
          kicker: "Concerts",
          headline: "Orchestra lets its audience choose the encore by waving coloured socks",
          dek: "Red socks meant Brahms; striped socks meant the theme from a cartoon about a heroic sandwich.",
          body: [
            "The Kalvenburg Philharmonic handed out two socks per seat before Saturday's concert and counted the waving at the end. The cartoon theme won by what the conductor called ‘an embarrassing margin’ and was played twice. The socks went to a knitting circle, which plans to turn them into a very long scarf.",
          ],
          source: "Concert Hall Notes (sample)",
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "lighthouse-keeper-sim",
          kicker: "Indie",
          headline:
            "‘Keeper’, a game about simply looking after a lighthouse, passes a million players",
          dek: "There are no enemies, just a kettle, a lamp, a logbook and a great many very nice waves.",
          body: [
            "‘Keeper’ was made over three winters by Oona Lindqvist, a solo developer on the small island of Stray, where the ferry runs twice a week and the internet runs when it feels like it. This weekend it passed one million players.",
            "The game has no enemies, no score and no way to lose. You play a lighthouse keeper on a rock in a grey-green sea. You trim the wick, polish the lens, write down every ship that passes and make tea on a small iron stove. On stormy nights things become slightly more dramatic: you can put on a jumper.",
            "“I kept being told a game needs conflict,” said Ms Lindqvist. “I tried adding pirates for about a week. They just made the tea go cold. So I took them out.”",
            "Players have taken the logbook very seriously. The game lets you write a line for every ship, and the most shared screenshots online are other people's entries: ‘Small blue fishing boat. Waved.’ ‘Ferry late again. Sympathy.’ ‘A whale, I think, or a very large wave with ambitions.’",
            "Reviewers have called it ‘the calmest hour you'll spend this year’. A retired keeper from the mainland, Albin Rask, wrote to say it was accurate in every detail except one. “You never run out of biscuits,” he said. “We always ran out of biscuits.”",
            "Ms Lindqvist has promised to fix this in the next update. Biscuits will now run out, and a supply boat will bring more every seventh in-game day.",
          ],
          source: "Indie Arcade (sample)",
          photo: "lighthouse",
        },
        {
          slug: "rubiks-cubes-on-a-pogo-stick",
          slot: "feature",
          kicker: "Puzzles",
          headline: "Man who solved 211 Rubik's cubes on a pogo stick makes the record book",
          dek: "Saul Hafting set the record at 16, and five years on nobody has bounced past it.",
          body: [
            "Saul Hafting, from Annapolis Royal in Nova Scotia, was 16 when he solved 211 Rubik's cubes while bouncing on a pogo stick. The previous record was 65. Guinness approved his total in 2022, and it has now earned him a page in the Guinness World Records 2027 book, which is in shops this month.",
            "Hafting, now 21, admits he wasn't sure how long it would stand. “If it ever gets broken, I know that I held it for many years, which is very satisfying,” he said.",
            "He is most excited about the simplest part. “It's awesome,” he said. “I am very excited to get a copy of my own and flip through it and see my name in it.” He plans to help launch the book with demonstrations, which we can only assume will be bouncy.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/11/canada-Guinness-World-Records-rubiks-cube-pogo-stick/5691789143596/",
        },
        {
          slug: "sofa-stairs-coop",
          slot: "brief",
          kicker: "Co-op",
          headline: "Two-player game about carrying a sofa upstairs becomes a family favourite",
          dek: "‘Pivot!’ is now, by several reliable accounts, the most shouted word in living rooms.",
          body: [
            "‘Lift With Your Legs’ gives each player one end of an enormous green sofa and a staircase that gets narrower every level. There is no timer and no score, just a count of how many times you have scraped the wallpaper. Level twelve has a cat asleep on the landing. The designers refuse to make the sofa smaller.",
          ],
          source: "Couch Co-op (sample)",
        },
        {
          slug: "library-lends-half-finished-games",
          slot: "brief",
          kicker: "Libraries",
          headline: "Library lends out handheld consoles with a game already saved halfway through",
          dek: "Each one comes with a note from the last borrower about where they got to.",
          body: [
            "The library in Coldbrook Vale now lends twelve second-hand handhelds, each loaded with one long adventure game. Borrowers carry on from where the previous person stopped and leave a note in the case. The notes are getting chattier. The latest reads: ‘Don't open the blue door yet. Trust me. Also, the frog is a friend.’",
          ],
          source: "Library Letter (sample)",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "cyclist-returns-hat",
          kicker: "Cycling",
          headline: "Cyclist stops mid-race to hand back a spectator's hat, then wins anyway",
          dek: "The flat cap blew on to the road on the final climb, and its owner has since had it framed.",
          body: [
            "The Tollbridge Hill Race is 94 kilometres long and finishes with a climb so steep that locals call it ‘the Wall of Mild Regret’. With four kilometres to go on Sunday, Amaru Castell was in fourth place when a gust lifted a tweed flat cap off a spectator's head and dropped it in the middle of the road.",
            "Castell braked, unclipped, picked up the cap and rode back two metres to hand it to its owner at the barrier. Then he set off again, by now 40 seconds behind the leaders.",
            "“It was a nice hat,” said Castell, 27, who teaches music at a primary school when he isn't racing. “If I'd left it there, somebody would have ridden over it, and I'd have been thinking about that hat for the rest of my life.”",
            "What happened next surprised even his own team. Castell caught the leading group on the descent, sat in behind them through the last bends and won the sprint by the width of a tyre.",
            "The cap belonged to Reginald Oyelaran, 74, who has watched the race from the same spot for 30 years. “He handed it over like a waiter bringing soup,” Mr Oyelaran said. “Very carefully, with a little nod.”",
            "The cap now hangs in a frame in the village hall, next to a photograph of the finish. The organisers have announced a new prize for next year: a small silver hat, for sportsmanship.",
          ],
          source: "Grid Talk (sample)",
        },
        {
          slug: "royals-home-bun-race",
          slot: "feature",
          kicker: "Baseball",
          headline: "Royals fans steer a giant inflatable hot dog into its bun; everyone eats free",
          dek: "The crowd had 35 seconds to complete the ‘Home Bun Race’ at Kauffman Stadium.",
          body: [
            "Baseball has the seventh-inning stretch. The Kansas City Royals have the Home Bun Race. During their game against the Toronto Blue Jays on Saturday 6 September, a giant inflatable hot dog and an equally giant inflatable bun were launched into different sections of the stands at Kauffman Stadium.",
            "The fans had 35 seconds to nudge the two together across the crowd. They did it inside the time, which meant every fan in the ground had earned a free hot dog.",
            "Major League Baseball's account marked the moment with a short announcement: “HOT DOG ASSEMBLY COMPLETE.” The Royals lost 4–3, but it is hard to believe many people went home hungry.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/09/home-bun-race-Kansas-City-royals/8641788970720/",
        },
        {
          slug: "fastest-hole-of-disc-golf",
          slot: "brief",
          kicker: "Disc golf",
          headline: "Four friends play a hole of disc golf in 44.31 seconds, flat out",
          dek: "It took 60 attempts, and the final stretch was a 41-second sprint uphill.",
          body: [
            "Serial record-setter David Rush teamed up with Travis, Anders and Oliver Davidson at Mallard Park in Idaho for the Guinness record for the fastest hole of disc golf by a team of four, on a certified hole of at least 200 metres. Attempt number 60 was the one. “Everything finally aligned,” Rush said.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/09/Guinness-World-Records-David-Rush-disc-golf/8671788975951/",
        },
        {
          slug: "under-nines-trick-play",
          slot: "brief",
          kicker: "Football",
          headline: "Under-nines' secret free kick fools everyone, including their own coach",
          dek: "The routine involved a fake shoelace problem and a lot of pointing at the sky.",
          body: [
            "The Pennyfield Juniors rehearsed it at break time for six weeks. At 1–1 in the cup, their captain knelt to tie a shoelace that was already tied, two teammates pointed upwards and gasped, and while everyone looked at the sky a quiet defender tapped the ball in. “I thought there was a hot-air balloon,” admitted the coach.",
          ],
          source: "Sunday League Weekly (sample)",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "robot-hand-learns-piano-by-ear",
          kicker: "Robotics",
          headline: "Robot hand learns to play a keyboard tune after hearing it just once",
          dek: "Two minutes of random ‘motor babbling’ was all the practice it needed, and judges struggled to tell it from people.",
          body: [
            "Most robots are taught like new employees with a very long manual. The Musician Hand, built by engineers at the University of Southern California, was taught more like a toddler let loose on a piano: bash about for a bit and see what happens.",
            "The hand has four tendon-driven fingers. In tests, the team played it a short melody. It then spent about two minutes pressing keys more or less at random, a phase the researchers call “motor babbling”, before reproducing the tune in a single attempt, without correction. When its playing was judged alongside human pianists, the judges were sometimes unable to tell which was which.",
            "Behind the scenes, the robot turns sounds into visual patterns and uses neural networks to match those patterns to finger movements. The research was published by the Royal Society.",
            "“The Achilles heel of traditional robotics is the assumption that perfect information is necessary to act well,” said Professor Francisco Valero-Cuevas, who led the work. “Animals don't work that way. They perceive, they guess, usually correctly, and they adapt.”",
            "Lead author Hesam Azadjou points to how efficient that approach can be. “Our brain solves incredibly complex problems using less than 100 watts of power,” he said. “To do the same thing with conventional AI, you might need megawatts.”",
            "The team thinks the idea could one day help with personalised rehabilitation, robotic assistants and wearable devices. For now it has learned something rather charming. “With two minutes of training and a simple laptop, this system learned to do something intrinsically human: artistic expression,” Valero-Cuevas said.",
          ],
          source: "Classic FM",
          sourceUrl:
            "https://www.classicfm.com/music-news/engineers-invent-piano-playing-robot-hand/",
          image: {
            file: "/editions/40/robot-hand-plays-piano.jpg",
            alt: "A blue robotic hand with four fingers poised over a keyboard",
            credit: "Classic FM",
            from: "https://www.classicfm.com/music-news/engineers-invent-piano-playing-robot-hand/",
          },
        },
        {
          slug: "zerobionic-signing-robot-hands",
          slot: "feature",
          kicker: "Accessibility",
          headline:
            "Kenyan start-up's 3D-printed robot hands turn a teacher's voice into sign language",
          dek: "Norah Kimathi, 22, first had to build her own sign-language dataset, using signers in a sensor suit.",
          body: [
            "Norah Kimathi founded ZeroBionic in Nairobi to solve a practical problem: many teachers of deaf and hard-of-hearing children don't know sign language. Her robotic hands listen to what the teacher says and sign it for the class.",
            "Each hand is 3D-printed from recycled plastic litter, costs $350 and can run for three years without maintenance. The company has sold 78 so far and reports 92 per cent speech-to-sign accuracy.",
            "The hardest part was the data. There was no ready-made Kenyan or African sign-language dataset to learn from, so the team recruited deaf teachers and experienced signers to record their movements in an imported, electrode-lined bodysuit. “No one else had built this on the continent … We had to start from scratch,” Kimathi told AFP. Next comes Africa One, a robotic upper torso with a bigger vocabulary. “We know we're going to put a smile on someone else's face,” she said.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/kenyan-startup-makes-robotic-hands-that-translate-teachers-voice-into-signs-for-deaf-students/",
          image: {
            file: "/editions/40/zerobionic-signing-hands.jpg",
            alt: "A schoolgirl in uniform demonstrates a white robotic hand to her classmates",
            credit: "ZeroBionic",
            from: "https://www.goodnewsnetwork.org/kenyan-startup-makes-robotic-hands-that-translate-teachers-voice-into-signs-for-deaf-students/",
          },
        },
        {
          slug: "pawguard-cat-keyboard-app",
          slot: "brief",
          kicker: "Open source",
          headline: "Free app spots a cat walking across your keyboard and saves your work",
          dek: "It tells paws from fingers by rhythm alone, then locks the screen with a polite message.",
          body: [
            "PawGuard watches how keys are pressed rather than which ones. Cats hold several neighbouring keys too long and cross the keyboard in a straight line; when it sees that, it saves your file and shows ‘Cat detected. Please stand by.’ Its developer trained it on 40 hours of her cat, Dumpling, who was delighted to help.",
          ],
          source: "Open Tech Digest (sample)",
        },
        {
          slug: "school-weather-stations",
          slot: "brief",
          kicker: "Science kits",
          headline: "900 schools now run home-made weather stations on one shared map",
          dek: "Each station is a jam jar, some cheap sensors and a lot of sticky tape.",
          body: [
            "The Sky Jar project gives schools free plans for a weather station that pupils build, paint and fix to a fence post. Its readings join a public map that updates every ten minutes, now covering 31 countries. Each month, the school with the most accurate forecasts wins a trophy shaped like a cloud.",
          ],
          source: "Open Tech Digest (sample)",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "dance-for-a-discount",
          kicker: "Small business",
          headline: "Petrol station knocks 20 per cent off for anyone who dances for 15 seconds",
          dek: "At Halfmoon Sunoco in New York, customers twirled, shimmied and sang their way to cheaper bills.",
          body: [
            "The rules at the Halfmoon Sunoco, about 25 minutes outside Albany in New York state, were simple. Dance for at least 15 seconds at the counter and you got 20 per cent off your whole bill.",
            "The idea came from the station's social media manager, Paulina Sirtori, a 23-year-old recent graduate of Syracuse University. “The No. 1 complaint we hear from people everywhere is that gas prices are just too high,” she said. “So we wanted to really do something to alleviate that a little bit.”",
            "Customers took the challenge seriously. Denise Lapointe, a local bus driver, went with a song of her own composition. “I just danced to the beat of my own drum while singing, ‘I'm dancing for a discount. I'm dancing for a discount,’” she told the New York Post. “Just being my goofy self.”",
            "The first two through the door, Bill and Dan, set a high bar. “Bill started twerking and kind of dropping it down, and got as low as he could,” Sirtori said. “Then we had Dan, who popped his hip out and whipped his head around, calling it his ‘Michael Jackson move.’” One woman danced her way to $15 off.",
            "A video of the shimmying customers passed a million views on TikTok, and the station says more discount ideas are planned for the months ahead. Economists have spent centuries arguing about what really moves prices. In Halfmoon, the answer is a good beat.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/gas-station-goes-viral-for-offering-a-discount-for-dance-moves-and-then-posts-a-video/",
          image: {
            file: "/editions/40/dance-for-a-discount.jpg",
            alt: "Customers dancing in the aisles of a petrol station shop",
            credit: "Halfmoon Sunoco / TikTok",
            from: "https://www.goodnewsnetwork.org/gas-station-goes-viral-for-offering-a-discount-for-dance-moves-and-then-posts-a-video/",
          },
        },
        {
          slug: "custard-tart-index",
          slot: "feature",
          kicker: "Quirky economics",
          headline:
            "Students crown the ‘Custard Tart Index’: one bakery's price hasn't moved in 22 years",
          dek: "A tart at the Hollis Street Bakery cost 90p in 2004, and it costs 90p now.",
          body: [
            "Economics students in the market town of Brenmoor noticed something odd about the Hollis Street Bakery: its custard tarts have cost 90p since 2004. They spent a term working out how, and presented the answer in a lecture that 400 people attended, most of them for the free tarts at the end.",
            "The explanation is simple and slightly magical. The family bought the building in 1961, it swaps bread for eggs with a farm three miles away, and the owner, Marguerite Sallow, has decided the price is right. “Everyone in this town has bought a tart from us on a good day,” she said. “I want it to be the same price on the next good day.”",
            "Stallholders at the market now compare their prices with ‘the tart standard’. The project was awarded a first.",
          ],
          source: "High Street News (sample)",
          photo: ["picnic", 1],
        },
        {
          slug: "sticker-interest-bank",
          slot: "brief",
          kicker: "Savings",
          headline: "Class 5B's pocket-money bank pays interest in stickers, and savers love it",
          dek: "One sticker a month for every five coins left alone; holographic ones for a whole term.",
          body: [
            "The Bank of Class 5B at Fernhill Primary opened with a shoebox, a padlock and a very neat ledger. It now holds deposits from 61 pupils and three teachers. “The teachers are our trickiest customers,” said its chief executive, Anaya, ten. “They keep withdrawing for coffee.” The class's maths marks are up.",
          ],
          source: "Pocket Money Times (sample)",
        },
        {
          slug: "old-voucher-buys-hen-teapot",
          slot: "brief",
          kicker: "Found money",
          headline: "A twenty-year-old gift voucher found in a coat buys exactly one teapot",
          dek: "The shop honoured it, and a yellow teapot shaped like a hen was the only thing at the right price.",
          body: [
            "Clearing a wardrobe, Joaquín Ferreira found a 2006 voucher for £14 from a homeware shop on his high street. He took it in expecting polite laughter. The manager honoured it and helped him hunt for something at exactly £14. The hen teapot is now, he says, ‘the most valuable thing in the kitchen’.",
          ],
          source: "High Street News (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "fat-bear-week-2026-bracket",
          kicker: "Animals",
          headline: "Fat Bear Week is back, and this year's bracket is the biggest ever",
          dek: "Katmai's brown bears have spent all summer on salmon; now the internet decides which is readiest for winter.",
          body: [
            "Every autumn, the brown bears of Katmai National Park in Alaska sit the most important exam of their year: have they eaten enough? And since 2014, the rest of the world has been allowed to do the marking.",
            "Fat Bear Week 2026 runs from 22 to 29 September, with voting on weekdays at fatbearweek.org. The bears go head-to-head in a knockout bracket, and the public picks whichever looks fatter and more ready for hibernation. This year's field of 16 is the biggest yet, and last year's champion, Chunk, is back to defend his title. Last time, more than 1.7 million votes were cast.",
            "The weight matters. Bears don't eat or drink during hibernation and can lose about a third of their body weight before spring, so dozens of them gather at Brooks River from late June to mid-October to feast on salmon. Few rivers anywhere give bears such a long banquet in one place.",
            "There is fresh competition coming up behind the big names. “There are more cubs at Brooks Camp this year than have been seen in a long time,” said park superintendent Mark Sturm. “A new generation of fat bears is taking shape, and they're off to a strong start.”",
            "Fans can scout the contenders on live webcams run by Explore.org, which organises the contest with the National Park Service and the Katmai Conservancy. The champion is crowned on Tuesday 29 September. We would tell you who to vote for, but frankly they are all magnificent.",
          ],
          source: "National Park Service",
          sourceUrl: "https://www.nps.gov/katm/learn/news/fat-bear-week-2026.htm",
          image: {
            file: "/editions/40/fat-bear-week-bracket.jpg",
            alt: "A brown bear with her cubs beside the river at Katmai National Park",
            credit: "NPS / C. Loberg",
            from: "https://www.nps.gov/katm/learn/news/fat-bear-week-2026.htm",
          },
        },
        {
          slug: "scream-at-the-sea",
          slot: "feature",
          kicker: "Gatherings",
          headline: "Over 100 people meet at San Francisco's Ocean Beach to scream at the Pacific",
          dek: "The loudest hit 121.9 decibels and went home with a small megaphone.",
          body: [
            "Danielle Egan felt like she needed a really good scream. “And I think it'd be more fun with other people,” she said. So this month she invited anyone who fancied it to Vista Del Mar, above Ocean Beach in San Francisco. More than 100 people turned up, stood at the edge of the land and let the Pacific have it.",
            "Some came with particular things to shout about. Plenty said simply that it felt good. There was also a competition, judged on volume, length and vocal style.",
            "The winner, Olivia Gugliemotto, reached 121.9 decibels, not far short of the world record of 129, and was presented with a small megaphone, which feels like a bold prize to give her. The ocean made no complaint.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/14/Guttural-scream-at-the-sea-San-Francisco/6761789408160/",
        },
        {
          slug: "salt-and-pepper-packet-record",
          slot: "brief",
          kicker: "Collections",
          headline:
            "Wisconsin collector wins back her salt-and-pepper-packet record with 754 pairs",
          dek: "Among Linda Schulz's favourites: packets from an airline, decorated like Hawaiian shirts.",
          body: [
            "Linda Schulz, 67, of Brookfield, Wisconsin, first took the Guinness title in 2024 with 494 matching pairs. In 2025 Sonny Molina overtook her with 594. Now she is back on top with 754. “To have a goal of a Guinness World Records title makes this hobby even more fun and interesting!” she said.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/16/Guinness-World-Records-salt-and-pepper-packets/9321789579951/",
        },
        {
          slug: "caretaker-sticky-note-mural",
          slot: "brief",
          kicker: "Schools",
          headline: "Pupils cover a corridor in 4,000 sticky notes to thank their caretaker",
          dek: "Mr Okafor retires on Friday after 31 years, and the notes spell out his name.",
          body: [
            "Every pupil at Brightwater Secondary wrote at least one note. The most common message was about the day he rescued eleven footballs and a single trainer from the sports-hall roof; the second was about his whistling. “I've painted that corridor four times,” he said. “I've never seen it look this good.”",
          ],
          source: "Around the Web (sample)",
        },
      ],
    },
    {
      section: "art-design-and-books",
      stories: [
        {
          slug: "athens-airport-becomes-park",
          kicker: "Landscape",
          headline: "Athens is turning its old airport into one of Europe's biggest parks",
          dek: "Ellinikon Park is being designed, path by path, to stay about 4°C cooler than the streets around it.",
          body: [
            "For decades, planes took off and landed at Ellinikon, the old international airport on the coast south of Athens. Its runways are being turned into something much quieter: Ellinikon Park, which will stretch across more than 400 acres beside the sea and become the second-largest city park in Europe.",
            "The plan calls for 30,000 trees and three million smaller plants from more than 520 species, around three-quarters of them native or well suited to the climate. The designers have treated shade almost as a building material: rest areas are planned with more than 60 per cent shade cover, while running channels, misting systems and low-use basins will keep the air cool and damp.",
            "Much of the layout came out of a computer. Planners ran simulations of air circulation, wind direction and evaporation, the discipline known as computational fluid dynamics, to decide where every path and plant should go. The target is a park about 7.2°F, or 4°C, cooler than the asphalt and concrete around it.",
            "Water has been thought through too. The park will treat its own water for irrigation and collect rain in a large catchment system to feed its fountains and misters.",
            "A runway, it turns out, is a very good place to put a picnic.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/athens-is-turning-its-old-airport-into-one-of-europes-largest-parks/",
          image: {
            file: "/editions/40/athens-airport-becomes-park.jpg",
            alt: "A design drawing of green parkland and a beach along the coast at Ellinikon, Athens",
            credit: "The Ellinikon",
            from: "https://www.goodnewsnetwork.org/athens-is-turning-its-old-airport-into-one-of-europes-largest-parks/",
          },
        },
        {
          slug: "bird-photographer-of-the-year-gannet",
          slot: "feature",
          kicker: "Photography",
          headline: "A gannet hunting in Scottish waters wins Bird Photographer of the Year",
          dek: "Henley Spiers' ‘Sunball Rocket’ beat more than 24,000 entries, and a 16-year-old's moonlit owl won the youth prize.",
          body: [
            "The British photographer Henley Spiers has won Bird Photographer of the Year 2026 with ‘Sunball Rocket’, a picture of a northern gannet in Scottish waters. It first won the Birds in the Environment category and then the grand prize of £3,000.",
            "Gannets are made for this kind of picture. They hunt by folding back their wings and plunging into the sea like darts, and Spiers caught one in full hunting mode.",
            "More than 24,000 photographs were entered. The Young Bird Photographer of the Year is Parham Pourahmad, 16, from the United States, for ‘Moonlit Night’, a great horned owl photographed in a park next to his home.",
            "The category winners make a fine gallery on their own. Donald Chin's ‘I'm Keeping Everyone Dry’ won Bird Behaviour, Ivan Sjögren's ‘Eye to Eye with a Short-Eared Owl’ took Birds in Flight, Rahul Sachdev's ‘An Ostrich Horizon’ won Black and White, and Gianluca Damiani's ‘Alter Ego’ was named the best urban bird.",
            "The competition is also giving £5,000 to the conservation charity Birds on the Brink.",
          ],
          source: "Positive News",
          sourceUrl:
            "https://www.positive.news/environment/winners-of-bird-photographer-of-the-year-announced/",
          image: {
            file: "/editions/40/bird-photographer-gannet.jpg",
            alt: "A northern gannet in flight against a glowing sun, the winning photograph ‘Sunball Rocket’",
            credit: "Henley Spiers / Bird Photographer of the Year",
            from: "https://www.positive.news/environment/winners-of-bird-photographer-of-the-year-announced/",
          },
        },
        {
          slug: "worlds-largest-hairdryer",
          slot: "brief",
          kicker: "Design",
          headline: "Engineer Ruth Amos builds a working hairdryer taller than most people",
          dek: "At 5 feet 9 inches long and 5 feet 3 inches tall, it is the largest in the new Guinness World Records book.",
          body: [
            "The British engineer's supersized dryer is one of the new entries in Guinness World Records 2027, alongside a 4,550-piece My Little Pony collection and a Californian's 13,201 frog-themed items. It really does blow hot air. Styling appointments, sadly, are not available.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/10/Guinness-World-Records-book-new-titles/8281789059748/",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "48,220",
        caption: "days overdue: the 1894 magazine a New Hampshire library finally got back",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Monday: sunny spells, with a warm front of fresh starts",
        detail:
          "High pressure over the kettle from 7am. Patchy inbox drizzle clears by elevenses, followed by scattered dancing at petrol stations. Visibility excellent: on a clear night you can see Gary from here.",
      },
    },
    {
      type: "quote",
      content: {
        text: "I never imagined what I was about to find.",
        by: "François-Pierre Goy, the curator who recognised a notebook as Mozart's",
      },
    },
    {
      type: "correction",
      content: {
        text: "Sunday's edition said a newborn humpback calf puts on about 45 kilograms a day. The calf has asked us to add that it is simply big-boned, and that it is still growing into its flippers.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Second-hand staircase, extremely narrow, for a game studio's research. Will collect. Will not bring a sofa.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "OFFERED",
        text: "One small megaphone, barely used, to anyone quieter than its current owner. Collection from Ocean Beach. Bring earplugs.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "SEEKING",
        text: "A cat willing to walk across keyboards for science. Paid in warm laptops. No experience necessary; most cats are naturals.",
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
