function voteTopLabel(labels) {
  const count = new Map();
  for (const label of labels) {
    count.set(label, (count.get(label) || 0) + 1);
  }
  const ordered = [...count.entries()].sort((a, b) => b[1] - a[1]);
  return ordered[0]?.[0] ?? null;
}

export function fuseFrames(framePredictions) {
  if (!Array.isArray(framePredictions) || framePredictions.length === 0) {
    return { tiles: [], lowConfidenceIndices: [] };
  }

  const tileCount = framePredictions[0].length;
  const tiles = [];
  const lowConfidenceIndices = [];

  for (let i = 0; i < tileCount; i += 1) {
    const labels = [];
    let confidenceSum = 0;
    let confidenceCount = 0;
    for (const frame of framePredictions) {
      const pred = frame[i];
      if (!pred) continue;
      labels.push(pred.label);
      confidenceSum += pred.confidence;
      confidenceCount += 1;
    }
    const label = voteTopLabel(labels);
    const confidence = confidenceCount ? confidenceSum / confidenceCount : 0;
    tiles.push({ label, confidence });
    if (confidence < 0.85) lowConfidenceIndices.push(i);
  }

  return { tiles, lowConfidenceIndices };
}
