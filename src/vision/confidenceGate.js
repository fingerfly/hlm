export function runConfidenceGate(fusedResult) {
  const missingIndices = fusedResult.lowConfidenceIndices || [];
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
