/**
 * Purpose: Small DOM helpers for modal open/close behavior.
 * Description:
 * - Toggles modal visibility class from state flag.
 * - Binds close buttons using shared selector callback.
 */
/**
 * Toggle modal open class on one element.
 * When #pickerModal has desktop-inline-picker, syncs
 * #desktopPickerHost.hidden.
 *
 * @param {HTMLElement|null} element - Modal root node.
 * @param {boolean} open - True when modal should be visible.
 * @returns {void}
 */
export function setModalOpen(element, open) {
  if (!element) return;
  element.classList.toggle("is-open", open);
  if (
    element.id === "pickerModal" &&
    element.classList.contains("desktop-inline-picker") &&
    element.dataset.pickerInlineHost
  ) {
    const host = document.getElementById(element.dataset.pickerInlineHost);
    if (host) host.hidden = !open;
  }
}

/**
 * Attach one close callback to all matched buttons.
 *
 * @param {string} selector - Query selector for close buttons.
 * @param {() => void} onClose - Click handler.
 * @returns {void}
 */
export function bindCloseButtons(selector, onClose) {
  for (const button of document.querySelectorAll(selector)) {
    button.addEventListener("click", onClose);
  }
}
