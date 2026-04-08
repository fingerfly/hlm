/**
 * Purpose: 四归一 — four identical tiles in chow/pung/pair (not 杠).
 * Description:
 * - Standard decomposition only.
 */
import { SI_GUI_YI_MELD_TYPES } from "./constants.js";

/**
 * True when four identical tiles lie in chows / pungs / pair (not 杠).
 *
 * @param {{ pattern?: string, meldGroups?: object[] }} win
 * @returns {boolean}
 */
export function detectSiGuiYi(win = {}) {
  if (win.pattern !== "standard" || !Array.isArray(win.meldGroups)) {
    return false;
  }
  const counts = new Map();
  for (const group of win.meldGroups) {
    if (group.type === "kong") continue;
    if (!SI_GUI_YI_MELD_TYPES.has(group.type)) continue;
    if (!Array.isArray(group.tiles)) continue;
    for (const tile of group.tiles) {
      counts.set(tile, (counts.get(tile) || 0) + 1);
    }
  }
  for (const n of counts.values()) {
    if (n === 4) return true;
  }
  return false;
}
