/**
 * Purpose: Keep `.cursor/plans/hlm_rule_code_trace_matrix.md` in sync with code.
 * Description:
 * - Fails when registry or exclusion tables drift from catalog / EXCLUSION_MAP.
 * - Regenerate: `node scripts/printTraceMatrixSnippets.mjs` and paste markers.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  EXCLUSION_MAP_KEY_COUNT,
  REGISTRY_ROW_COUNT,
  buildExclusionMarkdown,
  buildRegistryMarkdown
} from "../support/ruleTraceMatrixSnippets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MATRIX_PATH = path.join(
  __dirname,
  "..",
  "..",
  ".cursor",
  "plans",
  "hlm_rule_code_trace_matrix.md"
);

function extractBetween(src, begin, end) {
  const i = src.indexOf(begin);
  const j = src.indexOf(end);
  assert.notEqual(i, -1, `missing begin marker: ${begin}`);
  assert.notEqual(j, -1, `missing end marker: ${end}`);
  return src.slice(i + begin.length, j).trim();
}

describe("hlm_rule_code_trace_matrix.md", () => {
  it("registry table matches FAN_CATALOG and detector metadata", async () => {
    const body = await readFile(MATRIX_PATH, "utf8");
    const inner = extractBetween(
      body,
      "<!-- REGISTRY_TABLE_BEGIN -->\n",
      "\n<!-- REGISTRY_TABLE_END -->"
    );
    assert.equal(inner, buildRegistryMarkdown());
    assert.equal(REGISTRY_ROW_COUNT, 82);
  });

  it("EXCLUSION_MAP table matches exclusionMap.js", async () => {
    const body = await readFile(MATRIX_PATH, "utf8");
    const inner = extractBetween(
      body,
      "<!-- EXCLUSION_TABLE_BEGIN -->\n",
      "\n<!-- EXCLUSION_TABLE_END -->"
    );
    assert.equal(inner, buildExclusionMarkdown());
    assert.equal(EXCLUSION_MAP_KEY_COUNT, 33);
  });
});
