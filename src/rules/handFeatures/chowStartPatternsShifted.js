/**
 * Purpose: Shifted chow patterns (pure / mixed across suits).
 * Description:
 * - Operates on `collectChowStartsBySuit` output only.
 */
import { SUITS } from "./constants.js";

export function detectMixedShiftedChows(chowStartsBySuit) {
  for (const w of chowStartsBySuit.W) {
    for (const t of chowStartsBySuit.T) {
      for (const b of chowStartsBySuit.B) {
        const sorted = [w, t, b].sort((a, c) => a - c);
        if (
          sorted[0] + 1 === sorted[1]
          && sorted[1] + 1 === sorted[2]
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

export function detectPureShiftedChows(chowStartsBySuit) {
  for (const suit of SUITS) {
    const starts = [...new Set(chowStartsBySuit[suit])].sort((a, b) => a - b);
    for (let i = 0; i < starts.length; i += 1) {
      for (let j = i + 1; j < starts.length; j += 1) {
        for (let k = j + 1; k < starts.length; k += 1) {
          const a = starts[i];
          const b = starts[j];
          const c = starts[k];
          const step1 = b - a;
          const step2 = c - b;
          if ((step1 === 1 && step2 === 1) || (step1 === 2 && step2 === 2)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export function detectPureTripleChow(chowStartsBySuit) {
  for (const suit of SUITS) {
    const counts = new Map();
    for (const start of chowStartsBySuit[suit]) {
      counts.set(start, (counts.get(start) || 0) + 1);
      if (counts.get(start) >= 3) return true;
    }
  }
  return false;
}

export function detectPureFourSameChow(chowStartsBySuit) {
  for (const suit of SUITS) {
    const counts = new Map();
    for (const start of chowStartsBySuit[suit]) {
      counts.set(start, (counts.get(start) || 0) + 1);
      if (counts.get(start) >= 4) return true;
    }
  }
  return false;
}

export function detectPureFourShiftedChows(chowStartsBySuit) {
  for (const suit of SUITS) {
    const starts = [...new Set(chowStartsBySuit[suit])].sort((a, b) => a - b);
    if (starts.length < 4) continue;
    for (let i = 0; i + 3 < starts.length; i += 1) {
      const seq = starts.slice(i, i + 4);
      const d1 = seq[1] - seq[0];
      const d2 = seq[2] - seq[1];
      const d3 = seq[3] - seq[2];
      if (
        (d1 === 1 && d2 === 1 && d3 === 1)
        || (d1 === 2 && d2 === 2 && d3 === 2)
      ) {
        return true;
      }
    }
  }
  return false;
}
