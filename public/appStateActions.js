import {
  canCalculate,
  setWizardStep,
  nextWizardStep,
  prevWizardStep
} from "../src/app/uiFlowState.js";
import { syncHomeStateView } from "./homeStateView.js";
import {
  resolveInitialPickerMode as resolveInitialPickerModePolicy
} from "./pickerModeState.js";
import {
  initPickerMode,
  createHandStateActions
} from "./handStateActions.js";
import { createResultStateActions } from "./resultStateActions.js";

/**
 * Resolve initial picker mode. Always twoLayer after UI simplification.
 *
 * @returns {"twoLayer"}
 */
export function resolveInitialPickerMode() {
  return resolveInitialPickerModePolicy();
}

/**
 * Purpose: Provide stateful UI actions for hand workflow.
 * Description:
 * - Syncs picker and context state to home-screen widgets.
 * - Executes clear, undo, and calculate actions.
 * - Builds scoring request payload from current UI controls.
 *
 * @param {{uiState: object, pickerState: object,
 *   resultVm: object|null}} store
 * @param {object} deps - Rendering and domain dependencies.
 * @returns {object} Handlers including syncHomeState, clearHand, undoHand,
 *   calculate, and picker actions spread from hand state.
 */
export function createStateActions(store, deps) {
  const {
    byId,
    refs,
    wizardUi,
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand,
    renderTilePreview,
    renderResultModal
  } = deps;
  initPickerMode(store);
  function syncHomeState() {
    syncHomeStateView({
      store,
      byId,
      refs,
      renderTilePreview,
      canCalculate
    });
  }
  const handActions = createHandStateActions({
    store,
    byId,
    refs,
    afterPickerSync: () => wizardUi?.afterPickerSync?.(),
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastAction,
    undoBySlot,
    syncHomeState
  });
  const resultActions = createResultStateActions({
    store,
    byId,
    refs,
    evaluateCapturedHand,
    renderResultModal
  });

  function jumpWizardStep(step) {
    store.uiState = setWizardStep(store.uiState, step);
    syncHomeState();
    return store.uiState.wizard.step;
  }

  function goWizardNext() {
    const step = store.uiState.wizard?.step || 1;
    if (step === 1 && !canCalculate(store.uiState)) {
      return { ok: false, needs: "tiles", step };
    }
    store.uiState = nextWizardStep(store.uiState);
    syncHomeState();
    return { ok: true, step: store.uiState.wizard.step };
  }

  function goWizardPrev() {
    store.uiState = prevWizardStep(store.uiState);
    syncHomeState();
    return { ok: true, step: store.uiState.wizard.step };
  }

  return {
    syncHomeState,
    jumpWizardStep,
    goWizardNext,
    goWizardPrev,
    ...handActions,
    ...resultActions
  };
}
