/**
 * Purpose: Dismiss full-screen modals when the dimmed backdrop is tapped.
 * Description:
 *   - Skips picker/context roots in desktop inline layout (no dimmed layer).
 *   - Closes only when event.target is the modal root (not sheet content).
 *   - Optional document capture listener to close desktop help popover.
 */

/**
 * True when modal uses a dimmed full-screen overlay (mobile sheet pattern).
 *
 * @param {HTMLElement|null} modal - Modal section root.
 * @returns {boolean}
 */
export function modalRootShowsDimmedBackdrop(modal) {
  if (!modal?.classList) return false;
  if (modal.id === "pickerModal" && modal.classList.contains(
    "desktop-inline-picker"
  )) {
    return false;
  }
  if (modal.id === "contextModal" && modal.classList.contains(
    "desktop-inline-context"
  )) {
    return false;
  }
  return true;
}

/**
 * Install click-on-root handlers for each modal entry.
 *
 * @param {{ el: HTMLElement|null, key: string }[]} entries - Modal roots.
 * @param {(key: string) => void} closeModalByKey - Close callback.
 * @returns {void}
 */
export function installModalBackdropDismiss(entries, closeModalByKey) {
  for (const { el, key } of entries) {
    if (!el) continue;
    el.addEventListener("click", (event) => {
      if (event.target !== el) return;
      if (!el.classList.contains("is-open")) return;
      if (!modalRootShowsDimmedBackdrop(el)) return;
      closeModalByKey(key);
    });
  }
}

/**
 * Close help popover when pointer goes outside popover and trigger button.
 *
 * @param {object} input - Wiring deps.
 * @param {() => boolean} input.isPopoverMode - Desktop popover active.
 * @param {() => HTMLElement|null} input.getPopover - Popover root.
 * @param {() => HTMLElement|null} input.getTrigger - Help button.
 * @param {() => boolean} input.isPopoverOpen - Visibility check.
 * @param {() => void} input.onClose - Close handler (sync expanded, hide).
 * @param {Document} [input.doc] - Document (tests).
 * @returns {() => void} Teardown removing the listener.
 */
export function installHelpPopoverOutsidePointerDown(input) {
  const doc = input.doc || globalThis.document;
  const handler = (event) => {
    if (!input.isPopoverMode()) return;
    if (!input.isPopoverOpen()) return;
    const pop = input.getPopover();
    const trig = input.getTrigger();
    const t = event.target;
    if (!pop || !t) return;
    if (pop.contains(t)) return;
    if (trig && trig.contains(t)) return;
    input.onClose();
  };
  doc.addEventListener("pointerdown", handler, true);
  return () => doc.removeEventListener("pointerdown", handler, true);
}
