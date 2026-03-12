/**
 * Purpose: Resolve mutually exclusive fan matches.
 * Description:
 * - Applies conflict groups where only highest-fan item can remain.
 * - Emits excluded fan entries with reason metadata.
 * - Preserves non-conflicting fan hits unchanged.
 */
const CONFLICT_GROUPS = Object.freeze([
  new Set(["GANG_SHANG_HUA", "HAI_DI_LAO_YUE", "HE_DI_LAO_YU"]),
  new Set(["QING_YI_SE", "HUN_YI_SE"])
]);

/**
 * Resolve raw fan matches against conflict definitions.
 *
 * @param {{id: string, fan: number, evidence: string}[]} rawFans
 * @returns {{matchedFans: object[], excludedFans: object[]}}
 */
export function resolveFanConflicts(rawFans) {
  const matched = [...rawFans];
  const excluded = [];

  for (const group of CONFLICT_GROUPS) {
    const inGroup = matched.filter((f) => group.has(f.id));
    if (inGroup.length <= 1) continue;

    inGroup.sort((a, b) => b.fan - a.fan);
    const keep = inGroup[0];
    for (const loser of inGroup.slice(1)) {
      const idx = matched.findIndex(
        (f) => f.id === loser.id && f.evidence === loser.evidence
      );
      if (idx >= 0) matched.splice(idx, 1);
      excluded.push({
        id: loser.id,
        fan: loser.fan,
        reason: `conflict_with_${keep.id}`
      });
    }
  }

  return { matchedFans: matched, excludedFans: excluded };
}
