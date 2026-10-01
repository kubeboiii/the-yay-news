import { riotInks } from "./inks";

/**
 * The site's own inks: pink and blue from the Carousel colourway. The nav, Today, Pile, Wall and
 * the cards always print in these, whatever colourway the day's paper is in; the paper keeps its own.
 */
export const HOUSE_COLOURWAY = "carousel";
export const HOUSE_INKS = riotInks({ colourway: HOUSE_COLOURWAY });
