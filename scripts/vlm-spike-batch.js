/**
 * Purpose: Batch-run VLM spike on all sample images and store JSON outputs.
 * Author: Luke WU
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { spawnSync } from "node:child_process";
import { isSupportedImageFile, normalizeSampleId } from "../src/spike/vlm/sampleId.js";
import { loadRuntimeEnv } from "../src/spike/vlm/runtimeConfig.js";

function getImageFiles(dir) {
  const seen = new Set();
  const files = [];
  for (const name of readdirSync(dir).sort()) {
    if (!isSupportedImageFile(name)) continue;
    const id = normalizeSampleId(name);
    if (seen.has(id)) continue;
    seen.add(id);
    files.push(join(dir, name));
  }
  return files;
}

function runOne(projectRoot, imagePath) {
  const run = spawnSync("npm", ["run", "spike:vlm", "--", imagePath], {
    cwd: projectRoot,
    encoding: "utf8",
    env: process.env
  });
  const stdout = run.stdout || "";
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end < 0 || end <= start) {
    return { ok: false, code: "INVALID_CLI_OUTPUT", raw: stdout + (run.stderr || "") };
  }
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return { ok: false, code: "INVALID_JSON_OUTPUT", raw: stdout + (run.stderr || "") };
  }
}

function parseArgs(root, argv) {
  const keepOld = argv.includes("--keep-old");
  const values = argv.filter((v) => !v.startsWith("--"));
  return {
    imageDir: values[0] || join(root, "tests/spike/images"),
    resultDir: values[1] || join(root, "tests/spike/results"),
    keepOld
  };
}

function main() {
  loadRuntimeEnv();
  const projectRoot = process.cwd();
  const { imageDir, resultDir, keepOld } = parseArgs(projectRoot, process.argv.slice(2));
  mkdirSync(resultDir, { recursive: true });
  if (!keepOld) {
    for (const name of readdirSync(resultDir)) {
      if (name.endsWith(".json")) rmSync(join(resultDir, name), { force: true });
    }
  }

  const files = getImageFiles(imageDir);
  if (files.length === 0) {
    console.error(`No image files found in: ${imageDir}`);
    process.exit(1);
  }

  const summary = { total: files.length, success: 0, failed: 0, byCode: {} };
  for (const imagePath of files) {
    const result = runOne(projectRoot, imagePath);
    const id = normalizeSampleId(basename(imagePath, extname(imagePath)));
    const out = join(resultDir, `${id}.json`);
    writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`, "utf8");

    const code = result.ok ? "OK" : (result.code || "UNKNOWN_ERROR");
    summary.byCode[code] = (summary.byCode[code] || 0) + 1;
    if (result.ok) summary.success += 1;
    else summary.failed += 1;
    console.log(`${result.ok ? "OK" : "FAIL"}  ${basename(imagePath)} -> ${out} (${code})`);
  }

  console.log("\nBatch summary:");
  console.log(JSON.stringify(summary, null, 2));
}

main();
