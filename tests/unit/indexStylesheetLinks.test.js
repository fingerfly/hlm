import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const indexPath = resolve(import.meta.dirname, "../../public/index.html");
const responsiveCssPath = resolve(
  import.meta.dirname,
  "../../public/styles-responsive.css"
);
const modalsCssPath = resolve(
  import.meta.dirname,
  "../../public/styles-modals.css"
);
const iconPath = resolve(import.meta.dirname, "../../public/favicon.svg");
const appIconPath = resolve(import.meta.dirname, "../../public/icon-app.svg");
const iconTraditionalPath = resolve(
  import.meta.dirname,
  "../../public/favicon-traditional.svg"
);
const iconMinimalPath = resolve(
  import.meta.dirname,
  "../../public/favicon-minimal.svg"
);
const appIconTraditionalPath = resolve(
  import.meta.dirname,
  "../../public/icon-app-traditional.svg"
);
const appIconMinimalPath = resolve(
  import.meta.dirname,
  "../../public/icon-app-minimal.svg"
);
const iconSealPath = resolve(
  import.meta.dirname,
  "../../public/favicon-seal.svg"
);
const appIconSealPath = resolve(
  import.meta.dirname,
  "../../public/icon-app-seal.svg"
);
const iconDeskPath = resolve(
  import.meta.dirname,
  "../../public/favicon-desk.svg"
);
const appIconDeskPath = resolve(
  import.meta.dirname,
  "../../public/icon-app-desk.svg"
);
const iconBadgePath = resolve(
  import.meta.dirname,
  "../../public/favicon-badge.svg"
);
const appIconBadgePath = resolve(
  import.meta.dirname,
  "../../public/icon-app-badge.svg"
);
const appleTouchIconPath = resolve(
  import.meta.dirname,
  "../../public/apple-touch-icon.png"
);

test("index.html loads modular stylesheets", () => {
  const html = readFileSync(indexPath, "utf8");
  assert.match(html, /href="\.\/styles-base\.css"/);
  assert.match(html, /href="\.\/styles-components\.css"/);
  assert.match(html, /href="\.\/styles-modals\.css"/);
  assert.match(html, /href="\.\/styles-responsive\.css"/);
});

test("index.html exposes splash skip control", () => {
  const html = readFileSync(indexPath, "utf8");
  assert.match(html, /id="splashSkipBtn"/);
  assert.match(html, /class="app-splash-skip"/);
});

test("index.html exposes help modal and explicit reset button", () => {
  const html = readFileSync(indexPath, "utf8");
  assert.match(html, /class="nav-app-title"/);
  assert.match(
    html,
    /id="moreBtn"[\s\S]*?>\s*帮助\s*<\/button>/
  );
  assert.match(html, /id="helpModal"/);
  assert.match(html, /id="helpPopover"/);
  assert.match(html, /id="desktopSidePanel"/);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.match(html, /id="helpCloseBtn"/);
  assert.match(html, /id="desktopPickerHost"/);
  assert.match(html, /id="desktopContextHost"/);
  assert.match(html, /id="resetContextBtn"/);
  assert.match(html, /id="helpArticleTemplate"/);
  assert.match(html, /id="helpFanLexiconRegion"/);
  assert.match(html, /class="help-fan-search"/);
  assert.match(html, /class="help-fan-empty\s/);
  assert.doesNotMatch(html, /id="moreBtn"[^>]*>\.\.\.<\/button>/);
});

test("help article template matches three-step wizard copy", () => {
  const html = readFileSync(indexPath, "utf8");
  assert.match(html, /设定玩家/);
  assert.match(html, /步骤 2\/3/);
  assert.match(html, /步骤 3\/3/);
  assert.match(html, /hlm_disableAutoWizardAdvance/);
  assert.match(html, /重置和牌条件/);
});

test("help template includes four-block fan explanation headers", () => {
  const css = readFileSync(
    resolve(import.meta.dirname, "../../public/styles-components.css"),
    "utf8"
  );
  assert.match(css, /\.help-fan-block/);
  assert.match(css, /\.help-fan-subtitle/);
  assert.match(css, /\.help-fan-list/);
  assert.match(css, /\.help-content code/);
});

test("styles-responsive includes desktop two-pane shell rules", () => {
  const css = readFileSync(responsiveCssPath, "utf8");
  assert.match(css, /@media\s*\(min-width:\s*1024px\)/);
  assert.match(css, /\.container\.app-shell/);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(css, /transform:\s*none/);
  assert.match(css, /\.desktop-side-panel/);
  assert.match(css, /\.help-popover/);
  assert.match(css, /\.desktop-step-1/);
  assert.match(css, /\.desktop-picker-host/);
  assert.match(css, /#pickerModal\.desktop-inline-picker/);
  assert.match(css, /\.desktop-context-host \.context-control-desktop/);
  assert.match(css, /\.desktop-context-host \.context-control-mobile/);
  assert.match(css, /\.desktop-context-host \.context-apply-btn/);
  assert.match(css, /\.desktop-context-host \.context-sheet-footer/);
  assert.match(css, /display:\s*none\s*!important/);
  assert.match(
    css,
    /\.container\.app-shell\s*\{[^}]*align-content:\s*start/s
  );
});

test("styles-modals hides desktop context controls by default", () => {
  const css = readFileSync(modalsCssPath, "utf8");
  assert.match(css, /\.context-control-desktop/);
  assert.match(css, /\.context-number-input/);
  assert.match(css, /\.context-select-input/);
  assert.match(css, /\.help-sheet/);
  assert.match(css, /max-height:\s*min\(86vh,\s*780px\)/);
  assert.match(css, /overflow-x:\s*hidden/);
});

test("index.html wraps score rule block in collapsible details", () => {
  const html = readFileSync(indexPath, "utf8");
  assert.match(html, /class="context-advanced-details"/);
  assert.match(html, /id="scoreRulePreset"/);
});

test("index.html includes desktop context dual-control ids", () => {
  const html = readFileSync(indexPath, "utf8");
  assert.match(html, /id="timingEventSelect"/);
  assert.match(html, /id="flowerCountInput"/);
  assert.match(html, /id="kongAnCountInput"/);
  assert.match(html, /id="kongMingCountInput"/);
  assert.match(html, /id="roleValidationError"/);
  assert.match(html, /id="scoreRulePreset"/);
  assert.match(html, /id="cloneScoreRuleBtn"/);
  assert.match(html, /id="scoreRuleStatus"/);
  assert.match(html, /id="resultRuleMeta"/);
  assert.match(html, /class="context-control-mobile"/);
  assert.match(html, /class="context-control-desktop"/);
});

test("index.html links app icon assets", () => {
  const html = readFileSync(indexPath, "utf8");
  const iconLinkRe = /rel="icon"\s+type="image\/svg\+xml"\s+href="\.\/favicon-/;
  const touchIconLinkRe = /rel="apple-touch-icon"\s+href="\.\/apple-touch-icon\.png"/;
  assert.equal(existsSync(iconPath), true);
  assert.equal(existsSync(appIconPath), true);
  assert.equal(existsSync(iconTraditionalPath), true);
  assert.equal(existsSync(iconMinimalPath), true);
  assert.equal(existsSync(appIconTraditionalPath), true);
  assert.equal(existsSync(appIconMinimalPath), true);
  assert.equal(existsSync(appleTouchIconPath), true);
  assert.match(html, iconLinkRe);
  assert.match(html, touchIconLinkRe);
});

test("index.html pins traditional icon set", () => {
  const html = readFileSync(indexPath, "utf8");
  assert.match(
    html,
    /rel="icon"\s+type="image\/svg\+xml"\s+href="\.\/favicon-traditional\.svg"/
  );
  assert.match(
    html,
    /rel="apple-touch-icon"\s+href="\.\/apple-touch-icon\.png"/
  );
});

test("icon variants include Chinese and Mahjong intent", () => {
  const traditionalAppSvg = readFileSync(appIconTraditionalPath, "utf8");
  const minimalAppSvg = readFileSync(appIconMinimalPath, "utf8");
  const traditionalFaviconSvg = readFileSync(iconTraditionalPath, "utf8");
  const minimalFaviconSvg = readFileSync(iconMinimalPath, "utf8");
  const chineseRe = /番|和|胡|麻将|國標|国标|算/;
  const tileRe = /万|萬|条|條|筒|中|發|发|白|tile|mahjong/i;

  assert.match(traditionalAppSvg, chineseRe);
  assert.match(minimalAppSvg, chineseRe);
  assert.match(traditionalFaviconSvg, chineseRe);
  assert.match(minimalFaviconSvg, chineseRe);
  assert.match(traditionalAppSvg, tileRe);
  assert.match(minimalAppSvg, tileRe);
});

test("candidate icon style files exist", () => {
  assert.equal(existsSync(iconSealPath), true);
  assert.equal(existsSync(appIconSealPath), true);
  assert.equal(existsSync(iconDeskPath), true);
  assert.equal(existsSync(appIconDeskPath), true);
  assert.equal(existsSync(iconBadgePath), true);
  assert.equal(existsSync(appIconBadgePath), true);
});

test("canonical icon files mirror traditional source files", () => {
  const favicon = readFileSync(iconPath, "utf8");
  const iconApp = readFileSync(appIconPath, "utf8");
  const faviconTraditional = readFileSync(iconTraditionalPath, "utf8");
  const iconAppTraditional = readFileSync(appIconTraditionalPath, "utf8");

  assert.equal(favicon, faviconTraditional);
  assert.equal(iconApp, iconAppTraditional);
});
