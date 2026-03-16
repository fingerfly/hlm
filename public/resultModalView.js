import { buildResultViewModel } from "../src/app/resultViewModel.js";
import { getTileLabel, getTileUnicode } from "./tileAssets.js";

/**
 * Purpose: Render result and info modal view content.
 * Description:
 * - Converts scoring payload to UI text through result view model.
 * - Renders fan lists with empty-state fallback.
 * - Splits compact preview view and detailed info view rendering.
 */
/**
 * Render one fan list into target ul element.
 *
 * @param {HTMLElement} target - List container.
 * @param {{name: string, fan: number}[]} fans - Fan list.
 * @returns {void}
 */
function renderFanList(target, fans) {
  target.innerHTML = "";
  if (!fans.length) {
    const li = document.createElement("li");
    li.textContent = "无";
    target.appendChild(li);
    return;
  }
  for (const fan of fans) {
    const li = document.createElement("li");
    li.textContent = `${fan.name}（${fan.fan}番）`;
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
 * Render grouped meld rows for result readability.
 *
 * @param {HTMLElement} target - Group rows container.
 * @param {{type: string, tiles: string[]}[]} groups - Grouped hand rows.
 * @returns {void}
 */
function renderMeldRows(target, groups) {
  if (!target) return;
  target.innerHTML = "";
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

/**
 * Render result modal: total, full breakdown, explanation inline.
 *
 * @param {object} result - Raw evaluation payload.
 * @param {object} refs - Result modal node references.
 * @returns {object}
 */
export function renderResultModal(result, refs) {
  const vm = buildResultViewModel(result);
  refs.total.textContent = `${vm.totalFan} 番`;
  refs.status.textContent = vm.winText;
  renderMeldRows(refs.meldRows, vm.meldGroups);
  renderFanList(refs.hitPreview, vm.matchedFans);
  if (refs.explanation) {
    refs.explanation.textContent = vm.explanation || "";
  }
  return vm;
}

/**
 * Render detailed info modal from prebuilt result view model.
 *
 * @param {object} vm - Result view model.
 * @param {object} refs - Info modal node references.
 * @returns {void}
 */
export function renderInfoTip(vm, refs) {
  renderFanList(refs.hitAll, vm.matchedFans);
  renderFanList(refs.excludedAll, vm.excludedFans);
  refs.explanation.textContent = vm.explanation || "无";
}
