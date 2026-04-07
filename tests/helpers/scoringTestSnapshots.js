/**
 * Purpose: Reusable scoringRule snapshots for unit tests.
 * Description:
 *   - Compat gate (1 番起和) for cases below official 8 分起和 threshold.
 *   - Built from bundled preset so tests track preset drift.
 */
import {
  buildScoringRuleSnapshot,
  getScoreRulePreset,
  SCORE_RULE_PRESET_IDS
} from "../../src/config/scoreRuleConfig.js";

export const COMPAT_SCORING_RULE_SNAPSHOT = buildScoringRuleSnapshot(
  getScoreRulePreset(SCORE_RULE_PRESET_IDS.CURRENT_COMPAT)
);
