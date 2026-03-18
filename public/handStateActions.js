import { resolveInitialPickerMode } from "./pickerModeState.js";
import { createHandPickerActions } from "./handPickerActions.js";
import { createHandContextActions } from "./handContextActions.js";

/**
 * Initialize picker mode in store from policy.
 *
 * @param {{uiState: object}} store - Mutable app store.
 * @returns {void}
 */
export function initPickerMode(store) {
  const mode = resolveInitialPickerMode();
  store.uiState = {
    ...store.uiState,
    hand: {
      ...store.uiState.hand,
      pickerMode: store.uiState.hand.pickerMode || mode
    }
  };
}

/**
 * Create hand and picker related state actions.
 *
 * @param {object} input - Hand action dependencies.
 * @returns {object}
 */
export function createHandStateActions(input) {
  const {
    store,
    byId,
    contextPresets,
    syncHomeState
  } = input;
  const contextActions = createHandContextActions({
    store,
    byId,
    contextPresets,
    syncHomeState
  });
  const pickerActions = createHandPickerActions(input);
  return {
    ...contextActions,
    ...pickerActions
  };
}
