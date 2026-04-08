/**
 * Purpose: Standard-pattern meld shape helpers (pungs, chows, 清龙).
 * Description:
 * - Reads `win.meldGroups` for 4+1 standard wins only.
 */
import { SUITS } from "./constants.js";
import { tileSuit } from "./tileBasics.js";

export function detectAllPungs(win = {}) {
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return false;
  }
  const meldGroups = win.meldGroups;
  const pairCount = meldGroups.filter((g) => g.type === "pair").length;
  if (pairCount !== 1) return false;
  return meldGroups.every((g) => g.type === "pair" || g.type === "pung");
}

export function detectPureStraight(win = {}) {
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return false;
  }
  const chowStartsBySuit = { W: new Set(), T: new Set(), B: new Set() };
  for (const group of win.meldGroups) {
    if (group.type !== "chow" || !Array.isArray(group.tiles)) continue;
    const first = group.tiles[0];
    const suit = tileSuit(first);
    if (!SUITS.includes(suit)) continue;
    const rank = Number.parseInt(first[0], 10);
    if (Number.isNaN(rank)) continue;
    chowStartsBySuit[suit].add(rank);
  }
  for (const suit of SUITS) {
    const starts = chowStartsBySuit[suit];
    if (starts.has(1) && starts.has(4) && starts.has(7)) {
      return true;
    }
  }
  return false;
}

export function collectChowStartsBySuit(win = {}) {
  const chowStartsBySuit = { W: [], T: [], B: [] };
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return chowStartsBySuit;
  }
  for (const group of win.meldGroups) {
    if (group.type !== "chow" || !Array.isArray(group.tiles)) continue;
    const first = group.tiles[0];
    const suit = tileSuit(first);
    if (!SUITS.includes(suit)) continue;
    const rank = Number.parseInt(first[0], 10);
    if (Number.isNaN(rank)) continue;
    chowStartsBySuit[suit].push(rank);
  }
  return chowStartsBySuit;
}

export function detectAllChows(win = {}) {
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return false;
  }
  const meldGroups = win.meldGroups;
  const pairCount = meldGroups.filter((g) => g.type === "pair").length;
  if (pairCount !== 1) return false;
  return meldGroups.every((g) => g.type === "pair" || g.type === "chow");
}
