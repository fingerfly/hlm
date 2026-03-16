# HLM Release and Publish Runbook

This runbook is the canonical step-by-step guide to upgrade version and
publish `hlm`.

## Scope

- Repository: `02product/01_coding/project/hlm`
- Release script: `scripts/deploy.js`
- Deploy target repo: `<owner>/<repo>`
- Site URL: `https://<owner>.github.io/<repo>/`

## Prerequisites

- You are in project root:
  - `cd 02product/01_coding/project/hlm`
- Git remote access works:
  - `git ls-remote <your-remote-url> HEAD`
- Default deploy repo behavior:
  - auto-detect from local `git remote origin` when available
  - fallback to `owner/repo` template when origin is unavailable
- Optional explicit expected repo override:
  - PowerShell: `$env:HLM_DEPLOY_REPO="<owner>/<repo>"`
  - Bash: `export HLM_DEPLOY_REPO=<owner>/<repo>`
- If needed, override deploy remote for current shell:
  - PowerShell: `$env:HLM_DEPLOY_REMOTE="<ssh-or-https-remote>"`
  - Bash: `export HLM_DEPLOY_REMOTE=<ssh-or-https-remote>`

## What the release script enforces

- Runs `npm test` before writing release files by default.
- Supports `--skip-tests` for explicit fast-path releases when
  tests have already been verified.
- Requires `--confirm` for non-interactive release commands.
- Performs remote preflight with `git ls-remote`.
- Pushes release commit to `<owner>/<repo>` `main`.

## Choose release type

- `build`: keep semver, increment build number only.
- `patch`: bump patch and reset build to `1`.
- `minor`: bump minor and reset build to `1`.
- `major`: bump major and reset build to `1`.

## Fast commands (recommended)

```bash
npm run release:build
npm run release:patch
npm run release:minor
npm run release:major
```

## Interactive command

```bash
npm run release
```

Then select:

- `1` = build
- `2` = patch
- `3` = minor
- `4` = major

Confirm by typing `yes`.

## One-line direct command examples

```bash
npm run deploy -- build --confirm
npm run deploy -- patch --confirm
npm run deploy -- minor --confirm
npm run deploy -- major --confirm
npm run deploy -- minor --confirm --skip-tests
```

## What changes on successful release

- `src/config/appVersion.js` is updated.
- `package.json` version is updated for patch/minor/major.
- `CHANGELOG.md` archives `[Unreleased]` for patch/minor/major.
- Release commit is pushed to deploy repo.

## Post-release verification checklist

- Confirm remote has latest commit:
  - `git ls-remote <deploy-remote> HEAD`
- Confirm security scan workflow passes on latest commit:
  - `.github/workflows/security-scan.yml`
- Confirm GitHub Pages build/deploy is successful in Actions.
- Open and verify site:
  - `https://<owner>.github.io/<repo>/`
- Confirm deploy workflow uploaded runtime-only `dist/` artifact.
- Smoke-check core flow in UI:
  - tile entry -> context -> `计算番数`.

## Troubleshooting

- Missing `--confirm`:
  - rerun with `--confirm`.
- Remote preflight failure:
  - set `HLM_DEPLOY_REMOTE` or `HLM_DEPLOY_REPO` in your shell.
- Tests fail:
  - fix failures locally, rerun `npm test`, then retry release.
- Skip tests explicitly:
  - use `--skip-tests` only when full test gates already passed in
    current change window.
- No changes to deploy:
  - script exits safely with "Everything is up to date."
