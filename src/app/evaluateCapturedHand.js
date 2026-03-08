import { recognizeHandFromFrames } from "../vision/pipeline.js";
import { scoreHand } from "../rules/scoringEngine.js";
import { explainScoringResult } from "../llm/explainer.js";
import { createReplayLog } from "../utils/replayLog.js";

function normalizeConfirmedTileMap(confirmedTiles) {
  const map = new Map();
  if (!confirmedTiles) return map;
  if (Array.isArray(confirmedTiles)) {
    for (let i = 0; i < confirmedTiles.length; i += 1) {
      const label = String(confirmedTiles[i] || "").trim();
      if (label) map.set(i, label);
    }
    return map;
  }
  for (const [rawIndex, rawLabel] of Object.entries(confirmedTiles)) {
    const index = Number(rawIndex);
    const label = String(rawLabel || "").trim();
    if (Number.isInteger(index) && index >= 0 && index <= 13 && label) {
      map.set(index, label);
    }
  }
  return map;
}

function applyConfirmedTiles(recognition, confirmedTiles) {
  const confirmedMap = normalizeConfirmedTileMap(confirmedTiles);
  if (confirmedMap.size === 0) {
    return {
      ...recognition,
      tileCodes: recognition.tiles.map((t) => t.label)
    };
  }

  const tiles = recognition.tiles.map((tile, index) => {
    if (!confirmedMap.has(index)) return { ...tile };
    const label = confirmedMap.get(index);
    const candidates = Array.isArray(tile.candidates) ? tile.candidates : [];
    const mergedCandidates = [
      { label, score: 1 },
      ...candidates.filter((it) => it?.label !== label)
    ].slice(0, 3);
    return {
      ...tile,
      label,
      finalLabel: label,
      source: "human",
      candidates: mergedCandidates
    };
  });

  const baseMissing = Array.isArray(recognition.missingIndices) ? recognition.missingIndices : [];
  const missingIndices = baseMissing.filter((index) => !confirmedMap.has(index));
  const status = missingIndices.length > 0 ? "need_human_confirm" : "accepted";
  return {
    ...recognition,
    status,
    missingIndices,
    tiles,
    tileCodes: tiles.map((t) => t.label)
  };
}

export function evaluateCapturedHand(request) {
  const baseRecognition = recognizeHandFromFrames(request.frames);
  const recognition = applyConfirmedTiles(baseRecognition, request.confirmedTiles);
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
