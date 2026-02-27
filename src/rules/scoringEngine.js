import { RULE_BASELINE, ERROR_CODES } from "../config/ruleBaseline.js";
import { validateHandInput } from "../contracts/handState.js";
import { validateWin } from "./winValidator.js";
import { detectFans } from "./fanDetectors.js";
import { resolveFanConflicts } from "./conflictResolver.js";
import { aggregateScore } from "./scoreAggregator.js";

export function scoreHand(input) {
  const validation = validateHandInput(input);
  if (!validation.ok) {
    return {
      isWin: false,
      matchedFans: [],
      excludedFans: [],
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
      totalFan: 0,
      ruleVersion: RULE_BASELINE.ruleVersion,
      errorCode: ERROR_CODES.NOT_A_WINNING_HAND,
      missingFields: [],
      problems: []
    };
  }

  const rawFans = detectFans(input, win.pattern);
  const { matchedFans, excludedFans } = resolveFanConflicts(rawFans);
  const { totalFan, reachesMinWinningFan } = aggregateScore(matchedFans);

  return {
    isWin: reachesMinWinningFan,
    rawWin: true,
    winPattern: win.pattern,
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
