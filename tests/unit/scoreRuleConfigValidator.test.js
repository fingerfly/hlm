import test from "node:test";
import assert from "node:assert/strict";
import {
  SCORE_RULE_PRESET_IDS,
  getScoreRulePreset
} from "../../src/config/scoreRuleConfig.js";
import {
  validateScoreRuleConfig,
  normalizeScoreRuleConfig
} from "../../src/contracts/scoreRuleConfigValidator.js";

test("validateScoreRuleConfig accepts bundled presets", () => {
  const mcr = validateScoreRuleConfig(
    getScoreRulePreset(SCORE_RULE_PRESET_IDS.MCR_OFFICIAL)
  );
  const compat = validateScoreRuleConfig(
    getScoreRulePreset(SCORE_RULE_PRESET_IDS.CURRENT_COMPAT)
  );
  assert.equal(mcr.ok, true);
  assert.equal(compat.ok, true);
});

test("validateScoreRuleConfig rejects invalid multipliers", () => {
  const broken = {
    ...getScoreRulePreset(SCORE_RULE_PRESET_IDS.CURRENT_COMPAT),
    distribution: {
      zimo: { winnerMultiplier: 0, loserMultiplier: 1 },
      dianhe: { winnerMultiplier: 1, discarderMultiplier: 1 }
    }
  };
  const result = validateScoreRuleConfig(broken);
  assert.equal(result.ok, false);
  assert.equal(result.problems.length > 0, true);
});

test("normalizeScoreRuleConfig falls back to Current_Compat", () => {
  const normalized = normalizeScoreRuleConfig({ bad: true });
  assert.equal(normalized.fallback, true);
  assert.equal(
    normalized.config.meta.id,
    SCORE_RULE_PRESET_IDS.CURRENT_COMPAT
  );
});

