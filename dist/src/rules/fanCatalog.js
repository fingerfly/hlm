/**
 * Purpose: Define canonical fan detection catalog.
 * Description:
 * - Stores fan id, value, detector callback, and evidence key.
 * - Acts as single source for detector iteration order.
 * - Keeps scoring wiring declarative and easy to extend.
 */
export const FAN_CATALOG = Object.freeze([
  {
    id: "MEN_QIAN_QING",
    fan: 2,
    detect: ({ input }) => input.handState === "menqian",
    evidence: "handState=menqian"
  },
  {
    id: "ZI_MO",
    fan: 1,
    detect: ({ input }) => input.winType === "zimo",
    evidence: "winType=zimo"
  },
  {
    id: "QI_DUI",
    fan: 24,
    detect: ({ win }) => win.pattern === "seven_pairs",
    evidence: "pattern=seven_pairs"
  },
  {
    id: "SHI_SAN_YAO",
    fan: 88,
    detect: ({ win }) => win.pattern === "thirteen_orphans",
    evidence: "pattern=thirteen_orphans"
  },
  {
    id: "GANG_SHANG_HUA",
    fan: 8,
    detect: ({ input }) => input.timingEvent === "gangshang",
    evidence: "timingEvent=gangshang"
  },
  {
    id: "HAI_DI_LAO_YUE",
    fan: 8,
    detect: ({ input }) => input.timingEvent === "haidi",
    evidence: "timingEvent=haidi"
  },
  {
    id: "HE_DI_LAO_YU",
    fan: 8,
    detect: ({ input }) => input.timingEvent === "hedi",
    evidence: "timingEvent=hedi"
  },
  {
    id: "QING_YI_SE",
    fan: 24,
    detect: ({ features }) => features.pureOneSuit,
    evidence: "feature=pureOneSuit"
  },
  {
    id: "HUN_YI_SE",
    fan: 6,
    detect: ({ features }) => features.mixedOneSuit,
    evidence: "feature=mixedOneSuit"
  },
  {
    id: "DUAN_YAO",
    fan: 2,
    detect: ({ features }) => features.allSimples,
    evidence: "feature=allSimples"
  }
]);
