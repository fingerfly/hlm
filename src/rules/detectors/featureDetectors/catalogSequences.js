/**
 * Purpose: Feature detectors — straights, steps, voided suit, rank bands.
 * Description:
 * - Middle segment of `FEATURE_DETECTORS` (catalog order preserved).
 */

export const FEATURE_DETECTORS_SEQUENCES = Object.freeze([
  {
    id: "HUA_LONG",
    detect: ({ features }) => features.mixedStraight,
    evidence: "feature=mixedStraight"
  },
  {
    id: "XI_XIANG_FENG",
    detect: ({ features }) => features.mixedDoubleChow,
    evidence: "feature=mixedDoubleChow"
  },
  {
    id: "LIAN_LIU",
    detect: ({ features }) => features.shortStraight,
    evidence: "feature=shortStraight"
  },
  {
    id: "LAO_SHAO_FU",
    detect: ({ features }) => features.twoTerminalChows,
    evidence: "feature=twoTerminalChows"
  },
  {
    id: "QUE_YI_MEN",
    detect: ({ features }) => features.oneVoidedSuit,
    evidence: "feature=oneVoidedSuit"
  },
  {
    id: "WU_ZI",
    detect: ({ features }) => features.noHonors,
    evidence: "feature=noHonors"
  },
  {
    id: "SAN_SE_SAN_BU_GAO",
    detect: ({ features }) => features.mixedShiftedChows,
    evidence: "feature=mixedShiftedChows"
  },
  {
    id: "YI_SE_SAN_BU_GAO",
    detect: ({ features }) => features.pureShiftedChows,
    evidence: "feature=pureShiftedChows"
  },
  {
    id: "DA_YU_WU",
    detect: ({ features }) => features.daYuWu,
    evidence: "feature=daYuWu"
  },
  {
    id: "XIAO_YU_WU",
    detect: ({ features }) => features.xiaoYuWu,
    evidence: "feature=xiaoYuWu"
  },
  {
    id: "QUAN_DA",
    detect: ({ features }) => features.quanDa,
    evidence: "feature=quanDa"
  },
  {
    id: "QUAN_XIAO",
    detect: ({ features }) => features.quanXiao,
    evidence: "feature=quanXiao"
  },
  {
    id: "QUAN_ZHONG",
    detect: ({ features }) => features.quanZhong,
    evidence: "feature=quanZhong"
  },
  {
    id: "DA_SAN_FENG",
    detect: ({ features }) => features.daSanFeng,
    evidence: "feature=daSanFeng"
  },
  {
    id: "SHUANG_JIAN_KE",
    detect: ({ features }) => features.shuangJianKe,
    evidence: "feature=shuangJianKe"
  },
  {
    id: "SHUANG_TONG_KE",
    detect: ({ features }) => features.shuangTongKe,
    evidence: "feature=shuangTongKe"
  },
  {
    id: "SAN_TONG_KE",
    detect: ({ features }) => features.sanTongKe,
    evidence: "feature=sanTongKe"
  }
]);
