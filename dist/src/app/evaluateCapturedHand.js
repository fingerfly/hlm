import { scoreHand } from "../rules/scoringEngine.js";
import { explainScoringResult } from "../llm/explainer.js";
import { createReplayLog } from "../utils/replayLog.js";
import { normalizeManualTiles } from "./manualTileInput.js";

/**
 * Purpose: Execute manual-hand evaluation end-to-end.
 * Description:
 * - Normalizes raw tile input before scoring.
 * - Produces recognition, scoring, explanation, and replay log.
 * - Returns deterministic error payload for invalid input.
 */
/**
 * Evaluate one captured hand request with manual tile path.
 *
 * @param {{tiles?: string[], context?: object}} request - Input request.
 * @returns {{recognition: object, scoring: object, explanation: string,
 *   replayLog: object}}
 */
export function evaluateCapturedHand(request) {
  const normalizedTiles = normalizeManualTiles(request?.tiles);
  if (!normalizedTiles.ok) {
    const scoring = {
      isWin: false,
      matchedFans: [],
      excludedFans: [],
      totalFan: 0,
      errorCode: "INVALID_INPUT",
      missingFields: [],
      problems: normalizedTiles.problems
    };
    const recognition = {
      status: "manual_invalid",
      tileCodes: [],
      missingIndices: [],
      problems: normalizedTiles.problems
    };
    return {
      recognition,
      scoring,
      explanation: "手牌输入无效，请修正后再计番。",
      replayLog: createReplayLog({ request, recognition, scoring })
    };
  }

  const recognition = {
    status: "manual_ready",
    tileCodes: normalizedTiles.tileCodes,
    missingIndices: []
  };
  const scoringInput = {
    ...request?.context,
    tiles: normalizedTiles.tileCodes
  };
  const scoring = scoreHand(scoringInput);
  const explanation = scoring.errorCode === "INVALID_INPUT"
    ? "手牌输入无效，请修正后再计番。"
    : explainScoringResult(scoring);

  return {
    recognition,
    scoring,
    explanation,
    replayLog: createReplayLog({ request, recognition, scoring })
  };
}
