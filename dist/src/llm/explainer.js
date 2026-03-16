/**
 * Purpose: Build human-readable explanation for scoring output.
 * Description:
 * - Explains missing context and non-winning outcomes.
 * - Summarizes matched fan ids and total fan score.
 * - Keeps message generation deterministic and local.
 */
/**
 * Build explanation sentence from scoring result.
 *
 * @param {object} result - Scoring engine output.
 * @returns {string}
 */
export function explainScoringResult(result) {
  if (result.errorCode === "NEED_CONTEXT") {
    return `缺少上下文字段：${result.missingFields.join(", ")}。请补充后再计番。`;
  }

  if (result.errorCode === "NOT_A_WINNING_HAND") {
    return "当前输入未达到可和牌且满足起和番数的条件。";
  }

  const fanLines = result.matchedFans.map((f) => `${f.id}(${f.fan})`);
  return [
    `和牌类型：${result.winPattern}`,
    `总番：${result.totalFan}`,
    `命中番种：${fanLines.join("、")}`
  ].join("；");
}
