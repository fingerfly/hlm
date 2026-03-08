import { evaluateCapturedHand } from "../src/app/evaluateCapturedHand.js";
import { getDisplayVersion } from "../src/config/appVersion.js";

const labels = ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"];
const stableFrame = labels.map((label) => ({ label, confidence: 0.97 }));
const noisyFrame = stableFrame.map((tile, index) => (
  index === 2 ? { ...tile, confidence: 0.2 } : index === 10 ? { ...tile, label: "5T", confidence: 0.45 } : tile
));
const demoContext = { winType: "zimo", handState: "menqian", kongType: "none", timingEvent: "gangshang" };

const versionLabel = getDisplayVersion();
const byId = (id) => document.getElementById(id);
byId("versionBadge").textContent = `当前版本: ${versionLabel}`;
const outputEl = document.getElementById("output");
const confirmPanelEl = byId("confirmPanel");
const confirmSlotsEl = byId("confirmSlots");
const confirmSubmitBtn = byId("confirmSubmitBtn");
let pendingRequest = null;
let confirmedTiles = {};

const summarize = (result) => ["胡了么计算结果", "--------------------", `版本: ${versionLabel}`,
  `识别状态: ${result.recognition.status}`, `和牌判定: ${result.scoring.isWin ? "是" : "否"}`,
  `总番数: ${result.scoring.totalFan}`, `解释: ${result.explanation}`, "", "JSON 明细:",
  JSON.stringify(result, null, 2)].join("\n");

function hideConfirmPanel() {
  confirmPanelEl.classList.add("hidden");
  confirmSlotsEl.innerHTML = "";
}

function renderConfirmSlots(recognition) {
  confirmSlotsEl.innerHTML = "";
  for (const index of recognition.missingIndices) {
    const tile = recognition.tiles[index];
    const wrap = document.createElement("div");
    wrap.className = "slot";
    const title = document.createElement("p");
    title.className = "slot-title";
    title.textContent = `牌位 ${index + 1}（当前：${tile.label || "?"}）`;
    wrap.appendChild(title);
    const row = document.createElement("div");
    row.className = "candidate-row";
    const input = document.createElement("input");
    input.placeholder = "手动输入牌码，如 1W";
    input.value = confirmedTiles[index] || "";
    input.addEventListener("input", () => { confirmedTiles[index] = input.value.trim(); });
    for (const candidate of tile.candidates || []) {
      const btn = document.createElement("button");
      btn.className = "candidate-btn";
      btn.textContent = `${candidate.label} (${candidate.score})`;
      btn.addEventListener("click", () => {
        confirmedTiles[index] = candidate.label;
        input.value = candidate.label;
      });
      row.appendChild(btn);
    }
    wrap.appendChild(row);
    wrap.appendChild(input);
    confirmSlotsEl.appendChild(wrap);
  }
}

byId("runDemoBtn").addEventListener("click", () => {
  const result = evaluateCapturedHand({ frames: [stableFrame, stableFrame, stableFrame], context: demoContext });
  hideConfirmPanel();
  outputEl.textContent = summarize(result);
});

byId("runConfirmDemoBtn").addEventListener("click", () => {
  pendingRequest = { frames: [stableFrame, noisyFrame, stableFrame], context: demoContext };
  confirmedTiles = {};
  const result = evaluateCapturedHand(pendingRequest);
  outputEl.textContent = summarize(result);
  if (result.recognition.status === "need_human_confirm") {
    confirmPanelEl.classList.remove("hidden");
    renderConfirmSlots(result.recognition);
  } else hideConfirmPanel();
});

confirmSubmitBtn.addEventListener("click", () => {
  if (!pendingRequest) return;
  const result = evaluateCapturedHand({ ...pendingRequest, confirmedTiles });
  outputEl.textContent = summarize(result);
  if (result.recognition.status === "accepted") hideConfirmPanel();
  else renderConfirmSlots(result.recognition);
});
