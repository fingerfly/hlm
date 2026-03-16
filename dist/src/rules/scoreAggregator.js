import { RULE_BASELINE } from "../config/ruleBaseline.js";

/**
 * Purpose: Sum fan values and evaluate minimum-win gate.
 * Description:
 * - Aggregates matched fan values into total fan.
 * - Compares total fan to baseline minimum winning threshold.
 */
/**
 * Aggregate score from matched fan items.
 *
 * @param {{fan: number}[]} matchedFans - Matched fan entries.
 * @returns {{totalFan: number, reachesMinWinningFan: boolean}}
 */
export function aggregateScore(matchedFans) {
  const totalFan = matchedFans.reduce((sum, f) => sum + f.fan, 0);
  return {
    totalFan,
    reachesMinWinningFan: totalFan >= RULE_BASELINE.minWinningFan
  };
}
