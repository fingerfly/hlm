import { buildResultViewModel } from "../src/app/resultViewModel.js";
import { getTileLabel, getTileUnicode } from "./tileAssets.js";

/**
 * Purpose: Render result modal view content.
 * Description:
 * - Converts scoring payload to UI text through result view model.
 * - Renders fan lists with empty-state fallback and row-level ℹ️ details.
 */

/**
 * Render one fan list into target ul element.
 *
 * @param {HTMLElement} target - List container.
 * @param {{name: string, fan: number, id?: string,
 *   detailText?: string}[]} fans - Fan list.
 * @param {{expandable?: boolean}} [options] - Render options.
 * @returns {void}
 */
function renderFanList(target, fans, options = {}) {
  const { expandable = false } = options;
  target.replaceChildren();
  if (!fans.length) {
    const li = document.createElement("li");
    li.textContent = "无";
    target.appendChild(li);
    return;
  }
  for (let i = 0; i < fans.length; i += 1) {
    const fan = fans[i];
    const li = document.createElement("li");
    li.className = "fan-row";
    const row = document.createElement("div");
    row.className = "fan-row-main";
    const label = document.createElement("span");
    label.className = "fan-row-label";
    label.textContent = `${fan.name}（${fan.fan}番）`;
    row.appendChild(label);
    if (expandable && fan.detailText) {
      const infoId = `fan-detail-${i}-${fan.id || "x"}`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "fan-info-btn";
      btn.textContent = "释义";
      btn.setAttribute(
        "aria-label",
        `${fan.name}番种释义`
      );
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", infoId);
      const detail = document.createElement("div");
      detail.id = infoId;
      detail.className = "fan-detail-panel";
      detail.hidden = true;
      detail.textContent = fan.detailText;
      btn.addEventListener("click", () => {
        const open = detail.hidden;
        detail.hidden = !open;
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      row.appendChild(btn);
      li.appendChild(row);
      li.appendChild(detail);
    } else {
      li.appendChild(row);
    }
    target.appendChild(li);
  }
}

function groupTypeLabel(type) {
  const labels = {
    chow: "顺子",
    pung: "刻子",
    pair: "对子",
    orphans: "十三幺"
  };
  return labels[type] || "牌组";
}

function tileDisplay(tile) {
  const u = getTileUnicode(tile);
  return u || getTileLabel(tile);
}

/**
 * One-line summary for 总番 vs 起和番 (when gate excludes e.g. 花牌).
 *
 * @param {number} totalFan
 * @param {number} gateFan
 * @returns {string}
 */
export function formatResultFanSummary(totalFan, gateFan) {
  const t = Math.max(0, Number(totalFan) || 0);
  const g = Math.max(0, Number(gateFan) || 0);
  if (g === t) return `${t} 番`;
  return `${t} 番（起和 ${g} 番）`;
}

/**
 * Render grouped meld rows for result readability.
 *
 * @param {HTMLElement} target - Group rows container.
 * @param {{type: string, tiles: string[]}[]} groups - Grouped hand rows.
 * @returns {void}
 */
function renderMeldRows(target, groups) {
  if (!target) return;
  target.replaceChildren();
  if (!Array.isArray(groups) || groups.length === 0) {
    target.textContent = "无";
    return;
  }
  for (const group of groups) {
    const row = document.createElement("div");
    row.className = "meld-row";
    const type = document.createElement("span");
    type.className = "meld-type";
    type.textContent = `${groupTypeLabel(group.type)}：`;
    const tiles = document.createElement("span");
    tiles.className = "meld-tiles";
    tiles.textContent = group.tiles.map(tileDisplay).join(" ");
    row.appendChild(type);
    row.appendChild(tiles);
    target.appendChild(row);
  }
}

function renderSettlementRows(target, settlement) {
  if (!target) return;
  target.replaceChildren();
  if (
    !settlement ||
    !Array.isArray(settlement.rows) ||
    !settlement.rows.length
  ) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.className = "settlement-empty";
    td.textContent = "无";
    tr.appendChild(td);
    target.appendChild(tr);
    return;
  }
  for (const rowData of settlement.rows) {
    const tr = document.createElement("tr");
    const name = document.createElement("td");
    name.className = "settlement-name";
    name.textContent = `${rowData.name}（${rowData.seat}）`;
    const before = document.createElement("td");
    before.className = "settlement-score";
    before.textContent = String(rowData.scoreBefore);
    const delta = document.createElement("td");
    delta.className = "settlement-score";
    delta.textContent = rowData.delta > 0
      ? `+${rowData.delta}`
      : String(rowData.delta);
    const after = document.createElement("td");
    after.className = "settlement-score";
    after.textContent = String(rowData.scoreAfter);
    tr.appendChild(name);
    tr.appendChild(before);
    tr.appendChild(delta);
    tr.appendChild(after);
    target.appendChild(tr);
  }
}

/**
 * Render result modal: total, full breakdown, explanation inline.
 *
 * @param {object} result - Raw evaluation payload.
 * @param {object} refs - Result modal node references.
 * @returns {object}
 */
export function renderResultModal(result, refs) {
  const vm = buildResultViewModel(result);
  refs.total.textContent = formatResultFanSummary(
    vm.totalFan,
    vm.gateFan
  );
  refs.status.textContent = vm.winText;
  if (refs.ruleMeta) refs.ruleMeta.textContent = vm.ruleMetaText || "";
  renderMeldRows(refs.meldRows, vm.meldGroups);
  renderFanList(refs.hitPreview, vm.matchedFans, { expandable: true });
  renderSettlementRows(refs.settlementRows, vm.settlement);
  if (refs.explanation) {
    const settlementError = vm.settlementErrorText || "";
    if (settlementError) {
      refs.status.textContent = `${vm.winText}（结算未完成）`;
      refs.explanation.textContent = settlementError + (vm.explanation
        ? `；${vm.explanation}`
        : "");
    } else {
      refs.explanation.textContent = vm.explanation || "";
    }
  }
  return vm;
}
