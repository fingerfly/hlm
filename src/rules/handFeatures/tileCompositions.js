/**
 * Purpose: Whole-hand tile multiset predicates (no meld decomposition).
 * Description:
 * - 绿一色 / 推不倒 / 九莲 / 连七对 / 五门齐 / 组合龙 / rank bands.
 */
import {
  DRAGONS,
  HONORS,
  SUITS,
  GREEN_TILES,
  TUI_BU_DAO_TILES,
  WINDS
} from "./constants.js";
import { tileRank, tileSuit } from "./tileBasics.js";

export function detectAllRanksInRange(tiles, low, high) {
  for (const tile of tiles) {
    if (HONORS.has(tile)) return false;
    const rank = Number.parseInt(tileRank(tile), 10);
    if (Number.isNaN(rank)) return false;
    if (rank < low || rank > high) return false;
  }
  return true;
}

export function detectAllGreen(tiles) {
  return tiles.every((tile) => GREEN_TILES.has(tile));
}

export function detectTuiBuDao(tiles) {
  return tiles.every((tile) => TUI_BU_DAO_TILES.has(tile));
}

export function detectNineGates(tiles) {
  const suitSet = new Set(tiles.map((tile) => tileSuit(tile)));
  if (suitSet.size !== 1 || suitSet.has("Z")) return false;
  const counts = new Map();
  for (const tile of tiles) {
    const rank = Number.parseInt(tileRank(tile), 10);
    counts.set(rank, (counts.get(rank) || 0) + 1);
  }
  if ((counts.get(1) || 0) < 3 || (counts.get(9) || 0) < 3) return false;
  for (let rank = 2; rank <= 8; rank += 1) {
    if ((counts.get(rank) || 0) < 1) return false;
  }
  return true;
}

export function detectSevenShiftedPairs(tiles, winPattern) {
  if (winPattern !== "seven_pairs") return false;
  const suitSet = new Set(tiles.map((tile) => tileSuit(tile)));
  if (suitSet.size !== 1 || suitSet.has("Z")) return false;
  const counts = new Map();
  for (const tile of tiles) {
    const rank = Number.parseInt(tileRank(tile), 10);
    counts.set(rank, (counts.get(rank) || 0) + 1);
  }
  const ranks = [...counts.keys()].sort((a, b) => a - b);
  if (ranks.length !== 7) return false;
  if (!ranks.every((rank, idx) => idx === 0 || rank === ranks[idx - 1] + 1)) {
    return false;
  }
  return ranks.every((rank) => counts.get(rank) === 2);
}

export function detectFiveGates(tiles) {
  const suits = new Set();
  let hasWind = false;
  let hasDragon = false;
  for (const tile of tiles) {
    const suit = tileSuit(tile);
    if (SUITS.includes(suit)) suits.add(suit);
    if (WINDS.has(tile)) hasWind = true;
    if (DRAGONS.has(tile)) hasDragon = true;
  }
  return suits.size === 3 && hasWind && hasDragon;
}

export function detectZuHeLong(tiles) {
  const perms = [
    ["W", "T", "B"],
    ["W", "B", "T"],
    ["T", "W", "B"],
    ["T", "B", "W"],
    ["B", "W", "T"],
    ["B", "T", "W"]
  ];
  for (const [s147, s258, s369] of perms) {
    const required = [
      `1${s147}`, `4${s147}`, `7${s147}`,
      `2${s258}`, `5${s258}`, `8${s258}`,
      `3${s369}`, `6${s369}`, `9${s369}`
    ];
    if (required.every((tile) => tiles.includes(tile))) return true;
  }
  return false;
}
