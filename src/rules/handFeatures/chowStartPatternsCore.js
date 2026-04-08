/**
 * Purpose: Chow-start multiset patterns (steps, mixed straights).
 * Description:
 * - Operates on `collectChowStartsBySuit` output only.
 */
import { SUITS } from "./constants.js";

export function detectPureDoubleChow(chowStartsBySuit) {
  for (const suit of SUITS) {
    const counts = new Map();
    for (const start of chowStartsBySuit[suit]) {
      counts.set(start, (counts.get(start) || 0) + 1);
      if (counts.get(start) >= 2) return true;
    }
  }
  return false;
}

export function detectMixedTripleChow(chowStartsBySuit) {
  const allStarts = new Set([
    ...chowStartsBySuit.W,
    ...chowStartsBySuit.T,
    ...chowStartsBySuit.B
  ]);
  for (const start of allStarts) {
    if (
      chowStartsBySuit.W.includes(start)
      && chowStartsBySuit.T.includes(start)
      && chowStartsBySuit.B.includes(start)
    ) {
      return true;
    }
  }
  return false;
}

export function detectMixedDoubleChow(chowStartsBySuit) {
  const allStarts = new Set([
    ...chowStartsBySuit.W,
    ...chowStartsBySuit.T,
    ...chowStartsBySuit.B
  ]);
  for (const start of allStarts) {
    let suitCount = 0;
    if (chowStartsBySuit.W.includes(start)) suitCount += 1;
    if (chowStartsBySuit.T.includes(start)) suitCount += 1;
    if (chowStartsBySuit.B.includes(start)) suitCount += 1;
    if (suitCount >= 2) return true;
  }
  return false;
}

export function detectShortStraight(chowStartsBySuit) {
  for (const suit of SUITS) {
    const starts = new Set(chowStartsBySuit[suit]);
    for (const start of starts) {
      if (starts.has(start + 3)) return true;
    }
  }
  return false;
}

export function detectTwoTerminalChows(chowStartsBySuit) {
  for (const suit of SUITS) {
    const starts = new Set(chowStartsBySuit[suit]);
    if (starts.has(1) && starts.has(7)) return true;
  }
  return false;
}

export function detectMixedStraight(chowStartsBySuit) {
  const permutations = [
    ["W", "T", "B"],
    ["W", "B", "T"],
    ["T", "W", "B"],
    ["T", "B", "W"],
    ["B", "W", "T"],
    ["B", "T", "W"]
  ];
  for (const [s1, s4, s7] of permutations) {
    if (
      chowStartsBySuit[s1].includes(1)
      && chowStartsBySuit[s4].includes(4)
      && chowStartsBySuit[s7].includes(7)
    ) {
      return true;
    }
  }
  return false;
}
