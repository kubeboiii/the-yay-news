import type { EvergreenItem } from "../types.ts";

// How things work, and clever things people made.

export const tech: EvergreenItem[] = [
  {
    slug: "how-a-zip-works",
    kicker: "How things work",
    headline: "How a zip works: the slider is a tiny wedge doing all the thinking",
    dek: "Two rows of teeth, one small triangle, and a very satisfying sound.",
    body: [
      "Every tooth on a zip has a bump on top and a hollow underneath. Inside the slider is a Y-shaped channel that bends the two rows towards each other at just the right angle, so that each bump slots into the hollow of the tooth opposite.",
      "Pull the other way and a small wedge in the slider prises them apart again. The modern design was perfected by Gideon Sundback in 1913, and it has barely needed changing since, which is about the highest compliment an invention can get.",
    ],
  },
  {
    slug: "how-microwaves-heat",
    kicker: "How things work",
    headline: "Why a microwave oven heats your soup but not the plate",
    dek: "It gets water molecules dancing, billions of times a second.",
    body: [
      "Microwave ovens fill their box with radio waves at about 2.45 gigahertz. Water molecules are lopsided, with a slightly positive end and a slightly negative one, so the flipping field makes them jiggle back and forth. That jiggling is heat.",
      "Most plates and bowls contain very little water, so they warm up mainly because the food touches them. The turntable is there because the waves form a pattern of hot and cold spots, and spinning the food evens them out.",
    ],
  },
  {
    slug: "post-it-note",
    kicker: "Inventions",
    headline: "The Post-it Note began as a glue that didn't stick very well",
    dek: "A not-quite-adhesive waited years for the right job.",
    body: [
      "In 1968 a 3M scientist, Spencer Silver, was trying to invent a strong adhesive and instead made one that stuck lightly and peeled off cleanly. It was interesting, but nobody could think what to do with it.",
      "Years later his colleague Art Fry, frustrated with bookmarks falling out of his hymn book at choir, tried the glue on little slips of paper. They stayed put and came off without tearing a page. The yellow colour was an accident too: it was the scrap paper the lab had to hand.",
    ],
    sticker: "Stuck on it",
  },
  {
    slug: "qr-codes-corners",
    kicker: "How things work",
    headline: "The three squares on a QR code tell your camera which way up it is",
    dek: "Invented for tracking car parts, now used for menus everywhere.",
    body: [
      "The QR code was designed in 1994 by Masahiro Hara at Denso Wave in Japan, to track parts on car production lines faster than a barcode could. The three large squares in the corners let a scanner find the code, work out its angle and read it from any direction.",
      "QR codes also carry spare information, so a code can be read even if a chunk of it is scuffed or covered. That is why some designers put a logo in the middle: the code simply shrugs and fills in the gap.",
    ],
  },
  {
    slug: "velcro-burrs",
    kicker: "Inventions",
    headline: "Velcro was inspired by burrs stuck to a dog after a walk",
    dek: "An engineer took a closer look, and then a much closer look.",
    body: [
      "In 1941, the Swiss engineer George de Mestral came home from a walk in the Alps to find his trousers and his dog covered in burdock burrs. Under a microscope he saw that each burr was covered in tiny hooks that caught on loops of fabric and fur.",
      "It took him years to copy the idea in nylon: one strip of hooks and one of loops. He named it after the French for velvet and hook, velours and crochet, and the rest is the sound of a thousand shoes being done up at once.",
    ],
  },
  {
    slug: "gps-relativity",
    kicker: "How things work",
    headline: "Your phone's map only works because Einstein was right",
    dek: "Satellite clocks tick at a slightly different rate from ours, and GPS corrects for it.",
    body: [
      "GPS satellites carry extremely precise atomic clocks, and your phone works out where it is from tiny differences in when their signals arrive. But the clocks are moving fast and sit higher up where gravity is weaker, and both effects, predicted by Einstein's theories of relativity, change how fast time passes for them.",
      "Together they make the satellite clocks run ahead by about 38 microseconds a day. That doesn't sound like much, but uncorrected it would put your blue dot kilometres out by teatime. The system adjusts for it, and you find the café.",
    ],
  },
  {
    slug: "lighthouse-lens",
    kicker: "Inventions",
    headline: "The lens that let a single lamp be seen 30 kilometres out to sea",
    dek: "Augustin Fresnel's rings of glass are still in lighthouses, headlights and projectors.",
    body: [
      "In the 1820s the French physicist Augustin Fresnel worked out that a lens didn't need to be a thick lump of glass. He split it into concentric rings, each angled to bend light the same way, which made a lens that was far lighter and thinner but just as strong.",
      "Put in lighthouses, his lenses gathered light that would have been lost and sent it out in a tight, bright beam visible for many miles. The same idea now lives in car headlights, overhead projectors and those flat magnifying sheets that come free with large-print books.",
    ],
  },
  {
    slug: "barcode-in-the-sand",
    kicker: "Inventions",
    headline: "The barcode was first sketched in the sand on a beach",
    dek: "Morse code, stretched downwards.",
    body: [
      "In the late 1940s, Norman Joseph Woodland was trying to devise a way for shops to record what they sold. Sitting on a Miami beach, he pushed his fingers into the sand and dragged them towards him, turning the dots and dashes of Morse code into thick and thin lines.",
      "He patented the idea with Bernard Silver in 1952. It took years for scanners to catch up, but in 1974 a pack of chewing gum at a supermarket in Ohio became the first product sold with a scanned barcode. The gum is now in a museum.",
    ],
  },
  {
    slug: "first-webcam-coffee",
    kicker: "Computing",
    headline: "The first webcam was pointed at a coffee pot",
    dek: "Cambridge scientists wanted to know if it was worth the walk.",
    body: [
      "In 1991, researchers at the University of Cambridge's computer lab were fed up with walking to the coffee machine in the Trojan Room only to find it empty. So they pointed a camera at it and wrote software to show a small picture of the pot on their screens.",
      "In 1993 the image went on the World Wide Web, and people all over the world checked in on a coffee pot in Cambridge. When it was finally switched off in 2001, the pot was sold at auction. The coffee, by then, was cold.",
    ],
    sticker: "Fresh pot",
  },
  {
    slug: "first-computer-bug",
    kicker: "Computing",
    headline: "The first computer ‘bug’ was an actual moth",
    dek: "It was taped into the logbook, where it remains.",
    body: [
      "In 1947, engineers working on the Harvard Mark II computer traced a fault to a moth caught in one of its relays. They removed it, taped it into the logbook and wrote beside it: “First actual case of bug being found.”",
      "Engineers had used ‘bug’ for glitches long before, but the moth made it official. The page, moth and all, is kept at the Smithsonian's National Museum of American History. The team, which included the pioneering programmer Grace Hopper, enjoyed telling the story for years.",
    ],
  },
  {
    slug: "how-noise-cancelling-works",
    kicker: "How things work",
    headline: "Noise-cancelling headphones make silence by adding more sound",
    dek: "Every hum gets a perfectly timed mirror image.",
    body: [
      "Tiny microphones on the outside of the headphones listen to the noise around you, and a chip creates a matching sound wave that is flipped upside down. When the two meet, the peaks of one fill in the troughs of the other and they largely cancel out.",
      "It works best on steady, low sounds like engines and air conditioning, and less well on sudden noises like a cough, which is why you can still hear the person next to you on the train announce that they have forgotten their keys.",
    ],
  },
  {
    slug: "lego-clutch",
    kicker: "Design",
    headline: "Lego bricks from 1958 still click together with ones made today",
    dek: "The tubes inside the brick were the clever bit.",
    body: [
      "Lego patented its modern brick in 1958. The studs on top had been around for a while, but the new design added hollow tubes underneath that grip the studs from the sides, holding bricks together firmly while still letting small hands pull them apart.",
      "The company has kept the dimensions so consistent that a brick from that first year will fit one bought this morning. Bricks are made to tolerances of a few thousandths of a millimetre, which is why they click and why your feet know exactly where one is at night.",
    ],
  },
  {
    slug: "escalator-name",
    kicker: "Inventions",
    headline: "The first escalator was a fairground ride",
    dek: "It opened at Coney Island in 1896, and people queued to try it.",
    body: [
      "In 1896, the inventor Jesse Reno installed what he called an inclined elevator at Coney Island in New York: a moving slope with cleats for grip, rising about two metres. Visitors rode it purely for the thrill.",
      "The word escalator was a trademark of the Otis Elevator Company, blended from the Latin scala, for ladder, and elevator. Harrods installed one in London in 1898, and staff reportedly waited at the top with smelling salts and brandy for anyone overcome by the experience.",
    ],
  },
  {
    slug: "how-a-fridge-works",
    kicker: "How things work",
    headline: "A fridge doesn't make cold, it moves heat out of the box",
    dek: "That's why the back of it feels warm.",
    body: [
      "Inside the pipes of a fridge is a refrigerant that boils at a very low temperature. As it evaporates inside the fridge, it soaks up heat from your food, just as a wet swimsuit chills you on a breezy beach.",
      "A compressor then squeezes the warm gas, and the coils at the back let that heat escape into the kitchen, turning the gas back into a liquid ready to go round again. The humming you hear at night is the fridge carrying heat out, one lap at a time.",
    ],
  },
  {
    slug: "cats-eyes-roads",
    kicker: "Inventions",
    headline: "Road cat's eyes were inspired by a real cat on a foggy night",
    dek: "They even clean themselves when a car drives over them.",
    body: [
      "Percy Shaw, a road contractor from Halifax in Yorkshire, patented the reflecting road stud in 1934. As he told it, the idea came when the light from his car caught the eyes of a cat by the roadside on a dark night.",
      "His design set glass reflectors into a rubber dome inside a cast-iron housing. When a wheel rolls over it, the rubber pushes down and wipes the glass clean against a little pad, while rainwater collected in the base helps rinse it. Millions of them still line the roads.",
    ],
  },
  {
    slug: "cut-copy-paste",
    kicker: "Computing",
    headline: "Cut, copy and paste were championed by a man whose number plate read NO MODES",
    dek: "Larry Tesler wanted computers that did what you meant.",
    body: [
      "In the 1970s, the computer scientist Larry Tesler worked at Xerox PARC on text editors that ordinary people could use without learning a list of secret commands. His editor, Gypsy, built with Tim Mott, let you select text and cut, copy and paste it, ideas that went on to every computer and phone.",
      "Tesler campaigned against ‘modes’, where the same key does different things depending on a setting you can't see. He felt strongly enough to put NO MODES on his car's number plate, and on his T-shirts too.",
    ],
  },
];
