// Real photographs for the design mockups, served from Unsplash's image CDN. Each subject has a
// first choice and alternates, so a page can pick the one whose crop suits its layout.

import { readdirSync } from "node:fs";
import path from "node:path";

export type Photo = { id: string; alt: string; credit: string };

// Photos run through scripts/press_photos.py are printed onto newsprint (halftone screen, lifted
// blacks) and served from public/. Anything not pressed yet falls back to the live CDN image.
const pressed = new Set(
  (() => {
    try {
      return readdirSync(path.join(process.cwd(), "public/mockup/press"));
    } catch {
      return [];
    }
  })(),
);

/** Newsprint-pressed photo if one exists, otherwise the Unsplash CDN URL at a given width. */
export const unsplash = (id: string, width = 1600) =>
  pressed.has(`${id}.jpg`)
    ? `/mockup/press/${id}.jpg`
    : `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`;

const p = (id: string, alt: string, credit: string): Photo => ({ id, alt, credit });

export const photos = {
  // Front page / lead
  octopus: [p("photo-1561479639-747efc0d0bf2", "An orange octopus with curled arms", "NOAA")],
  jellyfish: [
    p(
      "photo-1543007168-5fa9b3c5f5fb",
      "A pink and orange jellyfish glowing in dark water",
      "Ganapathy Kumar",
    ),
    p("photo-1495012379376-194a416fcc5f", "Pale jellyfish drifting on blue", "Joel Filipe"),
  ],
  picnic: [
    p(
      "photo-1731186622228-38f68d3f64ad",
      "A red gingham picnic blanket laid with food",
      "Kyrie Isaac",
    ),
    p(
      "photo-1593034509785-5b17ba49f683",
      "A picnic of croissants, doughnuts and coffee",
      "Svetlana Kuznetsova",
    ),
  ],
  sunflowers: [
    p("photo-1552160793-cbaf3ebcba72", "A field of yellow sunflowers", "Jordan Cormack"),
    p("photo-1540039906769-84cf3d448bc1", "A single sunflower close up", "Matthias Oberholzer"),
  ],

  // Screen & Sound
  cinema: [
    p("photo-1489599849927-2ee91cede3ba", "Rows of red cinema seats", "Felix Mooneeram"),
    p("photo-1513106580091-1d82408b8cd6", "A red cinema seat numbered 23", "Kilyan Sockalingum"),
  ],
  retroTv: [
    p(
      "photo-1580247817119-c6cb496270a4",
      "An orange vintage television on a kitchen counter",
      "Francisco Andreotti",
    ),
    p("photo-1574974409771-cebec54deb00", "A grey CRT television on a table", "PJ Gal-Szabo"),
  ],
  choir: [
    p(
      "photo-1720186576697-24c1496a07e1",
      "A choir singing in front of a golden altar",
      "Green Liu",
    ),
    p("photo-1548795835-264877304664", "A group of people singing together", "Joshua Hanson"),
  ],
  vinyl: [
    p(
      "photo-1603048588665-791ca8aea617",
      "A black vinyl record spinning on a turntable",
      "Andrea Cipriani",
    ),
    p(
      "photo-1616714109948-c74fe5029a4d",
      "A translucent amber vinyl record spinning",
      "Jakob Rosen",
    ),
  ],
  concert: [
    p(
      "photo-1603910234616-3b5f4a6be2b4",
      "A concert crowd under falling purple confetti",
      "Samuel Regan-Asante",
    ),
    p("photo-1533174072545-7a4b6ad7a6c3", "A crowd gathered on a festival field", "Danny Howe"),
  ],
  popcorn: [
    p(
      "photo-1691480213129-106b2c7d1ee8",
      "A striped cup overflowing with popcorn",
      "personalgraphic.com",
    ),
    p("photo-1578849278619-e73505e9610f", "A bowl of popcorn", "Pylz Works"),
  ],
  microphone: [
    p("photo-1485579149621-3123dd979885", "A vintage silver microphone", "Matt Botsford"),
  ],
  cassette: [p("photo-1565656898731-61d5df85f9a7", "A white cassette tape", "Daniel Schludi")],

  // Gaming
  bakeryCat: [
    p(
      "photo-1669873433859-8e8779f9fc49",
      "A cat in a small chef's hat among pastries",
      "Reba Spike",
    ),
    p("photo-1669873438327-5a98df548c0b", "A fluffy cat in a chef's hat in a bakery", "Reba Spike"),
  ],
  arcade: [
    p("photo-1511512578047-dfb367046420", "A gaming room lined with arcade machines", "Carl Raw"),
    p(
      "photo-1572289758057-3e0f4327833b",
      "A retro arcade cabinet glowing in the dark",
      "Benjamin Szabo",
    ),
  ],
  controller: [
    p("photo-1612287230202-1ff1d85d1bdf", "A game controller lit by neon light", "Javier Martínez"),
    p("photo-1493711662062-fa541adb3fc8", "Two people playing a console game", "JESHOOTS.COM"),
  ],
  retroConsole: [
    p(
      "photo-1550745165-9bc0b252726f",
      "A vintage grey games console and joystick",
      "Lorenzo Herrera",
    ),
  ],
  neonRoom: [
    p(
      "photo-1715279240000-9a50953e327d",
      "A living room with a big TV and neon lights",
      "Branden Skeli",
    ),
  ],
  fishing: [
    p("photo-1517217004452-4ff260cb5598", "A small white boat on still water", "Saffu"),
    p("photo-1583249598754-b7a2f59651fb", "A hand holding a fishing reel", "Brady Rogers"),
  ],
  catLaptop: [p("photo-1592301388444-185c2d047bbd", "A white cat lying on a laptop", "Trà My")],

  // Sports
  pitStop: [
    p("photo-1659203206829-218b9b5930e5", "A pit crew gathered around a race car", "Marc Kleen"),
  ],
  cricket: [
    p("photo-1531415074968-036ba1b575da", "A red cricket ball on grass", "Alessandro Bogliari"),
  ],
  stadium: [p("photo-1705593973313-75de7bf95b56", "A packed football stadium", "Igor Batista")],

  // Tech
  robot: [
    p(
      "photo-1485827404703-89b55fcc595e",
      "A small white robot against a brown wall",
      "Alex Knight",
    ),
    p("photo-1527430253228-e93688616381", "A blue toy robot", "Emilipothèse"),
  ],
  oldPhones: [p("photo-1587017234728-932c80f3e56f", "Colourful old candybar phones", "Rayson Tan")],
  songbird: [
    p("photo-1591198936750-16d8e15edb9e", "A yellow and black bird on a post", "Joshua J. Cotten"),
  ],
  bedSheets: [p("photo-1598535746036-87d13382f6a6", "White sheets on a bed", "Sincerely Media")],

  // Money & Culture
  coffee: [
    p("photo-1559001724-fbad036dbc9e", "A cafe latte with latte art", "Phil Desforges"),
    p("photo-1670404161009-29548c027d06", "A hand holding a cup of coffee", "Caramel"),
  ],
  bench: [
    p(
      "photo-1780650548384-6c91e653e809",
      "People relaxing on a pier overlooking the sea",
      "Tom Macret",
    ),
  ],
  stickyNotes: [
    p("photo-1641355527446-232d7f1f2c10", "A wall covered in sticky notes", "Annie Vo"),
  ],

  // Food & Words
  iceCream: [
    p("photo-1705103654884-cbd03d95761a", "An ice cream cone on a pink background", "Orissa Humes"),
    p("photo-1629385701021-fcd568a743e8", "An ice cream cone with sprinkles", "Courtney Cook"),
  ],
  pickles: [p("photo-1617854307432-13950e24ba07", "A glass jar of pickles", "Prchi Palwe")],

  // Back page
  otters: [
    p("photo-1633967920376-33b2d94f091f", "A group of sea otters floating together", "Kedar Gadge"),
  ],
  goldenRetriever: [
    p(
      "photo-1633722715463-d30f4f325e24",
      "A golden retriever sitting in grass with its tongue out",
      "Shayna Douglas",
    ),
    p("photo-1626736637845-53045bb9695b", "A golden retriever puppy", "Anthony Persegol"),
  ],
  lighthouse: [
    p("photo-1609421543722-919530d6b864", "A red and white lighthouse", "Raoul du Plessis"),
  ],
  crossword: [
    p("photo-1769421821920-1eddc99ec71b", "A pencil resting on a crossword", "Andrey Soldatov"),
  ],
  tortoise: [p("photo-1559041881-74dd9fd9b600", "A tortoise walking", "Dušan veverkolog")],
  space: [
    p(
      "photo-1706800696671-570820e7ff39",
      "A star cluster photographed by Hubble",
      "NASA Hubble Space Telescope",
    ),
  ],

  // A real paper texture to lay over a sheet with mix-blend-mode: multiply.
  paper: [
    p("photo-1712145176570-6cb1d98a126a", "Close-up of white paper grain", "Plufow Le Studio"),
  ],
} satisfies Record<string, Photo[]>;

export type PhotoKey = keyof typeof photos;

/** First-choice photo for a subject (or a numbered alternate). */
export const pick = (key: PhotoKey, n = 0): Photo => {
  const list: Photo[] = photos[key];
  return list[n] ?? (list[0] as Photo);
};
