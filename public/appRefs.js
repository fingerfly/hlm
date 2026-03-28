/**
 * Purpose: Collect and group app DOM references.
 * Description:
 * - Binds frequently used home-screen DOM nodes.
 * - Binds modal root elements for modal control.
 * - Returns stable reference groups for wiring modules.
 */
/**
 * Build app and modal reference groups from id resolver.
 *
 * @param {(id: string) => HTMLElement|null} byId - Id lookup helper.
 * @returns {{refs: object, modalRefs: object}}
 */
export function createAppRefs(byId) {
  const refs = {
    openPickerBtn: byId("openPickerBtn"),
    clearHandBtn: byId("clearHandBtn"),
    tilePickerGridEl: byId("tilePickerGrid"),
    tilePreviewEl: byId("tilePreview"),
    tileCountEl: byId("tileCount"),
    pickerCountEl: byId("pickerCount"),
    pickerDeleteBtn: byId("pickerDeleteBtn"),
    contextSummaryEl: byId("contextSummary"),
    wizardStepHintEl: byId("wizardStepHint"),
    wizardBackBtn: byId("wizardBackBtn"),
    wizardNextBtn: byId("wizardNextBtn"),
    desktopSidePanelEl: byId("desktopSidePanel"),
    readyHintEl: byId("readyHint"),
    resultRefs: {
      total: byId("resultTotalFan"),
      status: byId("resultStatus"),
      meldRows: byId("resultMeldRows"),
      hitPreview: byId("hitPreview"),
      explanation: byId("resultExplanation")
    }
  };
  const modalRefs = {
    picker: byId("pickerModal"),
    context: byId("contextModal"),
    result: byId("resultModal"),
    help: byId("helpModal")
  };
  return { refs, modalRefs };
}
