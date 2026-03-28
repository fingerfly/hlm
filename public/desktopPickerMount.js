/**
 * Purpose: Relocate the tile picker sheet for desktop inline layout.
 * Description:
 * - At min-width 1024px, moves #pickerModal > .sheet into
 *   #desktopPickerHost.
 * - Restores sheet into #pickerModal below breakpoint for mobile bottom
 *   sheet.
 * - Sets dataset/class on #pickerModal for setModalOpen host visibility
 *   sync.
 */
const DESKTOP_MQ = "(min-width: 1024px)";

/**
 * Whether the desktop workspace breakpoint matches.
 *
 * @returns {boolean}
 */
export function isDesktopWorkspaceLayout() {
  return globalThis.matchMedia?.(DESKTOP_MQ)?.matches === true;
}

/**
 * Move picker sheet between modal root and inline host for current
 * breakpoint.
 *
 * @param {(id: string) => HTMLElement|null} byId - Document id resolver.
 * @returns {void}
 */
export function syncDesktopPickerSheet(byId) {
  const host = byId("desktopPickerHost");
  const pickerModal = byId("pickerModal");
  if (!host || !pickerModal) return;
  const sheet = pickerModal.querySelector(":scope > .sheet");
  if (!sheet) return;
  if (isDesktopWorkspaceLayout()) {
    if (!host.contains(sheet)) host.appendChild(sheet);
    pickerModal.classList.add("desktop-inline-picker");
    pickerModal.dataset.pickerInlineHost = "desktopPickerHost";
    host.dataset.mode = "inline";
    return;
  }
  if (!pickerModal.contains(sheet)) pickerModal.appendChild(sheet);
  pickerModal.classList.remove("desktop-inline-picker");
  delete pickerModal.dataset.pickerInlineHost;
  delete host.dataset.mode;
}

/**
 * Subscribe to breakpoint changes and resync picker DOM + optional callback.
 *
 * @param {(id: string) => HTMLElement|null} byId - Document id resolver.
 * @param {() => void} [onAfterSync] - e.g. modalActions.updateModalUi.
 * @returns {void}
 */
export function installDesktopPickerLayoutListener(byId, onAfterSync) {
  const mq = globalThis.matchMedia(DESKTOP_MQ);
  const handler = () => {
    syncDesktopPickerSheet(byId);
    onAfterSync?.();
  };
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", handler);
  } else {
    mq.addListener(handler);
  }
}
