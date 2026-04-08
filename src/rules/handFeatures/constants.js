/**
 * Purpose: Shared tile / meld constants for hand feature extraction.
 * Description:
 * - Suits, terminals, honors, and special tile sets for predicates.
 * - Used by tileBasics, meld helpers, and composition detectors.
 */

export const SUITS = ["W", "T", "B"];
export const TERMINAL_RANKS = new Set(["1", "9"]);
export const HONORS = new Set(["E", "S", "Wn", "N", "R", "G", "Wh"]);
export const WINDS = new Set(["E", "S", "Wn", "N"]);
export const DRAGONS = new Set(["R", "G", "Wh"]);
export const GREEN_TILES = new Set([
  "2T", "3T", "4T", "6T", "8T", "G"
]);
export const TUI_BU_DAO_TILES = new Set([
  "1T", "2T", "3T", "4T", "5T", "8T", "9T",
  "2B", "4B", "5B", "6B", "8B", "9B",
  "Wh"
]);
export const SI_GUI_YI_MELD_TYPES = new Set([
  "chow", "pung", "pair"
]);
