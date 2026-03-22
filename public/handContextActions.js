import {
  detectIsMobileViewport,
  writeStoredPickerMode,
  isPickerMode
} from "./pickerModeState.js";

/**
 * Create hand context and mode action handlers.
 *
 * @param {object} input - Context action dependencies.
 * @returns {object}
 */
export function createHandContextActions(input) {
  const { store, syncHomeState } = input;
  function setPickerMode(mode) {
    if (!isPickerMode(mode)) return;
    store.uiState = {
      ...store.uiState,
      hand: {
        ...store.uiState.hand,
        pickerMode: mode
      }
    };
    if (!detectIsMobileViewport()) {
      writeStoredPickerMode(mode);
    }
    syncHomeState();
  }
  return { setPickerMode };
}
