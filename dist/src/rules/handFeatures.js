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
const WINDS = new Set(["E", "S", "Wn", "N"]);
const DRAGONS = new Set(["R", "G", "Wh"]);
const GREEN_TILES = new Set(["2T", "3T", "4T", "6T", "8T", "G"]);

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

function detectAllPungs(win = {}) {
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return false;
  }
  const meldGroups = win.meldGroups;
  const pairCount = meldGroups.filter((g) => g.type === "pair").length;
  if (pairCount !== 1) return false;
  return meldGroups.every((g) => g.type === "pair" || g.type === "pung");
}

function computeTerminalHonorFlags(tiles) {
  let hasHonors = false;
  let hasTerminals = false;
  let allHonors = true;
  let allTerminals = true;
  let allTerminalsOrHonors = true;
  for (const tile of tiles) {
    const isHonor = HONORS.has(tile);
    const isTerminal = !isHonor && TERMINAL_RANKS.has(tileRank(tile));
    if (isHonor) hasHonors = true;
    if (isTerminal) hasTerminals = true;
    if (!isHonor) allHonors = false;
    if (!isTerminal) allTerminals = false;
    if (!(isHonor || isTerminal)) allTerminalsOrHonors = false;
  }
  return {
    hasHonors,
    hasTerminals,
    allHonors,
    allTerminals,
    allTerminalsOrHonors
  };
}

function detectPureStraight(win = {}) {
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return false;
  }
  const chowStartsBySuit = {
    W: new Set(),
    T: new Set(),
    B: new Set()
  };
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

function collectChowStartsBySuit(win = {}) {
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

function detectAllChows(win = {}) {
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return false;
  }
  const meldGroups = win.meldGroups;
  const pairCount = meldGroups.filter((g) => g.type === "pair").length;
  if (pairCount !== 1) return false;
  return meldGroups.every((g) => g.type === "pair" || g.type === "chow");
}

function detectPureDoubleChow(chowStartsBySuit) {
  for (const suit of SUITS) {
    const counts = new Map();
    for (const start of chowStartsBySuit[suit]) {
      counts.set(start, (counts.get(start) || 0) + 1);
      if (counts.get(start) >= 2) return true;
    }
  }
  return false;
}

function detectMixedTripleChow(chowStartsBySuit) {
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

function detectMixedDoubleChow(chowStartsBySuit) {
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

function detectShortStraight(chowStartsBySuit) {
  for (const suit of SUITS) {
    const starts = new Set(chowStartsBySuit[suit]);
    for (const start of starts) {
      if (starts.has(start + 3)) return true;
    }
  }
  return false;
}

function detectTwoTerminalChows(chowStartsBySuit) {
  for (const suit of SUITS) {
    const starts = new Set(chowStartsBySuit[suit]);
    if (starts.has(1) && starts.has(7)) return true;
  }
  return false;
}

function detectMixedStraight(chowStartsBySuit) {
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

function detectMixedShiftedChows(chowStartsBySuit) {
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

function detectPureShiftedChows(chowStartsBySuit) {
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

function detectAllRanksInRange(tiles, low, high) {
  for (const tile of tiles) {
    if (HONORS.has(tile)) return false;
    const rank = Number.parseInt(tileRank(tile), 10);
    if (Number.isNaN(rank)) return false;
    if (rank < low || rank > high) return false;
  }
  return true;
}

function collectWindPungs(win = {}) {
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

function countHonorMelds(win = {}) {
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

function countSuitedPungSuitsByRank(win = {}) {
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

function detectSameRankPungCounts(rankToSuits, targetCount) {
  for (const suits of rankToSuits.values()) {
    if (suits.size >= targetCount) return true;
  }
  return false;
}

function detectAllGreen(tiles) {
  return tiles.every((tile) => GREEN_TILES.has(tile));
}

function detectNineGates(tiles) {
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

function detectSevenShiftedPairs(tiles, winPattern) {
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

function collectPungRanksBySuit(win = {}) {
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

function detectPureTripleChow(chowStartsBySuit) {
  for (const suit of SUITS) {
    const counts = new Map();
    for (const start of chowStartsBySuit[suit]) {
      counts.set(start, (counts.get(start) || 0) + 1);
      if (counts.get(start) >= 3) return true;
    }
  }
  return false;
}

function detectPureFourSameChow(chowStartsBySuit) {
  for (const suit of SUITS) {
    const counts = new Map();
    for (const start of chowStartsBySuit[suit]) {
      counts.set(start, (counts.get(start) || 0) + 1);
      if (counts.get(start) >= 4) return true;
    }
  }
  return false;
}

function detectPureFourShiftedChows(chowStartsBySuit) {
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

function detectPureShiftedPungs(pungRanksBySuit) {
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

function detectMixedShiftedPungs(pungRanksBySuit) {
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

function detectAnyDragonPung(win = {}) {
  if (!Array.isArray(win.meldGroups)) return false;
  return win.meldGroups.some((group) => (
    group.type === "pung"
    && Array.isArray(group.tiles)
    && DRAGONS.has(group.tiles[0])
  ));
}

function detectTerminalHonorPung(win = {}) {
  if (!Array.isArray(win.meldGroups)) return false;
  return win.meldGroups.some((group) => {
    if (group.type !== "pung" || !Array.isArray(group.tiles)) return false;
    const tile = group.tiles[0];
    if (HONORS.has(tile)) return true;
    return TERMINAL_RANKS.has(tileRank(tile));
  });
}

function detectOutsideHand(win = {}) {
  if (!Array.isArray(win.meldGroups)) return false;
  return win.meldGroups.every((group) => {
    if (!Array.isArray(group.tiles)) return false;
    return group.tiles.some((tile) => {
      if (HONORS.has(tile)) return true;
      return TERMINAL_RANKS.has(tileRank(tile));
    });
  });
}

function detectAllSetsContainFive(win = {}) {
  if (!Array.isArray(win.meldGroups)) return false;
  return win.meldGroups.every((group) => (
    Array.isArray(group.tiles)
    && group.tiles.some((tile) => tileRank(tile) === "5")
  ));
}

function detectFiveGates(tiles) {
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

function detectPureDoubleDragon(win = {}) {
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

function detectThreeColorDoubleDragon(win = {}) {
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
  const th = computeTerminalHonorFlags(tiles);
  const chowStartsBySuit = collectChowStartsBySuit(win);
  const pungRanksBySuit = collectPungRanksBySuit(win);
  const windPungs = collectWindPungs(win);
  const hm = countHonorMelds(win);
  const rankToPungSuits = countSuitedPungSuitsByRank(win);
  const seatWind = input.seatWind || null;
  const prevalentWind = input.prevalentWind || null;
  const allSimples = tiles.every((tile) => {
    if (HONORS.has(tile)) return false;
    return !TERMINAL_RANKS.has(tileRank(tile));
  });
  return {
    winPattern: win.pattern || null,
    oneSuitOnly: stats.oneSuitOnly,
    mixedOneSuit: stats.oneSuitOnly && stats.hasHonors,
    pureOneSuit: stats.oneSuitOnly && !stats.hasHonors,
    noHonors: !stats.hasHonors,
    oneVoidedSuit: stats.suits.size === 2,
    allSimples,
    allTerminalsAndHonors:
      th.allTerminalsOrHonors && th.hasHonors && th.hasTerminals,
    allHonors: th.allHonors,
    allTerminals: th.allTerminals,
    allPungs: detectAllPungs(win),
    pureStraight: detectPureStraight(win),
    allChows: detectAllChows(win),
    pureDoubleChow: detectPureDoubleChow(chowStartsBySuit),
    mixedTripleChow: detectMixedTripleChow(chowStartsBySuit),
    mixedDoubleChow: detectMixedDoubleChow(chowStartsBySuit),
    shortStraight: detectShortStraight(chowStartsBySuit),
    twoTerminalChows: detectTwoTerminalChows(chowStartsBySuit),
    mixedStraight: detectMixedStraight(chowStartsBySuit),
    mixedShiftedChows: detectMixedShiftedChows(chowStartsBySuit),
    pureShiftedChows: detectPureShiftedChows(chowStartsBySuit),
    daYuWu: detectAllRanksInRange(tiles, 6, 9),
    xiaoYuWu: detectAllRanksInRange(tiles, 1, 4),
    quanDa: detectAllRanksInRange(tiles, 7, 9),
    quanXiao: detectAllRanksInRange(tiles, 1, 3),
    quanZhong: detectAllRanksInRange(tiles, 4, 6),
    lvYiSe: detectAllGreen(tiles),
    jiuLianBaoDeng: detectNineGates(tiles),
    qiLianDui: detectSevenShiftedPairs(tiles, win.pattern),
    yiSeShuangLongHui: detectPureDoubleDragon(win),
    yiSeSiTongShun: detectPureFourSameChow(chowStartsBySuit),
    yiSeSiBuGao: detectPureFourShiftedChows(chowStartsBySuit),
    quanShuangKe:
      allSimples
      && detectAllRanksInRange(tiles, 2, 8)
      && detectAllPungs(win)
      && tiles.every((tile) => {
        if (HONORS.has(tile)) return false;
        const rank = Number.parseInt(tileRank(tile), 10);
        return rank % 2 === 0;
      }),
    yiSeSanTongShun: detectPureTripleChow(chowStartsBySuit),
    yiSeSanJieGao: detectPureShiftedPungs(pungRanksBySuit),
    sanSeSanJieGao: detectMixedShiftedPungs(pungRanksBySuit),
    quanDaiWu: detectAllSetsContainFive(win),
    wuMenQi: detectFiveGates(tiles),
    quanDaiYao: detectOutsideHand(win),
    jianKe: detectAnyDragonPung(win),
    yaoJiuKe: detectTerminalHonorPung(win),
    sanSeShuangLongHui: detectThreeColorDoubleDragon(win),
    daSanFeng: hm.windPungs >= 3,
    shuangJianKe: hm.dragonPungs >= 2,
    shuangTongKe: detectSameRankPungCounts(rankToPungSuits, 2),
    sanTongKe: detectSameRankPungCounts(rankToPungSuits, 3),
    seatWindPung: seatWind ? windPungs.has(seatWind) : false,
    prevalentWindPung: prevalentWind ? windPungs.has(prevalentWind) : false,
    bigFourWinds: hm.windPungs === 4,
    littleFourWinds: hm.windPungs === 3 && hm.windPairs === 1,
    bigThreeDragons: hm.dragonPungs === 3,
    littleThreeDragons: hm.dragonPungs === 2 && hm.dragonPairs === 1
  };
}
