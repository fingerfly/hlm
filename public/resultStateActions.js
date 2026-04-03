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

function setRoleValidationMessage(byId, text) {
  const el = byId("roleValidationError");
  if (!el) return;
  const message = text || "";
  el.textContent = message;
  el.hidden = message.length === 0;
}

/**
 * Validate winner/discarder relationship before scoring settlement.
 *
 * @param {{winType:string,winnerSeat:string,discarderSeat:string}} context
 * @returns {{ok:boolean,message:string}}
 */
export function validateSettlementRoleInputs(context = {}) {
  if (context.winType !== "dianhe") {
    return { ok: true, message: "" };
  }
  const discarderSeat = context.discarderSeat || "";
  if (!discarderSeat) {
    return { ok: false, message: "点和必须选择放铳者。" };
  }
  if (discarderSeat === context.winnerSeat) {
    return { ok: false, message: "放铳者不能与和牌者相同。" };
  }
  return { ok: true, message: "" };
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
    const roleValidation = validateSettlementRoleInputs(request.context);
    if (!roleValidation.ok) {
      setRoleValidationMessage(byId, roleValidation.message);
      return false;
    }
    setRoleValidationMessage(byId, "");
    const result = evaluateCapturedHand(request);
    const settlement = computeRoundSettlement({
      players: store.roundState?.players || [],
      ruleConfig: store.roundState?.scoreRuleConfig || null,
      isWin: result?.scoring?.isWin === true,
      totalFan: result?.scoring?.totalFan || 0,
      winType: request.context.winType,
      winnerSeat: request.context.winnerSeat,
      discarderSeat: request.context.discarderSeat
    });
    result.settlement = settlement;
    result.ruleMeta = store.roundState?.scoreRuleConfig?.meta || null;
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
