/**
 * Purpose: Aggregate repeated spike experiment metrics.
 * Author: Luke WU
 */

function toFixed6(value) {
  return Number(value.toFixed(6));
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function std(values, mu) {
  if (!values.length) return 0;
  const variance = values.reduce((sum, v) => sum + ((v - mu) ** 2), 0) / values.length;
  return Math.sqrt(variance);
}

function parseNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

export function computeEvalMetricsFromCsvText(csvText) {
  const lines = String(csvText || "").trim().split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length <= 1) {
    return {
      samples: 0,
      exactMatchCount: 0,
      exactMatchRate: 0,
      avgPosition: 0,
      avgTileSet: 0,
      avgTbRecall: 0,
      avgUncertain: 0,
      apiFailCount: 0
    };
  }
  const header = lines[0].split(",");
  const idx = Object.fromEntries(header.map((name, i) => [name, i]));
  const rows = lines.slice(1).map((line) => line.split(","));
  const pick = (key) => rows.map((row) => parseNumber(row[idx[key]])).filter((n) => !Number.isNaN(n));
  const samples = rows.length;
  const exactMatchCount = rows.filter((row) => row[idx.exact_match_14] === "Y").length;
  const apiFailCount = rows.filter((row) => row[idx.api_ok] === "N").length;
  const avgPosition = mean(pick("position_accuracy"));
  const avgTileSet = mean(pick("tile_set_accuracy"));
  const avgTbRecall = mean(pick("tb_recall"));
  const avgUncertain = mean(pick("uncertain_count"));
  return {
    samples,
    exactMatchCount,
    exactMatchRate: samples > 0 ? exactMatchCount / samples : 0,
    avgPosition,
    avgTileSet,
    avgTbRecall,
    avgUncertain,
    apiFailCount
  };
}

export function summarizeTrials(trials, keys) {
  const out = {};
  for (const key of keys) {
    const values = trials.map((trial) => Number(trial[key])).filter((v) => Number.isFinite(v));
    if (values.length === 0) {
      out[key] = { count: 0, mean: 0, std: 0, min: 0, max: 0 };
      continue;
    }
    const mu = mean(values);
    out[key] = {
      count: values.length,
      mean: toFixed6(mu),
      std: toFixed6(std(values, mu)),
      min: toFixed6(Math.min(...values)),
      max: toFixed6(Math.max(...values))
    };
  }
  return out;
}
