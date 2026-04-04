import { SETTLEMENT_MODES } from "../config/scoreRuleConfig.js";

/**
 * Purpose: Sum fan values and evaluate minimum-win gate.
 * Description:
 * - Aggregates matched fan values into total fan.
 * - Computes gateFan by excluding configured fan ids (e.g. HUA_PAI).
 * - Compares gateFan to rule snapshot gateMinFan.
 */
const DEFAULT_SNAPSHOT = Object.freeze({
  gateMinFan: 1,
  gateExcludeFanIds: [],
  settlementMode: SETTLEMENT_MODES.COMPAT_LINEAR,
  officialBasePoint: 8
});

/**
 * Aggregate score from matched fan items.
 *
 * @param {object[]} matchedFans - Entries with fan totals (optional id).
 * @param {object|null|undefined} snapshot - Gate rule snapshot
 *   (gateMinFan, gateExcludeFanIds).
 * @returns {{totalFan: number, gateFan: number,
 *   reachesMinWinningFan: boolean}}
 */
export function aggregateScore(matchedFans, snapshot) {
  const s = snapshot && typeof snapshot === "object"
    ? snapshot
    : DEFAULT_SNAPSHOT;
  const exclude = new Set(s.gateExcludeFanIds || []);
  const totalFan = matchedFans.reduce((sum, f) => sum + f.fan, 0);
  const excludedFan = matchedFans
    .filter((f) => f.id && exclude.has(f.id))
    .reduce((sum, f) => sum + f.fan, 0);
  const gateFan = Math.max(0, totalFan - excludedFan);
  const gateMinFan = Number.isInteger(s.gateMinFan) && s.gateMinFan >= 0
    ? s.gateMinFan
    : 1;
  return {
    totalFan,
    gateFan,
    reachesMinWinningFan: gateFan >= gateMinFan
  };
}
