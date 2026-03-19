/**
 * Purpose: Show/hide tile context menu and wire clicks.
 * Description:
 * - Applies getContextActionAvailability and applyContextMenuAvailability.
 * - Positions menu; wires option clicks to pickTileWithAction.
 * - Closes on Escape or click-outside.
 */
import { getContextActionAvailability } from
  "../src/app/tilePatternActions.js";
import { applyContextMenuAvailability } from "./contextMenuView.js";
import { computeContextMenuPosition } from "./contextMenuPosition.js";

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

  function positionMenuNearAnchor(menu, event) {
    const anchor = event?.target?.closest?.("button") ?? event?.currentTarget;
    if (!anchor) return false;
    const rect = anchor.getBoundingClientRect();
    const targetRect = {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom
    };
    const menuBox = {
      width: menu.offsetWidth,
      height: menu.offsetHeight
    };
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    const pos = computeContextMenuPosition(targetRect, menuBox, viewport);
    menu.style.bottom = "";
    menu.style.top = `${pos.top}px`;
    menu.style.left = `${pos.left}px`;
    menu.style.transform = "";
    menu.style.visibility = "";
    return true;
  }

  function applyFallbackPosition(menu) {
    menu.style.top = "";
    menu.style.bottom = "100px";
    menu.style.left = "50%";
    menu.style.transform = "translateX(-50%)";
  }

  function openTileContextMenu(baseTile, event) {
    closeTileContextMenu();
    const menu = byId("tileContextMenu");
    if (!menu) return;
    const map = getContextActionAvailability(
      store.pickerState,
      baseTile
    );
    applyContextMenuAvailability(menu, map);
    if (event?.target) {
      menu.style.visibility = "hidden";
      menu.hidden = false;
      if (!positionMenuNearAnchor(menu, event)) {
        applyFallbackPosition(menu);
        menu.style.visibility = "";
      }
    } else {
      menu.hidden = false;
      applyFallbackPosition(menu);
    }

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
