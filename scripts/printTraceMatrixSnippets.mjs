#!/usr/bin/env node
/**
 * Purpose: Print registry and exclusion markdown for trace matrix markers.
 * Description:
 * - Run from `hlm/`: `node scripts/printTraceMatrixSnippets.mjs`
 * - Prefer `writeRuleTraceMatrix.mjs` for the full file; this prints blocks only.
 */
import {
  buildExclusionMarkdown,
  buildRegistryMarkdown
} from "../tests/support/ruleTraceMatrixSnippets.js";

console.log("=== REGISTRY (paste between REGISTRY_TABLE_BEGIN/END) ===\n");
console.log(buildRegistryMarkdown());
console.log("\n=== EXCLUSION (paste between EXCLUSION_TABLE_BEGIN/END) ===\n");
console.log(buildExclusionMarkdown());
