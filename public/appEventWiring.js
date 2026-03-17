/**
 * Purpose: Wire DOM events to UI and state actions.
 * Description:
 * - Renders picker content for current tab.
 * - Connects click/change handlers to action modules.
 * - Keeps event glue separate from state mutations.
 */
import { getPickerTilesByMode } from "./pickerModeView.js";
import { renderPickerByTab } from "./pickerRenderFlow.js";
import {
  createBindClick,
  bindModalCloseButtons,
  bindPatternActionButtons,
  bindPickerModeButtons,
  shouldOpenPickerForContextButton
} from "./appEventBindings.js";
import {
  wireContextSegmentedControls,
  wireSlotContextMenu
} from "./contextWiring.js";

/**
 * Resolve tile list by picker mode and active tab.
 *
 * @param {Record<string, string[]>} tabTiles - Tile groups by tab.
 * @param {"twoLayer"|"flat"} pickerMode - Picker layout mode.
 * @param {string} activeTab - Active tab key.
 * @returns {string[]}
 */
export { getPickerTilesByMode, renderPickerByTab };


/**
 * Attach all app-level event listeners.
 *
 * @param {object} params - DOM and action dependencies.
 * @returns {void}
 */
export function wireAppEvents(params) {
  const {
    byId,
    bindTabButtons,
    bindPresetButtons,
    bindCloseButtons,
    modalActions,
    stateActions,
    store,
    tabTiles,
    tilePickerGridEl,
    renderPickerTabButtons,
    renderTilePickerGrid,
    resetContext
  } = params;
  const bindClick = createBindClick(byId);
  const renderPicker = () => {
    renderPickerByTab({
      store,
      tabTiles,
      tilePickerGridEl,
      renderPickerTabButtons,
      renderTilePickerGrid,
      stateActions
    });
  };

  bindTabButtons((tab) => {
    store.uiState = {
      ...store.uiState,
      hand: { ...store.uiState.hand, activeTab: tab }
    };
    renderPickerByTab({
      store,
      tabTiles,
      tilePickerGridEl,
      renderPickerTabButtons,
      renderTilePickerGrid,
      stateActions
    });
  });

  bindPresetButtons(stateActions.applyPreset);
  bindModalCloseButtons(bindCloseButtons, modalActions);

  bindClick("openPickerBtn", () => {
    modalActions.openModalByKey("picker");
  });
  bindClick("openContextBtn", () => {
    modalActions.openModalByKey("context");
  });
  bindPatternActionButtons(stateActions);
  bindPickerModeButtons(stateActions, renderPicker);
  bindClick("undoBtn", () => stateActions.undoHand());
  wireSlotContextMenu({
    byId,
    store,
    stateActions,
    modalActions,
    renderPicker,
    shouldOpenPickerForContextButton
  });
  bindClick("pickerDeleteBtn", () => {
    stateActions.deleteSelected();
  });
  bindClick("pickerUndoBtn", () => {
    stateActions.undoHand();
  });
  bindClick("clearBtn", stateActions.clearHand);
  bindClick("pickerClearBtn", stateActions.clearHand);
  bindClick("calculateBtn", () => {
    if (stateActions.calculate()) modalActions.updateModalUi();
  });
  bindClick("playAgainBtn", () => {
    stateActions.clearHand();
    modalActions.closeModalByKey("result");
    modalActions.closeModalByKey("info");
  });
  bindClick("openInfoBtn", () => {
    if (!stateActions.openInfo()) return;
    modalActions.openModalByKey("info");
  });

  wireContextSegmentedControls(byId, stateActions);
  bindClick("moreBtn", () => {
    resetContext(byId);
    stateActions.syncHomeState();
  });
}
