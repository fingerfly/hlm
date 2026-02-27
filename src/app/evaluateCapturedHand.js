import { recognizeHandFromFrames } from "../vision/pipeline.js";
import { scoreHand } from "../rules/scoringEngine.js";
import { explainScoringResult } from "../llm/explainer.js";
import { createReplayLog } from "../utils/replayLog.js";

export function evaluateCapturedHand(request) {
  const recognition = recognizeHandFromFrames(request.frames);
  if (recognition.status === "need_human_confirm") {
    const partial = {
      isWin: false,
      matchedFans: [],
      excludedFans: [],
      totalFan: 0,
      errorCode: "NEED_HUMAN_CONFIRM",
      missingFields: recognition.missingIndices.map((i) => `tile_${i}`)
    };

    return {
      recognition,
      scoring: partial,
      explanation: "识别置信度不足，请人工确认高亮牌位。",
      replayLog: createReplayLog({ request, recognition, scoring: partial })
    };
  }

  const scoringInput = {
    ...request.context,
    tiles: recognition.tileCodes
  };
  const scoring = scoreHand(scoringInput);
  const explanation = explainScoringResult(scoring);

  return {
    recognition,
    scoring,
    explanation,
    replayLog: createReplayLog({ request, recognition, scoring })
  };
}
