/**
 * Purpose: Lock every EXCLUSION_MAP winner→child relation for Guobiao 套算.
 * Description:
 *   - One synthetic resolveFanConflicts per map key.
 *   - Winner fan boosted so conflict-group ordering does not drop it.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { EXCLUSION_MAP } from "../../src/rules/exclusionMap.js";
import { resolveFanConflicts } from "../../src/rules/conflictResolver.js";
import { getFanValue } from "../../src/rules/fanRegistry.js";

const WINNER_FAN = 999;

for (const winnerId of Object.keys(EXCLUSION_MAP)) {
  const excludedIds = [...EXCLUSION_MAP[winnerId]];
  test(`EXCLUSION_MAP ${winnerId} removes excluded children`, () => {
    const rawFans = [
      { id: winnerId, fan: WINNER_FAN, evidence: `truth:${winnerId}` },
      ...excludedIds.map((id) => ({
        id,
        fan: getFanValue(id) || 1,
        evidence: `truth:${id}`
      }))
    ];
    const { matchedFans } = resolveFanConflicts(rawFans);
    assert.equal(matchedFans.some((f) => f.id === winnerId), true);
    for (const tid of excludedIds) {
      assert.equal(
        matchedFans.some((f) => f.id === tid),
        false,
        `expected ${tid} stripped under ${winnerId}`
      );
    }
  });
}
