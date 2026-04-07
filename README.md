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
  - Deploy doctor (non-mutating diagnostics):
    - `npm run release:doctor`
    - reports origin remote, expected repo, resolved deploy remote,
      mismatch warning (if detected), and preflight result
  - Dry-run release (non-mutating):
    - `npm run deploy -- minor --dry-run`
    - runs preflight and prints version summary without file writes/push
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
  - Remote defaults and protocol policy:
    - Auto-detected from local `git remote origin` when available
    - Deploy follows origin transport when detectable (SSH origin -> SSH
      deploy remote, HTTPS origin -> HTTPS deploy remote).
    - Fallback when origin unavailable: Windows uses HTTPS, macOS uses SSH.
    - Transport mismatch prints warning; you can override explicitly with
      `HLM_DEPLOY_REMOTE`
  - Override expected repo template:
    - `HLM_DEPLOY_REPO=<owner>/<repo>`
  - Override remote per shell: `HLM_DEPLOY_REMOTE=<remote-url>`
  - Optional persistent deploy clone dir (default: `$TMPDIR/hlm-deploy`):
    `HLM_DEPLOY_DIR=/absolute/path/to/hlm-deploy` — reduces re-clone after
    temp cleanup; first run creates the clone there.
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
  - `npm run release:doctor` (non-mutating diagnostics)
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
- Deploy CLI/runtime coverage:
  - invalid mode: prints normalized usage
  - `build`: only increments build number
  - `patch`: bumps patch and resets build to `1`
  - `minor`: bumps minor and resets build to `1`
  - `major`: bumps major and resets build to `1`
  - `doctor`: prints diagnostics without file mutation
  - `--dry-run`: prints release summary without writes/push
  - transport mismatch warnings and protocol-specific preflight hints
  - Test suites:
    - `tests/unit/deployCli.release.core.test.js`
    - `tests/unit/deployCli.release.bump.test.js`
    - `tests/unit/deployCli.prompts.test.js`
    - `tests/unit/deployRuntime.test.js`

## Scope in this iteration

- Rule baseline is versioned via `ruleVersion` and min fan gate.
- Data contract enforces required context fields and `NEED_CONTEXT`.
- Scoring pipeline includes win validation, fan detection, conflict resolver, and score aggregation.
- Primary user path is manual-first: 14 tile codes + context selectors -> scoring -> explanation.
- End-to-end orchestration outputs scoring result, explanation, and replay log object without AI dependency.

## Run tests

```bash
npx playwright install chromium webkit   # once per machine (browser binaries)
npm test                          # unit + regression + integration + e2e
```

E2E uses Playwright against a local `dist/` static server (`scripts/e2eStaticServe.mjs`)
so `/public/index.html` asset URLs resolve correctly.

## Demo

Open `public/index.html` with Live Server in VS Code.
- Fill 14 tile slots and context fields, then click `计算番数`.
- GitHub Pages URL: `https://<owner>.github.io/<repo>/`
- Current Pages deploy source: `.github/workflows/deploy-pages.yml`.
- Current deploy trigger scope includes:
  - `public/**`
  - `src/**`
  - `index.html`
  - `scripts/buildDist.js`
  - `package.json`
  - `.github/workflows/deploy-pages.yml`
- Current deploy builds runtime-only artifact via
  `npm run build:dist` and publishes `dist/`.
- Runtime deploy artifact contains `index.html`, `public/`, and `src/`
  only (non-runtime files are excluded).
- `public/` is the maintainable source tree; `dist/` is generated
  artifact output and should not be hand-edited.
- Security scan workflow runs on `push`/`pull_request`:
  `.github/workflows/security-scan.yml`.
- Migration target state (planned): split test/deploy workflows
  (`test.yml` + `deploy.yml`) in dedicated repo `<owner>/<repo>`.
- Deployment flow diagrams and migration path:
  `DEPLOY_TO_GITHUB_MERMAID.md`.

## Notes

- Photo/VLM spike modules were retired.
- Manual input + rule scoring is the only supported path.
- Tile-code catalog and encoding helpers now live in `src/tiles`.

## Release notes

See `CHANGELOG.md` for version history and release details.
