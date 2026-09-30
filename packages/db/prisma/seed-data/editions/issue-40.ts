// Issue 40, Monday 28 September 2026. Back to the broadsheet for the week.
// Every story is real good news, rewritten in our own words, each with its source article; images
// were fetched with apps/frontend/scripts/fetch_image.py.
import type { SeedEdition } from "../types.ts";

export const issue40: SeedEdition = {
  issueNumber: 40,
  date: "2026-09-28",
  status: "published",
  design: "broadsheet",
  colourway: "pool-party",

  front: [
    {
      slug: "dasosaurus-construction-site",
      section: "discoveries",
      kicker: "Dinosaurs",
      headline:
        "Builders digging a rail terminal in Brazil uncover a 20-metre dinosaur nobody knew about",
      dek: "Dasosaurus tocantinensis, the ‘forest lizard’ of the Tocantins River, is the biggest dinosaur ever found in Maranhão.",
      body: [
        "Most building sites turn up pipes, old bricks and the odd lost trowel. The one in Davinópolis, in the Brazilian state of Maranhão, turned up a dinosaur the length of two buses.",
        "Workers were preparing ground for a road and rail terminal when bones began to appear. Archaeologists had been watching the dig as part of its environmental licence, and at first they took the remains for a prehistoric mammal. They were out by a considerable margin. What they had found was a sauropod, one of the long-necked, long-tailed plant-eaters, about 20 metres from nose to tail and roughly 120 million years old.",
        "The team has named it Dasosaurus tocantinensis. ‘Daso’ means forest, a nod to the wooded landscape of Maranhão, while the second half honours the Tocantins River that runs near the site. The study, published in the Journal of Systematic Palaeontology, was led by Elver Luiz Mayer of the Federal University of the São Francisco Valley, with Max Langer of the University of São Paulo and Tito Aureliano and Aline Ghilardi of the Federal University of Rio Grande do Norte.",
        "The skeleton is unusually complete for a find of this age. There are tail vertebrae, ribs, bones from the limbs and feet, and a single thigh bone 1.5 metres long, taller than many of the people who dug it out.",
        "“It's the largest known dinosaur for Maranhão, which has other species, but not sauropods like this one,” the researchers said. The state has given scientists other dinosaurs before, but nothing on this scale.",
        "An artist's reconstruction by Jorge Blanco now shows Dasosaurus striding through its ancient forest. The terminal, meanwhile, has already earned itself the best possible foundation story.",
      ],
      source: "ScienceDaily",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260907201603.htm",
      sticker: "20m",
      image: {
        file: "/editions/40/dasosaurus-construction-site.jpg",
        alt: "An artist's reconstruction of the long-necked sauropod Dasosaurus walking through a forest",
        credit: "Jorge Blanco",
        from: "https://www.sciencedaily.com/releases/2026/09/260907201603.htm",
      },
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
      image: {
        file: "/editions/40/vinatieri-field-goal-jungfraujoch.jpg",
        alt: "The Sphinx observatory on its rock at Jungfraujoch",
        credit: "Wikimedia Commons",
        from: "https://commons.wikimedia.org/wiki/File:CH.BE.Grindelwald_2021-04-20_Jungfraujoch_Sphinx-Observatory.jpg",
      },
    },
    {
      slug: "magazine-returned-132-years-late",
      slot: "feature",
      section: "internet",
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
      image: {
        file: "/editions/40/magazine-returned-132-years-late.jpg",
        alt: "The Concord Public Library building in Concord, New Hampshire",
        credit: "Farragutful / Wikimedia Commons",
        from: "https://commons.wikimedia.org/wiki/File:Concord_Public_Library.jpg",
      },
    },
  ],

  inside: [
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
          slug: "steam-frame-launch",
          slot: "brief",
          kicker: "Virtual reality",
          headline:
            "Valve's Steam Frame headset starts shipping, with a random draw to beat the resellers",
          dek: "It plays VR games on its own, and streams your whole Steam library from a PC.",
          body: [
            "Valve's new headset comes in two sizes: $1,059 (£889) for 256GB and $1,299 (£1,089) for 1TB. It runs on a Snapdragon chip, plays VR games by itself and can stream the whole Steam library from a PC using the Wi-Fi 6E dongle in the box. To keep kits away from resellers, buyers were picked at random, with the first purchase emails sent on 18 September.",
          ],
          source: "Road to VR",
          sourceUrl: "https://roadtovr.com/valve-steam-frame-price-release-pre-orders/",
          image: {
            file: "/editions/40/steam-frame-launch.jpg",
            alt: "The black Steam Frame headset lying beside its two controllers",
            credit: "Valve",
            from: "https://roadtovr.com/valve-steam-frame-price-release-pre-orders/",
          },
        },
      ],
    },
    {
      section: "startups",
      stories: [
        {
          slug: "sivo-go-dyson-award",
          kicker: "Inventions",
          headline:
            "Loughborough graduate's pocket alarm for deaf travellers wins the UK James Dyson Award",
          dek: "Gargi Agrawalla's SIVO.GO hears fire alarms, doorbells and knocks, then flashes, buzzes and shows a message.",
          body: [
            "Gargi Agrawalla has turned her final-year university project into a national prize. The Loughborough University product design graduate was named the UK winner of the James Dyson Award 2026 on 16 September for SIVO.GO, a portable safety system for deaf and hard-of-hearing travellers.",
            "The idea came from her own life. Agrawalla is profoundly deaf and uses a cochlear implant, and she designed SIVO.GO for the moments when a hotel room or a holiday flat can leave you out of the loop: while you are asleep, in the shower or simply somewhere unfamiliar.",
            "The little device listens for the sounds that matter, such as fire alarms and doorbells, while a separate vibration sensor picks up knocks and a door opening. It then passes the alert on as light, a message on a small screen and a vibration. Everything happens on the device itself, with no Wi-Fi or cloud connection needed.",
            "Inside is an Arduino Nano 33 BLE Sense Rev2 microprocessor, a MEMS microphone, an OLED screen, RGB lights, a vibration motor and a real-time clock. Its sound-recognition model is a tiny piece of machine learning trained on more than 500 labelled audio clips.",
            "“It feels immensely rewarding to see SIVO.GO grow from my final year university project into something recognised at a national level,” Agrawalla said. The win brings £5,000 and a place in the running for the international top 20, where £30,000 is at stake. Next she plans to improve the prototype, run more trials with users and accommodation providers, and work towards certification and pilot manufacturing.",
          ],
          source: "Loughborough University",
          sourceUrl:
            "https://www.lboro.ac.uk/media-centre/press-releases/2026/september/gargi-agrawalla-uk-winner-james-dyson-award-2026",
          image: {
            file: "/editions/40/sivo-go-dyson-award.jpg",
            alt: "Gargi Agrawalla holding her SIVO.GO device in a workshop",
            credit: "Loughborough University",
            from: "https://www.lboro.ac.uk/media-centre/press-releases/2026/september/gargi-agrawalla-uk-winner-james-dyson-award-2026",
          },
        },
        {
          slug: "ithrone-waterless-toilet",
          slot: "feature",
          kicker: "Space spin-off",
          headline:
            "A toilet first imagined for astronauts now serves more than 20,000 homes on Earth",
          dek: "Diana Yousef's iThrone dries away 95 per cent of the water in waste, so it needs no pipes at all.",
          body: [
            "Diana Yousef was working on sanitation for spacecraft at NASA when she noticed something useful. A space station bathroom has to deal with waste without any water pipes, and so do homes in places that have no plumbing. The same answer could work for both.",
            "The result is the iThrone, made by her start-up change:WATER. It rapidly evaporates 95 per cent of the water in human waste, which means it needs no sewer connection and no water supply at all. More than 20,000 households in Uganda, Panama and the United States already use one.",
            "Yousef, who studied at Cornell, Columbia and Harvard, has now won the 2026 Global Citizen Waislitz Award, which comes with $100,000. She says the money will help change:WATER scale up iThrone distribution to millions more households by next year.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/inventor-envisioned-a-waterless-toilet-for-astronauts-realized-it-could-solve-a-global-sanitation-crisis-instead/",
          image: {
            file: "/editions/40/ithrone-waterless-toilet.jpg",
            alt: "A diagram of the iThrone waterless toilet and its evaporative collection pouch",
            credit: "change:WATER",
            from: "https://www.goodnewsnetwork.org/inventor-envisioned-a-waterless-toilet-for-astronauts-realized-it-could-solve-a-global-sanitation-crisis-instead/",
          },
        },
        {
          slug: "fingagolf-dragons-den",
          slot: "brief",
          kicker: "Dragons' Den",
          headline: "Peter Jones gets a hole in one with a golf game you play with a finger",
          dek: "Fingagolf's tiny club slips on to your finger, and comes in left- and right-handed versions.",
          body: [
            "Glyn Richards took Fingagolf into the Den asking for £30,000 for 15 per cent. The game uses a plastic club worn on the finger and a miniature artificial course, with add-on packs of new courses and scenery. Peter Jones offered the money for 30 per cent, Richards said yes, and the Dragon declared it a hole in one. The club has six registered designs.",
          ],
          source: "Dragons' Den IP blog (UK Intellectual Property Office)",
          sourceUrl:
            "https://dragonsden.blog.gov.uk/2026/09/10/dragons-den-ip-blog-series-23-episode-11/",
          image: {
            file: "/editions/40/fingagolf-dragons-den.jpg",
            alt: "Glyn Richards demonstrates Fingagolf on a miniature green to two Dragons",
            credit: "BBC / Dragons' Den",
            from: "https://dragonsden.blog.gov.uk/2026/09/10/dragons-den-ip-blog-series-23-episode-11/",
          },
        },
      ],
    },
    {
      section: "screen",
      stories: [
        {
          slug: "emmys-2026-records",
          kicker: "Emmys",
          headline: "Jean Smart and Matthew Rhys make Emmys history on a night led by Widow's Bay",
          dek: "Apple TV's comedy took 14 awards, and Mariska Hargitay hosted the ceremony in Los Angeles.",
          body: [
            "The 78th Primetime Emmy Awards were handed out on 14 September at the Peacock Theater in downtown Los Angeles, and two actors went home with a place in the record books.",
            "Jean Smart won Outstanding Lead Actress in a Comedy for Hacks, making her the first female performer ever to win an Emmy for every season of her series. Matthew Rhys managed something just as rare: he won Lead Actor in a Comedy for Widow's Bay and Lead Actor in a Limited Series for The Beast in Me, taking prizes in both categories on the same night.",
            "Widow's Bay was the evening's big story. The Apple TV show won Outstanding Comedy Series and 14 Emmys in total, six of them in the major categories, which made it very much Apple TV's night. The Pitt, on HBO Max, took Outstanding Drama Series, with Noah Wyle named Lead Actor in a Drama, and Rhea Seehorn won Lead Actress in a Drama for Pluribus. Sally Field was named Lead Actress in a Limited Series for Remarkably Bright Creatures.",
            "The host was Mariska Hargitay, the star of Law & Order: Special Victims Unit. She was the first host since 1993 who is not a comedian, comedy performer, reality presenter or television personality, and the first woman to host since 2011. Michael J. Fox received the Bob Hope Humanitarian Award.",
            "The ceremony, a proper feast of television, went out on NBC and the Peacock streaming service, and 6.8 million people tuned in to watch history being made twice in one evening.",
          ],
          source: "Wikipedia",
          sourceUrl: "https://en.wikipedia.org/wiki/78th_Primetime_Emmy_Awards",
          image: {
            file: "/editions/40/emmys-2026-records.jpg",
            alt: "The Peacock Theater at L.A. Live in downtown Los Angeles, where the Emmys were held",
            credit: "Benoît Prieur / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Microsoft_Theater_(Los_Angeles)_July_2022.JPG",
          },
        },
        {
          slug: "atlas-animated-movie-basement",
          slot: "feature",
          kicker: "Animation",
          headline: "Austin McConnell animates a whole 90-minute superhero film in his basement",
          dek: "Atlas: The Animated Movie revives a 1964 comic hero who never got past issue one.",
          body: [
            "Austin McConnell spent four years making a 90-minute animated feature, and he did most of the animating himself, six or seven hours a day, from his basement. “It was basically like trying to figure out how to do Avatar in this basement that I'm standing in,” he told Cartoon Brew.",
            "Atlas: The Animated Movie is based on Atlas: Man of Might, a 1964 comic from I.W. Publications. “This was essentially a Golden Age comic book character that never got past the first issue,” McConnell said. A Kickstarter campaign raised $51,809 from 1,108 backers, and he built the film with iClone, After Effects, Photoshop, DaVinci Resolve and Audacity, under a cheerful studio motto: “Just do it scuffed.”",
            "The film went up on YouTube on 8 September, and the Moxie Cinema in Springfield, Missouri, screened it on the 12th. “When you watch this movie, it definitely feels like a person made it,” McConnell said.",
          ],
          source: "Cartoon Brew",
          sourceUrl:
            "https://www.cartoonbrew.com/feature-film/atlas-the-animated-movie-austin-mcconnell-266272.html",
          image: {
            file: "/editions/40/atlas-animated-movie-basement.jpg",
            alt: "The animated superhero Atlas in his blue and red costume, from Atlas: The Animated Movie",
            credit: "Austin McConnell",
            from: "https://www.cartoonbrew.com/feature-film/atlas-the-animated-movie-austin-mcconnell-266272.html",
          },
        },
        {
          slug: "vulcan-salute-record-science-museum",
          slot: "brief",
          kicker: "Star Trek",
          headline: "Star Trek fans set a Vulcan salute record at London's Science Museum",
          dek: "1,188 people came for Star Trek Day, and 934 of them held the split-fingered salute for a full minute.",
          body: [
            "On 10 September, Star Trek Day, fans gathered at the Science Museum in London for the show's 60th anniversary, joined by Martin Quinn, Scotty in Star Trek: Strange New Worlds. A Guinness World Records adjudicator counted 934 people who held the salute steady for the whole minute. “It was a huge bonding moment for the fans,” she said. Live long, and keep your fingers apart.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/15/Guinness-World-Records-Star-Trek-Vulcan-salute/3451789489055/",
          image: {
            file: "/editions/40/vulcan-salute-record-science-museum.jpg",
            alt: "Star Trek fans raise the Vulcan salute together at the Science Museum in London",
            credit: "Guinness World Records",
            from: "https://www.guinnessworldrecords.com/news/2026/9/most-people-performing-a-vulcan-salute-simultaneously",
          },
        },
      ],
    },
    {
      section: "play",
      stories: [
        {
          slug: "nintendo-direct-kirby-world-beyond",
          kicker: "Nintendo",
          headline: "Kirby gets a whole open world to explore for his 35th birthday",
          dek: "September's Nintendo Direct also slipped ten classic Super Mario Kart tracks into Mario Kart World, free, the same day.",
          body: [
            "Nintendo's September Direct, broadcast on 9 September, had something for almost every kind of player, and the pinkest of all was Kirby and the World Beyond. It is a brand-new 3D adventure for Switch 2 set in an open world, built around Kirby's famous Copy Abilities, and it is due in spring 2027 to celebrate the series' 35th anniversary.",
            "Kirby borrowing the powers of whatever he swallows has been the heart of the series for decades. Giving him a whole open world to try them out in is the sort of idea that makes you wonder why nobody thought of it sooner.",
            "Racers did not have to wait at all. Mario Kart World got a free update the same day, bringing back ten classic tracks from Super Mario Kart, including Choco Island, Vanilla Lake and Ghost Valley, and adding two new Knockout Tour routes, Propeller and Turnip Rally.",
            "The rest of the show filled the calendar nicely. Pikmin 4 Switch 2 Edition + Dandori Academy arrives on 12 November with voice commands and a new time-challenge mode. Professor Layton and the New World of Steam follows on 10 December, on both Switch 2 and the original Switch. Hyrule Warriors: Age of Calamity - Definitive Edition lands on 25 February 2027, and Yo-kai Watch 2: Haunted Domain is on its way to Switch 2, with a date still to come.",
            "For anyone keeping count, that is a new Kirby, a new Layton, a smarter Pikmin and a pile of old Mario Kart tracks, all from one afternoon's broadcast. The Switch 2 is going to be a busy little machine this winter.",
          ],
          source: "Game Informer",
          sourceUrl:
            "https://gameinformer.com/nintendo-direct/2026/09/09/every-new-announcement-at-the-september-2026-nintendo-direct",
          image: {
            file: "/editions/40/nintendo-direct-kirby-world-beyond.jpg",
            alt: "Sword Kirby, in his green cap, from the reveal trailer for Kirby and the World Beyond",
            credit: "Nintendo",
            from: "https://www.invenglobal.com/articles/25745/a-world-beyond-the-world-kirby-and-the-world-beyond-releasing-spring-2027",
          },
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
          slug: "switch-sports-resort-fingerboard",
          slot: "brief",
          kicker: "Freebies",
          headline:
            "Nintendo Switch Sports Resort comes with a tiny finger skateboard for early buyers",
          dek: "The retro pre-order gift is on offer at two UK shops, TheGameCollection and ShopTo.",
          body: [
            "Anyone who remembers finger skateboards lining toy shop shelves in the late 1990s can have one again. Pre-order the Switch 2 game for £46.95 at TheGameCollection, or £43.85 at ShopTo, and a Sports Resort-themed fingerboard comes free. TheGameCollection calls it one of its favourite bonuses ever. Nintendo's own store is offering a drawstring sports bag.",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/attention-all-millennials-the-nintendo-switch-sports-resort-pre-order-gift-is-a-bonafide-finger-skateboard/",
          image: {
            file: "/editions/40/switch-sports-resort-fingerboard.jpg",
            alt: "The Nintendo Switch Sports Resort box beside its free finger skateboard",
            credit: "GamesRadar+ / Nintendo",
            from: "https://www.gamesradar.com/games/attention-all-millennials-the-nintendo-switch-sports-resort-pre-order-gift-is-a-bonafide-finger-skateboard/",
          },
        },
      ],
    },
    {
      section: "music",
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
          slug: "olivia-rodrigo-unraveled-tour",
          slot: "feature",
          kicker: "Tours",
          headline:
            "Olivia Rodrigo opens her 86-date Unraveled Tour in Hartford, with London to come",
          dek: "Wolf Alice and The Last Dinner Party are among the acts taking turns as support.",
          body: [
            "Olivia Rodrigo is back on the road. Her Unraveled Tour began on 25 September in Hartford, Connecticut, and runs for 86 dates across North America and Europe before finishing at London's O2 on 10 May 2027.",
            "It is her third concert tour and her second full run of arenas, and it celebrates her third album, You Seem Pretty Sad for a Girl So in Love, which came out on 12 June. Fans in Los Angeles, Brooklyn and London get more than one night.",
            "The support line-up is a treat in itself. Wolf Alice, Devon Again, The Last Dinner Party, Grace Ives and Die Spitz will take turns opening the shows. And Rodrigo is in good company this month: KATSEYE set off on the Wildworld Tour, their first arena-scale world tour, on 1 September, after their EP WILD went straight to No. 1 on the Billboard 200.",
          ],
          source: "InMusic Blog",
          sourceUrl: "https://inmusicblog.com/tours/biggest-tours-september-2026/",
          image: {
            file: "/editions/40/olivia-rodrigo-unraveled-tour.jpg",
            alt: "Olivia Rodrigo in a pale pink dress against a dark background decorated with flowers",
            credit: "Geffen Records",
            from: "https://inmusicblog.com/tours/biggest-tours-september-2026/",
          },
        },
        {
          slug: "bunnymen-apples-for-isaac",
          slot: "brief",
          kicker: "Albums",
          headline:
            "Echo & the Bunnymen release Apples for Isaac, their first album in twelve years",
          dek: "It comes on splatter vinyl and picture disc, among other formats.",
          body: [
            "The 11-track album arrived on 18 September, the band's first new material since Meteorites in 2014 and their 13th studio record. Ian McCulloch produced it, and songs include Brussels Is Haunted. It is out on black vinyl, limited splatter vinyl, picture disc, CD and download, with December shows at Glasgow's Barrowland on the way.",
          ],
          source: "XS Noize",
          sourceUrl: "https://www.xsnoize.com/echo-and-the-bunnymen-apples-for-isaac/",
          image: {
            file: "/editions/40/bunnymen-apples-for-isaac.jpg",
            alt: "The painted cover of Apples for Isaac, showing an apple tree behind a wooden fence",
            credit: "Echo & the Bunnymen",
            from: "https://www.xsnoize.com/echo-and-the-bunnymen-apples-for-isaac/",
          },
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
            "The rules at the Halfmoon Sunoco, about 25 minutes outside Albany in New York state, were simple. Dance for at least 15 seconds at the counter and you got 20 per cent off your whole bill. No experience was required, and nobody was marked on technique.",
            "The idea came from the station's social media manager, Paulina Sirtori, a 23-year-old recent graduate of Syracuse University, who wanted to give customers something to smile about at the till. The plan was small, silly and cheerful, and people loved it from the first song.",
            "Customers took the challenge seriously, and some came fully prepared. Denise Lapointe, a local bus driver, went with a song of her own composition. “I just danced to the beat of my own drum while singing, ‘I'm dancing for a discount. I'm dancing for a discount,’” she told the New York Post. “Just being my goofy self.”",
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
          slug: "village-saves-its-bistro",
          slot: "feature",
          kicker: "Local business",
          headline: "Burgundy village mayors club together to reopen the only café-bistro in town",
          dek: "Au Bon Accueil in Saint-Martin-sur-Ouanne is pouring coffee again after an €25,000 refit.",
          body: [
            "In Saint-Martin-sur-Ouanne, a village in Burgundy, Au Bon Accueil is the café-bistro where the regulars gather every day and sit in the same seats. After eight shut months, it is open again, thanks to a little help from the local mayors.",
            "Mayor Hervé Chapuis teamed up with the district mayor, who once ran a bistro himself for seven years, and €25,000 of public money went on renovations. “The cafe-bistro was their point of reference,” the mayor said of the villagers. The new manager, Nadia Letellier, can already see the difference. “People seem really happy it's open again,” she said.",
            "The council has form in this sort of thing. It now owns several bistros and restaurants, and three bakeries, which must make it one of the best-fed local authorities in France.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/rural-french-mayors-rally-to-save-their-local-cafe-bistro-and-help-reverse-national-trend/",
          image: {
            file: "/editions/40/village-saves-its-bistro.jpg",
            alt: "The village church of Saint-Martin-sur-Ouanne in Burgundy, seen from the south",
            credit: "Basicdesign / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:St-Martin-s-Ouanne,_%C3%A9glise_vue_du_sud.JPG",
          },
        },
        {
          slug: "duffield-big-bet-for-pets",
          slot: "brief",
          kicker: "Big gifts",
          headline: "Dave and Cheryl Duffield put $250 million into vet care for America's pets",
          dek: "The five-year Big Bet for Pets starts with 250 grants of $10,000 each.",
          body: [
            "The Dave & Cheryl Duffield Foundation's gift goes to community vet clinics across the United States, with a $10 million pool for established nonprofit clinics too. The couple have now given more than $500 million to companion animals. “Pets are members of our families,” said Dave Duffield, “and they need veterinary care to live long, healthy lives.”",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/historic-philanthropic-gift-will-expand-veterinary-care-access-to-millions-of-americans-and-their-pets/",
          image: {
            file: "/editions/40/duffield-big-bet-for-pets.jpg",
            alt: "Dave Duffield speaking on stage",
            credit: "Him121 / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Dave_Duffield_addressing_Peoplesoft,_2005.jpg",
          },
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "berlin-marathon-2026-results",
          kicker: "Running",
          headline: "Tigst Assefa runs the third-fastest women's marathon ever to win in Berlin",
          dek: "Guye Adola won the men's race, and a record field of more than 56,000 runners joined in.",
          body: [
            "Berlin has a reputation for fast times, and on Sunday 27 September it lived up to it. Ethiopia's Tigst Assefa won the women's race in 2:11:04, a new course record for Berlin and the third-fastest women's marathon in history.",
            "The men's race went to her compatriot Guye Adola in 2:02:50. Dida Deriba was second in 2:03:19 and Gabriel Geay third in 2:03:59. In the women's race, Bedatu Hirpa took second in 2:16:53, two seconds ahead of Dera Dida in third. Put the two winning times together and you get 4:13:54, the second-fastest combined total ever run.",
            "There was a curious footnote on everyone's feet. All six runners on the two podiums wore the same shoe, the Adidas Pro Evo 3, an unprecedented clean sweep at one of the World Marathon Majors.",
            "Behind the elite runners came a vast and happy crowd. More than 56,000 runners from 162 nations took part, the biggest field Berlin has ever had, and 250 runners from 43 countries collected their Six Star medals in the city, the reward for completing all six of the World Marathon Majors. The inline skating marathon, held the same weekend, went to Bart Swings in 57:30 and Keily Delgado in 1:12:55.",
            "Anyone inspired to join them next year does not have long to wait. The draw for places in the 2027 race opens on 1 October and runs until 12 November, so there is plenty of time to practise, and plenty of time to pick the right pair of shoes.",
          ],
          source: "The Running Channel",
          sourceUrl: "https://therunningchannel.com/berlin-marathon-2026-results/",
          image: {
            file: "/editions/40/berlin-marathon-2026-results.jpg",
            alt: "Tigst Assefa runs towards the finish in front of the Brandenburg Gate",
            credit: "SCC Events",
            from: "https://therunningchannel.com/berlin-marathon-2026-results/",
          },
        },
        {
          slug: "royals-home-bun-race",
          slot: "feature",
          kicker: "Baseball",
          headline: "Royals fans steer a giant inflatable hot dog into its bun; everyone eats free",
          dek: "The crowd had 35 seconds to complete the ‘Home Bun Race’ at Kauffman Stadium.",
          body: [
            "Baseball has the seventh-inning stretch. The Kansas City Royals have the Home Bun Race. During their game against the Toronto Blue Jays on Saturday 6 September, a giant inflatable hot dog and an equally giant inflatable bun were launched into different sections of the stands at Kauffman Stadium.",
            "The fans had 35 seconds to nudge the two together across the crowd, passing them from hand to hand over the rows of seats. They did it inside the time, which meant every fan in the ground had earned a free hot dog.",
            "Major League Baseball's account marked the moment with a short announcement: “HOT DOG ASSEMBLY COMPLETE.” It is hard to believe many people went home hungry, and harder still to think of a better use of a Saturday afternoon's teamwork.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/09/home-bun-race-Kansas-City-royals/8641788970720/",
          image: {
            file: "/editions/40/royals-home-bun-race.jpg",
            alt: "Kauffman Stadium lit up at night",
            credit: "Jordano53 / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Kauffman_Stadium_exterior_July_26_2019.jpg",
          },
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
          image: {
            file: "/editions/40/fastest-hole-of-disc-golf.jpg",
            alt: "A disc golf basket on its pole",
            credit: "kallerna / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Disc_golf_basket_3_and_10_in_Yyteri.jpg",
          },
        },
      ],
    },
    {
      section: "internet",
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
            "Fans can scout the contenders on live webcams run by Explore.org, which organises the contest with the National Park Service and the Katmai Conservancy. The champion is crowned on Tuesday 29 September. We would tell you who to vote for, but frankly they are all magnificent, every last round one of them.",
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
            "Some came with particular things to shout about. Plenty said simply that it felt good. There was also a competition, judged on three things: volume, length and vocal style.",
            "The winner, Olivia Gugliemotto, reached 121.9 decibels, not far short of the world record of 129, and was presented with a small megaphone, which feels like a bold prize to give her. The ocean, for its part, made no complaint whatsoever.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/14/Guttural-scream-at-the-sea-San-Francisco/6761789408160/",
          image: {
            file: "/editions/40/scream-at-the-sea.jpg",
            alt: "Waves roll in at Ocean Beach, San Francisco",
            credit: "Radomianin / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Seal_Rocks,_Ocean_Beach,_San_Francisco.jpg",
          },
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
          image: {
            file: "/editions/40/salt-and-pepper-packet-record.jpg",
            alt: "Linda Schulz with her collection of salt and pepper packets",
            credit: "The Freeman / gmtoday.com",
            from: "https://www.gmtoday.com/the_freeman/news/linda-schulz-salt-pepper-packets/article_913af23a-d129-5adc-b054-027985c229aa.html",
          },
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "cat-urine-id-card",
          kicker: "Cats",
          headline:
            "Scientists find the chemical name tag that lets cats tell each other apart by smell",
          dek: "Thirteen unusual fatty acids give every cat a signature scent, and they solve a century-old kidney puzzle too.",
          body: [
            "Cats have always been rather private about how they keep track of one another. A team led by Professor Masao Miyazaki at Iwate University in Japan, working with colleagues in Germany and Spain, has now found one of their tricks: a chemical ‘ID card’ carried in their urine.",
            "The researchers first confirmed that cats really can tell individuals apart by the smell of their urine, and that they can do it across months. Then they went looking for what makes each smell different. They separated out the fatty parts of the urine and identified 13 unusual branched-chain fatty acids, which together form a stable signature for each cat.",
            "To make sure these were the compounds doing the work, the team swapped only the fraction containing them between samples and watched how the cats responded. The profiles also held steady for at least 24 hours in urine-soaked samples kept at 25°C, long enough for a scent mark to carry a message.",
            "The find may also answer an old question about feline anatomy. “Lipid droplets in the cat kidney have been known for more than a century, but why cats have so many of them has remained a mystery,” Miyazaki said. The team suggests the droplets act as a store for these compounds, keeping each cat's chemical profile consistent even as its diet changes.",
            "The study, published in Current Biology, looked beyond house cats too, examining lions, tigers, leopards, jaguars, lynxes and the rare Iriomote cat. It turns out a lot of cats have been leaving their names about all along.",
          ],
          source: "ScienceDaily",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260919031033.htm",
          image: {
            file: "/editions/40/cat-urine-id-card.jpg",
            alt: "A ginger cat sniffing the edge of a yellow litter tray",
            credit: "Shutterstock",
            from: "https://www.sciencedaily.com/releases/2026/09/260919031033.htm",
          },
        },
        {
          slug: "chimps-throw-rocks-at-trees",
          slot: "feature",
          kicker: "Chimpanzees",
          headline:
            "Chimpanzees in Guinea-Bissau have been throwing stones at the same trees for a decade",
          dek: "Camera traps show a rare tradition that has built up piles of stones at favourite spots.",
          body: [
            "In Boé National Park in Guinea-Bissau, western chimpanzees have a habit that looks a lot like culture. Adult males in particular return again and again to the same trees and hurl stones at them, and at some sites they have kept it up for more than ten years. Over time the stones pile up at the foot of each favourite tree.",
            "Researchers based in the village of Béli set up a bush camp 22 kilometres into the savanna woodland and placed camera traps and sound recorders at the throwing sites, so they could watch without disturbing the chimps. The recordings caught loud pant hoots and ‘buttress drumming’, where the chimps beat their hands and feet against the tree.",
            "The behaviour has been seen in just four groups of chimpanzees in West Africa, which is why the researchers think it is passed on as a local tradition rather than something all chimps do.",
          ],
          source: "The Conversation, via ScienceDaily",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/08/260826055506.htm",
          image: {
            file: "/editions/40/chimps-throw-rocks-at-trees.jpg",
            alt: "A chimpanzee standing upright mid-throw beside a river",
            credit: "ScienceDaily",
            from: "https://www.sciencedaily.com/releases/2026/08/260826055506.htm",
          },
        },
        {
          slug: "eight-letter-dna-alphabet",
          slot: "brief",
          kicker: "Genetics",
          headline:
            "Life spells with four DNA letters, and scientists have now shown eight can work",
          dek: "The expanded alphabet is called ‘hachimoji’, Japanese for eight letters.",
          body: [
            "A team led by Professor Dong Wang at UC San Diego used cryo-electron microscopy to watch RNA polymerase, the enzyme that reads genes, working through an eight-letter genetic alphabet. It recognised the synthetic letters using many of the same signals it uses for natural ones. The work, in Nature Communications and PNAS, could lead to new diagnostics and engineered biology.",
          ],
          source: "ScienceDaily",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260904000310.htm",
          image: {
            file: "/editions/40/eight-letter-dna-alphabet.jpg",
            alt: "An illustration of a glowing blue DNA double helix",
            credit: "Shutterstock",
            from: "https://www.sciencedaily.com/releases/2026/09/260904000310.htm",
          },
        },
      ],
    },
    {
      section: "art-and-design",
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
            "Water has been thought through too. The park will treat its own water for irrigation and collect rain in a large catchment system to feed its fountains and misters, so the green stays green all year round, from one picnic season to the next.",
            "Put together, it is a rare thing: a design in which the trees, the paths, the water and even the breeze have all been drawn in on purpose. A runway, it turns out, is a very good place to put a picnic.",
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
            "Ruth Amos, the British engineer behind the Kids Invent Stuff YouTube channel, has made one of the new entries in Guinness World Records 2027 with the largest hairdryer, and it really works. She already holds records for the largest electric toothbrush and the tallest 3D-printed plastic-brick Christmas tree. Styling appointments, sadly, are not available.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/10/Guinness-World-Records-book-new-titles/8281789059748/",
          image: {
            file: "/editions/40/worlds-largest-hairdryer.jpg",
            alt: "Ruth Amos sits in a chair, hair blowing, in front of her giant purple hairdryer",
            credit: "Guinness World Records",
            from: "https://www.sustainableconstruction-now.com/article/547608/kids-invent-stuff-yorkshire-inventor-who-sent-robot-chicken-up-to-space-and-made-worlds-largest-electric-toothbrush-makes-guinness-world-record-books-again-with-giant-hairdryer",
          },
        },
      ],
    },
    {
      section: "shelf",
      stories: [
        {
          slug: "booker-shortlist-2026",
          kicker: "Prizes",
          headline: "Mary Beard and Jarvis Cocker's Booker judges pick six novels from 163 books",
          dek: "The winner will be crowned on 9 November and take home £50,000.",
          body: [
            "The shortlist for the 2026 Booker Prize is out, and it is a lively mix. The judges, chaired by the classicist and broadcaster Mary Beard and including the musician and broadcaster Jarvis Cocker, read 163 books to choose their six.",
            "Rebecca Perry's May We Feed the King follows a reluctant medieval monarch and a modern curator whose lives mysteriously intertwine, a book the judges said holds a great deal “with an admirably light touch”. Luke Kennard's Black Bag sends an out-of-work actor into an absurd experiment inspired by the 1960s, which the judges called a mix of the absurd and the moving. M. John Harrison's The End of Everything, about a collector gathering shape-shifting objects from the Channel, won praise for humour that is “subtle, surreal, and sly”.",
            "Marlon James is shortlisted for The Disappearers, in which a group of men rehearse a play and argue, in the judges' words, “in real time, over literary philosophy, politics, and the canon”. Douglas Stuart's John of John takes a young man home to his Scottish island, and the judges admired its “beautiful and sustained attention to detail”. Elizabeth Strout's The Things We Never Say, about a schoolteacher, was called “entertaining” and “accessible”.",
            "The winner will receive £50,000, and each of the other five shortlisted authors gets £2,500. The prize is announced on 9 November.",
            "That leaves six novels and six weeks or so to read them in, which sounds like a perfectly reasonable autumn plan. Put the kettle on and find a comfy chair.",
          ],
          source: "Time Out",
          sourceUrl:
            "https://www.timeout.com/usa/news/here-are-the-six-novels-on-the-2026-booker-prize-shortlist-092526",
          image: {
            file: "/editions/40/booker-shortlist-2026.jpg",
            alt: "The six shortlisted novels for the 2026 Booker Prize stacked on a wooden table",
            credit: "Yuki Sugiura for the Booker Prize Foundation",
            from: "https://lithub.com/heres-the-shortlist-for-the-2026-booker-prize/",
          },
        },
        {
          slug: "comic-book-day-records",
          slot: "feature",
          kicker: "Comics",
          headline:
            "Iron Man's very first page becomes the most valuable piece of comic art ever sold",
          dek: "For National Comic Book Day, a look back at a record-breaking summer for superhero fans.",
          body: [
            "National Comic Book Day fell on 25 September, and superheroes have had a bumper year for records. The biggest belongs to Iron Man. Don Heck's original artwork from Tales of Suspense No. 39, the March 1963 comic in which the armoured hero first appeared, sold in July for $3,875,000, a new world record for a piece of original comic art. It beat the previous best of $3,360,000.",
            "Collectors have been busy too. In June, Aleshia Wiley of Cedartown, Georgia, set a record with 1,581 Wonder Woman items, from comics and Funko Pop figurines to action figures and toys. “Wonder Woman is a beacon of hope for girls and women everywhere,” she said. And 22-year-old Megan Pierce of Bloomington, Indiana, holds a Guinness record for her 2,318 pieces of Joker memorabilia, including rollerblades, a skateboard and milk caps from 1966.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Odd_News/2026/09/25/comic-book-day-superheroes/7271790273293/",
          image: {
            file: "/editions/40/comic-book-day-records.jpg",
            alt: "Don Heck's original splash page artwork for Iron Man's first appearance in Tales of Suspense No. 39",
            credit: "Heritage Auctions",
            from: "https://www.finebooksmagazine.com/fine-books-news/iron-man-debut-breaks-comic-art-auction-record",
          },
        },
        {
          slug: "fall-books-on-screen",
          slot: "brief",
          kicker: "Adaptations",
          headline: "Colin Meloy's Wildwood leads a busy autumn of books becoming films and series",
          dek: "Laika's stop-motion version arrives on 23 October, the same day as Klara and the Sun.",
          body: [
            "Colin Meloy's Wildwood has become a stop-motion film from Laika, with Carey Mulligan, Jacob Tremblay and Peyton Elizabeth Lee among the voices. Also coming: Netflix's East of Eden with Florence Pugh on 1 October, Daisy Edgar-Jones in Sense and Sensibility on 16 October, and Jenna Ortega and Amy Adams in Klara and the Sun on the 23rd. Time to read the books first.",
          ],
          source: "UPI",
          sourceUrl:
            "https://www.upi.com/Entertainment_News/2026/09/22/fall-reading-list-2026/1141789140382/",
          image: {
            file: "/editions/40/fall-books-on-screen.jpg",
            alt: "Wildwood author Colin Meloy singing on stage",
            credit: "Max Goldberg / Wikimedia Commons",
            from: "https://commons.wikimedia.org/wiki/File:Colin_Meloy_(9_July_2016).jpg",
          },
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
          "High pressure over the kettle from 7am. Patchy inbox drizzle clears by elevenses, followed by scattered dancing at petrol stations. Visibility excellent: on a clear night you can see all the way to Kirby's new world.",
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
        text: "Very small golf club, finger-sized, left-handed. Will swap for one giant hairdryer, barely used, collection by crane only.",
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
        text: "Inflatable bun, large, for inflatable hot dog, larger. Must be good with crowds. Free lunch for everyone on completion.",
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
};
