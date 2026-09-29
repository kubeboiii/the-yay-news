// Issue 45, Saturday 3 October 2026. Scheduled. A weekend zine: relaxed, featurey and pastry-forward.
// Stories with a sourceUrl are real, rewritten in our own words from the linked article. The rest
// are invented and marked "(sample)": their people, places, sources and numbers are made up.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue45: SeedEdition = {
  issueNumber: 45,
  date: "2026-10-03",
  status: "scheduled",
  design: "zine",
  colourway: "paint-box",

  front: [
    {
      slug: "pastor-college-football",
      section: "sports",
      slot: "lead",
      kicker: "Weekend warriors",
      headline: "At 47, a pastor and father of three finally plays college football",
      dek: "Justin Buzzard's playing days ended thirty years ago. Then his son showed him a video.",
      body: [
        "On Saturday 29 August, with a little over five minutes left in San Jose City College's home opener, a new defensive end jogged on to the field wearing number 48. He was a freshman. He was also 47 years old, a father of three and the founder and lead pastor of Garden City Church in San Jose, and he had been waiting about thirty years for this moment.",
        "Justin Buzzard first played college football at Whitworth University in Spokane, Washington, where he spent a season as a redshirt before his playing days came to an early end. He moved on, started a church, raised a family and kept fit with CrossFit. Football, it seemed, was finished.",
        "Then his oldest son saw a video of a 60-year-old man playing the game, and suggested that his dad could do the same. Buzzard's first reaction was blunt. “I just thought, ‘That's so stupid. So no way,’” he told Sports Spectrum. About thirty seconds later, he was thinking something else: “Wait. Maybe. What if I did that? Maybe I could do that. What if I tried?”",
        "He mentioned it, half-joking, to the Jaguars' defensive coordinator, who took him entirely seriously. Soon he was enrolled in a full timetable of classes to stay eligible, training with teammates young enough to be his sons, and fitting practice around his work at the church. The team does not play on Sundays, which helps.",
        "Not everyone was convinced at first. Defensive lineman Angel Benavidez told KTVU he had his doubts, but came round, praising “Justin Buzzard coming out every day, you know ready to learn, willing to put in the work.” The head coach, Jim Winkler, saw a lesson for the whole squad: “Don't have any regrets. Give it everything you have got.”",
        "On debut day against College of the Redwoods, Buzzard played two snaps. On the first, a live defensive play, he beat his man and hurried the quarterback, helping linebacker Kyler Headley make a third-down sack. The second was a kneel-down to end the game, which still counts.",
        "“It felt great,” he said afterwards. “You prepare a lot in football to just play a little. So it was great to actually get a rep.” His teammate Preston Conrad agreed: “He definitely doesn't take anything off. He definitely earned it.”",
        "Buzzard's personal motto is ‘risk or rust’. At the moment he is doing plenty of the first, and none of the second.",
      ],
      source: "Sports Spectrum",
      sourceUrl:
        "https://sportsspectrum.com/sport/football/2026/09/04/pastor-justin-buzzard-college-football-eternal-impact/",
      sticker: "Go 48!",
      image: {
        file: "/editions/45/pastor-college-football.jpg",
        alt: "Justin Buzzard in his San Jose City College football kit",
        credit: "KTVU FOX 2",
        from: "https://www.ktvu.com/news/meet-47-year-old-pastor-playing-college-football-san-jose-city-college",
      },
    },
    {
      slug: "croissant-relay",
      section: "internet-and-culture",
      slot: "feature",
      kicker: "Weekend",
      headline: "One croissant tours eleven bakeries on a high street, gaining something at each",
      dek: "It started plain. It finished with jam, custard, almonds, a paper crown and a birthday candle.",
      body: [
        "At nine o'clock last Saturday, a single plain croissant left the bakery at the bottom of Merrow's high street in a glass cake box, carried by a nine-year-old in oven gloves. The rules of the Merrow Croissant Relay, pinned in each shop window, were simple: every bakery adds one finishing touch, and nobody takes anything off.",
        "It gained apricot glaze, then raspberry jam, then cinnamon, custard, a sesame tuile ‘for architecture’, toasted almonds, a paper crown and a tiny flag. “We had a long meeting about whether the flag counted as food,” said baker Hélène Aubry. “It was decided that it counted as morale.” The eleventh baker, Sevim Demir, added a birthday candle. “It had been through a lot,” she said.",
        "The croissant was then cut into forty pieces for the 300 people who had followed it. Next year: a doughnut.",
      ],
      source: "Merrow Mercury (sample)",
      photo: ["picnic", 1],
    },
    {
      slug: "gorilla-maze",
      section: "internet-and-culture",
      slot: "feature",
      kicker: "Mazes",
      headline: "Farm cuts a giant gorilla into its maize for David Attenborough's 100th birthday",
      dek: "Three miles of paths, two hours to walk, and nearly a year of planning with GPS.",
      body: [
        "Every summer, Wistow Maze in Leicestershire cuts a new picture into its field of maize, and past designs have included a steam train, a crown and a javelin thrower. This year's was a mountain gorilla, a birthday present for Sir David Attenborough, who turned 100 and grew up in the county.",
        "The design nods to his famous 1978 television encounter with gorillas. Seen from above, the paths form the ape's face and body; from the ground, they are three miles of green corridors that take about two hours to walk, with twelve quiz boards hidden along the way.",
        "“We spent almost a year mapping out the design,” said the maze's owner, Diana Brooks. “It has been a lot hard work and effort since then to get it looking right.”",
      ],
      source: "Good News Network",
      sourceUrl:
        "https://www.goodnewsnetwork.org/giant-gorilla-maze-celebrates-sir-david-attenboroughs-100th-birthday/",
      image: {
        file: "/editions/45/gorilla-maze.jpg",
        alt: "An aerial view of a maize maze cut in the shape of a mountain gorilla",
        credit: "Tom Maddick / SWNS",
        from: "https://www.goodnewsnetwork.org/giant-gorilla-maze-celebrates-sir-david-attenboroughs-100th-birthday/",
      },
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "horse-album",
          slot: "feature",
          kicker: "Music",
          headline: "A singer's new album features an unusual session musician: her horse, Yupia",
          dek: "He plays guitar and harp strings with his nose and mouth, and nobody taught him how.",
          body: [
            "Most musicians find their bandmates at school, at gigs or through an advert. Mikayla Khramov, a singer-songwriter based in Los Angeles, found hers at a horse rescue in Moorpark, California. He is called Yupia, he is seven years old and Kentucky-bred, and he is about to appear on her first album.",
            "Khramov began volunteering at the rescue in 2023. Yupia was wary of people, and she spent nine months getting to know him, often by playing music in his company. “Music was the tool to help build trust,” she said.",
            "Then something unexpected happened. Yupia began wandering over while she played, nuzzling and chomping at the strings of her guitar and harp, and making sounds of his own. “He comes over and is participating with me,” she said. “I didn't give him treats or anything. It was kind of a miracle how it happened.”",
            "Those sounds are now part of the record, which blends folk and electronic music with Portuguese musicians and, of course, one horse. She was aiming to have it finished this autumn.",
            "Working with Yupia has changed how she feels about her job. “(Yupia) has inspired me to love music again and not treat it like a job or just a way to make money,” she said. She also told USA Today: “This is what music should be about. And I don't want to do anything without my horse now.”",
            "Yupia has not yet given any interviews, though he is said to be very open to carrots.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/a-real-rockin-horse-rescue-foal-learns-to-play-instruments-for-album-debut/",
          image: {
            file: "/editions/45/horse-album.jpg",
            alt: "A horse nosing the strings of a guitar held by Mikayla Khramov",
            credit: "Mikayla Khramov",
            from: "https://www.goodnewsnetwork.org/a-real-rockin-horse-rescue-foal-learns-to-play-instruments-for-album-debut/",
          },
        },
        {
          slug: "jurassic-grasshopper-songs",
          slot: "feature",
          kicker: "Ancient sounds",
          headline:
            "Scientists recreate the songs of grasshoppers that chirped 165 million years ago",
          dek: "They are the oldest sounds anyone has reproduced, and one species sang too high for us to hear.",
          body: [
            "The Middle Jurassic was not a quiet place. A team led by Thorin Jonsson of the University of Graz, working with colleagues in Lincoln, Bristol, Beijing and Tempe, has rebuilt the mating calls of nine grasshopper species that lived in what is now Inner Mongolia about 165 million years ago.",
            "Using the fine detail preserved in fossilised wings, the parts the insects rubbed together to sing, and computer modelling, they worked out what each one sounded like. The results, published in PNAS, are the oldest sounds ever reproduced.",
            "“Our findings reveal a wide variety of call frequencies. Several species produced pure, low-pitched sounds like modern crickets,” said Jonsson. One, Sigmaboilus peregrinus, sang at 20 to 22 kilohertz, above what most human ears can hear. The dinosaurs had the best seats in the house.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/scientists-recreated-chirps-of-jurassic-insects-simulating-a-165-million-yo-soundscape-listen/",
          image: {
            file: "/editions/45/jurassic-grasshopper-songs.jpg",
            alt: "A fossilised Jurassic grasshopper wing with its sound-making veins",
            credit: "Jun-Jie Gu et al., PNAS 2026",
            from: "https://www.goodnewsnetwork.org/scientists-recreated-chirps-of-jurassic-insects-simulating-a-165-million-yo-soundscape-listen/",
          },
        },
        {
          slug: "confetti-cannon-encore",
          slot: "brief",
          kicker: "Gigs",
          headline:
            "Band's confetti cannon fires backwards, covering only the band, who play on regardless",
          dek: "The crowd, entirely confetti-free, called it the encore of the summer.",
          body: [
            "A helpful stagehand had turned the cannon round ‘out of the way’. When drummer Obi Castellanos of the Paper Moons stamped the pedal, nine kilos of purple tissue buried all four members. They finished the song. “We're going to have to do it on purpose now,” said singer Marisol Quaye. The stagehand has been promoted to Head of Cannon.",
          ],
          source: "Music Notes (sample)",
        },
        {
          slug: "saturday-cartoon-club",
          slot: "brief",
          kicker: "Cinema",
          headline:
            "Town cinema revives its Saturday-morning cartoon club, and the parents outnumber the children",
          dek: "Tickets cost one coin, the toast is free, and the adults do most of the cheering.",
          body: [
            "The Palace Picturehouse in Quillan Quay ran a cartoon club from 1958 to 1989. Its new owner, Dev Ramaswamy, has brought it back: two hours of old cartoons from 9am. The first morning drew 212 people, only 71 of them children. One man brought his ticket stub from 1986.",
          ],
          source: "Screen Times (sample)",
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "weekend-picnic-game",
          slot: "feature",
          kicker: "Indie",
          headline:
            "A puzzle game about packing the perfect picnic basket is this weekend's favourite download",
          dek: "There are 80 levels. The watermelon never fits.",
          body: [
            "‘Hamper’ gives you a wicker basket, a gingham blanket and a pile of food, and asks you to get everything in. Sandwiches stack. Grapes squash if you put the flask on them. The cake must stay upright. The watermelon, famously, does not fit, and the game's designers say it never will.",
            "It was made by Tomasz and Aroha Wiśniewski-Parata, a married couple in the harbour town of Otamira Bay, who say they argued about picnic packing every summer for fifteen years before realising the argument was a game. “He's a stacker, I'm a squeezer,” said Aroha. “We built both styles in. The game is basically our marriage, but with scones.”",
            "Since its release last Saturday, ‘Hamper’ has been downloaded 1.3 million times, and weekend forums are full of people posting their solutions to level 44, which involves a trifle. The most popular answer puts the trifle in first and builds everything else around it, like a very anxious castle.",
            "Players who pack a flask in every basket for a week unlock a secret level. The developers will only say that it contains ‘a very good view’. Those who have found it describe a clifftop, a sunset and a tartan rug, with nothing to pack at all.",
            "There is no timer and no score, just a small satisfied sigh from the basket when the lid closes. The couple say they have finally stopped arguing about real picnics. They now argue about the sequel, which is about loading a dishwasher.",
          ],
          source: "Indie Arcade (sample)",
          photo: ["picnic", 0],
        },
        {
          slug: "laundrette-arcade",
          slot: "feature",
          kicker: "Arcades",
          headline: "Laundrette plugs in an old arcade cabinet, and Saturday washes boom",
          dek: "One wash takes 38 minutes. The high score takes longer.",
          body: [
            "When Farida Osei took over the Suds & Spin laundrette in Cranmoor, she found a 1980s arcade cabinet under a dust sheet in the back room. She had it repaired and plugged it in between the dryers. It plays one game, about a penguin delivering parcels across an ice floe.",
            "Saturday mornings now bring a queue. Customers time their washes around their games, and the high-score board is covered in initials from people who are, technically, only there for their socks. “I've had people bring in one towel,” said Osei. “One. They're not here for the towel.”",
            "The current champion, a retired bus driver known only as GUS, sets a new score most weeks, then folds his laundry very neatly.",
          ],
          source: "Coin-Op Chronicle (sample)",
          photo: ["arcade", 1],
        },
        {
          slug: "crowd-designed-level",
          slot: "brief",
          kicker: "Community",
          headline: "Players design a puzzle game's final level by voting one tile at a time",
          dek: "It took eleven weeks and features a surprising number of ducks.",
          body: [
            "The makers of ‘Tilewright’ let their community pick every square of the last level, one daily vote at a time. The finished level, released on Friday, is fiendish, beautiful and contains 14 decorative ducks, which were never on the ballot. The developers have decided not to ask.",
          ],
          source: "Save State (sample)",
        },
        {
          slug: "handheld-club-in-the-park",
          slot: "brief",
          kicker: "Clubs",
          headline: "Handheld-console club meets by the boating lake every Saturday to swap games",
          dek: "Members bring their oldest machine and a spare pair of batteries.",
          body: [
            "The Pocket Players of Lindenbrook started with four friends and a bench in 2023. Now about sixty people turn up each week with old handhelds, trading cartridges and tips. The club's oldest member is 81 and holds its top score on a game about stacking falling blocks.",
          ],
          source: "Save State (sample)",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "parkrun-in-pyjamas",
          slot: "feature",
          kicker: "Running",
          headline: "Saturday-morning fun run held in pyjamas draws its biggest field in 15 years",
          dek: "The winner wore slippers. Organisers are reviewing the rules, though not very seriously.",
          body: [
            "Every October, the weekly five-kilometre run around Oakhollow Park has a pyjama day. Most weeks it attracts about 250 runners in proper kit. Last Saturday 740 turned up in nightwear: flannel, silk, onesies, a dinosaur, three families in matching sets and one man in a full-length nightshirt and cap, carrying a candle in a holder (unlit; the marshals checked).",
            "The run was won in 19 minutes 40 seconds by Kwame Asante-Byrne, 34, in striped pyjamas and sheepskin slippers. He insists the slippers were not a gimmick. “I've been training in them all summer,” he said. “They're grippier than you'd think, and my feet were very happy.”",
            "The first woman home, Freya Lindahl, 52, ran in a dressing gown with the belt tied twice. The youngest finisher was four, and completed the course on her father's shoulders, asleep for most of it, which the organisers ruled was entirely in the spirit of the event.",
            "Race director Tunde Okafor says there is only one rule: you must look as though you have just got out of bed. “We don't check,” he said. “But you can tell.” Marshals wore bed-head wigs, and the finish funnel was lined with pillows for anyone who wanted a lie-down afterwards. About forty people did.",
            "The post-race cocoa, served from a trestle table by the bandstand, ran out in eleven minutes. Organisers have ordered double for next year, and are considering a separate category for slippers.",
          ],
          source: "Finish Line (sample)",
        },
        {
          slug: "jimothy-salmon-race",
          slot: "feature",
          kicker: "Baseball",
          headline: "Jimothy the raccoon gatecrashes the Mariners' salmon race and wins it",
          dek: "Since the raccoon took the field, Seattle have scored 18 runs and let in five.",
          body: [
            "In July, a raccoon filmed wandering around Seattle's Ballard neighbourhood became a national star within days. The woman who filmed him named him Jimothy, because, she said, he “just looked like a Jimothy to me.”",
            "The Seattle Mariners noticed. During the fourth inning of their game against the Giants at T-Mobile Park, a raccoon mascot joined the ballpark's regular Salmon Run, a race between four costumed fish called King, Silver, Sockeye and Humpy. The salmon got tangled up at the turn. Jimothy took the chequered flag to a roar from the crowd, while the scoreboard told everyone to make noise for him.",
            "The team had scored no runs at all in their first 12 innings after the All-Star break. Since Jimothy's win, they have outscored their opponents 18–5 and won three in a row.",
          ],
          source: "MLB.com",
          sourceUrl: "https://www.mlb.com/news/jimothy-the-raccoon-wins-mariners-salmon-race",
          image: {
            file: "/editions/45/jimothy-salmon-race.jpg",
            alt: "A raccoon mascot breaking the finishing tape ahead of costumed salmon at T-Mobile Park",
            credit: "MLB.com",
            from: "https://www.mlb.com/news/jimothy-the-raccoon-wins-mariners-salmon-race",
          },
        },
        {
          slug: "beach-volleyball-seagull",
          slot: "brief",
          kicker: "Beach",
          headline: "Beach volleyball final paused when a seagull steals the ball for a go",
          dek: "Both teams agreed the gull had a nice touch.",
          body: [
            "The Selkie Bay Open final was level at 19–19 when a herring gull picked up the ball by its valve and walked off. The umpire checked the rulebook, which does not mention gulls. The bird bounced the ball twice with its beak and left it by a sandcastle. The point was replayed, to applause.",
          ],
          source: "Sunday League Weekly (sample)",
        },
        {
          slug: "crazy-golf-champion",
          slot: "brief",
          kicker: "Golf, sort of",
          headline:
            "Nine-year-old wins the seaside crazy-golf championship with a charity-shop putter",
          dek: "It cost her two coins and has a small dent she calls ‘lucky’.",
          body: [
            "Ada Okwuosa beat 180 players, including four-time champion Bernard Fisk, at the Pebble Point Crazy Golf Classic. She went round all 18 holes, including the windmill, the volcano and the notoriously sloping pirate ship, in 31 shots. Fisk shook her hand and asked where she had got the putter.",
          ],
          source: "Finish Line (sample)",
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "kansas-sea-monster-fossil",
          slot: "feature",
          kicker: "Fossils",
          headline: "Twelve-year-old on a field trip says ‘whoa’ and finds a 15-foot sea monster",
          dek: "The Tylosaurus swam over Kansas about 85 million years ago, when the state was under the sea.",
          body: [
            "Kansas is about as far from the ocean as you can get in the United States. But around 85 million years ago it lay under a warm, shallow sea, and one of the biggest things swimming in it was Tylosaurus, a marine reptile with a long snout and a powerful tail that could grow longer than a minibus.",
            "Corbin Bullard, 12, from Sedgwick County, found one. He was on a field trip to Jewell County with his 4-H geology club when he drifted away from the group. “I wandered off, and I saw the vertebra sticking out of the ground,” he said. His mother, Wendy Bullard, remembers the moment: “He just looked down, and he said, ‘Whoa.’”",
            "At first they could see seven or eight large vertebrae. Getting the rest out took three more trips, each a three-hour drive each way. “Luckily, the rest of it was there,” said Wendy. “By the third trip, we found the skull.” Laid out, the skeleton measures more than 15 feet.",
            "Corbin wants to be a palaeontologist, and he has already started behaving like one, giving talks about the find at his local library and showing it off at the county fair.",
            "His mother is clear about who deserves the credit. “The whole reason any of this is possible is because of the 4-H club,” she said. The club is now planning more field trips.",
          ],
          source: "FOX Weather",
          sourceUrl:
            "https://www.foxweather.com/lifestyle/kansas-boy-80-million-year-old-fossil-field-trip",
          image: {
            file: "/editions/45/kansas-sea-monster-fossil.jpg",
            alt: "Corbin Bullard beside the Tylosaurus fossil he found in Kansas",
            credit: "Wendy Bullard / FOX Weather",
            from: "https://www.foxweather.com/lifestyle/kansas-boy-80-million-year-old-fossil-field-trip",
          },
        },
        {
          slug: "otters-kitchen-table-rock",
          slot: "feature",
          kicker: "Animals",
          headline: "Sea otters in one cove have shared the same shell-cracking rock for 40 years",
          dek: "Researchers think mothers show it to their pups, like the good tin opener in the drawer.",
          body: [
            "On the shore of Kelpie Cove there is a flat grey rock the size of a coffee table. Marine biologist Dr Nia Tawhiri and her students have spent three years watching the cove's 60 or so otters queue, politely, to crack clams on it; its surface is worn into a shallow dip. A local fishing family's photos show otters using it in 1984.",
            "“Every pup we've watched has been brought to the rock by its mum,” said Tawhiri. The students have named it the Kitchen Table. Up to eleven otters have been seen waiting their turn offshore, floating in a raft and holding paws. The council has agreed to mark it on the local map, though the otters clearly already know where it is.",
          ],
          source: "Coastal Notes (sample)",
          photo: "otters",
        },
        {
          slug: "black-eye-galaxy",
          slot: "brief",
          kicker: "Space",
          headline: "The James Webb telescope takes a close look at the Black Eye Galaxy",
          dek: "Its inside and outside spin in opposite directions, and stars are born where they meet.",
          body: [
            "Galaxy M64 is nicknamed for the dark band of dust across its bright centre. In Webb's new infrared picture, that dust glows red, warmed by newborn stars. Its inner and outer gas turn in opposite directions, probably the result of swallowing a smaller galaxy long ago, and new stars form where the two currents meet.",
          ],
          source: "NASA Astronomy Picture of the Day",
          sourceUrl: "https://apod.nasa.gov/apod/ap260916.html",
        },
        {
          slug: "bee-bus-shelters",
          slot: "brief",
          kicker: "Bees",
          headline: "Town's plant-roofed bus shelters now host 31 species of wild bee",
          dek: "The number 7 stop is the most popular. It has the most clover.",
          body: [
            "Five years ago, Veldhaven planted wildflowers on the roofs of its 42 bus shelters. Volunteers counted 31 species of wild bee using them this summer, up from nine. The busiest roof, at the stop outside the primary school, had so many visitors that the printed timetable now includes a small drawing of a bee.",
          ],
          source: "Field Notes (sample)",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "doorbell-plays-guess-the-tune",
          slot: "feature",
          kicker: "Makers",
          headline:
            "Teenager's homemade doorbell plays a mystery tune, and visitors guess it to come in",
          dek: "The postman is on a nine-day winning streak. The grandparents are struggling.",
          body: [
            "Press the doorbell at 14 Juniper Close in Wexby and a small speaker in the porch plays five seconds of a song. Guess it correctly through the letterbox and a green light comes on above the door. Guess wrong and you are still let in, but the light turns a disappointed orange.",
            "The bell was built over the summer holidays by Nadia Ferrand, 15, from a small single-board computer, a salvaged speaker, a microphone and a free library of 4,000 old tunes that are out of copyright. It took her six weeks, and one very long weekend of teaching the microphone to understand her grandad's accent.",
            "“I just wanted the doorbell to be less boring,” she said. “Now everyone who comes to the house is a contestant. The man who reads the water meter gets really into it.”",
            "The family keep a scoreboard on the fridge. The postman, Jamal Whitcombe, is on a nine-day streak and has started humming on the garden path to warm up. Nadia's grandmother, who visits every Saturday, has not got one right yet, though she did once identify a tune as ‘something with a trumpet’, which the family allowed.",
            "Nadia has shared her code online, and says around 200 people have built their own. Her next project is a letterbox that tells a joke when the post arrives.",
          ],
          source: "Maker Monthly (sample)",
        },
        {
          slug: "pocket-fish-tank",
          slot: "feature",
          kicker: "Gadgets",
          headline: "A maker built a digital fish tank small enough to carry in your pocket",
          dek: "No water, no wet hands, and the fish decide for themselves what to do next.",
          body: [
            "The Pocket Tank, by a maker who goes by StratoBuilds, is a virtual aquarium on a small ESP32-S3 board with a bright 1.8-inch touchscreen, in a plastic case about the size of a matchbox.",
            "The fish glide around at 25 to 30 frames a second, and their choices are made by a tiny custom language model that runs on the chip itself. It watches the tank and changes each fish's goals as it goes, so one might go exploring while another hangs about near the plants.",
            "Like the pocket pets of the 1990s, it needs looking after: you feed the fish and clean the tank. The design files are free on GitHub, so anyone can build a tank of their own.",
          ],
          source: "Hackaday",
          sourceUrl: "https://hackaday.com/2026/09/26/a-pocket-sized-digital-fish-tank/",
          image: {
            file: "/editions/45/pocket-fish-tank.jpg",
            alt: "A small touchscreen gadget showing a colourful virtual aquarium",
            credit: "StratoBuilds, via Hackaday",
            from: "https://hackaday.com/2026/09/26/a-pocket-sized-digital-fish-tank/",
          },
        },
        {
          slug: "freewheel-hill-app",
          slot: "brief",
          kicker: "Apps",
          headline: "Free app ranks city hills by how long you can freewheel down them",
          dek: "The winner is 1.4 kilometres, with an ice-cream kiosk at the bottom.",
          body: [
            "‘Wheee’, built by two cycle couriers in Montaval, uses riders' shared GPS traces to rank descents by coasting time. Top of the list is Via Serena: nearly three minutes without pedalling. The couriers say the app is for weekend rides only, a rule they admit they made mostly for themselves.",
          ],
          source: "Maker Monthly (sample)",
        },
        {
          slug: "is-it-the-weekend-display",
          slot: "brief",
          kicker: "Gadgets",
          headline: "A tiny e-ink screen answers just one question: is it the weekend yet?",
          dek: "Today it says YES, in very large letters.",
          body: [
            "Hobbyist Marcus Oyelowo of Tern Harbour built the fridge-magnet-sized gadget from a spare display and a coin battery that should last three years. From Monday to Friday it reads NO, with a small daily note on how far off Saturday is. This morning it says YES. He has sold 600 kits.",
          ],
          source: "Maker Monthly (sample)",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "stamp-card-no-reward",
          slot: "feature",
          kicker: "Small business",
          headline:
            "Coffee kiosk's loyalty card has no reward, just stamps, and everyone is collecting them",
          dek: "There is a new design every week. People swap them on the tram.",
          body: [
            "Most loyalty cards promise a free coffee after ten. The card at Kiosk Número Nueve, a coffee hatch by the tram stop in Alcaraz Viejo, promises nothing at all. You buy a coffee, you get a stamp. That is it: no points, no tiers, no app.",
            "The stamps are the point. Owner Rosa Etxeberria carves a new rubber stamp every Sunday evening at her kitchen table (a tiny sun, a cat in a hat, a tram, a lemon, a very small and cross-looking pigeon) and uses it only for that week. After three years there are 150 designs, and the tram stop has become a trading floor.",
            "“People swap them on the tram,” said Etxeberria. “A man once offered me a bicycle for the pigeon. I said no. The stamp isn't mine to sell, it's the customer's.”",
            "Regulars plan their week around the reveal on Monday mornings, and one retired teacher has not missed a stamp in 156 weeks. Collectors keep their cards in albums, and the local school runs a stamp-spotting quiz. A complete year's set sold at the town's summer fair for 210, more than most regulars spend on a year of coffee.",
            "She has been asked many times why the card has no reward. The question has never quite made sense to her. “You got a coffee,” she said. “And a lemon.”",
          ],
          source: "High Street News (sample)",
          photo: ["coffee", 0],
        },
        {
          slug: "raincoat-pikachu-card",
          slot: "feature",
          kicker: "Collectibles",
          headline: "A card of Pikachu in a raincoat sells for $8.4 million",
          dek: "Only 100 copies were ever printed, and none of them were sold in shops.",
          body: [
            "In the winter of 2014, the Pokémon Art Academy ran an illustration contest. One of its categories was ‘Dress-Up Pikachu’, and the winner, an artist named Y. Fujishima, drew the little yellow creature in a red raincoat and cap, holding an umbrella in a thunderstorm.",
            "The winning picture was printed as a trading card, but only 100 copies were made, and all of them went to the artist. None were ever sold to the public. On 27 September, one in perfect condition, graded PSA 10, sold through Fanatics Collect for $8,400,000 after 64 bids.",
            "That makes it the second most expensive Pokémon card ever sold. The most expensive, the Pikachu Illustrator card, went for $16.4 million earlier this year. Both, it turns out, are drawings of Pikachu. He is doing very well.",
          ],
          source: "CBR",
          sourceUrl: "https://www.cbr.com/pokemon-tcg-second-highest-sale-fujishima-pikachu/",
        },
        {
          slug: "single-item-market",
          slot: "brief",
          kicker: "Markets",
          headline: "At this Saturday flea market, every stall may sell exactly one thing",
          dek: "It makes for very short browsing and very long conversations.",
          body: [
            "Kettleby's Single Item Market has 60 stalls, each with one object on it (a lamp, a tuba, a jar of buttons, a surprisingly good armchair) and a seller whose job is to tell you its story. Most things sell by lunchtime. The tuba is on its fourth month, and is said to be close.",
          ],
          source: "High Street News (sample)",
        },
        {
          slug: "sticker-interest-bank",
          slot: "brief",
          kicker: "Banking",
          headline: "Pupil-run pocket-money bank pays its savers interest in stickers",
          dek: "This term's rate is one sparkly star per ten coins, per month.",
          body: [
            "The oldest pupils at Fernhill School in Brookmere run a savings scheme for younger ones, with a ledger, a locked tin and a weekly ‘bank manager’ chosen by rota. Deposits have reached 1,480 in coins. The sticker interest has proved so popular that the head teacher has asked to open an account.",
          ],
          source: "Pocket Money Times (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "tidy-shelf-videos",
          slot: "feature",
          kicker: "Video",
          headline:
            "Hour-long videos of one woman tidying a single shelf have become the internet's lullaby",
          dek: "No talking, no music, just the soft click of books being straightened.",
          body: [
            "Each video begins the same way: a slightly untidy bookshelf in a flat in Harrowgate Quay, filmed from the front in warm lamplight. Over the next hour, a pair of hands takes everything off one shelf, dusts it, and puts it all back, better.",
            "There is no talking and no music. You hear the tap of a spine being squared up, the soft drag of a cloth and the small click of a bookend. Sometimes a teacup appears at the edge of the frame. Once, a cat walked through, and the comments talked about nothing else for a week.",
            "The channel, Shelf Life, belongs to Imke Vandersloot, 38, a picture framer who started filming two years ago to help herself concentrate. It now has 900,000 subscribers, and the average viewer, she says, watches about 22 minutes before falling asleep.",
            "“At first I thought that was bad,” she said. “Then people started writing to say it was the only thing that worked for them, and now I think of it as the goal. If you get to the end, I haven't done my job.”",
            "Viewers now send her photos of their own shelves to tidy, and the waiting list is 4,000 long. The most requested is a shelf of cookery books with a single sock on it, which she says she is saving for winter.",
          ],
          source: "Around the Web (sample)",
        },
        {
          slug: "security-guard-rhinos",
          slot: "feature",
          kicker: "Crafts",
          headline:
            "Security guard's tiny 3D-printed rhino trophies are the most wanted prize backstage",
          dek: "Staff guess each show's crowd size, and the closest wins a rhino made for the occasion.",
          body: [
            "Bryan Newton works security at Virginia Tech's Center for the Arts, a 1,274-seat hall, for a company called Rhino Sports and Entertainment Services. So when he started a game among the staff, the prize was always going to be a rhino.",
            "Before each event, colleagues guess the size of the audience, using game-show rules: the closest guess without going over wins. The winner gets a small 3D-printed rhino themed for the night, a warrior rhino for a wrestling event or a dancing one for a dance show. Each takes Newton anything from a few hours to twelve to make.",
            "“It brings joy. And it's fun,” he said. “Going through the process and either picking or designing it, it's a nice creative outreach for me.”",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/guard-becomes-celebrity-making-mini-statues-for-each-event-at-virginia-tech-as-free-giveaways/",
          image: {
            file: "/editions/45/security-guard-rhinos.jpg",
            alt: "A row of small 3D-printed rhino statues in different costumes",
            credit: "Bryan Newton, courtesy of Virginia Tech",
            from: "https://www.goodnewsnetwork.org/guard-becomes-celebrity-making-mini-statues-for-each-event-at-virginia-tech-as-free-giveaways/",
          },
        },
        {
          slug: "yellow-door-project",
          slot: "brief",
          kicker: "Photo trends",
          headline: "An online map of cheerful yellow front doors now has 20,000 pins",
          dek: "It began with one freshly painted door and the caption ‘this door has made my week’.",
          body: [
            "Kalani Mahoe posted a neighbour's sunflower-yellow door in June. Someone replied with one from their street, then someone else did. The map now covers 97 countries, with yellow doors on houseboats and mountain huts. The most-visited pin is a yellow door standing on its own in a field.",
          ],
          source: "Around the Web (sample)",
        },
        {
          slug: "shopping-list-reviews",
          slot: "brief",
          kicker: "Accounts",
          headline:
            "An account that reviews shopping lists left in trolleys awards its first five stars",
          dek: "The list said: ‘eggs, flour, sugar, good attitude’.",
          body: [
            "Found Lists, run anonymously from somewhere in Wexmouth, has reviewed 800 abandoned shopping lists in four years, scoring each for handwriting, ambition and plot. The first five-star list, posted this week, was praised for its structure and for crossing off ‘good attitude’ first.",
          ],
          source: "Around the Web (sample)",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "47",
        caption: "the age at which Justin Buzzard made his college football debut",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Saturday: long sunny spells of doing nothing much",
        detail:
          "A lie-in advisory is in place until ten. Scattered crumbs by late morning, turning to patchy confetti over festival fields. Winds light, slippers optional.",
      },
    },
    {
      type: "quote",
      content: {
        text: "Wait. Maybe. What if I did that? Maybe I could do that. What if I tried?",
        by: "Justin Buzzard, 47, on playing college football",
      },
    },
    {
      type: "correction",
      content: {
        text: "Friday's edition said the carrot won the mascot race by one leaf. It was two leaves. The lighthouse has asked us to stop bringing it up.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "A doughnut willing to be passed along eleven bakeries. Must be brave. Jam optional.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FOR SALE",
        text: "One tuba. Fourth month on the stall. Excellent story. Ask at the Single Item Market, Kettleby.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: Want to share a croissant?",
          "PIGEON: How much of it?",
          "PIP: Half?",
          "PIGEON: I was hoping you'd say crumbs. I love crumbs.",
        ],
      },
    },
    {
      type: "sign_off",
      content: { text: "You're done for today. Go and have a lovely Saturday." },
    },
  ],

  puzzles: [
    mini(
      [
        ["TREES", "Where the conkers come from"],
        ["COCOA", "Hot drink after a pyjama fun run"],
        ["SMILE", "What we hope this paper leaves on your face"],
      ],
      [
        ["TACOS", "Folded food, best eaten over a plate"],
        ["STAGE", "Where the confetti ended up, by mistake"],
      ],
    ),
    ladder(["FOUR", "FOUL", "FOOL", "FOOT", "FORT", "FORE", "FIRE", "FIVE"]),
    riddle("What has one eye but can't see?", "A needle"),
  ],
};
