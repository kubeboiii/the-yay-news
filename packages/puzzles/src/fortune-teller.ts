import { COLOURS, FORTUNES } from "./content/fortunes.ts";
import { dayNumber, rngFor, rotation } from "./random.ts";
import type { FortuneTellerPuzzle } from "./types.ts";

const FLAPS = 8;
const fortunes = rotation(FORTUNES, "fortune");

/** How many days pass before a fortune can come round again. */
export const FORTUNE_CYCLE_DAYS = Math.floor(fortunes.size / FLAPS);

/** The day's paper fortune teller: four colours, eight numbers and eight happy fortunes. */
export function fortuneTeller(date: string): FortuneTellerPuzzle {
  const rng = rngFor(date, "fortune-teller");
  const day = dayNumber(date);
  return {
    type: "fortune_teller",
    data: {
      title: "Fortune Teller",
      colours: rng.sample(COLOURS, 4),
      numbers: rng.sample(
        Array.from({ length: 12 }, (_, i) => i + 1),
        FLAPS,
      ),
      // Eight consecutive fortunes of the walk per day, so none repeats within the cycle.
      fortunes: Array.from({ length: FLAPS }, (_, i) => fortunes.at(day * FLAPS + i)),
    },
    solution: {},
  };
}
