/**
 * Purpose: Bind UI control actions and input-derived request data.
 * Description:
 * - Resets context controls to app defaults.
 * - Attaches tab and preset click handlers.
 */

/**
 * Sync hidden context inputs to their radio buttons.
 *
 * @param {(id: string) => HTMLElement} byId - Id lookup helper.
 * @returns {void}
 */
export function syncContextRadios(byId) {
  const map = [
    ["winType", "winType"],
    ["handState", "handState"],
    ["kongType", "kongType"],
    ["timingEvent", "timingEvent"]
  ];
  for (const [hiddenId, radioName] of map) {
    const hidden = byId(hiddenId);
    if (!hidden) continue;
    const radio = document.querySelector(
      `input[name="${radioName}"][value="${hidden.value}"]`
    );
    if (radio) radio.checked = true;
  }
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
  syncContextRadios(byId);
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
