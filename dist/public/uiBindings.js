/**
 * Purpose: Bind UI control actions and input-derived request data.
 * Description:
 * - Builds request payload from tile/context controls.
 * - Resets context controls to app defaults.
 * - Attaches tab and preset click handlers.
 */
/**
 * Build scoring request from current tile and context inputs.
 *
 * @param {HTMLInputElement[]} tileInputs - Tile input fields.
 * @param {(id: string) => HTMLElement} byId - Id lookup helper.
 * @returns {{tiles: string[], context: object}}
 */
export function buildRequest(tileInputs, byId) {
  return {
    tiles: tileInputs.map((input) => input.value.trim()),
    context: {
      winType: byId("winType").value,
      handState: byId("handState").value,
      kongType: byId("kongType").value,
      timingEvent: byId("timingEvent").value
    }
  };
}

/**
 * Reset context selectors to app default values.
 *
 * @param {(id: string) => HTMLElement} byId - Id lookup helper.
 * @returns {void}
 */
export function resetContext(byId) {
  byId("winType").value = "zimo";
  byId("handState").value = "menqian";
  byId("kongType").value = "none";
  byId("timingEvent").value = "none";
  const autoCalculate = byId("autoCalculate");
  if (autoCalculate) autoCalculate.checked = true;
}

/**
 * Bind tab buttons and forward selected tab key.
 *
 * @param {(tab: string) => void} onTab - Tab change callback.
 * @returns {void}
 */
export function bindTabButtons(onTab) {
  for (const button of document.querySelectorAll(".tab-btn")) {
    button.addEventListener("click", () => onTab(button.dataset.tab));
  }
}

/**
 * Bind preset buttons and forward selected preset key.
 *
 * @param {(preset: string) => void} onPreset - Preset callback.
 * @returns {void}
 */
export function bindPresetButtons(onPreset) {
  for (const button of document.querySelectorAll("[data-preset]")) {
    button.addEventListener("click", () => onPreset(button.dataset.preset));
  }
}
