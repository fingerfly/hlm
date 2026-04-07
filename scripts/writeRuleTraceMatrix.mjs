/**
 * Purpose: Regenerate `.cursor/plans/hlm_rule_code_trace_matrix.md` from code.
 * Description:
 * - Run from `hlm/`: `node scripts/writeRuleTraceMatrix.mjs`
 * - Updates marker blocks; refresh **Last regenerated** in header if needed.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXCLUSION_MAP_KEY_COUNT,
  REGISTRY_ROW_COUNT,
  buildExclusionMarkdown,
  buildRegistryMarkdown
} from "../tests/support/ruleTraceMatrixSnippets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reg = buildRegistryMarkdown();
const exc = buildExclusionMarkdown();

const body = `# HLM rule→code trace matrix (Guobiao / MCR)

**Purpose:** Single audit sheet linking each registry fan to its detector,
feature source (where applicable), exclusion-map role, and scoring pipeline
hooks.

**Cursor plan:** [hlm_rule_code_trace_matrix.plan.md](hlm_rule_code_trace_matrix.plan.md)

**Parent track:** [hlm_mcr_full_official_alignment_a1b2c3d4.plan.md](hlm_mcr_full_official_alignment_a1b2c3d4.plan.md)

**Rule baseline:** \`src/config/ruleBaseline.js\` (\`RULE_SOURCE\`, \`RULE_BASELINE\`)

**Last regenerated:** 2026-04-07 (v5.2.15; registry / detector rows **${REGISTRY_ROW_COUNT}**;
\`EXCLUSION_MAP\` keys **${EXCLUSION_MAP_KEY_COUNT}**)

## 82 registry rows vs official 81 番种

Official MCR lists **81** titled 番种. This codebase keeps **82** registry rows
because composition **全大 / 全中 / 全小** (\`QUAN_DA\`, \`QUAN_ZHONG\`,
\`QUAN_XIAO\`, \`featureDetectors.js\`) coexist with **序数上/中/下档和**
(\`SHANG_SAN_PAI\`, \`ZHONG_SAN_PAI\`, \`XIA_SAN_PAI\`, \`contextDetectors.js\`,
\`rankZone=upper|middle|lower\`) — different semantics; \`zhName\` matches
\`fanLexiconEntries\` so UI stays unambiguous. Only one variant should win per
hand; both ids remain for scoring traceability.
\`MCR_TARGET_FAN_COUNT\`, \`RULE_SOURCE.registryFanCount\`, and this
matrix use **82**.

## Column legend

| Column | Meaning |
|--------|---------|
| Registry id | Stable id in \`src/rules/fanRegistry.js\` |
| zh / 番 | Display name and fan value from registry |
| Detector cat | \`context\` / \`pattern\` / \`feature\` (\`src/rules/fanCatalog.js\` order) |
| Detector file | Under \`src/rules/detectors/\` |
| Feature (\`handFeatures.js\`) | \`extractHandFeatures\` property when cat = **feature**; **—** if context/pattern uses input / win shape only |
| Evidence | Detector \`evidence\` string (debug / explain) |

## Scoring pipeline (non-registry)

| Stage | Module | Role |
|-------|--------|------|
| Input validation | \`contracts/handState.js\`, \`structuredContextValidator.js\` | Context / tile contract |
| Win shape | \`winValidator.js\` | \`validateWin\`, \`enumerateStandardWinGroups\` |
| Candidate pick | \`scoringEngine.js\`, \`scoringCandidate.js\` | \`scoreWinShape\`, \`compareStandardWinPrecedence\` |
| Fan raw list | \`fanDetectors.js\` | Iterates \`FAN_CATALOG\` |
| Principles | \`conflictResolver.js\` → \`principleConstraints.js\` | Same-fan, conflict groups, **EXCLUSION_MAP**, attach-once |
| Gate / sum | \`scoreAggregator.js\` | \`gateMinFan\`, \`gateExcludeFanIds\` |
| Default snapshot | \`scoreRuleConfig.js\`, \`scoreAggregator.js\` | Official preset when config omitted |

## Verification anchors (suite-level)

| Artifact | Test / gate |
|----------|-------------|
| Every registry id has detector | \`tests/unit/fanCatalog.structure.test.js\` |
| Spot detection | \`tests/unit/fanDetectors.test.js\` |
| EXCLUSION_MAP rows (narrative) | \`tests/unit/conflictResolver.test.js\` |
| EXCLUSION_MAP all keys | \`tests/unit/exclusionMap.truthTable.test.js\` |
| Catalog detect smoke | \`tests/unit/fanCatalog.detectSmoke.test.js\` |
| Feature spot coverage | \`tests/unit/fanDetectors.coverageGaps.test.js\` |
| End-to-end shapes / gate | \`tests/unit/scoringEngine/patternsComposite.test.js\`, regression \`goldenCases.json\` |
| Official default snapshot | \`tests/unit/contractAndBaseline.test.js\`, integration \`evaluateCapturedHand\` |
| Matrix doc vs code | \`tests/unit/ruleTraceMatrix.docSync.test.js\` |
| Desktop browser smoke | \`npm run test:e2e\` (Playwright Chromium/WebKit/tablet/mobile + \`e2eStaticServe\`; includes Chromium/WebKit/tablet/mobile 14-tiles->result and tablet modal-flow assertions) |
| Full gate | \`npm test\`, \`npm run quality:complexity\` |

## \`CONFLICT_GROUPS\` (highest fan kept)

Defined in \`src/rules/principleConstraints.js\`:

| # | Members |
|---|---------|
| 1 | GANG_SHANG_HUA, HAI_DI_LAO_YUE, HE_DI_LAO_YU |
| 2 | QING_YI_SE, HUN_YI_SE |
| 3 | DA_SI_XI, XIAO_SI_XI |
| 4 | DA_SAN_YUAN, XIAO_SAN_YUAN |

## Registry → detector (\`FAN_CATALOG\` order)

**Maintenance — registry:** run \`node scripts/writeRuleTraceMatrix.mjs\` from
\`hlm/\` after \`fanRegistry.js\` / detector edits; set **Last regenerated** when
the date changes. Expect **${REGISTRY_ROW_COUNT}** rows (\`FAN_CATALOG.length\`).

<!-- REGISTRY_TABLE_BEGIN -->
${reg}
<!-- REGISTRY_TABLE_END -->

## \`EXCLUSION_MAP\` (winner → excluded children)

**Maintenance — exclusions:** rerun this script after \`exclusionMap.js\` edits.
Expect **${EXCLUSION_MAP_KEY_COUNT}** keys (\`exclusionMap.truthTable.test.js\`).

<!-- EXCLUSION_TABLE_BEGIN -->
${exc}
<!-- EXCLUSION_TABLE_END -->

## Known gaps (documentation only)

- **EXCLUSION_MAP:** \`exclusionMap.truthTable.test.js\` locks every key + child
  set; \`conflictResolver.test.js\` adds scenarios only.
- **Registry ↔ catalog:** \`fanCatalog.structure.test.js\` ties ids to detectors.
- **Matrix drift:** \`ruleTraceMatrix.docSync.test.js\`; regen this script.
`;

const out = path.join(
  __dirname,
  "..",
  ".cursor",
  "plans",
  "hlm_rule_code_trace_matrix.md"
);
writeFileSync(out, body, "utf8");
console.log("wrote", out);

