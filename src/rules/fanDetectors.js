const FAN_DEFS = Object.freeze({
  MEN_QIAN_QING: { id: "MEN_QIAN_QING", fan: 2 },
  ZI_MO: { id: "ZI_MO", fan: 1 },
  QI_DUI: { id: "QI_DUI", fan: 24 },
  SHI_SAN_YAO: { id: "SHI_SAN_YAO", fan: 88 },
  GANG_SHANG_HUA: { id: "GANG_SHANG_HUA", fan: 8 },
  HAI_DI_LAO_YUE: { id: "HAI_DI_LAO_YUE", fan: 8 },
  HE_DI_LAO_YU: { id: "HE_DI_LAO_YU", fan: 8 }
});

export function detectFans(input, winPattern) {
  const fans = [];

  if (input.handState === "menqian") {
    fans.push({
      ...FAN_DEFS.MEN_QIAN_QING,
      evidence: "handState=menqian"
    });
  }

  if (input.winType === "zimo") {
    fans.push({
      ...FAN_DEFS.ZI_MO,
      evidence: "winType=zimo"
    });
  }

  if (winPattern === "seven_pairs") {
    fans.push({
      ...FAN_DEFS.QI_DUI,
      evidence: "pattern=seven_pairs"
    });
  }

  if (winPattern === "thirteen_orphans") {
    fans.push({
      ...FAN_DEFS.SHI_SAN_YAO,
      evidence: "pattern=thirteen_orphans"
    });
  }

  if (input.timingEvent === "gangshang") {
    fans.push({
      ...FAN_DEFS.GANG_SHANG_HUA,
      evidence: "timingEvent=gangshang"
    });
  } else if (input.timingEvent === "haidi") {
    fans.push({
      ...FAN_DEFS.HAI_DI_LAO_YUE,
      evidence: "timingEvent=haidi"
    });
  } else if (input.timingEvent === "hedi") {
    fans.push({
      ...FAN_DEFS.HE_DI_LAO_YU,
      evidence: "timingEvent=hedi"
    });
  }

  return fans;
}
