export function runConfidenceGate(fusedResult) {
  const low = Array.isArray(fusedResult.lowConfidenceIndices) ? fusedResult.lowConfidenceIndices : [];
  const ambiguous = Array.isArray(fusedResult.ambiguousIndices) ? fusedResult.ambiguousIndices : [];
  const missingIndices = [...new Set([...low, ...ambiguous])].sort((a, b) => a - b);
  if (missingIndices.length > 0) {
    return {
      status: "need_human_confirm",
      missingIndices,
      tiles: fusedResult.tiles
    };
  }

  return {
    status: "accepted",
    missingIndices: [],
    tiles: fusedResult.tiles
  };
}
