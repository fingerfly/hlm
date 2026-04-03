/**
 * Purpose: Define settlement rule presets and ids.
 * Description:
 * - Provides stable preset ids used by UI and storage.
 * - Keeps current-compatible and MCR-preferring presets side by side.
 * - Exposes immutable preset lookup helpers.
 */

export const SCORE_RULE_PRESET_IDS = Object.freeze({
  MCR_OFFICIAL: "MCR_Official",
  CURRENT_COMPAT: "Current_Compat",
  CUSTOM: "Custom"
});

const CURRENT_COMPAT_PRESET = Object.freeze({
  meta: {
    id: SCORE_RULE_PRESET_IDS.CURRENT_COMPAT,
    name: "当前兼容",
    version: "1.0.0",
    formulaNote: "番数直接作为结算单位（点和1倍，自摸三家均付）",
    editable: false
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
    version: "1.0.0",
    formulaNote: "番数直接作为结算单位（点和1倍，自摸三家均付）",
    editable: false
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
  return SCORE_RULE_PRESETS[id]
    || SCORE_RULE_PRESETS[SCORE_RULE_PRESET_IDS.MCR_OFFICIAL];
}

