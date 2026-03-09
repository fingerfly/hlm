import { recognizeHandFromFrames } from "../vision/pipeline.js";
import { scoreHand } from "../rules/scoringEngine.js";
import { explainScoringResult } from "../llm/explainer.js";
import { createReplayLog } from "../utils/replayLog.js";
import { applyConfirmedTiles, normalizeRecognitionForEvaluation } from "./recognitionNormalizer.js";

export function evaluateCapturedHand(request) {
  const baseRecognition = recognizeHandFromFrames(request.frames);
  const mergedRecognition = applyConfirmedTiles(baseRecognition, request.confirmedTiles);
  const checked = normalizeRecognitionForEvaluation(mergedRecognition);
  if (!checked.ok) {
    const partial = {
      isWin: false,
      matchedFans: [],
      excludedFans: [],
      totalFan: 0,
      errorCode: checked.code,
      missingFields: [],
      problems: checked.problems
    };
    return {
      recognition: checked.recognition,
      scoring: partial,
      explanation: "识别结果结构无效，已阻断计番，请重试识别或人工录入。",
      replayLog: createReplayLog({ request, recognition: checked.recognition, scoring: partial })
    };
  }

  const recognition = checked.recognition;
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
