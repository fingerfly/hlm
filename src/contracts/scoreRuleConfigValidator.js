import {
  SCORE_RULE_PRESET_IDS,
  getScoreRulePreset
} from "../config/scoreRuleConfig.js";

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function validateLinear(linear, problems) {
  if (!linear || !isPositiveNumber(linear.pointPerFan)) {
    problems.push("fanToPoint.linear.pointPerFan must be > 0");
  }
  if (!linear || !isNonNegativeNumber(linear.minPoint)) {
    problems.push("fanToPoint.linear.minPoint must be >= 0");
  }
  if (
    linear &&
    linear.maxPoint != null &&
    !isNonNegativeNumber(linear.maxPoint)
  ) {
    problems.push("fanToPoint.linear.maxPoint must be >= 0 or null");
  }
}

function validateDistribution(dist, problems) {
  if (!dist?.zimo || !isPositiveNumber(dist.zimo.winnerMultiplier)) {
    problems.push("distribution.zimo.winnerMultiplier must be > 0");
  }
  if (!dist?.zimo || !isPositiveNumber(dist.zimo.loserMultiplier)) {
    problems.push("distribution.zimo.loserMultiplier must be > 0");
  }
  if (!dist?.dianhe || !isPositiveNumber(dist.dianhe.winnerMultiplier)) {
    problems.push("distribution.dianhe.winnerMultiplier must be > 0");
  }
  if (!dist?.dianhe || !isPositiveNumber(dist.dianhe.discarderMultiplier)) {
    problems.push("distribution.dianhe.discarderMultiplier must be > 0");
  }
}

/**
 * Validate score rule config object.
 *
 * @param {object} config
 * @returns {{ok:boolean, problems:string[]}}
 */
export function validateScoreRuleConfig(config) {
  const problems = [];
  if (!config || typeof config !== "object") {
    return { ok: false, problems: ["config must be an object"] };
  }
  if (!config.meta?.id) {
    problems.push("meta.id is required");
  }
  const mode = config.fanToPoint?.mode;
  if (mode !== "linear" && mode !== "table") {
    problems.push("fanToPoint.mode must be linear or table");
  }
  if (mode === "linear") {
    validateLinear(config.fanToPoint.linear, problems);
  }
  if (
    mode === "table"
    && typeof config.fanToPoint?.table?.byFan !== "object"
  ) {
    problems.push("fanToPoint.table.byFan must be object");
  }
  validateDistribution(config.distribution, problems);
  return { ok: problems.length === 0, problems };
}

/**
 * Normalize candidate config, fallback to compat preset when invalid.
 *
 * @param {object} candidate
 * @returns {{config: object, fallback: boolean, problems: string[]}}
 */
export function normalizeScoreRuleConfig(candidate) {
  const valid = validateScoreRuleConfig(candidate);
  if (valid.ok) {
    return { config: candidate, fallback: false, problems: [] };
  }
  return {
    config: getScoreRulePreset(SCORE_RULE_PRESET_IDS.CURRENT_COMPAT),
    fallback: true,
    problems: valid.problems
  };
}

