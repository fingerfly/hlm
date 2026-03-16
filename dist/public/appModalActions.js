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
 * @returns {{updateModalUi: Function, openModalByKey: Function,
 *   closeModalByKey: Function}}
 */
export function createModalActions(store, modalRefs) {
  function updateModalUi() {
    setModalOpen(modalRefs.picker, store.uiState.modal.picker);
    setModalOpen(modalRefs.context, store.uiState.modal.context);
    setModalOpen(modalRefs.result, store.uiState.modal.result);
    setModalOpen(modalRefs.info, store.uiState.modal.info);
  }

  function openModalByKey(modalKey) {
    store.uiState = openModal(store.uiState, modalKey);
    updateModalUi();
  }

  function closeModalByKey(modalKey) {
    store.uiState = closeModal(store.uiState, modalKey);
    updateModalUi();
  }

  return {
    updateModalUi,
    openModalByKey,
    closeModalByKey
  };
}
