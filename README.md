# Huleme (hlm)

Blueprint implementation for `和了么 - 国标麻将计番助手` (`Huleme - Guobiao Mahjong Fan Calculator`).

## Official naming

- App Store title (CN): `和了么 - 国标麻将计番助手`
- App Store title (EN): `Huleme - Guobiao Mahjong Fan Calculator`
- Repo/package short name: `hlm`
- Internal codename: `hlm`

## Versioning baseline

- Initial app version: `0.1.0`
- Initial build number: `1`
- Version policy: semantic versioning (`MAJOR.MINOR.PATCH`) with separate incrementing build number.
- Deploy command standard: `npm run deploy -- major|minor|patch|build`
  - `build`: keep semver, increment build only
  - `patch|minor|major`: bump semver and reset build to `1`
  - Safety gate: release/build modes now run `npm test` first and require `--confirm` before writing files
  - Remote preflight: deploy checks remote access with
    `git ls-remote` before version or changelog writes
  - Local deploy clone dir:
    - `path.join(TMPDIR|TEMP|TMP|"/tmp", "hlm-deploy")`
    - Example on macOS: `/var/folders/.../T/hlm-deploy`
  - Deploy source folder:
    - project root `02product/01_coding/project/hlm`
  - Deploy flow mirrors Goja:
    - bump version/changelog in source
    - clone or refresh temp deploy repo
    - sync source tree into temp clone
    - commit and push to GitHub `main`
  - Remote defaults by OS:
    - Windows: `https://github.com/fingerfly/hlm.git`
    - macOS/Linux: `git@github.com:fingerfly/hlm.git`
  - Override remote per shell: `HLM_DEPLOY_REMOTE=<remote-url>`
  - Non-destructive remote check:
    - `git ls-remote <your-remote-url> HEAD`
    - Example: `npm run deploy -- patch --confirm`
- Easy-to-remember shortcuts:
  - `npm run release` (interactive selection: `1/2/3/4` or `build/patch/minor/major` + `yes` confirmation)
  - `npm run release -- 3 --confirm` (numeric shortcut for `minor`)
  - `npm run release:build`
  - `npm run release:patch`
  - `npm run release:minor`
  - `npm run release:major`
  - Detailed runbook:
    - `RELEASE_AND_PUBLISH.md`
- Changelog prompt templates (for AI-assisted update workflow):
  - `npm run deploy -- prompt-update`: print strict prompt template for updating `[Unreleased]`
  - `npm run deploy -- prompt-release`: print strict prompt template for release archiving
  - `npm run deploy -- prompt-all`: print both templates in one output
  - `npm run deploy -- prompt-update-agent`: print Cursor Agent pipeline command for update prompt
  - `npm run deploy -- prompt-release-agent`: print Cursor Agent pipeline command for release prompt
  - Shortcut aliases: `npm run prompt:update`, `npm run prompt:release`, `npm run prompt:all`
  - Agent aliases: `npm run prompt:update:agent`, `npm run prompt:release:agent`
  - Run agent directly: `npm run prompt:update:agent:run`, `npm run prompt:release:agent:run`
- Deploy CLI integration coverage (`tests/unit/deployCli.test.js`):
  - invalid mode: prints normalized usage
  - `build`: only increments build number
  - `patch`: bumps patch and resets build to `1`
  - `minor`: bumps minor and resets build to `1`
  - `major`: bumps major and resets build to `1`

## Scope in this iteration

- Rule baseline is versioned via `ruleVersion` and min fan gate.
- Data contract enforces required context fields and `NEED_CONTEXT`.
- Scoring pipeline includes win validation, fan detection, conflict resolver, and score aggregation.
- Primary user path is manual-first: 14 tile codes + context selectors -> scoring -> explanation.
- End-to-end orchestration outputs scoring result, explanation, and replay log object without AI dependency.

## Run tests

```bash
npm test
```

## Demo

Open `public/index.html` with Live Server in VS Code.
- Fill 14 tile slots and context fields, then click `计算番数`.
- GitHub Pages URL: https://fingerfly.github.io/hlm/
- Current Pages deploy source: `.github/workflows/deploy-pages.yml`.
- Current deploy trigger scope includes:
  - `public/**`
  - `src/**`
  - `index.html`
  - `.github/workflows/deploy-pages.yml`
- Current deploy publishes project root (`.`), with root `index.html`
  redirecting to `public/index.html`.
- Migration target state (planned): split test/deploy workflows
  (`test.yml` + `deploy.yml`) in dedicated repo `fingerfly/hlm`.
- Deployment flow diagrams and migration path:
  `DEPLOY_TO_GITHUB_MERMAID.md`.

## Notes

- Photo/VLM spike modules were retired.
- Manual input + rule scoring is the only supported path.
- Tile-code catalog and encoding helpers now live in `src/tiles`.

## Release notes

See `CHANGELOG.md` for version history and release details.
