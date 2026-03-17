import {
  getPickerTilesByMode,
  applyPickerModeUi
} from "./pickerModeView.js";

/**
 * Render current tab buttons and tile picker grid.
 *
 * @param {object} params - Rendering and state dependencies.
 * @returns {void}
 */
export function renderPickerByTab(params) {
  const {
    store,
    tabTiles,
    tilePickerGridEl,
    renderPickerTabButtons,
    renderTilePickerGrid,
    stateActions
  } = params;
  const pickerMode = store.uiState.hand.pickerMode || "twoLayer";
  renderPickerTabButtons(store.uiState.hand.activeTab);
  applyPickerModeUi(pickerMode);
  renderTilePickerGrid({
    tilePickerGridEl,
    tiles: getPickerTilesByMode(
      tabTiles,
      pickerMode,
      store.uiState.hand.activeTab
    ),
    onPick: (tile) => stateActions.pickTile(tile)
  });
}
