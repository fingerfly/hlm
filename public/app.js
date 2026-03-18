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
import { createUiFlowState } from "../src/app/uiFlowState.js";
import { TAB_TILES, CONTEXT_PRESETS } from "./uiConfig.js";
import {
  renderTilePreview,
  renderPickerTabButtons,
  renderTilePickerGrid,
  renderPatternActionButtons
} from "./uiRenderers.js";
import {
  resetContext,
  bindTabButtons,
  bindPresetButtons
} from "./uiBindings.js";
import { readStoredGestureTipDismissed } from "./pickerModeState.js";
import { bindCloseButtons } from "./modalUi.js";
import { renderResultModal, renderInfoTip } from "./resultModalView.js";
import { createModalActions } from "./appModalActions.js";
import { createStateActions } from "./appStateActions.js";
import { wireAppEvents, renderPickerByTab } from "./appEventWiring.js";
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
const stateActions = createStateActions(store, {
  byId,
  refs,
  contextPresets: CONTEXT_PRESETS,
  addTileToPicker,
  addTilesToPicker,
  resolvePatternAction,
  renderPatternActionButtons,
  selectPickerSlot,
  deleteSelectedSlot,
  clearTilePicker,
  undoLastTile,
  undoLastAction,
  undoBySlot,
  evaluateCapturedHand,
  renderTilePreview,
  renderResultModal,
  renderInfoTip
});
const modalActions = createModalActions(store, modalRefs);

wireAppEvents({
  byId,
  bindTabButtons,
  bindPresetButtons,
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
