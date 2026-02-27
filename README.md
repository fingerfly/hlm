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
- Deploy command standard: `npm run deploy -- build|patch|minor|major`
  - `build`: keep semver, increment build only
  - `patch|minor|major`: bump semver and reset build to `1`

## Scope in this iteration

- Rule baseline is versioned via `ruleVersion` and min fan gate.
- Data contract enforces required context fields and `NEED_CONTEXT`.
- Scoring pipeline includes win validation, fan detection, conflict resolver, and score aggregation.
- Vision V1 uses multi-frame voting + confidence gate with human confirmation fallback.
- End-to-end orchestration outputs scoring result, explanation, and replay log object.

## Run tests

```bash
npm test
```

## Demo

Open `public/index.html` with Live Server in VS Code.

## Release notes

See `CHANGELOG.md` for version history and release details.
