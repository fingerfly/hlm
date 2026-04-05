/**
 * Purpose: Lock startup round-setup gate DOM contract for wiring and layout.
 * Description:
 *   - Asserts stable input ids used by collectRoundPlayers.
 *   - Asserts data-seat markers for table metaphor panels.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const indexPath = resolve(import.meta.dirname, "../../public/index.html");

const REQUIRED_IDS = [
  "roundSetupGate",
  "playerNameE",
  "playerScoreE",
  "playerNameS",
  "playerScoreS",
  "playerNameW",
  "playerScoreW",
  "playerNameN",
  "playerScoreN",
  "dealerSeat"
];

test("round setup gate keeps collectRoundPlayers ids", () => {
  const html = readFileSync(indexPath, "utf8");
  for (const id of REQUIRED_IDS) {
    assert.match(
      html,
      new RegExp(`id="${id}"`),
      `missing id="${id}"`
    );
  }
});

test("round setup gate exposes table layout and wind seat markers", () => {
  const html = readFileSync(indexPath, "utf8");
  assert.match(html, /class="[^"]*round-setup-table/);
  for (const seat of ["E", "S", "W", "N"]) {
    assert.match(
      html,
      new RegExp(`data-seat="${seat}"`)
    );
  }
});

test("round setup gate lives inside main app shell", () => {
  const html = readFileSync(indexPath, "utf8");
  const mainIdx = html.indexOf("<main ");
  const gateIdx = html.indexOf('id="roundSetupGate"');
  const mainClose = html.indexOf("</main>");
  assert.ok(mainIdx >= 0 && gateIdx >= 0 && mainClose >= 0);
  assert.ok(mainIdx < gateIdx && gateIdx < mainClose);
  assert.match(html, /id="handCardSection"/);
});
