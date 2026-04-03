import { getFanDisplayName } from "../rules/fanRegistry.js";
import { getFanLexiconText } from "../config/fanLexicon.js";

/**
 * Purpose: Translate scoring payload into UI-friendly result view model.
 * Description:
 * - Maps status, pattern, and fan ids to display text.
 * - Normalizes missing values for stable rendering.
 * - Keeps original payload for detail drawer display.
 */
const STATUS_TEXT = Object.freeze({
  manual_ready: "手动输入已就绪",
  manual_invalid: "手牌输入无效"
});

const WIN_PATTERN_TEXT = Object.freeze({
  standard: "基本和型",
  seven_pairs: "七对",
  thirteen_orphans: "十三幺"
});

/**
 * Map one fan item into localized display fields.
 *
 * @param {{id: string, fan: number}} item - Raw fan item.
 * @returns {{id: string, fan: number, name: string, detailText: string}}
 */
function mapFanItem(item) {
  return {
    ...item,
    name: getFanDisplayName(item.id),
    detailText: getFanLexiconText(item.id)
  };
}

/**
 * Build render model consumed by the result modal.
 *
 * @param {object} result - End-to-end evaluation result payload.
 * @returns {object}
 */
export function buildResultViewModel(result) {
  const status = result?.recognition?.status || "";
  const scoring = result?.scoring || {};
  const pattern = scoring.winPattern;
  return {
    statusText: STATUS_TEXT[status] || status || "未知状态",
    winText: scoring.isWin ? "和牌" : "未和牌",
    totalFan: Number(scoring.totalFan || 0),
    minWinningFan: Number(scoring.minWinningFan || 0),
    winPatternText: WIN_PATTERN_TEXT[pattern] || "未成和",
    explanation: result?.explanation || "",
    meldGroups: scoring.meldGroups || [],
    matchedFans: (scoring.matchedFans || []).map(mapFanItem),
    excludedFans: (scoring.excludedFans || []).map(mapFanItem),
    settlement: result?.settlement || null,
    raw: result
  };
}
