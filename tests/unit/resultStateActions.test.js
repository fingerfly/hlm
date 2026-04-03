import test from "node:test";
import assert from "node:assert/strict";
import {
  createResultStateActions,
  validateSettlementRoleInputs
} from "../../public/resultStateActions.js";

function createHarness({
  winType = "zimo",
  winnerSeat = "E",
  discarderSeat = "",
  isWin = true,
  totalFan = 2
} = {}) {
  const controls = {
    winType: { value: winType },
    handState: { value: "menqian" },
    winnerSeat: { value: winnerSeat },
    discarderSeat: { value: discarderSeat },
    timingEvent: { value: "none" },
    flowerCount: { value: "0" },
    kongAnCount: { value: "0" },
    kongMingCount: { value: "0" },
    roleValidationError: { textContent: "", hidden: true }
  };
  const byId = (id) => controls[id];
  const store = {
    uiState: {
      hand: { tiles: new Array(14).fill("1W") },
      modal: { result: false }
    },
    roundState: {
      players: [
        { seat: "E", name: "东", score: 0 },
        { seat: "S", name: "南", score: 0 },
        { seat: "W", name: "西", score: 0 },
        { seat: "N", name: "北", score: 0 }
      ]
    },
    resultVm: null
  };
  let evaluateCalls = 0;
  const actions = createResultStateActions({
    store,
    byId,
    refs: { resultRefs: {} },
    evaluateCapturedHand: () => {
      evaluateCalls += 1;
      return { scoring: { isWin, totalFan } };
    },
    renderResultModal: () => ({})
  });
  return { actions, controls, getEvaluateCalls: () => evaluateCalls };
}

test("validateSettlementRoleInputs requires discarder for dianhe", () => {
  const invalid = validateSettlementRoleInputs({
    winType: "dianhe",
    winnerSeat: "E",
    discarderSeat: ""
  });
  assert.equal(invalid.ok, false);
  assert.match(invalid.message, /必须选择放铳者/);
});

test("calculate blocks dianhe when discarder is missing", () => {
  const { actions, controls, getEvaluateCalls } = createHarness({
    winType: "dianhe",
    discarderSeat: ""
  });
  assert.equal(actions.calculate(), false);
  assert.equal(getEvaluateCalls(), 0);
  assert.equal(controls.roleValidationError.hidden, false);
  assert.match(controls.roleValidationError.textContent, /必须选择放铳者/);
});

test("calculate blocks dianhe when discarder equals winner", () => {
  const { actions, controls, getEvaluateCalls } = createHarness({
    winType: "dianhe",
    winnerSeat: "E",
    discarderSeat: "E"
  });
  assert.equal(actions.calculate(), false);
  assert.equal(getEvaluateCalls(), 0);
  assert.match(controls.roleValidationError.textContent, /不能与和牌者相同/);
});

test("calculate proceeds when dianhe discarder is valid", () => {
  const { actions, controls, getEvaluateCalls } = createHarness({
    winType: "dianhe",
    winnerSeat: "E",
    discarderSeat: "S"
  });
  assert.equal(actions.calculate(), true);
  assert.equal(getEvaluateCalls(), 1);
  assert.equal(controls.roleValidationError.hidden, true);
  assert.equal(controls.roleValidationError.textContent, "");
});

test("calculate ignores empty discarder for zimo", () => {
  const { actions, controls, getEvaluateCalls } = createHarness({
    winType: "zimo",
    discarderSeat: ""
  });
  assert.equal(actions.calculate(), true);
  assert.equal(getEvaluateCalls(), 1);
  assert.equal(controls.roleValidationError.hidden, true);
});
