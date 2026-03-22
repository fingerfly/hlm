import test from "node:test";
import assert from "node:assert/strict";
import {
  addStructuredContextProblems
} from "../../src/contracts/structuredContextValidator.js";

test("addStructuredContextProblems accepts empty optional payload", () => {
  const problems = [];
  addStructuredContextProblems({}, problems);
  assert.deepEqual(problems, []);
});

test("addStructuredContextProblems reports enum and boolean violations", () => {
  const problems = [];
  addStructuredContextProblems(
    {
      waitType: "bad_wait",
      specialPattern: "bad_pattern",
      rankZone: "bad_zone",
      allSetsMelded: "yes"
    },
    problems
  );
  assert.equal(problems.some((p) => p.includes("waitType")), true);
  assert.equal(problems.some((p) => p.includes("specialPattern")), true);
  assert.equal(problems.some((p) => p.includes("rankZone")), true);
  assert.equal(problems.some((p) => p.includes("allSetsMelded")), true);
});

test("addStructuredContextProblems reports numeric and kong violations", () => {
  const problems = [];
  addStructuredContextProblems(
    {
      flowerCount: -1,
      concealedPungCount: 7,
      kongSummary: { an: -1, ming: 1.5 }
    },
    problems
  );
  assert.equal(problems.some((p) => p.includes("flowerCount")), true);
  assert.equal(problems.some((p) => p.includes("concealedPungCount")), true);
  assert.equal(problems.some((p) => p.includes("kongSummary.an")), true);
  assert.equal(problems.some((p) => p.includes("kongSummary.ming")), true);
});

test("addStructuredContextProblems handles undefined input safely", () => {
  const problems = [];
  addStructuredContextProblems(undefined, problems);
  assert.deepEqual(problems, []);
});

test("addStructuredContextProblems caps flowerCount at 8", () => {
  const problems = [];
  addStructuredContextProblems({ flowerCount: 9 }, problems);
  assert.equal(problems.some((p) => p.includes("flowerCount")), true);
});

test("addStructuredContextProblems rejects kongSummary total over 4", () => {
  const problems = [];
  addStructuredContextProblems(
    { kongSummary: { an: 3, ming: 2 } },
    problems
  );
  assert.equal(problems.some((p) => p.includes("an+ming")), true);
});
