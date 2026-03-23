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

function findStandardMelds(counts) {
  const keys = [...counts.keys()].filter((k) => counts.get(k) > 0).sort();
  if (keys.length === 0) return [];

  const first = keys[0];
  const c = counts.get(first);

  if (c >= 3) {
    counts.set(first, c - 3);
    const tail = findStandardMelds(counts);
    if (tail) {
      return [{ type: "pung", tiles: [first, first, first] }, ...tail];
    }
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
      const tail = findStandardMelds(counts);
      if (tail) return [{ type: "chow", tiles: [first, t2, t3] }, ...tail];
      counts.set(first, c);
      counts.set(t2, (counts.get(t2) || 0) + 1);
      counts.set(t3, (counts.get(t3) || 0) + 1);
    }
  }
  return null;
}

function groupKey(groups) {
  const parts = groups.map(
    (group) => `${group.type}:${[...group.tiles].sort().join(",")}`
  );
  return parts.sort().join("|");
}

function findAllStandardMelds(counts) {
  const keys = [...counts.keys()].filter((k) => counts.get(k) > 0).sort();
  if (keys.length === 0) return [[]];

  const first = keys[0];
  const c = counts.get(first);
  const all = [];

  if (c >= 3) {
    counts.set(first, c - 3);
    const tails = findAllStandardMelds(counts);
    for (const tail of tails) {
      all.push([{ type: "pung", tiles: [first, first, first] }, ...tail]);
    }
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
      const tails = findAllStandardMelds(counts);
      for (const tail of tails) {
        all.push([{ type: "chow", tiles: [first, t2, t3] }, ...tail]);
      }
      counts.set(first, c);
      counts.set(t2, (counts.get(t2) || 0) + 1);
      counts.set(t3, (counts.get(t3) || 0) + 1);
    }
  }
  return all;
}

export function enumerateStandardWinGroups(tiles) {
  const counts = countTiles(tiles);
  const all = [];
  const seen = new Set();
  for (const [tile, n] of counts.entries()) {
    if (n < 2) continue;
    const nextCounts = cloneCounts(counts);
    nextCounts.set(tile, n - 2);
    const meldOptions = findAllStandardMelds(nextCounts);
    for (const melds of meldOptions) {
      const groups = [...melds, { type: "pair", tiles: [tile, tile] }];
      const key = groupKey(groups);
      if (seen.has(key)) continue;
      seen.add(key);
      all.push(groups);
    }
  }
  return all;
}

function standardWinGroups(tiles) {
  const all = enumerateStandardWinGroups(tiles);
  if (all.length === 0) return null;
  return all[0];
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

function sevenPairsGroups(tiles) {
  const counts = countTiles(tiles);
  const groups = [];
  for (const [tile, n] of [...counts.entries()].sort()) {
    if (n !== 2) continue;
    groups.push({ type: "pair", tiles: [tile, tile] });
  }
  return groups;
}

/**
 * Validate win pattern for one 14-tile hand.
 *
 * @param {string[]} tiles - Tile code list.
 * @returns {{isWin: boolean, pattern: string|null}}
 */
export function validateWin(tiles) {
  if (!Array.isArray(tiles) || tiles.length !== 14) {
    return { isWin: false, pattern: null, meldGroups: [] };
  }

  if (isThirteenOrphans(tiles)) {
    return {
      isWin: true,
      pattern: "thirteen_orphans",
      meldGroups: [{ type: "orphans", tiles: [...tiles].sort() }]
    };
  }
  if (isSevenPairs(tiles)) {
    return {
      isWin: true,
      pattern: "seven_pairs",
      meldGroups: sevenPairsGroups(tiles)
    };
  }
  const standardGroups = standardWinGroups(tiles);
  if (standardGroups) {
    return {
      isWin: true,
      pattern: "standard",
      meldGroups: standardGroups
    };
  }
  return { isWin: false, pattern: null, meldGroups: [] };
}
