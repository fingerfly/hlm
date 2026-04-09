/**
 * Purpose: Wizard step-3 ready-hint when calculate fails or hand incomplete.
 * Description:
 * - Leaves visible role validation copy untouched.
 * - Nudges tile count or generic calculate checklist otherwise.
 */

/**
 * Update #readyHint after a failed wizard calculate attempt.
 *
 * @param {{ uiState: { hand?: { tiles?: unknown[] } } }} store
 * @param {(id: string) => HTMLElement|null} byId
 * @returns {void}
 */
export function applyStep3CalculateFailureHint(store, byId) {
  const roleErr = byId("roleValidationError");
  if (
    roleErr
    && !roleErr.hidden
    && String(roleErr.textContent || "").trim().length > 0
  ) {
    return;
  }
  const hint = byId("readyHint");
  if (!hint) return;
  const tiles = store.uiState.hand?.tiles;
  if (!Array.isArray(tiles) || tiles.length !== 14) {
    hint.textContent = "请先选满 14 张手牌后再计算。";
    return;
  }
  hint.textContent =
    "无法计算：请检查和牌条件与结算角色（点和须选放铳者）。";
}
