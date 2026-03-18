---
name: hlm-mobile-menu-undo-spacing
overview: 修复移动端首页留白、修正槽位菜单级联误跳转到独立 picker modal 的问题，并新增一级菜单中的智能撤销（最近一次 + 按槽位撤销），按 TDD 分阶段落地并通过全量测试与复杂度/SLOC 检查。
todos:
  - id: tdd-menu-routing
    content: 先写菜单级联事件测试，锁定 parent 不跳 modal、leaf 才跳 modal
    status: completed
  - id: tdd-smart-undo
    content: 先写智能撤销测试，覆盖最近一次撤销与按槽位撤销
    status: completed
  - id: impl-picker-history
    content: 在 tilePickerState 引入轻量历史并实现 undoLastAction/undoBySlot
    status: completed
  - id: impl-menu-actions
    content: 在 slotContextMenu 增加撤销项并改造事件分流
    status: completed
  - id: impl-layout-readability
    content: 将 footer 改 sticky 并增大牌面显示尺寸
    status: completed
  - id: full-gates
    content: 跑 unit/regression/integration/full/complexity 与 cloc 校验
    status: completed
isProject: false
---

# HLM 移动端菜单与留白修复计划

## 目标

- 解决首页大面积留白，提升首屏信息密度与可读性。
- 修复槽位菜单级联：父级菜单不应直接跳转 `picker` modal。
- 在一级槽位菜单加入“智能撤销”：
  - 撤销最近一次操作（支持单张/组合）
  - 按当前槽位撤销（优先撤销与该槽位关联的最近写入）

## 关键现状证据

- 在 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/appEventWiring.js](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/appEventWiring.js)` 中，`slotContextMenu` 点击后存在无条件 `openModalByKey("picker")`，导致父级点击也跳 modal。
- 在 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/styles-base.css](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/styles-base.css)` 中，`.sticky-footer` 为 `fixed`，且 `.container` 固定 `padding-bottom: 92px`，会放大中下部留白。
- 手牌块在 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/styles-components.css](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/styles-components.css)` 的 `.tile-chip` 与 `.tile-face-unicode` 字号偏小，可读性不足。

## 设计决策

- 底部计算区改为 `sticky`（你已确认），回归文档流，减少断层留白。
- 菜单分层语义化：父级动作只展开/切换子层，叶子动作才允许打开 `picker` modal。
- 撤销采用双通道：
  - 全局撤销：基于操作历史栈回滚最后一次“写入动作”
  - 槽位撤销：根据当前 `editingIndex` 回滚最近一次触及该槽位的动作

## 实施步骤（TDD）

1. 先补失败测试（不改实现）
  - 扩展 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/tests/unit/appStateActions.test.js](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/tests/unit/appStateActions.test.js)`：
    - 组合写入后 `undoHand()` 一次应整体回滚该组合。
    - 选择槽位后触发“按槽位撤销”应回滚该槽位最近动作。
  - 新增/扩展菜单事件测试（建议新增 `tests/unit/appEventWiring.test.js`）：
    - 父级菜单点击不触发 `openModalByKey("picker")`。
    - 叶子菜单点击才触发 modal。
  - 扩展 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/tests/integration/mobilePickerFlow.test.js](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/tests/integration/mobilePickerFlow.test.js)`：
    - 槽位菜单链路可在不提前跳 modal 的情况下完成级联到叶子并选牌。
2. 实现智能撤销状态模型
  - 修改 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/src/app/tilePickerState.js](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/src/app/tilePickerState.js)`：
    - 为 state 增加轻量 history（仅记录必要 diff：动作类型、受影响槽位、旧值/新值）。
    - `addTileToPicker` 支持记录单张与组合写入边界（组合来自上层批量写入）。
    - 新增 `undoLastAction(state)` 与 `undoBySlot(state, slotIndex)`（或等价 API）。
  - 修改 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/appStateActions.js](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/appStateActions.js)`：
    - `pickTile` 将一次快捷动作视为一个事务（单张/对子/刻子/顺子）。
    - `undoHand` 对接全局撤销；新增 `undoSelectedSlot` 对接按槽位撤销。
3. 修复菜单级联逻辑（父级不跳 modal）
  - 修改 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/index.html](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/index.html)`：
    - 在 `#slotContextMenu` 增加一级“撤销最近一次”“撤销当前槽位”按钮。
    - 父级项增加显式语义标记（如 `data-menu-level="parent"`）。
  - 修改 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/appEventWiring.js](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/appEventWiring.js)`：
    - 将菜单点击处理拆分为 parent/leaf 两条路径。
    - 仅 leaf 路径执行 `renderTilePickerGrid + openModalByKey("picker")`。
    - 撤销按钮绑定到 `stateActions.undoHand()` / `stateActions.undoSelectedSlot()`。
4. 优化移动端留白与牌面可读性
  - 修改 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/styles-base.css](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/styles-base.css)`：
    - `.sticky-footer` 改 `position: sticky; bottom: 0`。
    - 重新平衡 `.container` 底部 padding，移除固定大预留。
  - 修改 `[/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/styles-components.css](/Users/luke/Documents/00_Mundo/02product/01_coding/project/hlm/public/styles-components.css)`：
    - 提升 `.tile-chip` 尺寸与 `.tile-face-unicode` 字号，确保一眼可读。
    - 控制触控目标 >= 44px，避免回归可点击性问题。
5. 收尾与验证
  - 更新相关文档（如需要）并确保不引入无关变更。
  - 运行质量门禁：
    - `npm run test:unit`
    - `npm run test:regression`
    - `npm run test:integration`
    - `npm test`
    - `npm run quality:complexity`
    - `cloc` 针对本次触达的 program files

## 风险与缓解

- 撤销历史实现过重：使用 diff 记录替代完整快照，限制历史长度。
- 菜单层级事件冲突：用 `data-menu-level` 明确分流，避免 `details/summary` 冒泡误触发。
- sticky 在个别机型兼容差异：保留安全区内边距并做最小回退样式。

