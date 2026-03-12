/**
 * Purpose: Derive fan-relevant features from tile list.
 * Description:
 * - Computes suit distribution and honor presence.
 * - Detects simple/terminal-honor composition flags.
 * - Returns feature payload shared by fan detectors.
 */
const SUITS = ["W", "T", "B"];
const TERMINAL_RANKS = new Set(["1", "9"]);
const HONORS = new Set(["E", "S", "Wn", "N", "R", "G", "Wh"]);

function tileSuit(tile) {
  const suit = tile.slice(-1);
  if (SUITS.includes(suit)) return suit;
  return "Z";
}

function tileRank(tile) {
  if (tileSuit(tile) === "Z") return null;
  return tile[0];
}

function computeSuitStats(tiles) {
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

/**
 * Extract reusable hand-level features for fan rules.
 *
 * @param {{tiles?: string[]}} input - Validated hand input.
 * @param {{pattern?: string}} [win={}] - Win metadata.
 * @returns {object}
 */
export function extractHandFeatures(input, win = {}) {
  const tiles = input.tiles || [];
  const stats = computeSuitStats(tiles);
  const allSimples = tiles.every((tile) => {
    if (HONORS.has(tile)) return false;
    return !TERMINAL_RANKS.has(tileRank(tile));
  });
  const allTerminalsAndHonors = tiles.every((tile) => {
    if (HONORS.has(tile)) return true;
    return TERMINAL_RANKS.has(tileRank(tile));
  });
  return {
    winPattern: win.pattern || null,
    oneSuitOnly: stats.oneSuitOnly,
    mixedOneSuit: stats.oneSuitOnly && stats.hasHonors,
    pureOneSuit: stats.oneSuitOnly && !stats.hasHonors,
    allSimples,
    allTerminalsAndHonors
  };
}
