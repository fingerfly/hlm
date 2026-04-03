import { setResultPayload, canCalculate } from "../src/app/uiFlowState.js";
import { computeRoundSettlement } from "../src/app/roundSettlement.js";

function parseBoundedInt(el, fallback) {
  if (!el) return fallback;
  const n = Number.parseInt(String(el.value), 10);
  if (!Number.isInteger(n) || n < 0) return fallback;
  return n;
}

function buildRequestFromState(store, byId) {
  const flowerEl = byId("flowerCount");
  const kongAnEl = byId("kongAnCount");
  const kongMingEl = byId("kongMingCount");
  const flowerCount = parseBoundedInt(flowerEl, 0);
  const kongAn = parseBoundedInt(kongAnEl, 0);
  const kongMing = parseBoundedInt(kongMingEl, 0);
  return {
    tiles: [...store.uiState.hand.tiles],
    context: {
      winType: byId("winType").value,
      handState: byId("handState").value,
      winnerSeat: byId("winnerSeat").value,
      discarderSeat: byId("discarderSeat").value,
      kongType: "none",
      timingEvent: byId("timingEvent").value,
      flowerCount,
      kongSummary: { an: kongAn, ming: kongMing }
    }
  };
}

/**
 * Create result and evaluation related actions.
 *
 * @param {object} input - Result action dependencies.
 * @returns {{calculate: Function}}
 */
export function createResultStateActions(input) {
  const {
    store,
    byId,
    refs,
    evaluateCapturedHand,
    renderResultModal
  } = input;
  function calculate() {
    if (!canCalculate(store.uiState)) return false;
    const request = buildRequestFromState(store, byId);
    const result = evaluateCapturedHand(request);
    const settlement = computeRoundSettlement({
      players: store.roundState?.players || [],
      isWin: result?.scoring?.isWin === true,
      totalFan: result?.scoring?.totalFan || 0,
      winType: request.context.winType,
      winnerSeat: request.context.winnerSeat,
      discarderSeat: request.context.discarderSeat
    });
    result.settlement = settlement;
    if (settlement.ok && Array.isArray(settlement.nextPlayers)) {
      store.roundState = {
        ...(store.roundState || {}),
        players: settlement.nextPlayers
      };
    }
    store.uiState = setResultPayload(store.uiState, result);
    store.resultVm = renderResultModal(result, refs.resultRefs);
    return true;
  }
  return { calculate };
}
