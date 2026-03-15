# HLM Release and Publish Runbook

This runbook is the canonical step-by-step guide to upgrade version and
publish `hlm`.

## Scope

- Repository: `02product/01_coding/project/hlm`
- Release script: `scripts/deploy.js`
- Deploy target repo: `fingerfly/hlm`
- Site URL: `https://fingerfly.github.io/hlm/`

## Prerequisites

- You are in project root:
  - `cd 02product/01_coding/project/hlm`
- Git remote access works:
  - `git ls-remote git@github.com:fingerfly/hlm.git HEAD`
- If needed, override deploy remote for current shell:
  - `export HLM_DEPLOY_REMOTE=<ssh-or-https-remote>`

## What the release script enforces

- Runs `npm test` before writing release files.
- Requires `--confirm` for non-interactive release commands.
- Performs remote preflight with `git ls-remote`.
- Pushes release commit to `fingerfly/hlm` `main`.

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
```

## What changes on successful release

- `src/config/appVersion.js` is updated.
- `package.json` version is updated for patch/minor/major.
- `CHANGELOG.md` archives `[Unreleased]` for patch/minor/major.
- Release commit is pushed to deploy repo.

## Post-release verification checklist

- Confirm remote has latest commit:
  - `git ls-remote <deploy-remote> HEAD`
- Confirm GitHub Pages build/deploy is successful in Actions.
- Open and verify site:
  - `https://fingerfly.github.io/hlm/`
- Smoke-check core flow in UI:
  - tile entry -> context -> `计算番数`.

## Troubleshooting

- Missing `--confirm`:
  - rerun with `--confirm`.
- Remote preflight failure:
  - set `HLM_DEPLOY_REMOTE` to a reachable SSH/HTTPS remote.
- Tests fail:
  - fix failures locally, rerun `npm test`, then retry release.
- No changes to deploy:
  - script exits safely with "Everything is up to date."
