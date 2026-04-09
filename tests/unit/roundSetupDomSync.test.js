/**
 * Purpose: Unit tests for round-setup DOM sync helpers from app bootstrap.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { SCORE_RULE_PRESET_IDS } from "../../src/config/scoreRuleConfig.js";
import {
  syncDiscarderVisibility,
  syncRoundSetupDealerHighlight,
  syncScoreRuleStatus
} from "../../public/roundSetupDomSync.js";

test("syncDiscarderVisibility shows discarder for dianhe only", () => {
  const discarder = {
    value: "",
    disabled: false,
    required: false,
    options: [{ value: "" }, { value: "E" }, { value: "S" }],
    closest: () => ({ hidden: false })
  };
  const wrap = { hidden: false };
  discarder.closest = () => wrap;
  const hint = { textContent: "x", hidden: false };
  const byId = (id) => {
    if (id === "winType") return { value: "dianhe" };
    if (id === "winnerSeat") return { value: "E" };
    if (id === "discarderSeat") return discarder;
    if (id === "roleValidationError") return hint;
    return null;
  };
  syncDiscarderVisibility(byId);
  assert.equal(wrap.hidden, false);
  assert.equal(discarder.disabled, false);
  assert.equal(discarder.required, true);
  assert.ok(discarder.value === "S" || discarder.value === "E");

  const byIdZimo = (id) => {
    if (id === "winType") return { value: "zimo" };
    if (id === "winnerSeat") return { value: "E" };
    if (id === "discarderSeat") return discarder;
    if (id === "roleValidationError") return hint;
    return null;
  };
  discarder.value = "S";
  syncDiscarderVisibility(byIdZimo);
  assert.equal(wrap.hidden, true);
  assert.equal(discarder.value, "");
  assert.equal(hint.textContent, "");
  assert.equal(hint.hidden, true);
});

test("syncRoundSetupDealerHighlight toggles is-dealer by data-seat", () => {
  const seats = [
    { dataset: { seat: "E" }, classList: { toggle: () => {} } },
    { dataset: { seat: "S" }, classList: { toggle: () => {} } }
  ];
  const toggled = [];
  seats.forEach((el, idx) => {
    el.classList.toggle = (cls, on) => {
      toggled.push({ idx, cls, on });
    };
  });
  const byId = () => ({ value: "S" });
  const qsa = () => seats;
  syncRoundSetupDealerHighlight(byId, qsa);
  assert.ok(
    toggled.some((t) => t.cls === "is-dealer" && t.on === false && t.idx === 0)
  );
  assert.ok(
    toggled.some((t) => t.cls === "is-dealer" && t.on === true && t.idx === 1)
  );
});

test("syncScoreRuleStatus writes preset select and status text", () => {
  const presetEl = { value: "" };
  const statusEl = { textContent: "" };
  const byId = (id) => (id === "scoreRulePreset" ? presetEl : null);
  const refs = { scoreRuleStatusEl: statusEl };
  const store = {
    roundState: {
      scoreRulePreset: SCORE_RULE_PRESET_IDS.MCR_OFFICIAL,
      scoreRuleConfig: { meta: { name: "MCR", version: "v1" } }
    }
  };
  syncScoreRuleStatus({ refs, store, byId });
  assert.equal(presetEl.value, SCORE_RULE_PRESET_IDS.MCR_OFFICIAL);
  assert.match(statusEl.textContent, /MCR/);
  assert.match(statusEl.textContent, /v1/);
});
