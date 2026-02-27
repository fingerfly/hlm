import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { assertDeployMode, nextVersionState } from "../src/config/versioning.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const mode = process.argv[2];

try {
  assertDeployMode(mode);
} catch (error) {
  console.error(`Invalid usage: npm run deploy -- build|patch|minor|major\n${error.message}`);
  process.exit(1);
}

const packageJsonPath = join(rootDir, "package.json");
const appVersionPath = join(rootDir, "src/config/appVersion.js");

const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const appVersionSource = readFileSync(appVersionPath, "utf8");

const versionMatch = appVersionSource.match(/APP_VERSION = "([^"]+)"/);
const buildMatch = appVersionSource.match(/APP_BUILD = (\d+)/);
if (!versionMatch || !buildMatch) {
  console.error("Unable to parse APP_VERSION / APP_BUILD from src/config/appVersion.js");
  process.exit(1);
}

const current = {
  appVersion: versionMatch[1],
  appBuild: Number.parseInt(buildMatch[1], 10)
};

const next = nextVersionState(current, mode);

const updatedVersionSource = appVersionSource
  .replace(/APP_VERSION = "[^"]+"/, `APP_VERSION = "${next.appVersion}"`)
  .replace(/APP_BUILD = \d+/, `APP_BUILD = ${next.appBuild}`);

writeFileSync(appVersionPath, updatedVersionSource, "utf8");

if (mode !== "build") {
  pkg.version = next.appVersion;
  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
}

console.log(
  JSON.stringify(
    {
      mode,
      previous: current,
      next
    },
    null,
    2
  )
);
