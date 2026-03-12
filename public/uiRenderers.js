import { pickerToTiles } from "../src/app/tilePickerState.js";

/**
 * Purpose: Render tile picker widgets on the client.
 * Description:
 * - Draws selected-tile preview chips for 14 slots.
 * - Marks active tab button for current suit scope.
 * - Renders per-tab tile buttons with pick callback wiring.
 */
/**
 * Render 14-slot tile preview and selected count.
 *
 * @param {object} input - Preview dependencies.
 * @returns {void}
 */
export function renderTilePreview({
  tilePreviewEl,
  tileCountEl,
  pickerState
}) {
  tilePreviewEl.innerHTML = "";
  for (let i = 0; i < 14; i += 1) {
    const chip = document.createElement("span");
    chip.className = "tile-chip";
    chip.textContent = pickerState.slots[i] || `${i + 1}`;
    tilePreviewEl.appendChild(chip);
  }
  tileCountEl.textContent = `${pickerToTiles(pickerState).length}/14`;
}

/**
 * Toggle active class on picker tab buttons.
 *
 * @param {string} activeTab - Active tab key.
 * @returns {void}
 */
export function renderPickerTabButtons(activeTab) {
  for (const button of document.querySelectorAll(".tab-btn")) {
    button.classList.toggle("active", button.dataset.tab === activeTab);
  }
}

/**
 * Render clickable tile buttons for one tab tile set.
 *
 * @param {object} options - Tile grid render options.
 * @returns {void}
 */
export function renderTilePickerGrid({ tilePickerGridEl, tiles, onPick }) {
  tilePickerGridEl.innerHTML = "";
  for (const tile of tiles) {
    const button = document.createElement("button");
    button.textContent = tile;
    button.addEventListener("click", () => onPick(tile));
    tilePickerGridEl.appendChild(button);
  }
}
