---
name: hlm-desktop-context-controls-dual-ui
overview: >
  Desktop-only alternate controls for 和牌条件 (select + number inputs) with
  full mobile retention of current radios/steppers; single hidden-field source
  of truth and bidirectional sync.
parent_plan: hlm_desktop_web_ui_ce34a47e.plan.md
master_plan: hlm-master-plan.plan.md
related: desktop_workspace_ui_76498db2.plan.md
status: completed
todos:
  - id: html-dual-markup
    content: >
      index.html add desktop-only blocks (timing select, flower/kong number
      inputs) + wrappers; hide via class or media-friendly pattern
    status: completed
  - id: wiring-sync
    content: >
      contextWiring.js extend wireContextSegmentedControls / steppers or
      new wireDesktopContextControls; sync hidden + labels + mobile/desktop
      pairs on change and resetContext
    status: completed
  - id: css-desktop-only
    content: >
      styles-responsive.css .desktop-context-host show/hide mobile vs desktop
      control rows; native select/number styling to match shell
    status: completed
  - id: tests-gates
    content: >
      Unit tests sync + indexStylesheetLinks; npm test quality:complexity cloc
    status: completed
  - id: changelog-master-evidence
    content: CHANGELOG Unreleased + master ValidationEvidence + plan status
    status: completed
isProject: false
---

# Desktop dual UI: 和牌条件控件（PC / Mac）

## Master / parent linkage

- **Master:** [hlm-master-plan.plan.md](hlm-master-plan.plan.md) — track
  `track-desktop-web-ui-help`.
- **Parent:** [hlm_desktop_web_ui_ce34a47e.plan.md](hlm_desktop_web_ui_ce34a47e.plan.md).
- **Layout prerequisite:** inline context in `.desktop-context-host`
  ([desktop_workspace_ui_76498db2.plan.md](desktop_workspace_ui_76498db2.plan.md)).

## Decision（用户确认）

采用 **桌面双套 UI**：**≥1024px 且在桌面上下文宿主内** 展示一套更适合键鼠的控件；
**&lt;1024px 或移动端主流程** 保留现有 **radio 列表 + 步进器**，不替换为全局单套。

## Goals

| 区块 | 移动端 / 窄屏（保持） | 桌面（新增显式控件） |
|------|----------------------|----------------------|
| 时机事件 | HIG 式 `radio` 列表 | **`<select>`**，选项与现值域一致：`none` / `haidi` / `hedi` / `gangshang` / `qianggang` |
| 花牌 | `−` / 数值 / `+` 步进器 | **`input type="number"`** `min=0` `max=8` `step=1` |
| 杠（暗/明） | 两组步进器 | 两个 **`number`**，`min=0` `max=4`，并强制 **暗杠+明杠 ≤ 4**（与现 `wireContextSteppers` 逻辑一致） |
| 和牌方式、门前/副露 | 分段 `radio` | **维持现有控件**（已较紧凑）；若后续要统一风格可再改为 `select`（低优先级） |

## 单一数据源

- 仍以现有 **`#timingEvent`、`#flowerCount`、`#kongAnCount`、`#kongMingCount`** 等 hidden
  及 `readContext` / 计分路径为真源。
- 桌面控件与移动端控件 **双向同步**：任一侧变更 → 更新 hidden + 刷新对侧 UI（含 `syncHomeState`）。
- **`resetContext`** 须同时重置两套可见控件（与 hidden 一致）。

## 实现要点

1. **HTML** [`public/index.html`](../../public/index.html)  
   - 为「时机 / 花牌 / 杠」各增加 **桌面专用** 容器（带稳定 `id`，便于测试），内放 `select` / `number`。  
   - 现有 radio / stepper 包在 **移动端专用** 容器内（或反过来），用 class 区分，例如：  
     - `context-control-mobile`  
     - `context-control-desktop`  
   - 避免 **重复 `id`**；桌面 `select` 使用新 `id`（如 `timingEventDesktop`），由脚本与 `#timingEvent` 同步。

2. **CSS** [`public/styles-responsive.css`](../../public/styles-responsive.css)  
   - 在 `@media (min-width: 1024px)` 下，对 **`.desktop-context-host`**（或 `.context-sheet` 内）规则：  
     - `display: none` 移动端块；显示桌面块。  
   - 默认（&lt;1024px）或 **非** `.desktop-context-host` 内（模态全屏上下文）：仅显示移动端块（若上下文仅在桌面栏 inline，需确认 modal 路径是否仍出现 — 当前 context sheet 可同时在 modal 与 host，以 **父级** 区分：  
     - `body` 或 `#contextModal` 内无 `desktop-inline-context` 时只显示移动控件；  
     - 更简：**仅用媒体查询**：≥1024px 显示桌面行、隐藏移动行；&lt;1024px 相反。  
   - **注意：** 当用户把窗口从宽变窄时，sheet 可能在 host 内仍显示「桌面」或「移动」——必须以 **matchMedia 与当前 sheet 位置** 一致；若仅依赖 `min-width: 1024px`，与「sheet 在 modal 内」的窄视口一致即可。

3. **JS** [`public/contextWiring.js`](../../public/contextWiring.js)（及必要时 [`public/uiBindings.js`](../../public/uiBindings.js) 的 `resetContext`）  
   - 新增或扩展 `wireContext…`：  
     - `select` `change` → 写 `#timingEvent` → 同步所有 `name="timingEvent"` 的 radio；  
     - `radio` `change` → 写 hidden → 更新 `select` 的 `value`；  
     - `number` `input`/`change` → clamp → 写 hidden + `*Label` → 与步进器显示一致；步进器点击同理更新 `number`。  
   - 杠合计约束：复用现有 `getMax` 思路，在桌面 `number` 上于 `input` 后校正。

4. **测试**  
   - 单元：同步函数（hidden ↔ select ↔ radio 代表值）；clamp 与合计 ≤4。  
   - `indexStylesheetLinks`：断言存在桌面控件容器 class / 关键 `id`。  
   - 全量 `npm test`、`npm run quality:complexity`。

5. **文档**  
   - [`CHANGELOG.md`](../../CHANGELOG.md) 已记入 **`[4.9.4] - 2026-03-28`**（与本切片及桌面工作台一并发布）。  
   - 本文件与 master **ValidationEvidence** 已更新。

## 发布后跟进（2026-03-28）

- 桌面首页 **垂直留白**：由工作台 shell 的 `align-content: start` 修复（见
  [`desktop_workspace_ui_76498db2.plan.md`](desktop_workspace_ui_76498db2.plan.md)
  Follow-up）；用户确认已解决；**非** 双套控件逻辑缺陷。

## 非目标

- 不改变番种计算与 context 字段语义。  
- 不在此计划内重做「应用」按钮或 context 整体信息架构。

## 风险

- 双套控件易 **漏同步**；必须以 hidden 为仲裁并集中在一个模块内维护。  
- `resize` / 断点交叉时需确认 **可见控件与 hidden** 一致（可加一次 `syncHomeState` 或专用 `syncContextControlsFromHidden`）。

## 执行顺序建议

1. HTML + CSS 显隐骨架（TDD：先测「桌面块存在、窄屏不破坏」）。  
2. 接线 + reset。  
3. 样式打磨与键盘/读屏抽检。  
4. 门控与计划 closeout。
