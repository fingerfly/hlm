/**
 * Purpose: Per-tile parsing and coarse hand statistics.
 * Description:
 * - Suit/rank helpers and suit histogram for feature flags.
 */
import { HONORS, SUITS, TERMINAL_RANKS } from "./constants.js";

export function tileSuit(tile) {
  const suit = tile.slice(-1);
  if (SUITS.includes(suit)) return suit;
  return "Z";
}

export function tileRank(tile) {
  if (tileSuit(tile) === "Z") return null;
  return tile[0];
}

export function computeSuitStats(tiles) {
  const suits = new Set();
  let hasHonors = false;
  for (const tile of tiles) {
    const suit = tileSuit(tile);
    if (suit === "Z") hasHonors = true;
    else suits.add(suit);
  }
  return {
    suits,
    hasHonors,
    oneSuitOnly: suits.size === 1
  };
}

export function computeTerminalHonorFlags(tiles) {
  let hasHonors = false;
  let hasTerminals = false;
  let allHonors = true;
  let allTerminals = true;
  let allTerminalsOrHonors = true;
  for (const tile of tiles) {
    const isHonor = HONORS.has(tile);
    const isTerminal = !isHonor && TERMINAL_RANKS.has(tileRank(tile));
    if (isHonor) hasHonors = true;
    if (isTerminal) hasTerminals = true;
    if (!isHonor) allHonors = false;
    if (!isTerminal) allTerminals = false;
    if (!(isHonor || isTerminal)) allTerminalsOrHonors = false;
  }
  return {
    hasHonors,
    hasTerminals,
    allHonors,
    allTerminals,
    allTerminalsOrHonors
  };
}
