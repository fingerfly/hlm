import { canCalculate } from "../src/app/uiFlowState.js";
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
 * Resolve initial picker mode by device and stored value.
 *
 * @param {{isMobile: boolean, storedMode: string|null}} input
 * @returns {"twoLayer"|"flat"}
 */
export function resolveInitialPickerMode({ isMobile, storedMode }) {
  return resolveInitialPickerModePolicy({ isMobile, storedMode });
}

/**
 * Purpose: Provide stateful UI actions for hand workflow.
 * Description:
 * - Syncs picker and context state to home-screen widgets.
 * - Executes clear, undo, preset, and calculate actions.
 * - Builds scoring request payload from current UI controls.
 */
/**
 * Create state action handlers used by event wiring.
 *
 * @param {{uiState: object, pickerState: object,
 *   resultVm: object|null}} store
 * @param {object} deps - Rendering and domain dependencies.
 * @returns {{syncHomeState: Function, applyPreset: Function,
 *   clearHand: Function, undoHand: Function, calculate: Function,
 *   openInfo: Function}}
 */
export function createStateActions(store, deps) {
  const {
    byId,
    refs,
    contextPresets,
    addTilesToPicker,
    resolvePatternAction,
    renderPatternActionButtons,
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand,
    renderTilePreview,
    renderResultModal,
    renderInfoTip,
    getContextActionAvailability
  } = deps;
  initPickerMode(store);
  function syncHomeState() {
    syncHomeStateView({
      store,
      byId,
      refs,
      renderTilePreview,
      renderPatternActionButtons,
      canCalculate
    });
  }
  const handActions = createHandStateActions({
    store,
    byId,
    refs,
    contextPresets,
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastAction,
    undoBySlot,
    getContextActionAvailability,
    syncHomeState
  });
  const resultActions = createResultStateActions({
    store,
    byId,
    refs,
    evaluateCapturedHand,
    renderResultModal,
    renderInfoTip
  });

  return {
    syncHomeState,
    ...handActions,
    ...resultActions
  };
}
