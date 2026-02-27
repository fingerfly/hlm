/**
 * Purpose: Run spike:auto repeatedly and report cross-run mean/std metrics.
 * Author: Luke WU
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { computeEvalMetricsFromCsvText, summarizeTrials } from "../src/spike/vlm/trialStats.js";

function runCommand(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function buildTrialMetrics(summary, evalMetrics) {
  return {
    successRate: Number(summary.successRate || 0),
    tilesLen14Rate: Number(summary.tilesLen14Rate || 0),
    averageUncertainCount: Number(summary.averageUncertainCount || 0),
    exactMatchRate: Number(evalMetrics.exactMatchRate || 0),
    avgPosition: Number(evalMetrics.avgPosition || 0),
    avgTileSet: Number(evalMetrics.avgTileSet || 0),
    avgTbRecall: Number(evalMetrics.avgTbRecall || 0),
    avgUncertainCsv: Number(evalMetrics.avgUncertain || 0),
    apiFailRate: evalMetrics.samples > 0 ? Number(evalMetrics.apiFailCount / evalMetrics.samples) : 0
  };
}

function main() {
  const root = process.cwd();
  const repeat = Math.max(1, Number.parseInt(process.argv[2] || "5", 10));
  const imageDir = process.argv[3] || join(root, "tests/spike/images");
  const resultDir = process.argv[4] || join(root, "tests/spike/results");
  const csvPath = process.argv[5] || join(root, "tests/spike/first10_eval_template.csv");
  const summaryPath = process.argv[6] || join(resultDir, "summary.json");
  const outputPath = process.argv[7] || join(resultDir, "repeat_stats.json");

  const trials = [];
  for (let i = 1; i <= repeat; i += 1) {
    console.log(`\n[repeat ${i}/${repeat}] running spike:auto`);
    runCommand("npm", ["run", "spike:auto", "--", imageDir, resultDir, csvPath, summaryPath]);
    console.log(`[repeat ${i}/${repeat}] refreshing eval csv`);
    runCommand("npm", ["run", "spike:fill-eval", "--", csvPath, resultDir, imageDir]);

    const summary = readJson(summaryPath);
    const evalMetrics = computeEvalMetricsFromCsvText(readFileSync(csvPath, "utf8"));
    const metrics = buildTrialMetrics(summary, evalMetrics);
    trials.push({ trial: i, ...metrics });
    console.log(`[repeat ${i}/${repeat}] metrics`, JSON.stringify(metrics));
  }

  const aggregate = summarizeTrials(trials, [
    "successRate",
    "tilesLen14Rate",
    "averageUncertainCount",
    "exactMatchRate",
    "avgPosition",
    "avgTileSet",
    "avgTbRecall",
    "avgUncertainCsv",
    "apiFailRate"
  ]);

  const report = {
    repeat,
    source: { imageDir, resultDir, csvPath, summaryPath },
    trials,
    aggregate
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`\nWrote repeat stats: ${outputPath}`);
  console.log(JSON.stringify(aggregate, null, 2));
}

main();
