const DEPLOY_MODES = new Set(["build", "patch", "minor", "major"]);

export function assertDeployMode(mode) {
  if (!DEPLOY_MODES.has(mode)) {
    throw new Error("Mode must be one of: build | patch | minor | major");
  }
}

export function bumpSemver(version, mode) {
  const [major, minor, patch] = version.split(".").map((n) => Number.parseInt(n, 10));
  if ([major, minor, patch].some(Number.isNaN)) {
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
