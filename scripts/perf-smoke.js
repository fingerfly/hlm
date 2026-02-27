import { evaluateCapturedHand } from "../src/app/evaluateCapturedHand.js";

const stableFrame = [
  { label: "1W", confidence: 0.97 },
  { label: "1W", confidence: 0.97 },
  { label: "1W", confidence: 0.97 },
  { label: "2W", confidence: 0.97 },
  { label: "3W", confidence: 0.97 },
  { label: "4W", confidence: 0.97 },
  { label: "5W", confidence: 0.97 },
  { label: "6W", confidence: 0.97 },
  { label: "7W", confidence: 0.97 },
  { label: "2T", confidence: 0.97 },
  { label: "3T", confidence: 0.97 },
  { label: "4T", confidence: 0.97 },
  { label: "9B", confidence: 0.97 },
  { label: "9B", confidence: 0.97 }
];

const request = {
  frames: [stableFrame, stableFrame, stableFrame],
  context: {
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "gangshang"
  }
};

const RUNS = 1000;
const start = performance.now();
for (let i = 0; i < RUNS; i += 1) {
  evaluateCapturedHand(request);
}
const elapsedMs = performance.now() - start;
const avgMs = elapsedMs / RUNS;

console.log(
  JSON.stringify(
    {
      runs: RUNS,
      elapsedMs: Number(elapsedMs.toFixed(2)),
      avgMs: Number(avgMs.toFixed(4))
    },
    null,
    2
  )
);
