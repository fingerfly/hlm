const DEPLOY_MODES = new Set(["major", "minor", "patch", "build"]);

export function assertDeployMode(mode) {
  if (!DEPLOY_MODES.has(mode)) {
    throw new Error("Mode must be one of: major | minor | patch | build");
  }
}

export function bumpSemver(version, mode) {
  const parts = version.split(".");
  if (parts.length !== 3) {
    throw new Error(`Invalid semver version: ${version}`);
  }
  const [major, minor, patch] = parts.map((n) => Number.parseInt(n, 10));
  if ([major, minor, patch].some((n) => Number.isNaN(n) || n < 0)) {
    throw new Error(`Invalid semver version: ${version}`);
  }

  if (mode === "patch") return `${major}.${minor}.${patch + 1}`;
  if (mode === "minor") return `${major}.${minor + 1}.0`;
  if (mode === "major") return `${major + 1}.0.0`;
  throw new Error(`Unsupported semver bump mode: ${mode}`);
}

export function nextVersionState(current, mode) {
  assertDeployMode(mode);
  if (mode === "build") {
    return {
      appVersion: current.appVersion,
      appBuild: current.appBuild + 1
    };
  }

  return {
    appVersion: bumpSemver(current.appVersion, mode),
    appBuild: 1
  };
}

export function formatDeploySummary(result) {
  const mode = String(result?.mode || "");
  const previousVersion = String(result?.previous?.appVersion || "");
  const previousBuild = String(result?.previous?.appBuild || "");
  const nextVersion = String(result?.next?.appVersion || "");
  const nextBuild = String(result?.next?.appBuild || "");
  return [
    "版本升级完成",
    `升级模式: ${mode}`,
    `应用版本: ${previousVersion} -> ${nextVersion}`,
    `构建号: ${previousBuild} -> ${nextBuild}`
  ].join("\n");
}
