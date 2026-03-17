/**
 * Purpose: Render picker mode dependent tile grid.
 * Description:
 * - Resolves tile source by picker mode and active tab.
 * - Syncs mode toggle active styles and tab visibility.
 */

/**
 * Resolve tile list by picker mode and active tab.
 *
 * @param {Record<string, string[]>} tabTiles - Tile groups by tab.
 * @param {"twoLayer"|"flat"} pickerMode - Picker layout mode.
 * @param {string} activeTab - Active tab key.
 * @returns {string[]}
 */
export function getPickerTilesByMode(tabTiles, pickerMode, activeTab) {
  if (pickerMode === "flat") {
    return Object.values(tabTiles).flat();
  }
  return tabTiles[activeTab] || [];
}

/**
 * Sync picker mode UI controls.
 *
 * @param {"twoLayer"|"flat"} pickerMode - Current picker mode.
 * @returns {void}
 */
export function applyPickerModeUi(pickerMode) {
  const tabWrap = document.querySelector(".picker-tabs");
  if (tabWrap) tabWrap.hidden = pickerMode === "flat";
  const modeButtons = document.querySelectorAll("[data-picker-mode]");
  for (const button of modeButtons) {
    const isActive = button.dataset.pickerMode === pickerMode;
    button.classList.toggle("active", isActive);
  }
}
