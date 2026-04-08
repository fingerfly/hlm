/**
 * Purpose: Wind / dragon meld counts and wind-pung collection.
 * Description:
 * - Used for 门风 / 圈风 / 四喜 / 三元 / 大三风 / 同刻 features.
 */
import { DRAGONS, WINDS } from "./constants.js";

export function collectWindPungs(win = {}) {
  const windPungs = new Set();
  if (!Array.isArray(win.meldGroups)) return windPungs;
  for (const group of win.meldGroups) {
    if (group.type !== "pung" || !Array.isArray(group.tiles)) continue;
    const tile = group.tiles[0];
    if (WINDS.has(tile)) {
      windPungs.add(tile);
    }
  }
  return windPungs;
}

export function countHonorMelds(win = {}) {
  const counts = {
    windPungs: 0,
    windPairs: 0,
    dragonPungs: 0,
    dragonPairs: 0
  };
  if (!Array.isArray(win.meldGroups)) return counts;
  for (const group of win.meldGroups) {
    if (!Array.isArray(group.tiles) || group.tiles.length === 0) continue;
    const tile = group.tiles[0];
    if (group.type === "pung") {
      if (WINDS.has(tile)) counts.windPungs += 1;
      if (DRAGONS.has(tile)) counts.dragonPungs += 1;
    }
    if (group.type === "pair") {
      if (WINDS.has(tile)) counts.windPairs += 1;
      if (DRAGONS.has(tile)) counts.dragonPairs += 1;
    }
  }
  return counts;
}
