// Issue 38, Saturday 26 September 2026. A weekend tabloid: a little slower, a little sillier.
// Every story is real, rewritten in our own words from the linked source.
import type { SeedEdition } from "../types.ts";

export const issue38: SeedEdition = {
  issueNumber: 38,
  date: "2026-09-26",
  status: "published",
  design: "tabloid",
  colourway: "carousel",

  front: [
    {
      slug: "benin-reef-alive",
      section: "week-in-10",
      kicker: "Ocean",
      headline: "A coral reef written off as ‘probably dead’ in the 1960s is full of fish",
      dek: "Scientists followed sixty-year-old survey notes to the seabed off Benin and found corals, snappers and angelfish waiting for them.",
      body: [
        "Some discoveries begin with a new machine. This one began with an old note.",
        "In the 1960s, surveyors looking for good fishing grounds off the coast of Benin, in West Africa, came across a reef more than 50 metres below the surface. They recorded it in their reports and concluded that it was probably dead. For the next six decades, that was more or less the end of the matter.",
        "Gérard Zinzindohoué, of Benin's Institut de Recherches Halieutiques et Océanologiques, could not stop thinking about it. So his team went back to look, armed with sonar, an underwater drone and the Deep Sea Camera System built by the National Geographic Exploration Technology Lab.",
        "They scanned 11.5 kilometres of seafloor and found two reef-like areas. When the cameras went down, they did not show a graveyard. They showed a neighbourhood.",
        "“I still remember seeing those first images,” Zinzindohoué said. “It was a mix of excitement and disbelief, because after all this time thinking about this reef, suddenly there was something real in front of us.”",
        "The footage revealed eight types of coral and eight species of fish going about their business: golden African snappers, blackbar soldierfish, Guinean angelfish, West African goatfish, the Monrovia doctorfish, three-banded butterflyfish and two kinds of damselfish.",
        "The team's study, published in Frontiers in Marine Science, describes what is thought to be the first confirmed living mesophotic coral ecosystem on the continental shelf of the Gulf of Guinea. ‘Mesophotic’ means ‘middle light’: these are reefs deep enough that only a dim blue glow reaches them. And the old records hint that there may be much more down there, including a coral barrier roughly 40 kilometres long running parallel to the coast.",
        "The corals have so far been identified from the camera footage alone, and the next step is to learn much more about them. For Zinzindohoué, that is the exciting part. “It feels like we have only just started to read an archive that has been there for a very long time,” he said.",
        "He has a bigger question, too, for anyone with a box of old surveys in a cupboard. “If we were able to find this reef again after 60 years, how many others are still undocumented or simply forgotten?”",
      ],
      source: "ScienceDaily (Frontiers)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260913081927.htm",
      sticker: "Still here!",
      image: {
        file: "/editions/38/benin-reef-alive.jpg",
        alt: "Underwater image of the rediscovered deep coral reef off Benin",
        credit: "Gérard Zinzindohoué",
        from: "https://www.sciencedaily.com/releases/2026/09/260913081927.htm",
      },
    },
    {
      slug: "crocodile-uv-stripes",
      section: "week-in-10",
      slot: "feature",
      kicker: "Fossils",
      headline:
        "Ultraviolet light shows a 125-million-year-old crocodile may have had a stripy tail",
      dek: "A fossil found more than a century ago in Catalonia still had secrets in the rock.",
      body: [
        "Montsecosuchus depereti was a small crocodile relative, about 50 centimetres long, that lived some 125 million years ago beside a lake in what is now the Catalan Pre-Pyrenees. Its fossil was found more than a century ago and lives at the Museum of Natural Sciences of Barcelona.",
        "When palaeontologists Oscar Castillo and Jesús Serrano shone ultraviolet light on it, soft tissues appeared: scales, possible sensory organs in the skin, and cartilage in the chest that points to an efficient, crocodile-like way of breathing. On the tail, some scales show alternating light and dark bands, which may be the oldest known colour pattern in a crocodylomorph.",
        "“UV light allows us to see details that would otherwise remain completely hidden in the rock,” said Castillo-Visa.",
      ],
      source: "ScienceDaily (Institut Català de Paleontologia)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260914102436.htm",
      image: {
        file: "/editions/38/crocodile-uv-stripes.jpg",
        alt: "The fossil skeleton of Montsecosuchus depereti glowing under ultraviolet light",
        credit: "Castillo-Visa, O. et al.",
        from: "https://www.sciencedaily.com/releases/2026/09/260914102436.htm",
      },
    },
    {
      slug: "cloggs-cave-rituals",
      section: "week-in-10",
      slot: "feature",
      kicker: "Archaeology",
      headline:
        "An Australian cave holds 25,000 years of carefully chosen grasses burned for ritual",
      dek: "Microscopic plant traces show GunaiKurnai ancestors carried grasses into the dark to burn them.",
      body: [
        "Nothing grows inside Cloggs Cave in Victoria, because no light reaches it. So when researchers found half-burnt phytoliths, tiny silica structures left behind by plants, in its ashy layers, they knew people had carried the plants in.",
        "The study, requested by the GunaiKurnai Land and Waters Corporation and carried out with GunaiKurnai representatives, found 73 thin layers of ash laid down between about 4,400 and 1,600 years ago, and evidence of ritual use spanning roughly 25,000 years. Grasses made up as much as 97% of the remains, chosen deliberately rather than gathered at random, and a 28-centimetre standing stone was placed in the cave about 2,000 years ago.",
        "“The Old Ancestors selected whole grasses from the wider landscape and carried them into Cloggs Cave to spread out in thin layers and burn,” said Dr Elle Grono of the Australian National University.",
      ],
      source: "ScienceDaily (Frontiers)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260914102443.htm",
      image: {
        file: "/editions/38/cloggs-cave-rituals.jpg",
        alt: "GunaiKurnai Elder Russell Mullett at the entrance to Cloggs Cave",
        credit: "Jess Shapiro, courtesy of GunaiKurnai Land and Waters Corporation",
        from: "https://www.sciencedaily.com/releases/2026/09/260914102443.htm",
      },
    },
  ],

  inside: [
    {
      section: "week-in-10",
      stories: [
        {
          slug: "walking-robot-hand",
          kicker: "Tech",
          headline: "Swiss engineers build a robot hand that walks about on its fingertips",
          dek: "It crosses grass and gravel, gets itself back up, and plays a puzzle game.",
          body: [
            "At ETH Zurich's Soft Robotics Lab, a five-fingered robot hand with its own battery and computer learned to walk in simulation, then trotted across 14 real surfaces, from carpet to gravel, at about 9 centimetres a second. It righted itself after 21 of 25 falls. For its party trick, it balanced on some fingers and pressed arrow keys with the others to play Sokoban. The Addams Family's Thing would approve.",
          ],
          source: "designboom",
          sourceUrl:
            "https://www.designboom.com/technology/autonomous-robotic-hand-addams-familys-thing-eth-zurich/",
          image: {
            file: "/editions/38/walking-robot-hand.jpg",
            alt: "ETH Zurich's robotic hand standing on its fingertips",
            credit: "ETH Zurich",
            from: "https://www.designboom.com/technology/autonomous-robotic-hand-addams-familys-thing-eth-zurich/",
          },
        },
        {
          slug: "night-breathing-trees",
          kicker: "Discoveries",
          headline:
            "Tropical trees that breathe at night solved a puzzle Humboldt noticed around 1800",
          dek: "Keeping their pores shut in the heat of the day saves precious water.",
          body: [
            "Around 1800, Alexander von Humboldt dropped a tropical leaf in water and saw no oxygen bubbles, even in sunshine. The reason: some Clusia trees keep their pores closed by day and take in carbon dioxide at night, storing it as malic acid. A University of Vienna team led by Wolfram Weckwerth compared three Clusia genomes and found this water-saving trick evolved in several different ways.",
          ],
          source: "ScienceDaily (University of Vienna)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260922005712.htm",
          image: {
            file: "/editions/38/night-breathing-trees.jpg",
            alt: "The large pale flower of a Clusia grandiflora tree",
            credit: "Wolfram Weckwerth",
            from: "https://www.sciencedaily.com/releases/2026/09/260922005712.htm",
          },
        },
        {
          slug: "camping-trip-crater",
          kicker: "Discoveries",
          headline:
            "A man planning a camping trip spots a 390-million-year-old crater on satellite maps",
          dek: "It is the largest impact crater found anywhere since 2018.",
          body: [
            "Amateur astronomer Joël Lapointe was scouting camping spots in Quebec's Côte-Nord in 2024 when a suspicious circle near Lake Marsal caught his eye. Geologist Gordon Osinski led a floatplane expedition last October, wading 50 metres to shore, and found shatter cones that confirm an impact. The crater, about 25 kilometres across, is being called Uhackatik after talks with the Innu Council of Ekuanitshit.",
          ],
          source: "ScienceDaily (Western University)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260921081101.htm",
          image: {
            file: "/editions/38/camping-trip-crater.jpg",
            alt: "Satellite view of the circular Uhackatik impact structure in Quebec",
            credit: "NASA Earth Observatory/Lauren Dauphin",
            from: "https://www.sciencedaily.com/releases/2026/09/260921081101.htm",
          },
        },
        {
          slug: "myst-on-atari",
          kicker: "Play",
          headline: "Fan spends three years getting Myst running on a real Atari 2600 cartridge",
          dek: "The console has 128 bytes of memory, so he borrowed parts from a BurgerTime cartridge.",
          body: [
            "Myst was made for CD-ROM computers; the 1977 Atari 2600 has 128 bytes of RAM, roughly enough for this sentence. A pared-down Myst demake already existed as software, but a fan called Vince wanted it on a real cartridge. He built one from parts of a BurgerTime cartridge, which carried extra memory, and after about three years of timing headaches, the island runs on the real console.",
          ],
          source: "Hackaday",
          sourceUrl: "https://hackaday.com/2026/09/22/myst-on-the-atari-2600/",
          image: {
            file: "/editions/38/myst-on-atari.jpg",
            alt: "Myst running on an Atari 2600",
            credit: "Hackaday",
            from: "https://hackaday.com/2026/09/22/myst-on-the-atari-2600/",
          },
        },
        {
          slug: "dead-star-bow-shock",
          kicker: "Space",
          headline: "A small dead star is pushing a shock wave through space that should not exist",
          dek: "Astronomers suspect a ‘mystery engine’ is at work.",
          body: [
            "The white dwarf RXJ0528+2838, about 730 light-years away, is ploughing a curved arc of gas ahead of it, “similar to the wave that builds up in front of a ship”, as Warwick's Noel Castro Segura puts it. Stars that make these bow shocks usually have a disc of material to power them. This one has none. “We found something never seen before and, more importantly, entirely unexpected,” said Durham's Simone Scaringi.",
          ],
          source: "ScienceDaily (ESO)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260924020410.htm",
          image: {
            file: "/editions/38/dead-star-bow-shock.jpg",
            alt: "A glowing arc of gas around the dead star RXJ0528+2838",
            credit: "ESO/K. Iłkiewicz and S. Scaringi et al. Background: PanSTARRS",
            from: "https://www.sciencedaily.com/releases/2026/09/260924020410.htm",
          },
        },
        {
          slug: "lemur-opera-trick",
          kicker: "Music",
          headline: "Singing lemurs hit high notes using a trick taught to opera singers",
          dek: "The wider the mouth, the higher the note, frame by frame.",
          body: [
            "Researchers from Warwick, Turin and Madagascar tracked the lips of 19 wild indris in 83 videos and found they use ‘formant tuning’, shaping their mouths to boost high notes. “Every time the pitch of an indri's song rose, we could see its mouth opening wider, frame by frame,” said Dr Chiara De Gregorio.",
          ],
          source: "Classic FM",
          sourceUrl: "https://www.classicfm.com/music-news/lemurs-sing-opera-trick-high-notes/",
          image: {
            file: "/editions/38/lemur-opera-trick.jpg",
            alt: "A singing indri lemur beside Luciano Pavarotti mid-aria",
            credit: "classicfm.com",
            from: "https://www.classicfm.com/music-news/lemurs-sing-opera-trick-high-notes/",
          },
        },
        {
          slug: "daisy-chain-robot",
          kicker: "Tech",
          headline: "A student builds a robot called Daisy whose only job is making daisy chains",
          dek: "It threads each stem through the last, then slices a neat hole for the next.",
          body: [
            "For his final student project, Jude Robinson built Daisy, a pair of facing gantries with grippers, a conveyor of flowers and a sheathed scalpel. One gripper threads a daisy's stem through the previous flower, then lifts it to the blade for a small slit, and the two sides take turns. V-shaped grippers centre stems of any size, which turned out to be the secret of doing it reliably.",
          ],
          source: "Hackaday",
          sourceUrl: "https://hackaday.com/2026/09/24/robot-makes-literal-daisy-chains/",
          image: {
            file: "/editions/38/daisy-chain-robot.jpg",
            alt: "The Daisy robot's gripper holding a chain of small white daisies",
            credit: "Jude Robinson, via Hackaday",
            from: "https://hackaday.com/2026/09/24/robot-makes-literal-daisy-chains/",
          },
        },
        {
          slug: "mazda-suitcase-car",
          kicker: "Wheels",
          headline:
            "Builders recreate Mazda's 1991 suitcase car, and theirs is faster than the original",
          dek: "Only one of the three prototypes survives, so they made their own.",
          body: [
            "In 1991 Mazda built three prototype go-karts inside Samsonite suitcases. Only one survives, in a collector's hands, so a builder called Bucket made a replica, using a tiny pocket-rocket motor and a welded aluminium frame. It hit 33 km/h, beating the original's quoted top speed, before the driver decided that was quite fast enough. At 56.8 lb it is nearly light enough for the airline limit.",
          ],
          source: "Hackaday",
          sourceUrl: "https://hackaday.com/2026/09/21/the-mazda-suitcase-car-rides-again/",
          image: {
            file: "/editions/38/mazda-suitcase-car.jpg",
            alt: "A man in a suit riding the replica Mazda suitcase car across a car park",
            credit: "Bucket, via Hackaday",
            from: "https://hackaday.com/2026/09/21/the-mazda-suitcase-car-rides-again/",
          },
        },
        {
          slug: "stellar-stream-beyond",
          kicker: "Space",
          headline:
            "Astronomers spot a ribbon of stars trailing through another galaxy for the first time",
          dek: "These faint streams could help map the invisible dark matter around galaxies.",
          body: [
            "Globular cluster stellar streams are long, faint trails of stars that respond to gravity, making them handy tracers of dark matter. Until now, none had been seen outside the Milky Way. A team led by PhD student Julie Kiel Holm of the Niels Bohr Institute and Sarah Pearson of DTU Space found one in an ultra-diffuse galaxy using Hubble data, and published it in Nature.",
          ],
          source: "ScienceDaily (Niels Bohr Institute)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260921081110.htm",
          image: {
            file: "/editions/38/stellar-stream-beyond.jpg",
            alt: "A Hubble image of a faint galaxy with a thin stream of stars",
            credit: "Hubble Space Telescope and Holm et al. (2026)",
            from: "https://www.sciencedaily.com/releases/2026/09/260921081110.htm",
          },
        },
        {
          slug: "cretaceous-rabbit",
          kicker: "Fossils",
          headline:
            "A ‘Cretaceous rabbit’ from the Gobi shows scientists misread its family for 40 years",
          dek: "Its teeth told one story; the rest of the skeleton told another.",
          body: [
            "For nearly 40 years, zhelestids were known mostly from teeth, which suggested they were early cousins of today's placental mammals. Then came Tamirkhan balcarceli, the most complete one ever found, spotted in 2004 by Andres Giallombardo as a graduate student. About 15 centimetres long, with long hind legs and ever-growing incisors, it belongs to a different branch entirely. “It was the thrill of a career,” he said.",
          ],
          source: "ScienceDaily (American Museum of Natural History)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260925093204.htm",
          image: {
            file: "/editions/38/cretaceous-rabbit.jpg",
            alt: "The fossil skull of Tamirkhan balcarceli",
            credit: "American Museum of Natural History, via ScienceDaily",
            from: "https://www.sciencedaily.com/releases/2026/09/260925093204.htm",
          },
        },
      ],
    },
    {
      section: "weekend-guide",
      stories: [
        {
          slug: "shaun-mossy-bottom",
          kicker: "In cinemas",
          headline:
            "Shaun the Sheep puts on goggles for a Halloween film about a ruined pumpkin patch",
          dek: "The Beast of Mossy Bottom is Aardman's third Shaun feature, and it is in cinemas now.",
          body: [
            "Halloween has come early to Mossy Bottom Farm. Shaun the Sheep: The Beast of Mossy Bottom, the third feature film starring Aardman's most mischievous sheep, opened in cinemas on 18 September, released by Sky in the UK and by GKIDS across the United States, with STUDIOCANAL handling the rest of the world. If you are after a family trip to the pictures this weekend, this is the one.",
            "The flock has been looking forward to Halloween, until the Farmer, clumsy as ever, flattens their beloved pumpkin patch. Shaun decides the answer is science and turns mad scientist to put things right. Naturally, this goes wonderfully wrong: the Farmer vanishes and a wild beast starts roaming the woods of Mossingham. The result is billed as “a monstrously fun family adventure”.",
            "The film is written by Mark Burton and Giles Pilbrow. Burton wrote the Oscar-winning Wallace and Gromit: The Curse of the Were-Rabbit and directed the Oscar-nominated Shaun the Sheep Movie, so the flock is in experienced hands. Directing are Steve Cox and Matthew Walker, both making their feature debut.",
            "Familiar voices are back too. Justin Fletcher once again provides the bleats of Shaun and the flock, joined by John Sparkes and Kate Harbour. The characters were created by Nick Park, the man behind Wallace and Gromit.",
            "The new film follows two earlier Shaun features, from 2015 and 2020, and both of those were nominated for Academy Awards. That is a high bar for a sheep in goggles, but the pumpkin-patch plot, the beast in the woods and a mad-science sheep sound like exactly the right ingredients for a half-term favourite.",
          ],
          source: "Animation Scoop",
          sourceUrl:
            "https://www.animationscoop.com/gkids-to-release-next-shaun-the-sheep-movie-the-beast-of-mossy-bottom-september-18th/",
          image: {
            file: "/editions/38/shaun-mossy-bottom.jpg",
            alt: "Shaun the Sheep wearing goggles, with Bitzer and the flock behind him",
            credit: "Aardman, via Animation Scoop",
            from: "https://www.animationscoop.com/gkids-to-release-next-shaun-the-sheep-movie-the-beast-of-mossy-bottom-september-18th/",
          },
        },
        {
          slug: "goleta-lemon-festival",
          kicker: "Festivals",
          headline:
            "California's Goleta Lemon Festival serves up pie-eating, two stages and a lemon mascot",
          dek: "Entry is free, and the pie contest starts at noon on both days.",
          body: [
            "If you find yourself near Santa Barbara this weekend, the Goleta Lemon Festival is back at Girsh Park on Saturday and Sunday, from 10am to 6pm, and entry is free.",
            "There are two stages of live music, from rock and country to blues and funk, with Area 51 closing Saturday and Goodlanders closing Sunday. The pie-eating contest is at noon each day, and the 19th Goleta Fall Classic Car Show hands out its awards on Saturday afternoon. Children can ride a mechanical dragon, try an archery arcade and meet Zesty, the festival's lemon mascot.",
            "To eat: lemon meringue pie, lemon bars and lemonade, naturally, with coffee, pizza, hot dogs and burgers from local stalls for anyone who has had enough citrus. The festival is run by an 18-strong volunteer committee and is the biggest yearly fundraiser for more than 30 local nonprofits.",
          ],
          source: "Santa Barbara Independent",
          sourceUrl:
            "https://www.independent.com/2026/09/23/goleta-lemon-festival-returns-september-26-and-27-for-a-weekend-of-music-pie-and-fun/",
          image: {
            file: "/editions/38/goleta-lemon-festival.jpg",
            alt: "Crowds enjoying the Goleta Lemon Festival in the sunshine",
            credit: "Santa Barbara Independent",
            from: "https://www.independent.com/2026/09/23/goleta-lemon-festival-returns-september-26-and-27-for-a-weekend-of-music-pie-and-fun/",
          },
        },
        {
          slug: "ghibli-steelbooks",
          kicker: "Watch at home",
          headline:
            "Fifteen Studio Ghibli classics come back in shiny metal cases for the collectors' shelf",
          dek: "Totoro, Kiki and Ponyo all get the SteelBook treatment on Tuesday.",
          body: [
            "Planning a cosy night in? On 29 September, 15 Studio Ghibli films return in limited SteelBook editions, many with DVD and Blu-ray discs plus interviews and extras. Totoro, Kiki's Delivery Service, Spirited Away, Princess Mononoke, Porco Rosso, Ponyo and The Tale of the Princess Kaguya are all there. Pre-order prices run from under $20 to about $34.",
          ],
          source: "Parenting Patch, via Yahoo",
          sourceUrl:
            "https://www.yahoo.com/entertainment/movies/articles/studio-ghibli-releasing-15-classic-181300908.html",
          image: {
            file: "/editions/38/ghibli-steelbooks.jpg",
            alt: "Rows of colourful Studio Ghibli SteelBook cases",
            credit: "Parenting Patch",
            from: "https://www.yahoo.com/entertainment/movies/articles/studio-ghibli-releasing-15-classic-181300908.html",
          },
        },
        {
          slug: "portola-pier-80",
          kicker: "Festivals",
          headline:
            "Robyn, Tiësto and Swedish House Mafia play San Francisco's Portola festival by the bay",
          dek: "The dance festival's fifth edition takes over Pier 80 on Saturday and Sunday.",
          body: [
            "Goldenvoice's over-21 Portola festival returns to San Francisco's Pier 80 this weekend for its fifth edition, with doors at 1pm each day. Robyn, Dog Blood, Swedish House Mafia, Zara Larsson, Tiësto, Four Tet, Tove Lo and Soulwax lead the bill, Fatboy Slim is on too, DJ Shadow marks 30 years of his album, and the Despacio sound system runs all weekend.",
          ],
          source: "Magnetic Magazine",
          sourceUrl: "https://magneticmag.com/2026/09/portola-2026-lineup/",
          image: {
            file: "/editions/38/portola-pier-80.jpg",
            alt: "A musician silhouetted on stage at Portola at dusk",
            credit: "Portola, via Magnetic Magazine",
            from: "https://magneticmag.com/2026/09/portola-2026-lineup/",
          },
        },
      ],
    },
    {
      section: "sports-weekend",
      stories: [
        {
          slug: "berlin-marathon-sunday",
          kicker: "Running",
          headline: "More than 56,000 people from 162 nations line up for Sunday's Berlin Marathon",
          dek: "A strong men's field, a tenth-win hunt on wheels and hopes of a course record.",
          body: [
            "If you are anywhere near Berlin on Sunday, you will hear it before you see it. The BMW Berlin Marathon has more than 56,000 entries from 162 nations, across the classic marathon and the races that go with it.",
            "In the men's race, Tanzania's Gabriel Geay leads the field with a personal best of 2:03:00. Alongside him are Ethiopia's Guye Adola, the 2021 champion, and Selemon Barega, the Olympic 10,000m champion, who wants to improve on his marathon best of 2:05:00. “I expect a thrilling race and we have hopes for a course record,” said race director Mark Milde.",
            "Keep an eye on the Japanese contingent, too: eleven of their runners could challenge the national record of 2:04:55. For the home crowd, Sebastian Hendel, Haftom Welday and debutant Aaron Bienenfeld are all aiming to get under 2:09.",
            "Wheels are rolling as well. Switzerland's Marcel Hug is chasing a tenth Berlin wheelchair victory, which would stretch his winning streak to seven, while Catherine Debrunner and Manuela Schär lead the women's wheelchair race. In the inline skating, Belgium's Bart Swings is after his own tenth win, alongside about 2,000 other skaters.",
            "The field is getting more varied every year. Women make up 36.2% of all participants, rising to 40.2% among runners aged 26 to 30. Before the race, a panel discussion looked at how to make women in running more visible and safer. Whoever breaks the tape, the best bit is usually further back: tens of thousands of people having the morning of their lives on the streets of Berlin.",
          ],
          source: "BMW Berlin-Marathon",
          sourceUrl:
            "https://www.bmw-berlin-marathon.com/en/news-media/news/detail/bmw-berlin-marathon-2026-exciting-races-expected-on-sunday",
          image: {
            file: "/editions/38/berlin-marathon-sunday.jpg",
            alt: "Elite runners posing on a Berlin avenue in front of the Victory Column",
            credit: "SCC Events",
            from: "https://www.bmw-berlin-marathon.com/en/news-media/news/detail/bmw-berlin-marathon-2026-exciting-races-expected-on-sunday",
          },
        },
        {
          slug: "laver-cup-london",
          kicker: "Tennis",
          headline:
            "Andre Agassi and Yannick Noah bring their Laver Cup teams to London for the weekend",
          dek: "Points double on Saturday and triple on Sunday, so nothing is settled early.",
          body: [
            "The Laver Cup is back at The O2 in London from Friday to Sunday, pitting Team Europe against Team World. Yannick Noah captains Europe, with Tim Henman as vice-captain, and his side includes Carlos Alcaraz, Alexander Zverev and Casper Ruud. Andre Agassi leads Team World, helped by Patrick Rafter, with Taylor Fritz, Alex de Minaur and Alexander Bublik.",
            "The first team to 13 of the 24 points wins. Matches are worth one point on day one, two on day two and three on the last day, and if it is tied after twelve matches, a deciding doubles settles it. Team World won last year in San Francisco, 15-9, for their third title, after back-to-back wins in 2022 and 2023. Europe's line-up also features Flavio Cobolli, Jakub Mensik and Rafael Jodar, while Learner Tien, Francisco Cerundolo and Brandon Nakashima complete Team World.",
          ],
          source: "ATP Tour",
          sourceUrl: "https://www.atptour.com/en/news/laver-cup-2026-history-draw-schedule",
          image: {
            file: "/editions/38/laver-cup-london.jpg",
            alt: "The Laver Cup court inside the O2 Arena in London",
            credit: "Daniel Cooper / Wikimedia Commons (CC BY-SA 4.0)",
            from: "https://commons.wikimedia.org/wiki/File:Laver_Cup_2026_O2_Arena.jpg",
          },
        },
        {
          slug: "asian-games-marathon",
          kicker: "Athletics",
          headline:
            "The Asian Games fill Nagoya with sport all weekend as Japan hosts for a third time",
          dek: "Nagoya is only the third Japanese city to host the Games, after Tokyo and Hiroshima.",
          body: [
            "The Aichi-Nagoya Asian Games run from 19 September to 4 October, with some events starting as early as 10 September. Nagoya is the third Japanese city to host, after Tokyo in 1958 and Hiroshima in 1994, and events also spread to three other prefectures and Tokyo. The Games are back on their four-year cycle and mark 75 years since the first, in New Delhi in 1951.",
          ],
          source: "Wikipedia",
          sourceUrl: "https://en.wikipedia.org/wiki/2026_Asian_Games",
          image: {
            file: "/editions/38/asian-games-marathon.jpg",
            alt: "Runners in the women's marathon on the track at Mizuho Park Athletic Stadium",
            credit: "AINAGOC",
            from: "https://www.aichi-nagoya2026.org/day8-highlight/",
          },
        },
      ],
    },
    {
      section: "deep-dive",
      stories: [
        {
          slug: "saturn-decagon",
          kicker: "Space",
          headline: "Saturn has worn a hexagon for decades, and now it has a decagon too",
          dek: "Amateur astronomers spotted a ten-sided wave at the planet's south pole, and it seems to have only just formed.",
          body: [
            "Saturn is not short of things to look at. There are the rings, of course, and the moons, and the soft butterscotch stripes of its clouds. But for astronomers who study planetary weather, one feature has long stood above the rest: a hexagon. A proper six-sided shape, sitting on top of the planet at its north pole, as if someone had drawn it on with a ruler. Now there is a second shape, at the other end of the planet, and it has ten sides.",
            "First, the hexagon. It was discovered by David Godfrey in 1987, pieced together from views taken by the Voyager spacecraft as they flew past in 1981, and revisited by the Cassini mission in 2006. It sits at about 78 degrees north and it is enormous: each side is roughly 14,500 kilometres long, about 2,000 kilometres longer than Earth is wide. It stands around 300 kilometres high and is thought to be a jet stream of gases racing at about 320 kilometres an hour.",
            "It also keeps very good time. The hexagon turns once every 10 hours, 39 minutes and 24 seconds, the same period as the radio emissions coming from deep inside Saturn, and unlike the other clouds around it, it does not drift in longitude. Cassini, which orbited Saturn from 2004 to 2017, was even able to film it while travelling at the same speed as the planet, and watched it change colour from mostly blue to more golden between 2012 and 2016, possibly because sunlight arriving with the changing seasons made a haze over the pole.",
            "Why a hexagon? Scientists have several ideas. One of the most delightful comes from Oxford University, where researchers spun a round tank of liquid faster in the middle than at the edge. Where the two speeds met, regular shapes appeared in the swirling water. Six sides was the most common, but they also saw shapes with anywhere from three to eight. Other teams have built computer models of a slow, meandering jet stream that match the hexagon's behaviour, and a 2020 study at the California Institute of Technology showed how rings of winds turning the opposite way to a storm can hold patterns steady. The debate continues, happily.",
            "What nobody had found was a southern twin. “Given Saturn's symmetry in its north-south jet stream system, we have been searching for a counterpart to Saturn's northern hexagon on the south pole in Hubble images since 1990,” said Agustín Sánchez-Lavega, of the University of the Basque Country in Spain. “Images from NASA's Cassini spacecraft, which orbited Saturn between 2004 and 2017, showed no inkling of a long-lived formation, either.” For decades, the south pole was simply round.",
            "The breakthrough came from amateurs. Sánchez-Lavega's university runs the Planetary Virtual Observatory Laboratory, a website where observers around the world upload their own photographs of the planets. As Saturn moved through its seasons and its south pole came back into view from Earth, two amateur astronomers, Trevor Barry and Jean-Paul Oger, noticed something in images from 2024: a faint, wavy band circling the pole. By 2025, ground-based pictures showed something much clearer. It had ten sides.",
            "Then the professionals brought in the big gun. The Hubble Space Telescope, which looks from above Earth's blurry atmosphere, can capture sharp images across complete rotations of Saturn. It has been photographing the outer planets every year for more than a decade through a programme called OPAL, short for Outer Planet Atmospheres Legacy. Going back through its archive, the team found the decagon in Hubble data from 2023, faint at first and growing clearer since. The results were published in the journal Science Advances.",
            "“We've never seen anything quite like this in Saturn's southern hemisphere,” said Amy Simon of NASA's Goddard Space Flight Center, who leads OPAL. “The northern hexagon has been there every time we've looked for more than 40 years. This feature is different — it appears to be strengthening, giving us the rare opportunity to watch a giant atmospheric pattern develop.”",
            "The decagon is not just a pattern painted on the cloud tops. It lives inside one of Saturn's powerful jet streams and reaches down through several layers of the atmosphere. Its position shifts slightly depending on which wavelength Hubble uses, because different colours of light let astronomers see to different depths, and the shape turns up at all of them. It is, in other words, a tall, deep structure, not a thin stripe of paint.",
            "The best part is that it is new. “The most intriguing part to me is that this seems to have just formed recently,” Simon said. “The question is, why did it suddenly form now when we haven't seen one before?” Nobody yet knows what set it off, or whether it will settle down into a long-lived feature like its northern cousin or keep changing. More observations from Hubble and the James Webb Space Telescope, along with computer modelling, should help answer how it formed and how long it might last.",
            "That long view is exactly what OPAL was built for. Rather than a single snapshot, it gives astronomers the same planets, photographed the same way, year after year, so that seasonal shifts, passing storms and slowly growing patterns stand out. “When we started the OPAL program, we expected compelling surprises, but we didn't know what to expect specifically,” said Mike Wong of the University of California, Berkeley. “A lot of the discoveries we see coming from OPAL are not just based on one observation, but on years and years of data.”",
            "The decagon may even teach us something closer to home. Jet streams and waves happen in Earth's atmosphere too, and the researchers say what they learn about giant planets could offer broader insights into weather here. In the meantime, astronomers in their back gardens are already pointing their telescopes at Saturn's south pole, waiting to see whether it keeps its ten sides, or tries a new shape entirely.",
          ],
          source: "ScienceDaily (NASA Goddard); Wikipedia (Saturn's hexagon)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260903064229.htm",
          readMinutes: 5,
          image: {
            file: "/editions/38/saturn-decagon.jpg",
            alt: "Hubble images of Saturn showing a ten-sided wave around its south pole",
            credit:
              "NASA, ESA, STScI, A. Sánchez-Lavega, A. Simon, M. Wong; processing by Alyssa Pagan",
            from: "https://www.sciencedaily.com/releases/2026/09/260903064229.htm",
          },
        },
      ],
    },
    {
      section: "time-machine",
      stories: [
        {
          slug: "abbey-road-released",
          kicker: "57 years ago today",
          headline: "On this day in 1969: Abbey Road came out, with no name on the cover",
          dek: "Six photos, one zebra crossing, a borrowed Beetle and a barefoot Paul.",
          body: [
            "On 26 September 1969, Apple Records released Abbey Road in the UK. It was the last album the Beatles recorded, and its cover would become one of the most copied photographs in pop. Most of it was recorded in April, July and August 1969 at the studio then officially called EMI Studios, with plenty of Moog synthesiser and a long medley on side two that other artists have since covered as a single suite.",
            "The picture was taken by Iain Macmillan, who had time for only six shots of the four of them walking over the zebra crossing outside the studio. In the one that was chosen, Paul McCartney is barefoot and out of step with the others.",
            "The white Volkswagen Beetle parked on the left belonged to someone who lived in the flats opposite. Its number plate, LMW 281F, became so famous that it was stolen repeatedly.",
            "The sleeve's designer, John Kosh, left off both the band's name and the album title. As he later put it, they were ‘the most famous band in the world’ and did not need it.",
            "It worked. The album sold four million copies in its first two months, spent 17 weeks at number one in the UK and has passed 30 million sales worldwide. It gave the world ‘Here Comes the Sun’ and, for anyone who needs a Saturday singalong, ‘Octopus's Garden’.",
            "The crossing itself was given Grade II listed status in 2010, which makes it one of very few pieces of road marking with official protection. Tourists still stop the traffic on it every day, usually trying to get in step.",
          ],
          source: "Wikipedia",
          sourceUrl: "https://en.wikipedia.org/wiki/Abbey_Road",
          image: {
            file: "/editions/38/abbey-road-released.jpg",
            alt: "The zebra crossing on Abbey Road in London",
            credit: "Misterweiss, via Wikimedia Commons (public domain)",
            from: "https://commons.wikimedia.org/wiki/File:Abbey_Road_Zebra.jpg",
          },
        },
        {
          slug: "lucid-comes-home",
          slot: "feature",
          kicker: "30 years ago today",
          headline: "On this day in 1996, Shannon Lucid landed after 188 days in space",
          dek: "She had mentioned she missed M&M's. NASA's boss met her with a gift-wrapped box.",
          body: [
            "On 26 September 1996, the space shuttle Atlantis landed at Kennedy Space Center carrying Shannon Lucid, home after 188 days and 4 hours in space. She had left on 22 March, and 179 of those days were spent aboard the Russian space station Mir, making her the first, and still the only, American woman to live there.",
            "Her stay was meant to be shorter. Two delays added about six weeks, and by the time she came back she had travelled 75.2 million miles.",
            "She kept busy. She grew wheat, studied quail embryos, lit candles to see how flames behave without gravity and put in nearly 400 hours on an exercise bike and treadmill, which is why she was able to walk off the shuttle on her own feet.",
            "She also read a lot. Her daughter had sent up a two-volume novel, but only volume one arrived. “I floated there, alone in Spectra, in stunned disbelief, holding only volume one,” she later recalled. Volume two came up on the next supply ship.",
            "Having told people she was craving M&M's, she was greeted after landing by NASA Administrator Daniel Goldin holding a gift-wrapped box of them. Her flight stood as the longest by a woman until 2007.",
          ],
          source: "Wikipedia",
          sourceUrl: "https://en.wikipedia.org/wiki/Shannon_Lucid",
          image: {
            file: "/editions/38/lucid-comes-home.jpg",
            alt: "Astronaut Shannon Lucid checking wheat plants growing aboard the Mir space station",
            credit: "NASA (public domain)",
            from: "https://commons.wikimedia.org/wiki/File:Astronaut_Lucid_looking_at_wheat_growing_in_the_Svet.jpg",
          },
        },
        {
          slug: "johnny-appleseed-birthday",
          kicker: "Birthdays",
          headline: "Born on this day in 1774: John Chapman, better known as Johnny Appleseed",
          dek: "Today is one of the two dates people celebrate him with an apple.",
          body: [
            "Born in Leominster, Massachusetts, on a street now called Johnny Appleseed Lane, he planted apple trees from seed across Pennsylvania, Ohio, Indiana, Illinois and beyond, once paddling seeds downriver in two canoes lashed together. According to legend, he wore a tin pot on his head that doubled as a cooking pan.",
          ],
          source: "Wikipedia",
          sourceUrl: "https://en.wikipedia.org/wiki/Johnny_Appleseed",
          image: {
            file: "/editions/38/johnny-appleseed-birthday.jpg",
            alt: "An engraving of Johnny Appleseed with a sapling",
            credit: "en.wikipedia.org",
            from: "https://en.wikipedia.org/wiki/Johnny_Appleseed",
          },
          slot: "brief",
        },
      ],
    },
    {
      section: "brain-snacks",
      stories: [
        {
          slug: "altar-stone-glacier",
          kicker: "Did you know",
          headline: "Stonehenge's six-tonne Altar Stone may have hitched a ride on a glacier first",
          dek: "Ice could have carried it from Scotland towards the North Sea, but people did the rest.",
          body: [
            "Stonehenge's Altar Stone is a six-tonne slab of sandstone at the centre of the monument, and researchers recently worked out that it came from north-east Scotland, roughly 700 kilometres away. That raised a wonderful question: how on earth did it get to Salisbury Plain?",
            "A team from Sheffield Hallam University and Curtin University in Australia combined mineral grain dating with computer models of ancient ice sheets. Their answer is that during Britain's last ice age, glaciers may have carried the stone from Scotland's Orcadian Basin as far as Dogger Bank in the North Sea, part of Doggerland, a Neolithic landscape now under water. There were, however, no glacial routes that could have taken it all the way to southern England.",
            "So people must have done the rest, probably in stages, hauling it overland and perhaps using rivers or the coast. One possible route leads towards the Berkshire Ridgeway, regarded as the oldest road in Europe and in use around the time Stonehenge was built.",
            "“What is exciting about these findings is that they could imply that the people of Doggerland attached cultural significance to the Altar Stone long before it was incorporated into Stonehenge,” said co-lead author Dr Remy Veness. The stone, he suggests, may have been important enough to be moved at least twice: once as rising seas swallowed Doggerland, and again to its final home.",
            "“Rather than being carried naturally by ice, the evidence points to a deliberate, carefully planned movement across a challenging and varied landscape,” said co-lead author Dr Anthony Clarke. It is, either way, one of the great removals of prehistory.",
          ],
          source: "ScienceDaily (Sheffield Hallam University)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260922005715.htm",
          image: {
            file: "/editions/38/altar-stone-glacier.jpg",
            alt: "The standing stones of Stonehenge under a bright sky",
            credit: "Shutterstock, via ScienceDaily",
            from: "https://www.sciencedaily.com/releases/2026/09/260922005715.htm",
          },
        },
        {
          slug: "scroll-lead-ink",
          kicker: "Experiments",
          headline:
            "A scientist burned his own scrolls to learn how to read Herculaneum's charred library",
          dek: "Students wrote Star Wars quotes on papyrus; then it went into the furnace.",
          body: [
            "When Vesuvius erupted in 79 CE, it turned more than a thousand scrolls in a library at Herculaneum into charred rolls, the only intact library known to survive from antiquity. Unrolling them tends to turn them to dust.",
            "Douglas Seiler, an affiliate of Berkeley SETI, bought papyrus and reed pens from Egypt and lampblack ink from Japan, paid high school students to write passages from Star Wars and the Bible, then carbonised the lot to mimic the eruption. In PLOS ONE, his team shows that even tiny amounts of lead in ink absorb up to 25 times more X-rays than burnt papyrus, making the letters leap out in scans. A cheap handheld X-ray fluorescence scanner could spot lead ink too, so real scrolls could be screened first. Only a few Herculaneum scrolls have been virtually opened so far, and none was tested for lead beforehand. “This is the Holy Grail,” Seiler said.",
          ],
          source: "ScienceDaily (UC Berkeley)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260925005414.htm",
          image: {
            file: "/editions/38/scroll-lead-ink.jpg",
            alt: "A rolled papyrus scroll before and after being carbonised in the experiment",
            credit: "Seiler et al., 2026, PLOS One",
            from: "https://www.sciencedaily.com/releases/2026/09/260925005414.htm",
          },
        },
        {
          slug: "qumran-calendar",
          kicker: "Calendars",
          headline:
            "The Dead Sea Scrolls sect's tidy 364-day calendar slowly drifted away from the seasons",
          dek: "Exactly 52 weeks a year sounds perfect, until spring festivals start arriving in winter.",
          body: [
            "The Qumran community's calendar had exactly 364 days, so festivals always fell on the same weekday. But it was about a day and a quarter shorter than the real year, so after 20 years festivals would slip almost four weeks. Prof Eshbal Ratzon of Tel Aviv University argues the sect really used it early on, then let it go.",
          ],
          source: "ScienceDaily (Tel Aviv University)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260919031035.htm",
          image: {
            file: "/editions/38/qumran-calendar.jpg",
            alt: "A Dead Sea Scroll on display, its writing in neat columns",
            credit: "Shutterstock, via ScienceDaily",
            from: "https://www.sciencedaily.com/releases/2026/09/260919031035.htm",
          },
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "800,000",
        caption: "tiny balsa-wood buildings in Joe Macken's model of New York, now in a museum",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Weekend high of pure lazing",
        detail:
          "A warm front of brunch moving in from the east. Scattered naps after two, with echoes in underground car parks. Deep-sea visibility better than expected: reefs previously reported dead are advised to check again.",
      },
    },
    {
      type: "quote",
      content: {
        text: "It's not as boring as writing an SMS. Sounds much better, too.",
        by: "Anna Maria Gutschi, yodelling teacher, on the original long-distance call",
      },
    },
    {
      type: "correction",
      content: {
        text: "Friday's edition said a pigeon photographed on page six was ‘unremarkable’. We have since met the pigeon. We were wrong, and the pigeon has accepted our apology on the condition of crumbs.",
      },
    },
    {
      type: "correction",
      content: {
        text: "A caption on Thursday described a cloud as ‘shaped like a duck’. Readers write to say it was clearly a duck shaped like a cloud. We regret the error, and the duck.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Players for a free co-op game about two snails building a house. Patience essential; speed actively discouraged. Barnaby has applied.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FREE TO A GOOD HOME",
        text: "An open-source recipe manager that tells you which leftovers get along. Tested in 41 fridges. The pickles are still not speaking to the jam.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FOUND",
        text: "One perfect skimming stone, Lark River beach. Owner may collect it by proving they can skim it seven times. Rowers need not apply.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: What are you doing this weekend?",
          "PIGEON: Nothing.",
          "PIP: Sounds boring.",
          "PIGEON: I've been training for it all week.",
        ],
      },
    },
    {
      type: "sign_off",
      content: { text: "You're done for today. Go and do your Saturday at tortoise pace." },
    },
  ],
};
