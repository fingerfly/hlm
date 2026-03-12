/**
 * Purpose: Validate whether a 14-tile hand forms a legal win.
 * Description:
 * - Supports standard hand, seven pairs, and thirteen orphans.
 * - Uses recursive meld removal for standard hand detection.
 * - Returns both win boolean and matched pattern identifier.
 */
function countTiles(tiles) {
  const counts = new Map();
  for (const t of tiles) {
    counts.set(t, (counts.get(t) || 0) + 1);
  }
  return counts;
}

function tileSuit(tile) {
  const suit = tile.slice(-1);
  if (["W", "T", "B"].includes(suit)) return suit;
  return "Z";
}

function tileRank(tile) {
  if (tileSuit(tile) === "Z") return null;
  return Number.parseInt(tile[0], 10);
}

function cloneCounts(map) {
  return new Map(map);
}

function tryRemoveMelds(counts) {
  const keys = [...counts.keys()].filter((k) => counts.get(k) > 0).sort();
  if (keys.length === 0) return true;

  const first = keys[0];
  const c = counts.get(first);
  if (c >= 3) {
    counts.set(first, c - 3);
    if (tryRemoveMelds(counts)) return true;
    counts.set(first, c);
  }

  const suit = tileSuit(first);
  const rank = tileRank(first);
  if (suit !== "Z" && rank <= 7) {
    const t2 = `${rank + 1}${suit}`;
    const t3 = `${rank + 2}${suit}`;
    if ((counts.get(t2) || 0) > 0 && (counts.get(t3) || 0) > 0) {
      counts.set(first, c - 1);
      counts.set(t2, (counts.get(t2) || 0) - 1);
      counts.set(t3, (counts.get(t3) || 0) - 1);
      if (tryRemoveMelds(counts)) return true;
      counts.set(first, c);
      counts.set(t2, (counts.get(t2) || 0) + 1);
      counts.set(t3, (counts.get(t3) || 0) + 1);
    }
  }

  return false;
}

function isStandardWin(tiles) {
  const counts = countTiles(tiles);
  for (const [tile, n] of counts.entries()) {
    if (n >= 2) {
      const c = cloneCounts(counts);
      c.set(tile, n - 2);
      if (tryRemoveMelds(c)) {
        return true;
      }
    }
  }
  return false;
}

function isSevenPairs(tiles) {
  const counts = countTiles(tiles);
  if (counts.size !== 7) return false;
  return [...counts.values()].every((n) => n === 2);
}

function isThirteenOrphans(tiles) {
  const required = new Set([
    "1W", "9W", "1T", "9T", "1B", "9B",
    "E", "S", "Wn", "N", "R", "G", "Wh"
  ]);
  const counts = countTiles(tiles);
  for (const tile of required) {
    if (!counts.has(tile)) return false;
  }
  let pairFound = false;
  for (const [tile, n] of counts.entries()) {
    if (required.has(tile)) {
      if (n === 2 && !pairFound) {
        pairFound = true;
      } else if (n !== 1) {
        return false;
      }
    } else {
      return false;
    }
  }
  return pairFound;
}

/**
 * Validate win pattern for one 14-tile hand.
 *
 * @param {string[]} tiles - Tile code list.
 * @returns {{isWin: boolean, pattern: string|null}}
 */
export function validateWin(tiles) {
  if (!Array.isArray(tiles) || tiles.length !== 14) {
    return { isWin: false, pattern: null };
  }

  if (isThirteenOrphans(tiles)) {
    return { isWin: true, pattern: "thirteen_orphans" };
  }
  if (isSevenPairs(tiles)) return { isWin: true, pattern: "seven_pairs" };
  if (isStandardWin(tiles)) return { isWin: true, pattern: "standard" };
  return { isWin: false, pattern: null };
}
