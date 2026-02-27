import { evaluateCapturedHand } from "../src/app/evaluateCapturedHand.js";
import { getDisplayVersion } from "../src/config/appVersion.js";

const stableFrame = [
  { label: "1W", confidence: 0.97 },
  { label: "1W", confidence: 0.97 },
  { label: "1W", confidence: 0.97 },
  { label: "2W", confidence: 0.97 },
  { label: "3W", confidence: 0.97 },
  { label: "4W", confidence: 0.97 },
  { label: "5W", confidence: 0.97 },
  { label: "6W", confidence: 0.97 },
  { label: "7W", confidence: 0.97 },
  { label: "2T", confidence: 0.97 },
  { label: "3T", confidence: 0.97 },
  { label: "4T", confidence: 0.97 },
  { label: "9B", confidence: 0.97 },
  { label: "9B", confidence: 0.97 }
];

const versionLabel = getDisplayVersion();
document.getElementById("versionBadge").textContent = `当前版本: ${versionLabel}`;

document.getElementById("runDemoBtn").addEventListener("click", () => {
  const result = evaluateCapturedHand({
    frames: [stableFrame, stableFrame, stableFrame],
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "gangshang"
    }
  });
  const summaryLines = [
    "胡了么计算结果",
    "--------------------",
    `版本: ${versionLabel}`,
    `和牌判定: ${result.scoring.isWin ? "是" : "否"}`,
    `总番数: ${result.scoring.totalFan}`,
    `解释: ${result.explanation}`,
    "",
    "JSON 明细:",
    JSON.stringify(result, null, 2)
  ];

  document.getElementById("output").textContent = summaryLines.join("\n");
});
