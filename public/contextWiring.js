/**
 * Purpose: Wire context controls and slot click to picker.
 * Description:
 * - Syncs hidden inputs with segmented controls.
 * - Binds slot click to open picker with that slot selected.
 */

/**
 * Wire segmented radio controls to hidden inputs.
 *
 * @param {(id: string) => HTMLElement|null} byId - Id resolver.
 * @param {object} stateActions - Bound state action handlers.
 * @returns {void}
 */
export function wireContextSegmentedControls(byId, stateActions) {
  const pairs = [
    ["winType", "winType"],
    ["handState", "handState"],
    ["kongType", "kongType"],
    ["timingEvent", "timingEvent"]
  ];
  for (const [hiddenId, radioName] of pairs) {
    const hidden = byId(hiddenId);
    if (!hidden) continue;
    const selector = `input[name="${radioName}"]`;
    for (const radio of document.querySelectorAll(selector)) {
      radio.addEventListener("change", () => {
        hidden.value = radio.value;
        stateActions.syncHomeState();
      });
    }
  }
  for (const id of ["winType", "handState", "kongType", "timingEvent"]) {
    const el = byId(id);
    if (el) el.addEventListener("change", stateActions.syncHomeState);
  }
}

/**
 * Wire slot click to select slot and open picker modal.
 *
 * @param {object} params - DOM and action dependencies.
 * @returns {void}
 */
export function wireSlotClickToPicker(params) {
  const { byId, stateActions, modalActions, renderPicker } = params;
  const tilePreview = byId("tilePreview");
  if (!tilePreview) return;
  tilePreview.addEventListener("click", (event) => {
    const target = event.target.closest("[data-slot-index]");
    if (!target) return;
    const index = Number.parseInt(target.dataset.slotIndex || "", 10);
    if (!Number.isInteger(index)) return;
    stateActions.selectSlot(index);
    renderPicker();
    modalActions.openModalByKey("picker");
  });
}
