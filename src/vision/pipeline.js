import { fuseFrames } from "./recognizer.js";
import { runConfidenceGate } from "./confidenceGate.js";

export function recognizeHandFromFrames(framePredictions) {
  const fused = fuseFrames(framePredictions);
  const gate = runConfidenceGate(fused);
  return {
    ...gate,
    tileCodes: gate.tiles.map((t) => t.label)
  };
}
