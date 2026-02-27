/**
 * Purpose: Auto-fill key columns in first10_eval_template.csv from spike results.
 * Author: Luke WU
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { buildEvalFields, parseGroundTruthTiles } from "../src/spike/vlm/evalCsv.js";
import { isSupportedImageFile, normalizeSampleId } from "../src/spike/vlm/sampleId.js";

const REQUIRED_COLUMNS = [
  "sample_id",
  "image_path",
  "run_cmd_ok",
  "api_ok",
  "tiles_len_14",
  "invalid_tile_count",
  "uncertain_count",
  "gt_tiles",
  "exact_match_14",
  "position_accuracy",
  "tile_set_accuracy",
  "tb_recall",
  "error_code"
];

function readJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

function detectImagePath(imagesDir, sampleId, root) {
  const files = readdirSync(imagesDir).filter((f) => isSupportedImageFile(f) && normalizeSampleId(f) === sampleId);
  return files.length > 0 ? join(relative(root, imagesDir), files[0]) : "";
}

function ensureColumns(headerCols) {
  const cols = [...headerCols];
  for (const key of REQUIRED_COLUMNS) {
    if (!cols.includes(key)) cols.push(key);
  }
  return cols;
}

function main() {
  const root = process.cwd();
  const csvPath = process.argv[2] || join(root, "tests/spike/first10_eval_template.csv");
  const resultDir = process.argv[3] || join(root, "tests/spike/results");
  const imagesDir = process.argv[4] || join(root, "tests/spike/images");

  const lines = readFileSync(csvPath, "utf8").split(/\r?\n/).filter((l) => l.length > 0);
  const header = ensureColumns(lines[0].split(","));
  const idx = Object.fromEntries(header.map((name, i) => [name, i]));
  const out = [header.join(",")];

  for (const line of lines.slice(1)) {
    const cols = line.split(",");
    while (cols.length < header.length) cols.push("");
    const sampleId = cols[idx.sample_id]?.trim();
    const result = readJson(join(resultDir, `${sampleId}.json`));
    const gtTiles = parseGroundTruthTiles(cols[idx.gt_tiles] || "");
    const fields = buildEvalFields(result, { groundTruthTiles: gtTiles });

    if (!cols[idx.image_path]?.trim()) cols[idx.image_path] = detectImagePath(imagesDir, sampleId, root);
    cols[idx.run_cmd_ok] = fields.run_cmd_ok;
    cols[idx.api_ok] = fields.api_ok;
    cols[idx.tiles_len_14] = fields.tiles_len_14;
    cols[idx.invalid_tile_count] = fields.invalid_tile_count;
    cols[idx.uncertain_count] = fields.uncertain_count;
    cols[idx.exact_match_14] = fields.exact_match_14;
    cols[idx.position_accuracy] = fields.position_accuracy;
    cols[idx.tile_set_accuracy] = fields.tile_set_accuracy;
    cols[idx.tb_recall] = fields.tb_recall;
    cols[idx.error_code] = fields.error_code;
    out.push(cols.slice(0, header.length).join(","));
  }

  writeFileSync(csvPath, `${out.join("\n")}\n`, "utf8");
  console.log(`Updated evaluation CSV: ${csvPath}`);
}

main();
