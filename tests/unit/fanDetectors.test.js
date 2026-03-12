import test from "node:test";
import assert from "node:assert/strict";
import { detectFans } from "../../src/rules/fanDetectors.js";

test("detectFans returns qing yi se for pure one suit hand", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "1W", "1W",
        "2W", "3W", "4W",
        "5W", "6W", "7W",
        "3W", "4W", "5W",
        "9W", "9W"
      ],
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none"
    },
    { pattern: "standard" }
  );
  assert.equal(result.some((fan) => fan.id === "QING_YI_SE"), true);
});

test("detectFans returns duan yao for all simples hand", () => {
  const result = detectFans(
    {
      tiles: [
        "2W", "3W", "4W",
        "2W", "3W", "4W",
        "5T", "6T", "7T",
        "4B", "5B", "6B",
        "8T", "8T"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    { pattern: "standard" }
  );
  assert.equal(result.some((fan) => fan.id === "DUAN_YAO"), true);
});
