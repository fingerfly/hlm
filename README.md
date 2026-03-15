# Huleme (hlm)

Blueprint implementation for `胡了么 - 国标麻将计番助手` (`Huleme - Guobiao Mahjong Fan Calculator`).

## Official naming

- App Store title (CN): `胡了么 - 国标麻将计番助手`
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
- Pages deploy source: GitHub Actions workflow
  `.github/workflows/deploy-pages.yml` publishes `public/`.

## DeepSeek VLM spike

- Separate spike module lives in `src/spike/vlm` with tests under `tests/spike`.
- Run spike tests:
```bash
npm run test:spike
```
- Run one image through DeepSeek VLM:
```bash
DEEPSEEK_API_KEY=your_key npm run spike:vlm -- /absolute/path/to/image.jpg
```
- Or create local config once (auto-loaded by spike scripts):
```bash
cp .env.example .env
```
- Optional model override (useful if one model returns non-JSON prose):
```bash
DEEPSEEK_API_KEY=your_key DEEPSEEK_MODEL=deepseek-chat npm run spike:vlm -- /absolute/path/to/image.jpg
```
- Optional provider mode:
```bash
DEEPSEEK_API_KEY=your_key VLM_PROVIDER=deepseek_vl2 npm run spike:vlm -- /absolute/path/to/image.jpg
```
- Ollama provider mode (Qwen3-VL 4B local):
```bash
VLM_PROVIDER=ollama_qwen3vl OLLAMA_MODEL=qwen3-vl:4b npm run spike:vlm -- /absolute/path/to/image.jpg
```
- If Ollama service is not running:
```bash
ollama service
```
- If the model is missing:
```bash
ollama pull qwen3-vl:4b
```
- Optional self-consistency voting pass count (default `1`, allowed `1..5`):
```bash
DEEPSEEK_API_KEY=your_key VLM_VOTE_PASSES=3 npm run spike:vlm -- /absolute/path/to/image.jpg
```
- Optional preprocessing (default off) for A/B experiments:
```bash
DEEPSEEK_API_KEY=your_key VLM_PREPROCESS=1 npm run spike:vlm -- /absolute/path/to/image.jpg
```
- Optional preprocess tuning knobs:
  - `VLM_PRE_CROP_BOTTOM_RATIO` (default `0.4`, range `0.2..0.8`)
  - `VLM_PRE_CONTRAST` (default `0.12`, range `-1..1`)
  - `VLM_PRE_BRIGHTNESS` (default `0.02`, range `-1..1`)
- Recommended current spike baseline (best observed on first10 set):
```bash
DEEPSEEK_API_KEY=your_key \
VLM_PREPROCESS=1 \
VLM_PRE_CROP_BOTTOM_RATIO=0.35 \
VLM_PRE_CONTRAST=0.08 \
VLM_PRE_BRIGHTNESS=0.00 \
VLM_VOTE_PASSES=1 \
npm run spike:auto
```
- Supported provider values: `deepseek_text` (default), `deepseek_vl2`, `ollama_qwen3vl`.
- Config load order: shell env vars > `.env.local` > `.env`.
- Batch-run all images in `tests/spike/images` and write per-image JSON to `tests/spike/results`:
```bash
DEEPSEEK_API_KEY=your_key VLM_PROVIDER=deepseek_vl2 npm run spike:batch
```
- Keep historical JSON files instead of cleaning old results:
```bash
DEEPSEEK_API_KEY=your_key VLM_PROVIDER=deepseek_vl2 npm run spike:batch -- tests/spike/images tests/spike/results --keep-old
```
- Auto-fill key columns in `tests/spike/first10_eval_template.csv` from `tests/spike/results/*.json`:
```bash
npm run spike:fill-eval
```
- To enable true accuracy scoring, fill `gt_tiles` per row using space-separated codes (example: `1W 2W 3W ... Wh`).
- Centralized tile-code mapping (including flower tiles) is stored in:
  - `src/spike/vlm/tileCodes.js`
- Compatibility policy for tile codes:
  - Canonical flower codes: `Ch Xi Qi Do Mm La Zh Ju`
  - Legacy aliases accepted on ingest only: `F1..F4 -> Ch..Do`, `J1..J4 -> Mm..Ju`
  - Outputs use canonical codes after validation/normalization
- Layered internal encoding (`encodingVersion: "v1"`):
  - Tile IDs: fixed `0..41` order from `tileCodes.js`
  - 14-tile hand: `Uint8Array(14)`
  - Uncertainty mask: `uint16` low 14 bits only
  - Mask semantics: bit `i` maps to tile index `i` (`0..13`)
- Once `gt_tiles` is present, auto-fill computes:
  - `exact_match_14` (`Y/N`)
  - `position_accuracy` (0.00-1.00)
  - `tile_set_accuracy` (0.00-1.00)
  - `tb_recall` (条/筒召回率, 0.00-1.00)
- Generate summary for the current image-set sample IDs:
```bash
npm run spike:summary
```
- Run full pipeline in one command (batch -> fill-eval -> summary):
```bash
DEEPSEEK_API_KEY=your_key VLM_PROVIDER=deepseek_vl2 npm run spike:auto
```
- Run full pipeline with Ollama Qwen3-VL 4B:
```bash
VLM_PROVIDER=ollama_qwen3vl OLLAMA_MODEL=qwen3-vl:4b npm run spike:auto
```
- Run repeated trials and compute mean/std metrics across runs:
```bash
DEEPSEEK_API_KEY=your_key VLM_PROVIDER=deepseek_vl2 npm run spike:repeat -- 5
```
  - Output report: `tests/spike/results/repeat_stats.json`
- Optional path override order:
  - `spike:batch -- <imageDir> <resultDir> [--keep-old]`
  - `spike:fill-eval -- <csvPath> <resultDir> <imageDir>`
  - `spike:summary -- <imageDir> <resultDir> <summaryPath>`
  - `spike:auto -- <imageDir> <resultDir> <csvPath> <summaryPath>`
  - `spike:repeat -- <repeat> <imageDir> <resultDir> <csvPath> <summaryPath> <outputPath>`
- If cloud call fails, output now includes diagnostics:
  - `code: "PROVIDER_HTTP_ERROR"`
  - `providerHttpStatus`
  - `providerBodyPreview` (trimmed provider error body)
- First 10-sample validation assets:
  - `tests/spike/first10_capture_checklist.md`
  - `tests/spike/first10_eval_template.csv`

## Release notes

See `CHANGELOG.md` for version history and release details.
