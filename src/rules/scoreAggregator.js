import { RULE_BASELINE } from "../config/ruleBaseline.js";

export function aggregateScore(matchedFans) {
  const totalFan = matchedFans.reduce((sum, f) => sum + f.fan, 0);
  return {
    totalFan,
    reachesMinWinningFan: totalFan >= RULE_BASELINE.minWinningFan
  };
}
