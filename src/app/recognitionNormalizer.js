import { normalizeVisionResult } from "../contracts/visionResult.js";

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
    if (Number.isInteger(index) && index >= 0 && index <= 13 && label) map.set(index, label);
  }
  return map;
}

export function applyConfirmedTiles(recognition, confirmedTiles) {
  const confirmedMap = normalizeConfirmedTileMap(confirmedTiles);
  if (confirmedMap.size === 0) {
    return { ...recognition, tileCodes: recognition.tiles.map((t) => t.label) };
  }
  const tiles = recognition.tiles.map((tile, index) => {
    if (!confirmedMap.has(index)) return { ...tile };
    const label = confirmedMap.get(index);
    const candidates = Array.isArray(tile.candidates) ? tile.candidates : [];
    return {
      ...tile,
      label,
      finalLabel: label,
      source: "human",
      candidates: [{ label, score: 1 }, ...candidates.filter((it) => it?.label !== label)].slice(0, 3)
    };
  });
  const missingIndices = (recognition.missingIndices || []).filter((index) => !confirmedMap.has(index));
  return {
    ...recognition,
    status: missingIndices.length > 0 ? "need_human_confirm" : "accepted",
    missingIndices,
    tiles,
    tileCodes: tiles.map((t) => t.label)
  };
}

export function normalizeRecognitionForEvaluation(recognition) {
  if (recognition?.status === "failed") {
    const safeTiles = Array.isArray(recognition?.tiles) ? recognition.tiles : [];
    return {
      ok: false,
      code: "RECOGNITION_FAILED",
      problems: ["recognition failed before validation"],
      recognition: {
        status: "failed",
        tiles: safeTiles,
        missingIndices: Array.isArray(recognition?.missingIndices) ? recognition.missingIndices : [],
        tileCodes: safeTiles.map((t) => t?.label).filter(Boolean)
      }
    };
  }
  const normalized = normalizeVisionResult({
    status: recognition?.status,
    tiles: recognition?.tiles,
    uncertainIndices: Array.isArray(recognition?.missingIndices) ? recognition.missingIndices : []
  });
  if (!normalized.ok) {
    return {
      ok: false,
      code: "RECOGNITION_INVALID",
      problems: normalized.problems,
      recognition: { status: "failed", tiles: [], missingIndices: [], tileCodes: [] }
    };
  }
  const tiles = normalized.data.tiles.map((tile) => ({
    label: tile.finalLabel,
    finalLabel: tile.finalLabel,
    confidence: tile.confidence,
    candidates: tile.candidates,
    source: tile.source
  }));
  return {
    ok: true,
    recognition: {
      status: normalized.data.status,
      tiles,
      missingIndices: normalized.data.uncertainIndices,
      tileCodes: tiles.map((t) => t.label)
    }
  };
}
