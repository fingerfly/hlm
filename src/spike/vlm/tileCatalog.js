/**
 * Purpose: Define canonical Mahjong tile catalog and lookup tables.
 * Description:
 * - Stores canonical tile code list and legacy alias mappings.
 * - Exposes human-readable labels for diagnostics and prompts.
 * - Builds fast set/map lookups for code/id conversions.
 */
const WAN = ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W"];
const TIAO = ["1T", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T"];
const TONG = ["1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B"];
const WINDS = ["E", "S", "Wn", "N"];
const DRAGONS = ["R", "G", "Wh"];

export const ENCODING_VERSION = "v1";
export const FLOWER_TILE_CODES = [
  "Ch", "Xi", "Qi", "Do", "Mm", "La", "Zh", "Ju"
];
export const ALL_TILE_CODES = Object.freeze([
  ...WAN,
  ...TIAO,
  ...TONG,
  ...WINDS,
  ...DRAGONS,
  ...FLOWER_TILE_CODES
]);
export const LEGACY_CODE_ALIASES = Object.freeze({
  F1: "Ch",
  F2: "Xi",
  F3: "Qi",
  F4: "Do",
  J1: "Mm",
  J2: "La",
  J3: "Zh",
  J4: "Ju"
});

export const TILE_CODE_TO_LABEL = Object.freeze({
  "1W": "one wan",
  "2W": "two wan",
  "3W": "three wan",
  "4W": "four wan",
  "5W": "five wan",
  "6W": "six wan",
  "7W": "seven wan",
  "8W": "eight wan",
  "9W": "nine wan",
  "1T": "one tiao",
  "2T": "two tiao",
  "3T": "three tiao",
  "4T": "four tiao",
  "5T": "five tiao",
  "6T": "six tiao",
  "7T": "seven tiao",
  "8T": "eight tiao",
  "9T": "nine tiao",
  "1B": "one tong",
  "2B": "two tong",
  "3B": "three tong",
  "4B": "four tong",
  "5B": "five tong",
  "6B": "six tong",
  "7B": "seven tong",
  "8B": "eight tong",
  "9B": "nine tong",
  E: "east wind",
  S: "south wind",
  Wn: "west wind",
  N: "north wind",
  R: "red dragon",
  G: "green dragon",
  Wh: "white dragon",
  Ch: "spring",
  Xi: "summer",
  Qi: "autumn",
  Do: "winter",
  Mm: "plum blossom",
  La: "orchid",
  Zh: "bamboo flower",
  Ju: "chrysanthemum"
});

export const TILE_CODE_SET = new Set(ALL_TILE_CODES);
export const CODE_TO_ID = new Map(
  ALL_TILE_CODES.map((code, id) => [code, id])
);
