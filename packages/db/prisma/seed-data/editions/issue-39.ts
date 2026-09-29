// Issue 39, Sunday 27 September 2026. A Sunday midi: gentle, slow and snack-adjacent.
// Stories with a sourceUrl are real, rewritten in our own words; stories marked "(sample)" are invented.
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
      slug: "humpback-birth-filmed",
      section: "discoveries",
      kicker: "Whales",
      headline: "A drone counting whales off Australia films a humpback calf being born",
      dek: "It happened 700 metres from a beach at Kingscliff, and it may be the first full drone video of a humpback birth anywhere.",
      body: [
        "Alexander Forrest's job, on the morning of 28 July, was to fly a drone over the sea off the north coast of New South Wales and help keep track of the humpback whales migrating along the coast. It is patient work. Most of it involves watching large grey backs rise, blow and sink.",
        "This time, something was different. One whale was hanging slightly behind her pod, moving unusually slowly. Forrest, a commercial drone pilot flying for ORRCA, the Organisation for the Rescue and Research of Cetaceans in Australia, kept the camera on her.",
        "About 700 metres from the shore at Kingscliff, on her own, she gave birth.",
        "“It's incredibly rare to see a moment like this in the ocean. It's a very rarely documented encounter,” Forrest said afterwards. “It's the first drone video as far as we know of a full humpback whale live birth.” According to ORRCA, it is only the fourth time a humpback birth has been filmed at all.",
        "Newborn humpbacks are not small. A calf weighs somewhere between 900 and 1,360 kilograms at birth and measures three to five metres long, and it then puts on about 45 kilograms a day on its mother's milk. It will stay at her side for around eleven months, including the long swim south: humpbacks migrate up to 8,000 kilometres each way between their feeding and breeding grounds.",
        "What struck Forrest most, watching the footage back, was the two of them together. “Humpback whales seem to have an incredible maternal bond with their offspring,” he said.",
        "There is more good news in the background of the video, too. The humpbacks that travel along the New South Wales coast have made a remarkable recovery, and Forrest says their numbers are now close to 50,000, which is why a drone pilot with a morning's counting to do has a chance of seeing something like this at all.",
        "The footage will now be studied by scientists and written up for a peer-reviewed report. For Forrest, it is a morning he is unlikely to forget: a routine count that turned into a front-row seat at one of the ocean's most private moments. The calf, presumably, has more pressing matters, such as the next 45 kilograms.",
      ],
      source: "Live Science",
      sourceUrl:
        "https://www.livescience.com/animals/whales/its-incredibly-rare-to-see-a-moment-like-this-in-the-ocean-camera-drone-captures-moment-humpback-whale-gives-birth-off-australian-coast",
      sticker: "Hello, world",
      image: {
        file: "/editions/39/humpback-birth-filmed.jpg",
        alt: "Aerial view of humpback whales swimming in blue ocean",
        credit: "Alexander Forrest/ORRCA",
        from: "https://www.livescience.com/animals/whales/its-incredibly-rare-to-see-a-moment-like-this-in-the-ocean-camera-drone-captures-moment-humpback-whale-gives-birth-off-australian-coast",
      },
    },
    {
      slug: "pluto-liquid-nitrogen",
      section: "discoveries",
      slot: "feature",
      kicker: "Space",
      headline: "Liquid nitrogen may be seeping on to Pluto's heart right now, scientists say",
      dek: "New Horizons pictures of the famous heart-shaped glacier look a lot like Greenland.",
      body: [
        "Pluto's heart is a glacier of frozen nitrogen called Sputnik Planitia, and it is bigger than Texas and Oklahoma combined. New research led by Alan Stern, the principal investigator of NASA's New Horizons mission, suggests that liquid nitrogen may be flowing at its northern edge in relatively recent times: the first such evidence on Pluto.",
        "The team compared New Horizons' images from 2015 and 2016 with Landsat 9 pictures of Greenland's ice sheet, and simulations by Orkan Umurhan of the SETI Institute show that ice several kilometres down at the base of the glacier could melt and rise. The glacier's surface is probably less than a million years old.",
        "Pluto is only about three-quarters as wide as the continental United States, and more than half of it has never been mapped in high resolution, so there may be plenty more to find. “Pluto never stops surprising us,” Stern said, “and this new result certainly does that.”",
      ],
      source: "ScienceDaily (Southwest Research Institute)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260916232525.htm",
      image: {
        file: "/editions/39/pluto-liquid-nitrogen.jpg",
        alt: "Enhanced-colour view of Pluto showing its heart-shaped glacier",
        credit: "NASA/Johns Hopkins APL/Southwest Research Institute",
        from: "https://www.sciencedaily.com/releases/2026/09/260916232525.htm",
      },
    },
    {
      slug: "diplodocus-in-spain",
      section: "discoveries",
      slot: "feature",
      kicker: "Dinosaurs",
      headline: "First Diplodocus ever found outside North America turns up in Spain",
      dek: "Fourteen tail bones from Teruel suggest dinosaurs crossed between continents 150 million years ago.",
      body: [
        "Diplodocus is one of the most famous dinosaurs there is, and since it was first discovered in 1878, every confirmed specimen has come from one rock formation in the western United States. Until now.",
        "Palaeontologists from the Fundación Dinópolis have identified 14 beautifully preserved tail vertebrae and several chevron bones from La Tejería, in El Castellar, Teruel, as belonging to a Diplodocus: a roughly 25-metre animal that lived about 150 million years ago, closely related to Diplodocus hallorum.",
        "“With each new result, the picture became clearer: we were looking at a Diplodocus,” said lead author Sergio Sánchez Fenollosa. The find hints that dinosaurs moved between North America and Europe, perhaps over temporary land bridges. “The fossils of all these dinosaurs, including those of the new Diplodocus specimen, make Teruel a reference place for understanding this great diversity,” said Alberto Cobos, managing director of Fundación Dinópolis. The bones are on show at the Museo Aragonés de Paleontología in Teruel.",
      ],
      source: "ScienceDaily (Taylor & Francis)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260918024807.htm",
      image: {
        file: "/editions/39/diplodocus-in-spain.jpg",
        alt: "An artist's illustration of a long-necked Diplodocus",
        credit: "Carmelo López",
        from: "https://www.sciencedaily.com/releases/2026/09/260918024807.htm",
      },
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "masked-band-polaris",
          kicker: "Music",
          headline: "Masked band that speaks only a made-up language wins Canada's top album prize",
          dek: "Angine de Poitrine never talk in their real voices, so their manager did the thank-yous.",
          body: [
            "The winners of this year's Polaris Music Prize, awarded to the best Canadian album of the year, did not make an acceptance speech. They could not really have made one. Angine de Poitrine, a masked and ornately costumed duo from Saguenay, Quebec, do not speak in public in their real voices at all. Its two members, known as Khn and Klek, communicate in a language they invented, which keeps them anonymous.",
            "So at the prize concert at Massey Hall in Toronto, their manager, Sébastien Collin, did the talking. The band took home $30,000 for their second album, Vol.II, chosen from a shortlist of ten by more than 200 Canadian music critics and journalists. They also collected the $10,000 song prize for ‘Fabienk’, and received the award from last year's winner, Jeremy Dutcher.",
            "Their music is what the band call microtonal rock, using notes that fall in the gaps between the ones on a normal piano. It is not an obvious recipe for a hit. But a live performance for the Seattle radio station KEXP spread across the internet, and that video now has 19 million views on YouTube.",
            "Two years after their first album, the duo have sold out an international headlining tour, opened for Jack White and shared a stage with Shania Twain.",
            "“That all this attention is being directed toward music this rock-driven and this complex is unexpected, yet entirely deserved,” Collin said.",
            "What Khn and Klek said about it, if anything, has not been translated.",
          ],
          source: "CBC Music",
          sourceUrl:
            "https://www.cbc.ca/music/events/polaris/angine-de-poitrine-polaris-music-prize-2026-recap-9.7354360",
          image: {
            file: "/editions/39/masked-band-polaris.jpg",
            alt: "The costumed duo Angine de Poitrine on stage after winning the Polaris Prize",
            credit: "Wade Muir / CBC",
            from: "https://www.cbc.ca/music/events/polaris/angine-de-poitrine-polaris-music-prize-2026-recap-9.7354360",
          },
        },
        {
          slug: "tasmania-antiques-roadshow",
          slot: "feature",
          kicker: "Television",
          headline: "Tasmania brings out its oddest heirlooms to lure Antiques Roadshow over",
          dek: "Exhibit A: a carved stone profile of a bearded man, bought in a charity shop.",
          body: [
            "The National Trust of Tasmania and a local tourism group have launched a campaign to persuade the BBC's Antiques Roadshow to film an episode on the island. To make their case, they held a launch at Runnymede House with a valuation session of their own, local historian Warwick Oakman doing the appraising.",
            "Huon Valley resident Chris Gooley brought a dark-stone carving of a bearded man that he found in an op shop. “All the information that I have is on the actual carving itself, where inscribed are the initials H.L. and 1910,” he said. Kathleen Moore from Claremont brought two tiny porcelain dolls, kept safe in cotton wool.",
            "The pitch is not only about objects. “We have so many little villages that look as though you have stepped out of the 1830s, 1860s,” said Jen Fry, the Trust's chief executive. “They would be wonderful for the Antiques Roadshow crew to come and film.”",
          ],
          source: "ABC News (Australia)",
          sourceUrl:
            "https://www.abc.net.au/news/2026-09-24/tasmanian-national-trust-campaigns-antiques-roadshow-bbc-visit/107184792",
          image: {
            file: "/editions/39/tasmania-antiques-roadshow.jpg",
            alt: "Kathleen Moore holding two tiny porcelain dolls",
            credit: "ABC News: Edoardo Falcione",
            from: "https://www.abc.net.au/news/2026-09-24/tasmanian-national-trust-campaigns-antiques-roadshow-bbc-visit/107184792",
          },
        },
        {
          slug: "air-guitar-champion",
          kicker: "Air guitar",
          headline:
            "Finland's ‘The Angus’ wins the Air Guitar World Championships for a second year",
          dek: "He beat Japan's ‘Seven Seas’ by four tenths of a point, on a stage built over water.",
          body: [
            "The 30th championships in Oulu drew more than 50 competitors from 13 countries and 5,000 spectators. Aapo ‘The Angus’ Rautio scored 34.8 to keep his title. Nanami ‘Seven Seas’ Nagura was second on 34.4, and Saladin ‘Six String Sal’ Thomas of the USA third. No guitars were harmed.",
          ],
          source: "Air Guitar World Championships",
          sourceUrl:
            "https://airguitarworldchampionships.com/en/the-2026-air-guitar-world-champion-is-aapo-the-angus-rautio/",
          slot: "brief",
        },
        {
          slug: "retirement-home-dj",
          kicker: "DJs",
          headline: "Student DJ ‘The QWill’ turns retirement-home happy hours into dance floors",
          dek: "The most requested song, at nearly every set, is ‘Sweet Caroline’.",
          body: [
            "University of Tennessee student Will Mehring took his first senior-living booking last summer on his mother's suggestion, and now fits them in between classes and college parties, heavy on Elvis and soul. “All it takes is one, or myself, to get up and dance, and then the party started,” he said.",
          ],
          source: "NewsNation",
          sourceUrl:
            "https://www.yahoo.com/lifestyle/articles/dj-goes-viral-turning-nursing-153248294.html",
          slot: "brief",
        },
        {
          slug: "timetable-cantata",
          kicker: "Choirs",
          headline: "Community choir sets the local bus timetable to music, as a cantata",
          dek: "The 7.42 to Llanfair gets a solo.",
          body: [
            "The Cwm Tawel Singers spent a year turning the valley's timetable into a 25-minute piece for four voices. Stops are sung in harmony, and changes at the depot are marked by a dramatic pause. The bus company has asked if it can play the recording at the station. The choir said yes, but only on time.",
          ],
          source: "Valley Voice (sample)",
          slot: "brief",
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
          dek: "Press it and your character simply sits on the jetty and watches the water. It has been pressed 1.3 million times.",
          body: [
            "The two-person studio behind ‘Still Waters’, a gentle game about fishing on a lake, noticed something odd in its data: players were leaving the game running with nothing happening at all, just to look at the water.",
            "“At first we thought it was a bug,” said co-developer Ines Varga. “Then people started emailing to say it was the most relaxing part of their week.”",
            "So the latest update adds a button labelled ‘Sit’. Press it and your angler puts down the rod, sits on the end of the jetty and watches the lake. Nothing is caught. Nothing is earned. The light changes slowly across the water, the reeds move a little in the wind, and now and then a duck goes past.",
            "In its first week, the button was pressed 1.3 million times, and the average sit lasts six minutes. The patch notes describe the feature, in full, as ‘a place to be’.",
            "Players have taken to it with enthusiasm. Some sit before bed. Some sit at lunch. One group of friends meets on the same jetty every Sunday evening and sits together, in silence, for exactly ten minutes, then logs off without saying goodbye, which they describe as ‘the whole point’.",
            "The developers say they have no plans to add anything else to the button. “It is finished,” Varga said. “Like a good cup of tea.”",
          ],
          source: "Patch Notes Daily (sample)",
          photo: ["fishing", 0],
        },
        {
          slug: "lego-slowpoke",
          kicker: "Builds",
          headline: "A LEGO fan turns a Toy Story bear set into a startlingly good Slowpoke",
          dek: "The same builder once made a Millennium Falcon out of a pumpkin.",
          body: [
            "Reddit builder Minute_Food_2881 has a habit of taking one LEGO set and turning it into something else entirely. The latest: the $39.99 Lotso Huggin' Bear set from Toy Story 3, rebuilt as Slowpoke, the famously dozy pink Pokémon, down to its peg-like teeth and wide-set eyes.",
            "Earlier builds include an Articuno made from a 3-in-1 dolphin kit, a Charmander from a pumpkin and a Pinsir from a LEGO Eevee, plus Millennium Falcons built out of a pumpkin, a Mario Kart set, a Dalmatian puppy and a dinosaur. It is a friendly scene: another fan, KraftyKoopa, is building one Pokémon a month this year, with Snorlax and Bulbasaur done and Mew on the way.",
            "The top comment under the Slowpoke asked the question everyone was thinking: “How does he keep doing it”",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/toys-collectibles/how-does-he-keep-doing-it-fan-makes-incredible-lego-pokemon-out-of-the-most-unlikely-sets/",
          slot: "feature",
        },
        {
          slug: "lost-xevious-ad",
          kicker: "Archives",
          headline: "A lost 1983 arcade advert turns up in the middle of a taped baseball game",
          dek: "It was found about an hour and 23 minutes in.",
          body: [
            "Game historians had hunted for Atari's American TV advert for the shooter Xevious for years. Jumpman of Gaming Alexandria finally found it inside a recording of a Phillies v Mets broadcast from 5 April 1983, and it has now been put on Archive.org for anyone to watch.",
          ],
          source: "Aroged",
          sourceUrl:
            "https://www.aroged.com/2026/09/25/after-years-of-painstaking-search-missing-xevious-tv-commercial-finally-found/",
          slot: "brief",
        },
        {
          slug: "sunday-save-file",
          kicker: "Families",
          headline: "Family has kept one shared save file going every Sunday for eleven years",
          dek: "Four people, one farm, and a strict rule about who waters the turnips.",
          body: [
            "The Adebayo-Lindqvist family of Västerby started a farming game in 2015 and have played it together every Sunday since, passing the controller between turns. Their virtual farm is now in its 44th in-game year. The youngest player was not born when it began. She is now in charge of the chickens.",
          ],
          source: "Save State (sample)",
          slot: "brief",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "cricket-ducks-crossing",
          kicker: "Cricket",
          headline: "Village cricket match stops for twenty minutes so a family of ducks can cross",
          dek: "Both teams formed a guard of honour, the umpire kept time, and nobody hurried the ducklings.",
          body: [
            "The Sunday fixture between Upper Brampton and Hollins Green had reached a tense point just after tea. Hollins Green needed 41 to win with five wickets left. Then a mother mallard and eight ducklings walked out from the long grass by the pavilion and set off, in single file, towards the middle of the pitch.",
            "Umpire Clive Mabena held up both hands. Play stopped. The fielders, without being asked, stepped back into two lines either side of the ducks' route, and the batsmen took off their helmets.",
            "The ducks did not take the direct route. They inspected the stumps at the pavilion end, walked the length of the wicket, paused at square leg for what one spectator described as ‘a meeting’, and finally left the field by the scoreboard. The whole crossing took twenty minutes, which Mr Mabena noted in his book as ‘stoppage: ducks’.",
            "“You can't rush a duckling,” said Upper Brampton's captain, Sunita Rao. “We had waited all week for this game. We could wait a bit longer.”",
            "The scorer, twelve-year-old Rhys Aldred, drew a small duck in the margin of the scorebook to mark the moment, and a round of applause went up from the pavilion as the last duckling disappeared. When play resumed, Upper Brampton won by three runs off the final ball. Both captains agreed in the bar afterwards that the ducks were the highlight, and the club has since put up a small sign by the long grass: ‘Right of way’.",
          ],
          source: "Village Green Gazette (sample)",
          photo: "cricket",
        },
        {
          slug: "teapot-marathon-runner",
          slot: "feature",
          kicker: "Running",
          headline: "Marathon runner dressed as a teapot finishes with the spout still attached",
          dek: "He had been assured the spout would fall off by mile ten. It is now on his mantelpiece.",
          body: [
            "Ollie Penhale spent three months building his costume from papier-mâché, chicken wire and a lampshade frame, and ran the Harrowgate marathon in it to raise money for new starting blocks at his local swimming pool.",
            "Friends told him the spout would not survive the first hill. He reinforced it with a wooden spoon and a lot of tape, and it made it through all 26.2 miles, including a long, windy stretch along the canal.",
            "Spectators along the route shouted ‘put the kettle on’ at him for most of the second half, which he says kept him going. He finished in 4 hours 57 minutes, and a volunteer at the line handed him a cup of tea, which he said was ‘the only correct thing to do’.",
            "He raised £3,400, enough for the blocks. Next year he is planning to run as a sugar bowl.",
          ],
          source: "Finish Line (sample)",
        },
        {
          slug: "floodlit-bowls-debut",
          kicker: "Bowls",
          headline:
            "Lawn bowls club switches on its first floodlights, and an 88-year-old bowls under them",
          dek: "Joan Ferris had waited 60 years for a night game.",
          body: [
            "The Kurrajong Heights Bowling Club raised money for its lights with a year of sausage sizzles. The first night game was opened by its longest-standing member, who delivered the first bowl, landed it a hand's width from the jack and said she would like to play at night from now on.",
          ],
          source: "Green & Jack (sample)",
          slot: "brief",
        },
        {
          slug: "fjord-dawn-dip",
          kicker: "Swimming",
          headline: "Fjord swimming group reaches 1,000 mornings in a row of dawn dips",
          dek: "The woman who brings the hot chocolate has not missed one either.",
          body: [
            "The Morgenbad swimmers of Ålvik have been in the water every day since January 2024, whatever the weather. On the thousandth morning, 64 people swam and Ingrid Solheim, who has never swum once, poured 64 cups of hot chocolate from her flask trolley. The group has made her honorary captain.",
          ],
          source: "Nordic Water (sample)",
          slot: "brief",
        },
        {
          slug: "platform-ping-pong",
          kicker: "Table tennis",
          headline: "Station ping-pong table lets commuters play one point each between trains",
          dek: "A running score has been kept on a chalkboard for six months.",
          body: [
            "The table on platform 2 at Leidenhoven station is ‘Northbound v Southbound’. Anyone waiting can play one point for their direction of travel. After six months the chalkboard reads 4,812 to 4,797 to Northbound. Southbound commuters say the timetable is against them.",
          ],
          source: "Rail & Racket (sample)",
          slot: "brief",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "kostka-student-satellite",
          kicker: "Space",
          headline: "Czech students build a satellite from scratch, and it phones home from orbit",
          dek: "KOSTKA, meaning ‘cube’, is the first Czech satellite designed and built entirely by students.",
          body: [
            "For several years, a team of students at Brno University of Technology called YSpace worked on a small cube-shaped satellite named KOSTKA. This summer they watched it leave the planet.",
            "It flew on a SpaceX Falcon 9 rocket from Vandenberg Space Force Base in California, one of many small satellites on a rideshare mission. Fifty-eight minutes after launch, KOSTKA was released into space. An hour after that, its antenna unfolded.",
            "Then came the moment the team had been waiting for. Shortly before noon, the first data arrived at a ground station the students had set up on the roof of their own faculty building in Brno.",
            "“Watching the rocket lift off carrying a satellite we had worked on for years was an incredible feeling,” said Šimon Sloboda, the YSpace team leader. “But an even greater moment came when KOSTKA transmitted its first signal from orbit – that was when we knew everything was working exactly as intended.”",
            "KOSTKA now circles the Earth at about 600 kilometres up, once every 95 minutes, which works out at about 15 laps a day. Its orbit is sun-synchronous, meaning it passes over each place at the same local time.",
            "The faculty's Space Applications course is only four years old. “We could hardly have imagined that our students would design, build and send their own satellite into orbit in such a short time,” said vice dean Michal Kubíček.",
          ],
          source: "Brno University of Technology",
          sourceUrl:
            "https://www.vut.cz/en/but/news-f19528/kostka-satellite-successfully-deployed-into-earth-orbit-d345703",
          image: {
            file: "/editions/39/kostka-student-satellite.jpg",
            alt: "Students watching the launch that carried their KOSTKA satellite",
            credit: "Jakub Ryba / Brno University of Technology",
            from: "https://www.vut.cz/en/but/news-f19528/kostka-satellite-successfully-deployed-into-earth-orbit-d345703",
          },
        },
        {
          slug: "roadside-trinitron",
          slot: "feature",
          kicker: "Repairs",
          headline: "Big Sony TV that stood by an Italian road for six years is working again",
          dek: "It needed a good clean, a lot of new capacitors, and a video game.",
          body: [
            "The widescreen Sony Trinitron had been sitting beside a road in Italy for at least six years when a YouTuber called Happychoice decided to adopt it. It is one of the heavy, curved-glass tube televisions that retro gamers love.",
            "Part one of the rescue involved removing dirt and what Hackaday describes as ‘local flora and fauna’. The power supply refused to start.",
            "In part two he replaced most of the capacitors on the power board and on the board at the neck of the picture tube, plus a couple of transistors. This time it fired straight up, and he celebrated by plugging in a Wii and playing Persona 4 on it. After six years of weather, the old set has a new job: being a television again.",
          ],
          source: "Hackaday",
          sourceUrl:
            "https://hackaday.com/2026/09/15/after-6-years-as-road-ornament-a-widescreen-sony-trinitron-lives-again/",
          image: {
            file: "/editions/39/roadside-trinitron.jpg",
            alt: "The restored roadside Sony Trinitron television working again",
            credit: "Happychoice, via Hackaday",
            from: "https://hackaday.com/2026/09/15/after-6-years-as-road-ornament-a-widescreen-sony-trinitron-lives-again/",
          },
        },
        {
          slug: "mouse-ski-lift",
          kicker: "Makers",
          headline: "A maker builds a tiny ski lift to give coop mice a gondola ride out",
          dek: "The cabins have acrylic windows. The mice are dropped off, unharmed, in the brush.",
          body: [
            "YouTuber Super Valid Designs wanted the mice out of his chicken coop without hurting them. His 3D-printed gondolas are the traps: a baited door in the ceiling lets a mouse drop in, and the lift carries it downhill, where another door lets it out. Hackaday called it ‘a luxurious way for a mouse to travel’.",
          ],
          source: "Hackaday",
          sourceUrl: "https://hackaday.com/2026/09/20/ski-lift-removes-mice-from-chicken-coop/",
          slot: "brief",
        },
        {
          slug: "pine-cone-mast",
          kicker: "Disguises",
          headline: "Village's new phone mast is disguised as a giant pine cone",
          dek: "Residents voted for it over a fake tree and a fake lighthouse.",
          body: [
            "When the mast came to Hollins Edge, the parish council asked for designs. The winner, a 14-metre pine cone in bronze-coloured panels, was drawn by a ten-year-old. Signal is now full on the green. Squirrels have been seen staring at it with deep suspicion.",
          ],
          source: "Parish Pump (sample)",
          slot: "brief",
        },
        {
          slug: "sunday-lie-in-alarm",
          kicker: "Apps",
          headline: "An alarm-clock app that only ever goes off to tell you to go back to sleep",
          dek: "It is set for 7am on Sundays and says, very quietly, ‘not yet’.",
          body: [
            "Developer Tomasz Wrona built ‘Snooze Mode’ as a joke for his flatmates and released it free. It rings once, at the time you would normally get up on a weekday, then plays a recording of rain and tells you to go back to sleep. It has 120,000 downloads, and one review that just says ‘thank you’.",
          ],
          source: "App Shelf (sample)",
          slot: "brief",
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
          dek: "The business plan fitted on one sticky note. On the last Sunday of summer, it paid out in 47 cones.",
          body: [
            "Every Sunday afternoon from June to September, the three Okonjo-Hart siblings of Linden Row set up a pasting table at the end of their drive and sold lemonade at 50p a cup. Their business plan, stuck to the fridge, read in full: ‘1. Lemons. 2. Good sign. 3. Smile. 4. Ice cream for everyone.’",
            "The sign did a lot of the work. Painted by eight-year-old Kemi on the back of a pizza box, it said ‘WORLD'S SECOND BEST LEMONADE’, on the grounds that ‘first best sounds like showing off’. Passers-by stopped to ask who was first. Most of them bought a cup while they argued about it.",
            "Their brother Tolu, six, was in charge of ice and of saying ‘have a lovely day’, which he did to every customer, including a delivery driver who came back four Sundays running.",
            "On the last weekend of the season they emptied the jam jar, counted £61.40 on the kitchen table, and walked to the ice-cream van that parks at the corner on Sunday evenings. There, the eldest, Ada, nine, ordered forty-seven cones, one for every house on the street.",
            "“She had a list with all the house numbers,” said the van's owner, Luca Bellini. “She checked every one off. I have been doing this for twenty years and it was my best order ever.”",
            "Ada says the secret was ‘a lot of lemons and a very good sign’. The siblings will reopen next June, with the same recipe, the same pasting table and the same price. They are considering a second sign.",
          ],
          source: "Pocket Money Times (sample)",
          photo: ["iceCream", 1],
        },
        {
          slug: "rose-rent-allotments",
          slot: "feature",
          kicker: "Rent",
          headline: "Allotment rent set in 1897 at one red rose a year is still paid, by bicycle",
          dek: "The landowner's family receives it every Midsummer, and has never once put the rent up.",
          body: [
            "When the Penrose family lent a field to the people of Tallow Bridge for allotments in 1897, the rent was fixed in the deed at one red rose, to be delivered every Midsummer's Day.",
            "It has been paid every year since. The job goes to the allotment society's newest member, who must grow the rose on their own plot and cycle it to the Penrose house, three miles away, in a basket.",
            "This year it was Farida Qureshi, who took over plot 14 in March. She grew a deep red rose called Ingrid and delivered it in a jam jar. The current Mr Penrose, 71, signed the receipt book, which goes back to 1897.",
            "The receipt book's earliest entries are in copperplate handwriting, and several are decorated with pressed petals from the rose that paid them. “I asked if the rent was going up,” she said. “He said the rose was very good this year, so no.”",
          ],
          source: "Plot & Purse (sample)",
        },
        {
          slug: "tooth-fairy-survey",
          kicker: "Surveys",
          headline: "A town's children surveyed the going rate for teeth, and it is £1.12",
          dek: "Front teeth fetch a premium. Molars are ‘a bit disappointing’.",
          body: [
            "Year Five at Brindley Primary asked 300 classmates what the tooth fairy left them last. The average was £1.12, with one outlier of £5 for a tooth lost ‘on a birthday, during cake’. The class has written to the tooth fairy with their findings. They have not had a reply, but they are optimistic.",
          ],
          source: "Pocket Money Times (sample)",
          slot: "brief",
        },
        {
          slug: "sticker-interest-bank",
          kicker: "Savings",
          headline: "School bank pays interest in stickers, and savings have tripled",
          dek: "Save for four weeks in a row and you get a shiny one.",
          body: [
            "Pupils at Kisumu Hills Primary run their own bank from a desk in the library, with a ledger, a stamp and a tin. Anyone who saves every week for a month earns a sticker. Since the scheme began, deposits have tripled. The tin is now a biscuit tin, as the previous one was full.",
          ],
          source: "Community Purse (sample)",
          slot: "brief",
        },
        {
          slug: "piggy-bank-behind-fireplace",
          kicker: "Finds",
          headline:
            "Builders find a 1950s piggy bank behind a fireplace, and it pays for a new one",
          dek: "It held £4 2s 6d and a note that said ‘for a rainy day’.",
          body: [
            "The family renovating a cottage in Aldwick Parva counted the old coins and took them to a coin dealer, who offered £38. They spent it on a new ceramic pig, put a note inside saying ‘found you in 2026’, and bricked it back behind the fireplace for whoever comes next.",
          ],
          source: "Old House Journal (sample)",
          slot: "brief",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "aura-farming-battles",
          kicker: "Trends",
          headline: "‘Aura farming’ leaves the internet and becomes a beach contest in Lima",
          dek: "Dress as Shrek or Spider-Man, strike a pose, and whoever gets the loudest cheer wins. No touching, no insults.",
          body: [
            "Online, ‘aura farming’ means carefully cultivating an effortlessly cool presence: the slow walk, the hair flick, the look over the shoulder. Across Latin America, young people have now turned it into a live spectator sport.",
            "On 29 August, dozens of them gathered on Las Sombrillas beach in Lima, Peru, for an ‘aura battle’. Competitors, many dressed as comic-book or film characters, took turns to show off their moves in front of a crowd. The rules are strict and friendly: contestants may not touch or insult each other. “And whoever gets the crowd to make more noise wins,” said Fernando Lícito, 25, a Peruvian content creator who has organised three of the battles.",
            "Popular moves include a famous footballer's goal celebration and the ‘six, seven’ craze, and the crowd is the only judge that counts. Spider-Man and Shrek are regulars. The contests began in Brazil and have since popped up in Mexico City, Quito and in front of the Obelisk in Buenos Aires, and even as far away as Madrid, Burgos and Zaragoza.",
            "Liam González, a 20-year-old film student who competed as Shrek, explained the appeal. “Aura farming is about letting your essence flow in a place where people are watching you, but where there is no shame,” he said.",
            "María Paula Martínez, of Los Andes University, put it more simply. “It's not about being popular,” she said. “It's about showing off good vibes, and having others recognize that.”",
          ],
          source: "AP",
          sourceUrl:
            "https://apnews.com/article/farming-aura-trend-latin-america-farmeando-aura-5b82900616f7c4dc2a34566322ccc070",
          image: {
            file: "/editions/39/aura-farming-battles.jpg",
            alt: "A competitor with long red hair strikes a pose at an aura battle on a Lima beach while Spider-Man watches",
            credit: "AP Photo/Martin Mejia",
            from: "https://apnews.com/article/farming-aura-trend-latin-america-farmeando-aura-5b82900616f7c4dc2a34566322ccc070",
          },
        },
        {
          slug: "keyboard-cat-guest-post",
          slot: "feature",
          kicker: "Blogs",
          headline:
            "Cat who keeps sitting on the keyboard is given his own guest post on a coding blog",
          dek: "It is 400 characters long and mostly the letter J. Readers call it ‘his best work’.",
          body: [
            "Software developer Hana Kobayashi had noticed that every draft on her coding blog picked up a few stray lines of ‘jjjjjjjj’ whenever her cat, Miso, walked across the laptop.",
            "Rather than delete them, she decided he deserved a byline. His post, published under the title ‘Thoughts’, is 400 characters long, contains one accidental semicolon and ends with the letter J held down for most of a line.",
            "It has had more readers than anything else on the blog this year. Commenters have praised its ‘confident structure’ and asked for a sequel. One reader, a professional editor, left a note calling the final line ‘brave’. Miso has been offered a monthly column. He has so far responded by sleeping on it.",
          ],
          source: "Around the Web (sample)",
          photo: "catLaptop",
        },
        {
          slug: "front-door-a-day",
          kicker: "Photos",
          headline:
            "An account that posts one stranger's front door a day reaches door number 2,000",
          dek: "Door 1,000 was lilac. Door 2,000 had a knocker shaped like a fish.",
          body: [
            "Retired postwoman Grete Holm began photographing doors on her walks around Aarhus in 2021, always with the owner's permission, and posts one a day with a short note on its colour and its knocker. Door owners now write to her asking to be included. The waiting list is 300 doors long.",
          ],
          source: "Around the Web (sample)",
          slot: "brief",
        },
        {
          slug: "puddle-map",
          kicker: "Maps",
          headline: "An online map of the best puddles for jumping in passes 10,000 entries",
          dek: "Each puddle is rated for splash, depth and ‘how cross a parent will be’.",
          body: [
            "The map was started by a father and his five-year-old after a rainy walk in Dunmere. It now covers puddles in more than 200 towns, with one strict rule: every entry must be jump-tested before it is added. The top-rated puddle has been visited by a school trip.",
          ],
          source: "Around the Web (sample)",
          slot: "brief",
        },
        {
          slug: "door-handle-league",
          kicker: "Lists",
          headline: "Forum ranks the world's most satisfying door handles, and a library wins",
          dek: "Voters praised its ‘reassuring clunk’.",
          body: [
            "Members of the Good Handle forum post a photo, a description of the click and a score out of ten. After six months and 4,000 entries, the top spot goes to a brass lever on a library in Ghent, praised for its weight, its polish and a ‘reassuring clunk’. The librarians say people now open the door twice.",
          ],
          source: "Around the Web (sample)",
          slot: "brief",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "4th",
        caption:
          "time a humpback whale birth has ever been filmed, according to ORRCA, and the first by drone",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Mostly cosy, turning pancakes",
        detail:
          "Light breezes of newspaper rustling. Visibility good all the way to the biscuit tin, and possibly to Pluto, where it may be drizzling nitrogen.",
      },
    },
    {
      type: "quote",
      content: {
        text: "Pluto never stops surprising us.",
        by: "Alan Stern, New Horizons principal investigator",
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
        text: "We said the Wexby Allotment rowers crossed the line singing a song about marrows. It was about courgettes. They grow up so fast.",
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
