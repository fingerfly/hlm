/**
 * Purpose: Provide canonical fan metadata for scoring and UI output.
 * Description:
 * - Stores stable internal fan ids with official fan values.
 * - Stores canonical Chinese display names for user-facing surfaces.
 * - Exposes lookup helpers used by scoring, view-model, and explainer.
 */
export const FAN_REGISTRY = Object.freeze([
  { id: "MEN_QIAN_QING", fan: 2, zhName: "门前清" },
  { id: "ZI_MO", fan: 1, zhName: "自摸" },
  { id: "QI_DUI", fan: 24, zhName: "七对" },
  { id: "SHI_SAN_YAO", fan: 88, zhName: "十三幺" },
  { id: "GANG_SHANG_HUA", fan: 8, zhName: "杠上开花" },
  { id: "HAI_DI_LAO_YUE", fan: 8, zhName: "海底捞月" },
  { id: "HE_DI_LAO_YU", fan: 8, zhName: "河底捞鱼" },
  { id: "QING_YI_SE", fan: 24, zhName: "清一色" },
  { id: "HUN_YI_SE", fan: 6, zhName: "混一色" },
  { id: "DUAN_YAO", fan: 2, zhName: "断幺" },
  { id: "PENG_PENG_HU", fan: 6, zhName: "碰碰和" },
  { id: "HUN_YAO_JIU", fan: 32, zhName: "混幺九" },
  { id: "ZI_YI_SE", fan: 64, zhName: "字一色" },
  { id: "QING_YAO_JIU", fan: 64, zhName: "清幺九" },
  { id: "QING_LONG", fan: 16, zhName: "清龙" },
  { id: "PING_HU", fan: 2, zhName: "平和" },
  { id: "YI_BAN_GAO", fan: 1, zhName: "一般高" },
  { id: "SAN_SE_SAN_TONG_SHUN", fan: 8, zhName: "三色三同顺" },
  { id: "MEN_FENG_KE", fan: 2, zhName: "门风刻" },
  { id: "QUAN_FENG_KE", fan: 2, zhName: "圈风刻" },
  { id: "DA_SI_XI", fan: 88, zhName: "大四喜" },
  { id: "XIAO_SI_XI", fan: 64, zhName: "小四喜" },
  { id: "DA_SAN_YUAN", fan: 88, zhName: "大三元" },
  { id: "XIAO_SAN_YUAN", fan: 64, zhName: "小三元" },
  { id: "HUA_LONG", fan: 8, zhName: "花龙" },
  { id: "XI_XIANG_FENG", fan: 1, zhName: "喜相逢" },
  { id: "LIAN_LIU", fan: 1, zhName: "连六" },
  { id: "LAO_SHAO_FU", fan: 1, zhName: "老少副" },
  { id: "QUE_YI_MEN", fan: 1, zhName: "缺一门" },
  { id: "WU_ZI", fan: 1, zhName: "无字" },
  { id: "SAN_SE_SAN_BU_GAO", fan: 6, zhName: "三色三步高" },
  { id: "YI_SE_SAN_BU_GAO", fan: 16, zhName: "一色三步高" },
  { id: "DA_YU_WU", fan: 12, zhName: "大于五" },
  { id: "XIAO_YU_WU", fan: 12, zhName: "小于五" },
  { id: "QUAN_DA", fan: 24, zhName: "全大" },
  { id: "QUAN_XIAO", fan: 24, zhName: "全小" },
  { id: "QUAN_ZHONG", fan: 24, zhName: "全中" },
  { id: "DA_SAN_FENG", fan: 12, zhName: "大三风" },
  { id: "SHUANG_JIAN_KE", fan: 6, zhName: "双箭刻" },
  { id: "SHUANG_TONG_KE", fan: 2, zhName: "双同刻" },
  { id: "SAN_TONG_KE", fan: 16, zhName: "三同刻" },
  { id: "LV_YI_SE", fan: 88, zhName: "绿一色" },
  { id: "JIU_LIAN_BAO_DENG", fan: 88, zhName: "九莲宝灯" },
  { id: "SI_GANG", fan: 88, zhName: "四杠" },
  { id: "QI_LIAN_DUI", fan: 88, zhName: "连七对" },
  { id: "SI_AN_KE", fan: 64, zhName: "四暗刻" },
  { id: "YI_SE_SHUANG_LONG_HUI", fan: 64, zhName: "一色双龙会" },
  { id: "YI_SE_SI_TONG_SHUN", fan: 48, zhName: "一色四同顺" },
  { id: "YI_SE_SI_BU_GAO", fan: 32, zhName: "一色四步高" },
  { id: "SAN_GANG", fan: 32, zhName: "三杠" },
  { id: "QI_XING_BU_KAO", fan: 24, zhName: "七星不靠" },
  { id: "QUAN_SHUANG_KE", fan: 24, zhName: "全双刻" },
  { id: "YI_SE_SAN_TONG_SHUN", fan: 24, zhName: "一色三同顺" },
  { id: "YI_SE_SAN_JIE_GAO", fan: 24, zhName: "一色三节高" },
  { id: "SHANG_SAN_PAI", fan: 24, zhName: "全大" },
  { id: "ZHONG_SAN_PAI", fan: 24, zhName: "全中" },
  { id: "XIA_SAN_PAI", fan: 24, zhName: "全小" },
  { id: "SAN_SE_YI_TONG_SHUN", fan: 8, zhName: "三色一通顺" },
  { id: "TUI_BU_DAO", fan: 8, zhName: "推不倒" },
  { id: "SAN_SE_SAN_JIE_GAO", fan: 8, zhName: "三色三节高" },
  { id: "WU_FAN_HE", fan: 8, zhName: "无番和" },
  { id: "QIANG_GANG_HU", fan: 8, zhName: "抢杠和" },
  { id: "SHUANG_AN_GANG", fan: 8, zhName: "双暗杠" },
  { id: "QUAN_DAI_WU", fan: 16, zhName: "全带五" },
  { id: "SAN_AN_KE", fan: 16, zhName: "三暗刻" },
  { id: "WU_MEN_QI", fan: 6, zhName: "五门齐" },
  { id: "QUAN_QIU_REN", fan: 6, zhName: "全求人" },
  { id: "SHUANG_MING_GANG", fan: 4, zhName: "双明杠" },
  { id: "QUAN_DAI_YAO", fan: 4, zhName: "全带幺" },
  { id: "BU_QIU_REN", fan: 4, zhName: "不求人" },
  { id: "AN_GANG", fan: 2, zhName: "暗杠" },
  { id: "MING_GANG", fan: 1, zhName: "明杠" },
  { id: "JUE_ZHANG", fan: 4, zhName: "和绝张" },
  { id: "JIAN_KE", fan: 2, zhName: "箭刻" },
  { id: "YAO_JIU_KE", fan: 1, zhName: "幺九刻" },
  { id: "BIAN_ZHANG", fan: 1, zhName: "边张" },
  { id: "KAN_ZHANG", fan: 1, zhName: "坎张" },
  { id: "DAN_DIAO_JIANG", fan: 1, zhName: "单钓将" },
  { id: "HUA_PAI", fan: 1, zhName: "花牌" },
  { id: "SHUANG_AN_KE", fan: 2, zhName: "双暗刻" },
  { id: "SAN_SE_SHUANG_LONG_HUI", fan: 16, zhName: "三色双龙会" }
]);

export const MCR_TARGET_FAN_COUNT = 81;

export const FAN_REGISTRY_MAP = Object.freeze(
  FAN_REGISTRY.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {})
);

export const IMPLEMENTED_FAN_IDS = Object.freeze(
  FAN_REGISTRY.map((item) => item.id)
);

/**
 * Resolve canonical Chinese fan name for UI output.
 *
 * @param {string} id - Internal fan id.
 * @returns {string}
 */
export function getFanDisplayName(id) {
  return FAN_REGISTRY_MAP[id]?.zhName || id;
}

/**
 * Resolve canonical fan value by fan id.
 *
 * @param {string} id - Internal fan id.
 * @returns {number}
 */
export function getFanValue(id) {
  return FAN_REGISTRY_MAP[id]?.fan ?? 0;
}

/**
 * Return progress snapshot for full MCR fan implementation.
 *
 * @returns {{implemented: number, target: number, remaining: number}}
 */
export function getFanCoverageProgress() {
  const implemented = IMPLEMENTED_FAN_IDS.length;
  const target = MCR_TARGET_FAN_COUNT;
  return {
    implemented,
    target,
    remaining: Math.max(target - implemented, 0)
  };
}
