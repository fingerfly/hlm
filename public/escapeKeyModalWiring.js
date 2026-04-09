/**
 * Purpose: Escape key closes stacked modals (picker, context, result).
 * Description:
 * - Skips closing floating context when sheet is desktop-inline mounted.
 */

/**
 * Register document keydown handler for Escape-to-close behavior.
 *
 * @param {Pick<Document, "addEventListener">} doc
 * @param {object} ctx
 * @param {(id: string) => HTMLElement|null} ctx.byId
 * @param {{ uiState: { modal: object } }} ctx.store
 * @param {{ closeModalByKey: (k: string) => void }} ctx.modalActions
 * @returns {void}
 */
export function installEscapeClosesModals(
  doc,
  { byId, store, modalActions }
) {
  doc.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const m = store.uiState.modal;
    const ctxModal = byId("contextModal");
    const ctxInline = ctxModal?.classList?.contains(
      "desktop-inline-context"
    );
    if (m.picker) {
      event.preventDefault();
      modalActions.closeModalByKey("picker");
      return;
    }
    if (m.context && !ctxInline) {
      event.preventDefault();
      modalActions.closeModalByKey("context");
      return;
    }
    if (m.result) {
      event.preventDefault();
      modalActions.closeModalByKey("result");
      return;
    }
  });
}
