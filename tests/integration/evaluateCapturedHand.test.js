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
  assert.equal(Array.isArray(result.recognition.missingIndices), true);
  assert.equal(result.recognition.tileCodes.length, 14);
  assert.equal(result.scoring.isWin, true);
  assert.equal(typeof result.replayLog.timestamp, "string");
  assert.match(result.explanation, /总番/);
});

test("evaluateCapturedHand accepts confirmed tile overrides and resumes scoring", () => {
  const noisy = stableFrame.map((t, index) => (index === 2 ? { ...t, confidence: 0.2 } : t));
  const withNeedConfirm = evaluateCapturedHand({
    frames: [stableFrame, noisy],
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "gangshang"
    }
  });
  assert.equal(withNeedConfirm.recognition.status, "need_human_confirm");
  assert.equal(withNeedConfirm.recognition.missingIndices.includes(2), true);

  const resumed = evaluateCapturedHand({
    frames: [stableFrame, noisy],
    confirmedTiles: { 2: "1W" },
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "gangshang"
    }
  });

  assert.equal(resumed.recognition.status, "accepted");
  assert.equal(resumed.recognition.tiles[2].source, "human");
  assert.equal(resumed.scoring.isWin, true);
});

test("evaluateCapturedHand blocks scoring when recognition payload is malformed", () => {
  const result = evaluateCapturedHand({
    frames: [[]],
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "gangshang"
    }
  });
  assert.equal(result.recognition.status, "failed");
  assert.equal(result.scoring.errorCode, "RECOGNITION_INVALID");
  assert.equal(result.scoring.isWin, false);
  assert.match(result.explanation, /识别结果结构无效/);
});
