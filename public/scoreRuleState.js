import {
  SCORE_RULE_PRESET_IDS,
  getScoreRulePreset
} from "../src/config/scoreRuleConfig.js";
import {
  normalizeScoreRuleConfig
} from "../src/contracts/scoreRuleConfigValidator.js";

const STORAGE_KEY_PRESET = "hlm_score_rule_preset";
const STORAGE_KEY_CUSTOM = "hlm_score_rule_custom_v1";

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function readStoredScoreRuleSelection() {
  const preset = localStorage.getItem(STORAGE_KEY_PRESET)
    || SCORE_RULE_PRESET_IDS.MCR_OFFICIAL;
  if (preset !== SCORE_RULE_PRESET_IDS.CUSTOM) {
    return {
      presetId: preset,
      ruleConfig: getScoreRulePreset(preset),
      fallback: false,
      problems: []
    };
  }
  const customRaw = localStorage.getItem(STORAGE_KEY_CUSTOM) || "";
  const customParsed = parseJson(customRaw);
  const normalized = normalizeScoreRuleConfig(customParsed);
  const config = normalized.fallback
    ? getScoreRulePreset(SCORE_RULE_PRESET_IDS.CURRENT_COMPAT)
    : customParsed;
  return {
    presetId: normalized.fallback
      ? SCORE_RULE_PRESET_IDS.CURRENT_COMPAT
      : SCORE_RULE_PRESET_IDS.CUSTOM,
    ruleConfig: config,
    fallback: normalized.fallback,
    problems: normalized.problems
  };
}

export function writeScoreRulePresetSelection(presetId) {
  localStorage.setItem(STORAGE_KEY_PRESET, presetId);
}

export function writeCustomScoreRuleFromPreset(basePresetId) {
  const base = getScoreRulePreset(basePresetId);
  const custom = {
    ...base,
    meta: {
      ...base.meta,
      id: SCORE_RULE_PRESET_IDS.CUSTOM,
      name: "自定义规则",
      editable: true
    }
  };
  localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(custom));
  localStorage.setItem(STORAGE_KEY_PRESET, SCORE_RULE_PRESET_IDS.CUSTOM);
  return custom;
}

