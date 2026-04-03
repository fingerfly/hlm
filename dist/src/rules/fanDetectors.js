import { FAN_CATALOG } from "./fanCatalog.js";
import { extractHandFeatures } from "./handFeatures.js";

/**
 * Purpose: Detect all fan hits from input and win pattern.
 * Description:
 * - Extracts reusable hand features once per request.
 * - Evaluates all catalog detector predicates in order.
 * - Returns normalized fan match objects for conflict resolution.
 */
/**
 * Convert fan definition into runtime match object.
 *
 * @param {{id: string, fan: number, evidence: string}} def
 * @returns {{id: string, fan: number, evidence: string}}
 */
function toMatchedFan(def) {
  return {
    id: def.id,
    fan: def.fan,
    evidence: def.evidence
  };
}

/**
 * Detect fan candidates for one validated hand.
 *
 * @param {object} input - Validated hand input.
 * @param {object} [win={}] - Win metadata from win validator.
 * @returns {{id: string, fan: number, evidence: string}[]}
 */
export function detectFans(input, win = {}) {
  const features = extractHandFeatures(input, win);
  const context = { input, win, features };
  const fans = [];
  for (const def of FAN_CATALOG) {
    if (def.detect(context)) {
      fans.push(toMatchedFan(def));
    }
  }
  return fans;
}
