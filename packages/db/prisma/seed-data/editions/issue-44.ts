// Issue 44, Friday 2 October 2026. Scheduled.
// Every story is real, rewritten in our own words from the linked article.
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
      section: "internet",
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
      slug: "olive-ridley-nests",
      section: "discoveries",
      slot: "feature",
      kicker: "Sea turtles",
      headline: "Olive ridley sea turtles nest on a Californian beach for the first time on record",
      dek: "Two mothers laid their eggs in broad daylight, three days apart, at Seal Beach and Huntington Beach.",
      body: [
        "Southern California has had plenty of visitors on its beaches this summer, but two of them were unlike any before. Olive ridley sea turtles have nested on America's West Coast for the first time on record, first near Seal Beach and then about 8 miles north at Huntington Beach.",
        "The two females came ashore in late September and laid their eggs in broad daylight, three days apart. “I wasn't expecting to see olive ridley sea turtles nesting in Orange County,” said Lindsey Peavey Reeves of the National Marine Sanctuary Foundation.",
        "Teams from NOAA, the US Fish and Wildlife Service and Huntington Beach's Marine Safety unit gathered up 204 eggs from the two nests and carried them, in coolers filled with sand, to the Aquarium of the Pacific in Long Beach, where they are being looked after. The decision, said the wildlife service biologist Jonathan Snyder, was “the best one for species recovery”.",
      ],
      source: "Good News Network",
      sourceUrl:
        "https://www.goodnewsnetwork.org/first-ever-recorded-sea-turtle-nests-on-americas-west-coast/",
      image: {
        file: "/editions/44/olive-ridley-nests.jpg",
        alt: "Olive ridley sea turtle eggs in a nest in the sand near Seal Beach",
        credit: "City of Huntington Beach",
        from: "https://www.goodnewsnetwork.org/first-ever-recorded-sea-turtle-nests-on-americas-west-coast/",
      },
    },
  ],

  inside: [
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
            "The very first televisions were mechanical. A spinning disc punched with a spiral of holes swept light across a picture one line at a time, and it was a machine like that which first showed a human face on screen, as our Screen page recounts. A maker who goes by AncientJames has now taken that century-old idea and pointed it somewhere new: the third dimension.",
            "His version swaps the disc for a fast-spinning drum drilled with holes. Behind it sit LED panels, each 32 by 64 pixels. As the drum turns, every hole lets through a sliver of image aimed at a precise angle, so your left and right eyes see slightly different pictures and your brain assembles them into depth. Engineers call this a light-field display.",
            "The demonstration model uses three panels arranged as half of a hexagon, so it works from the front rather than all the way round; a full circle would simply need more panels. The effective resolution is about 100 by 48 pixels per eye, which sounds modest until you see what he runs on it: Doom, the 1993 shooter that hobbyists have made play on everything from calculators to fridges.",
            "Nothing about it is expensive. There are no lasers, no special glasses and no moving screens, just a drum, some LEDs and a lot of clever timing. It is not even his first 3D Doom machine. In September 2024 he got Doom running on a volumetric display, and he has since made 3D pictures with lasers bouncing off mist and mirrors, and with lasers and bubbly glass. This one, Hackaday reckons, is the most accessible of the lot. Just watch your fingers near the drum. Some people collect stamps.",
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
            "He filmed the whole build in a video nearly 20 minutes long, which has been watched more than 300,000 times. Visitors to his living room, he can safely assume, have not noticed a thing. It looks exactly like a walnut.",
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
          slug: "printed-mechanical-calculator",
          kicker: "Makers",
          headline:
            "A maker spends two months and 100 designs building a fully 3D-printed mechanical calculator",
          dek: "Turn the crank and its gears add, multiply and carry the ones.",
          body: [
            "The YouTube maker 3D all Workshop has built a mechanical calculator printed entirely on an ordinary FDM 3D printer. Turning a crank sends the input through a set of gears that handle addition and multiplication and carry digits along. Getting it right took about two months and roughly 100 design iterations, with a little lubrication to smooth out the printed parts.",
          ],
          source: "Hackaday",
          sourceUrl:
            "https://hackaday.com/2026/09/29/designing-a-fully-3d-printed-mechanical-calculator/",
          image: {
            file: "/editions/44/printed-mechanical-calculator.jpg",
            alt: "A 3D-printed mechanical calculator next to an electronic one",
            credit: "3D all Workshop, via YouTube",
            from: "https://hackaday.com/2026/09/29/designing-a-fully-3d-printed-mechanical-calculator/",
          },
        },
      ],
    },
    {
      section: "startups",
      stories: [
        {
          slug: "bactery-soil-battery",
          slot: "feature",
          kicker: "Soil power",
          headline:
            "A Bath startup called Bactery is making electricity from the bacteria in ordinary soil",
          dek: "Its little batteries should cost about £25, need no looking after and last more than 25 years.",
          body: [
            "Most batteries come in a packet. Bactery's come from the ground. The startup, spun out of the University of Bath, is building a battery that runs on the tiny microbes that already live in soil, and it plans to launch its first product this year.",
            "The trick is a technology called a soil microbial fuel cell. Some soil microorganisms, known as electrigens, release electrons as they munch through organic compounds. Bactery's device catches those electrons and sends them round an external circuit, which is a fancy way of saying it turns a patch of earth into a power supply.",
            "The company was founded by Dr Jakub Dziegielowski, who did his PhD in chemical engineering at Bath and is now chief executive, with the chemical engineer Professor Mirella Di Lorenzo and the electronic engineer Dr Ben Metcalfe, who are both deputy directors of the university's Centre for Bioengineering and Biomedical Technologies. The idea was first proved in 2019, when a soil-powered system was tested for cleaning water in Icapuí, in Brazil.",
            "Its first job is on farms, powering the small sensors and data gadgets that tell farmers what is going on in their fields, which today rely on cables, disposable batteries or solar panels. Each unit should cost roughly £25, needs no maintenance and is designed to last more than 25 years: you install it and forget it.",
            "“Our initial goal is to leverage the unique Bactery technology to accelerate the shift toward digitalisation within the agriculture sector,” said Dziegielowski. Di Lorenzo put it simply: “We are removing the barrier to generating that data by creating a sustainable way to power sensors.”",
          ],
          source: "University of Bath",
          sourceUrl:
            "https://www.bath.ac.uk/announcements/soil-power-uk-startup-bactery-is-generating-sustainable-energy-from-the-earth/",
          image: {
            file: "/editions/44/bactery-soil-battery.jpg",
            alt: "A Bactery soil battery device sitting in the earth",
            credit: "Bactery",
            from: "https://www.goodnewsnetwork.org/uk-startup-is-making-electricity-from-bacteria-in-soil/",
          },
        },
        {
          slug: "charter-space-insurance",
          kicker: "Funding",
          headline:
            "Charter Space raises $5 million to sell insurance for satellites and spacecraft",
          dek: "The El Segundo startup already looks after more than 50 space companies.",
          body: [
            "Insuring a car is simple enough. Insuring a satellite is another matter, and that is the gap Charter Space was set up to fill. The startup, based in El Segundo, California, has built software that gathers a spacecraft's engineering, manufacturing and test data in one place, so that underwriters can work out what they are covering.",
            "It has now raised a $5 million seed round, led by Crystal Venture Partners, with QED, Blank Ventures, Hustle Fund and Gaingels also joining in. That brings its total to $8 million. Since launching its nationally licensed brokerage in May, it has signed up more than 50 American space companies.",
            "The company was founded by chief executive Yuk Chi Chan and Yukun Yin, and was a finalist at TechCrunch's Startup Battlefield in 2025. “Charter Space sits at the intersection of two enormous opportunities,” said the investor Jonathan Crystal, one of them being the fast-growing commercial space economy.",
          ],
          source: "TechCrunch",
          sourceUrl:
            "https://techcrunch.com/2026/09/30/charter-space-raises-5m-to-bring-insurance-to-the-stars/",
          image: {
            file: "/editions/44/charter-space-insurance.jpg",
            alt: "Charter Space co-founders Yuk Chi Chan and Yukun Yin",
            credit: "Charter Space",
            from: "https://techcrunch.com/2026/09/30/charter-space-raises-5m-to-bring-insurance-to-the-stars/",
          },
        },
        {
          slug: "maaa-notch-mum",
          kicker: "Launches",
          headline: "New Mac app Maaa puts a caring mum in your notch to remind you to eat",
          dek: "She speaks 12 languages and works on macOS 14 and later.",
          body: [
            "Maaa, a new app for the Mac, turns the notch at the top of a modern MacBook screen into a familiar face that looks out for you. Billed as a mum in your Mac's notch, she gives gentle reminders to drink water, eat and take a break, timed by a mix of your activity and a schedule you set. She speaks 12 languages, runs on macOS 14 and later, and there is a free option.",
          ],
          source: "Product Hunt",
          sourceUrl: "https://www.producthunt.com/products/maaa",
          image: {
            file: "/editions/44/maaa-notch-mum.jpg",
            alt: "The notch at the top of a MacBook Pro screen",
            credit: "KKPCW, CC BY-SA 4.0, via Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Notch_of_Macbook_Pro_16_inti_model_-_1.jpg",
          },
        },
      ],
    },
    {
      section: "screen",
      stories: [
        {
          slug: "stooky-bill-first-tv",
          slot: "feature",
          kicker: "Telly firsts",
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
          slug: "apothecary-diaries-season-3",
          kicker: "Anime",
          headline:
            "The Apothecary Diaries season 3 starts today, and Maomao has new mysteries to solve",
          dek: "The books and manga behind it have more than 57 million copies in circulation.",
          body: [
            "The Apothecary Diaries returns for its third season today, 2 October on Crunchyroll. Made by TOHO Animation from Hyūganatsu's light novels, the new run picks up after the end of season 2, once Jinshi has revealed who he really is.",
            "This first part adapts the fifth volume of the novels. Maomao is back at work as an apothecary while Jinshi gets on with his royal duties, until the pair meet again to untangle mysteries in farming villages in the north. A new character, Shotei, joins the story, though the makers are keeping quiet about her role.",
            "The opening song is by Yorushika and the closing one is “AIYOU” by Eve. The second half of the season arrives in spring 2027, and a feature-length film and a live-action version are both in the works.",
          ],
          source: "ComicBook.com",
          sourceUrl:
            "https://comicbook.com/anime/news/the-apothecary-diaries-season-3-drops-final-trailer-ahead-of-october-debut-watch/",
          image: {
            file: "/editions/44/apothecary-diaries-season-3.jpg",
            alt: "Jinshi, a character from The Apothecary Diaries, smiling with his eyes closed",
            credit: "TOHO Animation",
            from: "https://comicbook.com/anime/news/the-apothecary-diaries-season-3-drops-final-trailer-ahead-of-october-debut-watch/",
          },
        },
        {
          slug: "inbetweeners-3",
          kicker: "Films",
          headline:
            "The Inbetweeners are back, with all four boys filming a third film for Netflix",
          dek: "Simon's yellow Fiat has been spotted in the teaser, which is a very good sign.",
          body: [
            "Netflix has confirmed The Inbetweeners 3, and it is already filming. Simon Bird, Joe Thomas, Blake Harrison and James Buckley return as Will, Simon, Neil and Jay, and the show's creators, Damon Beesley and Iain Morris, are writing and directing. The teaser shows the four piling into Simon's famous yellow Fiat. The plot is still a secret.",
          ],
          source: "NME",
          sourceUrl:
            "https://www.nme.com/news/film/the-inbetweeners-3-reunion-movie-confirmed-netflix-3967342",
          image: {
            file: "/editions/44/inbetweeners-3.jpg",
            alt: "The four stars of The Inbetweeners standing together outdoors",
            credit: "Film4",
            from: "https://www.nme.com/news/film/the-inbetweeners-3-reunion-movie-confirmed-netflix-3967342",
          },
        },
      ],
    },
    {
      section: "play",
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
            "For years, fans have passed around a rumour that Nintendo once planned a ‘Super Mario FX’ for the older console. No evidence of it has ever turned up. Tobi's version is the closest anyone has come, and Hackaday's verdict was that it “runs fairly well”, which for a 1990s console doing a job it was never designed for is roughly a standing ovation. It is only possible at all because fans had already decompiled the original game's code.",
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
            "The handheld is pleasingly homemade: a perfboard, an ILI9341 LCD screen, a row of buttons read through a resistor ladder, and an analogue stick salvaged from a drone controller. The series itself goes back to the original Metal Gear on the MSX in 1987. He has written up the whole build on his blog. The cardboard box is not included.",
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
          slug: "peanuts-first-strip",
          slot: "brief",
          kicker: "Comics",
          headline: "On this day in 1950, Charlie Brown made his debut, in just seven newspapers",
          dek: "Peanuts went on to run for almost 50 years and 17,897 strips.",
          body: [
            "On 2 October 1950, seven American newspapers, including The Washington Post and the Chicago Tribune, ran a new comic strip by a young Minnesota cartoonist, Charles M. Schulz. It was called Peanuts, and it starred Charlie Brown. Snoopy arrived within days. Schulz drew it himself until February 2000, 17,897 strips in all. Charlie Brown turns 76 today, and is still, as far as anyone can tell, a good man.",
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
      ],
    },
    {
      section: "music",
      stories: [
        {
          slug: "springsteen-center",
          slot: "feature",
          kicker: "The Boss",
          headline:
            "Bruce Springsteen's new music centre opens by the Jersey Shore with a starry concert",
          dek: "Jon Bon Jovi, Jackson Browne and Kenny Chesney were among the names on the bill.",
          body: [
            "Bruce Springsteen has a new home for American music, and it sits just where it should. The Bruce Springsteen Center for American Music has opened at Monmouth University in New Jersey, close to the places where he wrote “Born to Run” and played his early shows between 1969 and 1974.",
            "The building covers 30,000 square feet and was designed by the architects CookFox to echo the state's industrial past, with weathered steel, unstained wood and end-grain wooden block floors made from materials out of a century-old factory. Inside there is a 240-seat auditorium for concerts, talks and screenings, a gallery for changing exhibitions and listening rooms.",
            "It also holds an archive of nearly 48,000 items from 47 countries, from articles and oral histories to concert memorabilia and promotional material. Working with TeachRock, the education charity started by Springsteen's bandmate Stevie Van Zandt, the centre offers school activities, lesson plans and online programmes for teachers.",
            "To open it, the university threw a party. “Music America: The Songs that Shaped Us” filled the OceanFirst Bank Center on campus on 4 and 5 June, with Jon Bon Jovi, Jackson Browne, Rosanne Cash, Kenny Chesney, Gary Clark Jr., Dion, Dropkick Murphys, Shemekia Copeland, Valerie June, Jimmie Vaughan, Keb' Mo' and Nils Lofgren among the performers. The music took in blues, bluegrass, rock, hip-hop, Americana, jazz, country and gospel.",
            "The official grand opening followed on 7 June. Springsteen had looked forward to it for a while. “It's deeply satisfying, and I look forward to working with everyone to make the building and this endeavor a great success,” he said.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/bruce-springsteen-celebrates-his-new-center-for-american-music-opening-soon-with-all-star-concert-for-the-ages/",
          image: {
            file: "/editions/44/springsteen-center.jpg",
            alt: "The exterior of the Bruce Springsteen Center for American Music",
            credit: "CookFox",
            from: "https://www.goodnewsnetwork.org/bruce-springsteen-celebrates-his-new-center-for-american-music-opening-soon-with-all-star-concert-for-the-ages/",
          },
        },
        {
          slug: "calvin-harris-australia",
          kicker: "Tours",
          headline:
            "Calvin Harris sells 330,000 tickets for the biggest electronic headline tour in Australian history",
          dek: "Days earlier, 1.6 million people turned up to his free show in São Paulo.",
          body: [
            "Calvin Harris has been playing Australian stages since 2008, but he has never had a headline tour of his own there. When it finally arrives in February 2027, it will be the biggest ever for an electronic act in the country, with more than 330,000 tickets sold.",
            "The Scottish DJ will play five nights at The Domain in Sydney, where more than 150,000 tickets have gone and his run of shows is the longest by any headliner in the venue's history. He also plays three shows at Flemington Racecourse in Melbourne, and one each at Langley Park in Perth and the RNA Showgrounds in Brisbane.",
            "“To see Calvin Harris become the highest-selling electronic headline tour in Australian history is an incredible milestone,” said Nicholas Greco, co-founder of the promoter Untitled Group.",
            "It has been quite a month. Only days before, Harris played a free concert in São Paulo, Brazil, to 1.6 million people, which Guinness World Records has recognised as the biggest audience ever for a DJ set by a single artist.",
          ],
          source: "Digital Music News",
          sourceUrl:
            "https://www.digitalmusicnews.com/2026/09/24/calvin-harris-australian-attendance-record/",
          image: {
            file: "/editions/44/calvin-harris-australia.jpg",
            alt: "Calvin Harris smiling with his hand raised",
            credit: "@calvinharris, via Instagram",
            from: "https://www.digitalmusicnews.com/2026/09/24/calvin-harris-australian-attendance-record/",
          },
        },
        {
          slug: "elgar-halle-archive",
          kicker: "Archives",
          headline:
            "Elgar's shaving bowl and 1,500 other treasures arrive at the Hallé in Manchester",
          dek: "The collection travelled 3,500 miles from New Jersey, where one collector spent 60 years gathering it.",
          body: [
            "About 1,500 items from Sir Edward Elgar's life, including annotated manuscripts, first editions of the Enigma Variations, letters, his shaving bowl and a family recipe book, now live with the Hallé orchestra at Bridgewater Hall. Arthur Reynolds collected them in New Jersey. “We are honoured to be welcoming this incredible collection to its new home with us at the Hallé,” said David Butcher, its chief executive.",
          ],
          source: "Classic FM",
          sourceUrl:
            "https://www.classicfm.com/composers/elgar/artefacts-new-archive-manchester-halle/",
          image: {
            file: "/editions/44/elgar-halle-archive.jpg",
            alt: "Elgar manuscripts and a photograph of the composer with an orchestra",
            credit: "Classic FM",
            from: "https://www.classicfm.com/composers/elgar/artefacts-new-archive-manchester-halle/",
          },
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
            "Jim Sherwood, of Mulino in Oregon, has been growing giant pumpkins for 25 years, and he won this contest once before, in 2024. On Saturday 27 September he drove the biggest one yet to Bishop's Pumpkin Farm in Wheatland, California, for the National Pumpkin Weigh Off. It was called SpongeBlob, and it weighed 2,613 pounds, roughly the same as a small car.",
            "That broke the Oregon state record of 2,469 pounds, which Steve Daletas had held since 2018, and made SpongeBlob the heaviest pumpkin of the American season so far. It also won Sherwood first prize: $15,000. “I'm thrilled,” he said. “That pumpkin gave me quite the ride. Based on its shape I didn't think it would last.”",
            "Second place went to Mike Alves of Chico, California, whose 2,359-pound entry beat his own best by more than 650 pounds. He had doubled the size of his pumpkin patch this year. “When they start growing 50 to 60 lbs a day, it's pretty amazing,” he said.",
            "The weigh-off offered more than $100,000 in prizes, with cash for the top 20 pumpkins and for seven other giant vegetables. Chris Asbury of Bayside set a California record for a marrow, at 102 pounds. In the youth category, which had nine growers aged 7 to 17, 15-year-old Oren Muller of Guinda won $1,000 for a 1,229-pound pumpkin. There were prizes too for bushel gourds, long gourds, tomatoes, sunflowers and watermelons.",
            "The biggest prize went unclaimed: $75,000 for the world's first pumpkin over 3,000 pounds. The current world record, set in England last year by the Paton brothers, is 2,819. Growers, the organisers note, are already planning next season's patches.",
          ],
          source: "EIN Presswire",
          sourceUrl:
            "https://www.einpresswire.com/article/945522007/oregon-record-shattered-at-california-s-national-pumpkin-weigh-off",
          image: {
            file: "/editions/44/spongeblob-pumpkin.jpg",
            alt: "Giant pumpkins lined up on tarps at a weigh-off",
            credit: "einpresswire.com",
            from: "https://www.einpresswire.com/article/945522007/oregon-record-shattered-at-california-s-national-pumpkin-weigh-off",
          },
        },
        {
          slug: "phil-knight-billion",
          kicker: "Big gifts",
          headline:
            "Nike founder Phil Knight gives $1 billion to build a new engineering college in Oregon",
          dek: "It is the largest single donation ever made to an American public university.",
          body: [
            "Phil Knight, who co-founded Nike, and his wife Penny have given $1 billion to the University of Oregon, the biggest single gift an American public university has ever received, according to The Times.",
            "The money will create a new engineering college, bringing together the university's existing programmes into a full undergraduate engineering degree. Oregon, according to reports, needs more engineers, so the timing is good. The Knights' foundation had already given the university $1 billion in combined gifts over the decades.",
            "“To make an audacious dream a reality requires more than a vivid imagination,” Knight said. “It also requires the sort of opportunity that our great American universities have historically provided.” The university's president, Karl Scholz, said the gift showed that one of the most successful businesspeople in history believes higher education is worth an investment of this size.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/nike-founder-phil-knight-donates-1-billion-to-oregon-university/",
          image: {
            file: "/editions/44/phil-knight-billion.jpg",
            alt: "Phil Knight with his wife Penny at an event",
            credit: "OHSU",
            from: "https://www.goodnewsnetwork.org/nike-founder-phil-knight-donates-1-billion-to-oregon-university/",
          },
        },
        {
          slug: "keeneland-yearling-record",
          kicker: "Auctions",
          headline:
            "Keeneland's September sale sells $536.7 million of young racehorses, a new world record",
          dek: "The top lot, an Into Mischief colt, went for $3.7 million.",
          body: [
            "Over 12 sessions from 14 to 26 September, Keeneland in Kentucky sold 2,856 yearlings for $536.7 million, beating its own world record of $510.5 million from last year and making it the highest-grossing thoroughbred auction ever. A record 70 horses sold for $1 million or more. Keeneland's president, Shannon Arvin, credited the horses, the buyers and “most importantly, the people”.",
          ],
          source: "WKYT",
          sourceUrl:
            "https://www.wkyt.com/2026/09/26/keeneland-september-yearling-sale-shatters-worldwide-record-with-5367m-gross-sales/",
          image: {
            file: "/editions/44/keeneland-yearling-record.jpg",
            alt: "A yearling racehorse in the Keeneland sale ring",
            credit: "WKYT",
            from: "https://www.wkyt.com/2026/09/26/keeneland-september-yearling-sale-shatters-worldwide-record-with-5367m-gross-sales/",
          },
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
          more: [
            {
              file: "/editions/44/world-gurning-champion-2.jpg",
              alt: "A gurner pulls his face through the Egremont Crab Fair horse collar",
              credit: "News & Star",
              from: "https://www.whitehavennews.co.uk/news/26570417.egremont-man-won-world-gurning-championships-crab-fair/",
            },
            {
              file: "/editions/44/world-gurning-champion-3.jpg",
              alt: "A red tractor leads the Crab Fair parade down the main street",
              credit: "News & Star",
              from: "https://www.whitehavennews.co.uk/news/26570417.egremont-man-won-world-gurning-championships-crab-fair/",
            },
            {
              file: "/editions/44/world-gurning-champion-4.jpg",
              alt: "Another competitor gurns through the collar, lip up to his nose",
              credit: "News & Star",
              from: "https://www.whitehavennews.co.uk/news/26570417.egremont-man-won-world-gurning-championships-crab-fair/",
            },
          ],
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
            "“Whether you lifted a trophy, represented your team, or simply had a go for the first time, you helped make the 53rd championship another unforgettable day,” the organisers said. The day, sponsored by Cheffins and Allica Bank, also had food stalls, and the Witcham Events Committee is looking for volunteers to help it grow. The 54th is already booked for Saturday 10 July 2027. Start saving your peas.",
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
          slug: "sports-balls-record",
          kicker: "Records",
          headline:
            "Los Angeles teenagers set a world record by recycling 22,000 tennis and pickleball balls in a day",
          dek: "The balls weighed 2,675 pounds, and every donor got free ice cream.",
          body: [
            "Another Bounce, a teen-led group run under the non-profit Habits of Waste, collected about 22,000 used balls, mostly for tennis and pickleball, on 19 September in the Los Angeles area. Guinness World Records has confirmed it as the most racquet-sport balls recycled in a single day. Student athletes and families brought them in, and donors were thanked with free ice cream.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/teens-set-world-record-for-most-sports-balls-recycled-in-one-day-diverting-2675-pounds-from-landfills/",
          image: {
            file: "/editions/44/sports-balls-record.jpg",
            alt: "Teenagers sitting among piles of used tennis balls",
            credit: "Another Bounce/Habits of Waste",
            from: "https://www.goodnewsnetwork.org/teens-set-world-record-for-most-sports-balls-recycled-in-one-day-diverting-2675-pounds-from-landfills/",
          },
        },
      ],
    },
    {
      section: "internet",
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
            "Sometimes the most useful guess is a word that cannot possibly be the answer, because its letters split the remaining options most neatly. “A subtle but important insight from the paper is that a guess doesn't have to be the most likely answer; it simply has to be informative,” said Donald Stephens, a doctoral student on the team. In simulations, the method won 99% of games. The familiar common-letters approach managed about 90%.",
            "“The previous guesses will eliminate a whole bunch of options, and based on the remaining options, guessing some words will send you into a trajectory where information gain is speedier,” said Wu.",
            "The study appears in the Northeast Journal of Complex Systems. To use the method, a player types the game's coloured feedback into a small program, which works out the next best guess.",
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
            "At comic conventions, the TikTok reviewer known as @slow_comics, who has about 40,000 followers, has a simple habit: he heads for the tables nobody else is stopping at. This summer he stopped at the stall of Dare, a creator who posts as @Oridipe, and filmed a review of his two books: ‘Ori: Holder of the Heads’, a fantasy shaped by Yoruba tradition, and ‘Etch’, which tells a different story depending on which way you read it.",
            "The video passed a million likes and sent 25,000 new followers Dare's way. His stock sold out overnight. His brother Joshua drove more copies from Pennsylvania to New York, and those sold out too. Dare, an American of Nigerian heritage from the Philadelphia area, fills his books with ancestors and intricate African cloth patterns, and has since taken them to the Small Press Expo in Bethesda, Maryland, and the Uhuru Book Fair in Philadelphia.",
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
          slug: "chris-evans-bonded-dogs",
          kicker: "Pets",
          headline:
            "Chris Evans goes on a video ‘dream date’ with two shelter dogs, and they are adopted",
          dek: "Greg the chihuahua and Carley the golden retriever had to find a home together.",
          body: [
            "Chris Evans starred in The Dodo's ‘Dream Date’ series with Greg, a short-haired chihuahua, and Carley, a shaggy golden retriever, from the Animal Rescue League of Boston. “They're a bonded pair, which means they have to be adopted together,” he said. “A couple of sweethearts.” A couple soon took both home, and the dogs now have their own Instagram account.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/chris-evans-puts-his-limelight-on-a-bonded-dog-pair-with-cute-video-immediately-sees-them-adopted/",
          image: {
            file: "/editions/44/chris-evans-bonded-dogs.jpg",
            alt: "Greg the chihuahua and Carley the golden retriever on grass, beside a photo of Chris Evans",
            credit: "Animal Rescue League of Boston; Chris Roth, CC BY 2.0",
            from: "https://www.goodnewsnetwork.org/chris-evans-puts-his-limelight-on-a-bonded-dog-pair-with-cute-video-immediately-sees-them-adopted/",
          },
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
            "Sea spiders are not really spiders, and they are not very big, but they are very old. The group has been clambering over the seabed for around 500 million years, since long before anything walked on land. They range from less than a centimetre across to more than 70 centimetres in Antarctica, some have as many as 12 legs, and they breathe through their skin. So it is a treat when a new one turns up, and a team of scuba divers from the University of British Columbia, led by Cormac Toler-Scott as part of his master's degree, has just described two.",
            "They were found on dives no deeper than 18 metres, between September 2023 and August 2024, at sites around Quadra Island, Vancouver, Bamfield and Victoria in the Salish Sea, off Canada's west coast. They are the first new sea spiders formally described from the region in nearly 100 years.",
            "The first, Callipallene pilosuspedes, has a name that means ‘hairy feet’, which is accurate. It also has red eyes, a triangular mouth with three lips, and a set of comb-like limbs that it uses to groom itself. The divers found just one.",
            "The second, Tanystylum kiixin, is named after an ancient Indigenous village site. Kiixin, pronounced ‘kee-hin’, refers to the sound of waves crashing there. It is often covered in debris and tiny hitchhikers, which makes it, in the researchers' words, “an ecosystem within an ecosystem within an ecosystem”.",
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
            "It is a stony S-type asteroid in the main belt, and goes once round the Sun every 3.77 years or so. “For countless scientists, engineers, programmers, educators, and students, his work helped create an environment where being enthusiastic about learning was something worth celebrating,” said McGraw.",
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
          slug: "jeanerpeton-named-for-mums",
          kicker: "Fossils",
          headline:
            "Two student scientists name a chubby 309-million-year-old amphibian after their mums, both called Jean",
          dek: "Jeanerpeton mazonensis means ‘Jean's crawler from Mazon Creek’.",
          body: [
            "Allison Sefcovic and Payton Kohlberg, Women in Science interns at Chicago's Field Museum, have described a new early amphibian from the Mazon Creek fossil beds near Chicago. It lived 309 million years ago and looked like a squat, chubby salamander. Both their mothers are called Jean, hence the name. “You can even see the eye impressions,” said Sefcovic. “It's so cool to see.”",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/newly-identified-frog-like-creature-named-by-student-scientists-after-their-moms/",
          image: {
            file: "/editions/44/jeanerpeton-named-for-mums.jpg",
            alt: "Allison Sefcovic and Payton Kohlberg holding sculptures of the new species beside the fossil",
            credit: "Field Museum",
            from: "https://www.goodnewsnetwork.org/newly-identified-frog-like-creature-named-by-student-scientists-after-their-moms/",
          },
        },
      ],
    },
    {
      section: "dig-site",
      stories: [
        {
          slug: "danube-roman-city",
          slot: "feature",
          kicker: "Roman Austria",
          headline:
            "Archaeologists find a lost Roman city on the Danube, complete with an 8,000-seat amphitheatre",
          dek: "It may be Claudivium, a town Ptolemy put on his map nearly 2,000 years ago.",
          body: [
            "Beneath the fields near St. Pantaleon-Erla, in Lower Austria, not far from the hamlet of Stein and the River Danube, lies a whole Roman city that nobody knew was there. Researchers from the University of Innsbruck and several partners have now mapped it, and it is far bigger than anyone expected.",
            "The settlement covers 25 to 30 hectares and was laid out on a planned grid of streets and buildings. It had an amphitheatre that could seat around 8,000 people, which puts it in the same league as Carnuntum, one of the best-known Roman sites in Austria. The team also found signs of bronze-casting, so someone there was busy making things.",
            "Nobody had to dig to see it. The researchers, including Gerald Grabherr and Barbara Kainrath, used geophysical surveys, aerial archaeology and a close study of coins found at the site, working with the Danube Limes Forum, GeoSphere Austria and the archaeological services of Upper and Lower Austria.",
            "What surprises them most is its scale. The city grew up beside a fort for about 500 soldiers. “The construction of a 25- to 30-hectare settlement with a street grid for an auxiliary fort with approximately 500 soldiers is unprecedented,” said Grabherr.",
            "The coins suggest people moved in around AD 80 and moved on in an orderly way about a century later. The researchers even have a name in mind. Its position matches the coordinates of Claudivium, a place listed by the ancient geographer Claudius Ptolemy, so the lost town may finally have been found.",
          ],
          source: "HeritageDaily",
          sourceUrl:
            "https://www.heritagedaily.com/2026/09/lost-roman-city-discovered-on-the-danube-frontier-in-austria/159445",
          image: {
            file: "/editions/44/danube-roman-city.jpg",
            alt: "A reconstruction of a Roman town laid out beside the River Danube",
            credit: "University of Innsbruck",
            from: "https://www.heritagedaily.com/2026/09/lost-roman-city-discovered-on-the-danube-frontier-in-austria/159445",
          },
        },
        {
          slug: "wesseling-coin-hoard",
          kicker: "Treasure",
          headline:
            "A detectorist's beep near Wesseling turns into Germany's biggest Hadrian-era coin hoard",
          dek: "There were 934 silver coins in all, worth three years of a Roman legionary's pay.",
          body: [
            "Oliver Riedl, an amateur archaeologist, was out with his metal detector in a field near Wesseling, on the Lower Rhine, when he found 15 Roman silver denarii. His detector suggested there were more. There were a great many more.",
            "Archaeologists lifted the find out in a single block of soil and X-rayed it at the LVR-Landesmuseum Bonn. Inside were 934 coins weighing 3.1 kilograms, along with bits of pottery and straw that suggest they were packed in a padded pot. The oldest coin dates from 148 BC and the newest from AD 124 to 125, in the reign of Hadrian.",
            "“This is the largest coin treasure from this time in Germany; it is the fifth largest worldwide,” said Erich Claßen. In Roman terms it was a small fortune, about three times what a legionary earned in a year.",
          ],
          source: "Discover Magazine",
          sourceUrl:
            "https://www.discovermagazine.com/more-than-900-roman-silver-coins-form-germany-s-largest-hadrian-era-hoard-49740",
          image: {
            file: "/editions/44/wesseling-coin-hoard.jpg",
            alt: "A Roman silver denarius of the emperor Hadrian",
            credit: "Suffolk County Council, CC BY-SA 4.0, via Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Denarius_of_Hadrian_(FindID_477360).jpg",
          },
        },
        {
          slug: "lake-mezzano-sword",
          kicker: "Underwater",
          headline:
            "Divers bring up a perfectly preserved Bronze Age sword from the bottom of Lake Mezzano",
          dek: "It is the third sword the little Italian lake has given up since the 1970s.",
          body: [
            "Underwater archaeologists working on the southern shore of Lake Mezzano, in northern Lazio, have recovered a perfectly preserved Bronze Age sword. It comes from a pile-dwelling village of about 1700 to 1150 BC, first spotted in the early 1970s. The same patch of lakebed also gave up intact pots, a bronze razor and a bronze axe.",
          ],
          source: "Arkeonews",
          sourceUrl:
            "https://arkeonews.net/third-bronze-age-sword-found-beneath-italys-lake-mezzano-deepens-an-archaeological-mystery/",
          image: {
            file: "/editions/44/lake-mezzano-sword.jpg",
            alt: "A Bronze Age sword recovered from Lake Mezzano",
            credit: "Soprintendenza Archeologia Belle Arti Paesaggio Etruria Meridionale",
            from: "https://arkeonews.net/third-bronze-age-sword-found-beneath-italys-lake-mezzano-deepens-an-archaeological-mystery/",
          },
        },
      ],
    },
    {
      section: "planet-wins",
      stories: [
        {
          slug: "andfjorden-protected-area",
          slot: "feature",
          kicker: "Oceans",
          headline:
            "Norway protects Andfjorden, a sea full of coral gardens, kelp forests, whales and seabirds",
          dek: "The new marine protected area is about the size of 260,000 football pitches.",
          body: [
            "Norway has a new marine protected area, and it is a big one. Andfjorden, in the far north of Nordland and the south of Troms, covers about 714 square miles of sea, or nearly 260,000 football pitches, across the municipalities of Andøy, Harstad and Senja.",
            "Beneath the surface it is busy. There are coral reefs and coral gardens, communities of sponges and sea pens, and kelp forests. There are beds of shell sand and maerl, a kind of chalky seaweed, which are important places for fish to spawn and for young fish to grow. Above them swim plenty of fish and whales, while large numbers of seabirds fish the waters from above. In other words, almost every layer of the sea, from the seabed to the sky, is full of life.",
            "The area was announced on 18 September by Sigrun Aasland, Norway's Minister of Climate and Environment. She said the protection “will help ensure that future generations can also enjoy the natural values of Andfjorden”.",
            "It will be looked after by its own board, with members from the local municipalities, the county authorities and the Sámi parliament. The zones with the most delicate wildlife get the strictest rules, so the rarest corals and sponges get the most careful treatment of all.",
            "Andfjorden is the 24th area to be protected under Norway's Marine Protection Plan of 2004, which lists 36 in all. It raises the share of the country's mainland territorial waters under protection from about 4.8% to 6%, and there are twelve more areas still to come.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/norways-newest-marine-protected-area-shelters-rich-marine-habitat-whales-and-seabirds/",
          image: {
            file: "/editions/44/andfjorden-protected-area.jpg",
            alt: "Mountains rising above the calm sea of Andfjorden",
            credit: "Jan Harald Tomassen/Statsforvaltaren i Troms and Finnmark",
            from: "https://www.goodnewsnetwork.org/norways-newest-marine-protected-area-shelters-rich-marine-habitat-whales-and-seabirds/",
          },
        },
        {
          slug: "sandilands-golf-wetland",
          kicker: "Rewilding",
          headline: "A Lincolnshire golf course becomes a wetland for avocets, terns and plovers",
          dek: "At Sandilands, the National Trust has swapped fairways for water the size of 45 football pitches.",
          body: [
            "When the National Trust bought the Sandilands golf course on the Lincolnshire coast in 2020, it had other plans for the greens. Today the old course is a nature reserve, with wetland covering an area the size of 45 football pitches, and no pesticides or mains water in sight.",
            "The birds approve. Plovers, terns, avocets, lapwings and oystercatchers now use the site, and little ringed plover chicks have been seen there for the second year running. “Many species depend on places like this to rest, feed, and breed,” said Katie Scott, a ranger at Sandilands.",
            "Golf and wildlife can share, too. At the CommonGround course in Aurora, Colorado, native wildflowers have replaced ornamental planting, the grass is watered with recycled water, and 40 bird species have been counted in a single day.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/coastal-golf-course-turned-into-vital-wetland-habitat-for-seabirds/",
          image: {
            file: "/editions/44/sandilands-golf-wetland.jpg",
            alt: "An aerial view of Sandilands Nature Reserve's wetlands beside the beach",
            credit: "National Trust/John Miller",
            from: "https://www.goodnewsnetwork.org/coastal-golf-course-turned-into-vital-wetland-habitat-for-seabirds/",
          },
        },
        {
          slug: "woolston-eyes-grebes",
          kicker: "Birds",
          headline:
            "An old canal dumping ground in Cheshire now hosts 64% of Britain's black-necked grebes",
          dek: "Woolston Eyes had four nesting pairs in 2023 and 35 breeding pairs by 2025.",
          body: [
            "Woolston Eyes, a nature reserve of almost 1,000 acres in Cheshire, began as a place to put mud dredged from the Manchester Ship Canal. Restoration work since 2021, including new nesting islands, has made it a haven for black-necked grebes, which rose to 35 breeding pairs by 2025. “It is fantastic to see black-necked grebe numbers increasing,” said Gavin Thomas of the RSPB.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/former-industrial-ground-goes-from-dump-to-diversity-and-hosts-64-of-uks-black-necked-grebes/",
          image: {
            file: "/editions/44/woolston-eyes-grebes.jpg",
            alt: "A black-necked grebe with golden ear feathers on the water",
            credit: "Stephan Sprinz, CC BY 4.0",
            from: "https://www.goodnewsnetwork.org/former-industrial-ground-goes-from-dump-to-diversity-and-hosts-64-of-uks-black-necked-grebes/",
          },
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
        text: "One sea spider, very small, hairy feet. Answers to nothing. Probably grooming.",
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
        text: "Retired walnut, now a remote control. Will change your channel from inside a fruit bowl.",
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
};
