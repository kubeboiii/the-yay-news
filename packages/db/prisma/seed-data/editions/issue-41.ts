// Issue 41, Tuesday 29 September 2026.
// Most stories are real good news, rewritten in our own words, each with its source article; images
// were fetched with apps/frontend/scripts/fetch_image.py. Stories marked "(sample)" are invented.
import { ladder, mini, riddle } from "../puzzles.ts";
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
      headline: "Passenger trains cross between Finland and Sweden again after 30 years",
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
      section: "internet-and-culture",
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
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "brass-band-game-soundtrack",
          kicker: "Music",
          headline:
            "Brass band plays a whole video-game soundtrack in the park, boss battle included",
          dek: "The tubas did the explosions, and 2,000 people hummed the level-up jingle all the way home.",
          body: [
            "The Ferrisham Silver Band is 112 years old and has played at every town fete since the first one. This summer its members voted, 19 to 9, to try something new: the complete soundtrack of ‘Spry’, a much-loved platform game about a squirrel collecting acorns across seven worlds.",
            "Arranging it fell to the musical director, Olumide Hartley, who spent June listening to the game through headphones and writing it out for 28 brass players and a percussionist. “The original was made on a computer chip with three voices,” he said. “We have twenty-eight voices and a bass drum. It got a bit bigger.”",
            "Sunday's concert on Ferrisham Green drew about 2,000 people, many in home-made squirrel ears. The band played every level in order, including the underwater world, which the cornets performed very quietly while the audience swayed. For the boss battle the tubas handled the explosions, and a trombonist marched into the crowd for the final chase.",
            "The loudest cheer of the day was for a tune that lasts two seconds: the jingle for collecting a golden acorn. The band had to play it six times before the crowd would let them move on.",
            "The game's composer, Naomi Veer, was in the audience. “I wrote those tunes in a bedroom with the curtains shut,” she said. “Hearing them played in a bandstand, in the sunshine, was one of the best afternoons of my life.”",
            "Next, the band plans a medley of loading-screen music. It will be, Mr Hartley promises, ‘very relaxing, with occasional progress’.",
          ],
          source: "Music Notes (sample)",
          photo: ["concert", 1],
        },
        {
          slug: "paddleboard-cinema",
          slot: "feature",
          kicker: "Film",
          headline: "Lake cinema screens a comedy to 300 people sitting on paddleboards",
          dek: "The screen floated, the projector sat on a jetty, and most of the popcorn floated too.",
          body: [
            "The Lake Tessel summer cinema ended its season on the water. As the sun went down, 300 viewers paddled out, tied their boards together in rows with colour-coded ropes and settled in for a comedy about a hotel for retired weather balloons.",
            "The screen, a sheet of sailcloth stretched over a frame of drainpipes, was anchored 40 metres from the shore. Sound came from speakers on a pontoon, and a volunteer in a kayak sold popcorn from a waterproof cool box.",
            "“The ushers were in canoes,” said organiser Beatriz Salgado. “If you needed the loo, you raised a paddle and someone towed you in.” Everyone, she stressed afterwards, stayed dry. Next summer they hope to try a musical, with a sing-along section ‘for the brave’.",
          ],
          source: "Picture House Post (sample)",
          photo: ["popcorn", 0],
        },
        {
          slug: "sixty-second-film-festival",
          slot: "brief",
          kicker: "Film",
          headline: "Film festival where every film lasts under a minute sells out in a day",
          dek: "The winner was 41 seconds long and starred a very dramatic goose.",
          body: [
            "The Minute Festival in Aldermoor screened 180 films in three hours, each timed by a volunteer with a stopwatch and a whistle. Entries included a heist set in a biscuit tin and a romance told entirely through shoes. The winner, ‘Honk’, is a goose walking slowly towards the camera and staring. Its ovation lasted longer than the film.",
          ],
          source: "Screen Weekly (sample)",
        },
        {
          slug: "podcast-recorded-in-a-lift",
          slot: "brief",
          kicker: "Podcasts",
          headline: "A podcast recorded entirely in an office lift reaches its 200th episode",
          dek: "Each guest gets one ride, ground floor to ninth, to tell their story.",
          body: [
            "‘Going Up’ is made by two receptionists in Tarrow who invite whoever steps into their building's lift to tell a story before the doors open again. The ride takes 48 seconds. The 200th guest, a cellist, managed a whole lullaby in that time, then took the stairs back down to bow in the lobby.",
          ],
          source: "Audio Weekly (sample)",
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "twelve-year-old-puzzle-award",
          kicker: "Awards",
          headline: "Puzzle game made by a twelve-year-old wins best debut at a games festival",
          dek: "Wren Adeyemi built ‘Moth & Lamp’ on a school laptop during wet lunchtimes.",
          body: [
            "Wren Adeyemi started making ‘Moth & Lamp’ last winter, when rain kept her class indoors at lunchtime and the school's computer club was the warmest room in the building. On Saturday it won Best Debut at the Harbourlight Games Festival, beating 212 entries from studios, students and one team of university professors.",
            "The idea is simple. A small moth wants to get home across a sleepy village at night, but it always flies towards the nearest light, so the player switches lamps, porch lights and bedroom windows on and off to steer it. Later levels add fireflies, a full moon and a very bright chip shop.",
            "She built it in a free game engine, drew every sprite herself and asked her older brother to write the music on a keyboard. Her teacher suggested she enter the festival's open category ‘just to see’.",
            "“I thought if I was lucky someone might play it,” said Wren. “Then about 400 people played it, and some of them cried a bit at the end, in a good way.” The judges praised its ‘confident, gentle design’ and a final level most players take twenty minutes to solve and two seconds to understand.",
            "Accepting the award, she thanked her teacher, her brother, her cat and ‘everyone who didn't tell me it was too hard’. A small studio has offered to help her release it next spring. She has accepted, on condition that she can still go to school.",
          ],
          source: "Indie Arcade (sample)",
          photo: ["controller", 1],
        },
        {
          slug: "game-post-office-real-postcards",
          slot: "feature",
          kicker: "Cosy games",
          headline:
            "Cosy village game's post office starts delivering real postcards to players' homes",
          dek: "Send a letter to a friend's farm in the game, and a printed card lands on their doormat a week later.",
          body: [
            "In ‘Hollyhock Lane’, a gentle game about running a village garden, players have always been able to post letters to each other's farms. Last month its two-person studio in Wren Harbour added a twist: tick a box, pay the price of a stamp, and your letter is printed on a postcard and posted for real.",
            "More than 40,000 cards have been sent so far, each printed with a picture of the sender's in-game garden. The studio says the most popular message is simply ‘Your turnips look great.’",
            "“We thought maybe a few hundred people would try it,” said co-founder Mireille Okafor-Laine. “Now our local post office has asked us to warn them before a big update.”",
          ],
          source: "Indie Arcade (sample)",
        },
        {
          slug: "fastest-possible-pumpkin",
          slot: "brief",
          kicker: "Speedrunning",
          headline:
            "Speedrunners agree the fastest possible pumpkin in a farming game takes 19 days",
          dek: "It is the only speedrun where the main technique is waiting patiently.",
          body: [
            "Players of the gardening game ‘Plot Twist’ spent a month testing every mix of soil, sunlight and watering can to grow its prize pumpkin as fast as the rules allow. The winning route: plant at dawn, whistle to the seeds on day four, then leave it alone. The record holder read two novels during her run.",
          ],
          source: "Speedrun Weekly (sample)",
        },
        {
          slug: "one-button-kart-mode",
          slot: "brief",
          kicker: "Accessibility",
          headline: "Kart racer adds a mode you can play with a single button",
          dek: "It was designed with players who wanted to race while holding a sleeping baby.",
          body: [
            "The makers of ‘Turbo Teacup’ have added One-Button Mode, in which the car steers itself and players only decide when to boost, drift and lob a cream bun. It was built with testers who wanted to play one-handed, holding a baby, a sandwich or a cup of tea. It is now the game's most popular way to play.",
          ],
          source: "Indie Arcade (sample)",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "rubber-duck-lake-swim",
          kicker: "Swimming",
          headline: "Swimmer crosses Lake Orrin escorted by a flotilla of 500 rubber ducks",
          dek: "Each duck was decorated by a child she teaches, and every one was promised a trip home.",
          body: [
            "Tamsin Holloway had swum across Lake Orrin twice before, both times with a single rowing boat and a brother who kept offering her jelly babies. For her third crossing, on Sunday, she had company.",
            "Holloway, 34, a swimming teacher from the lakeside town of Merrin Cove, was raising money for a new paddling pool at the leisure centre. Instead of asking adults for sponsorship, she asked the children she teaches. Each paid 50p to decorate a rubber duck with a name, a face and, in several cases, a small painted moustache.",
            "At 9am a support boat released all 500 at the start line, and a gentle westerly did the rest. For most of the four-kilometre crossing a yellow cloud of ducks bobbed along beside and slightly ahead of her, as if leading the way.",
            "“About halfway across I stopped feeling like I was swimming alone and started feeling like I was in a parade,” she said. “One duck, Captain Spoon, stayed next to my left ear for nearly an hour. I've asked for him to be framed.”",
            "She reached the far shore in one hour and 52 minutes, her fastest time. The ducks took longer. Volunteers in kayaks spent the afternoon scooping them up with fishing nets, and by sunset 497 had been recovered. The swim raised £4,300, enough to start the paddling pool this winter. A reward of one ice lolly each is on offer for the last three.",
          ],
          source: "Finish Line (sample)",
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
            "“This trail is the product of three decades of partnership and persistence,” said Ida Rukavina, commissioner of the state's Iron Range Resources & Rehabilitation agency, at the ribbon-cutting. In winter, stretches of it belong to cross-country skiers and snowshoers.",
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
        {
          slug: "orienteering-lucky-wrong-turn",
          slot: "brief",
          kicker: "Orienteering",
          headline: "Orienteer who took a wrong turn finds a faster route and wins",
          dek: "The course has been redrawn, and the short cut named after her.",
          body: [
            "Midway through the Greywood Forest championship, Siobhan Achebe misread a map symbol and followed a deer track she had never noticed. It brought her out 300 metres ahead of the leaders. Organisers checked, found the route perfectly legal, and have added it to next year's map as ‘Achebe's Mistake’.",
          ],
          source: "Trail & Compass (sample)",
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
        },
        {
          slug: "hedgehog-highway",
          slot: "brief",
          kicker: "Wildlife",
          headline: "A street cuts hedgehog-sized holes in every fence to make a hedgehog highway",
          dek: "Reserve story: kept in case another is pulled.",
          body: [
            "Residents of Orchard Close linked all 22 gardens with small gaps at the bottom of their fences. A night camera has since recorded hedgehogs using the route most evenings, and one has been seen visiting every garden in a single night, stopping at number 14 for a long drink from the bird bath.",
          ],
          source: "Countryside Chronicle (sample)",
          reserve: true,
        },
      ],
    },
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
            "Colorado now hopes to build more crossings like it across the state.",
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
          slug: "narrowest-drivable-car",
          slot: "brief",
          kicker: "Cars",
          headline:
            "Italian rebuilds a Fiat Panda just 19.76 inches wide, the narrowest drivable car",
          dek: "Andrea Marazzi's slimline hatchback is in the new Guinness World Records 2027 book.",
          body: [
            "Marazzi, 31, slimmed the little Italian hatchback down to about 50 centimetres across and kept it drivable, earning the record for the world's narrowest drivable car. “It means a lot because the car has made so many people smile,” he said. Parking, we imagine, is no longer an issue.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/10/Guinness-World-Records-book-new-titles/8281789059748/",
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
          slug: "pet-portrait-banknotes",
          slot: "feature",
          kicker: "Local currency",
          headline:
            "Town's new local banknotes feature residents' pets, and nobody wants to spend them",
          dek: "The five is a tortoise called Colin; the ten is a very serious rabbit called Judge.",
          body: [
            "The Pellinghurst Pound, accepted by 140 shops and stalls in the town alongside ordinary money, used to show the town hall and the old bridge. This summer its committee asked residents to nominate their pets for a new series instead. More than 2,300 were put forward and a public vote chose four, including Colin the tortoise, who walks the length of his garden every afternoon.",
            "The notes went into circulation in August, and there is one problem. “People change twenty pounds into Pellinghurst Pounds and then go home and put them in a frame,” said treasurer Adaeze Lomax. “Which is lovely, but it isn't really how money is supposed to work.”",
            "Several shops now offer a small discount to anyone who pays with Judge.",
          ],
          source: "Pocket Money Times (sample)",
          photo: "tortoise",
        },
        {
          slug: "mountain-station-sock-machine",
          slot: "brief",
          kicker: "Vending",
          headline: "Mountain station's vending machine now sells more socks than chocolate",
          dek: "Walkers who arrive with wet feet have made thick wool socks the best-seller.",
          body: [
            "The machine at Grauhorn Pass station, 2,100 metres up, was meant for snacks. Last year the station master added one row of wool socks knitted in the village below, ‘just in case’. This summer they outsold chocolate, 3,400 pairs to 2,900 bars. “People clap when the socks drop,” she said. “Nobody has ever clapped for crisps.”",
          ],
          source: "Alpine Post (sample)",
        },
        {
          slug: "coin-jar-balloon-ride",
          slot: "brief",
          kicker: "Savings",
          headline: "Couple's 30-year coin jar finally pays for a sunrise balloon ride",
          dek: "They agreed to open it only when it was too heavy to lift, and it finally was.",
          body: [
            "Since their wedding day, Tomasz and Nadia Wieczorek of Lindenfeld have dropped every spare coin into a ten-litre glass jar on the landing. Last week neither could lift it. The bank's machine took 40 minutes to count £2,184.60. They spent it on a balloon flight over the valley, with enough left for breakfast.",
          ],
          source: "Pocket Money Times (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "sunset-review-blog",
          kicker: "Blogs",
          headline: "A blog that reviews one sunset a day publishes its 1,000th review",
          dek: "Scores are out of ten, nothing has ever scored below six, and only one has ever earned a ten.",
          body: [
            "Every evening for almost three years, Leonie Okwu-Brandt has walked from her flat in Harrowmere to the tram depot to start her night shift, and every evening she has written a short review of the sunset on the way.",
            "The reviews appear on a plain little blog called ‘Tonight's Sky, Rated’. Each one is about 150 words long and ends with a score out of ten and a one-line verdict: ‘Strong opening, lost its nerve in the third act.’ ‘Too much orange. I stand by this.’ ‘A quiet one. Underrated. Seven.’ On Sunday she published number 1,000.",
            "“I started because I was always on my way to work at the best time of day, and I wanted to notice it properly,” she said. “I never thought anybody would read them. My mum read them. That was the plan.”",
            "About 60,000 people now do. Readers send in photographs of their own skies, and every Saturday she reviews a guest sunset. A small, devoted group argue in the comments about her marking, which several describe as ‘harsh but fair’.",
            "The lowest score she has ever given is six. The only ten, awarded in the spring of last year, went to ‘a pink one over the gasworks that nobody expected’. She says she will know the next one when she sees it. Her colleagues at the depot now time their breaks so they can watch with her.",
          ],
          source: "Around the Web (sample)",
          photo: "bench",
        },
        {
          slug: "tongue-twister-in-70-languages",
          slot: "feature",
          kicker: "Language",
          headline:
            "Tongue-twister challenge gathers 3,000 recordings in 70 languages, mostly of people failing",
          dek: "The rule is to say your language's hardest twister three times fast, and post it whatever happens.",
          body: [
            "It began when a linguistics student in Castellane posted herself attempting a notoriously tricky tongue-twister from her grandmother's village and collapsing into giggles on the third go. She asked other people to share the hardest one in their own language.",
            "Six weeks later the online archive holds more than 3,000 recordings in 70 languages, each with a written translation. Many of the translations make no sense at all, which volunteers say is part of the charm. The most-played clip is a man in a car park getting one right on his 41st attempt, then driving off without a word.",
            "The archive's founder is now compiling a printed booklet. It will come with a warning not to read it aloud on public transport.",
          ],
          source: "Around the Web (sample)",
        },
        {
          slug: "houseplant-name-census",
          slot: "brief",
          kicker: "Forums",
          headline:
            "Houseplant forum holds its first census, and the favourite fern name is Fernando",
          dek: "About 90,000 members named 1.2 million plants between them.",
          body: [
            "Members of Leafy Neighbours were asked to list every plant they own and what it is called. The most common cactus name was Spike, by a distance. One member in Callowmere has 64 spider plants, all called Kevin, which she says ‘saves time’. The forum plans a second census next spring, after repotting season.",
          ],
          source: "Around the Web (sample)",
        },
        {
          slug: "window-wednesday-drawing",
          slot: "brief",
          kicker: "Challenges",
          headline: "Thousands now draw the view from their window every Wednesday",
          dek: "There is one rule: ten minutes, and you post it however it turns out.",
          body: [
            "Window Wednesday was started by an art teacher in Monteleone who wanted her pupils to draw more and worry less. Two years on, around 25,000 people take part each week. Last Wednesday's drawings included chimneys, a crane, a great many pigeons and one very accurate portrait of a neighbour's washing line.",
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

  puzzles: [
    mini(
      [
        ["HELLO", "The friendliest word there is"],
        ["LATTE", "Frothy coffee, often with a heart on top"],
        ["STARS", "What Gary the smiling cluster is made of"],
      ],
      [
        ["HILLS", "A cyclist's favourite enemies"],
        ["OVENS", "Where the bakery's scones get brave"],
      ],
    ),
    ladder(["LESS", "LOSS", "LOSE", "LORE", "MORE"]),
    riddle("What gets wetter the more it dries?", "A towel"),
  ],
};
