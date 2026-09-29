// Issue 44, Friday 2 October 2026. Scheduled.
// Stories with a sourceUrl are real, rewritten in our own words from the linked article. The rest
// are invented and marked "(sample)": their people, places, sources and numbers are made up.
import { ladder, mini, riddle } from "../puzzles.ts";
import type { SeedEdition } from "../types.ts";

export const issue44: SeedEdition = {
  issueNumber: 44,
  date: "2026-10-02",
  status: "scheduled",
  design: "broadsheet",
  colourway: "tropic-punch",

  front: [
    {
      slug: "tilcayo-tiger-cat",
      section: "discoveries",
      slot: "lead",
      kicker: "New species",
      headline: "First new wild cat species in a century is smaller than a house cat",
      dek: "Meet the tilcayo, a spotted cat from Bolivia's cloud forests that weighs about as much as a pineapple.",
      body: [
        "For the first time since 1923, the cat family has a new member. It is called the tilcayo, it lives in the steep, misty Yungas forests of Bolivia, and at about 1.4 kilos it would lose a weigh-in to most of the cats asleep on sofas right now.",
        "The species, Leopardus tilcayo, was described last month in the journal Current Biology by a team led by the Bolivian biologist Paola Nogales-Ascarrunz, a National Geographic explorer. The star of the paper is a male of about ten, known as Tigrino, who lives at the Senda Verde animal refuge in the Yungas. He measures 46 centimetres from nose to the base of his tail and has a light-brown coat covered in dark, leopard-like rosettes, short round ears, long whiskers and a slightly scrunched-up face.",
        "His route into science was a roundabout one. As a kitten he was found near a forest road by a man who took him home, assumed he was an ordinary cat and raised him on noodles, rice and eggs. After about a year it was clear that Tigrino was not an ordinary cat, and he went to live at Senda Verde, where staff described him to Nogales-Ascarrunz as an unusual cat. She agreed.",
        "“Knowing other wild cats, it was peculiar,” she told the Associated Press. “He really is tiny.”",
        "To prove he was something new, the team compared the genomes of more than 30 small spotted cats from Colombia, Peru and Brazil. What had long been treated as one species, the South American tiger cat, turned out to be at least five, and the tilcayo's family line split from its closest relatives about 1.4 million years ago.",
        "“Even in groups that are very well studied, like the cat family, apparently there's still a diversity that is hidden,” said co-author Jonas Lescroart, an evolutionary biologist at the University of Antwerp.",
        "The name did not come from a laboratory. People in the region have called the little cat the tilcayo for generations, and Aymara speakers have suggested it may come from t'ili kayu, meaning “tiny foot”. “It's our way of honoring their ancestral knowledge and connection to this animal,” said Nogales-Ascarrunz.",
        "How many tilcayos are out there in the forest is the next question. “We still don't know how many there are,” she said. For now, Tigrino is the only one the world has properly met, and the first cat in 103 years to be the model for a whole new species.",
      ],
      source: "PBS News",
      sourceUrl:
        "https://www.pbs.org/newshour/science/meet-earths-newest-wild-cat-species-living-in-bolivia-and-the-first-named-in-over-a-century",
      sticker: "New cat!",
      image: {
        file: "/editions/44/tilcayo-tiger-cat.jpg",
        alt: "A small spotted wild cat, the tilcayo, looking at the camera",
        credit: "Reuters",
        from: "https://www.pbs.org/newshour/science/meet-earths-newest-wild-cat-species-living-in-bolivia-and-the-first-named-in-over-a-century",
      },
    },
    {
      slug: "typewriter-wimbledon",
      section: "internet-and-culture",
      slot: "feature",
      kicker: "Art",
      headline: "An artist drew Wimbledon on a typewriter, and the grass is all commas",
      dek: "James Cook spent 378 hours on one picture, one keystroke at a time.",
      body: [
        "James Cook, 29, of Canning Town in east London, owns about a hundred typewriters, most of them gifts from fans. He does not use them to write letters. He uses them to draw.",
        "His latest picture, ‘Wimbledon 2026’, took six weeks and 378 hours on a 1932 Smith Premier. It shows Novak Djokovic and Roger Federer mid-rally on Centre Court, with a crowd that hides a few extras for sharp-eyed viewers, including Andy Murray and someone dressed as a strawberry. The grass is made of commas and quotation marks. The players' hands are capital Gs. Online, it has been seen more than 8 million times.",
        "Cook began at 17, with a school art project on a 1950 Oliver Courier, and went on to study architecture at UCL. “It felt like such a unique way to capture the world,” he said. “The Wimbledon piece has taken me to another level.”",
      ],
      source: "Good News Network",
      sourceUrl:
        "https://www.goodnewsnetwork.org/artist-creates-amazing-detailed-drawings-using-only-typewriter-keystrokes/",
      image: {
        file: "/editions/44/typewriter-artist.jpg",
        alt: "James Cook at work on a vintage typewriter",
        credit: "SWNS",
        from: "https://www.goodnewsnetwork.org/artist-creates-amazing-detailed-drawings-using-only-typewriter-keystrokes/",
      },
    },
    {
      slug: "ferry-terminal-choir",
      section: "screen-and-sound",
      slot: "feature",
      kicker: "Music",
      headline: "Surprise choir fills a ferry terminal, and the 7:40 sails four minutes late",
      dek: "The captain asked them to finish the chorus first. Nobody on board complained.",
      body: [
        "Commuters waiting for the 7:40 crossing from Stray to Port Calloway on Thursday were doing what commuters do, holding coffees and not talking, when a man by the ticket machine put down his briefcase and began to sing. Then the woman beside him joined in. Within a verse there were 63 voices in the terminal, and most of the queue turned out to have been rehearsing for seven weeks.",
        "They were the Harbour Voices community choir, and it was a thank-you: the ferry's crew of nine have run the crossing for twenty years this month. The song was an old shanty rewritten with the crew's names in it, including a verse about the deckhand's famously enormous flask.",
        "Captain Ingrid Halvorsen came down the gangway to listen, then radioed ahead to say the boat would be a little late, “for a very good reason”. It left at 7:44. “It was the best four minutes I've ever lost,” said Priya Lindqvist, who makes the crossing every weekday.",
      ],
      source: "Harbour Times (sample)",
      photo: ["choir", 1],
    },
  ],

  inside: [
    {
      section: "gaming",
      stories: [
        {
          slug: "mario-64-on-a-snes",
          slot: "feature",
          kicker: "Homebrew",
          headline: "A fan squeezes Super Mario 64 onto a Super Nintendo, thirty years late",
          dek: "It uses the same 3D chip that powered Star Fox, and it runs rather better than anyone expected.",
          body: [
            "In 1996, Super Mario 64 needed a whole new console. The Nintendo 64 was built for 3D, and Mario's first leap into it is still one of the best-loved openings in games. Its predecessor, the Super Nintendo, was a 2D machine, but it had a trick up its sleeve: some cartridges carried an extra chip, the Super FX, which let games like Star Fox draw simple 3D worlds.",
            "A hobbyist who goes by Tobi has now used that chip to do something Nintendo never did. In a recent video on his YouTube channel, he shows Mario running, jumping and turning the camera around the castle grounds, on a Super Nintendo. He calls it SMFX.",
            "It is not an emulator or a straight copy. Tobi wrote a new engine that paints each frame from back to front, and fed it the original game's models and textures. The cartridge's 2MB of memory is a squeeze, so some levels may have to lose a little scenery before they fit.",
            "For years, fans have passed around a rumour that Nintendo once planned a ‘Super Mario FX’ for the older console. No evidence of it has ever turned up. Tobi's version is the closest anyone has come, and Hackaday's verdict was that it “runs fairly well”, which for a 1990s console doing a job it was never designed for is roughly a standing ovation.",
            "He says he may release it once he is happy with it. The Super Nintendo, now 36, has not commented.",
          ],
          source: "Hackaday",
          sourceUrl:
            "https://hackaday.com/2026/09/28/using-the-snes-super-fx-chip-to-run-super-mario-64/",
          image: {
            file: "/editions/44/mario-64-on-a-snes.jpg",
            alt: "Super Mario 64 running on a Super Nintendo, from Tobi's video",
            credit: "Tobi, via YouTube",
            from: "https://hackaday.com/2026/09/28/using-the-snes-super-fx-chip-to-run-super-mario-64/",
          },
        },
        {
          slug: "metal-gear-on-a-microcontroller",
          slot: "feature",
          kicker: "Handhelds",
          headline: "Metal Gear Solid now runs on a homemade handheld built around a tiny chip",
          dek: "The 1998 PlayStation classic fits on a microcontroller, steered by a joystick borrowed from a drone.",
          body: [
            "What needed a PlayStation in 1998 now fits in a hand-soldered box. The developer David Montero Crespo has ported Metal Gear Solid, the sneaking game famous for its hero hiding under a cardboard box, to an ESP32-S3, the kind of small, cheap chip that usually runs smart plugs and weather sensors.",
            "He built on MGS Reversing, a fan project by FoxdieTeam that has painstakingly rebuilt the game's code, and then had to translate it from the PlayStation's processor to the chip's very different cores.",
            "The handheld is pleasingly homemade: a perfboard, a small LCD screen, a row of buttons and an analogue stick salvaged from a drone controller. He has written up the whole build on his blog. The cardboard box is not included.",
          ],
          source: "Hackaday",
          sourceUrl:
            "https://hackaday.com/2026/09/29/metal-gear-solid-moves-from-playstation-to-esp32/",
          image: {
            file: "/editions/44/metal-gear-on-a-microcontroller.jpg",
            alt: "A homemade handheld console running Metal Gear Solid",
            credit: "David Montero Crespo, via Hackaday",
            from: "https://hackaday.com/2026/09/29/metal-gear-solid-moves-from-playstation-to-esp32/",
          },
        },
        {
          slug: "chess-app-friday-mode",
          slot: "brief",
          kicker: "Apps",
          headline: "Chess app's new ‘Friday mode’ lets every piece move one extra square",
          dek: "Serious players call it chaos. Everyone else calls it the weekend.",
          body: [
            "Board Knight, a free chess app run by volunteers in Ljubljana, switches Friday mode on at 5pm every week. Bishops wobble, pawns get ambitious and the king may take one small step backwards ‘to relax’. The developers say 60,000 people played last Friday, and not a single game finished in under twenty minutes.",
          ],
          source: "Save State (sample)",
        },
        {
          slug: "library-lends-consoles",
          slot: "brief",
          kicker: "Libraries",
          headline:
            "Suburban library starts lending vintage consoles, with a free lesson in coaxing cartridges",
          dek: "The oldest machine on loan is older than the librarian who runs the class.",
          body: [
            "Kellington Library in Port Wyndham now lends eight old consoles alongside its books, each in a padded bag with two controllers and a laminated guide. The waiting list reached 300 in a week. Librarian Jas Patel, 29, runs a Saturday class on getting an old cartridge to start. The main technique is patience.",
          ],
          source: "Coin-Op Chronicle (sample)",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "world-gurning-champion",
          slot: "feature",
          kicker: "Face-pulling",
          headline:
            "Local man finally wins the World Gurning Championship, beating an actor into second",
          dek: "Ged Eccles of Egremont had come second and third many times. This year, his face won.",
          body: [
            "Every September, the small Cumbrian town of Egremont holds its Crab Fair, one of the oldest surviving fairs in the world. It has street events, field events and one event that has made it famous far beyond Cumbria: the World Gurning Championship, in which competitors put their heads through a horse collar and pull the most extraordinary face they can manage.",
            "This year's fair was held on 19 September, and the world title went, at long last, to a local man. Ged Eccles, from Egremont itself, had spent years coming close. “Ged is a local man from Egremont and has come second and third many, many times,” said the fair's organiser, Dan Nixon. “We are so delighted that he took the Championship this year.”",
            "Eccles said he was “over the moon”, and thanked the gurners who came before him and the committee for keeping the tradition going.",
            "In second place was the actor Will Mellor, who was in town at the time; his fellow actor Ralf Little came along too. The ladies' title went to returning champion Claire Lister, and the junior crown to Bobby Donald.",
            "Nixon estimates that between 850 and 1,000 people took part across the whole fair. Most were from Cumbria, but others came from Leeds and Blackburn, and a couple travelled from Iceland. “It was a successful event,” he said. “Every event was well attended and the community came out in full pelt to support their annual fair.”",
            "The committee met on 22 September to start planning 2027. The new champion has, one assumes, already started practising in the mirror.",
          ],
          source: "Whitehaven News",
          sourceUrl:
            "https://www.whitehavennews.co.uk/news/26570417.egremont-man-won-world-gurning-championships-crab-fair/",
          image: {
            file: "/editions/44/world-gurning-champion.jpg",
            alt: "Actors Ralf Little and Will Mellor posing for a selfie with a fairgoer and her daughter at the Egremont Crab Fair",
            credit: "Whitehaven News",
            from: "https://www.whitehavennews.co.uk/news/26570417.egremont-man-won-world-gurning-championships-crab-fair/",
          },
        },
        {
          slug: "world-peashooting-championship",
          slot: "feature",
          kicker: "Peashooting",
          headline:
            "Sunny Witcham crowns its world peashooting champions, including a team called the Unpealiveables",
          dek: "There is a ‘petit pois’ category. Of course there is.",
          body: [
            "The village of Witcham in Cambridgeshire held its 53rd World Peashooting Championship this summer, in bright sunshine, with competitors blowing dried peas through tubes at a putty-covered target in the hope of hitting the middle.",
            "Paul Gipp won the traditional world title, and Michelle Berry took the open category. The ‘petit pois’ championship went to Greyson Coles, and the youth title to Luke Young. The adult team prize was won by a side called the Unpealiveables, while Witchford Village College took the junior team crown.",
            "“Whether you lifted a trophy, represented your team, or simply had a go for the first time, you helped make the 53rd championship another unforgettable day,” the organisers said. The 54th is already booked for Saturday 10 July 2027. Start saving your peas.",
          ],
          source: "Ely Standard",
          sourceUrl:
            "https://www.elystandard.co.uk/news/26281592.witcham-world-peashooting-champions-2026-held-sunshine/",
          image: {
            file: "/editions/44/world-peashooting.jpg",
            alt: "The 2026 World Peashooting Championship winners in Witcham",
            credit: "Supplied, via Ely Standard",
            from: "https://www.elystandard.co.uk/news/26281592.witcham-world-peashooting-champions-2026-held-sunshine/",
          },
        },
        {
          slug: "mascot-race-photo-finish",
          slot: "brief",
          kicker: "Races",
          headline: "Charity mascot race ends in a photo finish between a carrot and a lighthouse",
          dek: "The judges gave it to the carrot, by one leaf.",
          body: [
            "Twenty-two mascots ran 200 metres around a rugby pitch in Dunmore Cross, including a bee, a toothbrush and a sausage roll that false-started twice. The lighthouse led until its lamp snagged on the bunting. The carrot, nine-year-old Tilly Marsh, came through on the inside. “My nan sewed the leaves on extra long,” she said.",
          ],
          source: "Sunday League Weekly (sample)",
        },
        {
          slug: "tug-of-war-sixty-years",
          slot: "brief",
          kicker: "Tug of war",
          headline:
            "Village tug-of-war team wins the county final after 60 years of finishing second",
          dek: "Their new technique is ‘everyone leaning back a bit more’.",
          body: [
            "Upper Brampton had reached the Hessle Fair final every year since 1966 and lost it every time, collecting enough runners-up plates to fill two shelves in the village hall. This year they won in eleven seconds. The trophy now sits in the middle of the runners-up shelf, ‘so it doesn't get lonely’.",
          ],
          source: "Village Green Gazette (sample)",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "spinning-3d-mechanical-tv",
          slot: "feature",
          kicker: "Displays",
          headline: "A 1920s-style spinning television, rebuilt in 3D, is good enough to play Doom",
          dek: "Instead of a screen it has a whirling drum full of holes, each sending your eyes a slightly different picture.",
          body: [
            "The very first televisions were mechanical. A spinning disc punched with a spiral of holes swept light across a picture one line at a time, and it was a machine like that which first showed a human face on screen, as our On This Day page recounts. A maker who goes by AncientJames has now taken that century-old idea and pointed it somewhere new: the third dimension.",
            "His version swaps the disc for a fast-spinning drum drilled with holes. Behind it sit LED panels, each 32 by 64 pixels. As the drum turns, every hole lets through a sliver of image aimed at a precise angle, so your left and right eyes see slightly different pictures and your brain assembles them into depth. Engineers call this a light-field display.",
            "The demonstration model uses three panels arranged as half of a hexagon, so it works from the front rather than all the way round; a full circle would simply need more panels. The effective resolution is about 100 by 48 pixels per eye, which sounds modest until you see what he runs on it: Doom, the 1993 shooter that hobbyists have made play on everything from calculators to fridges.",
            "Nothing about it is expensive. There are no lasers, no special glasses and no moving screens, just a drum, some LEDs and a lot of clever timing. It is not even his first 3D Doom machine. Some people collect stamps.",
          ],
          source: "Hackaday",
          sourceUrl:
            "https://hackaday.com/2026/09/29/electromechanical-tv-goes-3d-with-this-light-field-display/",
          image: {
            file: "/editions/44/spinning-3d-mechanical-tv.jpg",
            alt: "A spinning drum display glowing with a 3D image",
            credit: "AncientJames, via Hackaday",
            from: "https://hackaday.com/2026/09/29/electromechanical-tv-goes-3d-with-this-light-field-display/",
          },
        },
        {
          slug: "walnut-remote",
          slot: "feature",
          kicker: "Makers",
          headline: "A maker hid a working smart-home remote inside a walnut shell",
          dek: "First he ate the nut. Then he added magnets, lights and a tiny computer.",
          body: [
            "The project began, as the best ones do, with a snack. The maker JSK-koubou cracked a walnut cleanly along its natural seam, ate what was inside, and fitted small neodymium magnets into each half so that the shell clicks shut.",
            "Into the empty shell went an ESP32-C3 microcontroller and a few LEDs, placed so that the USB port can still be reached. The walnut now sits in his living room, connected to his home-automation system. When told to, it sends out infrared signals to older gadgets that only understand a remote control, bringing them into the smart home without anyone having to buy anything new.",
            "Visitors, he can safely assume, have not noticed a thing. It looks exactly like a walnut.",
          ],
          source: "Hackaday",
          sourceUrl: "https://hackaday.com/2026/09/28/an-ir-blaster-project-in-a-nutshell/",
          image: {
            file: "/editions/44/walnut-remote.jpg",
            alt: "An open walnut shell with a tiny circuit board and LEDs inside",
            credit: "JSK-koubou, via Hackaday",
            from: "https://hackaday.com/2026/09/28/an-ir-blaster-project-in-a-nutshell/",
          },
        },
        {
          slug: "sunshine-score-bench",
          slot: "brief",
          kicker: "Street furniture",
          headline: "Solar bench charges your phone and tells you how sunny its day has been",
          dek: "Tuesday scored a nine. The bench seemed pleased.",
          body: [
            "The bench in Vellmar's market square shows its own daily sunshine score on a small screen by the armrest, beside a line written by pupils at the school next door. Yesterday's read: ‘A good one. Sit down.’ About 200 phones a day are topped up on it.",
          ],
          source: "Maker Monthly (sample)",
        },
        {
          slug: "see-you-monday-key",
          slot: "brief",
          kicker: "Gadgets",
          headline: "Hobbyist builds a single key that types ‘see you Monday’ and shuts the laptop",
          dek: "It only works after 5pm on a Friday. He has checked.",
          body: [
            "Software tester Rafael Onyango of Kilele wired one large orange key to a small circuit board. Press it on a Friday after five and it posts a cheerful sign-off to his team's chat, saves everything and closes the lid. He shared the plans online, and colleagues have since built eleven.",
          ],
          source: "Maker Monthly (sample)",
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "salish-sea-spiders",
          slot: "feature",
          kicker: "Sea life",
          headline: "Divers find two new sea spiders, one with hairy feet and bright red eyes",
          dek: "They are the first new sea spiders described from the Salish Sea in nearly a century, and their dads do the babysitting.",
          body: [
            "Sea spiders are not really spiders, and they are not very big, but they are very old. The group has been clambering over the seabed for around 500 million years, since long before anything walked on land. So it is a treat when a new one turns up, and a team of scuba divers from the University of British Columbia has just described two.",
            "They were found on dives no deeper than 18 metres, between September 2023 and August 2024, at sites around Quadra Island, Vancouver, Bamfield and Victoria in the Salish Sea, off Canada's west coast. They are the first new sea spiders formally described from the region in nearly 100 years.",
            "The first, Callipallene pilosuspedes, has a name that means ‘hairy feet’, which is accurate. It also has red eyes, a triangular mouth with three lips, and a set of comb-like limbs that it uses to groom itself. The divers found just one.",
            "The second, Tanystylum kiixin, is named after an ancient Indigenous village site. Kiixin, pronounced ‘kee-hin’, refers to the sound of waves crashing there.",
            "Both species share the sea spider's unusual family arrangement: it is the males that carry the eggs and look after them. The study appears in the journal Organisms Diversity & Evolution. The hairy-footed one, somewhere in the Salish Sea, is probably still grooming.",
          ],
          source: "ScienceDaily",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260925005412.htm",
          image: {
            file: "/editions/44/salish-sea-spiders.jpg",
            alt: "The newly described sea spider Tanystylum kiixin",
            credit: "University of British Columbia, via ScienceDaily",
            from: "https://www.sciencedaily.com/releases/2026/09/260925005412.htm",
          },
        },
        {
          slug: "asteroid-alyankovic",
          slot: "feature",
          kicker: "Space",
          headline: "Asteroid 14331 is now officially named Alyankovic, after ‘Weird Al’ Yankovic",
          dek: "The citation credits the accordion-playing parody star with inspiring generations of scientists.",
          body: [
            "Somewhere between Mars and Jupiter, a rock about two kilometres across has a new name. It was first spotted by the astronomer Stephen J. Bus at Siding Spring Observatory in Australia on 2 March 1981, and spent the next 45 years known as 1981 EC26. This month the International Astronomical Union approved its new title: (14331) Alyankovic.",
            "The campaign was led by the planetary scientists Allison McGraw and Steve Desch, of Arizona State University. The official citation says generations of scientists have been inspired by Yankovic's comic songs, and names two of the nerdiest: ‘It's All About the Pentiums’ and ‘White and Nerdy’.",
            "Yankovic's review was short. “This is perhaps the greatest honor I've ever received,” he said.",
          ],
          source: "Consequence",
          sourceUrl: "https://consequence.net/2026/09/weird-al-yankovic-asteroid/",
          image: {
            file: "/editions/44/asteroid-alyankovic.jpg",
            alt: "‘Weird Al’ Yankovic alongside an illustration of an asteroid",
            credit: "Consequence",
            from: "https://consequence.net/2026/09/weird-al-yankovic-asteroid/",
          },
        },
        {
          slug: "songbird-ice-cream-tune",
          slot: "brief",
          kicker: "Birds",
          headline: "Garden songbird learns the first four notes of the ice-cream van's chime",
          dek: "Neighbours rush outside twice as often now, and are disappointed about half the time.",
          body: [
            "The bird, a regular on a fence post on Linden Row in Ashby Parva, gets the opening notes exactly right and then, says neighbour Dot Whelan, “does its own thing, which is fair enough”. The van's driver, Luca Benedetti, is flattered, and now plays the chime twice so the bird can hear how it ends.",
          ],
          source: "Garden Gazette (sample)",
        },
        {
          slug: "frog-named-for-class",
          slot: "brief",
          kicker: "Species",
          headline: "Tiny new frog is named after the class of ten-year-olds who heard it first",
          dek: "Its call sounds like someone flicking a ruler.",
          body: [
            "Class 5B at Monte Verde Primary in Alto Pinar were recording night sounds for a science project when they caught a click that matched nothing on their list. Biologists tracked it to a frog the size of a thumbnail. Its official name ends in ‘quintabeorum’: roughly, Latin for ‘of 5B’.",
          ],
          source: "Field Notes (sample)",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "spongeblob-pumpkin",
          slot: "feature",
          kicker: "Giant veg",
          headline:
            "A 2,613-pound pumpkin called SpongeBlob wins its grower $15,000 and an Oregon record",
          dek: "Somewhere out there, a $75,000 prize is still waiting for the world's first 3,000-pounder.",
          body: [
            "Jim Sherwood, of Mulino in Oregon, has been growing giant pumpkins for 25 years, and last Saturday he drove the biggest one yet to Bishop's Pumpkin Farm in Wheatland, California, for the National Pumpkin Weigh Off. It was called SpongeBlob, and it weighed 2,613 pounds, roughly the same as a small car.",
            "That broke the Oregon state record of 2,469 pounds, which Steve Daletas had held since 2018, and made SpongeBlob the heaviest pumpkin of the American season so far. It also won Sherwood first prize: $15,000. “I'm thrilled,” he said. “That pumpkin gave me quite the ride. Based on its shape I didn't think it would last.”",
            "Second place went to Mike Alves of Chico, California, whose 2,359-pound entry beat his own best by more than 650 pounds. He had doubled the size of his pumpkin patch this year. “When they start growing 50 to 60 lbs a day, it's pretty amazing,” he said.",
            "The weigh-off offered more than $100,000 in prizes, with cash for the top 20 pumpkins and for seven other giant vegetables. Chris Asbury of Bayside set a California record for a marrow, at 102 pounds. In the youth category, 15-year-old Oren Muller of Guinda won $1,000 for a 1,229-pound pumpkin.",
            "The biggest prize went unclaimed: $75,000 for the world's first pumpkin over 3,000 pounds. The current world record, set in England last year by the Paton brothers, is 2,819. Growers, the organisers note, are already planning next season's patches.",
          ],
          source: "EIN Presswire",
          sourceUrl:
            "https://www.einpresswire.com/article/945522007/oregon-record-shattered-at-california-s-national-pumpkin-weigh-off",
        },
        {
          slug: "tip-jar-coins-trip",
          slot: "feature",
          kicker: "Pocket change",
          headline: "Café's jar of coins left behind by tourists pays for the staff's trip abroad",
          dek: "Eight years, 31 currencies and four kilos of metal, counted on one very long evening.",
          body: [
            "For eight years, staff at the Gull's Rest café in Porthcaddon have dropped the foreign coins that tourists leave in the tip jar into a separate pickle jar on the shelf behind the till. Nobody could spend them, so nobody counted them.",
            "This summer, owner Merryn Treloar tipped the jar out across three tables after closing. It took the six staff until midnight to sort: 31 currencies, a little over four kilos, including a coin nobody could identify and one they are fairly sure is a button.",
            "Exchanged at the bank, it came to enough to fly all six of them somewhere sunny for a long weekend. “We're going to spend it on coffee in someone else's café,” said Treloar, “and leave them all our change.”",
          ],
          source: "Pocket Money Times (sample)",
        },
        {
          slug: "honesty-box-record",
          slot: "brief",
          kicker: "Small business",
          headline: "Farm-gate honesty box has balanced to the penny every week for ten years",
          dek: "Once it was 20p over. The farmer framed the 20p.",
          body: [
            "The egg stall at Marsh End Farm is a shelf, a hand-painted sign and a biscuit tin. Farmer June Abernethy has logged the takings every Sunday since 2016, and the tin has never been short. One customer left an IOU on an eggshell and paid it the next morning, with the coin taped to a daffodil.",
          ],
          source: "Pocket Money Times (sample)",
        },
        {
          slug: "boring-stamps-auction",
          slot: "brief",
          kicker: "Collecting",
          headline: "Collection of ‘the world's most boring stamps’ sells for triple its estimate",
          dek: "Highlights include a stamp showing a filing cabinet.",
          body: [
            "Walter Nkemelu spent 45 years collecting only stamps he found dull: grey offices, a municipal drain, a fairly average bridge. His 2,000-stamp album sold at a postal auction in Harwick for 9,600, against an estimate of 3,000. He calls the buyer “clearly a person of taste”, and has already started a new album.",
          ],
          source: "Pocket Money Times (sample)",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "wordle-maths",
          slot: "feature",
          kicker: "Puzzles",
          headline: "The best Wordle guess, say mathematicians, is often a word you know is wrong",
          dek: "A Binghamton University team's method wins 99% of simulated games, against about 90% for the usual approach.",
          body: [
            "Every morning, millions of people try to find a hidden five-letter word in six guesses, and most go about it the same way: pick a word that might be the answer, stuff it with common letters, and hope.",
            "A team at Binghamton University, State University of New York, says that instinct is not quite right. Led by the assistant professor Congyu “Peter” Wu, the researchers built a strategy on Shannon entropy, the mathematics of information. Instead of asking which word is most likely to be right, it asks which word will tell you the most.",
            "Sometimes the most useful guess is a word that cannot possibly be the answer, because its letters split the remaining options most neatly. “A subtle but important insight from the paper is that a guess doesn't have to be the most likely answer; it simply has to be informative,” said Donald Stephens, a doctoral student on the team.",
            "In simulations, the method won 99% of games. The familiar common-letters approach managed about 90%.",
            "“The previous guesses will eliminate a whole bunch of options, and based on the remaining options, guessing some words will send you into a trajectory where information gain is speedier,” said Wu.",
            "So tomorrow, when your second guess is a word you know is wrong, tell anyone looking over your shoulder that it is maths.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/researchers-use-math-to-ensure-a-wordle-win-99-of-the-time/",
          image: {
            file: "/editions/44/wordle-maths.jpg",
            alt: "A Wordle game on a phone screen",
            credit: "Binghamton University, State University of New York",
            from: "https://www.goodnewsnetwork.org/researchers-use-math-to-ensure-a-wordle-win-99-of-the-time/",
          },
        },
        {
          slug: "slow-comics-sellout",
          slot: "feature",
          kicker: "Comics",
          headline:
            "The TikTok reviewer who visits the quietest comic-con tables sells out an artist overnight",
          dek: "One video, a million likes and 25,000 new followers for a comic you can read in both directions.",
          body: [
            "At comic conventions, the TikTok reviewer known as @slow_comics has a simple habit: he heads for the tables nobody else is stopping at. This summer he stopped at the stall of Dare, a creator who posts as @Oridipe, and filmed a review of his two books: ‘Ori: Holder of the Heads’, a fantasy shaped by Yoruba tradition, and ‘Etch’, which tells a different story depending on which way you read it.",
            "The video passed a million likes and sent 25,000 new followers Dare's way. His stock sold out overnight. His brother Joshua drove more copies from Pennsylvania to New York, and those sold out too.",
            "“I can confirm that Etch and Ori are just as good as you think they're going to be,” the reviewer said in a follow-up.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/indie-comic-creator-sells-out-thanks-to-viral-visit-from-reviewer-who-stopped-when-others-didnt/",
          image: {
            file: "/editions/44/slow-comics-sellout.jpg",
            alt: "Screenshots from @slow_comics' video review at a comic convention",
            credit: "@slow_comics",
            from: "https://www.goodnewsnetwork.org/indie-comic-creator-sells-out-thanks-to-viral-visit-from-reviewer-who-stopped-when-others-didnt/",
          },
        },
        {
          slug: "accurate-clocks-map",
          slot: "brief",
          kicker: "Maps",
          headline: "Tram driver maps every public clock in his city that shows the right time",
          dek: "There are 14. He visits them on Fridays to say well done.",
          body: [
            "Hamid Farouk of Rosenholm checked 312 public clocks over two years, on his way to and from the depot. His online map marks the accurate ones with a green star. The clock on the fish-market roof has been right on every single visit, and he has sent its keeper a thank-you card.",
          ],
          source: "Around the Web (sample)",
        },
        {
          slug: "sourdough-livestream-birthday",
          slot: "brief",
          kicker: "Streams",
          headline:
            "A 24-hour livestream of a sourdough starter called Gerald celebrates his first birthday",
          dek: "He has risen 365 times. He is still in the same jar.",
          body: [
            "The stream shows one glass jar on a kitchen counter in Tamsworth, day and night. About 2,000 people watch at any moment, and the chat cheers whenever Gerald bubbles. For his birthday he was fed rye flour and given a tiny party hat, which he did not acknowledge.",
          ],
          source: "Around the Web (sample)",
        },
      ],
    },
    {
      section: "on-this-day",
      stories: [
        {
          slug: "stooky-bill-first-tv",
          slot: "feature",
          kicker: "Fun firsts",
          headline: "On this day in 1925, television's first star was a dummy called Stooky Bill",
          dek: "The first human on TV was paid half a crown, and gave the picture a frank review.",
          body: [
            "On 2 October 1925, in his workshop in Soho, London, the Scottish inventor John Logie Baird looked at the flickering grey image on his receiver and saw a face. It was not a person's face. It was the painted head of a ventriloquist's dummy, and it was the first true television picture ever sent.",
            "The dummy was nicknamed Stooky Bill, stooky being Scots for plaster. Baird used him because the lamps needed to light the scene were far too hot for a person to sit under, and the light-sensitive cells of the day could barely make out real skin. Bill's brightly painted face gave the machine something to see, though the heat was hard on his complexion.",
            "The picture had just 32 lines, scanned from top to bottom, five times a second. By modern standards it was a smudge. To Baird it was a triumph, and he immediately wanted to try it on a real person.",
            "So he went downstairs and fetched William Taynton, a 20-year-old office worker from a business in the same building, and sat him in front of the camera. Taynton became the first person to be televised, and was paid half a crown for his trouble, which is often described as the first TV appearance fee. Asked for his opinion of the picture, he called it “very crude”.",
            "Baird gave his first public demonstration in January 1926. Stooky Bill, meanwhile, retired to the National Science and Media Museum in Bradford, where he can still be visited, looking every one of his 101 years.",
          ],
          source: "Wikipedia",
          sourceUrl: "https://en.wikipedia.org/wiki/Stooky_Bill",
          image: {
            file: "/editions/44/stooky-bill.jpg",
            alt: "John Logie Baird with his early television apparatus and the dummy Stooky Bill",
            credit: "Public domain, via Historic England",
            from: "https://heritagecalling.com/2020/10/01/how-engineer-john-logie-baird-invented-television/",
          },
        },
        {
          slug: "peanuts-first-strip",
          slot: "feature",
          kicker: "Comics",
          headline: "On this day in 1950, Charlie Brown made his debut, in just seven newspapers",
          dek: "Peanuts went on to run for almost 50 years and 17,897 strips.",
          body: [
            "On 2 October 1950, readers of seven American newspapers found something new on the comics page. The Washington Post, the Chicago Tribune, the Minneapolis Tribune, The Denver Post and The Seattle Times all carried it, as did the Allentown Evening Chronicle and the Bethlehem Globe-Times. It was called Peanuts, and it was drawn by a young cartoonist from Minnesota named Charles M. Schulz.",
            "The first strip starred Charlie Brown and a boy called Shermy, who had a crew cut. Snoopy arrived within days. Lucy, Linus, Schroeder and the rest of the gang followed over the years, along with a kite-eating tree, a piano that was never quite big enough, and a football that Charlie Brown never, ever got to kick.",
            "Schulz drew the strip himself for nearly half a century, until February 2000: 17,897 strips in all, enough to make it one of the most popular and influential comic strips ever printed. It has been in reruns ever since. Charlie Brown turns 76 today, and is still, as far as anyone can tell, a good man.",
          ],
          source: "Wikipedia",
          sourceUrl: "https://en.wikipedia.org/wiki/Peanuts",
          image: {
            file: "/editions/44/peanuts-first-strip.jpg",
            alt: "The Peanuts characters lifting Charlie Brown and Snoopy in the air",
            credit: "Peanuts Worldwide, via Wikipedia",
            from: "https://en.wikipedia.org/wiki/Peanuts",
          },
        },
        {
          slug: "pooh-turns-100",
          slot: "brief",
          kicker: "100 years ago",
          headline: "Coming up this month: Winnie-the-Pooh turns 100 years old",
          dek: "A.A. Milne's bear first went on sale on 14 October 1926.",
          body: [
            "‘Winnie-the-Pooh’, written by A.A. Milne and illustrated by E.H. Shepard, was published in London and New York in October 1926. Its American publisher sold 150,000 copies before the year was out. A century on, it has been translated into 72 languages, and in January its text enters the public domain in the UK.",
          ],
          source: "Wikipedia",
          sourceUrl: "https://en.wikipedia.org/wiki/Winnie-the-Pooh_(book)",
        },
      ],
    },
  ],

  features: [
    {
      type: "number_of_day",
      content: {
        value: "1923",
        caption: "the last time anyone named a new wild cat species, until the tilcayo",
      },
    },
    {
      type: "weather",
      content: {
        headline: "Friday: clear skies all the way to the weekend",
        detail:
          "A high-pressure system of plans building by mid-afternoon. Scattered outbreaks of ‘shall we get chips?’ from five, and a 90% chance of someone leaving early ‘to beat the traffic’.",
      },
    },
    {
      type: "quote",
      content: {
        text: "Knowing other wild cats, it was peculiar. He really is tiny.",
        by: "Paola Nogales-Ascarrunz, on the tilcayo",
      },
    },
    {
      type: "correction",
      content: {
        text: "An early proof of today's paper described a walnut as ‘a snack’. It is now a remote control, and has asked to be addressed as such.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "LOST",
        text: "One lighthouse lamp, last seen on bunting at Dunmore Cross. Still bright. Reward: a rematch.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Dried peas, any quantity, for a summer of practice. Serious enquiries only. No mushy ones.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FOR HIRE",
        text: "Experienced choir, will surprise you at a place of your choosing. Ferries preferred.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: It's Friday!",
          "PIGEON: What's different about Friday?",
          "PIP: Everyone's happier.",
          "PIGEON: So it's like every day, but for humans.",
        ],
      },
    },
    { type: "sign_off", content: { text: "You're done for today. Have a lovely weekend." } },
  ],

  puzzles: [
    mini(
      [
        ["CHIRP", "What the songbird does before the ice-cream van arrives"],
        ["EAGLE", "A big bird, or a very good golf score"],
        ["ROSES", "Red flowers, often in a bunch"],
      ],
      [
        ["CHEER", "What the ferry passengers did at the end"],
        ["POEMS", "Verses; Winnie-the-Pooh was fond of making them up"],
      ],
    ),
    ladder(["HATE", "HAVE", "HOVE", "LOVE"]),
    riddle("The more of them you take, the more you leave behind. What are they?", "Footsteps"),
  ],
};
