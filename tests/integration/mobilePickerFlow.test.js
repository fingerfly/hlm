import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCapturedHand } from "../../src/app/evaluateCapturedHand.js";
import {
  createTilePickerState,
  addTileToPicker,
  selectPickerSlot,
  pickerToTiles,
  isPickerReady
} from "../../src/app/tilePickerState.js";
import {
  resolvePatternAction,
  getContextActionAvailability
} from "../../src/app/tilePatternActions.js";
import { resolveInitialPickerMode } from "../../public/appStateActions.js";

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

test("mobile picker flow supports mid-slot correction before scoring", () => {
  const hand = [
    "1W", "1W", "9B",
    "2W", "3W", "4W",
    "5W", "6W", "7W",
    "2T", "3T", "4T",
    "9B", "9B"
  ];
  let picker = createTilePickerState();
  for (const tile of hand) {
    picker = addTileToPicker(picker, tile);
  }
  picker = selectPickerSlot(picker, 2);
  picker = addTileToPicker(picker, "1W");
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
  assert.equal(result.scoring.errorCode, null);
});

test("mobile picker quick actions can build hand with fewer operations", () => {
  let picker = createTilePickerState();
  const steps = [
    ["1W", "pung"],
    ["2W", "chow_front"],
    ["5W", "chow_front"],
    ["2T", "chow_front"],
    ["9B", "pair"]
  ];
  for (const [baseTile, actionId] of steps) {
    const next = resolvePatternAction(picker, baseTile, actionId);
    assert.equal(next.ok, true);
    for (const tile of next.tiles) {
      picker = addTileToPicker(picker, tile);
    }
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
  assert.equal(result.scoring.errorCode, null);
});

test("dynamic menu narrows actions from 12 to 14 tiles", () => {
  let picker = createTilePickerState([
    "1W", "1W", "1W",
    "2W", "2W", "2W",
    "3W", "3W", "3W",
    "4W", "4W", "4W"
  ]);
  const at12 = getContextActionAvailability(picker, "9B");
  assert.equal(at12.single.visible, true);
  assert.equal(at12.pair.visible, true);
  assert.equal(at12.pung.visible, false);
  assert.equal(at12.chow_front.visible, false);

  picker = addTileToPicker(picker, "9B");
  const at13 = getContextActionAvailability(picker, "9B");
  assert.equal(at13.single.visible, true);
  assert.equal(at13.pair.visible, false);
  assert.equal(at13.pung.visible, false);

  picker = addTileToPicker(picker, "9B");
  const at14 = getContextActionAvailability(picker, "9B");
  assert.equal(at14.single.visible, false);
  assert.equal(at14.pair.visible, false);
  assert.equal(at14.pung.visible, false);
});

test("picker mode policy uses mobile twoLayer and desktop restore", () => {
  const mobile = resolveInitialPickerMode({
    isMobile: true,
    storedMode: "flat"
  });
  assert.equal(mobile, "twoLayer");

  const desktopStored = resolveInitialPickerMode({
    isMobile: false,
    storedMode: "flat"
  });
  assert.equal(desktopStored, "flat");

  const desktopFallback = resolveInitialPickerMode({
    isMobile: false,
    storedMode: "unknown-mode"
  });
  assert.equal(desktopFallback, "twoLayer");
});
