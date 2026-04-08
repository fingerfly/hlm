/**
 * Purpose: Feature detectors — rare hands and `advancedAuto` gates.
 * Description:
 * - Final segment of `FEATURE_DETECTORS` (catalog order preserved).
 */
import { advancedDetect } from "./advancedDetect.js";

export const FEATURE_DETECTORS_ADVANCED = Object.freeze([
  {
    id: "LV_YI_SE",
    detect: advancedDetect(({ features }) => features.lvYiSe),
    evidence: "feature=lvYiSe"
  },
  {
    id: "TUI_BU_DAO",
    detect: ({ features }) => features.tuiBuDao,
    evidence: "feature=tuiBuDao"
  },
  {
    id: "JIU_LIAN_BAO_DENG",
    detect: ({ features }) => features.jiuLianBaoDeng,
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
    id: "YI_SE_SI_JIE_GAO",
    detect: advancedDetect(({ features }) => features.yiSeSiJieGao),
    evidence: "feature=yiSeSiJieGao"
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
  },
  {
    id: "ZU_HE_LONG",
    detect: advancedDetect(({ features }) => features.zuHeLong),
    evidence: "feature=zuHeLong"
  },
  {
    id: "SI_GUI_YI",
    detect: advancedDetect(({ features }) => features.siGuiYi),
    evidence: "feature=siGuiYi"
  }
]);
