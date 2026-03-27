import { openModal, closeModal } from "../src/app/uiFlowState.js";
import { setModalOpen } from "./modalUi.js";

/**
 * Purpose: Provide modal-open/close actions for UI layer.
 * Description:
 * - Updates uiFlowState through immutable transitions.
 * - Syncs modal DOM classes after each state change.
 * - Keeps modal behavior centralized for app wiring.
 */
/**
 * Create modal actions bound to store and modal elements.
 *
 * @param {{uiState: object}} store - Shared app store.
 * @param {object} modalRefs - Modal DOM references.
 * @param {{onBeforeClosePicker?: Function}} [opts] - Optional callbacks.
 * @returns {{updateModalUi: Function, openModalByKey: Function,
 *   closeModalByKey: Function}}
 */
export function createModalActions(store, modalRefs, opts = {}) {
  const { onBeforeClosePicker } = opts;

  const allModalKeys = Object.keys(modalRefs);

  function updateModalUi() {
    setModalOpen(modalRefs.picker, store.uiState.modal.picker);
    setModalOpen(modalRefs.context, store.uiState.modal.context);
    setModalOpen(modalRefs.result, store.uiState.modal.result);
    setModalOpen(modalRefs.help, store.uiState.modal.help);
  }

  function openModalByKey(modalKey) {
    let nextState = { ...store.uiState, modal: { ...store.uiState.modal } };
    for (const key of allModalKeys) nextState = closeModal(nextState, key);
    store.uiState = openModal(nextState, modalKey);
    updateModalUi();
  }

  function closeModalByKey(modalKey) {
    if (modalKey === "picker") onBeforeClosePicker?.();
    store.uiState = closeModal(store.uiState, modalKey);
    updateModalUi();
  }

  return {
    updateModalUi,
    openModalByKey,
    closeModalByKey
  };
}
