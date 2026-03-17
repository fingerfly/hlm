/**
 * Purpose: Manage picker mode policy and persistence.
 * Description:
 * - Resolves initial mode from device class and stored value.
 * - Reads and writes desktop mode preference from localStorage.
 */
const PICKER_MODE_KEY = "hlm.pickerMode";
const PICKER_MODES = new Set(["twoLayer", "flat"]);

/**
 * Resolve initial picker mode by device and stored value.
 *
 * @param {{isMobile: boolean, storedMode: string|null}} input
 * @returns {"twoLayer"|"flat"}
 */
export function resolveInitialPickerMode({ isMobile, storedMode }) {
  if (isMobile) return "twoLayer";
  return PICKER_MODES.has(storedMode) ? storedMode : "twoLayer";
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
