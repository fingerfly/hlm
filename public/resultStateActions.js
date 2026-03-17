import { setResultPayload, canCalculate } from "../src/app/uiFlowState.js";

function buildRequestFromState(store, byId) {
  return {
    tiles: [...store.uiState.hand.tiles],
    context: {
      winType: byId("winType").value,
      handState: byId("handState").value,
      kongType: byId("kongType").value,
      timingEvent: byId("timingEvent").value
    }
  };
}

/**
 * Create result and evaluation related actions.
 *
 * @param {object} input - Result action dependencies.
 * @returns {{calculate: Function, openInfo: Function}}
 */
export function createResultStateActions(input) {
  const {
    store,
    byId,
    refs,
    evaluateCapturedHand,
    renderResultModal,
    renderInfoTip
  } = input;
  function calculate() {
    if (!canCalculate(store.uiState)) return false;
    const result = evaluateCapturedHand(buildRequestFromState(store, byId));
    store.uiState = setResultPayload(store.uiState, result);
    store.resultVm = renderResultModal(result, refs.resultRefs);
    return true;
  }
  function openInfo() {
    if (!store.resultVm) return false;
    renderInfoTip(store.resultVm, refs.infoRefs);
    return true;
  }
  return { calculate, openInfo };
}
