/**
 * Purpose: Compute deterministic summary metrics from spike result payloads.
 * Author: Luke WU
 */
/**
 * Compute summary for a batch run.
 * @param {string[]} sampleIds
 * @param {Record<string, any>} resultBySampleId
 */
export function computeSummary(sampleIds, resultBySampleId) {
  const summary = {
    total: sampleIds.length,
    success: 0,
    failed: 0,
    tilesLen14Count: 0,
    averageUncertainCount: 0,
    byCode: {}
  };

  let uncertainSum = 0;
  for (const id of sampleIds) {
    const result = resultBySampleId[id];
    if (!result) {
      summary.failed += 1;
      summary.byCode.MISSING_RESULT = (summary.byCode.MISSING_RESULT || 0) + 1;
      continue;
    }
    const ok = result.ok === true;
    const code = ok ? "OK" : String(result.code || "UNKNOWN_ERROR");
    summary.byCode[code] = (summary.byCode[code] || 0) + 1;
    if (ok) summary.success += 1;
    else summary.failed += 1;

    const tiles = result?.data?.tiles;
    if (Array.isArray(tiles) && tiles.length === 14) summary.tilesLen14Count += 1;
    const uncertain = result?.data?.uncertainIndices;
    if (Array.isArray(uncertain)) uncertainSum += uncertain.length;
  }

  summary.averageUncertainCount = summary.total > 0 ? Number((uncertainSum / summary.total).toFixed(3)) : 0;
  summary.successRate = summary.total > 0 ? Number((summary.success / summary.total).toFixed(3)) : 0;
  summary.tilesLen14Rate = summary.total > 0 ? Number((summary.tilesLen14Count / summary.total).toFixed(3)) : 0;
  return summary;
}
