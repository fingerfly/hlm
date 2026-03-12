import { evaluateCapturedHand } from "../src/app/evaluateCapturedHand.js";
import { getDisplayVersion } from "../src/config/appVersion.js";
import {
  createTilePickerState,
  addTileToPicker,
  clearTilePicker,
  undoLastTile
} from "../src/app/tilePickerState.js";
import { createUiFlowState } from "../src/app/uiFlowState.js";
import { TAB_TILES, CONTEXT_PRESETS } from "./uiConfig.js";
import {
  renderTilePreview,
  renderPickerTabButtons,
  renderTilePickerGrid
} from "./uiRenderers.js";
import {
  resetContext,
  bindTabButtons,
  bindPresetButtons
} from "./uiBindings.js";
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
  resultVm: null
};
const stateActions = createStateActions(store, {
  byId,
  refs,
  contextPresets: CONTEXT_PRESETS,
  clearTilePicker,
  undoLastTile,
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
  addTileToPicker,
  resetContext
});
renderPickerByTab({
  store,
  tabTiles: TAB_TILES,
  tilePickerGridEl: refs.tilePickerGridEl,
  renderPickerTabButtons,
  renderTilePickerGrid,
  addTileToPicker,
  stateActions
});
stateActions.syncHomeState();
modalActions.updateModalUi();
