# Yay Attax

Collectible cards of popular characters and people in twelve leagues, earned only by reading.

- `leagues/<league>.ts`: the cards (names, stats 1–99, kind, team, rarity, era, bio, move, colour).
- `leagues/<league>.images.ts`: generated picture paths and credits. Don't edit by hand.
- `leagues/meta.ts`: each league's name, stat names, Deck Battle rule and colours.
- `drops.ts`: the release schedule and the planned drops (placeholders).
- `seasons.ts`: the quarterly seasons and which leagues each one features.
- `draw.ts`, `collection.ts`, `battle.ts`, `sets.ts`: the pure rules, tested by
  `node --test src/features/cards/cards.test.ts`.

## Rules to keep when adding cards

- Eras are rarer than current cards: `2010s` must be Rare or better, `2000s` Epic or better, and
  `legend` Epic or Legendary. The tests check this.
- Pokémon stats come from their official base stats: write them as `base` and `mon()` works out
  the card stats.
- `slug` is kebab-case, unique within its league, and is also the picture's file name.

## Adding a drop

1. Pick the drop in `PLANNED` (`drops.ts`), or plan a new one. Small drops (3–5 cards) come every
   few days, and bigger themed ones on Sundays.
2. Write each card into its league's data file with `releasedOn: "<the drop's date>"`. Until that
   date it isn't in any scratch card, box, dip, Card Clash or Deck Battle, and the album doesn't
   show it.
3. Add its picture to `scripts/card-images/<league>.json`:
   `wiki:<Article>`, `file:<Commons file>`, `fandom:<wiki>:<Page>`, `pokeapi:<dex>` or
   `url:<https://…>|<credit>`. Use `null` for no picture (the card prints its initials).
4. Run `python3 scripts/fetch_card_images.py <league> --sheet /tmp/<league>.png`, and look at the
   sheet to make sure each picture shows the right person or character. Pictures are at most
   720 px and are not pressed onto newsprint.
5. Delete the drop's placeholders from `PLANNED`, run the tests, and format the files with
   `prettier --write`.
