import { fuseFrames } from "./recognizer.js";
import { runConfidenceGate } from "./confidenceGate.js";

/**
 * Purpose: Compose frame fusion and confidence gate steps.
 * Description:
 * - Fuses multi-frame predictions into one slot list.
 * - Applies confidence gate to mark uncertain slots.
 * - Adds tileCodes projection for downstream consumers.
 */
/**
 * Recognize hand from frame predictions using vision pipeline.
 *
 * @param {Array<Array<object>>} framePredictions - Per-frame predictions.
 * @returns {{status: string, missingIndices: number[], tiles: object[],
 *   tileCodes: string[]}}
 */
export function recognizeHandFromFrames(framePredictions) {
  const fused = fuseFrames(framePredictions);
  const gate = runConfidenceGate(fused);
  return {
    ...gate,
    tileCodes: gate.tiles.map((t) => t.label)
  };
}
