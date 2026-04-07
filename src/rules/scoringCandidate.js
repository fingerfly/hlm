/**
 * Purpose: Score one validated win shape for candidate comparison.
 * Description:
 *   - Runs detectFans → resolveFanConflicts → aggregateScore once.
 *   - Used when multiple legal shapes exist (e.g. seven_pairs vs standard).
 *   - Exposes Guobiao ordering among competing standard decompositions
 *     (四同顺 vs 三节高 vs 三同顺).
 */
import { detectFans } from "./fanDetectors.js";
import { resolveFanConflicts } from "./conflictResolver.js";
import { aggregateScore } from "./scoreAggregator.js";

/**
 * @param {object} input - Hand input (tiles + context).
 * @param {{pattern: string, meldGroups?: object[]}} winShape
 * @param {object} snapshot - Gate / settlement snapshot.
 * @returns {{winPattern: string, meldGroups: object[], matchedFans:
 *   object[], excludedFans: object[], totalFan: number, gateFan: number,
 *   reachesMinWinningFan: boolean}}
 */
export function scoreWinShape(input, winShape, snapshot) {
  const rawFans = detectFans(input, winShape);
  const { matchedFans, excludedFans } = resolveFanConflicts(rawFans);
  const agg = aggregateScore(matchedFans, snapshot);
  return {
    winPattern: winShape.pattern,
    meldGroups: winShape.meldGroups || [],
    matchedFans,
    excludedFans,
    totalFan: agg.totalFan,
    gateFan: agg.gateFan,
    reachesMinWinningFan: agg.reachesMinWinningFan
  };
}

function hasFanId(candidate, id) {
  return candidate.matchedFans.some((f) => f.id === id);
}

/**
 * Break ties between legal standard meldings of the same multiset.
 * 一色四同顺 beats pung 一色三节高; 一色三节高 beats 一色三同顺 when the
 * latter does not arise from a 四同顺 decomposition.
 *
 * @param {{ matchedFans: { id?: string }[] }} a
 * @param {{ matchedFans: { id?: string }[] }} b
 * @returns {number} Array.sort step
 */
export function compareStandardWinPrecedence(a, b) {
  const aS = hasFanId(a, "YI_SE_SI_TONG_SHUN");
  const bS = hasFanId(b, "YI_SE_SI_TONG_SHUN");
  const aJ = hasFanId(a, "YI_SE_SAN_JIE_GAO");
  const bJ = hasFanId(b, "YI_SE_SAN_JIE_GAO");
  const aT = hasFanId(a, "YI_SE_SAN_TONG_SHUN");
  const bT = hasFanId(b, "YI_SE_SAN_TONG_SHUN");
  if (aS && bJ && !bS) return -1;
  if (bS && aJ && !aS) return 1;
  if (aJ && bT && !bS) return -1;
  if (aT && bJ && !aS) return 1;
  return 0;
}
