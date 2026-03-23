/**
 * Purpose: Enforce shared five-principle counting constraints.
 * Description:
 * - Applies generic same-fan multiplicity control.
 * - Returns normalized matched/excluded fan arrays.
 * - Keeps reasoning metadata for scorer explainability.
 */

function compareFanItem(a, b) {
  if (b.fan !== a.fan) return b.fan - a.fan;
  return String(a.evidence || "").localeCompare(String(b.evidence || ""));
}

export const CONFLICT_GROUPS = Object.freeze([
  new Set(["GANG_SHANG_HUA", "HAI_DI_LAO_YUE", "HE_DI_LAO_YU"]),
  new Set(["QING_YI_SE", "HUN_YI_SE"]),
  new Set(["DA_SI_XI", "XIAO_SI_XI"]),
  new Set(["DA_SAN_YUAN", "XIAO_SAN_YUAN"])
]);

export const EXCLUSION_MAP = Object.freeze({
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
 * Apply "不得相同" baseline guard: keep one instance per fan id.
 *
 * @param {{id: string, fan: number, evidence: string}[]} rawFans
 * @returns {{matchedFans: object[], excludedFans: object[]}}
 */
export function applySameFanOncePrinciple(rawFans) {
  const groups = new Map();
  for (const fan of rawFans) {
    const list = groups.get(fan.id) || [];
    list.push(fan);
    groups.set(fan.id, list);
  }

  const matchedFans = [];
  const excludedFans = [];
  for (const list of groups.values()) {
    list.sort(compareFanItem);
    matchedFans.push(list[0]);
    for (const loser of list.slice(1)) {
      excludedFans.push({
        id: loser.id,
        fan: loser.fan,
        reason: `same_fan_once_keep_${list[0].id}`
      });
    }
  }
  return { matchedFans, excludedFans };
}

/**
 * Apply "套算一次" baseline guard for specific attachable interactions.
 *
 * @param {{id: string, fan: number, evidence: string}[]} matchedFans
 * @returns {{matchedFans: object[], excludedFans: object[]}}
 */
export function applyAttachOncePrinciple(matchedFans) {
  const nextMatched = [...matchedFans];
  const excludedFans = [];

  const hasHuaLong = nextMatched.some((f) => f.id === "HUA_LONG");
  if (!hasHuaLong) {
    return { matchedFans: nextMatched, excludedFans };
  }

  const attachables = nextMatched.filter(
    (f) => f.id === "XI_XIANG_FENG" || f.id === "LIAN_LIU"
  );
  if (attachables.length <= 1) {
    return { matchedFans: nextMatched, excludedFans };
  }

  attachables.sort(compareFanItem);
  const keep = attachables[0];
  for (const loser of attachables.slice(1)) {
    const idx = nextMatched.findIndex(
      (f) => f.id === loser.id && f.evidence === loser.evidence
    );
    if (idx < 0) continue;
    nextMatched.splice(idx, 1);
    excludedFans.push({
      id: loser.id,
      fan: loser.fan,
      reason: `attached_once_with_HUA_LONG_keep_${keep.id}`
    });
  }
  return { matchedFans: nextMatched, excludedFans };
}

/**
 * Apply group-conflict selection; keep highest fan in each conflict group.
 *
 * @param {{id: string, fan: number, evidence: string}[]} matchedFans
 * @returns {{matchedFans: object[], excludedFans: object[]}}
 */
export function applyConflictGroupPrinciple(matchedFans) {
  const nextMatched = [...matchedFans];
  const excludedFans = [];
  for (const group of CONFLICT_GROUPS) {
    const inGroup = nextMatched.filter((f) => group.has(f.id));
    if (inGroup.length <= 1) continue;
    inGroup.sort(compareFanItem);
    const keep = inGroup[0];
    for (const loser of inGroup.slice(1)) {
      const idx = nextMatched.findIndex(
        (f) => f.id === loser.id && f.evidence === loser.evidence
      );
      if (idx < 0) continue;
      nextMatched.splice(idx, 1);
      excludedFans.push({
        id: loser.id,
        fan: loser.fan,
        reason: `conflict_with_${keep.id}`
      });
    }
  }
  return { matchedFans: nextMatched, excludedFans };
}

/**
 * Apply exclusion-map removals for implied/subordinate fan relationships.
 *
 * @param {{id: string, fan: number, evidence: string}[]} matchedFans
 * @returns {{matchedFans: object[], excludedFans: object[]}}
 */
export function applyExclusionMapPrinciple(matchedFans) {
  const nextMatched = [...matchedFans];
  const excludedFans = [];
  for (const winner of [...nextMatched]) {
    const targets = EXCLUSION_MAP[winner.id];
    if (!targets) continue;
    for (const targetId of targets) {
      const losers = nextMatched.filter((f) => f.id === targetId);
      for (const loser of losers) {
        const idx = nextMatched.findIndex(
          (f) => f.id === loser.id && f.evidence === loser.evidence
        );
        if (idx < 0) continue;
        nextMatched.splice(idx, 1);
        excludedFans.push({
          id: loser.id,
          fan: loser.fan,
          reason: `excluded_by_${winner.id}`
        });
      }
    }
  }
  return { matchedFans: nextMatched, excludedFans };
}
