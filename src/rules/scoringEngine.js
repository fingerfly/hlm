import { RULE_BASELINE, ERROR_CODES } from "../config/ruleBaseline.js";
import { validateHandInput } from "../contracts/handState.js";
import {
  validateWin,
  enumerateStandardWinGroups
} from "./winValidator.js";
import { detectFans } from "./fanDetectors.js";
import { resolveFanConflicts } from "./conflictResolver.js";
import { aggregateScore } from "./scoreAggregator.js";

/**
 * Purpose: Orchestrate full hand scoring pipeline.
 * Description:
 * - Validates input contract and required context fields.
 * - Verifies winning pattern before fan detection.
 * - Resolves fan conflicts and aggregates final fan total.
 */
/**
 * Score one hand with baseline rule gates.
 *
 * @param {object} input - Hand input with tiles and context.
 * @returns {object}
 */
export function scoreHand(input) {
  const validation = validateHandInput(input);
  if (!validation.ok) {
    return {
      isWin: false,
      matchedFans: [],
      excludedFans: [],
      meldGroups: [],
      totalFan: 0,
      ruleVersion: RULE_BASELINE.ruleVersion,
      errorCode: validation.code,
      missingFields: validation.missingFields,
      problems: validation.problems
    };
  }

  const win = validateWin(input.tiles);
  if (!win.isWin) {
    return {
      isWin: false,
      matchedFans: [],
      excludedFans: [],
      meldGroups: [],
      totalFan: 0,
      ruleVersion: RULE_BASELINE.ruleVersion,
      errorCode: ERROR_CODES.NOT_A_WINNING_HAND,
      missingFields: [],
      problems: []
    };
  }

  const candidates = [];
  if (win.pattern === "standard") {
    const allGroups = enumerateStandardWinGroups(input.tiles);
    for (const meldGroups of allGroups) {
      const candidateWin = { ...win, meldGroups };
      const rawFans = detectFans(input, candidateWin);
      const { matchedFans, excludedFans } = resolveFanConflicts(rawFans);
      const {
        totalFan,
        reachesMinWinningFan
      } = aggregateScore(matchedFans);
      candidates.push({
        meldGroups,
        matchedFans,
        excludedFans,
        totalFan,
        reachesMinWinningFan
      });
    }
  } else {
    const rawFans = detectFans(input, win);
    const { matchedFans, excludedFans } = resolveFanConflicts(rawFans);
    const {
      totalFan,
      reachesMinWinningFan
    } = aggregateScore(matchedFans);
    candidates.push({
      meldGroups: win.meldGroups || [],
      matchedFans,
      excludedFans,
      totalFan,
      reachesMinWinningFan
    });
  }

  candidates.sort((a, b) => {
    if (b.totalFan !== a.totalFan) return b.totalFan - a.totalFan;
    const aIds = a.matchedFans.map((f) => f.id).sort().join(",");
    const bIds = b.matchedFans.map((f) => f.id).sort().join(",");
    return aIds.localeCompare(bIds);
  });
  const best = candidates[0];

  return {
    isWin: best.reachesMinWinningFan,
    rawWin: true,
    winPattern: win.pattern,
    meldGroups: best.meldGroups,
    matchedFans: best.matchedFans,
    excludedFans: best.excludedFans,
    totalFan: best.totalFan,
    minWinningFan: RULE_BASELINE.minWinningFan,
    reachesMinWinningFan: best.reachesMinWinningFan,
    ruleVersion: RULE_BASELINE.ruleVersion,
    errorCode: best.reachesMinWinningFan
      ? null
      : ERROR_CODES.NOT_A_WINNING_HAND,
    missingFields: [],
    problems: []
  };
}
