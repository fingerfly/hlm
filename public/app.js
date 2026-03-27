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

const store = {
  uiState: createUiFlowState(),
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
  onBeforeClosePicker: () => stateActions.closeTileContextMenu?.()
});

wizardUi.afterPickerSync = () => {
  if (localStorage.getItem("hlm_disableAutoWizardAdvance") === "1") {
    return;
  }
  const step = store.uiState.wizard?.step || 1;
  if (step !== 1) return;
  if (!canCalculate(store.uiState)) return;
  const result = stateActions.goWizardNext();
  syncWizardModals(result, modalActions);
};

function dismissSplash() {
  if (splashEl) splashEl.classList.add("splash-dismissed");
}
const reduceMotion = globalThis.matchMedia?.(
  "(prefers-reduced-motion: reduce)"
)?.matches;
const splashMs = reduceMotion ? 400 : 900;
globalThis.setTimeout(dismissSplash, splashMs);

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

wireAppEvents({
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
  resetContext
});
renderPickerByTab({
  store,
  tabTiles: TAB_TILES,
  tilePickerGridEl: refs.tilePickerGridEl,
  renderPickerTabButtons,
  renderTilePickerGrid,
  stateActions
});
stateActions.syncHomeState();
modalActions.updateModalUi();
