/**
 * Purpose: Round-setup DOM read/write helpers (discarder, dealer, rules).
 * Description:
 * - Ties win type to discarder field visibility and validation.
 * - Highlights dealer seat in setup table.
 * - Reflects stored score rule into status line and preset select.
 */
import { SCORE_RULE_PRESET_IDS } from "../src/config/scoreRuleConfig.js";

/**
 * Show or hide discarder field for 点和 (dianhe) wins.
 *
 * @param {(id: string) => HTMLElement|null} byId
 * @returns {void}
 */
export function syncDiscarderVisibility(byId) {
  const winType = byId("winType")?.value;
  const winner = byId("winnerSeat")?.value || "";
  const discarder = byId("discarderSeat");
  if (!discarder) return;
  const wrap = discarder.closest(".context-desktop-field");
  const hint = byId("roleValidationError");
  const shouldShow = winType === "dianhe";
  if (wrap) wrap.hidden = !shouldShow;
  discarder.disabled = !shouldShow;
  discarder.required = shouldShow;
  if (shouldShow && !discarder.value) {
    const options = Array.from(discarder.options || []).map((o) => o.value);
    const fallback = options.find((v) => v && v !== winner) || "";
    discarder.value = fallback;
  }
  if (!shouldShow) {
    discarder.value = "";
    if (hint) {
      hint.textContent = "";
      hint.hidden = true;
    }
  }
}

/**
 * Toggle .is-dealer on seat panels for current dealerSeat value.
 *
 * @param {(id: string) => HTMLElement|null} byId
 * @param {(sel: string) => NodeListOf<Element>} [querySelectorAll]
 * @returns {void}
 */
export function syncRoundSetupDealerHighlight(
  byId,
  querySelectorAll = (sel) => document.querySelectorAll(sel)
) {
  const dealer = byId("dealerSeat")?.value || "E";
  querySelectorAll(".round-setup-seat[data-seat]").forEach((el) => {
    el.classList.toggle("is-dealer", el.dataset.seat === dealer);
  });
}

/**
 * Mirror roundState score rule into preset select and status element.
 *
 * @param {object} opts
 * @param {{ scoreRuleStatusEl?: HTMLElement|null }} opts.refs
 * @param {{ roundState?: object }} opts.store
 * @param {(id: string) => HTMLElement|null} opts.byId
 * @returns {void}
 */
export function syncScoreRuleStatus({ refs, store, byId }) {
  const statusEl = refs.scoreRuleStatusEl;
  const presetEl = byId("scoreRulePreset");
  if (presetEl) {
    presetEl.value = store.roundState?.scoreRulePreset
      || SCORE_RULE_PRESET_IDS.MCR_OFFICIAL;
  }
  if (!statusEl) return;
  const meta = store.roundState?.scoreRuleConfig?.meta || {};
  const name = meta.name || store.roundState?.scoreRulePreset || "未知规则";
  const version = meta.version || "n/a";
  statusEl.textContent = `当前规则：${name}（${version}）`;
}
