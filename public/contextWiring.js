/**
 * Purpose: Wire context controls and slot click to picker.
 * Description:
 * - Syncs hidden inputs with segmented controls and steppers.
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
