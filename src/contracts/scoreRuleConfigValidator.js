import {
  SCORE_RULE_PRESET_IDS,
  getScoreRulePreset,
  SETTLEMENT_MODES
} from "../config/scoreRuleConfig.js";

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isNonNegativeInt(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
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

function validateScoringBlock(scoring, problems) {
  if (scoring == null) return;
  if (typeof scoring !== "object" || Array.isArray(scoring)) {
    problems.push("scoring must be an object");
    return;
  }
  if (
    scoring.gateMinFan != null &&
    !isNonNegativeInt(scoring.gateMinFan)
  ) {
    problems.push("scoring.gateMinFan must be a non-negative integer");
  }
  if (scoring.gateExcludeFanIds != null) {
    if (!Array.isArray(scoring.gateExcludeFanIds)) {
      problems.push("scoring.gateExcludeFanIds must be an array");
    } else {
      for (const id of scoring.gateExcludeFanIds) {
        if (typeof id !== "string") {
          problems.push("scoring.gateExcludeFanIds entries must be strings");
          break;
        }
      }
    }
  }
}

function validateSettlementBlock(settlement, problems) {
  if (settlement == null) return;
  if (typeof settlement !== "object" || Array.isArray(settlement)) {
    problems.push("settlement must be an object");
    return;
  }
  const mode = settlement.mode;
  if (
    mode != null &&
    mode !== SETTLEMENT_MODES.COMPAT_LINEAR &&
    mode !== SETTLEMENT_MODES.OFFICIAL_BASE_FAN
  ) {
    problems.push(
      "settlement.mode must be compatLinear or officialBaseFan"
    );
  }
  if (
    settlement.officialBasePoint != null &&
    !isNonNegativeInt(settlement.officialBasePoint)
  ) {
    problems.push("settlement.officialBasePoint must be integer >= 0");
  }
  if (
    mode === SETTLEMENT_MODES.OFFICIAL_BASE_FAN &&
    typeof settlement.officialBasePoint === "number" &&
    (!Number.isInteger(settlement.officialBasePoint) ||
      settlement.officialBasePoint < 1)
  ) {
    problems.push(
      "settlement.officialBasePoint must be integer >= 1 when specified"
    );
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
    mode === "table" &&
    typeof config.fanToPoint?.table?.byFan !== "object"
  ) {
    problems.push("fanToPoint.table.byFan must be object");
  }
  validateDistribution(config.distribution, problems);
  validateScoringBlock(config.scoring, problems);
  validateSettlementBlock(config.settlement, problems);
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
