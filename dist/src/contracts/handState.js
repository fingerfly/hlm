import { ERROR_CODES } from "../config/ruleBaseline.js";
import { SETTLEMENT_MODES } from "../config/scoreRuleConfig.js";
import {
  addStructuredContextProblems
} from "./structuredContextValidator.js";

/**
 * Purpose: Validate hand input contract before scoring starts.
 * Description:
 * - Defines allowed enum-like context values.
 * - Reports missing/invalid fields with stable error codes.
 * - Keeps validation output shape consistent for callers.
 */
export const WIN_TYPES = Object.freeze(["zimo", "dianhe"]);
export const HAND_STATES = Object.freeze(["menqian", "fulu"]);
export const KONG_TYPES = Object.freeze(["none", "an", "ming", "bu"]);
export const TIMING_EVENTS = Object.freeze([
  "none",
  "miaoshou",
  "haidi",
  "gangshang",
  "qianggang"
]);
export const WINDS = Object.freeze(["E", "S", "Wn", "N"]);

/**
 * Append problems when optional scoringRule snapshot is malformed.
 *
 * @param {object} input - Scoring input.
 * @param {string[]} problems - Mutable problem list.
 */
function addScoringRuleProblems(input, problems) {
  if (!Object.prototype.hasOwnProperty.call(input, "scoringRule")) return;
  const rule = input.scoringRule;
  if (rule == null) return;
  if (typeof rule !== "object" || Array.isArray(rule)) {
    problems.push("scoringRule must be a plain object");
    return;
  }
  if (!Number.isInteger(rule.gateMinFan) || rule.gateMinFan < 0) {
    problems.push("scoringRule.gateMinFan must be integer >= 0");
  }
  if (!Array.isArray(rule.gateExcludeFanIds)) {
    problems.push("scoringRule.gateExcludeFanIds must be an array");
    return;
  }
  for (const id of rule.gateExcludeFanIds) {
    if (typeof id !== "string") {
      problems.push("scoringRule.gateExcludeFanIds must be string ids");
      break;
    }
  }
  if (
    rule.settlementMode !== SETTLEMENT_MODES.COMPAT_LINEAR &&
    rule.settlementMode !== SETTLEMENT_MODES.OFFICIAL_BASE_FAN
  ) {
    problems.push("scoringRule.settlementMode is invalid");
  }
  if (
    !Number.isInteger(rule.officialBasePoint) ||
    rule.officialBasePoint < 0
  ) {
    problems.push("scoringRule.officialBasePoint must be integer >= 0");
  }
}

/**
 * Collect required context fields with invalid values.
 *
 * @param {object} [handState={}] - Input hand state object.
 * @returns {string[]}
 */
export function getMissingContextFields(handState = {}) {
  const missing = [];
  const checks = [
    ["winType", WIN_TYPES],
    ["handState", HAND_STATES],
    ["kongType", KONG_TYPES],
    ["timingEvent", TIMING_EVENTS]
  ];

  for (const [field, allowed] of checks) {
    if (!allowed.includes(handState[field])) {
      missing.push(field);
    }
  }
  return missing;
}

/**
 * Validate input tiles and context with scoring contract semantics.
 *
 * @param {object} [input={}] - Full scoring input payload.
 * @returns {{ok: boolean, code: string|null, problems: string[],
 *   missingFields: string[]}}
 */
export function validateHandInput(input = {}) {
  const problems = [];
  if (!Array.isArray(input.tiles) || input.tiles.length !== 14) {
    problems.push("tiles must contain 14 tile codes");
  }

  const missingFields = getMissingContextFields(input);
  if (missingFields.length > 0) {
    return {
      ok: false,
      code: ERROR_CODES.NEED_CONTEXT,
      problems,
      missingFields
    };
  }

  if (problems.length > 0) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_INPUT,
      problems,
      missingFields: []
    };
  }

  if (input.seatWind && !WINDS.includes(input.seatWind)) {
    problems.push("seatWind must be one of E/S/Wn/N");
  }
  if (input.prevalentWind && !WINDS.includes(input.prevalentWind)) {
    problems.push("prevalentWind must be one of E/S/Wn/N");
  }

  addStructuredContextProblems(input, problems);
  addScoringRuleProblems(input, problems);

  if (problems.length > 0) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_INPUT,
      problems,
      missingFields: []
    };
  }

  return {
    ok: true,
    code: null,
    problems: [],
    missingFields: []
  };
}
