// Issue 45, Saturday 3 October 2026. Scheduled. A weekend zine: relaxed and featurey.
// A Saturday "Big Weekend" edition. Every story is real, rewritten in our own words from the linked
// article; the Week in 10 retells the best stories of issues 40-44.
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
      section: "sports-weekend",
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
      slug: "dadar-beach-students",
      section: "india-desk",
      slot: "feature",
      kicker: "Mumbai",
      headline:
        "After Ganpati Visarjan, more than 150 students stay on to tidy Mumbai's Dadar beach",
      dek: "K.P.B. Hinduja College has been cleaning this shoreline for more than 25 years.",
      body: [
        "When the Ganpati Visarjan celebrations ended at Dadar Chowpatty in Mumbai, more than 150 students from K.P.B. Hinduja College of Commerce rolled up their sleeves, pulled on gloves and got to work, gathering the flowers, plastic, cloth and decorations left on the sand.",
        "The college has been doing this for more than 25 years, and its National Service Scheme unit runs three or four beach-cleaning drives a year with the University of Mumbai, the city corporation, the state of Maharashtra and the Coast Guard.",
        "“You can talk about the environment all day, but nothing hits like picking up that waste yourself,” said Ritika Kanojiya, a second-year student. First-year volunteer Prajakta Kulkarni agreed that a clean shore belongs to everyone, not only to the city's cleaning workers. The beach looked all the better for it.",
      ],
      source: "The Better India",
      sourceUrl:
        "https://thebetterindia.com/changemakers/ganpati-beach-cleanup-dadar-chowpatty-hinduja-college-students-mumbai-india-12590553",
      image: {
        file: "/editions/45/dadar-beach-students.jpg",
        alt: "College students in white T-shirts and blue gloves filling green sacks on Dadar beach, with the Mumbai sea link behind",
        credit: "The Better India",
        from: "https://thebetterindia.com/changemakers/ganpati-beach-cleanup-dadar-chowpatty-hinduja-college-students-mumbai-india-12590553",
      },
    },
    {
      slug: "gorilla-maze",
      section: "postcards",
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
      more: [
        {
          file: "/editions/45/gorilla-maze-2.jpg",
          alt: "From the air, the maze field at Wistow with its mountain gorilla cut into the maize",
          credit: "Tom Maddick / SWNS",
          from: "https://www.goodnewsnetwork.org/giant-gorilla-maze-celebrates-sir-david-attenboroughs-100th-birthday/",
        },
      ],
    },
  ],

  inside: [
    {
      section: "week-in-10",
      stories: [
        {
          slug: "wk-mozart-notebook-found-in-paris",
          kicker: "Monday · Music",
          headline: "A retiring librarian in Paris finds a notebook Mozart wrote at 22",
          dek: "Forty-four pages of harp lessons, recognised by their rounded, forward-leaning treble clefs.",
          body: [
            "Before leaving France's National Library, François-Pierre Goy worked through one last pile of neglected papers and found a 44-page notebook in Mozart's hand. It dates from 1778, when the 22-year-old composer was teaching the harp in Paris to the Duke of Guines's daughter, and holds her daily exercises plus seven flute-and-harp pieces. The Mozarteum Foundation in Salzburg confirmed it in April. “I never imagined what I was about to find,” said Goy.",
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
          slug: "wk-athens-airport-becomes-park",
          kicker: "Monday · Places",
          headline: "Athens is turning its old seaside airport into one of Europe's biggest parks",
          dek: "Thirty thousand trees, three million plants and runways built for picnics.",
          body: [
            "The runways of Ellinikon, Athens's old airport by the sea, are becoming Ellinikon Park: more than 400 acres of green, and the second-largest city park in Europe. The plan calls for 30,000 trees and three million smaller plants from over 520 species. Planners used air-flow simulations to place every path and plant, aiming for a park about 4°C cooler than the streets around it, with misters and fountains fed by collected rain.",
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
          slug: "wk-teacher-finds-t-rex-trackway",
          kicker: "Tuesday · Discoveries",
          headline:
            "A science teacher on a volunteer dig finds the first trail left by an adult T. rex",
          dek: "Four metre-long footprints show a Tyrannosaurus out for a brisk walk.",
          body: [
            "Kent Hups, who teaches science at a Colorado high school, spotted the trackway in North Dakota's Hell Creek Formation: four three-toed prints, each about three feet long, laid down some 66.5 million years ago. Single T. rex prints are known, but never a sequence. From the stride, researchers reckon it was walking at 3.5 to 4.5 miles an hour. “It's the closest you get to a time machine,” said Hups.",
          ],
          source: "Good News Network",
          sourceUrl:
            "https://www.goodnewsnetwork.org/massive-footprints-reveal-first-ever-adult-t-rex-trackway/",
          image: {
            file: "/editions/41/teacher-finds-t-rex-trackway.jpg",
            alt: "Kent Hups and fellow researchers kneeling beside giant T. rex footprints in the rock",
            credit: "Tyler Lyson / Denver Museum of Nature & Science",
            from: "https://www.goodnewsnetwork.org/massive-footprints-reveal-first-ever-adult-t-rex-trackway/",
          },
        },
        {
          slug: "wk-oulu-haparanda-trains-return",
          kicker: "Tuesday · Tech",
          headline:
            "Passenger trains cross the border between Finland and Sweden again after 30 years",
          dek: "A twice-daily service links Oulu with Haparanda, where a split bridge handles two gauges.",
          body: [
            "For the first time in three decades, you can take a train from Finland to Sweden. The new service runs twice a day from Oulu to the border town of Haparanda, where a divided bridge lets trains of both countries' track gauges arrive and depart, and regional trains carry on towards Luleå. “We are creating new opportunities for people to travel, work, study and visit one another across the border,” said Joakim Berg of the operator Norrtåg.",
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
          slug: "wk-goblin-shark-filmed-at-home",
          kicker: "Wednesday · Discoveries",
          headline:
            "The goblin shark, the deep sea's oddest face, is finally filmed going about its day",
          dek: "One clip sat unnoticed in a video archive for six years.",
          body: [
            "Every living goblin shark seen before had come up by accident on a fishing line. Now scientists have described two swimming freely in the central Pacific: one filmed in 2019 by the robot submersible Hercules, spotted in the archive only in 2025, and one that glided past a baited camera in the Tonga Trench at 1,997 metres, a depth record. “A unique honor,” said the lead author, Aaron Judah.",
          ],
          source: "ScienceDaily (University of Hawaiʻi at Mānoa)",
          sourceUrl: "https://www.sciencedaily.com/releases/2026/07/260708022208.htm",
          image: {
            file: "/editions/42/goblin-shark-filmed-alive-deep-pacific.jpg",
            alt: "A pale goblin shark with its long flat snout swims low over a pebbly seabed",
            credit: "Minderoo-UWA Deep-Sea Research Centre and Inkfish",
            from: "https://gizmodo.com/watch-a-rare-goblin-shark-filmed-alive-in-its-natural-habitat-for-the-first-time-2000771259",
          },
        },
        {
          slug: "wk-u2-bewleys-balcony-50th",
          kicker: "Wednesday · Music",
          headline:
            "U2 celebrate fifty years by playing their old school, then a Dublin café balcony",
          dek: "Thousands on Grafton Street sang Happy Birthday back at them.",
          body: [
            "Fifty years after Larry Mullen pinned a note to a school noticeboard looking for bandmates, U2 went back to Mount Temple Comprehensive, where they last played in 1978. “We escaped from the lab,” Bono told the pupils. That evening they played from the balcony of Bewley's on Grafton Street, opening with I Will Follow. “The buskers have really upped their game,” said Bono.",
          ],
          source: "The Irish Times",
          sourceUrl:
            "https://www.irishtimes.com/culture/music/2026/09/25/u2-play-special-gigs-at-mount-temple-comprehensive-and-grafton-street-to-mark-50th-anniversary/",
          image: {
            file: "/editions/42/u2-bewleys-balcony-50th.jpg",
            alt: "The Edge and Bono laughing together as they lean on the balcony rail at Bewley's on Grafton Street",
            credit: "Rich Fury/U2/LHP/PA Wire via The Irish Times",
            from: "https://www.irishtimes.com/culture/music/2026/09/25/u2-fans-gather-in-dublin-city-centre-for-surprise-appearance-by-the-band/",
          },
        },
        {
          slug: "wk-nigella-joins-bake-off-tent",
          kicker: "Thursday · Screen",
          headline:
            "Nigella Lawson takes her seat in the Bake Off tent, and the critics are smitten",
          dek: "She admitted to nerves before her first episode. Nobody could tell.",
          body: [
            "The Great British Bake Off's 17th series opened with a new judge beside Paul Hollywood: Nigella Lawson, who called joining the show “a huge honour”. Cake Week brought a chocolate stout cake, a coffee and walnut technical and self-portrait showstoppers, and Mo, a 21-year-old law student, took Star Baker. The Times called Lawson the “icing on the cake”. The tent is open every Tuesday at 8pm.",
          ],
          source: "HuffPost UK",
          sourceUrl:
            "https://www.huffingtonpost.co.uk/entry/great-british-bake-off-nigella-lawson-reviews_uk_6ab391e2e4b085277b54b9bb",
          image: {
            file: "/editions/43/nigella-joins-bake-off-tent.jpg",
            alt: "Nigella Lawson smiling and holding a chocolate cake topped with raspberries",
            credit: "Patch Dolan/Channel 4",
            from: "https://www.huffingtonpost.co.uk/entry/great-british-bake-off-nigella-lawson-reviews_uk_6ab391e2e4b085277b54b9bb",
          },
        },
        {
          slug: "wk-van-ar-chy-found-in-sendai",
          kicker: "Thursday · Screen",
          headline: "A lost 1919 comedy from New Hampshire turns up in a Japanese antique shop",
          dek: "A film student in Sendai bought the reels while researching the word ‘anarchy’.",
          body: [
            "Kohei Okita, a student in Sendai, bought some old film reels and found a comedy starring someone he did not recognise. An archivist, John Tariot, identified it as Van-ar-chy, shot around Lake Sunapee by the vaudeville entertainer Billy B Van. The film goes home for a screening at the Newport Opera House on 1 November. “We're seeing the world in which he made them,” said Tariot.",
          ],
          source: "The Guardian",
          sourceUrl:
            "https://www.theguardian.com/film/2026/sep/28/century-old-silent-comedy-new-hampshire-found-japan",
          image: {
            file: "/editions/43/van-ar-chy-found-in-sendai.jpg",
            alt: "Black-and-white still from the 1919 silent comedy Van-ar-chy, with a young man in a bow tie between two bearded men",
            credit: "Film Video Digital via YouTube / The Guardian",
            from: "https://www.theguardian.com/film/2026/sep/28/century-old-silent-comedy-new-hampshire-found-japan",
          },
        },
        {
          slug: "wk-tilcayo-tiger-cat",
          kicker: "Friday · Discoveries",
          headline:
            "The first new wild cat species in a century turns out to be smaller than a house cat",
          dek: "Meet the tilcayo, a spotted cat from Bolivia that weighs about as much as a pineapple.",
          body: [
            "For the first time since 1923 the cat family has a new member: Leopardus tilcayo, from Bolivia's misty Yungas forests, at about 1.4 kilos. The species was described in Current Biology by a team led by Paola Nogales-Ascarrunz, whose star specimen is Tigrino, a small male living at the Senda Verde refuge. “He really is tiny,” she said. Local people have called the cat the tilcayo for generations.",
          ],
          source: "PBS News",
          sourceUrl:
            "https://www.pbs.org/newshour/science/meet-earths-newest-wild-cat-species-living-in-bolivia-and-the-first-named-in-over-a-century",
          image: {
            file: "/editions/44/tilcayo-tiger-cat.jpg",
            alt: "A small spotted wild cat, the tilcayo, looking at the camera",
            credit: "Reuters",
            from: "https://www.pbs.org/newshour/science/meet-earths-newest-wild-cat-species-living-in-bolivia-and-the-first-named-in-over-a-century",
          },
        },
        {
          slug: "wk-asteroid-alyankovic",
          kicker: "Friday · Space",
          headline:
            "An asteroid between Mars and Jupiter is now officially named after ‘Weird Al’ Yankovic",
          dek: "He called it perhaps the greatest honour he has ever received.",
          body: [
            "The rock known since 1981 as 1981 EC26, about two kilometres across, is now (14331) Alyankovic, approved by the International Astronomical Union. The campaign was led by the Arizona State University planetary scientists Allison McGraw and Steve Desch, and the citation credits his comic songs, including ‘White and Nerdy’, with inspiring generations of scientists. “This is perhaps the greatest honor I've ever received,” said Yankovic.",
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
      ],
    },
    {
      section: "weekend-guide",
      stories: [
        {
          slug: "rubber-soul-special-edition",
          kicker: "Listen",
          headline:
            "The Beatles' Rubber Soul comes back remixed, with a Lennon song nobody knew existed",
          dek: "Out on Friday: new stereo and Dolby Atmos mixes, 20 unreleased takes and a mystery called Little Girl.",
          body: [
            "If your weekend needs a soundtrack, the Beatles have one ready. Rubber Soul arrived in shops on Friday 2 October in a new Special Edition, and it is the sort of reissue that rewards a comfy chair and a good pair of headphones.",
            "The album has been freshly mixed by the producer Giles Martin and the engineer Sam Okell, who used de-mixing technology from WingNut Films to pull the original recordings apart and put them back together more clearly. There are new stereo and Dolby Atmos mixes, and for purists the original mono mix and the Capitol US version of the album are included too.",
            "The biggest boxes turn the original 14 songs into a much longer listen. The Super Deluxe editions add 24 extra recordings, among them 20 takes that have never been released and three home demos. One of those is the real treat: Little Girl, which the Beatles' own announcement describes as a John Lennon song outline “never before released or even rumoured”.",
            "There is more to hold, too. The box sets come with an 88-page hardback book featuring a new introduction by Paul McCartney, a foreword pieced together from Lennon's own words over the decades, rare photographs and notes on every track. The double A-side single of the time, Day Tripper and We Can Work It Out, is in there as well, along with the promotional films made for both.",
            "The formats run from a single CD or LP all the way up to a four-CD set and a five-LP box, plus a Blu-ray for the Atmos mix, a limited orange vinyl and a zoetrope vinyl edition.",
            "Put the kettle on, press play and see if you can hear the difference. Rubber Soul still sounds like a very good Saturday.",
          ],
          source: "The Beatles",
          sourceUrl: "https://www.thebeatles.com/rubber-soul-new-special-edition-out-2nd-october",
          image: {
            file: "/editions/45/rubber-soul-special-edition.jpg",
            alt: "The Rubber Soul Special Edition box set laid out with its CDs and open hardback book of photographs",
            credit: "Apple Corps via The Beatles Bible",
            from: "https://www.beatlesbible.com/2026/07/29/beatles-announce-rubber-soul-expanded-reissues/",
          },
        },
        {
          slug: "japan-matsuri-trafalgar",
          kicker: "Go",
          headline:
            "Japan Matsuri fills Trafalgar Square with performers, martial arts and food stalls on Sunday",
          dek: "It is free, it runs from ten until eight, and the food stalls surround the fountains.",
          body: [
            "The UK's biggest yearly festival of Japanese culture and food returns to Trafalgar Square on Sunday 4 October, from 10am to 8pm, and it is free to get in.",
            "Japan Matsuri has been running since 2009 and has made its home in Trafalgar Square since 2012. This year's programme has Matsuri performers on the main stage and martial arts demonstrations, along with stalls and an information centre. The food stalls sit in the middle of the square, either side of the famous fountains, with a mix of old favourites and new vendors.",
            "It is organised by the Japan Society, the Japan Association UK, the Japanese Chamber of Commerce and Industry UK and the Nippon Club UK. A few house rules: leave big bags, bikes and scooters at home, and once the square is full a one in, one out policy applies. Come early, and come hungry.",
          ],
          source: "Japan Matsuri",
          sourceUrl: "https://japanmatsuri.com/",
          image: {
            file: "/editions/45/japan-matsuri-trafalgar.jpg",
            alt: "A smiling woman in a Japan Matsuri T-shirt shades her eyes in Trafalgar Square",
            credit: "Garry Knight / Wikimedia Commons (CC BY 2.0)",
            from: "https://commons.wikimedia.org/wiki/File:Japan_Matsuri_2012_-_28_(8124452823).jpg",
          },
        },
        {
          slug: "ranma-season-three",
          kicker: "Stream",
          headline:
            "Ranma 1/2 returns for a third season on Saturday, with even more wild characters",
          dek: "MAPPA's remake returns with new characters and new voices.",
          body: [
            "Saturday brings the third season of MAPPA's Ranma 1/2, which debuts on Netflix around the world on 3 October, the same day as its premiere in Japan. Konosuke Uda is directing again, and the new season promises “even more wild characters” and more romantic comedy shenanigans. Joining the cast are Masako Nozawa as the Grand Master, Jun Fukuyama and Minami Tanaka. The opening theme, Sunao Miman, is sung by Fumino.",
          ],
          source: "ComicBook.com",
          sourceUrl:
            "https://comicbook.com/anime/news/mappas-ranma-1-2-season-3-sets-netflix-release-date-with-new-trailer-watch/",
          image: {
            file: "/editions/45/ranma-season-three.jpg",
            alt: "Key art for Ranma 1/2 season 3, with its characters leaping into action",
            credit:
              "Rumiko Takahashi, Shogakukan / Ranma 1/2 Production Committee via ComicBook.com",
            from: "https://comicbook.com/anime/news/mappas-ranma-1-2-season-3-sets-netflix-release-date-with-new-trailer-watch/",
          },
        },
      ],
    },
    {
      section: "sports-weekend",
      stories: [
        {
          slug: "ufc-332-silva-wang",
          kicker: "UFC",
          headline:
            "Natália Silva and Wang Cong meet for the flyweight title as the UFC makes its CBS debut",
          dek: "Saturday's UFC 332 in Salt Lake City is the first numbered UFC main card to air on CBS.",
          body: [
            "The UFC is heading to Salt Lake City this Saturday, 3 October, and it is bringing a little history with it. UFC 332, at the Delta Center, is the first UFC event whose complete main card goes out on CBS, with Paramount+ streaming it too. The main card begins at 8pm Eastern time.",
            "At the top of the bill is a fight for the women's flyweight championship. Natália Silva, a 29-year-old Brazilian, arrives on a 14-fight winning streak and is a perfect eight from eight since her UFC debut in 2022. She is a high-volume striker, which is a polite way of saying she rarely stops throwing things.",
            "Across the Octagon is Wang Cong, 34, from China, a technical counterpuncher with a famous line on her record: back in 2015, in kickboxing, she beat Valentina Shevchenko, who holds the UFC women's record of nine title defences. One of them will leave Utah wearing the belt.",
            "The co-main event pairs Payton Talbott, 28, of Las Vegas, who is 5-1 since his 2023 debut and beat Henry Cejudo on points in December, with the former two-time flyweight champion Deiveson Figueiredo at bantamweight. Further down the card, 40-year-old King Green makes his 32nd walk to the Octagon on a run of four straight finishes, and the Croatian striker Roberto Soldić, 31, makes his UFC welterweight debut after winning titles in two divisions in KSW.",
            "Keep an eye, too, on the 24-year-olds: Ateba Gautier, the 6ft 4in ‘Silent Assassin’ from Cameroon, and Damian Pinas, known as ‘Baby Yaga’, from Aruba. Between them they have 18 knockout wins.",
          ],
          source: "CBS Sports",
          sourceUrl:
            "https://www.cbssports.com/ufc/news/ufc-332-fight-card-natalia-silva-vs-wang-cong-storylines/",
          image: {
            file: "/editions/45/ufc-332-silva-wang.jpg",
            alt: "Natália Silva and Wang Cong, side by side, each celebrating a win in the Octagon",
            credit: "UFC",
            from: "https://www.ufc.com/news/fight-fight-preview-ufc-332-silva-vs-wang-salt-lake-city",
          },
        },
        {
          slug: "asian-games-final-weekend",
          kicker: "Asian Games",
          headline:
            "The Asian Games in Aichi-Nagoya reach their final weekend, with a closing party on Sunday",
          dek: "After 469 medal events in 43 sports, the Games wrap up on 4 October.",
          body: [
            "The 2026 Asian Games in Aichi-Nagoya are nearly done. They opened at the Paloma Mizuho Stadium on 19 September, with some events getting under way as early as the 10th, and they finish with the closing ceremony on Sunday 4 October.",
            "It has been a Games of new things. Freestyle BMX, MMA, padel, surfing, teqball and virtual taekwondo all joined the programme, spread across 54 venues in the region, with 469 sets of medals to be won in 43 sports.",
            "There is still some sport left before the final bow: the archery medal matches wrap up this weekend. India alone sent 499 athletes to compete in at least 37 sports, with 79 of them in athletics, the country's biggest group. Then it is time for the closing party, and for everyone to start dreaming about the next one.",
          ],
          source: "ESPN",
          sourceUrl:
            "https://www.espn.com/espn/story/_/id/49963172/asian-games-all-need-know-schedule-fixtures-medals-timings-aichi-nagoya-2026",
          image: {
            file: "/editions/45/asian-games-final-weekend.jpg",
            alt: "The red-and-white mascot of the 2026 Asian Games waving on a sunny plaza in Nagoya",
            credit: "eli fessler / Wikimedia Commons (CC BY-SA 4.0)",
            from: "https://commons.wikimedia.org/wiki/File:2026_Asian_Games_mascot_Honohon.jpg",
          },
        },
        {
          slug: "nfl-london-colts-commanders",
          kicker: "NFL in London",
          headline:
            "The NFL's London season kicks off on Sunday with the Colts meeting the Commanders",
          dek: "Tottenham Hotspur Stadium hosts the game, with Jason Kelce in the commentary box.",
          body: [
            "American football is back in north London. On Sunday 4 October the Washington Commanders take on the Indianapolis Colts at Tottenham Hotspur Stadium, kicking off at 9.30am Eastern time. NFL Network has the game, with Dave Pasch, Kurt Warner and the former centre Jason Kelce calling the action and Molly McGrath on the sideline. The two sides have met 32 times before, and Washington last played overseas in 2017.",
          ],
          source: "Washington Commanders",
          sourceUrl: "https://www.commanders.com/news/commanders-colts-preview-2026-week-4",
          image: {
            file: "/editions/45/nfl-london-colts-commanders.jpg",
            alt: "An NFL game under way on the pitch inside a packed Tottenham Hotspur Stadium",
            credit: "Tottenham Hotspur Stadium",
            from: "https://www.tottenhamhotspurstadium.com/events/1069172/nfl-2026",
          },
        },
      ],
    },
    {
      section: "deep-dive",
      stories: [
        {
          slug: "jurassic-grasshopper-songs",
          kicker: "Ancient sounds",
          headline:
            "What did the Jurassic sound like? Scientists have rebuilt its insect songs from fossil wings",
          dek: "Nine species of cricket relatives, 165 million years old, sing again, and one of them sang too high for us to hear.",
          readMinutes: 5,
          body: [
            "Picture a warm evening in the Middle Jurassic, about 165 million years ago, in what is now Inner Mongolia. The dinosaurs are there, of course, but close your eyes and listen. The air is full of song: low, pure chirps, higher whirring notes, and one voice you cannot hear at all.",
            "For the first time, scientists have been able to recreate that soundscape. A team led by Thorin Jonsson of the University of Graz in Austria, working with colleagues at the universities of Lincoln and Bristol in the UK, in Beijing and in Tempe, Arizona, has rebuilt the mating calls of nine insect species from the Jurassic. Their paper, published in PNAS with Jun-Jie Gu of Sichuan Agricultural University as lead author, describes what are the oldest sounds anyone has ever reproduced.",
            "“What we're hearing just now were basically the sounds we recreated of bush crickets or katydids that lived 165 million years ago,” Jonsson said on the WBUR programme On Point, as the reconstructed chirps played. To modern ears they sound rather like a summer evening in a meadow, which is exactly what they were.",
            "The singers were ensiferans, the group that includes today's crickets and katydids, or bush crickets. Seven of the nine species belonged to a family called Prophalangopsidae and two to the Haglidae. Their fossils come from the Jiulongshan Formation, rocks so finely grained that about 20 of the insects were preserved with their wings intact.",
            "That detail is what made the whole project possible. Crickets and their relatives sing by stridulation: they rub one wing against the other, dragging a hard edge across a ridge lined with tiny teeth, a bit like running a fingernail along a comb. The number of teeth, how closely they are spaced and the shape of the wing all decide the pitch and rhythm of the song. “These fossils were so well preserved that we could really count these tiny teeth on them and do measurements and compare with wings of living katydids,” Jonsson told the programme.",
            "Counting teeth was only the start. The researchers built a family tree of nearly 100 living species, measured how real insect wings vibrate using laser vibrometry, and ran computer simulations of how the fossil wings would have moved. The wings do more than make the noise: they are shaped to resonate at the same frequency as the song, which amplifies it and helps it carry. “The wings which create the songs and which vibrate then amplify the vibrations they produce, they are evolved to have resonance at exactly the same frequencies,” Jonsson explained.",
            "To work out how fast each insect repeated its chirps, the team turned to machine learning, training models on decades of recordings of modern katydids. “We have this incredible database of modern species and we can take the length of the stridulatory file, the pitch of their song, and the duration of their song syllables,” said Charlie Woodrow, an entomologist and co-author. He was keen to point out that this was careful science rather than chatbot guesswork: “The kind of AI approach we used was not like ChatGPT where we just input a prompt and get a response.” Instead, the models learned the link between the shape of a wing and the rhythm of a song from real, living insects, and then applied it to the fossils.",
            "The result is a surprisingly varied choir. Most of the nine species sang low, pure tones of around 5 kilohertz, much like modern crickets. “Our findings reveal a wide variety of call frequencies,” said Jonsson. “Several species produced pure, low-pitched sounds like modern crickets, whilst others produced higher frequencies, similar to our native leafhoppers.” The team concluded that the Jurassic was acoustically far richer and more diverse than anyone had thought.",
            "Then there is the soloist. One species, Sigmaboilus peregrinus, a relative of the katydids, sang at between 20 and 22 kilohertz. That is ultrasound, above the range of most human ears, so if you had been standing in that Jurassic forest you would have seen it singing without hearing a note.",
            "It is also the oldest known example of any animal communicating with ultrasound, by a very long way. Scientists had long assumed that insects only took up these high frequencies around 50 million years ago, once bats arrived. The fossils push the date back to about 165 million years, some 100 million years before bats appeared. “There's been this long-standing hypothesis that insects didn't really need to hear or produce ultrasound until about 50 million years ago,” said Woodrow. The fossils suggest they were chatting up there far earlier. Plenty of insects still do it: about 70 per cent of katydid species today sing in ultrasound, and they hear it with ears on their front legs. Those ears work much like ours, complete with eardrums, resonance chambers and organs that sort sounds by frequency.",
            "Reconstructing the songs of the dinosaurs themselves is a different sort of puzzle, with no teeth to count. Thomas Land, a zoologist who worked on the sounds for Netflix's series The Dinosaurs, built them from the calls of the dinosaurs' living relatives. “Birds still exist. Birds are dinosaurs,” he said, so the team listened to emus, cassowaries, rheas, ostriches and sandhill cranes, along with crocodiles. The katydid team had one big advantage over the dinosaur sound designers: their singers left behind the actual instruments, preserved in stone, down to the last tiny tooth.",
            "The insect work is part of a project at Graz called Small Wings, Loud Songs, funded by the Austrian Science Fund. The recordings are now online for anyone to play. Turn the volume up, pour a drink and open a window: it is the oldest evening chorus on Earth, and it has been waiting 165 million years for an audience.",
          ],
          source: "University of Graz, Sci.News, WBUR On Point and Good News Network",
          sourceUrl:
            "https://www.uni-graz.at/en/news/jurassic-sounds-biologe-rekonstruiert-insekten-gesaenge-vor-165-millionen-jahren",
          image: {
            file: "/editions/45/jurassic-grasshopper-songs.jpg",
            alt: "A fossilised Jurassic grasshopper wing with its sound-making veins",
            credit: "Jun-Jie Gu et al., PNAS 2026",
            from: "https://www.goodnewsnetwork.org/scientists-recreated-chirps-of-jurassic-insects-simulating-a-165-million-yo-soundscape-listen/",
          },
        },
      ],
    },
    {
      section: "postcards",
      stories: [
        {
          slug: "cotaland-opens",
          kicker: "Theme parks",
          headline:
            "Austin's Formula 1 track opens a theme park next door, with a coaster that stalls upside down",
          dek: "COTALAND has 30-odd rides, five roller coasters and hot laps of the real Grand Prix circuit.",
          body: [
            "For years, the Circuit of The Americas in Austin, Texas, has been where Formula 1 cars come to go very fast. As of last Saturday it is also where families come to go very fast, very high and, now and then, upside down. COTALAND, a new 30-acre amusement park at the circuit, opened on 26 September.",
            "Opening day ran from 4pm to 10pm, with a ribbon-cutting, food and drink included in the $99 ticket, and fireworks to finish. Sunday followed with a second day of fun from 10am to 7pm, at $65 a head. Visitors found more than 30 rides, including five roller coasters.",
            "Top of many lists is Circuit Breaker, Texas's first tilt coaster. Then there is Palindrome, the country's first infinity shuttle coaster, which features a zero-g stall. For anyone who prefers their thrills a little calmer, there is the Victory Wheel, a Ferris wheel; the Soggy Logger, a log flume; a pirate ride called Smuggler's Curse; the giant Cloud Flyer swing; and rides with names like Retro Rambler, Cosmic Glider and Spin Out.",
            "Not everything involves a queue for a coaster. There is go-karting, mini golf and a zip line, too.",
            "And because this is a racetrack, there is one treat you will not find at most theme parks. For $175, visitors can ride shotgun with a professional driver for a high-speed hot lap of the official F1 track at the Circuit of The Americas, the same tarmac the world's best drivers race on.",
            "COTALAND is open at weekends and on selected dates for the rest of the year. Pick a coaster, hold on to your hat and enjoy the view from the top.",
          ],
          source: "Austin Monthly",
          sourceUrl: "https://www.austinmonthly.com/exclusive-photos-cotaland/",
          image: {
            file: "/editions/45/cotaland-opens.jpg",
            alt: "Crowds cheering beneath the colourful COTALAND entrance arch on opening day",
            credit: "Kursza / COTALAND",
            from: "https://www.austinmonthly.com/exclusive-photos-cotaland/",
          },
        },
        {
          slug: "hermanus-whale-festival",
          kicker: "Festivals",
          headline:
            "South Africa's Hermanus celebrates its whales with a parade, a treasure hunt and cliff-top watching",
          dek: "The 35th Hermanus Whale Festival runs from Friday 2 to Sunday 4 October.",
          body: [
            "Every year, southern right whales return to the waters off Hermanus on South Africa's Cape Whale Coast, and every year the town throws them a party. This weekend is the 35th Hermanus Whale Festival, which calls itself the world's only eco-marine festival.",
            "The best seats are on the cliff path, where visitors can watch the whales right from the shore. In town, the Eco-Marine Village has hands-on exhibitions about the ‘Marine Big 5’, which are whales, dolphins, penguins, seals and sharks. There is a street parade, live music at Gearing's Point, a Harbour-to-Harbour fun run, beach volleyball at Grotto Beach and a Pirates and Mermaids treasure hunt for children.",
            "Add craft markets, food stalls and a classic car show called Whales and Wheels at Sandbaai, and it is a festival that has thought of everyone, including the whales.",
          ],
          source: "Hermanus Whale Festival",
          sourceUrl: "https://hermanuswhalefestival.co.za/",
          image: {
            file: "/editions/45/hermanus-whale-festival.jpg",
            alt: "Families gather in the festival tent beside a costumed festival mascot",
            credit: "Hermanus Whale Festival",
            from: "https://hermanuswhalefestival.co.za/",
          },
        },
        {
          slug: "oktoberfest-final-weekend",
          kicker: "Festivals",
          headline:
            "Munich's Oktoberfest heads into its last weekend, with pretzels still going strong",
          dek: "The 191st edition runs until Sunday 4 October.",
          body: [
            "Munich's mayor, Dominik Krause, opened the 191st Oktoberfest on 19 September by tapping the first keg in just two strokes and crying “O'zapft is”, or “It's been tapped”. Since then the Theresienwiese fairground has been full of dirndls, lederhosen, brass bands, singing and swaying, plus pretzels, pork roast and sausages. Some 6 million visitors are expected over the 16 days, which end this Sunday.",
          ],
          source: "Associated Press via WTOP",
          sourceUrl:
            "https://wtop.com/world/2026/09/munichs-oktoberfest-roars-to-life-as-the-mayor-taps-the-first-keg",
          image: {
            file: "/editions/45/oktoberfest-final-weekend.jpg",
            alt: "People in traditional Bavarian costume in the Oktoberfest parade in Munich",
            credit: "AP Photo / Matthias Schrader",
            from: "https://wtop.com/world/2026/09/munichs-oktoberfest-roars-to-life-as-the-mayor-taps-the-first-keg",
          },
        },
      ],
    },
    {
      section: "india-desk",
      stories: [
        {
          slug: "drishti-fog-reader",
          kicker: "Science",
          headline:
            "A Bengaluru scientist built Drishti, the home-grown system that tells pilots how far they can see",
          dek: "Dr Shubha Iyengar's invention now watches the skies at more than 100 airports and air bases.",
          body: [
            "When a pilot lines up on a runway in the mist, one number matters a great deal: how far ahead can you see? At more than 100 airports and air bases across India, the answer now comes from Drishti, a system created by Dr Shubha Venkatesha Iyengar and her colleagues at CSIR-National Aerospace Laboratories in Bengaluru.",
            "Drishti works by placing a transmitter and a receiver about 30 metres apart and measuring how much of the light between them is scattered or absorbed by particles in the air. From that it can calculate visibility from under 25 metres, in the thickest fog, to more than 2,000 metres on a clear day, and send the figure in real time to pilots and air traffic controllers.",
            "It was first installed around 2014 at Delhi, Kolkata and Lucknow. By early 2026 it was in place at more than 100 locations, civilian airports and Indian Air Force bases alike, and Delhi's Indira Gandhi International Airport became the first to have the Indian-made system on every runway. Before Drishti, airports relied on imported instruments; the home-grown version costs much less, and it can be serviced locally.",
            "The system is the result of a long career. Dr Shubha, the youngest of nine siblings, topped her BSc and MSc at Central College before earning a PhD, and joined the laboratories in 1974. She went on to lead the Airport Instrumentation division and became a Distinguished Scientist, working on the technology over four decades.",
            "This year she received the Padma Shri. Every foggy morning, somewhere in India, a pilot is quietly benefiting from her work.",
          ],
          source: "The Better India",
          sourceUrl:
            "https://thebetterindia.com/technology/indian-scientist-dr-shubha-iyengar-runway-visibility-system-12583548",
          image: {
            file: "/editions/45/drishti-fog-reader.jpg",
            alt: "Dr Shubha Iyengar in a green sari beside a misty runway lined with visibility sensors as a plane lands",
            credit: "The Better India",
            from: "https://thebetterindia.com/technology/indian-scientist-dr-shubha-iyengar-runway-visibility-system-12583548",
          },
        },
        {
          slug: "zemithang-sunday-sorting",
          kicker: "Community",
          headline:
            "Every Sunday, 27 Himalayan villages in Arunachal sort their rubbish into 22 kinds",
          dek: "About 6,000 people in Zemithang have recovered nearly 90 tonnes for recycling.",
          body: [
            "In Zemithang, high in Arunachal Pradesh, Sunday is Swachhata Diwas, or cleanliness day. Families in 27 villages wash, dry and separate their waste at home into 22 categories, from plastics to glass and metal, before it is collected. Women riders then carry the sorted materials to recycling centres.",
            "The scheme began as a pilot in Chullyu village and is run by Merwyn Coutinho and Rajiv Rathod of the Further and Beyond Foundation, as part of their Himalayan Fringes project. Each household chips in 50 rupees, and around 6,000 people take part.",
            "Sorting at home is what makes it work in mountains where door-to-door collection is nearly impossible. So far the villages have recovered nearly 90 tonnes, including 1,479 kg in August alone. Across the wider Himalayan Fringes project, more than 20,000 people now take part, and Sunday has become the tidiest day of the week.",
          ],
          source: "The Better India",
          sourceUrl:
            "https://thebetterindia.com/changemakers/community-waste-management-zemithang-arunachal-himalayan-fringes-villages-segregation-12593936",
          image: {
            file: "/editions/45/zemithang-sunday-sorting.jpg",
            alt: "Villagers in gloves sorting bags of recycling outdoors with mountains behind them",
            credit: "The Better India",
            from: "https://thebetterindia.com/changemakers/community-waste-management-zemithang-arunachal-himalayan-fringes-villages-segregation-12593936",
          },
        },
        {
          slug: "goa-teen-beetle-watcher",
          kicker: "Young naturalists",
          headline:
            "A 17-year-old in Goa spends his spare time watching beetles, and wants to film them",
          dek: "Ethan Xavier has loved insects since the age of five, starting with garden snails.",
          body: [
            "Ethan Xavier, a Class 12 science student at Don Bosco School in Goa, has built and catalogued his own insect collection, spotted rare silk-spinning webspinners, and once watched a pill millipede roll down a slope. He also plays in a band. After school he plans to study entomology and, like Sir David Attenborough, film insects for people at home. “I feel calm when watching insects,” he said.",
          ],
          source: "The Better India",
          sourceUrl:
            "https://thebetterindia.com/young-achievers/goa-teen-ethan-xavier-insects-entomologist-nature-conservation-12590827",
          image: {
            file: "/editions/45/goa-teen-beetle-watcher.jpg",
            alt: "Ethan Xavier studying a winged insect, surrounded by pictures of beetles and butterflies",
            credit: "The Better India",
            from: "https://thebetterindia.com/young-achievers/goa-teen-ethan-xavier-insects-entomologist-nature-conservation-12590827",
          },
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
        text: "A good seat on the cliff path at Hermanus. Whale-watching experience preferred; binoculars provided.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "FOR SALE",
        text: "A kettle, well travelled, for Ranma 1/2 watch parties. Hot water on request, pandas at your own risk.",
      },
    },
    {
      type: "comic",
      content: {
        title: "Pip & Pigeon",
        panels: [
          "PIP: Want to share some mochi at the Matsuri?",
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
};
