/**
 * Purpose: Define settlement rule presets and ids.
 * Description:
 * - Provides stable preset ids used by UI and storage.
 * - Keeps current-compatible and MCR-preferring presets side by side.
 * - Exposes immutable preset lookup helpers.
 * - Builds scoring snapshots for gate + settlement mode at runtime.
 */

export const SCORE_RULE_PRESET_IDS = Object.freeze({
  MCR_OFFICIAL: "MCR_Official",
  CURRENT_COMPAT: "Current_Compat",
  CUSTOM: "Custom"
});

export const SETTLEMENT_MODES = Object.freeze({
  COMPAT_LINEAR: "compatLinear",
  OFFICIAL_BASE_FAN: "officialBaseFan"
});

const CURRENT_COMPAT_PRESET = Object.freeze({
  meta: {
    id: SCORE_RULE_PRESET_IDS.CURRENT_COMPAT,
    name: "当前兼容",
    version: "1.0.0",
    formulaNote: "番数直接作为结算单位（点和1倍，自摸三家均付）",
    editable: false
  },
  scoring: {
    gateMinFan: 1,
    gateExcludeFanIds: []
  },
  settlement: {
    mode: SETTLEMENT_MODES.COMPAT_LINEAR,
    officialBasePoint: 8
  },
  fanToPoint: {
    mode: "linear",
    linear: { pointPerFan: 1, minPoint: 0, maxPoint: null },
    table: { byFan: {} }
  },
  distribution: {
    zimo: { winnerMultiplier: 3, loserMultiplier: 1 },
    dianhe: { winnerMultiplier: 1, discarderMultiplier: 1 }
  },
  guards: {
    requireManualDiscarderOnDianhe: true,
    forbidDiscarderEqualsWinner: true,
    requireDeltaConservation: true
  }
});

const MCR_OFFICIAL_PRESET = Object.freeze({
  meta: {
    id: SCORE_RULE_PRESET_IDS.MCR_OFFICIAL,
    name: "国标预设",
    version: "1.1.0",
    formulaNote:
      "体育总局口径：8分起和（花牌不计起和分），自摸/点和为底分8+基本分",
    editable: false
  },
  scoring: {
    gateMinFan: 8,
    gateExcludeFanIds: ["HUA_PAI"]
  },
  settlement: {
    mode: SETTLEMENT_MODES.OFFICIAL_BASE_FAN,
    officialBasePoint: 8
  },
  fanToPoint: {
    mode: "linear",
    linear: { pointPerFan: 1, minPoint: 0, maxPoint: null },
    table: { byFan: {} }
  },
  distribution: {
    zimo: { winnerMultiplier: 3, loserMultiplier: 1 },
    dianhe: { winnerMultiplier: 1, discarderMultiplier: 1 }
  },
  guards: {
    requireManualDiscarderOnDianhe: true,
    forbidDiscarderEqualsWinner: true,
    requireDeltaConservation: true
  }
});

export const SCORE_RULE_PRESETS = Object.freeze({
  [SCORE_RULE_PRESET_IDS.MCR_OFFICIAL]: MCR_OFFICIAL_PRESET,
  [SCORE_RULE_PRESET_IDS.CURRENT_COMPAT]: CURRENT_COMPAT_PRESET
});

export function getScoreRulePreset(id) {
  const fallback = SCORE_RULE_PRESETS[SCORE_RULE_PRESET_IDS.MCR_OFFICIAL];
  return SCORE_RULE_PRESETS[id] || fallback;
}

/**
 * Build runtime scoring snapshot from rule config.
 * Null/undefined uses bundled MCR official preset (8 分起和, HUA_PAI 不计入
 * 起和分, officialBaseFan settlement).
 *
 * @param {object|null|undefined} ruleConfig
 * @returns {{ gateMinFan: number, gateExcludeFanIds: string[],
 *   settlementMode: string, officialBasePoint: number }}
 */
export function buildScoringRuleSnapshot(ruleConfig) {
  const cfg =
    ruleConfig && typeof ruleConfig === "object"
      ? ruleConfig
      : getScoreRulePreset(SCORE_RULE_PRESET_IDS.MCR_OFFICIAL);
  const settlement = cfg.settlement || {};
  const rawMode = settlement.mode;
  const settlementMode =
    rawMode === SETTLEMENT_MODES.OFFICIAL_BASE_FAN
      ? SETTLEMENT_MODES.OFFICIAL_BASE_FAN
      : SETTLEMENT_MODES.COMPAT_LINEAR;
  const baseRaw = settlement.officialBasePoint;
  const officialBasePoint =
    typeof baseRaw === "number" &&
    Number.isFinite(baseRaw) &&
    baseRaw >= 0
      ? Math.floor(baseRaw)
      : 8;
  const scoring = cfg.scoring || {};
  const defaultGate =
    settlementMode === SETTLEMENT_MODES.OFFICIAL_BASE_FAN ? 8 : 1;
  const defaultExclude =
    settlementMode === SETTLEMENT_MODES.OFFICIAL_BASE_FAN ? ["HUA_PAI"] : [];
  const gateMinFan =
    typeof scoring.gateMinFan === "number" &&
    Number.isFinite(scoring.gateMinFan) &&
    scoring.gateMinFan >= 0
      ? Math.floor(scoring.gateMinFan)
      : defaultGate;
  const gateExcludeFanIds = Array.isArray(scoring.gateExcludeFanIds)
    ? scoring.gateExcludeFanIds.filter((id) => typeof id === "string")
    : defaultExclude;
  return {
    gateMinFan,
    gateExcludeFanIds,
    settlementMode,
    officialBasePoint
  };
}
