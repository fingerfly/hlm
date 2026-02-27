import { ERROR_CODES } from "../config/ruleBaseline.js";

export const WIN_TYPES = Object.freeze(["zimo", "dianhe"]);
export const HAND_STATES = Object.freeze(["menqian", "fulu"]);
export const KONG_TYPES = Object.freeze(["none", "an", "ming", "bu"]);
export const TIMING_EVENTS = Object.freeze(["none", "haidi", "hedi", "gangshang"]);

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

  return {
    ok: true,
    code: null,
    problems: [],
    missingFields: []
  };
}
