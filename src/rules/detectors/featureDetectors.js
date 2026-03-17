/**
 * Purpose: Define hand-feature-driven fan detectors.
 * Description:
 * - Uses computed hand features from tile composition.
 * - Keeps suit/composition fan checks isolated.
 * - Supports modular fan-catalog composition.
 */
function advancedDetect(predicate) {
  return (ctx) => ctx.input?.advancedAuto === true && predicate(ctx);
}

export const FEATURE_DETECTORS = Object.freeze([
  {
    id: "QING_YI_SE",
    detect: ({ features }) => features.pureOneSuit,
    evidence: "feature=pureOneSuit"
  },
  {
    id: "HUN_YI_SE",
    detect: ({ features }) => features.mixedOneSuit,
    evidence: "feature=mixedOneSuit"
  },
  {
    id: "DUAN_YAO",
    detect: ({ features }) => features.allSimples,
    evidence: "feature=allSimples"
  },
  {
    id: "PENG_PENG_HU",
    detect: ({ features }) => features.allPungs,
    evidence: "feature=allPungs"
  },
  {
    id: "HUN_YAO_JIU",
    detect: ({ features }) => features.allTerminalsAndHonors,
    evidence: "feature=allTerminalsAndHonors"
  },
  {
    id: "ZI_YI_SE",
    detect: ({ features }) => features.allHonors,
    evidence: "feature=allHonors"
  },
  {
    id: "QING_YAO_JIU",
    detect: ({ features }) => features.allTerminals,
    evidence: "feature=allTerminals"
  },
  {
    id: "QING_LONG",
    detect: ({ features }) => features.pureStraight,
    evidence: "feature=pureStraight"
  },
  {
    id: "PING_HU",
    detect: ({ features }) => features.allChows,
    evidence: "feature=allChows"
  },
  {
    id: "YI_BAN_GAO",
    detect: ({ features }) => features.pureDoubleChow,
    evidence: "feature=pureDoubleChow"
  },
  {
    id: "SAN_SE_SAN_TONG_SHUN",
    detect: ({ features }) => features.mixedTripleChow,
    evidence: "feature=mixedTripleChow"
  },
  {
    id: "MEN_FENG_KE",
    detect: ({ features }) => features.seatWindPung,
    evidence: "feature=seatWindPung"
  },
  {
    id: "QUAN_FENG_KE",
    detect: ({ features }) => features.prevalentWindPung,
    evidence: "feature=prevalentWindPung"
  },
  {
    id: "DA_SI_XI",
    detect: ({ features }) => features.bigFourWinds,
    evidence: "feature=bigFourWinds"
  },
  {
    id: "XIAO_SI_XI",
    detect: ({ features }) => features.littleFourWinds,
    evidence: "feature=littleFourWinds"
  },
  {
    id: "DA_SAN_YUAN",
    detect: ({ features }) => features.bigThreeDragons,
    evidence: "feature=bigThreeDragons"
  },
  {
    id: "XIAO_SAN_YUAN",
    detect: ({ features }) => features.littleThreeDragons,
    evidence: "feature=littleThreeDragons"
  },
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
  },
  {
    id: "LV_YI_SE",
    detect: advancedDetect(({ features }) => features.lvYiSe),
    evidence: "feature=lvYiSe"
  },
  {
    id: "JIU_LIAN_BAO_DENG",
    detect: advancedDetect(({ features }) => features.jiuLianBaoDeng),
    evidence: "feature=jiuLianBaoDeng"
  },
  {
    id: "QI_LIAN_DUI",
    detect: advancedDetect(({ features }) => features.qiLianDui),
    evidence: "feature=qiLianDui"
  },
  {
    id: "YI_SE_SHUANG_LONG_HUI",
    detect: advancedDetect(({ features }) => features.yiSeShuangLongHui),
    evidence: "feature=yiSeShuangLongHui"
  },
  {
    id: "YI_SE_SI_TONG_SHUN",
    detect: advancedDetect(({ features }) => features.yiSeSiTongShun),
    evidence: "feature=yiSeSiTongShun"
  },
  {
    id: "YI_SE_SI_BU_GAO",
    detect: advancedDetect(({ features }) => features.yiSeSiBuGao),
    evidence: "feature=yiSeSiBuGao"
  },
  {
    id: "QUAN_SHUANG_KE",
    detect: advancedDetect(({ features }) => features.quanShuangKe),
    evidence: "feature=quanShuangKe"
  },
  {
    id: "YI_SE_SAN_TONG_SHUN",
    detect: advancedDetect(({ features }) => features.yiSeSanTongShun),
    evidence: "feature=yiSeSanTongShun"
  },
  {
    id: "YI_SE_SAN_JIE_GAO",
    detect: advancedDetect(({ features }) => features.yiSeSanJieGao),
    evidence: "feature=yiSeSanJieGao"
  },
  {
    id: "SAN_SE_SAN_JIE_GAO",
    detect: advancedDetect(({ features }) => features.sanSeSanJieGao),
    evidence: "feature=sanSeSanJieGao"
  },
  {
    id: "QUAN_DAI_WU",
    detect: advancedDetect(({ features }) => features.quanDaiWu),
    evidence: "feature=quanDaiWu"
  },
  {
    id: "WU_MEN_QI",
    detect: advancedDetect(({ features }) => features.wuMenQi),
    evidence: "feature=wuMenQi"
  },
  {
    id: "QUAN_DAI_YAO",
    detect: advancedDetect(({ features }) => features.quanDaiYao),
    evidence: "feature=quanDaiYao"
  },
  {
    id: "JIAN_KE",
    detect: advancedDetect(({ features }) => features.jianKe),
    evidence: "feature=jianKe"
  },
  {
    id: "YAO_JIU_KE",
    detect: advancedDetect(({ features }) => features.yaoJiuKe),
    evidence: "feature=yaoJiuKe"
  },
  {
    id: "SAN_SE_SHUANG_LONG_HUI",
    detect: advancedDetect(({ features }) => features.sanSeShuangLongHui),
    evidence: "feature=sanSeShuangLongHui"
  }
]);
