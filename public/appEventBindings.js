/**
 * Purpose: Provide reusable app event binding helpers.
 * Description:
 * - Creates safe id-based click binder.
 * - Wires repetitive button groups for mode/pattern/modal actions.
 */

/**
 * Create click binder guarded by id lookup.
 *
 * @param {(id: string) => HTMLElement|null} byId - Id resolver.
 * @returns {(id: string, onClick: Function) => void}
 */
export function createBindClick(byId) {
  return (id, onClick) => {
    const element = byId(id);
    if (!element) return;
    element.addEventListener("click", onClick);
  };
}

/**
 * Bind modal close buttons for all supported modal keys.
 *
 * @param {(selector: string, onClick: Function) => void} bindCloseButtons
 * @param {{closeModalByKey: Function}} modalActions
 * @returns {void}
 */
export function bindModalCloseButtons(bindCloseButtons, modalActions) {
  const closeMap = ["picker", "context", "result", "info"];
  for (const modalKey of closeMap) {
    bindCloseButtons(`[data-close='${modalKey}']`, () => {
      modalActions.closeModalByKey(modalKey);
    });
  }
}

/**
 * Bind pattern action buttons to state setter.
 *
 * @param {{setPatternAction: Function}} stateActions - Action handlers.
 * @returns {void}
 */
export function bindPatternActionButtons(stateActions) {
  for (const button of document.querySelectorAll("[data-pattern-action]")) {
    button.addEventListener("click", () => {
      stateActions.setPatternAction(button.dataset.patternAction);
    });
  }
}

/**
 * Bind picker mode buttons and force picker re-render.
 *
 * @param {{setPickerMode: Function}} stateActions - Action handlers.
 * @param {() => void} renderPicker - Picker render callback.
 * @returns {void}
 */
export function bindPickerModeButtons(stateActions, renderPicker) {
  for (const button of document.querySelectorAll("[data-picker-mode]")) {
    button.addEventListener("click", () => {
      stateActions.setPickerMode(button.dataset.pickerMode);
      renderPicker();
    });
  }
}

/**
 * Whether a context menu button should open picker modal.
 * Parent items (data-menu-level="parent") only expand submenu.
 *
 * @param {HTMLElement} btn - Button with data-context-action.
 * @returns {boolean}
 */
export function shouldOpenPickerForContextButton(btn) {
  if (!btn || !btn.dataset) return false;
  return btn.dataset.menuLevel !== "parent";
}
