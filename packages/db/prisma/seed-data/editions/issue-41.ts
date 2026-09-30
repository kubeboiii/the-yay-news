// Issue 41, Tuesday 29 September 2026.
// Most stories are real good news, rewritten in our own words, each with its source article; images
// were fetched with apps/frontend/scripts/fetch_image.py. Every story is real.
import type { SeedEdition } from "../types.ts";

export const issue41: SeedEdition = {
  issueNumber: 41,
  date: "2026-09-29",
  status: "published",
  design: "broadsheet",
  colourway: "acid-garden",

  front: [
    {
      slug: "teacher-finds-t-rex-trackway",
      section: "discoveries",
      kicker: "Dinosaurs",
      headline: "Science teacher finds the first trail of footprints left by an adult T. rex",
      dek: "Four three-toed prints, each about a metre long, record a Tyrannosaurus out for a brisk walk 66.5 million years ago.",
      body: [
        "Kent Hups spends his working week telling teenagers that science starts with curiosity. On a volunteer dig in North Dakota he got to prove it. The science teacher from Northglenn High School in Colorado has found the first known trackway made by an adult Tyrannosaurus rex.",
        "Plenty of single T. rex footprints have turned up over the years. What nobody had found before was a sequence of them, one after another, showing the animal actually on the move. Hups spotted this one on federal land managed by the US Forest Service near the town of Marmarth, in the fossil-rich rocks of the Hell Creek Formation.",
        "The trackway is 23 feet, or about seven metres, long and made up of four three-toed prints: two left, two right. Each is roughly three feet long. The team estimates they were made about 66.5 million years ago, and the findings are published in the Journal of Vertebrate Paleontology.",
        "“Bones tell us an enormous amount about these animals, but footprints capture a moment of behavior,” said Tyler Lyson, senior curator of vertebrate paleontology at the Denver Museum of Nature & Science, who was leading the dig Hups was volunteering on. “With a trackway, we can actually follow an animal as it moved across the landscape. That is incredibly rare for T. rex.”",
        "The researchers identified the track-maker from the prints' great size, the narrow shape of the toes and the sheer number of T. rex fossils in the area. From the stride, about 13 feet, they worked out that it was walking at around 3.5 to 4.5 miles an hour, the pace of a person hurrying for a bus. The prints are weathered, so the speed is an estimate, but the picture is a surprisingly relaxed one.",
        "Every footprint was captured with high-resolution 3D scanning, which meant the lead author, Peter Falkingham, a professor of paleobiology at Liverpool John Moores University, could study them from England. “My colleagues could scan the tracks in the field and then send the 3D information over to me to visualize on my computer and in VR,” he said.",
        "For Hups, a co-author on the paper, it is the ultimate lesson plan. “As a teacher, I'm always telling my students that science starts with curiosity, passion and careful observation,” he said. “I never imagined that could lead me to a discovery like this.”",
        "Three of the prints are due to be lifted out by helicopter this autumn and taken to the Denver museum, which will share updates on the recovery with visitors this winter. “It's the closest you get to a time machine,” Hups told CBS News.",
      ],
      source: "Good News Network",
      sourceUrl:
        "https://www.goodnewsnetwork.org/massive-footprints-reveal-first-ever-adult-t-rex-trackway/",
      sticker: "RAWR",
      image: {
        file: "/editions/41/teacher-finds-t-rex-trackway.jpg",
        alt: "Kent Hups and fellow researchers kneeling beside giant T. rex footprints in the rock",
        credit: "Tyler Lyson / Denver Museum of Nature & Science",
        from: "https://www.goodnewsnetwork.org/massive-footprints-reveal-first-ever-adult-t-rex-trackway/",
      },
    },
    {
      slug: "oulu-haparanda-trains-return",
      slot: "feature",
      section: "tech",
      kicker: "Railways",
      headline:
        "All aboard at Oulu: trains to Sweden carry passengers for the first time in three decades",
      dek: "A twice-daily service now links Oulu with Haparanda, where a split bridge copes with two track gauges.",
      body: [
        "Early one Monday morning in August, a train crossed the Finnish countryside and pulled up at the Swedish border town of Haparanda. It sounds ordinary, but it was the first time in 30 years that passengers could travel between the two neighbours by rail.",
        "The new twice-daily service runs from Oulu in Finland to Haparanda, and much of the Finnish network is electrified, so trains can run all the way from Helsinki without diesel. The two countries use different track gauges; a divided railway bridge lets trains of each kind arrive and leave. From Haparanda, regional trains continue to places such as the university town of Luleå.",
        "“By linking Swedish and Finnish train services, we are creating new opportunities for people to travel, work, study and visit one another across the border,” said Joakim Berg of the regional operator Norrtåg. Connections are due to improve again when the new timetable begins in December.",
      ],
      source: "Good News Network",
      sourceUrl:
        "https://www.goodnewsnetwork.org/after-30-years-of-estranged-trains-sweden-and-finland-re-connect-their-railway-lines/",
      image: {
        file: "/editions/41/oulu-haparanda-trains-return.jpg",
        alt: "Smiling passengers, one holding a Finnish flag, aboard the first Oulu to Haparanda train",
        credit: "Aapo Riihimäki / Prime Minister's Office of Finland",
        from: "https://www.goodnewsnetwork.org/after-30-years-of-estranged-trains-sweden-and-finland-re-connect-their-railway-lines/",
      },
    },
    {
      slug: "five-generations-one-birthday",
      slot: "feature",
      section: "internet",
      kicker: "Families",
      headline: "Five generations of one Iowa family were all born on 14 September",
      dek: "Guinness World Records says the Harlows hold the record for the most generations born on the same day.",
      body: [
        "In the Harlow family, 14 September is a busy day. Fred Harlow was born on it. So were his grandfather Wilbur, his mother Addie, his daughter Emma Bell and, as of 14 September 2025, his grandson Arthur. Guinness World Records has confirmed that five generations born on the same date is a record.",
        "The pattern even alternates: “boy, girl, boy, girl, boy — the entire way through,” said Emma Bell, who lives in south-west Iowa. When she learned the family could already tie a four-generation record, she set her sights on five. Her grandmother had reminded her every year: “You have to have a boy on Sept. 14.” She was, she said, “bound and determined to make it our due date”.",
        "“You know, when you have children yeah, they're a gift,” said Fred. “This is a very unique gift.” The birthday cake, one assumes, is enormous.",
      ],
      source: "UPI",
      sourceUrl:
        "https://www.upi.com/Odd_News/2026/09/17/Guinness-World-Records-five-generations-same-birthday/5611789656758/",
      image: {
        file: "/editions/41/five-generations-one-birthday.jpg",
        alt: "A birthday cake crowded with lit candles",
        credit: "Francesca Cesa Bianchi, Milano / Wikimedia Commons",
        from: "https://commons.wikimedia.org/wiki/File:Italy_-_birthday_cake_with_candles_5.jpg",
      },
    },
  ],

  inside: [
    {
      section: "tech",
      stories: [
        {
          slug: "colorado-wildlife-overpass",
          kicker: "Engineering",
          headline: "Elk, bears and pronghorn now cross Colorado's I-25 on their own bridge",
          dek: "North America's largest wildlife overpass has made the road far safer for animals and drivers since it opened in December.",
          body: [
            "For decades, Interstate 25 between Larkspur and Monument in Colorado split the wildlife on either side in two. Now the animals have their own way over: a 209-by-200-foot bridge near the Greenland exit, the largest wildlife overpass in North America.",
            "Since it opened in December, run-ins between animals and vehicles on that stretch have fallen by 91 per cent. The cameras on the crossing show why. “We're seeing elk herds cross the bridge,” said Chuck Attardo, an environmental manager with the Colorado Department of Transportation. “We're seeing pronghorn for the first time in decades cross over to the west side of I-25 because of the bridge.” Bears, deer and coyotes use it too.",
            "It isn't only for the big animals. Biologists laid logs along part of the bridge so smaller creatures have cover as they go; the area is home to the Preble's meadow jumping mouse and northern leopard frogs, among others. “It's not just the big game species, but also the smaller,” said Brandon Marette, a wildlife biologist with Colorado Parks and Wildlife.",
            "The project also includes five underpasses and fencing that steers animals towards the crossings, and more planting is on the way. For Marette, one photograph summed up six years of work: an elk and her calf passing safely under the highway. “All the hard work for six years all came to fruition in that one moment,” he said.",
            "Colorado now hopes to build more crossings like it across the state. Judging by the cameras, the animals would approve.",
          ],
          source: "Sunny Skyz",
          sourceUrl:
            "https://www.sunnyskyz.com/good-news/6311/Colorado-039-s-Massive-Wildlife-Overpass-Has-Reduced-Animal-Collisions-by-91-",
          image: {
            file: "/editions/41/colorado-wildlife-overpass.jpg",
            alt: "A wide, grassy wildlife bridge spanning Interstate 25 in Colorado",
            credit: "Colorado Department of Transportation",
            from: "https://www.sunnyskyz.com/good-news/6311/Colorado-039-s-Massive-Wildlife-Overpass-Has-Reduced-Animal-Collisions-by-91-",
          },
        },
        {
          slug: "plastic-into-cookies",
          slot: "feature",
          kicker: "Food science",
          headline:
            "Engineered yeast turns plastic bottles and corn stalks into 3D-printed cookies",
          dek: "The NASA-backed ‘µBites’ look safe to eat, though so far testers have only been allowed to sniff them.",
          body: [
            "Plastic is carbon, and so is food. That thought led Lahiru Jayakody and his team at Southern Illinois University Carbondale, working on a NASA challenge about feeding astronauts in deep space, to an unusual recipe.",
            "PET plastic from drinks bottles and farm leftovers such as corn stalks are broken down with water and oxygen at high temperature and pressure. The molecules are fed to engineered yeast, including ordinary baker's yeast, which turns them into proteins, fats and flavourings. Mixed with fibre, starch and sweetener, the result is pushed through a 3D printer into protein-rich cookies called µBites, pronounced ‘microbites’.",
            "Formal taste tests are awaiting approval, so volunteers have judged them on aroma alone. Meanwhile graduate student Sandhya Jayasekara has taught yeast to make vanilla. “Microbes are very clever,” Jayakody said.",
          ],
          source: "ScienceDaily (American Chemical Society)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260912220033.htm",
          image: {
            file: "/editions/41/plastic-into-cookies.jpg",
            alt: "A hand holding a small 3D-printed cookie in front of a food printer",
            credit: "American Chemical Society",
            from: "https://www.sciencedaily.com/releases/2026/09/260912220033.htm",
          },
        },
        {
          slug: "leith-walk-bikes-beat-cars",
          slot: "brief",
          kicker: "Transport",
          headline: "Bikes outnumber cars on an Edinburgh rush-hour street for the first time",
          dek: "Between 8 and 9am on Leith Walk, cyclists came out ahead in a national traffic count.",
          body: [
            "Cycling Scotland's 48-hour survey in May counted 67,000 bike journeys across urban Scotland, up 25 per cent on last year. On Leith Walk, bikes beat cars in the morning rush, helped by segregated lanes and Edinburgh's e-bike hire scheme, which has logged 1.46 million trips since it launched last September.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/bikes-outnumbered-cars-on-scottish-rush-hour-route-for-the-first-time-ever/",
          image: {
            file: "/editions/41/leith-walk-bikes-beat-cars.jpg",
            alt: "Cyclists riding the segregated bike lane on Leith Walk",
            credit: "Good News Network",
            from: "https://www.goodnewsnetwork.org/bikes-outnumbered-cars-on-scottish-rush-hour-route-for-the-first-time-ever/",
          },
        },
      ],
    },
    {
      section: "startups",
      stories: [
        {
          slug: "wood-foam-from-logging-waste",
          kicker: "Materials",
          headline:
            "A Vancouver start-up is turning sawdust and wood chips into foam that could replace polystyrene",
          dek: "DicinFoam's pilot plant already makes about 400 pounds a day of packaging that rots away instead of lingering for centuries.",
          body: [
            "Open the box of almost any new television or kitchen gadget and out tumble the white foam blocks that kept it safe on the journey. That foam is usually polystyrene, and it takes around 1,000 years to break down, crumbling into microplastics as it goes. A young company in Canada thinks the forest can do the job instead.",
            "DicinFoam grew out of research by Professor Feng Jiang at the University of British Columbia. His team worked out how to take low-value pulp, wood fibres and the leftovers of logging, such as sawdust and chips, blend them together and feed the mixture into a machine that forms foam panels. The panels are then heat-pressed into the finished product, which is biodegradable.",
            "The start-up, led by chief executive Richard Chen and chief technology officer Zhu Yale, now runs a pilot plant in East Vancouver that turns out about 400 pounds of wood foam a day. The idea is to solve two problems in one go: less plastic packaging, and a use for the forestry waste that otherwise piles up on forest floors and sawmill floors.",
            "“Every tree harvested, 30% doesn't get utilized,” Chen said. “If we replace plastics with this material, that's a big deal.” Zhu put the aim neatly: “We want to extract majority value from low-value pulp, wood fibers, and forestry residues.”",
            "The next step is a facility making 1,000 tons a year on Wet'suwet'en First Nation territory near Burns Lake, British Columbia. If that goes well, the company pictures a second plant on Vancouver Island producing 15,000 tons a year, the scale at which wood foam is expected to cost about the same as the polystyrene it replaces.",
            "Which means the next fridge you unpack might arrive cushioned by the very tree offcuts that were once swept off a sawmill floor.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/wood-foam-startup-uses-logging-waste-as-substitute-for-plastic-producing-400-pounds-daily/",
          image: {
            file: "/editions/41/wood-foam-from-logging-waste.jpg",
            alt: "Two workers in hard hats hold up white panels of wood foam outside the pilot plant",
            credit: "Clare Kiernan / University of British Columbia",
            from: "https://www.goodnewsnetwork.org/wood-foam-startup-uses-logging-waste-as-substitute-for-plastic-producing-400-pounds-daily/",
          },
        },
        {
          slug: "everdye-magnetic-dyes",
          slot: "feature",
          kicker: "Fashion",
          headline:
            "French start-up EverDye colours clothes at room temperature using a clever electrical attraction",
          dek: "No boiling vats, no toxic fixatives, and around 40 per cent less water than a traditional dye house.",
          body: [
            "Dyeing fabric is thirsty, hot work. It accounts for about half of the textile industry's emissions and a fifth of the world's industrial water pollution, which is why EverDye, a French start-up run by chief executive Philippe Berlan, decided to rethink it from scratch.",
            "Its dyes are made from biowaste and mineral pigments, and they work by attraction. The fabric is first given a negative charge; the pigments then cling to it at room temperature, with no need for boiling water, harsh fixing chemicals or other additives. The company says the method uses roughly 40 per cent less water than conventional dyeing and slashes the energy bill.",
            "“Textile dyeing is a tough problem because it's deeply resource-intensive and historically very entrenched,” Berlan said. Investors liked the answer: EverDye raised a $17.5 million Series A round in the summer of 2025, and it is already working with the lingerie brand AdoreMe.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/companys-textile-dyes-work-through-magnetism-cutting-fashions-water-use-energy-and-pollution/",
          image: {
            file: "/editions/41/everdye-magnetic-dyes.jpg",
            alt: "A fan of fabric swatches in soft greys, yellows, pinks and blue",
            credit: "EverDye",
            from: "https://www.goodnewsnetwork.org/companys-textile-dyes-work-through-magnetism-cutting-fashions-water-use-energy-and-pollution/",
          },
        },
        {
          slug: "starfront-telescope-ranch",
          slot: "brief",
          kicker: "Stargazing",
          headline:
            "Texas ranch hosts nearly 1,000 telescopes so city stargazers can use dark skies from home",
          dek: "For $99 to $149 a month, Starfront Observatories keeps your telescope under some of the darkest skies around.",
          body: [
            "Astrophotographer Bray Falls set up Starfront Observatories on 40 acres near Rockwood, Texas, where the skies rate Bortle 1, the darkest on the scale. Owners mount their telescopes on concrete piers in a dozen metal buildings with roofs that roll back at night, then steer them remotely from anywhere on Earth.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/unusual-texas-ranch-raises-telescopes-to-provide-remote-dark-sky-viewing-for-those-living-amid-light-pollution/",
          image: {
            file: "/editions/41/starfront-telescope-ranch.jpg",
            alt: "Rows of telescopes on piers inside an open-roofed building at sunset",
            credit: "Starfront Observatories",
            from: "https://www.goodnewsnetwork.org/unusual-texas-ranch-raises-telescopes-to-provide-remote-dark-sky-viewing-for-those-living-amid-light-pollution/",
          },
        },
      ],
    },
    {
      section: "screen",
      stories: [
        {
          slug: "clooney-golden-lion",
          kicker: "Festivals",
          headline:
            "George Clooney collects a lifetime Golden Lion in Venice and jokes that it means he's old",
          dek: "His favourite festival honoured his career as actor, director and producer on opening night.",
          body: [
            "The 83rd Venice International Film Festival, which ran from 2 to 12 September, opened on Wednesday 2 September, and it began by giving one of its most loyal regulars a golden present. George Clooney received the Golden Lion for Lifetime Achievement at the opening ceremony, on the recommendation of the festival's artistic director, Alberto Barbera.",
            "Clooney has a long history on the Lido. Good Night, and Good Luck, one of the films he has directed, premiered there, and so did Syriana and, more recently, Jay Kelly. He has now directed nine films, and Barbera described them as refined, ambitious and outside the rules and conventions of Hollywood cinema.",
            "“In his triple capacity as actor, director, and producer, George Clooney is a complete and charismatic artist, impassioned and original,” Barbera said, praising a career that has swung from war films to sophisticated comedies, noting how irony, melancholy and unexpected depth run through all of it.",
            "Clooney, for his part, kept it light. “I've had so many extraordinary moments in Venice,” he said. “This festival is without question my favorite and to be given the Golden Lion is a tremendous honor. It also probably means I'm old, but I'll take it.”",
            "The honour crowns a remarkable career. Clooney first became famous on television in ER before moving into films such as Three Kings, Ocean's Eleven, Michael Clayton, Up in the Air, The Descendants and Gravity. He has won two Academy Awards and holds eight Oscar nominations, more than any other individual in Oscar history, according to the festival.",
            "Not bad for a man who says he is getting old.",
          ],
          source: "La Biennale di Venezia",
          sourceUrl:
            "https://www.labiennale.org/en/news/george-clooney-golden-lion-lifetime-achievement",
          image: {
            file: "/editions/41/clooney-golden-lion.jpg",
            alt: "George Clooney smiling in a dark suit at an awards event",
            credit: "Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:George_Clooney_2012.jpg",
          },
        },
        {
          slug: "futurama-finale-cliffhanger",
          slot: "feature",
          kicker: "Animation",
          headline:
            "Futurama's voice cast say they love leaving fans on a cliffhanger at the end of each season",
          dek: "Season 14 arrived on Hulu on 28 September, and its finale bounces from the 1980s to the year 3026.",
          body: [
            "Futurama has been cancelled and revived so many times, on Fox in 1999 and again in 2006, 2009 and 2022, that its writers now plan every finale as if it might be the last. The result, its cast told UPI, is a cliffhanger every time, and they would not have it any other way.",
            "“They always come up with a great finale and they have to write it with this anticipation that maybe the show won't come back,” said Billy West, 74, who voices Fry, the Professor and Zoidberg. John DiMaggio, 58, who plays Bender, likes the suspense: “I like that style. What's gonna happen? Oh no.” Lauren Tom, 65, the voice of Amy, simply said: “I just love the way the writers write me.”",
            "This season's finale leaps from Fry's 1980s childhood in New York to 3026, with a detour to the time of the cavemen. No fifteenth season has been announced yet, but West says the writers always keep a way back in.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Entertainment_News/TV/2026/09/28/Futurama-voices-Billy-West-John-DiMaggio-Lauren-Tom/6701790037662/",
          image: {
            file: "/editions/41/futurama-finale-cliffhanger.jpg",
            alt: "Billy West, the voice of Fry, laughing at a convention panel",
            credit: "Gage Skidmore / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Billy_West_by_Gage_Skidmore_3.jpg",
          },
        },
        {
          slug: "brad-pitt-autographs",
          slot: "brief",
          kicker: "Festivals",
          headline:
            "Brad Pitt spends more than 90 minutes signing autographs for fans at San Sebastian",
          dek: "The star made a marathon of his red carpet for his new survival thriller.",
          body: [
            "Pitt was in Spain for the San Sebastian film festival with his survival thriller Heart of the Beast. Instead of a quick wave, he spent more than an hour and a half signing autographs and posing for selfies along the barriers, which helped make this one of the festival's starriest editions.",
          ],
          source: "Screen Daily",
          sourceUrl:
            "https://www.screendaily.com/news/10-talking-points-from-the-2026-san-sebastian-film-festival/5220776.article",
          image: {
            file: "/editions/41/brad-pitt-autographs.jpg",
            alt: "Brad Pitt in a dark suit and tie talking to a reporter at a premiere",
            credit: "Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Brad_Pitt_(15408493447).jpg",
          },
        },
      ],
    },
    {
      section: "play",
      stories: [
        {
          slug: "minecraft-live-the-sift",
          kicker: "Minecraft",
          headline:
            "Minecraft is getting its first new dimension in 14 years, plus a hotel you can actually sleep in",
          dek: "Minecraft Live revealed the Sift, a frosty new update and a theme park at Chessington.",
          body: [
            "For fourteen years Minecraft has had three dimensions: the Overworld, where you start, the fiery Nether and the End. At Minecraft Live on 26 September, Mojang announced a fourth. It is called the Sift, described as an environment rich with souls, and it will arrive in both the Java and Bedrock editions of the game in 2027.",
            "Players will not have to wait that long to take a look. The Sift also plays a starring role in Minecraft Dungeons 2, which launched on 29 September. The sequel is built around an interconnected world centred on the town of Bravehaven, where players help villagers find a new home, with parkour sections, a jump button and more to come in later downloadable content.",
            "Before that, the next free update for the main game is called Ice Caves. It extends cold biomes underground and fills them with glowing ice crystals that can be placed on walls and floors as light. There is a new mob, the Frozen Zombie, which throws ice balls, and ordinary zombies will turn into frozen ones if they wander into powder snow. The ice balls can be collected and used as weapons or brewed into potions.",
            "Mojang also promised Sound Effects Packs for the Minecraft Marketplace later this year, so you can change how your world sounds.",
            "And for anyone who has ever wanted to live inside the game, Minecraft World is coming to Chessington World of Adventures Resort, near London, in 2027. It will include the first official Minecraft hotel and a rollercoaster called Escape the Nether.",
          ],
          source: "Yahoo Tech (IGN)",
          sourceUrl:
            "https://tech.yahoo.com/gaming/articles/minecraft-live-september-2026-everything-145958178.html",
          image: {
            file: "/editions/41/minecraft-live-the-sift.jpg",
            alt: "Minecraft's Alex runs through a blocky autumn cavern full of glowing lanterns",
            credit: "Mojang / IGN",
            from: "https://tech.yahoo.com/gaming/articles/minecraft-live-september-2026-everything-145958178.html",
          },
        },
        {
          slug: "zelda-40th-ocarina-remake",
          slot: "feature",
          kicker: "Anniversaries",
          headline:
            "Zelda turns 40 with a rebuilt Ocarina of Time, a Triforce console and a concert tour",
          dek: "Nintendo's anniversary broadcast on 8 September was all Hyrule, all the time.",
          body: [
            "The Legend of Zelda is 40, and Nintendo marked the occasion with a whole broadcast about it. The headline was a new version of Ocarina of Time, one of the series' best-loved adventures, rebuilt for Switch 2 and due on 5 November.",
            "The remake gets completely overhauled graphics, fully voiced cutscenes, expanded dialogue, orchestral music and reworked camera and controls. For collectors there is a 40th Anniversary Edition Switch 2, with matching Pro Controller and carrying case decorated with the Triforce, out on 29 October, and new amiibo figures of young Link and young Zelda in 2027, which unlock special retro-style masks in the game.",
            "Fans who prefer to listen can look forward to a 40th anniversary concert series touring the world next year. And the live-action Zelda film opens in cinemas on 30 April 2027.",
          ],
          source: "Nintendo",
          sourceUrl: "https://www.nintendo.com/sg/news/article/3Uvp2H1iPLLLSnR4MJgmq1",
          image: {
            file: "/editions/41/zelda-40th-ocarina-remake.jpg",
            alt: "A green and gold Legend of Zelda 40th anniversary crest over a mosaic of scenes from the series",
            credit: "Nintendo",
            from: "https://www.nintendo.com/sg/news/article/3Uvp2H1iPLLLSnR4MJgmq1",
          },
        },
        {
          slug: "monster-hunter-wilds-switch-2",
          slot: "brief",
          kicker: "Switch 2",
          headline:
            "Monster Hunter Wilds is coming to Switch 2 in December with every update included",
          dek: "Friends will be able to team up on the same console.",
          body: [
            "Capcom's big 2025 adventure, first released on 28 February that year for PlayStation 5, Xbox Series X/S and PC, arrives on Switch 2 on 4 December. It comes with all the updates released so far and local play, so friends can hunt together on one console, and the Ascendance expansion follows next year. Early footage, Game Informer says, suggests it runs great.",
          ],
          source: "Game Informer",
          sourceUrl:
            "https://gameinformer.com/nintendo-direct/2026/09/09/monster-hunter-wilds-hits-nintendo-switch-2-this-december",
          image: {
            file: "/editions/41/monster-hunter-wilds-switch-2.jpg",
            alt: "A group of armoured Monster Hunter Wilds hunters cheer together on a rocky plateau",
            credit: "Capcom / Game Informer",
            from: "https://gameinformer.com/nintendo-direct/2026/09/09/monster-hunter-wilds-hits-nintendo-switch-2-this-december",
          },
        },
      ],
    },
    {
      section: "music",
      stories: [
        {
          slug: "los-mirlos-tiny-desk",
          kicker: "Cumbia",
          headline:
            "Peru's Los Mirlos bring their psychedelic Amazon cumbia to NPR's famous Tiny Desk",
          dek: "More than 50 years after they started, the band crammed surf-rock guitars and a Peruvian flag behind the desk.",
          body: [
            "NPR's Tiny Desk concerts are filmed in a cluttered office in Washington, DC, among books, records and toys. On 17 September the series released one of its most colourful sessions yet: Los Mirlos, the pioneers of Peru's cumbia amazónica.",
            "The band was founded in 1973 in Moyobamba, in the Peruvian Amazon, by Jorge Rodríguez Grández, before moving to Lima. Its sound is unmistakable: cumbia rhythms played on electric guitars drenched in reverb, with a strong splash of surf rock. For more than 50 years, groups across Latin America, including Control Machete, Afrosound, Damas Gratis and La Joaqui, have sampled and covered its songs.",
            "Behind the desk the band played five of them: ‘La Danza de Los Mirlos’, ‘La Fuga del Jaguar’, ‘Llanto en la Selva’, ‘Las Noches’ and a medley of ‘La Pandilla’ and ‘Doña Guillermina’. The musicians wore clothes decorated with kené, the geometric designs of the Shipibo-Konibo Indigenous people, which Peru recognises as part of its cultural heritage.",
            "The session was filmed during the band's visit to the United States in July and released as part of El Tiny, NPR's series celebrating Latin Music Month.",
            "It caps a big couple of years for the group, who also played California's Coachella Valley Music and Arts Festival in 2025, taking cumbia amazónica to one of the biggest stages in the United States. “We are opening the way for other Peruvian artists,” Rodríguez said. Judging by the Tiny Desk, the road is wide open, and it has a very good soundtrack.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Entertainment_News/Music/2026/09/17/latam-peru-los-mirios-tiny-desk/9131789662220/",
          image: {
            file: "/editions/41/los-mirlos-tiny-desk.jpg",
            alt: "Los Mirlos, in white shirts with a Peruvian flag, play among the clutter of NPR's Tiny Desk",
            credit: "Vanessa Castillo / NPR",
            from: "https://www.npr.org/2026/09/17/g-s1-141853/los-mirlos-tiny-desk-concert",
          },
        },
        {
          slug: "john-mayer-sphere",
          slot: "feature",
          kicker: "Residencies",
          headline:
            "John Mayer books six nights at the Las Vegas Sphere, playing solo, trio and full band",
          dek: "The shows run through April 2027, and tickets go on sale in October.",
          body: [
            "John Mayer is going back to the Sphere, the giant globe-shaped venue in Las Vegas. He announced on 28 September that he will play six shows there next April, on the 8th, 10th, 11th, 15th, 17th and 18th, and that the nights will mix three different line-ups: solo, full band and trio.",
            "Mayer knows the building well, having played residency shows there in 2024 and 2025 with Dead & Company. This time the shows are his own, and the name on the giant screen is his alone, in a year when he has also been marking 20 years since his album Continuum.",
            "Fans can join an artist presale from 7 October, with general tickets on sale from 9 October. He will be sharing the building's busy calendar with, among others, Oprah Winfrey's immersive AHA experience.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Entertainment_News/Music/2026/09/28/john-mayer-las-vegas-sphere/1981790616595/",
          image: {
            file: "/editions/41/john-mayer-sphere.jpg",
            alt: "John Mayer singing and playing a white electric guitar on stage",
            credit: "Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:JohnMayerin2019.jpg",
          },
        },
        {
          slug: "trumpeter-sings-anthem",
          slot: "brief",
          kicker: "Baseball",
          headline:
            "When his trumpet gave up halfway through the anthem, the trumpeter simply sang the rest",
          dek: "The show went on at the Diamondbacks against the Yankees.",
          body: [
            "The trumpeter was playing the national anthem before the Arizona Diamondbacks took on the New York Yankees on 22 September when his instrument stopped cooperating mid-tune. Rather than walk off, he lowered the trumpet and sang the remainder himself, which is the kind of improvising most jazz players only dream about.",
          ],
          source: "Sunny Skyz",
          sourceUrl:
            "https://www.sunnyskyz.com/happy-videos/14355/Trumpet-Player-SINGS-National-Anthem-After-Trumpet-Malfunctions",
          image: {
            file: "/editions/41/trumpeter-sings-anthem.jpg",
            alt: "The trumpeter, in a Diamondbacks pinstripe jersey, plays the anthem at the ballpark",
            credit: "Sunny Skyz",
            from: "https://www.sunnyskyz.com/happy-videos/14355/Trumpet-Player-SINGS-National-Anthem-After-Trumpet-Malfunctions",
          },
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "viking-silver-under-the-lawn",
          kicker: "Treasure",
          headline:
            "Digging a new terrace, a Danish homeowner strikes Denmark's biggest Viking silver hoard",
          dek: "About 700 coins, bracelets and silver bars came out of one garden in Rebild after half an hour's digging.",
          body: [
            "The job was meant to be a few hours of hard graft: dig out stubborn grass, stone and gravel and lay a new terrace. Half an hour in, a homeowner in the Rebild municipality of northern Denmark hit something that made a strange sound.",
            "“First, I thought it was old iron or fence wire as well as some pot cuts, but when I started digging with my hands, I could suddenly fish one metal object after another out of the ground,” the landowner said in a statement. “After a short time of cautious work, it dawned on me that it was jewelry, coins, and silver bars.” It became, in their words, the biggest surprise of their life.",
            "It is the largest Viking Age silver hoard ever found in Denmark: about 700 objects weighing more than 40 pounds, or 18 kilos, nearly three times the size of the previous record. There are bracelets, 47 coins, bars, other jewellery and an amulet shaped like Thor's hammer. Some coins carry Arabic lettering, and some English ones date from between 899 and 924.",
            "It is, in effect, a Viking bank account. The Viking economy ran on silver, and the hoard includes a set of silver weights that closely match the weight of some of the jewellery, hinting at standard measures used by metalworkers. One bar is engraved with runes that appear to spell a name: ‘Hutu’.",
            "North Jutland Museums have taken the hoard for study and hope to display it permanently at the Viking Museum Fyrkat. The terrace, we assume, is still waiting.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/yard-work-reveals-largest-trove-of-viking-silver-ever-discovered-in-denmark/",
          image: {
            file: "/editions/41/viking-silver-under-the-lawn.jpg",
            alt: "Viking Age silver bracelets, coins and bars from the hoard found in Rebild",
            credit: "North Jutland Museums",
            from: "https://www.goodnewsnetwork.org/yard-work-reveals-largest-trove-of-viking-silver-ever-discovered-in-denmark/",
          },
        },
        {
          slug: "thirty-dollar-abercrombie",
          slot: "feature",
          kicker: "Bargains",
          headline:
            "A $30 painting from an estate sale turns out to be a lost Gertrude Abercrombie",
          dek: "The shell still life could sell for up to $250,000 at auction.",
          body: [
            "In July a bargain hunter paid $30 for a small, dark painting of seashells at an estate sale in Michigan. Later, visiting a touring exhibition in Milwaukee called ‘Gertrude Abercrombie: The Whole World Is a Mystery’, he opened the catalogue and found an old photograph of the very same picture.",
            "It is ‘Alderman Merriam's Shells’, painted in late 1951 by Abercrombie, the Chicago surrealist who lived and worked in Hyde Park. It shows shells from the collection of Robert Merriam laid out on a grey and black field, and it is signed ‘Abercrombie '51’ in the bottom left corner. In early 1952 she gave it to a Dr John Reynolds as payment for an operation,.",
            "Freeman's Auctions in New York is now selling it, with bidding opening at $75,000 and an estimate of up to $250,000. Not bad for $30.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/long-lost-gertrude-abercrombie-painting-bought-by-a-bargain-hunter-for-30-could-fetch-250000/",
          image: {
            file: "/editions/41/thirty-dollar-abercrombie.jpg",
            alt: "Abercrombie's painting of scattered seashells on a dark grey ground, in an old wooden frame",
            credit: "Freeman's Auctions",
            from: "https://www.goodnewsnetwork.org/long-lost-gertrude-abercrombie-painting-bought-by-a-bargain-hunter-for-30-could-fetch-250000/",
          },
        },
        {
          slug: "teacher-bonus-envelopes",
          slot: "brief",
          kicker: "Windfalls",
          headline: "Marin County donor surprises 100 teachers with envelopes worth $9,161.70 each",
          dek: "Maja Kristin gave $1 million to the Ross Valley School District.",
          body: [
            "Kristin learned that teachers in her California district earned less than their neighbours despite living in one of America's wealthiest areas, so on 13 August she had 100 of them gathered without explanation and principals handed out the cheques. Sydney Dean called it “life-changing”. “I don't think I've ever experienced such a beautiful gift from someone I don't even know,” said Amber Bunnell-Wild.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/woman-gives-1-million-in-life-changing-bonuses-to-teachers-in-her-school-district/",
          image: {
            file: "/editions/41/teacher-bonus-envelopes.jpg",
            alt: "A room full of teachers sitting and listening as the surprise is announced",
            credit: "Good News Network",
            from: "https://www.goodnewsnetwork.org/woman-gives-1-million-in-life-changing-bonuses-to-teachers-in-her-school-district/",
          },
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "greybeard-appalachian-trail",
          kicker: "Hiking",
          headline:
            "At 91, ‘Greybeard’ becomes the oldest person to hike the whole Appalachian Trail",
          dek: "Dale Sanders covered all 2,190 miles in 359 days, powered by caramel frappes and doughnuts.",
          body: [
            "Dale Sanders was born in Kentucky in 1935. On 31 August, at the age of 91, he stood on the summit of Katahdin in Maine and became the oldest person ever to complete the full Appalachian Trail, all 2,190 miles of it.",
            "The man known on the trail as Greybeard set off on 9 September 2025 from Harpers Ferry, roughly halfway along the route. He walked south to Georgia first, to follow the warmer weather, then took a break for the winter. In the spring he returned to Harpers Ferry and headed north, filling in the sections he still had to do in the Great Smoky Mountains, and kept going all the way to Maine. The whole thing took 359 days.",
            "It was not a quick stroll. Sanders counted 71 tumbles along the way, but he says the kindness of the people who looked after him made the rocky stretches easier. “When people are taking care of you and bringing you caramel frappes on the trail, the rocks don't matter,” he said.",
            "He has done this before. Sanders first finished the Appalachian Trail in 2017, at 82, and he recently became the oldest person to hike the Grand Canyon from rim to rim. His advice for staying fit is refreshingly relaxed: it is OK to eat doughnuts, he says, as long as you also exercise.",
            "“I love the outdoors,” he said. “When I'm in the woods and the Sun is shining, I'm in my best mood.” Katahdin, on a sunny day, must have felt like the perfect place to finish.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/91-yo-greybeard-becomes-oldest-person-to-hike-the-appalachian-trial-after-359-days-and-71-falls/",
          image: {
            file: "/editions/41/greybeard-appalachian-trail.jpg",
            alt: "Dale Sanders raises his arms on the Katahdin summit sign with two fellow hikers",
            credit: "Good News Network",
            from: "https://www.goodnewsnetwork.org/91-yo-greybeard-becomes-oldest-person-to-hike-the-appalachian-trial-after-359-days-and-71-falls/",
          },
        },
        {
          slug: "mesabi-trail-finished",
          slot: "feature",
          kicker: "Cycling",
          headline: "Minnesota's 165-mile Mesabi Trail is finished, 30 years after work began",
          dek: "The paved route links 28 communities from Grand Rapids to Ely, over hills made by old iron mines.",
          body: [
            "It took more than three decades of planning, building and fundraising, but the Mesabi Trail in northern Minnesota is complete. The paved path runs for 165 miles, from the Mississippi towards the Boundary Waters wilderness, and ranks among the longest paved cycling trails in the United States.",
            "It follows the Iron Range, named for the Mesabi Range of iron-ore mines, and links 28 communities between Grand Rapids and Ely. Some of its shady hills are old spoil heaps from the mines, long since grown over with forest.",
            "“This trail is the product of three decades of partnership and persistence,” said Ida Rukavina, commissioner of the state's Iron Range Resources & Rehabilitation agency, at the ribbon-cutting. In winter, stretches of it belong to cross-country skiers and snowshoers, so the trail is busy in every season.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/165mi-bike-trail-through-minnesota-finally-completed-after-30-yrs/",
          image: {
            file: "/editions/41/mesabi-trail-finished.jpg",
            alt: "A paved cycle path winding through green woods on Minnesota's Iron Range",
            credit: "Mesabi Trail",
            from: "https://www.goodnewsnetwork.org/165mi-bike-trail-through-minnesota-finally-completed-after-30-yrs/",
          },
        },
        {
          slug: "chardonnay-dog-jumps-56-backs",
          slot: "brief",
          kicker: "Baseball",
          headline: "Australian shepherd Chardonnay leaps over 56 people's backs in 16 seconds",
          dek: "The record allowed a whole minute; she needed barely a quarter of it.",
          body: [
            "Chardonnay, four, and her trainer Jennifer Fraser set the Guinness record for the most jumps between people by a dog in one minute at an Edmonton Riverhawks baseball game in Alberta. Fifty-six volunteers crouched in a row, and Chardonnay cleared the lot in 16 seconds. Fraser says jumping backs is only one of her many skills.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/02/canada-Guinness-World-Records-dog-jumps-human-backs-one-minute/6581788360056/",
        },
      ],
    },
    {
      section: "internet",
      stories: [
        {
          slug: "waterhole-livestream",
          kicker: "Livestreams",
          headline:
            "A remote Outback waterhole now streams live on YouTube, dingoes and eagles included",
          dek: "Scientists wired up a rock pool in Watarrka National Park so anyone can watch who drops in for a drink.",
          body: [
            "Most of us will never visit the waterhole in Watarrka National Park. It sits in Australia's Northern Territory, about 818 miles south of Darwin and 201 miles south-west of Alice Springs, and it is still 1.2 miles on foot from the nearest car park. Now you can watch it from your sofa, live, whenever you like.",
            "The livestream is the idea of Jennifer Davis, a freshwater ecologist at Charles Darwin University's Research Institute for the Environment and Livelihoods, who set it up with Northern Territory Parks and Wildlife. “The livestream allows us to see what's coming in, what's drinking, what the behaviors are,” she said.",
            "Plenty comes in. Dingoes are the most frequent visitors, but wallabies stop by too, along with frogs and wedge-tailed eagles, Australia's largest bird of prey. Anyone watching on YouTube can see it happen as it happens.",
            "Keeping a camera running in the middle of the desert used to be almost impossible. What changed is the kit: motion-activated cameras, solar panels, satellite internet and small, efficient computers, which together make a permanent watch on the pool possible for the first time.",
            "The park itself is famous for the sandstone walls of Kings Canyon and is an ancestral place of great importance to the Matutjara people. The waterhole, it turns out, is also a very good place to spot a thirsty dingo. Occasionally a feral cat turns up as well, and the cameras catch that too, which is exactly the kind of thing the researchers want to know about the pool and its regulars.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/australian-biologists-livestream-a-remote-desert-waterhole-and-all-its-wild-visitors/",
          image: {
            file: "/editions/41/waterhole-livestream.jpg",
            alt: "A dingo walks along red rocks beside the still waterhole in Watarrka National Park",
            credit: "Good News Network",
            from: "https://www.goodnewsnetwork.org/australian-biologists-livestream-a-remote-desert-waterhole-and-all-its-wild-visitors/",
          },
        },
        {
          slug: "hotel-plushie-holiday",
          slot: "feature",
          kicker: "Viral",
          headline: "A Sicilian hotel sends a lost toy bear home with holiday photos and a letter",
          dek: "Millions watched on TikTok as Rosie the plushie reported back on her extra days at the pool.",
          body: [
            "When Julia's family checked out of the San Domenico Palace, a Four Seasons hotel in Taormina, Sicily, her toy bear Rosie stayed behind by accident, swept up with the bedding by housekeepers. The staff found her, and then went rather further than lost property usually does.",
            "They photographed Rosie enjoying the hotel, by the pool, at the bar and tucked up in bed, and wrote Julia a letter in the bear's own voice. “Dear my special friend. When we got separated at the beautiful San Domenico Palace, I was a little worried at first, but the kind people at the hotel took very good care of me while I waited for you,” it began.",
            "The hotel posted Rosie and the letter home at its own expense. Julia's older sister shared the whole thing on TikTok, where millions of people have watched it.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/hotel-staff-give-girls-lost-plushie-the-vip-treatment-before-sending-her-home-with-a-note-look/",
          image: {
            file: "/editions/41/hotel-plushie-holiday.jpg",
            alt: "Rosie the toy bear sits at a hotel breakfast table beside a croissant and a cup of tea",
            credit: "@drea_musa via TikTok / Good News Network",
            from: "https://www.goodnewsnetwork.org/hotel-staff-give-girls-lost-plushie-the-vip-treatment-before-sending-her-home-with-a-note-look/",
          },
        },
        {
          slug: "pilots-dad-and-daughter-radio",
          slot: "brief",
          kicker: "Air traffic",
          headline: "Two United pilots, a father and daughter, bump into each other over the radio",
          dek: "“Pops, is that you?” The rest of the chat was about their phone plan.",
          body: [
            "Kenny Katnik, 24, and her dad, Kent, both fly for United Airlines, and on 18 September they found themselves on the same frequency at Washington Dulles. She opened with “Pops, is that you?” Asked whether he was proud of his daughter, he replied, “Sort of,” before the pair moved on to their mobile phone bill. United shared the recording on Instagram.",
          ],
          source: "Sunny Skyz",
          sourceUrl:
            "https://www.sunnyskyz.com/happy-videos/14353/Dad-and-Daughter-Pilots-Recognize-Each-Other-on-the-Radio-and-It-Gets-Hilarious",
          image: {
            file: "/editions/41/pilots-dad-and-daughter-radio.jpg",
            alt: "Kenny Katnik and her father Kent, both in pilot uniform, smile in a selfie in front of a plane",
            credit: "Sunny Skyz",
            from: "https://www.sunnyskyz.com/happy-videos/14353/Dad-and-Daughter-Pilots-Recognize-Each-Other-on-the-Radio-and-It-Gets-Hilarious",
          },
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "bepicolombo-reaches-mercury",
          kicker: "Space",
          headline:
            "After an eight-year trip and nine planet flybys, BepiColombo arrives at Mercury",
          dek: "The European-Japanese mission is only the third spacecraft ever to visit the innermost planet.",
          body: [
            "Mercury is close to us, as planets go, but it is one of the hardest places in the solar system to reach. On 3 September the European Space Agency celebrated anyway: its BepiColombo mission, run with the Japan Aerospace Exploration Agency, has arrived at the innermost planet, only the third spacecraft ever to go there.",
            "The problem is the Sun. Falling towards it, a spacecraft picks up so much speed that simply flying straight at Mercury would mean shooting straight past. Getting into orbit takes about as long as reaching Pluto. So BepiColombo spent more than eight years looping around the solar system, using nine planetary flybys to brake a little at a time.",
            "At noon in the mission control room in Darmstadt, Germany, the first arrival step was confirmed: the Mercury Transfer Module, the propulsion stage that got the spacecraft there, separated and drifted away. ESA called it one of the most complex planetary arrival sequences it has ever attempted.",
            "“We heard it loud and clear in the voice loop from Flight Dynamics Manager, Frank Budnik, that they could clearly see from the Doppler data that MTM had separated,” said Emmanuela Bordoni, one of the mission's spacecraft operations managers. “After all this waiting and preparation, we all looked at each other and hugged. It was a very powerful moment.”",
            "Two science orbiters, one European and one Japanese, will now study Mercury's surface, interior and magnetic field, with their main mission starting in April 2027. “It's fantastic that we've taken this first important step towards finally being able to use all the powerful instruments,” said the mission's lead project scientist, Geraint Jones.",
            "Eight years is a long journey. Judging by the hugging, it was worth it.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/humanitys-3rd-visit-to-mercury-kicks-off-with-the-successful-arrival-of-bepicolombo-mission/",
          image: {
            file: "/editions/41/bepicolombo-reaches-mercury.jpg",
            alt: "An illustration of the BepiColombo spacecraft arriving at the grey, cratered planet Mercury",
            credit: "ESA",
            from: "https://www.goodnewsnetwork.org/humanitys-3rd-visit-to-mercury-kicks-off-with-the-successful-arrival-of-bepicolombo-mission/",
          },
        },
        {
          slug: "nabarlek-back-on-camera",
          slot: "feature",
          kicker: "Animals",
          headline: "Tiny nabarlek wallaby turns up on trail cameras after 50 years unseen",
          dek: "Australia's second-smallest wallaby, about as long as a loaf of bread, was confirmed at two sites in the Kimberley.",
          body: [
            "The nabarlek weighs about 1.2 kilograms, lives among remote rocks and looks very like two of its cousins, which makes it one of the hardest animals in Australia to find. So the Australian Wildlife Conservancy was thrilled when trail cameras and droppings confirmed it at two new sites in the Kimberley region of Western Australia.",
            "One population is in the Yampi Sound Training Area on Dambeemangaddee Country, the first ever recorded there; the other is about 170 kilometres away. They are the first sightings on mainland Dambeemangaddee Country in more than 50 years.",
            "“This is very exciting and great news for the species,” said AWC senior field ecologist Larissa Potter. Inga Pedersen, a Dambeemangaddee traditional owner, put it simply: “It's good to know that they're there; it shows their country is healthy.”",
          ],
          source: "Good Good Good",
          sourceUrl:
            "https://www.goodgoodgood.co/articles/tiny-wallaby-nabarlek-trail-cameras-australia",
          image: {
            file: "/editions/41/nabarlek-back-on-camera.jpg",
            alt: "A small rock-wallaby, the nabarlek, perched on rocks",
            credit: "Australian Wildlife Conservancy",
            from: "https://www.goodgoodgood.co/articles/tiny-wallaby-nabarlek-trail-cameras-australia",
          },
          more: [
            {
              file: "/editions/41/nabarlek-back-on-camera-2.jpg",
              alt: "A nabarlek nibbles leaves on a boulder, caught at night by a trail camera",
              credit: "Good Good Good",
              from: "https://www.goodgoodgood.co/articles/tiny-wallaby-nabarlek-trail-cameras-australia",
            },
            {
              file: "/editions/41/nabarlek-back-on-camera-3.jpg",
              alt: "A ranger walks through tall grass towards the sandstone country where the cameras were set",
              credit: "Good Good Good",
              from: "https://www.goodgoodgood.co/articles/tiny-wallaby-nabarlek-trail-cameras-australia",
            },
            {
              file: "/editions/41/nabarlek-back-on-camera-4.jpg",
              alt: "A nabarlek, a wallaby smaller than a house cat, crosses the rocks with its tail curled",
              credit: "Good Good Good",
              from: "https://www.goodgoodgood.co/articles/tiny-wallaby-nabarlek-trail-cameras-australia",
            },
          ],
        },
        {
          slug: "proof-by-underpants",
          slot: "brief",
          kicker: "Soil",
          headline: "Swiss volunteers bury more than 2,000 pairs of underpants, all for science",
          dek: "How fast the cotton rotted showed where soil life is busiest: gardens won, lawns came last.",
          body: [
            "The Proof by Underpants project, run by the University of Zurich and Agroscope, asked 1,000 volunteers to bury cotton pants and tea bags at sites across Switzerland and dig them up two months later. Private gardens broke them down fastest, a sign of the liveliest soil. Neat lawns were the slowest.",
          ],
          source: "ScienceDaily (University of Zurich)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/08/260827010501.htm",
          image: {
            file: "/editions/41/proof-by-underpants.jpg",
            alt: "A new pair of cotton pants beside one dug up after months in the soil",
            credit: "ScienceDaily",
            from: "https://www.sciencedaily.com/releases/2026/08/260827010501.htm",
          },
        },
      ],
    },
    {
      section: "animal-kingdom",
      stories: [
        {
          slug: "battersea-foster-couple",
          kicker: "Dogs",
          headline:
            "A retired couple have fostered 59 dogs for Battersea, and they have no plans to stop",
          dek: "Nicole and Gary Wordsworth have looked after everything from Staffies to a husky with a happy food dance.",
          body: [
            "Nicole and Gary Wordsworth are both in their 60s and retired, and for the past 15 years their home in Buckinghamshire has rarely been without a guest. The couple foster dogs for Battersea Dogs Home, and so far they have looked after 59 of them.",
            "It started in late 2011. They had been caring for friends' dogs when they spotted an advertisement, signed up, and welcomed “our first little Staffie called Marcel.” Since then dogs have stayed with them for anything from a couple of nights to 18 months, among them plenty of Staffordshire bull terriers and, lately, a Siberian husky.",
            "Fostering is not only about cuddles. The Wordsworths act as the dogs' inside source for Battersea's adoption staff, reporting back on each one's habits: “what toys they prefer, when they like to eat their dinner, how far they like to walk, and sleep times.” That helps the charity match every dog with the right new family.",
            "Some guests leave a particular mark. One large American bulldog learned a whole set of tricks while he was with them and was then reunited with his original owner, who found him through an advert. “He got his fairy tale ending too,” Nicole said. A husky called Stormy stayed for four months and greeted every meal with a happy food dance.",
            "The couple say Battersea makes it easy, because the charity will “give you a lot of time, training, and pay for everything.” And the reason they keep saying yes is simple: “We love to get them out of the kennels.” Dog number 60, presumably, is already on its way.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/couple-fosters-59-dogs-in-retirement-we-love-to-get-them-out-of-the-kennels/",
          image: {
            file: "/editions/41/battersea-foster-couple.jpg",
            alt: "Nicole and Gary Wordsworth sit on a sofa at home with a Siberian husky",
            credit: "Battersea Dogs Home / SWNS",
            from: "https://www.goodnewsnetwork.org/couple-fosters-59-dogs-in-retirement-we-love-to-get-them-out-of-the-kennels/",
          },
        },
        {
          slug: "lucky-seven-penguin-chicks",
          slot: "feature",
          kicker: "Zoo babies",
          headline:
            "Myrtle Beach aquarium welcomes seven critically endangered African penguin chicks this year",
          dek: "Two hatched early in the year, then five more arrived, and staff are thrilled.",
          body: [
            "Ripley's Aquarium of Myrtle Beach in South Carolina thought it had done well when two African penguin chicks hatched earlier this year. Then five more arrived, bringing the total for 2026 to seven.",
            "“We thought we were lucky with our first two chicks, but welcoming five more has made this an unforgettable year,” said Courtnie Barnett, the aquarium's general manager.",
            "African penguins are classed as critically endangered, which makes every chick a real boost. Ripley's takes part in the Association of Zoos and Aquariums' Species Survival Plan for the species and works with SANCCOB, the South African seabird charity. For now the animal care team is keeping a close eye on the youngsters as they grow and start to show their personalities, so visitors may not always spot them straight away.",
          ],
          source: "Ripley's Aquarium of Myrtle Beach via Newswire",
          sourceUrl:
            "https://www.newswire.com/news/getting-lucky-meet-7-new-penguin-chicks-at-ripley-s-aquarium-of-myrtle-22854978",
          image: {
            file: "/editions/41/lucky-seven-penguin-chicks.jpg",
            alt: "Three smiling keepers sit cross-legged, each cradling fluffy grey penguin chicks",
            credit: "Ripley's Aquarium of Myrtle Beach",
            from: "https://www.newswire.com/news/getting-lucky-meet-7-new-penguin-chicks-at-ripley-s-aquarium-of-myrtle-22854978",
          },
        },
        {
          slug: "kingfisher-sits-on-rangers-hand",
          slot: "brief",
          kicker: "Birds",
          headline: "Park ranger asks for a sign, and a kingfisher lands on her hand",
          dek: "The famously shy bird stayed for ten minutes while Laura O'Brien carried on watering the flowers.",
          body: [
            "O'Brien, 24, looks after green spaces for Frome Town Council in Somerset. She was watering flower beds when a kingfisher darted up; thinking it might need help, she held out a gloved hand and it hopped on. “I felt like Snow White!” she told SWNS. It flew back to the river, and her fellow rangers are jealous.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/woman-asked-for-a-sign-and-a-kingfisher-sits-on-her-hand/",
          image: {
            file: "/editions/41/kingfisher-sits-on-rangers-hand.jpg",
            alt: "A kingfisher perched calmly on a ranger's hand",
            credit: "Good News Network",
            from: "https://www.goodnewsnetwork.org/woman-asked-for-a-sign-and-a-kingfisher-sits-on-her-hand/",
          },
        },
      ],
    },
    {
      section: "future-stuff",
      stories: [
        {
          slug: "somersaulting-microrobot",
          kicker: "Robots",
          headline:
            "MIT's insect-sized flying robot learns to do ten somersaults in eleven seconds",
          dek: "A new AI pilot made the paperclip-light machine about 450 per cent faster, with the reflexes of a bumblebee.",
          body: [
            "Most drones are chunky things that buzz about the sky. The one built in Kevin Chen's lab at the Massachusetts Institute of Technology is about the size of a microcassette and weighs less than a paperclip. It flies by flapping its wings, which are driven by soft artificial muscles that let them beat very fast, like an insect's.",
            "Being tiny and nimble on paper is one thing. Actually steering something that small through quick, twisting manoeuvres is another, and the robot's earlier controllers kept it rather sedate. So the team designed a new AI-based pilot in two parts. The first is a planner that works out the best way to perform a complicated move. The second is a deep-learning policy, trained by imitating that planner, which is quick enough to make the split-second corrections a tumbling robot needs in flight.",
            "The results look like something from a nature documentary. The robot flew about 450 per cent faster than before and accelerated about 250 per cent harder. It performed ten somersaults in eleven seconds and never drifted more than four or five centimetres from its planned path.",
            "“The robust training method is the secret sauce of this technique,” said Jonathan How, the Ford Professor of Engineering, who led the work with Chen. The paper, published in Science Advances, lists the graduate student Yi-Hsuan Hsiao, Andrea Tagliabue and Owen Matteson as co-lead authors, alongside Suhan Kim and Tong Zhao.",
            "For now the robot flies indoors, guided by an external motion-capture system that tracks where it is. The next step is to give it its own cameras and sensors so it can find its way outdoors, into tight spaces where ordinary drones cannot follow. Somersaults, presumably, optional.",
          ],
          source: "ScienceDaily (MIT)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260921081114.htm",
          image: {
            file: "/editions/41/somersaulting-microrobot.jpg",
            alt: "A long-exposure image traces the loops of a tiny winged robot flying a circuit",
            credit: "MIT",
            from: "https://news.mit.edu/2025/mit-engineers-design-aerial-microrobot-fly-like-bumblebee-1203",
          },
        },
        {
          slug: "starling-navigates-by-debris",
          slot: "feature",
          kicker: "Space",
          headline:
            "NASA satellites find their way around orbit by spotting other spacecraft, no GPS required",
          dek: "The Starling swarm used its star-tracker cameras to treat nearby objects as landmarks.",
          body: [
            "Sailors once navigated by the stars. NASA's Starling mission has gone one better and navigated by everything else up there. Working with EraDrive, a start-up from Stanford University, NASA tested a system called FALCON, short for Fast Autonomous Lost-in-space Catalog-based Optical Navigation.",
            "FALCON uses the satellite's star-tracker camera to spot other spacecraft and bits of orbital debris, then matches them against a public US Department of Defense catalogue of known objects. From those landmarks it works out where it is, and it sharpens its estimates of the other objects' orbits too. Over three days, with no help from the ground, it refined the orbits of more than 200 objects, drawing on an onboard catalogue of about 20,000.",
            "“The number of ‘firsts’ from Starling just keeps growing,” said Roger Hunter of NASA's Small Spacecraft and Distributed Systems program. Tests across all four Starling spacecraft are planned for later in 2026, and the same trick could one day guide swarms of satellites around the Moon.",
          ],
          source: "ScienceDaily (NASA)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/08/260826055450.htm",
          image: {
            file: "/editions/41/starling-navigates-by-debris.jpg",
            alt: "An illustration of four small CubeSats flying in formation above the curve of the Earth",
            credit: "NASA / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Starling%E2%80%99s_four_CubeSats_in_low_Earth_orbit_(illustration)_(ACD23-0077-004).jpg",
          },
        },
        {
          slug: "roman-telescope-early-launch",
          slot: "brief",
          kicker: "Telescopes",
          headline:
            "NASA's Roman Space Telescope lifts off nine months early, ready to map the Milky Way in a month",
          dek: "Hubble would need about a century for the same job.",
          body: [
            "The Nancy Grace Roman Space Telescope launched on a SpaceX Falcon Heavy from Cape Canaveral on 30 August. It can take pictures as deep as the famous Hubble Deep Field hundreds to a thousand times faster, will hunt for planets around other stars and will study dark matter and dark energy. “Roman will become a household name,” said NASA's administrator, Jared Isaacson.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/nancy-grace-roman-space-telescope-survives-attempted-budget-cuts-to-launch-9-months-early/",
          image: {
            file: "/editions/41/roman-telescope-early-launch.jpg",
            alt: "An illustration of the Roman Space Telescope in space with its solar panels unfolded",
            credit: "NASA Goddard Space Flight Center / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Nancy_Grace_Roman_Space_Telescope_Illustrations_(Roman_Space_Telescope_Animation1_Still).jpg",
          },
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "66.5m",
        caption:
          "years since a T. rex strolled past the spot where a science teacher found its footprints",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Tuesday: fair, with scattered ducks",
        detail:
          "Duck showers over Lake Orrin clear by mid-morning, followed by sunsets rated seven and above. A slow-moving tortoise front arrives around teatime. Visibility good all the way to Mercury.",
      },
    },
    {
      type: "quote",
      content: {
        text: "After all this waiting and preparation, we all looked at each other and hugged. It was a very powerful moment.",
        by: "Emmanuela Bordoni, ESA, as BepiColombo arrived at Mercury",
      },
    },
    {
      type: "correction",
      content: {
        text: "Monday's edition said a star cluster looked like it was smiling. It was, in fact, grinning. We apologise to Gary.",
      },
    },
    {
      type: "correction",
      content: {
        text: "Monday's edition described the Royals' inflatable hot dog as ‘giant’. Having watched the video again, we would like to upgrade it to ‘colossal’.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Moths, for a game about moths. Real moths not required. Imaginary moths preferred.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FREE",
        text: "An open-source app that reminds you to water your plants in the voice of a disappointed fern. Also answers to Fernando.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "LOST",
        text: "Three rubber ducks, last seen heading east across Lake Orrin. One has a moustache. Reward: one ice lolly each.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: Have you ever been to a football match?",
          "PIGEON: I've been to all of them.",
          "PIP: Did you watch?",
          "PIGEON: I watched the chips.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. See you tomorrow." } },
  ],
};
