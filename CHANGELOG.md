# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [5.2.4] - 2026-04-05

### Added
- 启动画面「跳过」按钮；桌面帮助浮层点击外部关闭；模态层点击遮罩关闭
  （含结果窗；桌面内联选牌/条件不触发）。
- `public/modalBackdropWiring.js`、`public/modalFocusUtils.js`；
  帮助文档说明选满 14 张自动进入条件步骤及
  `localStorage hlm_disableAutoWizardAdvance`。
- 和牌条件内「结算规则与自定义」默认折叠（`<details>`）；四家分数输入
  `min`/`max` 与 `parsePlayerScoreInput` 钳位（-99999–99999）。

### Changed
- 底部「重置和牌条件」文案；结果番种行释义按钮由符号改为「释义」；
  步骤 3 计算失败时在底部提示原因（角色错误仍以表单内文案为准）。
- `openModalByKey` 后对焦 picker/context 表单首控件；Escape 关闭选牌/
  遮罩式条件/结果窗；移除未使用的 `#startRoundBtn` DOM。

## [5.2.3] - 2026-04-04

## [5.2.2] - 2026-04-03

### Added
- 结果弹窗番数行：当引擎 `gateFan` 低于 `totalFan`（如花牌不计入起和）时显示
  **总番** 与 **起和** 分项（`resultViewModel`、`resultModalView`、
  `tests/unit/resultModalView.test.js`）。

## [5.2.1] - 2026-04-04

### Changed
- 中文帮助「推荐使用步骤」与 **三步向导**（设定玩家 → 手牌 2/3 → 条件 3/3）对齐；
  补充底部上/下一步提示（`public/index.html`）。
- `tests/unit/indexStylesheetLinks.test.js`：帮助模板含设定玩家与步骤 2/3、3/3 文案
  契约。

## [5.2.0] - 2026-04-03

### Changed
- **三步向导（Option B）**：「设定玩家」并入 `main.app-shell` 为步骤 1/3，取消全屏
  启动门遮挡主界面；手牌为 2/3，和牌条件为 3/3；底部「下一步」统一离开设定
  （`startRoundBtn` 保留 id 供契约测试，默认隐藏）。
- `uiFlowState` 扩展为三步；`goWizardNext` / `syncWizardModals` /
  `handleWizardNextClick`（step 3 计算）与桌面内联 context 对齐；
  「再玩一局」回到步骤 2（手牌）。
- 样式：`round-setup-gate` 改为壳内卡片布局（非 `100vh` 遮罩）。

### Added
- `tests/unit/roundSetupGateDom.test.js`：断言 `#roundSetupGate` 位于 `<main>` 内、
  `handCardSection` id 存在。

## [5.1.1] - 2026-04-03

### Fixed
- 结果弹窗「四家结算」表头与数据列错位：改为 `table` + `colgroup` 固定列宽，
  与 `tbody` 共用同一列网格 (`public/index.html`, `public/resultModalView.js`,
  `public/styles-components.css`, `public/styles-responsive.css`).

## [5.1.0] - 2026-04-03

### Added
- `buildScoringRuleSnapshot` 与规则配置中的 `scoring` / `settlement` 字段：支持起和门槛
  与花牌排除、`officialBaseFan` 底分+基本分结算；新增
  `src/app/officialBaseFanSettlement.js`。
- 单元/集成测试覆盖国标起和门槛、花牌不计起和、官方结算守恒
  (`tests/unit/scoreAggregator.test.js`、`tests/unit/roundSettlement.test.js`、
  `tests/unit/scoringEngine/contractAndBaseline.test.js`、
  `tests/integration/evaluateCapturedHand.test.js`、
  `tests/unit/scoreRuleConfigValidator.test.js`)。

### Changed
- **国标预设**（`MCR_Official`）：8 分起和（`HUA_PAI` 不计入起和判定）、自摸/点和按
  体育总局公式「底分 8 + 总番」结算；**当前兼容**预设保持原线性番→点逻辑。
- `calculate()` 将当前 `scoreRuleConfig` 注入 `evaluateCapturedHand` / `scoreHand`
  (`public/resultStateActions.js`, `src/app/evaluateCapturedHand.js`)。
- `scoreHand` 在多个分解间优先保留满足起和的候选 (`src/rules/scoringEngine.js`)。
- 版本 `5.1.0`（build 1）(`package.json`, `src/config/appVersion.js`)。

## [5.0.0] - 2026-04-03

### Added
- 启动门新增牌桌俯视布局（四风位 + 中心庄家/开始对局），并补充 DOM 契约测试，
  确保既有输入 id 与风位标记稳定
  (`public/index.html`, `public/app.js`, `public/styles-components.css`,
  `public/styles-responsive.css`, `tests/unit/roundSetupGateDom.test.js`).
- 和牌条件增加并强化结算角色可见性：移动端/桌面端均可设置和牌者与放铳者，
  并新增角色约束单测覆盖 (`public/index.html`, `public/styles-modals.css`,
  `public/styles-responsive.css`, `tests/unit/resultStateActions.test.js`).

### Changed
- 点和（`dianhe`）改为必须手选放铳者；未选或与和牌者相同会阻断计算并给出提示。
  自摸（`zimo`）场景保持放铳者隐藏且清空
  (`public/resultStateActions.js`, `public/app.js`, `public/resultModalView.js`).
- 结果弹窗四家结算区域新增校验失败可视化，避免非法角色输入时出现“静默全 0”
  误导 (`public/resultModalView.js`, `src/app/resultViewModel.js`).
- 版本升级到 `5.0.0`（build 1），同步运行时版本常量
  (`package.json`, `src/config/appVersion.js`).

## [4.12.0] - 2026-04-03

### Added
- 启动门 DOM 契约单测 `tests/unit/roundSetupGateDom.test.js`（四风位 `data-seat` 与
  既有输入 id）。
- 启动新增「开始对局」入口：先定义四家（东南西北）名称/起始分与庄家后，再进入手牌流程
  (`public/index.html`, `public/app.js`, `public/styles-components.css`).
- 新增四家结算核心模块，按 `zimo`/`dianhe` 计算四家 `局前/增减/局后`，并提供
  守恒校验 (`src/app/roundSettlement.js`,
  `tests/unit/roundSettlement.test.js`).

### Changed
- 启动门「设定玩家」改为俯视牌桌布局（四风位面板 + 中心庄家与开始对局），保留既有
  输入 id；庄家下拉变更时高亮当前座席 (`public/index.html`,
  `public/styles-components.css`, `public/styles-responsive.css`, `public/app.js`).
- 和牌条件新增结算角色输入（和牌者、放铳者），并将其纳入结果计算请求；
  `zimo` 时隐藏并清空放铳者输入 (`public/index.html`,
  `public/resultStateActions.js`, `public/app.js`, `public/contextWiring.js`,
  `public/uiBindings.js`).
- 结果窗体新增「四家结算」区块，展示四家行级明细并复用 view model 输出
  (`public/resultModalView.js`, `public/appRefs.js`,
  `src/app/resultViewModel.js`, `tests/unit/resultViewModel.test.js`).
- 结算角色在移动端/桌面端均可设置；点和（`dianhe`）未手选放铳者时，
  结果窗体显示结算校验失败原因，避免四家结算静默全 0
  (`public/index.html`, `public/styles-modals.css`,
  `public/styles-responsive.css`, `src/app/resultViewModel.js`,
  `public/resultModalView.js`).
- 桌面端（PC/Mac）和牌条件 inline context 隐藏「应用」按钮及其 footer 行；
  移动端保留原有「应用」按钮行为不变
  (`public/styles-responsive.css`, `tests/unit/indexStylesheetLinks.test.js`).
- 和牌条件结算角色改为随和牌方式动态约束：自摸时放铳者不可选；点和时若未选
  放铳者或与和牌者相同，前置阻断计算并给出提示
  (`public/resultStateActions.js`, `public/app.js`, `public/index.html`,
  `public/styles-modals.css`, `tests/unit/resultStateActions.test.js`).
- 结算规则新增参数化配置与双预设（`MCR_Official` / `Current_Compat`），并支持
  本地持久化选择与自定义克隆回退；结果区显示当前规则信息
  (`src/config/scoreRuleConfig.js`, `src/contracts/scoreRuleConfigValidator.js`,
  `public/scoreRuleState.js`, `src/app/roundSettlement.js`, `public/app.js`,
  `public/resultStateActions.js`, `public/index.html`,
  `src/app/resultViewModel.js`, `public/resultModalView.js`,
  `tests/unit/scoreRuleConfigValidator.test.js`).

## [4.11.0] - 2026-03-30

### Changed
- 帮助深链：地址栏 `#fan-<注册表ID>`（及既有 `-popover`/`-modal` 后缀）自动打开
  帮助、清空该侧搜索过滤、展开并滚动到对应释义；实现见 `installHelpFanHashNavigation`
  (`public/helpFanHash.js`, `public/app.js`, `public/appEventWiring.js`,
  `tests/unit/helpContentMountFilter.test.js`).

- 番种释义：增加名称搜索过滤；每条释义 `details` 带稳定锚点
  `id="fan-<注册表ID>-popover|modal"`（双端各一份，避免重复 id），并
  `data-fan-registry-id`
  (`public/index.html`, `public/helpContentMount.js`,
  `public/styles-components.css`, `tests/unit/helpContentMountFilter.test.js`,
  `tests/unit/indexStylesheetLinks.test.js`).

- `package.json`：`test:unit` / `test:regression` / `test:integration` 的 glob
  加引号交由 Node 解析，修复 POSIX `sh` 下未跑全各层测试文件的问题；同步修正
  `indexStylesheetLinks` 多行「帮助」按钮断言与 `appEventWiring` 桌面帮助
  关闭用例中缺失的 `helpPopoverCloseBtn` mock
  (`package.json`, `tests/unit/indexStylesheetLinks.test.js`,
  `tests/unit/appEventWiring.test.js`).

- 帮助内容升级为中文详版：新增程序目的、推荐步骤、番/起和/不计说明；
  用单模板挂载到 `#helpPopover` 与 `#helpModal`，并从静态 lexicon
  注入番种折叠释义列表，减少双端文案漂移
  (`public/index.html`, `public/helpContentMount.js`, `public/app.js`,
  `public/styles-components.css`, `tests/unit/indexStylesheetLinks.test.js`).

## [4.10.0] - 2026-03-28

Desktop ≥1024px: hand-first workspace with inline tile picker, compact wizard
rail, and alternate 和牌条件 controls (select + number inputs). Mobile keeps
bottom-sheet picker and existing radios/steppers. Includes shell grid fix so
the version line, **当前手牌**, and step hints stay top-aligned under the header.

### Added
- **Inline tile picker (desktop):** `#desktopPickerHost` after **当前手牌**
  holds the picker sheet (no bottom-sheet picker on wide viewports).
  `desktopPickerMount.js` moves `#pickerModal > .sheet` at the `1024px`
  breakpoint; `setModalOpen` syncs host `hidden` when
  `#pickerModal.desktop-inline-picker` (`public/index.html`, `public/app.js`,
  `public/modalUi.js`, `public/styles-responsive.css`).
- **Desktop 和牌条件 dual UI:** Inside `.desktop-context-host`, **时机** uses
  `<select>`; 花牌 / 暗杠·明杠 use `type="number"` (mobile keeps HIG timing
  radios and steppers). Hidden inputs remain the source of truth;
  `syncContextDesktopMirrors` + `wireDesktopContextControls` in
  `public/contextWiring.js`; `resetContext` refreshes mirrors in
  `public/uiBindings.js`; `wireAppEvents` runs desktop wiring and an initial
  mirror sync (`public/appEventWiring.js`). Styles in `public/styles-modals.css`
  and `public/styles-responsive.css` (`.context-control-desktop` vs
  `.context-control-mobile` in the inline host).

### Fixed
- **Desktop shell vertical layout:** `align-content: start` on
  `.container.app-shell` so `min-height: 100vh` no longer stretches implicit
  grid rows (version badge, hand card, and right rail had appeared mid-viewport).
  User-confirmed (`public/styles-responsive.css`;
  `tests/unit/indexStylesheetLinks.test.js`).

### Changed
- **Version:** `package.json` / `src/config/appVersion.js` → **4.10.0** (build
  **1**).

### Tests
- `tests/unit/modalUi.test.js`, `tests/unit/desktopPickerMount.test.js`,
  `tests/unit/syncContextDesktopMirrors.test.js`, and
  `tests/unit/indexStylesheetLinks.test.js` (desktop markup/CSS assertions).

## [4.9.3] - 2026-03-28

### Fixed
- Desktop ≥1024px: clear `sticky-footer` centering from the 760px rules
  (`left` / `transform` / `max-width`) so the right rail sits in the grid
  column and no longer overlaps the hand card or covers tile slots
  (`public/styles-responsive.css`).
- Desktop hand preview: seven-column grid (two rows of seven slots) and
  flexible chip sizing (`public/styles-responsive.css`).

### Changed
- Desktop snapshot UX: step 1 hides inline 和牌条件 rail (`desktop-step-1`) and
  **重置条件** until step 2; help at ≥1024px uses anchored `#helpPopover`
  instead of full-screen `#helpModal`; help copy clarifies that conditions can
  be adjusted before scoring (`public/index.html`, `public/styles-responsive.css`,
  `public/homeStateView.js`, `public/appRefs.js`, `public/appEventWiring.js`,
  `public/appModalActions.js`, `public/app.js`).
- `openModalByKey` runs optional `onBeforeOpenModal` so opening picker/result
  dismisses the desktop help popover and resets `aria-expanded` on **帮助**
  (`public/appModalActions.js`, `public/app.js`).

## [4.9.2] - 2026-03-27

### Notes
- Tag recorded; no separate changelog entry (patch cadence).

## [4.9.1] - 2026-03-27

### Notes
- Tag recorded; no separate changelog entry (patch cadence).

## [4.9.0] - 2026-03-27

### Notes
- Tag recorded; no separate changelog entry (patch cadence).

## [4.8.0] - 2026-03-23

### Notes
- Tag recorded; no separate changelog entry.

## [4.7.0] - 2026-03-22

### Summary
Post-holistic UI polish release: context sheet, result modal, fan lexicon data,
splash, and test/deps alignment. **Does not** ship a standalone result
**和牌型** row (`#resultWinPattern`); and牌类型 stays in `explanation` text
(`src/llm/explainer.js`).

### Added
- Per-registry fan lexicon map (`src/config/fanLexiconEntries.js`) with
  Guobiao-oriented summaries; `getFanLexiconText` reads from it
  (`src/config/fanLexicon.js`).
- Stricter `fanLexicon` unit tests (`tests/unit/fanLexicon.test.js`): every
  `FAN_REGISTRY` id returns non-placeholder copy (no `释义待补`).

### Changed
- Context modal: removed preset shortcut cards; timing rows use HIG-style
  trailing checkmark; primary **应用** in sticky footer with scrollable body
  (`public/index.html`, `public/styles-modals.css`).
- Result modal: removed info modal, `modal.info`, and **详细解释** flow;
  row-level ℹ️ remains the detail path (`public/index.html`, `public/appRefs.js`,
  `public/appModalActions.js`, `public/appEventBindings.js`,
  `public/appEventWiring.js`, `src/app/uiFlowState.js`,
  `public/resultStateActions.js`, `public/resultModalView.js`).
- Dropped `CONTEXT_PRESETS`, `bindPresetButtons`, and preset handlers from
  wiring (`public/uiConfig.js`, `public/uiBindings.js`, `public/app.js`,
  `public/handContextActions.js`).
- Splash: refined gradient, glass card, decorative motif, typography
  (`public/index.html`, `public/styles-components.css`).
- `src/app/resultViewModel.js`: view-model copy for result modal only (info
  modal removed from JSDoc intent).
- `package.json` / `src/config/appVersion.js`: version **4.7.0**.

### Removed
- Standalone **和牌型** UI (`#resultWinPattern`) and divider under total fan
  (avoid duplication with bottom `explanation`; `winPatternText` kept on VM for
  tests) (`public/index.html`, `public/appRefs.js`,
  `public/resultModalView.js`).

### Tests
- `tests/unit/appStateActions.test.js`: `createStateActions` stubs without
  `contextPresets` / `renderInfoTip` / `infoRefs`.

## [4.6.0] - 2026-03-22

### Added
- Cold-start splash with brand, value props, and version
  (`public/index.html`, `public/styles-components.css`, `public/app.js`).
- Static fan lexicon and per-fan detail text on the result view model
  (`src/config/fanLexicon.js`, `src/app/resultViewModel.js`).
- Row-level ℹ️ control on result and info fan lists with ≥44px hit target
  (`public/resultModalView.js`, `public/styles-components.css`).

### Changed
- **花牌 / 杠**: `flowerCount` 0–8 and `kongSummary` (an+ming ≤ 4) validated;
  `HUA_PAI` fan equals flower count; scoring requests send `kongType: "none"`
  plus stepper values (`src/contracts/structuredContextValidator.js`,
  `src/rules/fanDetectors.js`, `public/resultStateActions.js`).
- 和牌条件 modal: grouped layout, flower and kong steppers, timing list
  including 抢杠和, primary-style apply button (`public/index.html`,
  `public/contextWiring.js`, `public/uiBindings.js`, `public/styles-modals.css`,
  `public/handContextActions.js`, `public/homeStateView.js`).
- Auto-advance wizard to step 2 when 14 tiles are filled (disable via
  `localStorage` key `hlm_disableAutoWizardAdvance=1`)
  (`public/handPickerActions.js`, `public/app.js`).
- 「更多」button labeled as reset session context (`public/index.html`).
- Result sheet: sticky summary header and scrollable body
  (`public/index.html`, `public/styles-modals.css`).

## [4.5.6] - 2026-03-19
### Fixed
- Deploy script: use stdio inherit for git clone/pull/push so output and
  prompts appear in terminal; unset GIT_ASKPASS for network operations to
  avoid Cursor credential helper blocking (`scripts/deployPublish.js`).

## [4.5.0] - 2026-03-19

### Changed
- Removed Linux from CI and deploy: workflows use macOS/Windows only;
  deploy docs and tests updated.

## [4.4.1] - 2026-03-19

### Changed
- Deploy follows origin transport: SSH origin uses SSH deploy remote, HTTPS
  origin uses HTTPS deploy remote (`scripts/deployRemote.js`).
- Updated deploy docs for transport-follow behavior
  (`README.md`, `RELEASE_AND_PUBLISH.md`).
- Updated deploy runtime tests for transport-follow behavior
  (`tests/unit/deployRuntime.test.js`).

### Fixed
- Deploy to empty repo: use `checkout -b main` when remote has no commits
  (`scripts/deployPublish.js`).

### Changed
- Context menu visual and layout: vertical single-column layout, Material
  elevation 8dp shadow, positioned near clicked tile
  (`public/styles-components.css`, `public/tileContextMenuController.js`,
  `public/uiRenderers.js`, `public/pickerRenderFlow.js`).

### Added
- Unit tests for openTileContextMenu(tile, event) and event fallback
  (`tests/unit/tileContextMenuController.test.js`).

## [4.4.0] - 2026-03-18

### Changed
- Tile context menu now floats as overlay (position: fixed) instead of
  occupying layout space; closed menu takes no space between tabs and grid
  (`public/styles-components.css`).
- Exposed closeTileContextMenu; picker modal close now clears menu listeners
  to prevent leak (`public/tileContextMenuController.js`,
  `public/handStateActions.js`, `public/appModalActions.js`, `public/app.js`).

### Added
- `pickTileWithAction(baseTile, actionId)` for tile-click context menu
  (Phase 1 of tile-click context menu track)
  (`public/handPickerActions.js`, `tests/unit/tileContextMenu.test.js`).
- Tile-click context menu: click tile in grid opens popup with single/pair/
  pung/chow options; impossible options hidden by remaining slots (Phase 2)
  (`public/tileContextMenuController.js`, `public/index.html`,
  `public/handStateActions.js`, `public/pickerRenderFlow.js`,
  `public/styles-components.css`).
- Removed persistent pattern-action buttons and pickerActionHint (Phase 3)
  (`public/index.html`, `public/homeStateView.js`, `public/appEventWiring.js`,
  `public/appStateActions.js`, `public/app.js`, `public/appRefs.js`,
  `public/uiRenderers.js`, `public/styles-components.css`).
- Phase 4: Long-press lock removed (simplest flow); slot-tap editingIndex
  verified; added unit test for editingIndex in pickTileWithAction.

## [4.3.2] - 2026-03-18

### Fixed
- Step 2 "下一步：计算番数" now directly shows result modal instead of
  advancing to step 3 UI (`public/appEventWiring.js`).

### Changed
- Wizard simplified to 2 steps; removed step 3 and calculateBtn
  (`public/homeStateView.js`, `public/appEventWiring.js`, `public/appRefs.js`,
  `public/index.html`, `src/app/uiFlowState.js`).

## [4.3.1] - 2026-03-18

## [4.3.0] - 2026-03-18

### Changed
- Updated deploy-remote resolution to follow detected `origin` transport
  first (HTTPS origin -> HTTPS deploy remote, SSH origin -> SSH deploy
  remote), with platform defaults only as fallback
  (`scripts/deployRemote.js`).
- Updated deploy runtime unit coverage for transport-follow behavior and
  deterministic fallback mocking (`tests/unit/deployRuntime.test.js`).
- Updated release runbook troubleshooting to document macOS HTTPS fallback
  guidance for shells without SSH keys (`RELEASE_AND_PUBLISH.md`).
- Added deploy `doctor` mode and `release:doctor` command for non-mutating
  remote diagnostics and preflight checks (`scripts/deploy.js`, `package.json`).
- Added release `--dry-run` mode to preview version summary and preflight
  without file writes or remote push (`scripts/deploy.js`).
- Added deploy transport mismatch warning and auth-aware preflight hints for
  SSH/HTTPS failure modes (`scripts/deployRemote.js`, `scripts/deployRuntime.js`).
- Extended deploy CLI/runtime tests for doctor mode, dry-run behavior,
  mismatch warnings, and protocol-specific preflight guidance
  (`tests/unit/deployCli.release.core.test.js`,
  `tests/unit/deployCli.prompts.test.js`,
  `tests/unit/deployRuntime.test.js`).
- Added cross-platform deploy safety CI matrix for macOS/Windows
  deploy-focused checks (`.github/workflows/deploy-safety-matrix.yml`).

## [4.2.2] - 2026-03-18

## [4.2.1] - 2026-03-18

### Changed
- UI cleanup and step 1 fix: flattened pattern row (1–2 clicks per group),
  removed slot context menu, picker-mode toggle, and 更多 dropdown
  (`public/index.html`, `public/contextWiring.js`, `public/appEventWiring.js`).
- Moved 清空 to direct button in picker footer and home screen at step 1
  (`public/index.html`, `public/homeStateView.js`, `public/appRefs.js`).
- Step 1 contextSummary shows "—" until conditions are set at step 2
  (`public/homeStateView.js`).
- Picker mode always twoLayer; removed getContextMenuAvailability,
  undoSelectedSlot, contextMenuView, contextMenuPosition
  (`public/handPickerActions.js`, `public/pickerModeState.js`).

### Removed
- Removed slot context menu, contextMenuView.js, contextMenuPosition.js.
- Removed picker-mode-toggle, pickerGestureTip, openContextBtn, clearBtn refs.

## [4.2.0] - 2026-03-17

## [4.1.0] - 2026-03-17

### Added
- Added tile-first picker mode controls with two-layer (`分类`) and flat
  (`平铺34张`) entry options in hand-input modal
  (`public/index.html`, `public/styles-components.css`).
- Added picker mode policy and persistence helpers for mobile-default
  two-layer and desktop preference restore
  (`public/pickerModeState.js`, `public/handContextActions.js`).
- Added dynamic context-menu availability rendering utilities and slot-undo
  state helpers (`public/contextMenuView.js`, `public/contextWiring.js`).
- Added focused unit coverage for context wiring/state helpers
  (`tests/unit/contextWiring.test.js`).

### Changed
- Changed hand-input workflow to tile-first interaction with state-driven
  picker rendering and event bindings split into smaller modules
  (`public/appEventWiring.js`, `public/appEventBindings.js`,
  `public/pickerRenderFlow.js`, `public/pickerModeView.js`).
- Changed app state action composition to modular hand/context/result
  cooperators while preserving behavior (`public/appStateActions.js`,
  `public/handStateActions.js`, `public/handPickerActions.js`,
  `public/handContextActions.js`, `public/resultStateActions.js`,
  `public/homeStateView.js`).
- Changed pattern-action legality to expose deterministic context-menu
  availability by remaining-slot and tile constraints
  (`src/app/tilePatternActions.js`).
- Changed top hand area readability and picker workflow clarity for mobile
  and desktop (`public/styles-components.css`, `public/index.html`).

## [4.0.0] - 2026-03-17

### Added
- Added full MCR fan registry coverage (81 official fan items) with stable
  internal IDs, official fan values, and Chinese display names
  (`src/rules/fanRegistry.js`).
- Added modular detector architecture for context/pattern/feature fan rules
  (`src/rules/detectors/contextDetectors.js`,
  `src/rules/detectors/patternDetectors.js`,
  `src/rules/detectors/featureDetectors.js`).
- Added expanded hand-feature extraction for advanced MCR structures and
  composition checks (`src/rules/handFeatures.js`).
- Added dedicated structured context validator module and unit tests for
  optional context-field contract checks
  (`src/contracts/structuredContextValidator.js`,
  `tests/unit/structuredContextValidator.test.js`).
- Added unit coverage for full fan registry integrity and modular fan-catalog
  structure (`tests/unit/fanRegistry.test.js`,
  `tests/unit/fanCatalog.structure.test.js`).
- Added explainer unit coverage for Chinese fan naming and pattern wording
  (`tests/unit/explainer.test.js`).

### Changed
- Changed fan detection pipeline to registry-backed modular composition while
  preserving deterministic scoring flow (`src/rules/fanCatalog.js`,
  `src/rules/scoringEngine.js`).
- Changed conflict resolution to explicit MCR exclusion/precedence behavior
  with wider interaction coverage (`src/rules/conflictResolver.js`).
- Changed user-facing fan terminology mapping to canonical registry-driven
  Chinese names in result and explanation layers
  (`src/app/resultViewModel.js`, `src/llm/explainer.js`).
- Changed hand-state input validation to enforce structured optional context
  semantics (enum bounds, boolean typing, numeric ranges, kong object shape)
  (`src/contracts/handState.js`,
  `src/contracts/structuredContextValidator.js`).
- Changed scoring-engine unit tests from one large file to themed modules for
  maintainability and guardrail compliance (`tests/unit/scoringEngine/*.test.js`).
- Changed regression and integration fixtures/expectations to reflect complete
  MCR fan detection and exclusion outcomes
  (`tests/regression/goldenCases.json`,
  `tests/integration/evaluateCapturedHand.test.js`,
  `tests/integration/stability.test.js`).

## [3.1.3] - 2026-03-16

### Added
- Added smart undo in slot context menu: 撤销最近一次 (rolls back last
  action/group) and 撤销当前槽位 (rolls back action affecting selected slot)
  (`public/index.html`, `public/appEventWiring.js`, `src/app/tilePickerState.js`).
- Added action history and `addTilesToPicker`, `undoLastAction`, `undoBySlot`
  in tile picker state (`src/app/tilePickerState.js`).
- Added unit tests for menu routing and smart undo
  (`tests/unit/appEventWiring.test.js`, `tests/unit/tilePickerState.test.js`,
  `tests/unit/appStateActions.test.js`).

### Changed
- Fixed slot context menu cascade: parent items (tab buttons) no longer jump
  to picker modal; only leaf actions open picker (`public/appEventWiring.js`,
  `public/index.html`).
- Changed footer from fixed to sticky to reduce mid-screen whitespace
  (`public/styles-base.css`).
- Enlarged tile display for readability: tile-chip 52px, tile-face-unicode 2em
  (`public/styles-components.css`).
- Reduced container bottom padding (`public/styles-base.css`).

## [3.1.2] - 2026-03-16

### Added
- Added release CLI support for explicit `--skip-tests` fast-path deploys
  when tests were already verified (`scripts/deploy.js`).
- Added unit coverage for `--skip-tests` behavior in release CLI sandbox
  flow (`tests/unit/deployCli.release.core.test.js`).
- Added win decomposition output (`meldGroups`) for standard, seven-pairs,
  and thirteen-orphans paths (`src/rules/winValidator.js`,
  `src/rules/scoringEngine.js`).
- Added grouped hand rows in result modal for better mobile readability
  (`public/resultModalView.js`, `public/index.html`,
  `public/styles-components.css`, `public/appRefs.js`).
- Added unit tests for meld-group output and view-model mapping
  (`tests/unit/winValidator.test.js`, `tests/unit/resultViewModel.test.js`).

### Changed
- Updated deploy usage/help text to include `--skip-tests`
  (`src/config/deployPrompts.js`).
- Updated release runbook with default-safe behavior and explicit
  `--skip-tests` guidance (`RELEASE_AND_PUBLISH.md`).

## [3.1.0] - 2026-03-16

### Added
- Added Unicode Mahjong tile display (U+1F000–U+1F021) with text/SVG
  fallback (`public/tileAssets.js` getTileUnicode).
- Added slot-tap context menu for hand entry: 单张, 对子, 刻子, 顺子,
  suit tabs (万/条/筒/字牌) with cascade to picker.
- Added card-style preset buttons and segmented controls for winning
  conditions (和牌方式, 门前/副露, 杠, 时机).
- Added full fan breakdown and inline explanation in result modal.
- Added app icons with Chinese/Mahjong aesthetic (traditional, minimal,
  seal, desk, badge variants) and canonical favicon/app icon files
  (`public/favicon*.svg`, `public/icon-app*.svg`).
- Added Apple Touch Icon (PNG) for iPhone PWA home screen clarity
  (`public/apple-touch-icon.png`, `public/apple-touch-icon.svg`).
- Added unit tests for icon assets, linking, and canonical mirroring
  (`tests/unit/indexStylesheetLinks.test.js`).
- Added unit tests for getTileUnicode (`tests/unit/tileAssets.test.js`).

### Changed
- Changed tile preview to 4x4 grid with 44px touch targets.
- Replaced winning-condition selects with radio-style segmented controls.
- Result modal now shows all matched fans and explanation inline;
  "详细解释" opens Info for excluded fans.
- Removed "和了番数" title from header.
- Updated `index.html` to link favicon and apple-touch-icon to
  traditional-style assets and PNG touch icon.

## [3.0.3] - 2026-03-16

### Changed
- Reduced duplicated event wiring by collapsing modal close-handler
  bindings into one loop and removing unused parameter plumbing
  (`public/appEventWiring.js`, `public/app.js`).
- Clarified Option B artifact policy in docs: `public/` remains source,
  `dist/` is generated deploy output (`README.md`).
- Added local project ignore rules to keep generated artifacts out of
  version control (`.gitignore`).
- Wrapped previously long lines to satisfy quality guardrails
  (`public/tileAssets.js`, `src/app/tilePatternActions.js`,
  `src/config/deployWorkflow.js`).

### Removed
- Removed unused request-builder helper from UI bindings
  (`public/uiBindings.js`).

## [3.0.2] - 2026-03-16

### Added
- Added runtime artifact build script to publish only `index.html`,
  `public/`, and `src/` through `dist/` (`scripts/buildDist.js`,
  `package.json`, `.github/workflows/deploy-pages.yml`).
- Added GitHub Actions security workflow to run secret scanning on
  `push` and `pull_request` (`.github/workflows/security-scan.yml`).
- Added unit tests for dist artifact builder path
  (`tests/unit/buildDist.test.js`).

### Changed
- Switched Pages deploy workflow from publishing repo root (`.`) to
  publishing runtime-only `dist/` artifact after `npm test`.
- Replaced account-specific test fixtures with neutral placeholders in
  deploy runtime tests (`tests/unit/deployRuntime.test.js`).
- Updated deployment docs to reflect `dist/` artifact publishing and
  security-scan verification (`README.md`, `RELEASE_AND_PUBLISH.md`,
  `DEPLOY_TO_GITHUB_MERMAID.md`).

### Removed
- Removed unused app-layer result renderer module and its audit-only
  unit test (`src/app/resultRenderer.js`,
  `tests/unit/resultRenderer.test.js`).
- Removed unused recognition-normalization helper modules and their
  dedicated unit test (`src/app/recognitionHelpers.js`,
  `src/app/recognitionNormalizer.js`,
  `tests/unit/recognitionNormalizer.test.js`).

## [3.0.1] - 2026-03-16

### Changed
- Hardened deploy defaults to avoid account-specific public identifiers:
  default Git remotes now auto-detect from local origin, with
  `owner/repo` fallback and `HLM_DEPLOY_REPO` override support
  (`scripts/deployRemote.js`).
- Improved monorepo deploy-target inference by combining origin owner
  with `npm_package_name` when available (e.g., `owner/hlm`).
- Replaced hardcoded deploy commit email default with neutral
  `hlm-release@local.invalid` and aligned repo safety checks with
  env-configurable expected repo (`scripts/deployPublish.js`).
- Updated deployment docs/examples to use placeholder repo/site values
  instead of account-specific URLs (`README.md`,
  `RELEASE_AND_PUBLISH.md`, `DEPLOY_TO_GITHUB_MERMAID.md`).

### Added
- Added unit coverage for expected-repo resolution and env-driven default
  remote generation (`tests/unit/deployRuntime.test.js`).

## [3.0.0] - 2026-03-16

### Changed (2026-03-16)
- Retired the photo/VLM spike surface and kept manual input as the only
  supported scoring path.
- Moved shared tile-code catalog/encoding utilities from `src/spike/vlm` to
  `src/tiles` and updated manual input to use the new location.
- Removed spike npm scripts and dropped `test:spike` from default `npm test`.

### Removed (2026-03-16)
- Removed retired VLM spike scripts, modules, and `tests/spike` assets.
- Removed unused `src/vision` modules and their dedicated unit tests.

## [2.0.7] - 2026-03-15

### Added
- Added root landing page `index.html` that redirects to
  `public/index.html` for GitHub Pages project-site routing.

### Changed
- Updated Pages Actions artifact upload path from `public/` to project root
  (`.`) so `public/` and `src/` are both available at runtime and browser
  module imports resolve correctly on `/hlm` URL base.

## [2.0.6] - 2026-03-15

### Added
- Added GitHub Pages deployment workflow to publish the `public/` directory
  from `main` via Actions (`.github/workflows/deploy-pages.yml`).

### Changed
- Updated README demo/deploy notes to document the GitHub Pages URL and
  Actions-based publishing source (`README.md`).

## [2.0.5] - 2026-03-15

### Added
- Added origin-remote sync helper to detect same-repository URL format
  differences (HTTPS vs SSH) before pull (`scripts/deployRuntime.js`).
- Added unit coverage for origin-remote sync behavior across matching,
  identical, and mismatched repositories (`tests/unit/deployRuntime.test.js`).

### Changed
- Updated deploy checkout flow to auto-sync `origin` URL when the remote points
  to the expected repository but uses a different URL format, then continue
  `pull --ff-only` (`scripts/deployRuntime.js`).
- Updated app-version baseline test to read `package.json` dynamically so
  `APP_VERSION` and display-version assertions always track release bumps
  (`tests/unit/appVersion.test.js`).
- Bumped runtime/package version baseline from `2.0.2` to `2.0.5`
  (`src/config/appVersion.js`, `package.json`).

## [2.0.4] - 2026-03-15

## [2.0.3] - 2026-03-15

## [2.0.2] - 2026-03-15

## [2.0.1] - 2026-03-12

## [2.0.0] - 2026-03-12

### Added
- Added structured source-comment coverage test for modular stylesheet links in `index.html` (`tests/unit/indexStylesheetLinks.test.js`).
- Added recognition-normalization helper module to split confirmation-map and tile-code derivation logic (`src/app/recognitionHelpers.js`).
- Added tile catalog module to centralize canonical tile constants, aliases, labels, and lookup maps (`src/spike/vlm/tileCatalog.js`).
- Added tile encoding module to isolate tile-id and uncertain-mask encode/decode helpers (`src/spike/vlm/tileEncoding.js`).
- Added dedicated unit tests for recognition-normalization behavior (`tests/unit/recognitionNormalizer.test.js`).
- Added modular public stylesheet files (`public/styles-base.css`, `public/styles-components.css`, `public/styles-modals.css`, `public/styles-responsive.css`).

### Changed
- Applied Goja-aligned commenting rules across HLM source/public files: module `Purpose`/`Description` headers, function JSDoc for non-trivial logic, and concise rationale comments in HTML/CSS.
- Refactored recognition normalization flow into smaller cooperating helpers while preserving behavior (`src/app/recognitionNormalizer.js`).
- Refactored tile-code utilities into catalog/encoding cooperation while keeping `tileCodes` API compatibility (`src/spike/vlm/tileCodes.js`).
- Updated `index.html` to load split CSS modules in deterministic order and removed the previous monolithic stylesheet (`public/index.html`, removed `public/styles.css`).

### Validation
- Verified static guardrails after each refactor pass with `npm run quality:complexity`.
- Verified full test matrix passes (`npm test`: unit + spike + regression + integration).
- Verified per-file SLOC reductions with `cloc --by-file`, including `src/app/recognitionNormalizer.js` and `src/spike/vlm/tileCodes.js` now below 100 code lines.


## [1.2.0] - 2026-03-10

### Added
- Added deploy workflow utility module with pure functions for release-token normalization, changelog archiving, and app-version parsing/updating (`src/config/deployWorkflow.js`).
- Added deploy prompt constants module to centralize embedded changelog/agent templates and CLI usage text (`src/config/deployPrompts.js`).
- Added deploy runtime helper module to isolate process execution and interactive input handling (`scripts/deployRuntime.js`).
- Added deploy orchestration helper module to split prompt handling, mode resolution, mode assertion, and release-state writes (`scripts/deployHandlers.js`).
- Added reusable deploy sandbox helper for unit tests (`tests/helpers/deploySandbox.js`).
- Added split deploy CLI test suites for prompt output and release flow (`tests/unit/deployCli.prompts.test.js`, `tests/unit/deployCli.release.core.test.js`, `tests/unit/deployCli.release.bump.test.js`).
- Added unit tests for deploy workflow pure functions (`tests/unit/deployWorkflow.test.js`).

### Changed
- Refactored deploy entry script into thin orchestration with delegated modules, reducing single-file size and mixed responsibilities (`scripts/deploy.js`).
- Updated app version baseline test expectation to current runtime version `1.1.1` (`tests/unit/appVersion.test.js`).
- Replaced monolithic deploy CLI test file with modular test structure while preserving coverage (`tests/unit/deployCli.test.js` -> split files above).


## [1.1.1] - 2026-03-10

### Added
- Added regression test to ensure changelog release archiving works for `CRLF` files (`tests/unit/deployCli.test.js`).

### Changed
- Fixed deploy changelog archiving logic to normalize line endings before parsing, so released changes are moved correctly from `[Unreleased]` (`scripts/deploy.js`).
- Synced app version baseline test with current runtime `1.1.0` (`tests/unit/appVersion.test.js`).

## [1.1.0] - 2026-03-10

### Added
- Added deploy CLI prompt-template modes for AI-assisted changelog workflow: `prompt-update` and `prompt-release` (`scripts/deploy.js`).
- Added unit tests for embedded prompt-template output modes (`tests/unit/deployCli.test.js`).
- Added `prompt-all` mode to print both changelog prompt templates in a single output (`scripts/deploy.js`).
- Added agent-pipeline prompt modes to print Cursor Agent command lines: `prompt-update-agent` and `prompt-release-agent` (`scripts/deploy.js`).
- Added deploy safety-gate tests that verify no file mutation happens without explicit `--confirm` (`tests/unit/deployCli.test.js`).
- Added intuitive npm shortcut commands for release flow and prompt workflow (`package.json`).
- Added single-entry interactive release command `npm run release` with mode selection and explicit `yes` confirmation (`scripts/deploy.js`, `package.json`).
- Added numeric release shortcuts (`1/2/3/4`) support for interactive and inline release entry (`scripts/deploy.js`).

### Changed
- Expanded deploy invalid-usage help text to include prompt-template modes (`scripts/deploy.js`).
- Updated app version baseline test to match current `1.0.0` runtime (`tests/unit/appVersion.test.js`).
- Changed deploy release/build flow to run `npm test` before mutation and require `--confirm` for write actions (`scripts/deploy.js`).
- Documented shortcut commands in README to reduce memory burden and improve day-to-day usability (`README.md`).
- Extended deploy CLI tests to cover interactive release flow (`tests/unit/deployCli.test.js`).
- Updated README examples to include numeric release shortcuts for simpler daily usage (`README.md`).
## [1.0.0] - 2026-03-10

### Added
- Added deploy CLI integration tests in sandbox mode to validate end-to-end behavior without mutating workspace files (`tests/unit/deployCli.test.js`).
- Added deploy CLI coverage for all core modes: invalid mode usage, `build`, `patch`, `minor`, and `major` output/state transitions (`tests/unit/deployCli.test.js`).
- Added deploy summary formatter to produce concise Chinese CLI output for version upgrades (`src/config/versioning.js`).

### Changed
- Standardized deploy command usage text to `npm run deploy -- major|minor|patch|build` across CLI and docs (`scripts/deploy.js`, `README.md`).
- Improved semver input validation to reject malformed versions before upgrade execution (`src/config/versioning.js`).
- Switched deploy success output from JSON blob to Chinese summary lines for readability (`scripts/deploy.js`).
- Updated UI Chinese terminology in user-facing text to use standardized wording and full event names (`public/index.html`, `public/app.js`).
- Synced app version baseline unit test expectations with the runtime version used in this release cycle (`tests/unit/appVersion.test.js`).


## [0.4.0] - 2026-03-09

### Added
- Added manual tile input normalization/validation module (`src/app/manualTileInput.js`) with 14-slot strict checks, canonical code normalization, and slot-level error reporting.
- Added unit tests for manual tile input helpers (`tests/unit/manualTileInput.test.js`).
- Added result view-model mapping module (`src/app/resultViewModel.js`) to convert internal status/winPattern/fan IDs into Chinese UI labels.
- Added dedicated UI result renderer module (`src/app/resultRenderer.js`) to render structured result cards and collapsible debug details.
- Added unit tests for result view-model mapping behavior (`tests/unit/resultViewModel.test.js`).

### Changed
- Replaced app-layer evaluation primary path to manual-first input (`tiles + context`) in `src/app/evaluateCapturedHand.js`, including deterministic statuses (`manual_ready`, `manual_invalid`) and direct scoring boundary behavior.
- Rebuilt public demo UI to manual-grid-only workflow with 14 tile slots, 4 context selectors, explicit error panel, and deterministic result rendering (`public/index.html`, `public/app.js`, `public/styles.css`).
- Updated integration tests for manual boundary and deterministic behavior (`tests/integration/evaluateCapturedHand.test.js`, `tests/integration/stability.test.js`).
- Updated README scope/demo description to manual-first usage as the primary user path.
- Lowered Guobiao minimum winning fan gate from `8` to `1` in `src/config/ruleBaseline.js` so valid winning hands with at least one fan are treated as wins.
- Updated scoring baseline tests and regression fixtures to reflect the new minimum-fan behavior (`tests/unit/ruleBaseline.test.js`, `tests/unit/scoringEngine.test.js`, `tests/regression/goldenCases.json`, `tests/integration/evaluateCapturedHand.test.js`).
- Synced app version baseline expectations in `tests/unit/appVersion.test.js` with the current `0.3.0` runtime version.
- Replaced plain-text/JSON-first result output with structured UI sections (status badge, summary cards, fan lists, explanation, collapsible JSON debug) in `public/index.html`, `public/app.js`, and `public/styles.css`.
- Localized context selector labels/options to Chinese display text while keeping internal enum values unchanged for scoring compatibility.

## [0.2.0] - 2026-02-27

### Added
- Added `npm run spike:repeat` to execute repeated spike trials (`spike:auto` + `spike:fill-eval`) and emit cross-run statistics.
- Added repeat-trial metrics utilities (`computeEvalMetricsFromCsvText`, `summarizeTrials`) for mean/std/min/max aggregation across runs.
- Added spike tests for repeat-trial metric extraction and statistical aggregation behavior.
- Added repeat-run reporting output (`repeat_stats*.json`) support for controlled single-variable A/B tuning workflows.

### Changed
- Added promotion-gate evaluation workflow for spike tuning: `avgTileSet >= 0.35`, `avgTbRecall >= 0.30`, and `apiFailRate = 0`.
- Ran controlled A/B tuning on `VLM_VOTE_PASSES` (`1` vs `3`) and recorded decision criteria from repeated-trial metrics.
- Kept `VLM_VOTE_PASSES=1` as the current baseline after quick `VLM_VOTE_PASSES=3` validation showed unstable API success in this environment.

## [0.1.0] - 2026-02-27

### Added
- Established product naming baseline for `胡了么 - 国标麻将计番助手` / `Huleme - Guobiao Mahjong Fan Calculator`.
- Implemented rule baseline and data contract enforcement with `NEED_CONTEXT` handling.
- Added core scoring pipeline (`WinValidator`, `FanDetectors`, `ConflictResolver`, `ScoreAggregator`).
- Added vision V1 flow with multi-frame fusion, confidence gate, and human-confirm fallback.
- Added end-to-end evaluation flow with explanation output and replay log payload.
- Added unit, regression, and integration test suites plus a performance smoke script.
- Added deploy version workflow: `npm run deploy -- build|patch|minor|major`.
- Added DeepSeek VLM spike modules, standalone CLI entry, and spike-specific tests.
- Added first 10-sample capture checklist and CSV evaluation template for spike validation.
- Added batch spike runner (`npm run spike:batch`) to process image folders and emit JSON results with summary stats.
- Added `npm run spike:fill-eval` to auto-fill evaluation CSV key columns from spike result JSON files.
- Added `npm run spike:summary` to generate `tests/spike/results/summary.json` plus console metrics.
- Added `npm run spike:auto` one-command orchestrator (`batch -> fill-eval -> summary`) with upfront credential/provider checks.
- Enhanced step scripts with optional path parameters, default result cleanup for `spike:batch`, and `--keep-old` override.
- Scoped summary statistics to sample IDs from the current image directory rather than all historical JSON files.
