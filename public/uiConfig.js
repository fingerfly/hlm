/**
 * Purpose: Define immutable UI constants for picker and placeholders.
 * Description:
 * - Declares per-tab tile choices for picker grid rendering.
 * - Declares result placeholder html before first evaluation.
 */
export const TAB_TILES = Object.freeze({
  W: ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W"],
  T: ["1T", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T"],
  B: ["1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B"],
  Z: ["E", "S", "Wn", "N", "R", "G", "Wh"]
});

export const RESULT_PLACEHOLDER =
  '<p class="placeholder">请先输入手牌与和牌信息，再点击“计算番数”。</p>';
