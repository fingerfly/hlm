/**
 * Purpose: Manage picker mode policy and persistence.
 * Description:
 * - Resolves initial mode from device class and stored value.
 * - Reads and writes desktop mode preference from localStorage.
 */
const PICKER_MODE_KEY = "hlm.pickerMode";
const PICKER_GESTURE_TIP_KEY = "hlm.pickerGestureTipDismissed";
const PICKER_MODES = new Set(["twoLayer", "flat"]);

/**
 * Resolve initial picker mode. Always twoLayer after UI simplification.
 *
 * @returns {"twoLayer"}
 */
export function resolveInitialPickerMode() {
  return "twoLayer";
}

/**
 * Detect mobile viewport by matchMedia breakpoint.
 *
 * @returns {boolean}
 */
export function detectIsMobileViewport() {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia) return false;
  return window.matchMedia("(max-width: 759px)").matches;
}

/**
 * Read stored picker mode from localStorage.
 *
 * @returns {string|null}
 */
export function readStoredPickerMode() {
  if (typeof window === "undefined") return null;
  if (!window.localStorage) return null;
  return window.localStorage.getItem(PICKER_MODE_KEY);
}

/**
 * Persist picker mode in localStorage.
 *
 * @param {"twoLayer"|"flat"} mode - Picker mode to store.
 * @returns {void}
 */
export function writeStoredPickerMode(mode) {
  if (typeof window === "undefined") return;
  if (!window.localStorage) return;
  window.localStorage.setItem(PICKER_MODE_KEY, mode);
}

/**
 * Check if a value is one of the known picker modes.
 *
 * @param {string} mode - Candidate picker mode string.
 * @returns {boolean}
 */
export function isPickerMode(mode) {
  return PICKER_MODES.has(mode);
}

/**
 * Read whether picker gesture tip was dismissed before.
 *
 * @returns {boolean}
 */
export function readStoredGestureTipDismissed() {
  if (typeof window === "undefined") return false;
  if (!window.localStorage) return false;
  return window.localStorage.getItem(PICKER_GESTURE_TIP_KEY) === "1";
}

/**
 * Persist picker gesture tip dismissed state.
 *
 * @param {boolean} dismissed - Dismissed state.
 * @returns {void}
 */
export function writeStoredGestureTipDismissed(dismissed) {
  if (typeof window === "undefined") return;
  if (!window.localStorage) return;
  window.localStorage.setItem(PICKER_GESTURE_TIP_KEY, dismissed ? "1" : "0");
}
