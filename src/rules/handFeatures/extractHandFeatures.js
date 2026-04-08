/**
 * Purpose: Compose fan-relevant features from tiles + win metadata.
 * Description:
 * - Delegates to focused modules; single export for `fanDetectors`.
 */
import {
  detectMixedDoubleChow,
  detectMixedStraight,
  detectMixedTripleChow,
  detectPureDoubleChow,
  detectShortStraight,
  detectTwoTerminalChows
} from "./chowStartPatternsCore.js";
import {
  detectMixedShiftedChows,
  detectPureFourSameChow,
  detectPureFourShiftedChows,
  detectPureShiftedChows,
  detectPureTripleChow
} from "./chowStartPatternsShifted.js";
import { HONORS, TERMINAL_RANKS } from "./constants.js";
import { collectWindPungs, countHonorMelds } from "./honorMelds.js";
import {
  detectAllSetsContainFive,
  detectAnyDragonPung,
  detectOutsideHand,
  detectTerminalHonorPung
} from "./meldPresenceFlags.js";
import {
  detectPureDoubleDragon,
  detectThreeColorDoubleDragon
} from "./pairedDragonChows.js";
import {
  collectPungRanksBySuit,
  detectMixedShiftedPungs,
  detectPureFourShiftedPungs,
  detectPureShiftedPungs,
  detectSameRankPungCounts,
  countSuitedPungSuitsByRank
} from "./pungRankPatterns.js";
import { detectSiGuiYi } from "./siGuiYi.js";
import {
  collectChowStartsBySuit,
  detectAllChows,
  detectAllPungs,
  detectPureStraight
} from "./standardWinMelds.js";
import {
  computeSuitStats,
  computeTerminalHonorFlags,
  tileRank
} from "./tileBasics.js";
import {
  detectAllGreen,
  detectAllRanksInRange,
  detectFiveGates,
  detectNineGates,
  detectSevenShiftedPairs,
  detectTuiBuDao,
  detectZuHeLong
} from "./tileCompositions.js";

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
    tuiBuDao: detectTuiBuDao(tiles),
    jiuLianBaoDeng: detectNineGates(tiles),
    qiLianDui: detectSevenShiftedPairs(tiles, win.pattern),
    yiSeShuangLongHui: detectPureDoubleDragon(win),
    yiSeSiTongShun: detectPureFourSameChow(chowStartsBySuit),
    yiSeSiJieGao: detectPureFourShiftedPungs(pungRanksBySuit),
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
    zuHeLong: detectZuHeLong(tiles),
    daSanFeng: hm.windPungs >= 3,
    shuangJianKe: hm.dragonPungs >= 2,
    shuangTongKe: detectSameRankPungCounts(rankToPungSuits, 2),
    sanTongKe: detectSameRankPungCounts(rankToPungSuits, 3),
    seatWindPung: seatWind ? windPungs.has(seatWind) : false,
    prevalentWindPung: prevalentWind ? windPungs.has(prevalentWind) : false,
    bigFourWinds: hm.windPungs === 4,
    littleFourWinds: hm.windPungs === 3 && hm.windPairs === 1,
    bigThreeDragons: hm.dragonPungs === 3,
    littleThreeDragons: hm.dragonPungs === 2 && hm.dragonPairs === 1,
    siGuiYi: detectSiGuiYi(win)
  };
}
