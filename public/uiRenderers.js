import { pickerToTiles } from "../src/app/tilePickerState.js";
import {
  getTileImageDataUrl,
  getTileLabel,
  getTileUnicode
} from "./tileAssets.js";

function makeTileFace(tileCode, fallbackText) {
  const wrap = document.createElement("span");
  wrap.className = "tile-face";
  if (!tileCode) {
    const text = document.createElement("span");
    text.className = "tile-face-text";
    text.textContent = fallbackText;
    wrap.appendChild(text);
    return wrap;
  }
  const unicode = getTileUnicode(tileCode);
  if (unicode) {
    const span = document.createElement("span");
    span.className = "tile-face-unicode";
    span.textContent = unicode;
    span.setAttribute("aria-label", getTileLabel(tileCode));
    wrap.appendChild(span);
    return wrap;
  }
  const imageUrl = getTileImageDataUrl(tileCode);
  if (!imageUrl) {
    const text = document.createElement("span");
    text.className = "tile-face-text";
    text.textContent = getTileLabel(tileCode);
    wrap.appendChild(text);
    return wrap;
  }
  const img = document.createElement("img");
  img.className = "tile-face-img";
  img.src = imageUrl;
  img.alt = getTileLabel(tileCode);
  wrap.appendChild(img);
  return wrap;
}

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
  pickerState,
  editingIndex = null
}) {
  tilePreviewEl.innerHTML = "";
  for (let i = 0; i < 14; i += 1) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "tile-chip";
    if (i === editingIndex) {
      chip.classList.add("tile-chip-selected");
    }
    chip.dataset.slotIndex = String(i);
    chip.setAttribute("aria-label", `编辑第${i + 1}张手牌`);
    chip.appendChild(makeTileFace(pickerState.slots[i], `${i + 1}`));
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
    button.type = "button";
    button.setAttribute("aria-label", `添加${getTileLabel(tile)}`);
    button.appendChild(makeTileFace(tile, tile));
    button.addEventListener("click", () => onPick(tile));
    tilePickerGridEl.appendChild(button);
  }
}

/**
 * Render active quick-action button state.
 *
 * @param {string} actionId - Current quick action id.
 * @returns {void}
 */
export function renderPatternActionButtons(actionId, lockedActionId = null) {
  for (const button of document.querySelectorAll("[data-pattern-action]")) {
    const buttonAction = button.dataset.patternAction;
    const isActive = buttonAction === actionId;
    const isLocked = buttonAction === lockedActionId;
    button.classList.toggle("active", isActive);
    button.classList.toggle("locked", isLocked);
  }
}
