/**
 * Purpose: Define win-pattern-driven fan detectors.
 * Description:
 * - Depends on resolved win pattern from win validator.
 * - Keeps special hand fan logic isolated from other categories.
 * - Supports modular fan-catalog composition.
 */
export const PATTERN_DETECTORS = Object.freeze([
  {
    id: "QUAN_BU_KAO",
    detect: ({ win, input }) =>
      win.pattern === "quan_bu_kao" ||
      input.specialPattern === "quan_bu_kao",
    evidence: "pattern|specialPattern=quan_bu_kao"
  },
  {
    id: "QI_DUI",
    detect: ({ win }) => win.pattern === "seven_pairs",
    evidence: "pattern=seven_pairs"
  },
  {
    id: "SHI_SAN_YAO",
    detect: ({ win }) => win.pattern === "thirteen_orphans",
    evidence: "pattern=thirteen_orphans"
  }
]);
