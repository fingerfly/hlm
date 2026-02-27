/**
 * Purpose: Generate spike summary metrics from current batch result files.
 * Author: Luke WU
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { computeSummary } from "../src/spike/vlm/summaryMetrics.js";
import { isSupportedImageFile, normalizeSampleId } from "../src/spike/vlm/sampleId.js";

function sampleIdsFromImageDir(dir) {
  return [...new Set(readdirSync(dir).filter(isSupportedImageFile).sort().map(normalizeSampleId))];
}

function readResultMap(resultDir, ids) {
  const out = {};
  for (const id of ids) {
    const path = join(resultDir, `${id}.json`);
    out[id] = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
  }
  return out;
}

function main() {
  const root = process.cwd();
  const imageDir = process.argv[2] || join(root, "tests/spike/images");
  const resultDir = process.argv[3] || join(root, "tests/spike/results");
  const summaryPath = process.argv[4] || join(resultDir, "summary.json");

  const sampleIds = sampleIdsFromImageDir(imageDir);
  const resultMap = readResultMap(resultDir, sampleIds);
  const summary = computeSummary(sampleIds, resultMap);
  summary.source = { imageDir, resultDir, sampleIds };
  mkdirSync(dirname(summaryPath), { recursive: true });
  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main();
