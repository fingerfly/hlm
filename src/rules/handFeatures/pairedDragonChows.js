/**
 * Purpose: 一色双龙会 / 三色双龙会 chow+pair structure.
 * Description:
 * - Standard pattern only; inspects chow starts and pair tile.
 */
import { SUITS } from "./constants.js";
import { tileRank, tileSuit } from "./tileBasics.js";

export function detectPureDoubleDragon(win = {}) {
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return false;
  }
  const chowStartsBySuit = { W: [], T: [], B: [] };
  let pairTile = null;
  for (const group of win.meldGroups) {
    if (group.type === "pair" && Array.isArray(group.tiles)) {
      pairTile = group.tiles[0];
    }
    if (group.type === "chow" && Array.isArray(group.tiles)) {
      const first = group.tiles[0];
      const suit = tileSuit(first);
      if (!SUITS.includes(suit)) continue;
      chowStartsBySuit[suit].push(Number.parseInt(first[0], 10));
    }
  }
  if (!pairTile) return false;
  for (const suit of SUITS) {
    const starts = chowStartsBySuit[suit];
    const c1 = starts.filter((n) => n === 1).length;
    const c7 = starts.filter((n) => n === 7).length;
    if (c1 >= 2 && c7 >= 2 && pairTile === `5${suit}`) return true;
  }
  return false;
}

export function detectThreeColorDoubleDragon(win = {}) {
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return false;
  }
  const chowStartsBySuit = { W: [], T: [], B: [] };
  let pairTile = null;
  for (const group of win.meldGroups) {
    if (group.type === "pair" && Array.isArray(group.tiles)) {
      pairTile = group.tiles[0];
    }
    if (group.type === "chow" && Array.isArray(group.tiles)) {
      const first = group.tiles[0];
      const suit = tileSuit(first);
      if (!SUITS.includes(suit)) continue;
      chowStartsBySuit[suit].push(Number.parseInt(first[0], 10));
    }
  }
  if (!pairTile || tileSuit(pairTile) === "Z" || tileRank(pairTile) !== "5") {
    return false;
  }
  const pairSuit = tileSuit(pairTile);
  const otherSuits = SUITS.filter((suit) => suit !== pairSuit);
  for (const suit of otherSuits) {
    const starts = chowStartsBySuit[suit];
    if (!(starts.includes(1) && starts.includes(7))) return false;
  }
  return true;
}
