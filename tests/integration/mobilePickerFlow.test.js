import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCapturedHand } from "../../src/app/evaluateCapturedHand.js";
import {
  createTilePickerState,
  addTileToPicker,
  pickerToTiles,
  isPickerReady
} from "../../src/app/tilePickerState.js";

test("mobile picker flow can build a winning hand request", () => {
  const hand = [
    "1W", "1W", "1W",
    "2W", "3W", "4W",
    "5W", "6W", "7W",
    "2T", "3T", "4T",
    "9B", "9B"
  ];
  let picker = createTilePickerState();
  for (const tile of hand) {
    picker = addTileToPicker(picker, tile);
  }
  assert.equal(isPickerReady(picker), true);

  const result = evaluateCapturedHand({
    tiles: pickerToTiles(picker),
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none"
    }
  });
  assert.equal(result.scoring.isWin, true);
  assert.equal(result.scoring.totalFan >= 3, true);
});
