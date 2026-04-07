/**
 * Purpose: Build rule→code trace markdown fragments from live catalog code.
 * Description:
 * - Registry rows follow FAN_CATALOG order (context, pattern, feature).
 * - Feature column mirrors `feature=*` evidence keys (`handFeatures.js`).
 * - Exclusion rows sort keys alphabetically for stable diffs.
 */
import { FAN_CATALOG } from "../../src/rules/fanCatalog.js";
import { FAN_REGISTRY_MAP } from "../../src/rules/fanRegistry.js";
import { EXCLUSION_MAP } from "../../src/rules/exclusionMap.js";
import { CONTEXT_DETECTORS } from "../../src/rules/detectors/contextDetectors.js";
import { PATTERN_DETECTORS } from "../../src/rules/detectors/patternDetectors.js";

const CTX = new Set(CONTEXT_DETECTORS.map((d) => d.id));
const PAT = new Set(PATTERN_DETECTORS.map((d) => d.id));

function escCell(s) {
  return String(s).replace(/\|/g, "\\|");
}

function detectorMeta(id) {
  if (CTX.has(id)) {
    return { cat: "context", file: "contextDetectors.js" };
  }
  if (PAT.has(id)) {
    return { cat: "pattern", file: "patternDetectors.js" };
  }
  return { cat: "feature", file: "featureDetectors.js" };
}

function featureFromEvidence(evidence) {
  const s = String(evidence);
  if (s.startsWith("feature=")) {
    return escCell(s.slice("feature=".length));
  }
  return "—";
}

/**
 * Markdown table body: header, separator, and data rows for registry trace.
 *
 * @returns {string}
 */
export function buildRegistryMarkdown() {
  const header =
    "| Registry id | zh | 番 | Detector cat | Detector file | " +
    "Feature (`handFeatures.js`) | Evidence |";
  const sep =
    "|---|---:|---:|---|---|---|---|";
  const lines = [header, sep];
  for (const item of FAN_CATALOG) {
    const { cat, file } = detectorMeta(item.id);
    const meta = FAN_REGISTRY_MAP[item.id];
    const zh = meta ? meta.zhName : "?";
    const feat = featureFromEvidence(item.evidence);
    lines.push(
      "| " +
        escCell(item.id) +
        " | " +
        escCell(zh) +
        " | " +
        item.fan +
        " | " +
        cat +
        " | " +
        file +
        " | " +
        feat +
        " | " +
        escCell(item.evidence) +
        " |"
    );
  }
  return lines.join("\n");
}

/**
 * Markdown table for EXCLUSION_MAP (sorted keys).
 *
 * @returns {string}
 */
export function buildExclusionMarkdown() {
  const header = "| # | Winner key | Excluded ids |";
  const sep = "|---:|---|---|";
  const keys = Object.keys(EXCLUSION_MAP).sort();
  const lines = [header, sep];
  keys.forEach((k, i) => {
    const v = EXCLUSION_MAP[k];
    lines.push(
      "| " +
        (i + 1) +
        " | " +
        escCell(k) +
        " | " +
        escCell([...v].join(", ")) +
        " |"
    );
  });
  return lines.join("\n");
}

/** Expected EXCLUSION_MAP key count for doc headers. */
export const EXCLUSION_MAP_KEY_COUNT = Object.keys(EXCLUSION_MAP).length;

/** Expected registry/detector row count for doc headers. */
export const REGISTRY_ROW_COUNT = FAN_CATALOG.length;
