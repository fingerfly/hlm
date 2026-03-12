import { buildResultViewModel } from "../src/app/resultViewModel.js";

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

/**
 * Render result modal summary and return generated view model.
 *
 * @param {object} result - Raw evaluation payload.
 * @param {object} refs - Result modal node references.
 * @returns {object}
 */
export function renderResultModal(result, refs) {
  const vm = buildResultViewModel(result);
  refs.total.textContent = `${vm.totalFan} 番`;
  refs.status.textContent = vm.winText;
  const preview = vm.matchedFans.slice(0, 3);
  renderFanList(refs.hitPreview, preview);
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
