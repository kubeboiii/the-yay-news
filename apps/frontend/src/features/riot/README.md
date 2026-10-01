# Riot kit

Direction B, "Riso Zine Riot", as reusable presentational parts. Import everything from
`@/features/riot`. Data, routing and state stay with the caller. The sheet at
`/mockups/riot-kit` shows every part on three colourways.

## House rules

- One loud thing per screen (a poster or a ransom head), one action, and calm paper in the middle.
- Two plates and the paper: plate A in big flat areas, plate B mostly where it overprints A. White
  type only on black.
- Use `RansomHeading` for the one or two biggest heads only. Everything else gets `Heading` (League
  Gothic). Use Courier (`.rt-meta`) only for metadata.
- Most things sit straight. Tilt one or two hero pieces. No drop shadows: layers show through
  overlaps, edges and tape.
- At most one or two `Sticker`s per screen, and each must carry real info. Use a few marker marks
  at most. The mascot appears once.
- Targets are at least 44px (most are 56px). Motion stops under `prefers-reduced-motion`.

## Tokens

```ts
riotInks({ design?: EditionDesign, colourway: string }): RiotInks
```

This is pure and server-safe, with no hooks or browser APIs. Compute it once on the server and pass
it down. `"house"` resolves to the design's default colourway.

`RiotInks` has these fields: `{ slug, name, family, paper, k, a, b, over, aOn, bOn, overOn, vars }`.

- `a` and `b` are the day's lead ink and the ink furthest from it in hue. Both are pushed toward
  fluoro (more chroma at the same hue). Each is then let down with paper until black type on it
  passes AA (4.5:1).
- `over` is `a × b` (multiply). `*On` is black or paper, whichever passes AA on that ground.
- `vars` holds the CSS custom properties: `--rt-paper`, `--rt-k`, `--rt-a`, `--rt-b`, `--rt-over`
  and `--rt-{a,b,over}-on`.

The palette logic moved here from the site mockups: `paletteFor`, `paletteVars`, `contrast` and
`textOn` (`tokens/palette.ts`). `app/mockups/site-a/_shared/palette.ts` re-exports them.

Other helpers:

- `edgePath(edge, seed, sides?, teeth?)` returns a seeded `clip-path` for each edge type:
  `"cut" | "torn" | "deckle" | "zigzag"`.
- `halftonePath({ w, h, pitch, angle, fade, density, seed })` returns a tone-graded, jittered
  halftone screen as one SVG path.
- `rand(key)` and `tilt(key, max)` are seeded randomness.
- `riotFonts` is the font-variable class names. `RiotTheme` applies them.

CSS utilities (in `riot.css`, under `.rt`):

| Kind                  | Classes or variables                                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Grounds               | `.rt-g--{paper,white,a,b,over,ink}` (background plus AA text colour)                                                         |
| Text colour only      | `.rt-on--*`                                                                                                                  |
| Ink as `currentColor` | `.rt-ink--{a,b,k}`                                                                                                           |
| Type                  | `.rt-heading`, `.rt-meta`, `.rt-hand`, `.rt-sr`                                                                              |
| Textures              | `--rt-grain` (xerox toner noise), `--rt-speckle` (sparse toner specks), `--rt-toner` (coarse), `--rt-banding` (copier bands) |

`.rt--surface` paints paper, grain, speckle and banding, plus edge darkening.

## Theme

```tsx
<RiotTheme inks?={RiotInks} colourway?="original" design?="broadsheet"
  as?="div|main|section|body" surface?={true} className? style? id? aria-labelledby?>
```

This sets the inks' CSS variables and the type on a subtree. `surface` paints the page paper.

## Hooks

```ts
useTurnKeys(prev?: string, next?: string): void
```

This is a client hook. The ← and → keys `router.push` to `prev` and `next`. It's ignored while
typing in a field or when a modifier key is held.

## Components

| Component         | Props                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RansomHeading`   | `text`, `seed`, `cuts?: (Cut \| GAP)[]`, `photo?: url`, `as?: h1\|h2\|h3\|p\|span`, `className?`, `style?`. Size it with `font-size`. A `Cut` is `{ ch, from?: slab\|didone\|roman\|gothic\|grot\|type, size?, lift?, turn?, ground?: paper\|none\|ink\|a\|b\|photo, tuck? }`. Hand-compose with `cuts` (best). Without `cuts`, `composeCuts(text, seed)` builds 1–3-letter cuts from 3–4 sources with one or two accents. Screen readers get `text`.                                                                                                                                        |
| `Heading`         | `children`, `as?`, `id?`, `className?`, `style?`. Uses the one condensed face.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `Scrap`           | `children`, `seed`, `ground?: Ground`, `edge?: Edge`, `sides?`, `tape?: TapeAt \| TapeAt[]`, `tilt?`, `as?`, `className?`, `style?`. A piece of paper, guillotine-cut and straight by default.                                                                                                                                                                                                                                                                                                                                                                                               |
| `Tape`            | `at?: top\|top-left\|top-right\|bottom-left\|bottom-right`, `seed`, `className?`, `style?`. Masking tape.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Sticker`         | `children`, `seed`, `ground?`, `shape?: rect\|circle\|burst`, `tilt?`, `pinned?` (absolute), `className?`, `style?`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `Halftone`        | `seed`, `fade?: left\|right\|up\|down\|radial\|corner\|flat`, `ink?: a\|b\|k`, `density?`, `pitch?`, `angle?`, `w?`, `h?` (the box in px it prints at), `className?`, `style?`. Fills its positioned parent and multiplies.                                                                                                                                                                                                                                                                                                                                                                  |
| `Misprint`        | `children: string\|number`, `as?`, `ink?: a\|b`, `offset?: [x, y]` (1–3px), `className?`. Big type with the second plate slipped. Use it on a few large elements only.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `RubberStamp`     | `children`, `seed`, `ink?`, `tilt?`, `decorative?` (default true), `className?`. Unevenly inked.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `MarkerCircle`    | `seed`, `ink?`, `aspect?`, `width?`, `className?`. A pressure-varied marker loop round its positioned parent, overshooting the join. Decorative: also say the state in words.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `HandArrow`       | `seed`, `points: [x, y][]`, `w`, `h`, `ink?`, `width?`, `head?`, `className?`. A marker arrow.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `MarkerUnderline` | `seed`, `ink?`, `width?`, `className?`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `GoButton`        | `children`, `sub?`, `href?` (otherwise a button), `tone?: ink\|a\|paper\|quiet`, `type?`, `scroll?`, `className?`, `aria-label?`. The one action, at least 56px (quiet: 44px).                                                                                                                                                                                                                                                                                                                                                                                                               |
| `Poster`          | `children`, `seed`, `ground?: a\|b\|paper`, `paste?` (default true: wheatpaste wrinkles, torn bottom and right, taped corners), `edge?`, `sides?`, `screen?: { fade?, ink?, density?, pitch?, area?: CSS inset, w?, h? }` (a halftone of the other plate, clipped to the sheet), `as?`, `className?`, `id?`, `aria-labelledby?`, `aria-label?`.                                                                                                                                                                                                                                              |
| `Receipt`         | `issue`, `date` (YYYY-MM-DD), `pageSquares: { colour, read }[]`, `puzzles: { solved, total }`, `streak`, `tags: string[]`, `lines?: { label, value }[]`, `stampedAt?`, `title?`, `total?`, `headingId?`, `className?`, `children?` (put `TearTabs` here). Prints line by line.                                                                                                                                                                                                                                                                                                               |
| `TearTabs`        | `tabs: { label, href?, onSelect? }[]`, `prompt?`, `className?`. Tear-off tabs: a link, or a button that calls `onSelect` (from a client caller).                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `FindItBox`       | `action`, `name?`, `defaultValue?`, `label?`, `placeholder?`, `button?`, `count?: ReactNode`, `hits?: { key, href, meta, title }[]`, `id?`, `className?`, `children?`. A plain GET form that works without JS.                                                                                                                                                                                                                                                                                                                                                                               |
| `Tracklist`       | `pages: { order, label, href, colour }[]` (the shape of `PagerPage`), `current` (an order), `read?: number[]`, `finished?`, `doneHref`, `doneLabel?`, `doneSub?`, `side?`, `sideNote?`, `label?`, `mascot?: ReactNode`, `keys?` (default true, uses `useTurnKeys`), `docked?` (default true: fixed to the bottom of the viewport), `scroll?`, `className?`. Renders links only. On phones it folds to Back · 3/9 · Next.                                                                                                                                                                     |
| `CutNav`          | `items: { id, label, sub?, href }[]`, `active?`, `label?`, `phone?: tape\|inline` (default `tape`: becomes the TapeBar at ≤760px), `className?`. The active item is ringed in marker and gets `aria-current`.                                                                                                                                                                                                                                                                                                                                                                                |
| `TapeBar`         | `items`, `active?`, `label?`, `docked?` (default true), `className?`. The phone bar: slips on black tape.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Mascot`          | `pose?: standing\|peek\|deliver\|asleep\|on-pile\|lights\|confused`, `inks?: Partial<MascotInks>`, `label?` (`""` makes it decorative), `still?`, `className?`, `style?`. Odin the husky, traced from the owner's reference drawings into flat ink layers, with the cap (plate A), satchel (plate B), eyelids and props as small SVG overlays. `standing` is the master sitting pose; `peek` is the small icon. His idle loop is an eyelid blink and a gentle breath (plus wheels, Zs or glowing bulbs). `MascotInks` is `{ line, coat, soft, white, cream, eye, tongue, cap, bag, paper }`. |

Odin's name lives in one place, `MASCOT_NAME` (`mascot/name.ts`). `MASCOT_POSES` lists the poses.
The traced art is in `mascot/art/` (`sitting.ts` from the owner's colour-pencil sitting husky,
`peek.ts` from the flat peeking husky), generated with vtracer outside the repo. The overlays
(`mascot/overlays.tsx`) and one file per pose (`mascot/poses/`) sit on top. Confirm the reference
drawings' licences before shipping.

## Wiring sketch

```tsx
const inks = riotInks({ design: edition.design, colourway: edition.colourway }); // server
<RiotTheme inks={inks} as="body">
  <CutNav items={nav} active="today" />
  …
  <Tracklist pages={pagerPages(edition)} current={order} read={readOrders} doneHref="/done" />
</RiotTheme>;
```
