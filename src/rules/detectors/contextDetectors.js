/**
 * Purpose: Define context-driven fan detectors.
 * Description:
 * - Uses request context fields only (win type, hand state, timing event).
 * - Keeps one detector object per fan id.
 * - Supports modular fan-catalog composition.
 */
function kongCount(input, key) {
  if (!input || typeof input !== "object") return 0;
  const value = Number.parseInt(input?.kongSummary?.[key] ?? 0, 10);
  if (Number.isNaN(value)) return 0;
  return value;
}

function concealedPungCount(input) {
  const value = Number.parseInt(input?.concealedPungCount ?? 0, 10);
  if (Number.isNaN(value)) return 0;
  return value;
}

export const CONTEXT_DETECTORS = Object.freeze([
  {
    id: "MEN_QIAN_QING",
    detect: ({ input }) => input.handState === "menqian",
    evidence: "handState=menqian"
  },
  {
    id: "ZI_MO",
    detect: ({ input }) => input.winType === "zimo",
    evidence: "winType=zimo"
  },
  {
    id: "QUAN_BU_KAO",
    detect: ({ input }) => input.specialPattern === "quan_bu_kao",
    evidence: "specialPattern=quan_bu_kao"
  },
  {
    id: "GANG_SHANG_HUA",
    detect: ({ input }) => input.timingEvent === "gangshang",
    evidence: "timingEvent=gangshang"
  },
  {
    id: "MIAO_SHOU_HUI_CHUN",
    detect: ({ input }) => input.timingEvent === "miaoshou",
    evidence: "timingEvent=miaoshou"
  },
  {
    id: "HAI_DI_LAO_YUE",
    detect: ({ input }) => input.timingEvent === "haidi",
    evidence: "timingEvent=haidi"
  },
  {
    id: "QIANG_GANG_HU",
    detect: ({ input }) => input.timingEvent === "qianggang",
    evidence: "timingEvent=qianggang"
  },
  {
    id: "AN_GANG",
    detect: ({ input }) => kongCount(input, "an") >= 1,
    evidence: "kongSummary.an>=1"
  },
  {
    id: "MING_GANG",
    detect: ({ input }) => kongCount(input, "ming") >= 1,
    evidence: "kongSummary.ming>=1"
  },
  {
    id: "SHUANG_AN_GANG",
    detect: ({ input }) => kongCount(input, "an") >= 2,
    evidence: "kongSummary.an>=2"
  },
  {
    id: "SHUANG_MING_GANG",
    detect: ({ input }) => kongCount(input, "ming") >= 2,
    evidence: "kongSummary.ming>=2"
  },
  {
    id: "SAN_GANG",
    detect: ({ input }) => (
      kongCount(input, "an") + kongCount(input, "ming") >= 3
    ),
    evidence: "kongSummary.total>=3"
  },
  {
    id: "SI_GANG",
    detect: ({ input }) => (
      kongCount(input, "an") + kongCount(input, "ming") >= 4
    ),
    evidence: "kongSummary.total>=4"
  },
  {
    id: "SHUANG_AN_KE",
    detect: ({ input }) => concealedPungCount(input) >= 2,
    evidence: "concealedPungCount>=2"
  },
  {
    id: "SAN_AN_KE",
    detect: ({ input }) => concealedPungCount(input) >= 3,
    evidence: "concealedPungCount>=3"
  },
  {
    id: "SI_AN_KE",
    detect: ({ input }) => concealedPungCount(input) >= 4,
    evidence: "concealedPungCount>=4"
  },
  {
    id: "QUAN_QIU_REN",
    detect: ({ input }) => (
      input.allSetsMelded === true && input.winType === "dianhe"
    ),
    evidence: "allSetsMelded=true"
  },
  {
    id: "BU_QIU_REN",
    detect: ({ input }) => (
      input.noMeldClaims === true && input.winType === "zimo"
    ),
    evidence: "noMeldClaims=true"
  },
  {
    id: "JUE_ZHANG",
    detect: ({ input }) => input.lastTileOfKind === true,
    evidence: "lastTileOfKind=true"
  },
  {
    id: "BIAN_ZHANG",
    detect: ({ input }) => input.waitType === "edge",
    evidence: "waitType=edge"
  },
  {
    id: "KAN_ZHANG",
    detect: ({ input }) => input.waitType === "closed",
    evidence: "waitType=closed"
  },
  {
    id: "DAN_DIAO_JIANG",
    detect: ({ input }) => input.waitType === "single",
    evidence: "waitType=single"
  },
  {
    id: "HUA_PAI",
    detect: ({ input }) => Number.parseInt(input.flowerCount ?? 0, 10) > 0,
    evidence: "flowerCount>0"
  },
  {
    id: "QI_XING_BU_KAO",
    detect: ({ input }) => input.specialPattern === "qixing_bukao",
    evidence: "specialPattern=qixing_bukao"
  },
  {
    id: "WU_FAN_HE",
    detect: ({ input }) => input.isChickenHand === true,
    evidence: "isChickenHand=true"
  }
]);
