import { syncContextRadios } from "./uiBindings.js";
import { syncContextStepperDisplays } from "./contextWiring.js";
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
    const te = byId("timingEvent");
    if (te) te.value = "none";
    const kt = byId("kongType");
    if (kt) kt.value = "none";
    const fc = byId("flowerCount");
    if (fc) fc.value = "0";
    const ka = byId("kongAnCount");
    if (ka) ka.value = "0";
    const km = byId("kongMingCount");
    if (km) km.value = "0";
    syncContextRadios(byId);
    syncContextStepperDisplays(byId);
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
