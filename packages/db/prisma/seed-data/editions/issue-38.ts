// Issue 38, Saturday 26 September 2026. A weekend tabloid: a little slower, a little sillier.
// Stories with a sourceUrl are real, rewritten in our own words; stories marked "(sample)" are invented.
import { ladder, mini, riddle } from "../puzzles.ts";
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
      section: "discoveries",
      kicker: "Ocean",
      headline:
        "A coral reef written off as ‘probably dead’ in the 1960s turns out to be full of fish",
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
      slug: "saturn-decagon",
      section: "discoveries",
      slot: "feature",
      kicker: "Space",
      headline: "Saturn's north pole has a hexagon. Amateurs have spotted a decagon at the south",
      dek: "Astronomers had looked for a southern twin since 1990, and it seems to have only just formed.",
      body: [
        "For more than 40 years, every time astronomers have looked at Saturn's north pole, they have found the same thing: a giant six-sided jet stream, the planet's famous hexagon. Since 1990 they have searched Hubble images for a matching shape in the south, and found nothing.",
        "Now there is one, and it has ten sides. Two amateur astronomers, Trevor Barry and Jean-Paul Oger, noticed a faint wavy band around the south pole in images from 2024. By 2025 it had become a clear decagon, and Hubble data from NASA's OPAL programme confirm it back to 2023. The study, led by Agustín Sánchez-Lavega of the University of the Basque Country, is in Science Advances.",
        "“We've never seen anything quite like this in Saturn's southern hemisphere,” said Amy Simon of NASA Goddard. “The most intriguing part to me is that this seems to have just formed recently.”",
      ],
      source: "ScienceDaily (NASA Goddard)",
      sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260903064229.htm",
      image: {
        file: "/editions/38/saturn-decagon.jpg",
        alt: "Hubble images of Saturn showing a ten-sided wave around its south pole",
        credit:
          "NASA, ESA, STScI, A. Sánchez-Lavega, A. Simon, M. Wong; processing by Alyssa Pagan",
        from: "https://www.sciencedaily.com/releases/2026/09/260903064229.htm",
      },
    },
    {
      slug: "low-tide-cup-final",
      section: "sports",
      slot: "feature",
      kicker: "Football",
      headline: "Island's four-team league plays its cup final on the beach against the tide",
      dek: "Kick-off was set by the tide tables, and the last ten minutes were played ankle-deep.",
      body: [
        "The Inchmurran Islands have four football teams and no flat field big enough for a full match, so the cup final is played on Tràigh Mhòr beach at low tide. Kick-off is decided by the tide tables, and the referee carries a watch and a printed chart.",
        "This year's final, between the Harbour Rovers and the Hill Farms XI, went to extra time. The sea came in during the second half, the pitch shrank by about a third, and one corner flag had to be moved twice.",
        "The winning goal was scored by Hill Farms' left-back, Eilidh MacAulay, with the water just past her ankles. The ball floated back to her after it crossed the line, and she carried it up the beach to the trophy table.",
        "“We play the sea as well as the other team,” she said. “The sea is very hard to mark.”",
      ],
      source: "Island Sport (sample)",
    },
  ],

  inside: [
    {
      section: "screen-and-sound",
      stories: [
        {
          slug: "car-park-yodelling",
          kicker: "Music",
          headline:
            "No Alps in the city? Graz yodellers take their lessons to an underground car park",
          dek: "The concrete echoes are, their teacher says, not too dissimilar to the high mountains.",
          body: [
            "Yodelling was invented for mountains: a way of calling across a valley and hearing your voice come bouncing back. Graz, Austria's second city, has hills nearby but no handy Alpine peaks in the middle of town. So on Wednesday, a group of about 30 people went underground instead.",
            "They were led by Anna Maria Gutschi, a yodelling teacher with the Styrian Volksliedwerk, a folk-music organisation. For more than an hour, the group walked the ramps and aisles of the city's largest underground car park, yodelling at the walls.",
            "“It's not too dissimilar to the high mountains,” Gutschi said. “You have wide hallways; you have walls that reflect a lot.”",
            "It is not the first odd venue for her courses, which take up to 30 people at a time. The group has also yodelled by a canal and at a petrol station. The class draws a mix of people: Jamey Sohn, from South Korea, who is in Graz studying sustainable development; Thomas Button, a teacher originally from New York state; and local enthusiast Rudolf Schmidhofer.",
            "Button described yodelling as “like a form of meditation. Singing meditation.”",
            "Gutschi prefers to think of it as the original long-distance call. “It's a form of communication from mountain to mountain — just like that, without the need for a phone,” she said. “And it's not as boring as writing an SMS. Sounds much better, too.”",
          ],
          source: "AP",
          sourceUrl:
            "https://apnews.com/article/austria-yodeling-parking-garage-graz-e4fe9aa3b49ff9d797ca006070d52492",
          image: {
            file: "/editions/38/car-park-yodelling.jpg",
            alt: "People yodelling together in an underground car park in Graz",
            credit: "AP Photo/Denes Erdos",
            from: "https://apnews.com/article/austria-yodeling-parking-garage-graz-e4fe9aa3b49ff9d797ca006070d52492",
          },
        },
        {
          slug: "met-opera-snake",
          slot: "feature",
          kicker: "Opera",
          headline:
            "The Met auditions snakes for a Mozart opera, and a boa called Princess gets the part",
          dek: "Her understudy is a smaller brown boa named Nala.",
          body: [
            "The Metropolitan Opera's production of Così fan tutte moves Mozart's 1790 comedy to a 1950s Coney Island-style carnival, which means it needs a snake charmer, and the snake charmer needs a snake.",
            "The charmer is performance artist Zoe Ziegfeld, a former carnival performer playing the role at the Met for the third time. The snake, after auditions, is Princess: a yellow-peach ‘sun-glow’ boa constrictor chosen partly for her larger size, initially on a trial basis.",
            "“I need to know that the animal is comfortable with people and with what we are doing,” Ziegfeld said. She clearly enjoys the job. “With snakes, it's a delight to know that there are people watching who are in awe and people who are terrified.”",
          ],
          source: "Classic FM",
          sourceUrl:
            "https://www.classicfm.com/music-news/metropolitan-opera-holds-auditions-snake-mozart/",
          image: {
            file: "/editions/38/met-opera-snake.jpg",
            alt: "A cartoon of a singing snake in front of the Metropolitan Opera house in New York",
            credit: "Getty, via Classic FM",
            from: "https://www.classicfm.com/music-news/metropolitan-opera-holds-auditions-snake-mozart/",
          },
        },
        {
          slug: "lemur-opera-trick",
          kicker: "Singing",
          headline: "Singing lemurs hit high notes using a trick taught to opera singers",
          dek: "The wider the mouth, the higher the note, frame by frame.",
          body: [
            "Researchers from Warwick, Turin and Madagascar tracked the lips of 19 wild indris in 83 videos and found they use ‘formant tuning’, shaping their mouths to boost high notes. “Every time the pitch of an indri's song rose, we could see its mouth opening wider, frame by frame,” said Dr Chiara De Gregorio.",
          ],
          source: "Classic FM",
          sourceUrl: "https://www.classicfm.com/music-news/lemurs-sing-opera-trick-high-notes/",
          slot: "brief",
        },
        {
          slug: "carillon-theme-tunes",
          kicker: "Bells",
          headline: "Town's church bells play a pupil-chosen TV theme every Saturday at noon",
          dek: "This week it was a 1980s cartoon about a detective hamster.",
          body: [
            "The carillonneur of Sint-Aarde, Joris Lemmens, lets the town's primary school choose one theme tune a month for the Saturday noon slot and arranges each for 49 bells. Shoppers now stop in the market square to guess the show before the chorus. Next month's pick is being kept secret, even from him.",
          ],
          source: "Belfry Bulletin (sample)",
          slot: "brief",
        },
      ],
    },
    {
      section: "gaming",
      stories: [
        {
          slug: "battle-of-olympus-remake",
          kicker: "Remakes",
          headline: "Couple who made an NES game in 1988 find out on YouTube it's a cult classic",
          dek: "Now Reiko and Yukio Horimoto are remaking The Battle of Olympus themselves, pixel by pixel, for Steam.",
          body: [
            "In 1988, three people at a small Japanese studio called Infinity made a game. Yukio Horimoto wrote the code, Reiko Horimoto drew the art and wrote the story, and Kazuo Sawa composed the music. The Battle of Olympus, a side-scrolling adventure based on the Greek myth of Orpheus and Eurydice, came out on the Famicom and a few years later on the NES around the world. It sold modestly, and the studio moved on to decades of contract work.",
            "The game, it turns out, did not move on. Players kept finding it, recording it and posting it online, and at some point Reiko noticed.",
            "“The inspiration for this remake came from YouTube,” she said. “Even decades later, many people had posted gameplay videos, and those videos had received many views. I was truly surprised.”",
            "So the couple, who fell in love while planning the original, are making it again. They are rebuilding the code and redrawing the pixel art themselves, keeping the remake faithful to a cartridge that could show only 16 colours. It is due in early access on Steam in January.",
            "Yukio has never hidden that the original borrowed a lot from a certain elf-themed adventure series. In a 2015 interview he explained how it began: “We fell in love and wanted to make our own game together, so we talked about the game concept for a long time.”",
            "Reiko's message to the fans reads like a thank-you card. “Thank you for playing The Battle of Olympus,” she wrote. “Thank you for loving this game. Thanks to all of you, we were able to look back on our past and find the courage to remake the game.”",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/action-rpg/38-years-of-love-later-a-couple-is-remaking-their-zelda-inspired-nes-gem-and-putting-it-on-steam-after-learning-its-a-cult-classic/",
          image: {
            file: "/editions/38/battle-of-olympus-remake.jpg",
            alt: "The Battle of Olympus developer Reiko Horimoto next to a heart graphic",
            credit: "Infinity, via GamesRadar+",
            from: "https://www.gamesradar.com/games/action-rpg/38-years-of-love-later-a-couple-is-remaking-their-zelda-inspired-nes-gem-and-putting-it-on-steam-after-learning-its-a-cult-classic/",
          },
        },
        {
          slug: "myst-on-atari",
          slot: "feature",
          kicker: "Retro",
          headline: "Fan spends three years getting Myst running on a real Atari 2600 cartridge",
          dek: "The console has 128 bytes of memory, so he borrowed parts from a BurgerTime cartridge.",
          body: [
            "Myst, the 1990s puzzle adventure about wandering a mysterious island, was made for computers with CD-ROM drives. The Atari 2600, released in 1977, has 128 bytes of RAM: roughly enough to store this sentence and not much else.",
            "A pared-down ‘demake’ of Myst for the 2600 already existed as software. A demo-scene fan known as Vince wanted it running on the real console, from a real cartridge.",
            "His solution was to build a special cartridge from parts of an original BurgerTime cartridge, which carried more memory than most, using a memory-juggling scheme known as E7 bank switching. Timing problems stretched the job to roughly three years.",
            "It works, Hackaday reports: the island, on a console older than most of the people who have visited it.",
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
          slug: "niftski-four-frames",
          kicker: "Speedrunning",
          headline: "Super Mario Bros. record falls again, to within four frames of ‘perfect’",
          dek: "Niftski's 4:54.332 shaved 0.024 seconds off the old mark, and then he went to tell his mum.",
          body: [
            "The run is just four frames slower than the tool-assisted ideal, a computer-planned route no human is expected to match. It beat a record set two months earlier by Brazil's LeKukie. After celebrating loudly with his viewers, Niftski briefly left the stream to share the news with his mother.",
          ],
          source: "gameland.gg",
          sourceUrl: "https://gameland.gg/niftski-new-super-mario-bros-world-record-tas/",
          slot: "brief",
        },
        {
          slug: "black-flag-island-dog",
          kicker: "Updates",
          headline: "Pirate game update finally lets you take the stranded island dog home",
          dek: "For years you could only pet it. Now it moves into your villa.",
          body: [
            "In Assassin's Creed Black Flag Resynced, petting the dog on its lonely Caribbean island now sends it to Edward's hideout in Grand Inagua. A letter explains that another captain picked it up, and it jumped ship there to be with you. GamesRadar+ called the change simply ‘smile-inducing’.",
          ],
          source: "GamesRadar+",
          sourceUrl:
            "https://www.gamesradar.com/games/assassin-s-creed/assassins-creed-black-flag-resynced-now-lets-you-save-the-stranded-dog-as-ubisoft-fixes-the-greatest-crime-in-the-whole-game/",
          slot: "brief",
        },
      ],
    },
    {
      section: "sports",
      stories: [
        {
          slug: "last-place-rowing-trophy",
          kicker: "Rowing",
          headline:
            "Crew finishes four minutes behind everyone, celebrates like champions, wins a cup",
          dek: "Regatta judges were so charmed by the Wexby Allotment Rowing Club that they invented an award on the spot.",
          body: [
            "The Wexby Allotment Rowing Club was founded in June by eight gardeners who were tired of watching boats go past their plots on the Lark River and decided to get into one. None of them had rowed before. Their boat is borrowed. Their cox, Brenda Oyelaran, is 81 and shouts instructions through a rolled-up seed catalogue.",
            "At the Lark River regatta last Saturday, they finished the 1,000-metre novice race four minutes and eleven seconds behind the winners. The next race had to wait for them. Nobody minded: spectators on the bank had started walking alongside, cheering, and a brass band at the finish played them in.",
            "They crossed the line singing a song about marrows that one of the crew had made up on the way.",
            "“We were not trying to win,” said stroke Dev Chaudhary, who grows prize-winning leeks. “We were trying to stay in the boat and enjoy the view. We achieved both, which I think is two more goals than most crews set themselves.”",
            "The judges conferred briefly and presented them with a silver-plated cup that had been sitting unused in the clubhouse. It has now been engraved ‘Best Time Had’ and will be awarded every year to the crew that, in the judges' words, ‘looks happiest to be there’.",
            "The Allotment crew have already entered next year. They say they are aiming to finish only three minutes behind.",
          ],
          source: "Riverbank Sport (sample)",
        },
        {
          slug: "keeper-signed-ball",
          slot: "feature",
          kicker: "Football",
          headline:
            "Goalkeeper saves a last-minute penalty, and the other team all sign the ball for her",
          dek: "It was Priya Nandakumar's first match for her new club after moving to town.",
          body: [
            "Priya Nandakumar had lived in Dunmore Cross for three weeks when she played her first match for the Dunmore Belles. In the last minute of a draw with the Canal Street Swifts, the referee gave a penalty against her side.",
            "She dived left and held it. The Swifts' striker, Tara Byrne, was the first to shake her hand, and then went to find a marker pen.",
            "By full time the ball carried eleven signatures, every one of them from the opposing team, plus a small drawing of a hand.",
            "“It seemed rude not to,” said Byrne. “That was the best save I've seen all season, and it was against me.”",
          ],
          source: "Sunday League Weekly (sample)",
        },
        {
          slug: "scorebook-on-display",
          kicker: "Cricket",
          headline:
            "Twelve-year-old scorer's scorebook is so neat the county museum put it on show",
          dek: "Every ball of the season, in three colours of pencil.",
          body: [
            "Anaya Pillai keeps score for her village's cricket team in Little Wendham and has never used a rubber. The county cricket museum saw a photo of her scorebook and asked to display it for a month. She has agreed, on the condition that it is back in time for next season.",
          ],
          source: "Boundary Line (sample)",
          slot: "brief",
        },
        {
          slug: "frisbee-referee-dog",
          kicker: "Ultimate",
          headline: "Frisbee club's collie is appointed official disc-returner, with a lanyard",
          dek: "She is strictly neutral. She returns the disc to whoever is nearest.",
          body: [
            "The Ōtaki Flyers have made Mosi, a four-year-old border collie, the first non-human official in their league. Her job is to fetch discs that land out of bounds. She has returned 212 so far and wears a lanyard that says ‘STAFF’.",
          ],
          source: "Disc Digest (sample)",
          slot: "brief",
        },
      ],
    },
    {
      section: "discoveries",
      stories: [
        {
          slug: "railway-dinosaur-brazil",
          kicker: "Fossils",
          headline: "Workers building a rail terminal in Brazil dig up a 20-metre dinosaur",
          dek: "Archaeologists first thought the bones belonged to prehistoric mammals. They were off by about 120 million years.",
          body: [
            "When construction began on a new road-rail terminal in Davinópolis, in Brazil's Maranhão state, archaeologists were on hand to keep an eye out for anything old. About eight metres down, something turned up: large bones.",
            "At first, the team assumed they came from prehistoric mammals. Palaeontologist Elver Luiz Mayer, of the Federal University of the São Francisco Valley, was not convinced. “Given its depth of about eight meters, I realized that it was much older,” he said.",
            "Much older indeed. The bones belonged to a long-necked sauropod that lived about 120 million years ago and measured around 20 metres from nose to tail. It has been named Dasosaurus tocantinensis: ‘daso’ means forest, and ‘tocantinensis’ honours the nearby Tocantins River. The description is published in the Journal of Systematic Palaeontology.",
            "The skeleton includes tail vertebrae, ribs, foot bones and limb bones, among them a thigh bone 1.5 metres long. “It's the largest known dinosaur for Maranhão, which has other species, but not sauropods like this one,” Mayer said.",
            "The most surprising detail is its family tree. Its closest known relative lived in what is now Spain, and the researchers think its ancestors reached South America through North Africa between 140 and 120 million years ago, when the continents sat much closer together.",
            "The fossils are now kept in São Luís, and there may be more to come. “We believe there are more fossils from this same specimen yet to be excavated at the site,” said co-author Max Langer of the University of São Paulo.",
          ],
          source: "ScienceDaily (FAPESP)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260907201603.htm",
          image: {
            file: "/editions/38/railway-dinosaur-brazil.jpg",
            alt: "Artist's reconstruction of the long-necked sauropod Dasosaurus tocantinensis",
            credit: "Jorge Blanco",
            from: "https://www.sciencedaily.com/releases/2026/09/260907201603.htm",
          },
        },
        {
          slug: "tortoise-grand-tour",
          slot: "feature",
          kicker: "Animals",
          headline: "Sanctuary's 104-year-old tortoise finally completes a lap of the new garden",
          dek: "Barnaby took eleven days, stopped at almost every dandelion, and walked under a hand-painted banner at the finish.",
          body: [
            "When the Little Hollowmere tortoise sanctuary opened its new walled garden this month, the keepers were not sure Barnaby would bother with it. He is 104. He likes his lawn.",
            "Then one Tuesday he turned left instead of right at the gate and kept going. Keepers chalked his progress on a board by the entrance: the rosemary on day two, a long lunch under the plum tree on day five, a firm refusal to go round the pond on day eight, followed, after some thought, by going round the pond.",
            "On day eleven about forty villagers were waiting at the finish with a banner reading ‘GO ON, BARNABY’. He walked under it without looking up, accepted a strawberry and fell asleep on the warm path.",
            "“He did the whole thing at his own pace, which is the only pace he has,” said head keeper Marguerite Obi. The route will now be signposted as the Barnaby Loop. At a human pace it takes four minutes.",
          ],
          source: "Hollowmere Herald (sample)",
          photo: "tortoise",
        },
        {
          slug: "slash-snake",
          kicker: "Names",
          headline:
            "New Guinea's newest snake is named after the guitarist Slash, a lifelong reptile fan",
          dek: "The scientist behind it saw him on a reptile-magazine cover, aged twelve.",
          body: [
            "Lielaphis slashi, a harmless reddish-brown groundsnake 28 inches long, was named by the Field Museum's Sara Ruane, who remembered Slash holding his pet python on a magazine cover. Slash said he was “extremely honored and humbled”, adding: “I never would have imagined this moment would arrive.”",
          ],
          source: "ScienceDaily (Field Museum)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260918024816.htm",
          slot: "brief",
        },
        {
          slug: "bigfin-squid-elbows",
          kicker: "Deep sea",
          headline: "Rare bigfin squid filmed striking its ‘elbow pose’ three kilometres down",
          dek: "It is the first one ever seen alive in the northeastern Pacific.",
          body: [
            "MBARI's submersible was looking for corals near Davidson Seamount, off California, when a 1.25-metre squid with arms bent at right angles drifted past. Only about 70 have ever been seen. “When we saw this one, I couldn't believe my luck!” said deep-sea ecologist Olívia Soares Pereira.",
          ],
          source: "Live Science",
          sourceUrl:
            "https://www.livescience.com/animals/squids/watch-the-first-ever-footage-of-a-rare-deep-sea-squid-in-the-northeastern-pacific",
          slot: "brief",
        },
        {
          slug: "wet-spaghetti-cell",
          kicker: "Microbes",
          headline: "A single cell shrinks to a quarter of its length in under five milliseconds",
          dek: "Its secret protein clumps up ‘like a ball of wet spaghetti’.",
          body: [
            "Spirostomum ambiguum, a pond-dwelling single-celled creature, moves at around 100 body lengths a second when it contracts. NC State researchers studying how it does it said the comparison with our own muscles “is like comparing gas to electric power,” in the words of physicist Mary Elting.",
          ],
          source: "ScienceDaily (NC State)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/09/260918024812.htm",
          slot: "brief",
        },
      ],
    },
    {
      section: "tech",
      stories: [
        {
          slug: "walking-robot-hand",
          kicker: "Robots",
          headline: "Swiss engineers build a robot hand that walks about on its fingertips",
          dek: "It crosses grass, gravel and asphalt, gets itself back up, and can even press the arrow keys to play a puzzle game.",
          body: [
            "Anyone who has watched The Addams Family will recognise the idea immediately: a hand, on its own, scuttling across the floor on its fingers. At ETH Zurich's Soft Robotics Lab, researchers Amirhossein Kazemipour, Hehui Zheng and Robert K. Katzschmann have built a real one.",
            "They started with a commercial five-fingered robot hand with 20 moving joints, then gave it everything it needs to go out alone: a battery, sensors and a small onboard computer, strapped to the back of the hand. The whole thing weighs 818 grams.",
            "The hand learned to walk in a computer simulation, practising over and over through trial and error before being let loose on the real world. Then the team took it on a tour of 14 surfaces, indoors and out: carpet, tile, metal grating, asphalt, grass, gravel and weathered stone among them. It trotted along at an average of about 9 centimetres a second.",
            "Falling over is part of walking, so the team also taught it to get back up. In 25 trials, it righted itself 21 times.",
            "Then came the party trick. Balancing on some of its fingers, the hand used the others to press a keyboard's arrow keys, getting the right key 29 times out of 32, and played moves in Sokoban, the classic game about pushing boxes around a warehouse.",
            "It is, the researchers point out, a way of testing how capable a hand can be when it does not need an arm. It is also, unavoidably, the most Halloween thing to come out of a laboratory this year.",
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
          slug: "slugsat-deployed",
          slot: "feature",
          kicker: "Space",
          headline:
            "UC Santa Cruz's first student-built satellite is released from the space station",
          dek: "SlugSat was built in a campus makerspace, and its team leader calls launch day ‘maybe the best day of my life’.",
          body: [
            "A team of ten students at the University of California, Santa Cruz spent from June 2024 to December 2025 building a small satellite in Slugworks, the university's student makerspace. It was shaken on a vibration table at NASA's Johnson Space Center, launched on a supply mission to the International Space Station on 11 April and, on 2 July, released into orbit.",
            "SlugSat is the university's first student-built satellite in space, made through NASA's CubeSat Launch Initiative on an open-source platform from Cal Poly Pomona.",
            "“It was maybe the best day of my life,” said team lead David Uniack, who has just graduated in robotics engineering. “For me, it was a feeling of relief.”",
          ],
          source: "Santa Cruz Works",
          sourceUrl:
            "https://www.santacruzworks.org/news/first-ucsc-student-built-satellite-deployed-from-the-iss",
          image: {
            file: "/editions/38/slugsat-deployed.jpg",
            alt: "The SlugSat satellite on a visit to NASA's Jet Propulsion Laboratory",
            credit: "Santa Cruz Works / SlugSat",
            from: "https://www.santacruzworks.org/news/first-ucsc-student-built-satellite-deployed-from-the-iss",
          },
        },
        {
          slug: "perseverance-marathon",
          kicker: "Mars",
          headline:
            "Perseverance rover finishes a marathon on Mars in half the time of its predecessor",
          dek: "Five years and four months for 42.195 kilometres. Opportunity took eleven.",
          body: [
            "NASA's rover passed marathon distance on its 1,890th Martian day, west of Jezero Crater in an area nicknamed ‘Arbot’. A day earlier, the HiRISE camera on the Mars Reconnaissance Orbiter photographed it from above, as a tiny green speck at the end of its own long trail of tracks.",
          ],
          source: "ScienceDaily (NASA)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/07/260713084858.htm",
          slot: "brief",
        },
        {
          slug: "doomscroll-pet",
          kicker: "Gadgets",
          headline: "A pocket pet that gets upset when you doomscroll, and tells you jokes instead",
          dek: "It reads your notifications out loud so you don't have to pick up the phone.",
          body: [
            "Maker brenpoly's virtual pet lives in a 3D-printed case with a small ESP32 chip. It watches your screen time and looks visibly distressed after too much scrolling. It can also summarise notifications and tell jokes out loud, using speech models running locally. Giving it a voice, Hackaday notes, makes it more persuasive.",
          ],
          source: "Hackaday",
          sourceUrl:
            "https://hackaday.com/2026/09/08/anti-doomscroll-tamagotchi-only-lives-if-you-do/",
          slot: "brief",
        },
      ],
    },
    {
      section: "money",
      stories: [
        {
          slug: "compliments-as-payment",
          kicker: "Small business",
          headline: "Bakery accepts compliments as payment for one day, and takes 3,112 of them",
          dek: "The most common was about the cinnamon buns. The best was about the baker's hat.",
          body: [
            "To mark ten years in business, Ottilie Marchetti's bakery in Pellinghurst ran a single, unusual offer: for one Saturday, every customer could pay for one item with a sincere compliment instead of money.",
            "The rules were simple. The compliment had to be true, it had to be specific, and it had to be said out loud to whoever was at the till. Staff wrote each one on a paper bag and pegged it to a line across the window.",
            "By closing time there were 3,112 bags. The cinnamon buns were the most complimented item by some distance. The bread was praised for its ‘confident crust’. One regular said the shop smelled ‘exactly like Saturday’. A small boy told the baker that her hat was ‘the best hat in the world, including the Queen's’, after which she wore it for the rest of the day at a noticeably jauntier angle.",
            "“We gave away about two thousand pastries,” Ms Marchetti said. “It was the most profitable day I have ever had, in every way except money.”",
            "The bags are still in the window. Customers now stop to read them on the way in, and several have started leaving new compliments on the counter, unprompted, even when paying with cash.",
            "She has promised to run the offer again at twenty years. The boy has already told her he is working on a new one.",
          ],
          source: "High Street News (sample)",
          photo: ["picnic", 1],
        },
        {
          slug: "lost-property-sofa",
          slot: "feature",
          kicker: "Auctions",
          headline:
            "Station's lost-property auction raises enough to buy the lost-property office a sofa",
          dek: "The most fought-over lot was a single, very good umbrella.",
          body: [
            "Every two years, Hallam Junction station auctions off everything that has gone unclaimed for more than six months. This year's sale had 412 lots, including 96 umbrellas, a trombone, a box of 40 left-hand gloves and a garden gnome that had travelled, by the staff's estimate, about 3,000 miles on the 8.14.",
            "The whole lot raised £2,340. The staff put it towards a sofa for the lost-property office, where people sometimes wait a long time to describe exactly which umbrella is theirs.",
            "The umbrella that sparked a bidding war was a large, black, wooden-handled one, which went for £48 to a man who said he had been looking for one like it for thirty years. The gnome was bought by the train driver. It now rides in his cab.",
          ],
          source: "Platform Weekly (sample)",
        },
        {
          slug: "karaoke-savings-club",
          kicker: "Savings",
          headline: "Neighbourhood savings club reaches its five-year goal: a karaoke machine",
          dek: "Forty households put aside a few coins every week.",
          body: [
            "The Barangay San Isidro savings club in Mabini had one target written on the front of its ledger: a proper karaoke machine for the community hall. Last Saturday they carried it in. The first song was chosen by the club's treasurer, who has kept the ledger since day one and said she had ‘earned the microphone’.",
          ],
          source: "Community Purse (sample)",
          slot: "brief",
        },
        {
          slug: "books-by-the-kilo",
          kicker: "Bargains",
          headline: "Secondhand bookshop sells everything by weight, and poetry is a steal",
          dek: "A four-kilo atlas went for the price of two coffees.",
          body: [
            "At Folio & Pound in Harrowmere, books are weighed on an old grocer's scale and priced at £3 a kilo, whatever they are. Slim poetry collections work out at about 40p. The owner says the busiest shelf is ‘large, heavy cookbooks bought by people who will never lift them again’.",
          ],
          source: "High Street News (sample)",
          slot: "brief",
        },
      ],
    },
    {
      section: "internet-and-culture",
      stories: [
        {
          slug: "balsa-new-york",
          kicker: "Models",
          headline:
            "Truck driver's balsa-wood New York, 800,000 buildings strong, gets a museum show",
          dek: "Joe Macken spent over twenty years on it. Then his daughter made him put it on TikTok.",
          body: [
            "Joe Macken has no background in model-making, unless you count, as he does, Legos and Lincoln Logs. Over more than two decades, he built the whole of New York City out of balsa wood and foam board anyway.",
            "The model contains more than 800,000 structures spread across more than 300 foam boards. It is 15 metres long and nearly 9 metres wide, at a scale where an inch stands for about 160 feet. He started with 30 Rockefeller Plaza. The trickiest part, he says, was the spire of the Empire State Building.",
            "Then his daughter persuaded him to post a video on TikTok, and it passed ten million views in a week.",
            "Now the city has come to see itself. The model is on display at the Museum of the City of New York in an exhibition called ‘He Built This City’, running until 12 October.",
            "“I think people always want to get their arms around this whole city,” said the museum's chief curator, Elisabeth Sherman. “This is a way to see it from a bird's-eye view.”",
            "Macken is not finished; he plans to add more than 50 new buildings. He admits he never really set out to complete it. “I never really thought about finishing it because I had so much fun building it,” he said. His one regret is timing. “I wish I would have done it 20 years earlier, knowing that I would have enjoyed it so much.”",
          ],
          source: "AP",
          sourceUrl:
            "https://apnews.com/article/viral-nyc-balsa-wood-map-model-exhibit-7e05bdf80bfb09a227e32f91d72bda19",
        },
        {
          slug: "jumble-sale-livestream",
          slot: "feature",
          kicker: "Streaming",
          headline: "A village jumble sale livestreams itself, and 80,000 strangers start bidding",
          dek: "The star lot was a lampshade with tassels, described live as ‘extremely 1974’.",
          body: [
            "The Church Hall Jumble in Pennock St Mary usually raises about £400 for the village hall roof. This year a teenager, Callum Reyes, pointed his phone at the tables and started describing the items in the hushed voice of a nature documentary.",
            "Within two hours, 80,000 people were watching and bidding in the comments. Volunteers ran between the trestle tables and a laptop, shouting out prices, while Callum narrated the progress of a toast rack ‘in its natural habitat’.",
            "The tasselled lampshade sold for £61 to a viewer in Ontario, who is paying the postage. A tin of assorted buttons went for £28. The sale raised £3,900. The roof is fixed, and Callum has been asked back next year as ‘head of broadcasting’.",
          ],
          source: "Around the Web (sample)",
        },
        {
          slug: "shop-window-accidents",
          kicker: "Photos",
          headline: "Forum collects shop windows that look perfect entirely by accident",
          dek: "Top post: a hardware shop whose buckets are stacked by colour like a rainbow.",
          body: [
            "The Accidental Window forum has 60,000 posts from people who spotted a display that looks deliberately beautiful but almost certainly isn't. The owner of the rainbow hardware shop in Tarnów was tracked down and asked about it. He said he had just ‘put the buckets where they fitted’.",
          ],
          source: "Around the Web (sample)",
          slot: "brief",
        },
        {
          slug: "roundabout-wiki",
          kicker: "Wikis",
          headline: "Someone has written a 12,000-word fan wiki about one roundabout",
          dek: "It includes a history, a flower-bed timeline and a ‘notable swans’ section.",
          body: [
            "The wiki covers the Cold Ashby roundabout from its opening in 1971 to the present day, with a page for each of its four exits. Its anonymous author says the next update will cover ‘the great tulip controversy of 2003’. Readers are hoping it is not a controversy at all.",
          ],
          source: "Around the Web (sample)",
          slot: "brief",
        },
      ],
    },
    {
      section: "on-this-day",
      stories: [
        {
          slug: "abbey-road-released",
          kicker: "57 years ago today",
          headline: "On this day in 1969: Abbey Road came out, with no name on the cover",
          dek: "Six photos, one zebra crossing, a borrowed Beetle and a barefoot Paul.",
          body: [
            "On 26 September 1969, Apple Records released Abbey Road in the UK. It was the last album the Beatles recorded, and its cover would become one of the most copied photographs in pop.",
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
          headline:
            "On this day in 1996: Shannon Lucid lands after 188 days in space and gets her sweets",
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
          slot: "brief",
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

  puzzles: [
    mini(
      [
        ["CAMPS", "Summer holidays with tents and too many marshmallows"],
        ["OCEAN", "Where a reef off Benin has been quietly thriving"],
        ["DRUMS", "The loud end of the band"],
      ],
      [
        ["CHORD", "Three notes that get along"],
        ["SONGS", "What a choir does all day"],
      ],
    ),
    ladder(["CAT", "COT", "COG", "DOG"]),
    riddle("What has hands but can't clap?", "A clock"),
  ],
};
