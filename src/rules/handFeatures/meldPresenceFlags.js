/**
 * Purpose: Boolean meld-presence predicates on `win.meldGroups`.
 * Description:
 * - 箭刻 / 幺九刻 / 全带幺 / 全带五 (tile-in-meld checks).
 */
import { DRAGONS, HONORS, TERMINAL_RANKS } from "./constants.js";
import { tileRank } from "./tileBasics.js";

export function detectAnyDragonPung(win = {}) {
  if (!Array.isArray(win.meldGroups)) return false;
  return win.meldGroups.some((group) => (
    group.type === "pung"
    && Array.isArray(group.tiles)
    && DRAGONS.has(group.tiles[0])
  ));
}

export function detectTerminalHonorPung(win = {}) {
  if (!Array.isArray(win.meldGroups)) return false;
  return win.meldGroups.some((group) => {
    if (group.type !== "pung" || !Array.isArray(group.tiles)) return false;
    const tile = group.tiles[0];
    if (HONORS.has(tile)) return true;
    return TERMINAL_RANKS.has(tileRank(tile));
  });
}

export function detectOutsideHand(win = {}) {
  if (!Array.isArray(win.meldGroups)) return false;
  return win.meldGroups.every((group) => {
    if (!Array.isArray(group.tiles)) return false;
    return group.tiles.some((tile) => {
      if (HONORS.has(tile)) return true;
      return TERMINAL_RANKS.has(tileRank(tile));
    });
  });
}

export function detectAllSetsContainFive(win = {}) {
  if (!Array.isArray(win.meldGroups)) return false;
  return win.meldGroups.every((group) => (
    Array.isArray(group.tiles)
    && group.tiles.some((tile) => tileRank(tile) === "5")
  ));
}
