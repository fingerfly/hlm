import { evaluateCapturedHand } from "../src/app/evaluateCapturedHand.js";
import { getDisplayVersion } from "../src/config/appVersion.js";

const versionLabel = getDisplayVersion();
const byId = (id) => document.getElementById(id);
byId("versionBadge").textContent = `当前版本: ${versionLabel}`;
const tileGridEl = byId("tileGrid");
const outputEl = byId("output");
const errorsEl = byId("errors");
const tileInputs = [];

const defaultTiles = ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"];
const summarize = (result) => [
  "胡了么计算结果",
  "--------------------",
  `版本: ${versionLabel}`,
  `输入状态: ${result.recognition.status}`,
  `和牌判定: ${result.scoring.isWin ? "是" : "否"}`,
  `总番数: ${result.scoring.totalFan}`,
  `解释: ${result.explanation}`,
  "",
  "JSON 明细:",
  JSON.stringify(result, null, 2)
].join("\n");

function renderTileInputs() {
  tileGridEl.innerHTML = "";
  for (let i = 0; i < 14; i += 1) {
    const wrap = document.createElement("label");
    wrap.className = "tile-cell";
    wrap.textContent = `牌位 ${i + 1}`;
    const input = document.createElement("input");
    input.placeholder = "牌码";
    input.value = defaultTiles[i] || "";
    wrap.appendChild(input);
    tileGridEl.appendChild(wrap);
    tileInputs.push(input);
  }
}

function getRequest() {
  return {
    tiles: tileInputs.map((input) => input.value.trim()),
    context: {
      winType: byId("winType").value,
      handState: byId("handState").value,
      kongType: byId("kongType").value,
      timingEvent: byId("timingEvent").value
    }
  };
}

function renderErrors(result) {
  errorsEl.innerHTML = "";
  const items = [];
  if (result.scoring.errorCode) items.push(`errorCode: ${result.scoring.errorCode}`);
  for (const problem of result.scoring.problems || []) items.push(problem);
  for (const field of result.scoring.missingFields || []) items.push(`missing: ${field}`);
  if (items.length === 0) {
    const ok = document.createElement("li");
    ok.textContent = "无错误";
    errorsEl.appendChild(ok);
    return;
  }
  for (const text of items) {
    const li = document.createElement("li");
    li.textContent = text;
    errorsEl.appendChild(li);
  }
}

byId("calculateBtn").addEventListener("click", () => {
  const result = evaluateCapturedHand(getRequest());
  renderErrors(result);
  outputEl.textContent = summarize(result);
});

byId("resetBtn").addEventListener("click", () => {
  for (let i = 0; i < tileInputs.length; i += 1) {
    tileInputs[i].value = "";
  }
  byId("winType").value = "zimo";
  byId("handState").value = "menqian";
  byId("kongType").value = "none";
  byId("timingEvent").value = "none";
  errorsEl.innerHTML = "";
  outputEl.textContent = "请先输入手牌与上下文，再点击“计算番数”。";
});

renderTileInputs();
