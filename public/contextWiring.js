/**
 * Purpose: Wire context controls and slot click to picker.
 * Description:
 * - Syncs hidden inputs with segmented controls, steppers, desktop mirrors.
 * - Binds slot click to open picker with that slot selected.
 */

/**
 * Refresh stepper label text from hidden numeric inputs.
 *
 * @param {(id: string) => HTMLElement|null} byId - Id resolver.
 * @returns {void}
 */
export function syncContextStepperDisplays(byId) {
  const pairs = [
    ["flowerCount", "flowerCountLabel"],
    ["kongAnCount", "kongAnLabel"],
    ["kongMingCount", "kongMingLabel"]
  ];
  for (const [hiddenId, labelId] of pairs) {
    const h = byId(hiddenId);
    const lab = byId(labelId);
    if (h && lab) lab.textContent = h.value;
  }
}

function parseStepperInt(byId, id, fallback = 0) {
  const el = byId(id);
  if (!el) return fallback;
  const n = Number.parseInt(String(el.value), 10);
  return Number.isInteger(n) ? n : fallback;
}

function setStepperValue(byId, hiddenId, labelId, value) {
  const h = byId(hiddenId);
  const lab = byId(labelId);
  if (h) h.value = String(value);
  if (lab) lab.textContent = String(value);
}

function clampInt(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Push hidden timing / flower / kong values into desktop select and inputs.
 * Normalizes kong pair so an + ming ≤ 4 (updates hidden + label if needed).
 *
 * @param {(id: string) => HTMLElement|null} byId - Id resolver.
 * @returns {void}
 */
export function syncContextDesktopMirrors(byId) {
  const te = byId("timingEvent");
  const sel = byId("timingEventSelect");
  if (te && sel && "value" in sel) {
    sel.value = te.value || "none";
  }

  const fc = byId("flowerCount");
  const fci = byId("flowerCountInput");
  if (fc && fci && "value" in fci) {
    const n = clampInt(parseStepperInt(byId, "flowerCount", 0), 0, 8);
    fc.value = String(n);
    fci.value = String(n);
    const flab = byId("flowerCountLabel");
    if (flab) flab.textContent = String(n);
  }

  let an = clampInt(parseStepperInt(byId, "kongAnCount", 0), 0, 4);
  let ming = clampInt(parseStepperInt(byId, "kongMingCount", 0), 0, 4);
  if (an + ming > 4) {
    ming = 4 - an;
    setStepperValue(byId, "kongMingCount", "kongMingLabel", ming);
  }
  const kai = byId("kongAnCountInput");
  const kmi = byId("kongMingCountInput");
  if (kai && "value" in kai) kai.value = String(an);
  if (kmi && "value" in kmi) kmi.value = String(ming);
}

function syncTimingRadiosToValue(value) {
  for (const r of document.querySelectorAll('input[name="timingEvent"]')) {
    if ("checked" in r) r.checked = r.value === value;
  }
}

function wireFlowerDesktopNumber(byId, stateActions) {
  const flowerIn = byId("flowerCountInput");
  if (!flowerIn || !("value" in flowerIn)) return;
  flowerIn.addEventListener("change", () => {
    let v = Number.parseInt(String(flowerIn.value), 10);
    if (!Number.isInteger(v)) v = 0;
    v = clampInt(v, 0, 8);
    setStepperValue(byId, "flowerCount", "flowerCountLabel", v);
    flowerIn.value = String(v);
    stateActions.syncHomeState();
  });
}

function wireKongDesktopNumber(byId, stateActions, inputId, changedAn) {
  const el = byId(inputId);
  if (!el || !("value" in el)) return;
  el.addEventListener("change", () => {
    let v = Number.parseInt(String(el.value), 10);
    if (!Number.isInteger(v)) v = 0;
    v = clampInt(v, 0, 4);
    let an = parseStepperInt(byId, "kongAnCount", 0);
    let ming = parseStepperInt(byId, "kongMingCount", 0);
    if (changedAn) {
      an = v;
      ming = Math.min(ming, 4 - an);
    } else {
      ming = v;
      an = Math.min(an, 4 - ming);
    }
    setStepperValue(byId, "kongAnCount", "kongAnLabel", an);
    setStepperValue(byId, "kongMingCount", "kongMingLabel", ming);
    syncContextDesktopMirrors(byId);
    stateActions.syncHomeState();
  });
}

/**
 * Wire desktop select and number inputs to hidden fields and mobile UI.
 *
 * @param {(id: string) => HTMLElement|null} byId - Id resolver.
 * @param {{syncHomeState: Function}} stateActions - Home sync.
 * @returns {void}
 */
export function wireDesktopContextControls(byId, stateActions) {
  const sel = byId("timingEventSelect");
  if (sel && "value" in sel) {
    sel.addEventListener("change", () => {
      const hidden = byId("timingEvent");
      if (hidden) hidden.value = sel.value;
      syncTimingRadiosToValue(sel.value);
      stateActions.syncHomeState();
    });
  }
  wireFlowerDesktopNumber(byId, stateActions);
  wireKongDesktopNumber(byId, stateActions, "kongAnCountInput", true);
  wireKongDesktopNumber(byId, stateActions, "kongMingCountInput", false);
}

/**
 * Wire numeric steppers for flower and kong summary fields.
 *
 * @param {(id: string) => HTMLElement|null} byId - Id resolver.
 * @param {{syncHomeState: Function}} stateActions - Home sync.
 * @returns {void}
 */
export function wireContextSteppers(byId, stateActions) {
  const bind = (decId, incId, hiddenId, labelId, opts) => {
    const { min, max, getMax } = opts;
    const apply = (delta) => {
      let v = parseStepperInt(byId, hiddenId, min);
      v += delta;
      const cap = typeof getMax === "function" ? getMax() : max;
      v = Math.max(min, Math.min(cap, v));
      setStepperValue(byId, hiddenId, labelId, v);
      syncContextDesktopMirrors(byId);
      stateActions.syncHomeState();
    };
    const dec = byId(decId);
    const inc = byId(incId);
    if (dec) dec.addEventListener("click", () => apply(-1));
    if (inc) inc.addEventListener("click", () => apply(1));
  };

  bind("flowerDec", "flowerInc", "flowerCount", "flowerCountLabel", {
    min: 0,
    max: 8
  });

  const maxMingForAn = () => {
    const an = parseStepperInt(byId, "kongAnCount", 0);
    return Math.min(4, 4 - an);
  };
  const maxAnForMing = () => {
    const ming = parseStepperInt(byId, "kongMingCount", 0);
    return Math.min(4, 4 - ming);
  };

  bind("kongAnDec", "kongAnInc", "kongAnCount", "kongAnLabel", {
    min: 0,
    getMax: maxAnForMing
  });
  bind("kongMingDec", "kongMingInc", "kongMingCount", "kongMingLabel", {
    min: 0,
    getMax: maxMingForAn
  });
}

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
    ["timingEvent", "timingEvent"]
  ];
  for (const [hiddenId, radioName] of pairs) {
    const hidden = byId(hiddenId);
    if (!hidden) continue;
    const selector = `input[name="${radioName}"]`;
    for (const radio of document.querySelectorAll(selector)) {
      radio.addEventListener("change", () => {
        hidden.value = radio.value;
        syncContextDesktopMirrors(byId);
        stateActions.syncHomeState();
      });
    }
  }
  for (const id of ["winType", "handState", "timingEvent"]) {
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
