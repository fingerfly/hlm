import { syncContextRadios } from "./uiBindings.js";
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
  const { store, byId, contextPresets, syncHomeState } = input;
  function applyPreset(name) {
    const preset = contextPresets[name];
    if (!preset) return;
    byId("winType").value = preset.winType;
    byId("handState").value = preset.handState;
    syncContextRadios(byId);
    syncHomeState();
  }
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
  return { applyPreset, setPickerMode };
}
