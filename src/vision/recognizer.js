function rankCandidates(predictions) {
  const byLabel = new Map();
  for (const pred of predictions) {
    const label = String(pred?.label || "").trim();
    const confidence = Number(pred?.confidence || 0);
    if (!label) continue;
    if (!byLabel.has(label)) {
      byLabel.set(label, { label, count: 0, confidenceSum: 0 });
    }
    const entry = byLabel.get(label);
    entry.count += 1;
    entry.confidenceSum += confidence;
  }
  const ranked = [...byLabel.values()].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return b.confidenceSum - a.confidenceSum;
  });
  return ranked.map((item) => ({
    label: item.label,
    score: Number((item.confidenceSum / item.count).toFixed(4)),
    count: item.count,
    confidenceSum: item.confidenceSum
  }));
}

function isAmbiguous(topCandidates) {
  if (!Array.isArray(topCandidates) || topCandidates.length < 2) return false;
  const first = topCandidates[0];
  const second = topCandidates[1];
  if (first.count === second.count) return true;
  if (first.count - second.count <= 1) {
    const gap = Math.abs(first.score - second.score);
    return gap < 0.2;
  }
  return false;
}

export function fuseFrames(framePredictions) {
  if (!Array.isArray(framePredictions) || framePredictions.length === 0) {
    return { tiles: [], lowConfidenceIndices: [], ambiguousIndices: [] };
  }

  const tileCount = framePredictions[0].length;
  const tiles = [];
  const lowConfidenceIndices = [];
  const ambiguousIndices = [];

  for (let i = 0; i < tileCount; i += 1) {
    const predictions = [];
    for (const frame of framePredictions) {
      const pred = frame[i];
      if (!pred) continue;
      predictions.push(pred);
    }
    const candidates = rankCandidates(predictions);
    const label = candidates[0]?.label ?? null;
    const confidence = candidates[0]?.score ?? 0;
    tiles.push({
      label,
      confidence,
      candidates: candidates.slice(0, 3).map((it) => ({ label: it.label, score: it.score })),
      source: "model"
    });
    if (confidence < 0.85) lowConfidenceIndices.push(i);
    if (isAmbiguous(candidates)) ambiguousIndices.push(i);
  }

  return { tiles, lowConfidenceIndices, ambiguousIndices };
}
