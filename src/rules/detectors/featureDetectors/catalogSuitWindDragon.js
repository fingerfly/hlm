/**
 * Purpose: Feature detectors — suit, meld shape, winds, dragons.
 * Description:
 * - First segment of `FEATURE_DETECTORS` (catalog order preserved).
 */

export const FEATURE_DETECTORS_SUIT_WIND_DRAGON = Object.freeze([
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
  }
]);
