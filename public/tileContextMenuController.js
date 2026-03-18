/**
 * Purpose: Show/hide tile context menu and wire clicks.
 * Description:
 * - Applies getContextActionAvailability and applyContextMenuAvailability.
 * - Positions menu; wires option clicks to pickTileWithAction.
 * - Closes on Escape or click-outside.
 */
import { getContextActionAvailability } from "../src/app/tilePatternActions.js";
import { applyContextMenuAvailability } from "./contextMenuView.js";

/**
 * Create tile context menu handlers bound to deps.
 *
 * @param {object} deps - Store, byId, pickTileWithAction.
 * @returns {{openTileContextMenu: Function, closeTileContextMenu: Function}}
 */
export function createOpenTileContextMenu(deps) {
  const { store, byId, pickTileWithAction } = deps;

  let escapeHandler = null;
  let clickOutsideHandler = null;
  let menuClickHandler = null;

  function closeTileContextMenu() {
    const menu = byId("tileContextMenu");
    if (!menu) return;
    menu.hidden = true;
    if (menuClickHandler) {
      menu.removeEventListener("click", menuClickHandler);
      menuClickHandler = null;
    }
    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
    }
    if (clickOutsideHandler) {
      document.removeEventListener("click", clickOutsideHandler);
      clickOutsideHandler = null;
    }
  }

  function openTileContextMenu(baseTile) {
    closeTileContextMenu();
    const menu = byId("tileContextMenu");
    if (!menu) return;
    const map = getContextActionAvailability(
      store.pickerState,
      baseTile
    );
    applyContextMenuAvailability(menu, map);
    menu.hidden = false;

    menuClickHandler = (e) => {
      const btn = e.target.closest("[data-context-action]");
      if (!btn) return;
      const actionId = btn.dataset.contextAction;
      if (!actionId) return;
      const ok = pickTileWithAction(baseTile, actionId);
      if (ok) closeTileContextMenu();
    };
    menu.addEventListener("click", menuClickHandler);

    escapeHandler = (e) => {
      if (e.key === "Escape") {
        closeTileContextMenu();
      }
    };
    document.addEventListener("keydown", escapeHandler);

    clickOutsideHandler = (e) => {
      if (menu.contains(e.target)) return;
      closeTileContextMenu();
    };
    setTimeout(() => {
      document.addEventListener("click", clickOutsideHandler);
    }, 0);
  }

  return { openTileContextMenu, closeTileContextMenu };
}
