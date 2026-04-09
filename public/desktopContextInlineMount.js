/**
 * Purpose: Mount context modal sheet inline on desktop workspace.
 * Description:
 * - At min-width 1024px, moves #contextModal .context-sheet into
 *   #desktopContextHost and marks modal for layout CSS.
 */

const DESKTOP_MQ = "(min-width: 1024px)";

/**
 * Relocate context sheet for desktop inline layout when breakpoint matches.
 *
 * @param {(id: string) => HTMLElement|null} byId
 * @returns {void}
 */
export function mountDesktopContextInline(byId) {
  const isDesktop = globalThis.matchMedia?.(DESKTOP_MQ)?.matches;
  if (!isDesktop) return;
  const host = byId("desktopContextHost");
  const contextModal = byId("contextModal");
  const contextSheet = contextModal?.querySelector(".context-sheet");
  if (!host || !contextModal || !contextSheet) return;
  if (!host.contains(contextSheet)) host.appendChild(contextSheet);
  contextModal.classList.add("desktop-inline-context");
  host.dataset.mode = "inline";
}
