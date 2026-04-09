/**
 * Purpose: Wire round-setup DOM listeners (dealer, score rules, win type).
 * Description:
 * - Subscribes dealer highlight and score-rule persistence callbacks.
 * - Subscribes discarder visibility to win type changes.
 */
import { SCORE_RULE_PRESET_IDS } from "../src/config/scoreRuleConfig.js";
import {
  syncDiscarderVisibility,
  syncRoundSetupDealerHighlight,
  syncScoreRuleStatus
} from "./roundSetupDomSync.js";

/**
 * Install change listeners for round setup and initial sync calls.
 *
 * @param {object} opts
 * @param {(id: string) => HTMLElement|null} opts.byId
 * @param {{ roundState: object }} opts.store
 * @param {{ scoreRuleStatusEl?: HTMLElement|null }} opts.refs
 * @param {(id: string) => void} opts.writeScoreRulePresetSelection
 * @param {() => object} opts.readStoredScoreRuleSelection
 * @param {(baseId: string) => void} opts.writeCustomScoreRuleFromPreset
 * @returns {void}
 */
export function installRoundSetupBindings({
  byId,
  store,
  refs,
  writeScoreRulePresetSelection,
  readStoredScoreRuleSelection,
  writeCustomScoreRuleFromPreset
}) {
  const dealerSeatEl = byId("dealerSeat");
  if (dealerSeatEl) {
    dealerSeatEl.addEventListener("change", () => {
      syncRoundSetupDealerHighlight(byId);
    });
    syncRoundSetupDealerHighlight(byId);
  }
  const scoreRulePresetEl = byId("scoreRulePreset");
  if (scoreRulePresetEl) {
    scoreRulePresetEl.addEventListener("change", () => {
      const id =
        scoreRulePresetEl.value || SCORE_RULE_PRESET_IDS.MCR_OFFICIAL;
      writeScoreRulePresetSelection(id);
      const next = readStoredScoreRuleSelection();
      store.roundState = {
        ...(store.roundState || {}),
        scoreRulePreset: next.presetId,
        scoreRuleConfig: next.ruleConfig
      };
      syncScoreRuleStatus({ refs, store, byId });
    });
  }
  const cloneScoreRuleBtn = byId("cloneScoreRuleBtn");
  if (cloneScoreRuleBtn) {
    cloneScoreRuleBtn.addEventListener("click", () => {
      const baseId = store.roundState?.scoreRulePreset
        || SCORE_RULE_PRESET_IDS.MCR_OFFICIAL;
      writeCustomScoreRuleFromPreset(baseId);
      const next = readStoredScoreRuleSelection();
      store.roundState = {
        ...(store.roundState || {}),
        scoreRulePreset: next.presetId,
        scoreRuleConfig: next.ruleConfig
      };
      syncScoreRuleStatus({ refs, store, byId });
    });
  }
  syncScoreRuleStatus({ refs, store, byId });
  const winTypeEl = byId("winType");
  if (winTypeEl) {
    winTypeEl.addEventListener("change", () =>
      syncDiscarderVisibility(byId)
    );
  }
  syncDiscarderVisibility(byId);
}
