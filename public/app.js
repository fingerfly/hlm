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
import { installModalBackdropDismiss } from "./modalBackdropWiring.js";
import { focusFirstInModalSheet } from "./modalFocusUtils.js";
import { installAppSplashLifecycle } from "./appSplash.js";
import { mountDesktopContextInline } from "./desktopContextInlineMount.js";
import { installRoundSetupBindings } from "./roundSetupBindings.js";
import { installEscapeClosesModals } from "./escapeKeyModalWiring.js";
import { applyStep3CalculateFailureHint } from "./wizardCalculateHint.js";

/**
 * Purpose: Bootstrap HLM web UI and connect app modules.
 * Description:
 * - Initializes store, refs, and action factories.
 * - Wires DOM events to state and modal transitions.
 * - Performs first render and default home-state sync.
 */
const versionLabel = getDisplayVersion();
const byId = (id) => document.getElementById(id);
installAppSplashLifecycle({ byId, versionLabel });
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

mountDesktopContextInline(byId);

installRoundSetupBindings({
  byId,
  store,
  refs,
  writeScoreRulePresetSelection,
  readStoredScoreRuleSelection,
  writeCustomScoreRuleFromPreset
});

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
    onStep3CalculateFailed: () => applyStep3CalculateFailureHint(store, byId)
  }
});

installEscapeClosesModals(document, { byId, store, modalActions });
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
