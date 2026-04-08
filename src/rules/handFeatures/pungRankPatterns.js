/**
 * Purpose: Pung-rank multiset patterns across suits.
 * Description:
 * - Built from standard `win.meldGroups` pungs.
 */
import { SUITS } from "./constants.js";
import { tileRank, tileSuit } from "./tileBasics.js";

export function collectPungRanksBySuit(win = {}) {
  const pungRanksBySuit = { W: [], T: [], B: [] };
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return pungRanksBySuit;
  }
  for (const group of win.meldGroups) {
    if (group.type !== "pung" || !Array.isArray(group.tiles)) continue;
    const first = group.tiles[0];
    const suit = tileSuit(first);
    if (!SUITS.includes(suit)) continue;
    const rank = Number.parseInt(first[0], 10);
    if (Number.isNaN(rank)) continue;
    pungRanksBySuit[suit].push(rank);
  }
  return pungRanksBySuit;
}

export function detectPureFourShiftedPungs(pungRanksBySuit) {
  for (const suit of SUITS) {
    const ranks = [...new Set(pungRanksBySuit[suit])].sort((a, b) => a - b);
    if (ranks.length < 4) continue;
    for (let i = 0; i + 3 < ranks.length; i += 1) {
      const seq = ranks.slice(i, i + 4);
      if (
        seq[0] + 1 === seq[1]
        && seq[1] + 1 === seq[2]
        && seq[2] + 1 === seq[3]
      ) {
        return true;
      }
    }
  }
  return false;
}

export function detectPureShiftedPungs(pungRanksBySuit) {
  for (const suit of SUITS) {
    const ranks = [...new Set(pungRanksBySuit[suit])].sort((a, b) => a - b);
    for (let i = 0; i + 2 < ranks.length; i += 1) {
      if (
        ranks[i] + 1 === ranks[i + 1]
        && ranks[i + 1] + 1 === ranks[i + 2]
      ) {
        return true;
      }
    }
  }
  return false;
}

export function detectMixedShiftedPungs(pungRanksBySuit) {
  for (const w of pungRanksBySuit.W) {
    for (const t of pungRanksBySuit.T) {
      for (const b of pungRanksBySuit.B) {
        const sorted = [w, t, b].sort((a, c) => a - c);
        if (sorted[0] + 1 === sorted[1] && sorted[1] + 1 === sorted[2]) {
          return true;
        }
      }
    }
  }
  return false;
}

export function countSuitedPungSuitsByRank(win = {}) {
  const rankToSuits = new Map();
  if (!Array.isArray(win.meldGroups)) return rankToSuits;
  for (const group of win.meldGroups) {
    if (group.type !== "pung" || !Array.isArray(group.tiles)) continue;
    const tile = group.tiles[0];
    const suit = tileSuit(tile);
    if (!SUITS.includes(suit)) continue;
    const rank = tileRank(tile);
    if (!rank) continue;
    const suits = rankToSuits.get(rank) || new Set();
    suits.add(suit);
    rankToSuits.set(rank, suits);
  }
  return rankToSuits;
}

export function detectSameRankPungCounts(rankToSuits, targetCount) {
  for (const suits of rankToSuits.values()) {
    if (suits.size >= targetCount) return true;
  }
  return false;
}
