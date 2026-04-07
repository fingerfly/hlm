/**
 * Purpose: Guobiao "不计" fan subordination for applyExclusionMapPrinciple.
 * Description:
 *   - Maps high fan id to registry ids that must not double-count.
 *   - Keys are winner rows; values are excluded child fan ids.
 *   - Kept separate from principle logic to limit file size.
 */

export const EXCLUSION_MAP = Object.freeze({
  DA_SI_XI: Object.freeze([
    "MEN_FENG_KE",
    "QUAN_FENG_KE",
    "ZI_YI_SE",
    "PENG_PENG_HU",
    "DA_SAN_FENG",
    "YAO_JIU_KE"
  ]),
  XIAO_SI_XI: Object.freeze([
    "MEN_FENG_KE",
    "QUAN_FENG_KE",
    "DA_SAN_FENG",
    "YAO_JIU_KE"
  ]),
  DA_SAN_YUAN: Object.freeze([
    "XIAO_SAN_YUAN",
    "SHUANG_JIAN_KE",
    "JIAN_KE",
    "YAO_JIU_KE"
  ]),
  XIAO_SAN_YUAN: Object.freeze(["SHUANG_JIAN_KE", "JIAN_KE", "YAO_JIU_KE"]),
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
  SAN_TONG_KE: Object.freeze(["SHUANG_TONG_KE"]),
  DA_SAN_FENG: Object.freeze(["YAO_JIU_KE"]),
  SHUANG_JIAN_KE: Object.freeze(["JIAN_KE"]),
  SI_GANG: Object.freeze(["SAN_GANG"]),
  SAN_GANG: Object.freeze([
    "SHUANG_AN_GANG",
    "SHUANG_MING_GANG",
    "AN_GANG",
    "MING_GANG"
  ]),
  SHUANG_AN_GANG: Object.freeze(["AN_GANG"]),
  SHUANG_MING_GANG: Object.freeze(["MING_GANG"]),
  QI_LIAN_DUI: Object.freeze(["QI_DUI"]),
  ZI_YI_SE: Object.freeze([
    "YAO_JIU_KE",
    "JIAN_KE",
    "MEN_FENG_KE",
    "QUAN_FENG_KE"
  ]),
  QING_YAO_JIU: Object.freeze(["YAO_JIU_KE", "PENG_PENG_HU"]),
  HUN_YAO_JIU: Object.freeze(["PENG_PENG_HU", "YAO_JIU_KE"]),
  JIU_LIAN_BAO_DENG: Object.freeze([
    "QING_YI_SE",
    "MEN_QIAN_QING",
    "YAO_JIU_KE"
  ]),
  LV_YI_SE: Object.freeze([
    "QING_YI_SE",
    "PENG_PENG_HU",
    "DUAN_YAO",
    "YI_SE_SAN_JIE_GAO",
    "YI_SE_SAN_TONG_SHUN",
    "YI_BAN_GAO"
  ]),
  SHI_SAN_YAO: Object.freeze([
    "HUN_YAO_JIU",
    "MEN_QIAN_QING",
    "DAN_DIAO_JIANG"
  ]),
  QI_DUI: Object.freeze([
    "MEN_QIAN_QING",
    "DUAN_YAO",
    "WU_ZI",
    "DAN_DIAO_JIANG"
  ]),
  YI_SE_SHUANG_LONG_HUI: Object.freeze([
    "QING_YI_SE",
    "PING_HU",
    "YI_BAN_GAO",
    "LIAN_LIU",
    "LAO_SHAO_FU"
  ]),
  YI_SE_SAN_JIE_GAO: Object.freeze(["YI_SE_SAN_TONG_SHUN"]),
  YI_SE_SI_TONG_SHUN: Object.freeze([
    "YI_SE_SAN_JIE_GAO",
    "YI_SE_SAN_TONG_SHUN",
    "YI_BAN_GAO",
    "SI_GUI_YI"
  ]),
  SAN_SE_SHUANG_LONG_HUI: Object.freeze([
    "PING_HU",
    "XI_XIANG_FENG",
    "LIAN_LIU",
    "LAO_SHAO_FU",
    "HUA_LONG",
    "YI_BAN_GAO"
  ])
});
