import { RULE_BASELINE, ERROR_CODES } from "../config/ruleBaseline.js";
import { validateHandInput } from "../contracts/handState.js";
import { validateWin } from "./winValidator.js";
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

  const rawFans = detectFans(input, win);
  const { matchedFans, excludedFans } = resolveFanConflicts(rawFans);
  const { totalFan, reachesMinWinningFan } = aggregateScore(matchedFans);

  return {
    isWin: reachesMinWinningFan,
    rawWin: true,
    winPattern: win.pattern,
    meldGroups: win.meldGroups || [],
    matchedFans,
    excludedFans,
    totalFan,
    minWinningFan: RULE_BASELINE.minWinningFan,
    reachesMinWinningFan,
    ruleVersion: RULE_BASELINE.ruleVersion,
    errorCode: reachesMinWinningFan ? null : ERROR_CODES.NOT_A_WINNING_HAND,
    missingFields: [],
    problems: []
  };
}
