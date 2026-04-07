import test from "node:test";
import assert from "node:assert/strict";
import { scoreHand } from "../../../src/rules/scoringEngine.js";
import { COMPAT_SCORING_RULE_SNAPSHOT } from "../../helpers/scoringTestSnapshots.js";

test("scoreHand detects yi ban gao for duplicate chow pattern", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "1W", "2W", "3W", "4T", "4T", "4T", "7B", "8B", "9B", "5W", "5W"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 2);
  assert.equal(result.matchedFans.some((fan) => fan.id === "YI_BAN_GAO"), true);
});

test("scoreHand detects san se san tong shun for mixed triple chow", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "1T", "2T", "3T", "1B", "2B", "3B", "7W", "7W", "7W", "9B", "9B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 9);
  assert.equal(
    result.matchedFans.some((fan) => fan.id === "SAN_SE_SAN_TONG_SHUN"),
    true
  );
});

test("scoreHand shi san yao excludes hun yao jiu and men qian qing", () => {
  const tiles = [
    "1W", "1W",
    "9W", "1T", "9T", "1B", "9B",
    "E", "S", "Wn", "N", "R", "G", "Wh"
  ];
  const result = scoreHand({
    tiles,
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 89);
  assert.equal(result.matchedFans.some((f) => f.id === "SHI_SAN_YAO"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "HUN_YAO_JIU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "MEN_QIAN_QING"), false);
});

test("scoreHand shi san yao excludes dan diao jiang when waitType single", () => {
  const tiles = [
    "1W", "1W",
    "9W", "1T", "9T", "1B", "9B",
    "E", "S", "Wn", "N", "R", "G", "Wh"
  ];
  const result = scoreHand({
    tiles,
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    waitType: "single",
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 89);
  assert.equal(result.matchedFans.some((f) => f.id === "SHI_SAN_YAO"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "DAN_DIAO_JIANG"), false);
});

test("scoreHand qi dui excludes men qian qing", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "2W", "2W", "3W", "3W", "4T", "4T", "5T", "5T", "6B", "6B", "R", "R"],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 25);
  assert.equal(result.matchedFans.some((f) => f.id === "QI_DUI"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "MEN_QIAN_QING"), false);
});

test("scoreHand qi dui excludes duan yao wu zi on all-simple pairs", () => {
  const result = scoreHand({
    tiles: [
      "2W", "2W", "3W", "3W",
      "4T", "4T", "5T", "5T",
      "6B", "6B", "7B", "7B",
      "8B", "8B"
    ],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 25);
  assert.equal(result.matchedFans.some((f) => f.id === "QI_DUI"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "DUAN_YAO"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "WU_ZI"), false);
});

test("scoreHand si gui yi when four identical tiles split across melds", () => {
  const result = scoreHand({
    tiles: [
      "1W", "2W", "2W", "2W", "2W",
      "3W", "3W", "4W", "5W", "6W",
      "7W", "7W", "8W", "9W"
    ],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true,
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 30);
  assert.equal(result.matchedFans.some((f) => f.id === "SI_GUI_YI"), true);
});

test("scoreHand yi se si tong shun drops san jie san tong yi ban subfans", () => {
  const result = scoreHand({
    tiles: [
      "1W", "1W", "1W", "1W",
      "2W", "2W", "2W", "2W",
      "3W", "3W", "3W", "3W",
      "4W", "4W"
    ],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true,
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 86);
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SI_TONG_SHUN"),
    true
  );
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SAN_JIE_GAO"),
    false
  );
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SAN_TONG_SHUN"),
    false
  );
  assert.equal(result.matchedFans.some((f) => f.id === "YI_BAN_GAO"), false);
});

test("scoreHand prefers yi se san jie gao over yi se san tong shun melding", () => {
  const result = scoreHand({
    tiles: [
      "5W", "5W", "5W",
      "6W", "6W", "6W",
      "7W", "7W", "7W",
      "1B", "2B", "3B",
      "2T", "2T"
    ],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true,
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 25);
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SAN_JIE_GAO"),
    true
  );
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SAN_TONG_SHUN"),
    false
  );
  assert.equal(result.matchedFans.some((f) => f.id === "PING_HU"), false);
});

test("scoreHand san se shuang long hui drops bundled low fans", () => {
  const result = scoreHand({
    tiles: [
      "5B", "5B",
      "1W", "2W", "3W", "7W", "8W", "9W",
      "1T", "2T", "3T", "7T", "8T", "9T"
    ],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true,
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 16);
  assert.equal(
    result.matchedFans.some((f) => f.id === "SAN_SE_SHUANG_LONG_HUI"),
    true
  );
  assert.equal(result.matchedFans.some((f) => f.id === "PING_HU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "XI_XIANG_FENG"), false);
});

test("scoreHand prefers standard over seven_pairs for yi se shuang long hui", () => {
  const result = scoreHand({
    tiles: [
      "1W", "2W", "3W", "1W", "2W", "3W",
      "7W", "8W", "9W", "7W", "8W", "9W",
      "5W", "5W"
    ],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true,
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.winPattern, "standard");
  assert.equal(result.totalFan, 64);
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SHUANG_LONG_HUI"),
    true
  );
  assert.equal(result.matchedFans.some((f) => f.id === "QI_DUI"), false);
});

test("scoreHand qi dui excludes dan diao jiang when waitType single", () => {
  const result = scoreHand({
    tiles: [
      "2W", "2W", "3W", "3W",
      "4T", "4T", "5T", "5T",
      "6B", "6B", "7B", "7B",
      "8B", "8B"
    ],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    waitType: "single",
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 25);
  assert.equal(result.matchedFans.some((f) => f.id === "QI_DUI"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "DAN_DIAO_JIANG"), false);
});
