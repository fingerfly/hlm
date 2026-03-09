const STATUS_TEXT = Object.freeze({
  manual_ready: "手动输入已就绪",
  manual_invalid: "手牌输入无效"
});

const WIN_PATTERN_TEXT = Object.freeze({
  standard: "基本和型",
  seven_pairs: "七对",
  thirteen_orphans: "十三幺"
});

const FAN_ID_TEXT = Object.freeze({
  MEN_QIAN_QING: "门前清",
  ZI_MO: "自摸",
  QI_DUI: "七对",
  SHI_SAN_YAO: "十三幺",
  GANG_SHANG_HUA: "杠上开花",
  HAI_DI_LAO_YUE: "海底捞月",
  HE_DI_LAO_YU: "河底捞鱼"
});

function mapFanItem(item) {
  return {
    ...item,
    name: FAN_ID_TEXT[item.id] || item.id
  };
}

export function buildResultViewModel(result) {
  const status = result?.recognition?.status || "";
  const scoring = result?.scoring || {};
  const pattern = scoring.winPattern;
  return {
    statusText: STATUS_TEXT[status] || status || "未知状态",
    winText: scoring.isWin ? "和牌" : "未和牌",
    totalFan: Number(scoring.totalFan || 0),
    minWinningFan: Number(scoring.minWinningFan || 0),
    winPatternText: WIN_PATTERN_TEXT[pattern] || "未成和",
    explanation: result?.explanation || "",
    matchedFans: (scoring.matchedFans || []).map(mapFanItem),
    excludedFans: (scoring.excludedFans || []).map(mapFanItem),
    raw: result
  };
}
