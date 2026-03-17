/**
 * Purpose: Resolve mutually exclusive fan matches.
 * Description:
 * - Applies conflict groups where only highest-fan item can remain.
 * - Emits excluded fan entries with reason metadata.
 * - Preserves non-conflicting fan hits unchanged.
 */
const CONFLICT_GROUPS = Object.freeze([
  new Set(["GANG_SHANG_HUA", "HAI_DI_LAO_YUE", "HE_DI_LAO_YU"]),
  new Set(["QING_YI_SE", "HUN_YI_SE"]),
  new Set(["DA_SI_XI", "XIAO_SI_XI"]),
  new Set(["DA_SAN_YUAN", "XIAO_SAN_YUAN"])
]);

const EXCLUSION_MAP = Object.freeze({
  DA_SI_XI: Object.freeze([
    "MEN_FENG_KE",
    "QUAN_FENG_KE",
    "ZI_YI_SE",
    "PENG_PENG_HU",
    "DA_SAN_FENG"
  ]),
  XIAO_SI_XI: Object.freeze(["MEN_FENG_KE", "QUAN_FENG_KE", "DA_SAN_FENG"]),
  DA_SAN_YUAN: Object.freeze(["XIAO_SAN_YUAN", "SHUANG_JIAN_KE"]),
  XIAO_SAN_YUAN: Object.freeze(["SHUANG_JIAN_KE"]),
  QING_YI_SE: Object.freeze(["QUE_YI_MEN", "WU_ZI"]),
  HUN_YI_SE: Object.freeze(["QUE_YI_MEN"]),
  PING_HU: Object.freeze(["WU_ZI"]),
  SAN_SE_SAN_TONG_SHUN: Object.freeze(["XI_XIANG_FENG"]),
  QING_LONG: Object.freeze(["LIAN_LIU", "LAO_SHAO_FU"]),
  DA_YU_WU: Object.freeze(["WU_ZI"]),
  XIAO_YU_WU: Object.freeze(["WU_ZI"]),
  QUAN_DA: Object.freeze(["DA_YU_WU", "WU_ZI"]),
  QUAN_XIAO: Object.freeze(["XIAO_YU_WU", "WU_ZI"]),
  QUAN_ZHONG: Object.freeze(["DUAN_YAO", "WU_ZI"]),
  SAN_TONG_KE: Object.freeze(["SHUANG_TONG_KE"])
});

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

  for (const winner of [...matched]) {
    const targets = EXCLUSION_MAP[winner.id];
    if (!targets) continue;
    for (const targetId of targets) {
      const idx = matched.findIndex((f) => f.id === targetId);
      if (idx < 0) continue;
      const loser = matched[idx];
      matched.splice(idx, 1);
      excluded.push({
        id: loser.id,
        fan: loser.fan,
        reason: `excluded_by_${winner.id}`
      });
    }
  }

  return { matchedFans: matched, excludedFans: excluded };
}
