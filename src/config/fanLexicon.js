/**
 * Purpose: Static Chinese explanations for fan ids (result UI).
 * Description:
 * - Keys align with FAN_REGISTRY ids.
 * - Provides fallback for ids without a curated entry.
 * - Keeps copy editable without LLM or network.
 */
import { FAN_REGISTRY, getFanDisplayName } from "../rules/fanRegistry.js";

const FALLBACK = "释义待补";

/** @type {Record<string, string>} */
const CURATED = {
  HUA_PAI:
    "花牌：每有一张花牌计 1 番，不计入 14 张手牌；请在和牌条件中填写花牌张数。",
  MEN_QIAN_QING: "门前清：未吃、碰、明杠，全手牌皆为自己摸入。",
  ZI_MO: "自摸：和牌牌张为自己摸入，而非他人打出。",
  AN_GANG: "暗杠：四张同牌皆在手内暗扣组成的杠，计 2 番。",
  MING_GANG: "明杠：碰后补杠或他人点杠等明面杠，计 1 番。"
};

const AUTO = Object.fromEntries(
  FAN_REGISTRY.map(({ id, zhName }) => [
    id,
    `${zhName}：国标麻将竞赛规则中的番种；具体是否成立以本工具检测结果为准。`
  ])
);

/**
 * Return static lexicon text for one fan id.
 *
 * @param {string} id - Fan registry id.
 * @returns {string}
 */
export function getFanLexiconText(id) {
  if (!id || typeof id !== "string") return FALLBACK;
  if (CURATED[id]) return CURATED[id];
  if (AUTO[id]) return AUTO[id];
  const name = getFanDisplayName(id);
  if (name && name !== id) {
    return `${name}：国标麻将竞赛规则中的番种；以本工具检测结果为准。`;
  }
  return FALLBACK;
}
