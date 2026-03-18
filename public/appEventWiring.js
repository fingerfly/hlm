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
  bindPatternActionButtons
} from "./appEventBindings.js";
import {
  wireContextSegmentedControls,
  wireSlotClickToPicker
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
 * Handle wizard "next" button: from step 2, directly calculate and show result
 * modal; otherwise advance wizard step.
 *
 * @param {object} store - App store with uiState.
 * @param {object} stateActions - calculate, goWizardNext.
 * @param {object} modalActions - closeModalByKey, updateModalUi.
 * @param {Function} syncWizardModalsFn - syncWizardModals.
 * @returns {void}
 */
export function handleWizardNextClick(
  store,
  stateActions,
  modalActions,
  syncWizardModalsFn
) {
  const step = store.uiState.wizard?.step || 1;
  if (step === 2) {
    modalActions.closeModalByKey("picker");
    modalActions.closeModalByKey("context");
    if (stateActions.calculate()) modalActions.updateModalUi();
    return;
  }
  const result = stateActions.goWizardNext();
  syncWizardModalsFn(result, modalActions);
}

/**
 * Keep modal stack aligned with wizard step.
 *
 * @param {{ok:boolean, needs?:string, step?:number}} result - Step result.
 * @param {{openModalByKey:Function, closeModalByKey:Function}} modalActions
 * @returns {void}
 */
export function syncWizardModals(result, modalActions) {
  if (!result.ok && result.needs === "tiles") {
    modalActions.closeModalByKey("context");
    modalActions.openModalByKey("picker");
    return;
  }
  if (result.step === 1) {
    modalActions.closeModalByKey("context");
    modalActions.openModalByKey("picker");
    return;
  }
  if (result.step === 2) {
    modalActions.closeModalByKey("picker");
    modalActions.openModalByKey("context");
  }
}


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
    stateActions.jumpWizardStep(1);
    modalActions.closeModalByKey("context");
    modalActions.openModalByKey("picker");
  });
  bindClick("clearHandBtn", stateActions.clearHand);
  bindClick("wizardNextBtn", () =>
    handleWizardNextClick(store, stateActions, modalActions, syncWizardModals)
  );
  bindClick("wizardBackBtn", () => {
    const result = stateActions.goWizardPrev();
    syncWizardModals(result, modalActions);
  });
  bindPatternActionButtons(stateActions);
  wireSlotClickToPicker({
    byId,
    stateActions,
    modalActions,
    renderPicker
  });
  bindClick("pickerDeleteBtn", () => {
    stateActions.deleteSelected();
  });
  bindClick("pickerUndoBtn", () => {
    stateActions.undoHand();
  });
  bindClick("pickerClearBtn", stateActions.clearHand);
  bindClick("playAgainBtn", () => {
    stateActions.clearHand();
    stateActions.jumpWizardStep(1);
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
