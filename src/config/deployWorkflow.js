const RELEASE_MODES = new Set(["build", "patch", "minor", "major"]);

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function normalizeReleaseToken(value) {
  const modeMap = {
    "1": "build",
    "2": "patch",
    "3": "minor",
    "4": "major",
    build: "build",
    patch: "patch",
    minor: "minor",
    major: "major"
  };
  const key = String(value || "").trim();
  return modeMap[key] || key;
}

export function selectReleaseModeArg(extraArgs) {
  return extraArgs
    .filter((arg) => !arg.startsWith("--"))
    .map((arg) => normalizeReleaseToken(arg))
    .find((arg) => RELEASE_MODES.has(arg));
}

export function archiveUnreleasedToRelease(source, releaseVersion, releaseDate) {
  const text = source.replace(/\r\n/g, "\n");
  const heading = `## [${releaseVersion}] - ${releaseDate}`;
  if (text.includes(heading)) {
    return text;
  }
  const unreleased = text.match(/^## \[Unreleased\](?: - [^\n]+)?\n/m);
  if (!unreleased || unreleased.index == null) {
    return text;
  }

  const headingStart = unreleased.index;
  const headingEnd = headingStart + unreleased[0].length;
  const afterHeading = text.slice(headingEnd);
  const nextHeadingOffset = afterHeading.search(/^## \[/m);
  const bodyEnd = nextHeadingOffset === -1
    ? text.length
    : headingEnd + nextHeadingOffset;
  const unreleasedBody = text.slice(headingEnd, bodyEnd).trim();
  const before = text.slice(0, headingStart);
  const after = text.slice(bodyEnd).replace(/^\n+/, "");
  const releaseBody = unreleasedBody.length > 0 ? `${unreleasedBody}\n\n` : "";

  return [
    `${before}## [Unreleased]\n\n`,
    `${heading}\n\n`,
    releaseBody,
    after
  ].join("");
}

export function parseAppVersionState(appVersionSource) {
  const versionMatch = appVersionSource.match(/APP_VERSION = "([^"]+)"/);
  const buildMatch = appVersionSource.match(/APP_BUILD = (\d+)/);
  if (!versionMatch || !buildMatch) {
    throw new Error(
      "Unable to parse APP_VERSION / APP_BUILD " +
      "from src/config/appVersion.js"
    );
  }
  return {
    appVersion: versionMatch[1],
    appBuild: Number.parseInt(buildMatch[1], 10)
  };
}

export function updateAppVersionSource(appVersionSource, next) {
  return appVersionSource
    .replace(/APP_VERSION = "[^"]+"/, `APP_VERSION = "${next.appVersion}"`)
    .replace(/APP_BUILD = \d+/, `APP_BUILD = ${next.appBuild}`);
}
