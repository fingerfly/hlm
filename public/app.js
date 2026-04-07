import { evaluateCapturedHand } from "../src/app/evaluateCapturedHand.js";
import { getDisplayVersion } from "../src/config/appVersion.js";
import {
  createTilePickerState,
  addTileToPicker,
  addTilesToPicker,
  selectPickerSlot,
  deleteSelectedSlot,
  clearTilePicker,
  undoLastTile,
  undoLastAction,
  undoBySlot
} from "../src/app/tilePickerState.js";
import { resolvePatternAction } from "../src/app/tilePatternActions.js";
import { createUiFlowState, canCalculate } from "../src/app/uiFlowState.js";
import { TAB_TILES } from "./uiConfig.js";
import {
  renderTilePreview,
  renderPickerTabButtons,
  renderTilePickerGrid
} from "./uiRenderers.js";
import {
  resetContext,
  bindTabButtons
} from "./uiBindings.js";
import { readStoredGestureTipDismissed } from "./pickerModeState.js";
import { bindCloseButtons } from "./modalUi.js";
import { renderResultModal } from "./resultModalView.js";
import { createModalActions } from "./appModalActions.js";
import { createStateActions } from "./appStateActions.js";
import {
  wireAppEvents,
  renderPickerByTab,
  syncWizardModals
} from "./appEventWiring.js";
import { createAppRefs } from "./appRefs.js";
import { createDefaultRoundPlayers } from "../src/app/roundSettlement.js";
import {
  syncDesktopPickerSheet,
  installDesktopPickerLayoutListener
} from "./desktopPickerMount.js";
import { mountHelpContent } from "./helpContentMount.js";
import { installHelpFanHashNavigation } from "./helpFanHash.js";
import {
  readStoredScoreRuleSelection,
  writeScoreRulePresetSelection,
  writeCustomScoreRuleFromPreset
} from "./scoreRuleState.js";
import { SCORE_RULE_PRESET_IDS } from "../src/config/scoreRuleConfig.js";
import { installModalBackdropDismiss } from "./modalBackdropWiring.js";
import { focusFirstInModalSheet } from "./modalFocusUtils.js";

/**
 * Purpose: Bootstrap HLM web UI and connect app modules.
 * Description:
 * - Initializes store, refs, and action factories.
 * - Wires DOM events to state and modal transitions.
 * - Performs first render and default home-state sync.
 */
const versionLabel = getDisplayVersion();
const byId = (id) => document.getElementById(id);
byId("versionBadge").textContent = `当前版本: ${versionLabel}`;
const splashEl = byId("appSplash");
const splashVersionEl = byId("splashVersion");
if (splashVersionEl) {
  splashVersionEl.textContent = `版本 ${versionLabel}`;
}
const { refs, modalRefs } = createAppRefs(byId);
const initialRuleSelection = readStoredScoreRuleSelection();

const store = {
  uiState: createUiFlowState(),
  roundState: {
    initialized: false,
    dealerSeat: "E",
    players: createDefaultRoundPlayers(),
    scoreRulePreset: initialRuleSelection.presetId,
    scoreRuleConfig: initialRuleSelection.ruleConfig
  },
  pickerState: createTilePickerState([]),
  pickerAction: "single",
  pickerActionOnce: null,
  pickerActionLock: null,
  pickerGestureTipDismissed: readStoredGestureTipDismissed(),
  resultVm: null
};
const wizardUi = { afterPickerSync: () => {} };
const stateActions = createStateActions(store, {
  byId,
  refs,
  wizardUi,
  addTileToPicker,
  addTilesToPicker,
  resolvePatternAction,
  selectPickerSlot,
  deleteSelectedSlot,
  clearTilePicker,
  undoLastTile,
  undoLastAction,
  undoBySlot,
  evaluateCapturedHand,
  renderTilePreview,
  renderResultModal
});
const modalActions = createModalActions(store, modalRefs, {
  onBeforeClosePicker: () => stateActions.closeTileContextMenu?.(),
  onBeforeOpenModal: () => {
    const pop = byId("helpPopover");
    if (pop) pop.hidden = true;
    const moreBtn = byId("moreBtn");
    if (moreBtn) moreBtn.setAttribute("aria-expanded", "false");
  },
  onAfterOpenModal: (modalKey) => {
    focusFirstInModalSheet(modalKey, byId, modalRefs);
  }
});

installModalBackdropDismiss(
  [
    { el: modalRefs.picker, key: "picker" },
    { el: modalRefs.context, key: "context" },
    { el: modalRefs.result, key: "result" },
    { el: modalRefs.help, key: "help" }
  ],
  (key) => modalActions.closeModalByKey(key)
);

syncDesktopPickerSheet(byId);
installDesktopPickerLayoutListener(byId, () => modalActions.updateModalUi());

wizardUi.afterPickerSync = () => {
  if (localStorage.getItem("hlm_disableAutoWizardAdvance") === "1") {
    return;
  }
  const step = store.uiState.wizard?.step || 1;
  if (step !== 2) return;
  if (!canCalculate(store.uiState)) return;
  const result = stateActions.goWizardNext();
  syncWizardModals(result, modalActions);
};

let splashTimerId = null;
function dismissSplash() {
  if (splashTimerId !== null) {
    clearTimeout(splashTimerId);
    splashTimerId = null;
  }
  if (splashEl) splashEl.classList.add("splash-dismissed");
}
const reduceMotion = globalThis.matchMedia?.(
  "(prefers-reduced-motion: reduce)"
)?.matches;
const splashMs = reduceMotion ? 400 : 900;
splashTimerId = globalThis.setTimeout(() => {
  splashTimerId = null;
  dismissSplash();
}, splashMs);
const splashSkipBtn = byId("splashSkipBtn");
if (splashSkipBtn) {
  splashSkipBtn.addEventListener("click", () => dismissSplash());
}

function mountDesktopContextInline() {
  const isDesktop = globalThis.matchMedia?.("(min-width: 1024px)")?.matches;
  if (!isDesktop) return;
  const host = byId("desktopContextHost");
  const contextModal = byId("contextModal");
  const contextSheet = contextModal?.querySelector(".context-sheet");
  if (!host || !contextModal || !contextSheet) return;
  if (!host.contains(contextSheet)) host.appendChild(contextSheet);
  contextModal.classList.add("desktop-inline-context");
  host.dataset.mode = "inline";
}
mountDesktopContextInline();

function syncDiscarderVisibility() {
  const winType = byId("winType")?.value;
  const winner = byId("winnerSeat")?.value || "";
  const discarder = byId("discarderSeat");
  if (!discarder) return;
  const wrap = discarder.closest(".context-desktop-field");
  const hint = byId("roleValidationError");
  const shouldShow = winType === "dianhe";
  if (wrap) wrap.hidden = !shouldShow;
  discarder.disabled = !shouldShow;
  discarder.required = shouldShow;
  if (shouldShow && !discarder.value) {
    const options = Array.from(discarder.options || []).map((o) => o.value);
    const fallback = options.find((v) => v && v !== winner) || "";
    discarder.value = fallback;
  }
  if (!shouldShow) {
    discarder.value = "";
    if (hint) {
      hint.textContent = "";
      hint.hidden = true;
    }
  }
}

function syncScoreRuleStatus() {
  const statusEl = refs.scoreRuleStatusEl;
  const presetEl = byId("scoreRulePreset");
  if (presetEl) {
    presetEl.value = store.roundState?.scoreRulePreset
      || SCORE_RULE_PRESET_IDS.MCR_OFFICIAL;
  }
  if (!statusEl) return;
  const meta = store.roundState?.scoreRuleConfig?.meta || {};
  const name = meta.name || store.roundState?.scoreRulePreset || "未知规则";
  const version = meta.version || "n/a";
  statusEl.textContent = `当前规则：${name}（${version}）`;
}

/** Marks the seat panel matching dealerSeat with .is-dealer (visual only). */
function syncRoundSetupDealerHighlight() {
  const dealer = byId("dealerSeat")?.value || "E";
  document.querySelectorAll(".round-setup-seat[data-seat]").forEach((el) => {
    el.classList.toggle("is-dealer", el.dataset.seat === dealer);
  });
}

const dealerSeatEl = byId("dealerSeat");
if (dealerSeatEl) {
  dealerSeatEl.addEventListener("change", syncRoundSetupDealerHighlight);
  syncRoundSetupDealerHighlight();
}
const scoreRulePresetEl = byId("scoreRulePreset");
if (scoreRulePresetEl) {
  scoreRulePresetEl.addEventListener("change", () => {
    const id = scoreRulePresetEl.value || SCORE_RULE_PRESET_IDS.MCR_OFFICIAL;
    writeScoreRulePresetSelection(id);
    const next = readStoredScoreRuleSelection();
    store.roundState = {
      ...(store.roundState || {}),
      scoreRulePreset: next.presetId,
      scoreRuleConfig: next.ruleConfig
    };
    syncScoreRuleStatus();
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
    syncScoreRuleStatus();
  });
}
syncScoreRuleStatus();

function applyStep3CalculateFailureHint() {
  const roleErr = byId("roleValidationError");
  if (
    roleErr
    && !roleErr.hidden
    && String(roleErr.textContent || "").trim().length > 0
  ) {
    return;
  }
  const hint = byId("readyHint");
  if (!hint) return;
  const tiles = store.uiState.hand?.tiles;
  if (!Array.isArray(tiles) || tiles.length !== 14) {
    hint.textContent = "请先选满 14 张手牌后再计算。";
    return;
  }
  hint.textContent =
    "无法计算：请检查和牌条件与结算角色（点和须选放铳者）。";
}

const { openHelp } = wireAppEvents({
  byId,
  bindTabButtons,
  bindCloseButtons,
  modalActions,
  stateActions,
  store,
  tabTiles: TAB_TILES,
  tilePickerGridEl: refs.tilePickerGridEl,
  renderPickerTabButtons,
  renderTilePickerGrid,
  resetContext,
  wizardNextHooks: {
    onStep3CalculateFailed: applyStep3CalculateFailureHint
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const m = store.uiState.modal;
  const ctxModal = byId("contextModal");
  const ctxInline = ctxModal?.classList?.contains("desktop-inline-context");
  if (m.picker) {
    event.preventDefault();
    modalActions.closeModalByKey("picker");
    return;
  }
  if (m.context && !ctxInline) {
    event.preventDefault();
    modalActions.closeModalByKey("context");
    return;
  }
  if (m.result) {
    event.preventDefault();
    modalActions.closeModalByKey("result");
    return;
  }
});
mountHelpContent(byId);
installHelpFanHashNavigation({ byId, openHelp });
renderPickerByTab({
  store,
  tabTiles: TAB_TILES,
  tilePickerGridEl: refs.tilePickerGridEl,
  renderPickerTabButtons,
  renderTilePickerGrid,
  stateActions
});
stateActions.syncHomeState();
syncWizardModals({ ok: true, step: 1 }, modalActions);
modalActions.updateModalUi();
syncDiscarderVisibility();
const winTypeEl = byId("winType");
if (winTypeEl) {
  winTypeEl.addEventListener("change", syncDiscarderVisibility);
}
