/**
 * Purpose: Resolve mutually exclusive fan matches.
 * Description:
 * - Applies conflict groups where only highest-fan item can remain.
 * - Emits excluded fan entries with reason metadata.
 * - Preserves non-conflicting fan hits unchanged.
 */
import {
  applyAttachOncePrinciple,
  applyConflictGroupPrinciple,
  applyExclusionMapPrinciple,
  applySameFanOncePrinciple
} from "./principleConstraints.js";

/**
 * Resolve raw fan matches against conflict definitions.
 *
 * @param {{id: string, fan: number, evidence: string}[]} rawFans
 * @returns {{matchedFans: object[], excludedFans: object[]}}
 */
export function resolveFanConflicts(rawFans) {
  const step1 = applySameFanOncePrinciple(rawFans);
  const step2 = applyConflictGroupPrinciple(step1.matchedFans);
  const step3 = applyExclusionMapPrinciple(step2.matchedFans);
  const step4 = applyAttachOncePrinciple(step3.matchedFans);
  return {
    matchedFans: step4.matchedFans,
    excludedFans: [
      ...step1.excludedFans,
      ...step2.excludedFans,
      ...step3.excludedFans,
      ...step4.excludedFans
    ]
  };
}
