# HLM rule→code trace matrix (Guobiao / MCR)

**Purpose:** Single audit sheet linking each registry fan to its detector,
feature source (where applicable), exclusion-map role, and scoring pipeline
hooks.

**Cursor plan:** [hlm_rule_code_trace_matrix.plan.md](hlm_rule_code_trace_matrix.plan.md)

**Parent track:** [hlm_mcr_full_official_alignment_a1b2c3d4.plan.md](hlm_mcr_full_official_alignment_a1b2c3d4.plan.md)

**Rule baseline:** `src/config/ruleBaseline.js` (`RULE_SOURCE`, `RULE_BASELINE`)

**Last regenerated:** 2026-04-07 (v5.2.15; registry / detector rows **82**;
`EXCLUSION_MAP` keys **33**)

## 82 registry rows vs official 81 番种

Official MCR lists **81** titled 番种. This codebase keeps **82** registry rows
because composition **全大 / 全中 / 全小** (`QUAN_DA`, `QUAN_ZHONG`,
`QUAN_XIAO`, `featureDetectors.js`) coexist with **序数上/中/下档和**
(`SHANG_SAN_PAI`, `ZHONG_SAN_PAI`, `XIA_SAN_PAI`, `contextDetectors.js`,
`rankZone=upper|middle|lower`) — different semantics; `zhName` matches
`fanLexiconEntries` so UI stays unambiguous. Only one variant should win per
hand; both ids remain for scoring traceability.
`MCR_TARGET_FAN_COUNT`, `RULE_SOURCE.registryFanCount`, and this
matrix use **82**.

## Column legend

| Column | Meaning |
|--------|---------|
| Registry id | Stable id in `src/rules/fanRegistry.js` |
| zh / 番 | Display name and fan value from registry |
| Detector cat | `context` / `pattern` / `feature` (`src/rules/fanCatalog.js` order) |
| Detector file | Under `src/rules/detectors/` |
| Feature (`handFeatures.js`) | `extractHandFeatures` property when cat = **feature**; **—** if context/pattern uses input / win shape only |
| Evidence | Detector `evidence` string (debug / explain) |

## Scoring pipeline (non-registry)

| Stage | Module | Role |
|-------|--------|------|
| Input validation | `contracts/handState.js`, `structuredContextValidator.js` | Context / tile contract |
| Win shape | `winValidator.js` | `validateWin`, `enumerateStandardWinGroups` |
| Candidate pick | `scoringEngine.js`, `scoringCandidate.js` | `scoreWinShape`, `compareStandardWinPrecedence` |
| Fan raw list | `fanDetectors.js` | Iterates `FAN_CATALOG` |
| Principles | `conflictResolver.js` → `principleConstraints.js` | Same-fan, conflict groups, **EXCLUSION_MAP**, attach-once |
| Gate / sum | `scoreAggregator.js` | `gateMinFan`, `gateExcludeFanIds` |
| Default snapshot | `scoreRuleConfig.js`, `scoreAggregator.js` | Official preset when config omitted |

## Verification anchors (suite-level)

| Artifact | Test / gate |
|----------|-------------|
| Every registry id has detector | `tests/unit/fanCatalog.structure.test.js` |
| Spot detection | `tests/unit/fanDetectors.test.js` |
| EXCLUSION_MAP rows (narrative) | `tests/unit/conflictResolver.test.js` |
| EXCLUSION_MAP all keys | `tests/unit/exclusionMap.truthTable.test.js` |
| Catalog detect smoke | `tests/unit/fanCatalog.detectSmoke.test.js` |
| Feature spot coverage | `tests/unit/fanDetectors.coverageGaps.test.js` |
| End-to-end shapes / gate | `tests/unit/scoringEngine/patternsComposite.test.js`, regression `goldenCases.json` |
| Official default snapshot | `tests/unit/contractAndBaseline.test.js`, integration `evaluateCapturedHand` |
| Matrix doc vs code | `tests/unit/ruleTraceMatrix.docSync.test.js` |
| Desktop browser smoke | `npm run test:e2e` (Playwright Chromium/WebKit/tablet/mobile + `e2eStaticServe`; includes Chromium/WebKit/tablet/mobile 14-tiles->result and tablet modal-flow assertions) |
| Full gate | `npm test`, `npm run quality:complexity` |

## `CONFLICT_GROUPS` (highest fan kept)

Defined in `src/rules/principleConstraints.js`:

| # | Members |
|---|---------|
| 1 | GANG_SHANG_HUA, HAI_DI_LAO_YUE, HE_DI_LAO_YU |
| 2 | QING_YI_SE, HUN_YI_SE |
| 3 | DA_SI_XI, XIAO_SI_XI |
| 4 | DA_SAN_YUAN, XIAO_SAN_YUAN |

## Registry → detector (`FAN_CATALOG` order)

**Maintenance — registry:** run `node scripts/writeRuleTraceMatrix.mjs` from
`hlm/` after `fanRegistry.js` / detector edits; set **Last regenerated** when
the date changes. Expect **82** rows (`FAN_CATALOG.length`).

<!-- REGISTRY_TABLE_BEGIN -->
| Registry id | zh | 番 | Detector cat | Detector file | Feature (`handFeatures.js`) | Evidence |
|---|---:|---:|---|---|---|---|
| MEN_QIAN_QING | 门前清 | 2 | context | contextDetectors.js | — | handState=menqian |
| ZI_MO | 自摸 | 1 | context | contextDetectors.js | — | winType=zimo |
| GANG_SHANG_HUA | 杠上开花 | 8 | context | contextDetectors.js | — | timingEvent=gangshang |
| HAI_DI_LAO_YUE | 海底捞月 | 8 | context | contextDetectors.js | — | timingEvent=haidi |
| HE_DI_LAO_YU | 河底捞鱼 | 8 | context | contextDetectors.js | — | timingEvent=hedi |
| QIANG_GANG_HU | 抢杠和 | 8 | context | contextDetectors.js | — | timingEvent=qianggang |
| AN_GANG | 暗杠 | 2 | context | contextDetectors.js | — | kongSummary.an>=1 |
| MING_GANG | 明杠 | 1 | context | contextDetectors.js | — | kongSummary.ming>=1 |
| SHUANG_AN_GANG | 双暗杠 | 8 | context | contextDetectors.js | — | kongSummary.an>=2 |
| SHUANG_MING_GANG | 双明杠 | 4 | context | contextDetectors.js | — | kongSummary.ming>=2 |
| SAN_GANG | 三杠 | 32 | context | contextDetectors.js | — | kongSummary.total>=3 |
| SI_GANG | 四杠 | 88 | context | contextDetectors.js | — | kongSummary.total>=4 |
| SHUANG_AN_KE | 双暗刻 | 2 | context | contextDetectors.js | — | concealedPungCount>=2 |
| SAN_AN_KE | 三暗刻 | 16 | context | contextDetectors.js | — | concealedPungCount>=3 |
| SI_AN_KE | 四暗刻 | 64 | context | contextDetectors.js | — | concealedPungCount>=4 |
| QUAN_QIU_REN | 全求人 | 6 | context | contextDetectors.js | — | allSetsMelded=true |
| BU_QIU_REN | 不求人 | 4 | context | contextDetectors.js | — | noMeldClaims=true |
| JUE_ZHANG | 和绝张 | 4 | context | contextDetectors.js | — | lastTileOfKind=true |
| BIAN_ZHANG | 边张 | 1 | context | contextDetectors.js | — | waitType=edge |
| KAN_ZHANG | 坎张 | 1 | context | contextDetectors.js | — | waitType=closed |
| DAN_DIAO_JIANG | 单钓将 | 1 | context | contextDetectors.js | — | waitType=single |
| HUA_PAI | 花牌 | 1 | context | contextDetectors.js | — | flowerCount>0 |
| QI_XING_BU_KAO | 七星不靠 | 24 | context | contextDetectors.js | — | specialPattern=qixing_bukao |
| SHANG_SAN_PAI | 序数上档和 | 24 | context | contextDetectors.js | — | rankZone=upper |
| ZHONG_SAN_PAI | 序数中档和 | 24 | context | contextDetectors.js | — | rankZone=middle |
| XIA_SAN_PAI | 序数下档和 | 24 | context | contextDetectors.js | — | rankZone=lower |
| SAN_SE_YI_TONG_SHUN | 三色一通顺 | 8 | context | contextDetectors.js | — | specialPattern=mixed_straight |
| WU_FAN_HE | 无番和 | 8 | context | contextDetectors.js | — | isChickenHand=true |
| QI_DUI | 七对 | 24 | pattern | patternDetectors.js | — | pattern=seven_pairs |
| SHI_SAN_YAO | 十三幺 | 88 | pattern | patternDetectors.js | — | pattern=thirteen_orphans |
| QING_YI_SE | 清一色 | 24 | feature | featureDetectors.js | pureOneSuit | feature=pureOneSuit |
| HUN_YI_SE | 混一色 | 6 | feature | featureDetectors.js | mixedOneSuit | feature=mixedOneSuit |
| DUAN_YAO | 断幺 | 2 | feature | featureDetectors.js | allSimples | feature=allSimples |
| PENG_PENG_HU | 碰碰和 | 6 | feature | featureDetectors.js | allPungs | feature=allPungs |
| HUN_YAO_JIU | 混幺九 | 32 | feature | featureDetectors.js | allTerminalsAndHonors | feature=allTerminalsAndHonors |
| ZI_YI_SE | 字一色 | 64 | feature | featureDetectors.js | allHonors | feature=allHonors |
| QING_YAO_JIU | 清幺九 | 64 | feature | featureDetectors.js | allTerminals | feature=allTerminals |
| QING_LONG | 清龙 | 16 | feature | featureDetectors.js | pureStraight | feature=pureStraight |
| PING_HU | 平和 | 2 | feature | featureDetectors.js | allChows | feature=allChows |
| YI_BAN_GAO | 一般高 | 1 | feature | featureDetectors.js | pureDoubleChow | feature=pureDoubleChow |
| SAN_SE_SAN_TONG_SHUN | 三色三同顺 | 8 | feature | featureDetectors.js | mixedTripleChow | feature=mixedTripleChow |
| MEN_FENG_KE | 门风刻 | 2 | feature | featureDetectors.js | seatWindPung | feature=seatWindPung |
| QUAN_FENG_KE | 圈风刻 | 2 | feature | featureDetectors.js | prevalentWindPung | feature=prevalentWindPung |
| DA_SI_XI | 大四喜 | 88 | feature | featureDetectors.js | bigFourWinds | feature=bigFourWinds |
| XIAO_SI_XI | 小四喜 | 64 | feature | featureDetectors.js | littleFourWinds | feature=littleFourWinds |
| DA_SAN_YUAN | 大三元 | 88 | feature | featureDetectors.js | bigThreeDragons | feature=bigThreeDragons |
| XIAO_SAN_YUAN | 小三元 | 64 | feature | featureDetectors.js | littleThreeDragons | feature=littleThreeDragons |
| HUA_LONG | 花龙 | 8 | feature | featureDetectors.js | mixedStraight | feature=mixedStraight |
| XI_XIANG_FENG | 喜相逢 | 1 | feature | featureDetectors.js | mixedDoubleChow | feature=mixedDoubleChow |
| LIAN_LIU | 连六 | 1 | feature | featureDetectors.js | shortStraight | feature=shortStraight |
| LAO_SHAO_FU | 老少副 | 1 | feature | featureDetectors.js | twoTerminalChows | feature=twoTerminalChows |
| QUE_YI_MEN | 缺一门 | 1 | feature | featureDetectors.js | oneVoidedSuit | feature=oneVoidedSuit |
| WU_ZI | 无字 | 1 | feature | featureDetectors.js | noHonors | feature=noHonors |
| SAN_SE_SAN_BU_GAO | 三色三步高 | 6 | feature | featureDetectors.js | mixedShiftedChows | feature=mixedShiftedChows |
| YI_SE_SAN_BU_GAO | 一色三步高 | 16 | feature | featureDetectors.js | pureShiftedChows | feature=pureShiftedChows |
| DA_YU_WU | 大于五 | 12 | feature | featureDetectors.js | daYuWu | feature=daYuWu |
| XIAO_YU_WU | 小于五 | 12 | feature | featureDetectors.js | xiaoYuWu | feature=xiaoYuWu |
| QUAN_DA | 全大 | 24 | feature | featureDetectors.js | quanDa | feature=quanDa |
| QUAN_XIAO | 全小 | 24 | feature | featureDetectors.js | quanXiao | feature=quanXiao |
| QUAN_ZHONG | 全中 | 24 | feature | featureDetectors.js | quanZhong | feature=quanZhong |
| DA_SAN_FENG | 大三风 | 12 | feature | featureDetectors.js | daSanFeng | feature=daSanFeng |
| SHUANG_JIAN_KE | 双箭刻 | 6 | feature | featureDetectors.js | shuangJianKe | feature=shuangJianKe |
| SHUANG_TONG_KE | 双同刻 | 2 | feature | featureDetectors.js | shuangTongKe | feature=shuangTongKe |
| SAN_TONG_KE | 三同刻 | 16 | feature | featureDetectors.js | sanTongKe | feature=sanTongKe |
| LV_YI_SE | 绿一色 | 88 | feature | featureDetectors.js | lvYiSe | feature=lvYiSe |
| TUI_BU_DAO | 推不倒 | 8 | feature | featureDetectors.js | tuiBuDao | feature=tuiBuDao |
| JIU_LIAN_BAO_DENG | 九莲宝灯 | 88 | feature | featureDetectors.js | jiuLianBaoDeng | feature=jiuLianBaoDeng |
| QI_LIAN_DUI | 连七对 | 88 | feature | featureDetectors.js | qiLianDui | feature=qiLianDui |
| YI_SE_SHUANG_LONG_HUI | 一色双龙会 | 64 | feature | featureDetectors.js | yiSeShuangLongHui | feature=yiSeShuangLongHui |
| YI_SE_SI_TONG_SHUN | 一色四同顺 | 48 | feature | featureDetectors.js | yiSeSiTongShun | feature=yiSeSiTongShun |
| YI_SE_SI_BU_GAO | 一色四步高 | 32 | feature | featureDetectors.js | yiSeSiBuGao | feature=yiSeSiBuGao |
| QUAN_SHUANG_KE | 全双刻 | 24 | feature | featureDetectors.js | quanShuangKe | feature=quanShuangKe |
| YI_SE_SAN_TONG_SHUN | 一色三同顺 | 24 | feature | featureDetectors.js | yiSeSanTongShun | feature=yiSeSanTongShun |
| YI_SE_SAN_JIE_GAO | 一色三节高 | 24 | feature | featureDetectors.js | yiSeSanJieGao | feature=yiSeSanJieGao |
| SAN_SE_SAN_JIE_GAO | 三色三节高 | 8 | feature | featureDetectors.js | sanSeSanJieGao | feature=sanSeSanJieGao |
| QUAN_DAI_WU | 全带五 | 16 | feature | featureDetectors.js | quanDaiWu | feature=quanDaiWu |
| WU_MEN_QI | 五门齐 | 6 | feature | featureDetectors.js | wuMenQi | feature=wuMenQi |
| QUAN_DAI_YAO | 全带幺 | 4 | feature | featureDetectors.js | quanDaiYao | feature=quanDaiYao |
| JIAN_KE | 箭刻 | 2 | feature | featureDetectors.js | jianKe | feature=jianKe |
| YAO_JIU_KE | 幺九刻 | 1 | feature | featureDetectors.js | yaoJiuKe | feature=yaoJiuKe |
| SAN_SE_SHUANG_LONG_HUI | 三色双龙会 | 16 | feature | featureDetectors.js | sanSeShuangLongHui | feature=sanSeShuangLongHui |
| SI_GUI_YI | 四归一 | 2 | feature | featureDetectors.js | siGuiYi | feature=siGuiYi |
<!-- REGISTRY_TABLE_END -->

## `EXCLUSION_MAP` (winner → excluded children)

**Maintenance — exclusions:** rerun this script after `exclusionMap.js` edits.
Expect **33** keys (`exclusionMap.truthTable.test.js`).

<!-- EXCLUSION_TABLE_BEGIN -->
| # | Winner key | Excluded ids |
|---:|---|---|
| 1 | DA_SAN_FENG | YAO_JIU_KE |
| 2 | DA_SAN_YUAN | XIAO_SAN_YUAN, SHUANG_JIAN_KE, JIAN_KE, YAO_JIU_KE |
| 3 | DA_SI_XI | MEN_FENG_KE, QUAN_FENG_KE, ZI_YI_SE, PENG_PENG_HU, DA_SAN_FENG, YAO_JIU_KE |
| 4 | DA_YU_WU | WU_ZI |
| 5 | HUN_YAO_JIU | PENG_PENG_HU, YAO_JIU_KE |
| 6 | HUN_YI_SE | QUE_YI_MEN |
| 7 | JIU_LIAN_BAO_DENG | QING_YI_SE, MEN_QIAN_QING, YAO_JIU_KE |
| 8 | LV_YI_SE | QING_YI_SE, PENG_PENG_HU, DUAN_YAO, YI_SE_SAN_JIE_GAO, YI_SE_SAN_TONG_SHUN, YI_BAN_GAO |
| 9 | PING_HU | WU_ZI |
| 10 | QING_LONG | LIAN_LIU, LAO_SHAO_FU |
| 11 | QING_YAO_JIU | YAO_JIU_KE, PENG_PENG_HU |
| 12 | QING_YI_SE | QUE_YI_MEN, WU_ZI |
| 13 | QI_DUI | MEN_QIAN_QING, DUAN_YAO, WU_ZI, DAN_DIAO_JIANG |
| 14 | QI_LIAN_DUI | QI_DUI |
| 15 | QUAN_DA | DA_YU_WU, WU_ZI |
| 16 | QUAN_XIAO | XIAO_YU_WU, WU_ZI |
| 17 | QUAN_ZHONG | DUAN_YAO, WU_ZI |
| 18 | SAN_GANG | SHUANG_AN_GANG, SHUANG_MING_GANG, AN_GANG, MING_GANG |
| 19 | SAN_SE_SAN_TONG_SHUN | XI_XIANG_FENG |
| 20 | SAN_SE_SHUANG_LONG_HUI | PING_HU, XI_XIANG_FENG, LIAN_LIU, LAO_SHAO_FU, HUA_LONG, YI_BAN_GAO |
| 21 | SAN_TONG_KE | SHUANG_TONG_KE |
| 22 | SHI_SAN_YAO | HUN_YAO_JIU, MEN_QIAN_QING, DAN_DIAO_JIANG |
| 23 | SHUANG_AN_GANG | AN_GANG |
| 24 | SHUANG_JIAN_KE | JIAN_KE |
| 25 | SHUANG_MING_GANG | MING_GANG |
| 26 | SI_GANG | SAN_GANG |
| 27 | XIAO_SAN_YUAN | SHUANG_JIAN_KE, JIAN_KE, YAO_JIU_KE |
| 28 | XIAO_SI_XI | MEN_FENG_KE, QUAN_FENG_KE, DA_SAN_FENG, YAO_JIU_KE |
| 29 | XIAO_YU_WU | WU_ZI |
| 30 | YI_SE_SAN_JIE_GAO | YI_SE_SAN_TONG_SHUN |
| 31 | YI_SE_SHUANG_LONG_HUI | QING_YI_SE, PING_HU, YI_BAN_GAO, LIAN_LIU, LAO_SHAO_FU |
| 32 | YI_SE_SI_TONG_SHUN | YI_SE_SAN_JIE_GAO, YI_SE_SAN_TONG_SHUN, YI_BAN_GAO, SI_GUI_YI |
| 33 | ZI_YI_SE | YAO_JIU_KE, JIAN_KE, MEN_FENG_KE, QUAN_FENG_KE |
<!-- EXCLUSION_TABLE_END -->

## Known gaps (documentation only)

- **EXCLUSION_MAP:** `exclusionMap.truthTable.test.js` locks every key + child
  set; `conflictResolver.test.js` adds scenarios only.
- **Registry ↔ catalog:** `fanCatalog.structure.test.js` ties ids to detectors.
- **Matrix drift:** `ruleTraceMatrix.docSync.test.js`; regen this script.
