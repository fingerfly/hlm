import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { deployScriptPath, rootDir } from "../helpers/deploySandbox.js";

test("deploy CLI prints normalized usage for invalid mode", () => {
  const run = spawnSync(process.execPath, [deployScriptPath, "bad-mode"], {
    cwd: rootDir,
    encoding: "utf8"
  });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /npm run deploy -- major\|minor\|patch\|build/);
});

test("deploy CLI prints embedded changelog update prompt template", () => {
  const run = spawnSync(process.execPath, [deployScriptPath, "prompt-update"], {
    cwd: rootDir,
    encoding: "utf8"
  });
  assert.equal(run.status, 0);
  assert.match(run.stdout, /\[Unreleased\]/);
  assert.match(run.stdout, /Added \/ Changed \/ Fixed/);
  assert.match(run.stdout, /npm test/);
});

test("deploy CLI prints embedded changelog release prompt template", () => {
  const run = spawnSync(process.execPath, [deployScriptPath, "prompt-release"], {
    cwd: rootDir,
    encoding: "utf8"
  });
  assert.equal(run.status, 0);
  assert.match(run.stdout, /package\.json/);
  assert.match(run.stdout, /src\/config\/appVersion\.js/);
  assert.match(run.stdout, /\[Unreleased\]/);
  assert.match(run.stdout, /今天日期/);
});

test("deploy CLI prints both prompt templates with prompt-all mode", () => {
  const run = spawnSync(process.execPath, [deployScriptPath, "prompt-all"], {
    cwd: rootDir,
    encoding: "utf8"
  });
  assert.equal(run.status, 0);
  assert.match(run.stdout, /=== prompt-update ===/);
  assert.match(run.stdout, /=== prompt-release ===/);
  assert.match(run.stdout, /Added \/ Changed \/ Fixed/);
  assert.match(run.stdout, /package\.json/);
});

test("deploy CLI prints cursor agent pipeline command for update prompt", () => {
  const run = spawnSync(
    process.execPath,
    [deployScriptPath, "prompt-update-agent"],
    {
      cwd: rootDir,
      encoding: "utf8"
    }
  );
  assert.equal(run.status, 0);
  assert.match(run.stdout, /cursor agent --print --mode ask/);
  assert.match(run.stdout, /CHANGELOG\.md 的 \[Unreleased\]/);
});
