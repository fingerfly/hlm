/**
 * Purpose: Run spike pipeline in one command: batch -> fill-eval -> summary.
 * Author: Luke WU
 */
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { runSequentialSteps, validateRuntimeConfig } from "../src/spike/vlm/orchestrator.js";
import { loadRuntimeEnv } from "../src/spike/vlm/runtimeConfig.js";

function runScript(step) {
  const run = spawnSync("npm", ["run", ...step], { cwd: process.cwd(), encoding: "utf8", env: process.env });
  if (run.status !== 0) return { ok: false, message: `${run.stdout || ""}\n${run.stderr || ""}`.trim() };
  return { ok: true, message: run.stdout || "" };
}

function main() {
  loadRuntimeEnv();
  const root = process.cwd();
  const imageDir = process.argv[2] || join(root, "tests/spike/images");
  const resultDir = process.argv[3] || join(root, "tests/spike/results");
  const csvPath = process.argv[4] || join(root, "tests/spike/first10_eval_template.csv");
  const summaryPath = process.argv[5] || join(resultDir, "summary.json");
  const cfg = validateRuntimeConfig(process.env);
  if (!cfg.ok) {
    console.error(cfg.message);
    process.exit(1);
  }

  const steps = [
    ["spike:batch", "--", imageDir, resultDir],
    ["spike:fill-eval", "--", csvPath, resultDir, imageDir],
    ["spike:summary", "--", imageDir, resultDir, summaryPath]
  ];
  const result = runSequentialSteps(steps, runScript);
  if (!result.ok) {
    console.error(`Failed step: ${result.failedStep.join(" ")}`);
    console.error(result.message);
    process.exit(1);
  }
  console.log(`Pipeline done. Summary: ${summaryPath}`);
}

main();
