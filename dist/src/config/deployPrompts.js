/**
 * Purpose: Store static prompt templates for deploy automation.
 * Description:
 * - Provides changelog update template for unreleased section.
 * - Provides release-archive template with date/version rules.
 * - Provides normalized deploy CLI usage guidance text.
 */
export const UPDATE_PROMPT_TEMPLATE = [
  "请根据当前工作区的实际变更更新 CHANGELOG.md 的 [Unreleased]。",
  "硬性要求：",
  "1) 只记录真实改动，禁止编造；",
  "2) 按 Added / Changed / Fixed 分类；",
  "3) 使用简体中文与标准术语；",
  "4) 每条变更要可追溯到具体文件路径；",
  "5) 写完后在同一轮验证：已写入、与代码一致、路径存在、npm test 通过。"
].join("\n");

export const RELEASE_PROMPT_TEMPLATE = [
  "准备发布。请将 CHANGELOG.md 的 [Unreleased] 归档到当前发布版本。",
  "硬性要求：",
  "1) 版本号必须与 package.json 和 src/config/appVersion.js 一致；",
  "2) 发布日期必须使用今天日期；",
  "3) 归档后保留空的 [Unreleased]；",
  "4) 在同一轮验证：标题正确、Unreleased 为空、版本一致、npm test 通过。"
].join("\n");

export const DEPLOY_USAGE =
  "Invalid usage: npm run deploy -- " +
  "major|minor|patch|build|release|prompt-update|" +
  "prompt-release|prompt-all|prompt-update-agent|" +
  "prompt-release-agent [--confirm] [--run-agent]";
