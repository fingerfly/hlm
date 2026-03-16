# AGENTS.md

Coding agent instructions for the HLM (Huleme) codebase - a Chinese Mahjong scoring calculator.

## Project Overview

- Package: `hlm` (ES Module, `"type": "module"`)
- Node.js test runner (no external test framework)
- No linting or type-checking tools configured

## Build/Lint/Test Commands

```bash
npm test                           # Run all tests
npm run test:unit                  # Unit tests only
npm run test:regression           # Regression tests
npm run test:integration          # Integration tests
node --test tests/unit/scoringEngine.test.js  # Single test file
node --test --test-name-pattern="scoreHand" tests/unit/scoringEngine.test.js  # Pattern match
npm run quality:complexity        # Complexity analysis
npm run release                    # Interactive release
npm run release:patch              # Patch version bump
```

## File Structure

```
hlm/
├── public/               # Browser UI (HTML, CSS, JS modules)
├── src/
│   ├── app/              # Application state/UI logic
│   ├── config/           # Configuration, version constants
│   ├── contracts/        # Input validation contracts
│   ├── rules/            # Mahjong scoring rules
│   └── tiles/            # Canonical tile catalog + encoding utilities
├── tests/
│   ├── helpers/          # Test helper utilities
│   └── unit/             # Unit tests
└── scripts/              # Deployment scripts
```

## Code Style Guidelines

### JavaScript/Module Conventions

- ES Modules only: Use `import/export`, no `require()`
- File extension: Always include `.js` in imports: `import { foo } from "./bar.js"`
- Named exports preferred over default exports
- No classes: Use plain functions and objects

### Imports Order

```javascript
// 1. Node.js built-ins
import { readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

// 2. External modules
import { Jimp } from "jimp";

// 3. Local modules (relative paths with .js extension)
import { RULE_BASELINE } from "../config/ruleBaseline.js";
import { validateHandInput } from "./handState.js";
```

### Constants and Enums

```javascript
// Use Object.freeze for immutable constants
export const RULE_BASELINE = Object.freeze({
  ruleVersion: "MCR-SPORTS-GENERAL-ADMIN-2018",
  minWinningFan: 1
});

// Enums use Set or frozen arrays
const ALLOWED_STATUS = new Set(["accepted", "need_human_confirm", "failed"]);
export const WIN_TYPES = Object.freeze(["zimo", "dianhe"]);
```

### Naming Conventions

- Files: `camelCase.js`
- Functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Factory functions: `createXxx` prefix
- Validation functions: `validateXxx` prefix
- Assertions: `assertXxx` prefix

### Error Handling Pattern

```javascript
// Return result objects for validation; don't throw
export function validateHandInput(input = {}) {
  const problems = [];
  if (!Array.isArray(input.tiles) || input.tiles.length !== 14) {
    problems.push("tiles must contain 14 tile codes");
  }
  if (problems.length > 0) {
    return { ok: false, code: ERROR_CODES.INVALID_INPUT, problems, missingFields: [] };
  }
  return { ok: true, code: null, problems: [], missingFields: [] };
}

// Throw for programmer errors only
export function assertDeployMode(mode) {
  if (!DEPLOY_MODES.has(mode)) {
    throw new Error("Mode must be one of: major | minor | patch | build");
  }
}
```

### Testing Conventions

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { functionName } from "../../src/module/path.js";

test("descriptive test name", () => {
  const result = functionName(input);
  assert.equal(result.ok, true);
});

// Use t.after() for cleanup
test("test with cleanup", (t) => {
  const sandbox = prepareSandbox();
  t.after(() => rmSync(sandbox, { recursive: true, force: true }));
});
```

### Module Header Comments

```javascript
/**
 * Purpose: One-line description.
 * Description:
 *   - Multi-line details.
 *   - Key design decisions.
 */
```

## Key Domain Concepts

- Tiles: Codes like `1W` (1 Wan), `Ch` (Chun/Red Dragon)
- Context fields: `winType`, `handState`, `kongType`, `timingEvent` - required for scoring
- Fan/番: Scoring unit; minimum 1 fan to win
- Rule baseline: `MCR-SPORTS-GENERAL-ADMIN-2018`

## Validation Contracts

- `src/contracts/handState.js`: Input validation for hand scoring
- Validate at module boundaries; internal functions assume valid data

## Notes for Agents

1. Run tests after changes: `npm test` or `npm run test:unit`
2. No type checker or formatter - match existing code style
3. Node.js 18+ - project uses modern Node.js APIs
4. Chinese domain terms: 和牌, 番种, 自摸, 点和 - keep Chinese where appropriate