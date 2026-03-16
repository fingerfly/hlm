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
    openContextBtn: byId("openContextBtn"),
    tilePickerGridEl: byId("tilePickerGrid"),
    tilePreviewEl: byId("tilePreview"),
    tileCountEl: byId("tileCount"),
    pickerCountEl: byId("pickerCount"),
    pickerActionHintEl: byId("pickerActionHint"),
    pickerDeleteBtn: byId("pickerDeleteBtn"),
    contextSummaryEl: byId("contextSummary"),
    readyHintEl: byId("readyHint"),
    calculateBtn: byId("calculateBtn"),
    resultRefs: {
      total: byId("resultTotalFan"),
      status: byId("resultStatus"),
      hitPreview: byId("hitPreview")
    },
    infoRefs: {
      hitAll: byId("infoHitList"),
      excludedAll: byId("infoExcludedList"),
      explanation: byId("infoExplanation")
    }
  };
  const modalRefs = {
    picker: byId("pickerModal"),
    context: byId("contextModal"),
    result: byId("resultModal"),
    info: byId("infoModal")
  };
  return { refs, modalRefs };
}
