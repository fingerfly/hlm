/**
 * Purpose: Decide whether fused recognition needs human confirmation.
 * Description:
 * - Merges low-confidence and ambiguous index signals.
 * - Emits accepted or need_human_confirm status.
 * - Preserves tile payload for downstream stages.
 */
/**
 * Apply confidence gate to fused recognition payload.
 *
 * @param {{tiles: object[], lowConfidenceIndices?: number[],
 *   ambiguousIndices?: number[]}} fusedResult
 * @returns {{status: string, missingIndices: number[], tiles: object[]}}
 */
export function runConfidenceGate(fusedResult) {
  const low = Array.isArray(fusedResult.lowConfidenceIndices)
    ? fusedResult.lowConfidenceIndices
    : [];
  const ambiguous = Array.isArray(fusedResult.ambiguousIndices)
    ? fusedResult.ambiguousIndices
    : [];
  const merged = [...new Set([...low, ...ambiguous])];
  const missingIndices = merged.sort((a, b) => a - b);
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
