/**
 * Purpose: Hand-feature-driven fan detectors (public entry).
 * Description:
 * - Catalog split under `featureDetectors/`; order matches `FAN_CATALOG`.
 */
import { FEATURE_DETECTORS_ADVANCED } from
  "./featureDetectors/catalogAdvanced.js";
import { FEATURE_DETECTORS_SEQUENCES } from
  "./featureDetectors/catalogSequences.js";
import { FEATURE_DETECTORS_SUIT_WIND_DRAGON } from
  "./featureDetectors/catalogSuitWindDragon.js";

export const FEATURE_DETECTORS = Object.freeze([
  ...FEATURE_DETECTORS_SUIT_WIND_DRAGON,
  ...FEATURE_DETECTORS_SEQUENCES,
  ...FEATURE_DETECTORS_ADVANCED
]);
