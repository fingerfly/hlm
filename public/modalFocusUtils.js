/**
 * Purpose: Move keyboard focus into modal sheets after open.
 * Description:
 *   - Finds first focusable in .sheet under modal or inline context host.
 *   - Skips hidden inputs; used after openModalByKey for picker/context.
 */

const FOCUSABLE_SEL = [
  "button:not([disabled])",
  "a[href]",
  'input:not([type="hidden"]):not([disabled])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex=\"-1\"])"
].join(", ");

/**
 * @param {(id: string) => HTMLElement|null} byId
 * @returns {HTMLElement|null}
 */
function getInlineContextSheetRoot(byId) {
  const host = byId("desktopContextHost");
  const sheet = host?.querySelector?.(".context-sheet");
  return sheet instanceof HTMLElement ? sheet : null;
}

/**
 * Focus first tab-stop inside modal content for picker or context keys.
 *
 * @param {string} modalKey - picker | context | help | result
 * @param {(id: string) => HTMLElement|null} byId
 * @param {Record<string, HTMLElement|null>} modalRefs
 * @returns {void}
 */
export function focusFirstInModalSheet(modalKey, byId, modalRefs) {
  if (modalKey === "help" || modalKey === "result") return;
  let root = null;
  if (modalKey === "context") {
    root = getInlineContextSheetRoot(byId) || modalRefs.context?.querySelector(
      ".sheet"
    );
  } else if (modalKey === "picker") {
    root = modalRefs.picker?.querySelector(".sheet")
      || byId("desktopPickerHost")?.querySelector(".sheet");
  }
  if (!root) return;
  const el = root.querySelector(FOCUSABLE_SEL);
  if (el && typeof el.focus === "function") el.focus();
}
