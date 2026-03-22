import { getFanValue } from "./fanRegistry.js";
import { CONTEXT_DETECTORS } from "./detectors/contextDetectors.js";
import { PATTERN_DETECTORS } from "./detectors/patternDetectors.js";
import { FEATURE_DETECTORS } from "./detectors/featureDetectors.js";

/**
 * Purpose: Define canonical fan detection catalog.
 * Description:
 * - Stores fan id, value, detector callback, and evidence key.
 * - Acts as single source for detector iteration order.
 * - Keeps scoring wiring declarative and easy to extend.
 */
const FAN_DETECTORS = Object.freeze([
  ...CONTEXT_DETECTORS,
  ...PATTERN_DETECTORS,
  ...FEATURE_DETECTORS
]);

export const FAN_CATALOG = Object.freeze(
  FAN_DETECTORS.map((item) => ({
    ...item,
    fan: getFanValue(item.id)
  }))
);
