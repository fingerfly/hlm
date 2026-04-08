/**
 * Purpose: Static Chinese explanations for fan ids (result UI).
 * Description:
 * - Keys align with FAN_REGISTRY ids via FAN_LEXICON_ENTRIES.
 * - Provides fallback for unknown ids outside the registry.
 * - Keeps copy editable without LLM or network.
 */
import { getFanDisplayName } from "../rules/fanRegistry.js";
import { FAN_LEXICON_ENTRIES } from "./fanLexiconEntries.js";

const FALLBACK = "释义待补";

/**
 * Return static lexicon text for one fan id.
 *
 * @param {string} id - Fan registry id.
 * @returns {string}
 */
export function getFanLexiconText(id) {
  if (!id || typeof id !== "string") return FALLBACK;
  const entry = FAN_LEXICON_ENTRIES[id];
  if (entry) {
    if (typeof entry === "string") return entry;
    if (typeof entry === "object" && typeof entry.brief === "string") {
      return entry.brief;
    }
  }
  const name = getFanDisplayName(id);
  if (name && name !== id) {
    return `${name}：国标麻将竞赛规则番种；以本工具检测结果为准。`;
  }
  return FALLBACK;
}
