import { buildResultViewModel } from "./resultViewModel.js";

function renderFansList(items, emptyText) {
  const list = document.createElement("ul");
  list.className = "fan-list";
  if (!items.length) {
    const li = document.createElement("li");
    li.className = "fan-empty";
    li.textContent = emptyText;
    list.appendChild(li);
    return list;
  }
  for (const fan of items) {
    const li = document.createElement("li");
    li.className = "fan-item";
    li.textContent = `${fan.name}（${fan.fan}番）`;
    list.appendChild(li);
  }
  return list;
}

function makeBlock(titleText, className = "result-block") {
  const block = document.createElement("div");
  block.className = className;
  const title = document.createElement("h3");
  title.textContent = titleText;
  block.appendChild(title);
  return block;
}

export function renderResultInto(container, result, versionLabel) {
  const vm = buildResultViewModel(result);
  container.innerHTML = "";

  const top = document.createElement("div");
  top.className = "result-top";
  const winBadge = document.createElement("span");
  winBadge.className = `badge ${result.scoring.isWin ? "ok" : "bad"}`;
  winBadge.textContent = vm.winText;
  const statusText = document.createElement("span");
  statusText.className = "status";
  statusText.textContent = `输入状态：${vm.statusText}`;
  top.append(winBadge, statusText);

  const summary = document.createElement("div");
  summary.className = "summary-grid";
  summary.innerHTML = [
    `<div><p class="k">总番数</p><p class="v">${vm.totalFan}</p></div>`,
    `<div><p class="k">起和门槛</p><p class="v">${vm.minWinningFan}</p></div>`,
    `<div><p class="k">和型</p><p class="v">${vm.winPatternText}</p></div>`,
    `<div><p class="k">版本</p><p class="v">${versionLabel}</p></div>`
  ].join("");

  const hitWrap = makeBlock("命中番种");
  hitWrap.appendChild(renderFansList(vm.matchedFans, "无"));

  const excludedWrap = document.createElement("details");
  excludedWrap.className = "result-block";
  const excludedTitle = document.createElement("summary");
  excludedTitle.textContent = "排除番种";
  excludedWrap.appendChild(excludedTitle);
  excludedWrap.appendChild(renderFansList(vm.excludedFans, "无"));

  const explain = makeBlock("解释");
  const explainText = document.createElement("p");
  explainText.className = "explain";
  explainText.textContent = vm.explanation;
  explain.appendChild(explainText);

  const debug = document.createElement("details");
  debug.className = "result-block";
  const debugSummary = document.createElement("summary");
  debugSummary.textContent = "调试明细（JSON）";
  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(vm.raw, null, 2);
  debug.append(debugSummary, pre);

  container.append(top, summary, hitWrap, excludedWrap, explain, debug);
}
