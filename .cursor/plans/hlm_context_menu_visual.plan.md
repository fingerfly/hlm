---
name: hlm-context-menu-visual
overview: |
  Vertical context menu with Material elevation, positioned near the clicked
  tile; optional backdrop for clearer separation from sheet.
todos:
  - id: visual-layout
    content: Change menu to vertical layout; update .context-chow-submenu.
    status: completed
  - id: visual-position
    content: Pass anchor to openTileContextMenu; position menu near tile.
    status: completed
  - id: visual-css
    content: Material elevation shadow; remove fixed bottom/left (use JS).
    status: completed
  - id: visual-verify
    content: Run npm test; manual check near-tile positioning.
    status: completed
  - id: visual-tests
    content: Add/update test for openTileContextMenu(tile, event) and event fallback.
    status: completed
isProject: false
---

# HLM 上下文菜单视觉与布局优化

## 问题

弹出上下文菜单与下方 sheet 的样式一致，视觉混淆；菜单位置固定于底部中央，未靠近点击的牌。

## 目标

- 弹出菜单在视觉上明显区别于底层 sheet（Material Design 规范）
- **竖式菜单**：单列布局，选项自上而下排列
- **靠近点击的牌**：菜单出现在被点击牌附近，便于操作

---

## 设计依据（最佳实践调研）

- **Material Design**：菜单使用 elevation 8dp 的三层阴影（umbra/penumbra/ambient），通过阴影表达层级，而非彩色边框
- **NN/G**：上下文菜单需高对比度、足够尺寸，并与触发元素在视觉上关联
- **iOS HIG / Radix / MUI**：popover 常配合 backdrop（scrim）弱化背景，使弹出层更突出

---

## 设计预览（实施前查看效果）

在实际修改样式前，可先创建预览页面查看效果，确认后再实施。

### 预览文件

在项目根目录创建 `preview-context-menu-visual.html`（或 `public/preview-context-menu-visual.html`），内容见下方。用浏览器打开即可看到拟定的弹出菜单样式与 sheet 的对比。

### 预览页面结构

- 模拟 picker sheet：牌类型 tabs、牌库网格、footer
- 模拟弹出菜单：使用 Material Design elevation 8dp 三层阴影 + 中性描边
- 并排展示「当前样式」与「拟定样式（Material）」以便对比

### 预览后

- 若满意：按「实现方案」实施
- 若需调整：修改拟定样式参数后重新预览，再实施
- 实施完成后可删除预览文件

---

## 实现方案

### 方案 A：Material Design + 竖式布局

采用 Material Design elevation 8dp 三层阴影 + 竖式单列布局。位置由 JS 根据锚点设置，不写死 bottom/left。

**修改文件**：[public/styles-components.css](public/styles-components.css)

**变更**：

- **background**：`#ffffff`
- **border**：`1px solid rgba(0, 0, 0, 0.08)`
- **box-shadow**：Material elevation 8dp 三层阴影
- **grid**：`grid-template-columns: 1fr`（竖式）
- **定位**：仅 `position: fixed; z-index: 110`，`top`/`bottom`/`left` 由 JS 设置
- **保留**：`#tileContextMenu[hidden]` 规则（若已存在则勿删除）

```css
#tileContextMenu[hidden],
.tile-context-menu[hidden] {
  display: none !important;
}

.tile-context-menu {
  position: fixed;
  z-index: 110;
  width: auto;
  min-width: 100px;
  max-width: min(320px, calc(100vw - 28px));
  box-shadow:
    0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  padding: 8px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.tile-context-menu .context-chow-submenu {
  grid-column: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}
```

### 方案 B：Material + Backdrop（层级最清晰）

在方案 A 基础上，菜单打开时增加半透明 backdrop 弱化 sheet，与 iOS/Radix 等一致。

**新增**：

- 在 [public/index.html](public/index.html) 中，于 `#tileContextMenu` 前增加 `#tileContextMenuBackdrop`（与菜单同显隐）
- CSS：`#tileContextMenuBackdrop` 使用 `position: fixed; inset: 0; z-index: 109; background: rgba(0,0,0,0.04);`
- [tileContextMenuController.js](public/tileContextMenuController.js)：`openTileContextMenu` 时同时显示 backdrop，`closeTileContextMenu` 时隐藏

**说明**：点击 backdrop 会触发现有 click-outside 逻辑，无需额外事件。

### 方案选择

- 优先采用 **方案 A**，改动小、符合 Material 规范
- 若仍感层级不够清晰，再叠加 **方案 B** 的 backdrop

### 布局决定：竖式菜单

采用 **纯竖** 布局，单列排列：

- `.tile-context-menu`：`grid-template-columns: 1fr`
- `.context-chow-submenu`：`grid-template-columns: 1fr`，顺子三选项竖排

---

## 定位策略：靠近点击的牌

菜单应尽量靠近被点击的麻将牌，而非固定于底部中央。

### 数据流

1. [uiRenderers.js](public/uiRenderers.js)：`renderTilePickerGrid` 的 `onPick` 改为 `(tile, event) => onPick(tile, event)`，传入点击事件
2. [pickerRenderFlow.js](public/pickerRenderFlow.js)：`onPick: (tile, event) => stateActions.openTileContextMenu(tile, event)`
3. [tileContextMenuController.js](public/tileContextMenuController.js)：`openTileContextMenu(baseTile, event)`，从 `event.target` 取 `getBoundingClientRect()` 作为锚点

### 定位逻辑

- **锚点**：`event.target.closest("button")` 或 `event.currentTarget`（牌按钮）
- **优先上方**：若牌上方空间足够（菜单高度 + 8px），则菜单置于牌上方，`bottom` 对齐牌顶
- **否则下方**：若上方不足，则菜单置于牌下方，`top` 对齐牌底
- **水平居中**：菜单中心与牌中心对齐，但 clamp 到视口内（左右各留 8px）
- **event 缺失时**：当 `event` 为 null 或 undefined（如程序化调用或测试），回退到默认居中底部：`bottom: 100px; left: 50%; transform: translateX(-50%)`

### 伪代码

为避免闪烁：先设 `menu.style.visibility = 'hidden'`，再 `hidden = false`，测量后定位，最后 `menu.style.visibility = ''`。（或使用 `requestAnimationFrame` 在同一帧内完成定位）

```js
const rect = anchor.getBoundingClientRect();
const menuHeight = menu.offsetHeight;
const gap = 8;
const spaceAbove = rect.top;
const spaceBelow = window.innerHeight - rect.bottom;
if (spaceAbove >= menuHeight + gap) {
  menu.style.top = "";
  menu.style.bottom = `${window.innerHeight - rect.top + gap}px`;
} else {
  menu.style.bottom = "";
  menu.style.top = `${rect.bottom + gap}px`;
}
const menuWidth = menu.offsetWidth;
let left = rect.left + rect.width / 2 - menuWidth / 2;
left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, left));
menu.style.left = `${left}px`;
```

### CSS 变更

- 移除 `bottom: 100px; left: 50%; transform: translateX(-50%)`，改为由 JS 设置 `top`/`bottom` 与 `left`
- 保留 `position: fixed`、`z-index: 110`

---

## 执行步骤

**注意**：步骤 1（布局）与步骤 3（定位）需在同一批修改中完成，否则移除固定 bottom/left 后菜单打开时无正确位置。

1. **布局**：在 [public/styles-components.css](public/styles-components.css) 中改为竖式 grid + Material 样式
2. **传参**：修改 [uiRenderers.js](public/uiRenderers.js)、[pickerRenderFlow.js](public/pickerRenderFlow.js)，传递 `event` 给 `openTileContextMenu`
3. **定位**：在 [tileContextMenuController.js](public/tileContextMenuController.js) 中实现锚点定位逻辑
4. **验证**：运行 `npm test`，手动点击不同位置的牌，确认菜单靠近牌且不溢出视口
5. **清理**（可选）：删除 `preview-context-menu-visual.html`

---

## 验证清单

- 竖式菜单单列排列
- 菜单出现在点击的牌附近，不溢出视口
- Material 三层阴影使层级清晰
- `npm test` 通过
- 无功能回归

---

## 回滚

- 布局/定位：还原 grid、恢复固定 bottom/left，移除 event 传参
- 视觉：还原 background、border、box-shadow；若已加 backdrop，移除对应逻辑

---

## 附录：预览页面

已更新 [public/preview-context-menu-visual.html](public/preview-context-menu-visual.html)，支持并排对比三种效果：

- **当前样式**（左）：现有灰色边框 + 单层阴影
- **方案 A（Material）**（中）：Material elevation 8dp 三层阴影 + 中性描边
- **方案 B（+ Backdrop）**（右）：与方案 A 相同菜单样式

顶部有复选框「显示 Backdrop（方案 B 效果）」：勾选后出现半透明遮罩，弱化 sheet，可直观感受方案 B 的层级分离效果。

建议视口宽度 ≥ 500px 以便并排对比。实施完成后可删除此文件。