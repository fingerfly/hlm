/**
 * Purpose: Define immutable scoring baseline metadata.
 * Description:
 * - Stores baseline rule version and legacy min fan display constant.
 * - Per-preset gate uses scoringRuleSnapshot (see scoreRuleConfig).
 * - Stores stable error codes consumed by app/rules modules.
 */
export const RULE_BASELINE = Object.freeze({
  ruleVersion: "MCR-SPORTS-GENERAL-ADMIN-2018",
  ruleName: "Chinese Official Mahjong (MCR / Guobiao)",
  minWinningFan: 1,
  references: Object.freeze([
    "Chinese General Administration of Sport official ruleset",
    "Project baseline contract v1"
  ])
});

export const ERROR_CODES = Object.freeze({
  NEED_CONTEXT: "NEED_CONTEXT",
  INVALID_INPUT: "INVALID_INPUT",
  NOT_A_WINNING_HAND: "NOT_A_WINNING_HAND"
});
