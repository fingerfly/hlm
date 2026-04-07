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

/** Frozen cite for audits; aligns with RULE_BASELINE.ruleVersion. */
export const RULE_SOURCE = Object.freeze({
  baselineId: "MCR-SPORTS-GENERAL-ADMIN-2018",
  authorityZh: "国家体育总局棋牌运动管理中心（竞赛规则口径）",
  documentZh: "麻将竞赛规则（国标番种与不计关系）",
  registryFanCount: 82
});

export const ERROR_CODES = Object.freeze({
  NEED_CONTEXT: "NEED_CONTEXT",
  INVALID_INPUT: "INVALID_INPUT",
  NOT_A_WINNING_HAND: "NOT_A_WINNING_HAND"
});
