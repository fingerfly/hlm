import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCapturedHand } from "../../src/app/evaluateCapturedHand.js";

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

test("evaluateCapturedHand asks for human confirm on low confidence tiles", () => {
  const noisy = stableFrame.map((t, index) =>
    index === 2 ? { ...t, confidence: 0.3 } : t
  );
  const result = evaluateCapturedHand({
    frames: [stableFrame, noisy],
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none"
    }
  });
  assert.equal(result.recognition.status, "need_human_confirm");
  assert.equal(result.scoring.errorCode, "NEED_HUMAN_CONFIRM");
});

test("evaluateCapturedHand returns scoring + replay log on accepted recognition", () => {
  const result = evaluateCapturedHand({
    frames: [stableFrame, stableFrame, stableFrame],
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "gangshang"
    }
  });
  assert.equal(result.recognition.status, "accepted");
  assert.equal(result.scoring.isWin, true);
  assert.equal(typeof result.replayLog.timestamp, "string");
  assert.match(result.explanation, /总番/);
});
