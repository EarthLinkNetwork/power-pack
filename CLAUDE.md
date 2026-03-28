# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pnpm monorepo publishing TypeScript utility libraries under the `@earthlink` npm scope. This is a **public npm package** — never include API keys, tokens, credentials, or any sensitive information.

## Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Build/test individual packages
cd packages/core && pnpm build && pnpm test
cd packages/datetime && pnpm build && pnpm test
cd packages/string-utils && pnpm build && pnpm test
cd packages/logger && pnpm build && pnpm test

# Changesets (version management)
pnpm changeset:add   # or pnpm c:a
pnpm changeset:version  # or pnpm c:v
```

## Architecture

**Monorepo layout (6 packages):**

| Package | Path | Description |
|---------|------|-------------|
| `@earthlink/core` | `packages/core/` | Result/Option types, type guards, re-exports `ts-pattern` (match, P) and `zod` (z, ZodError) |
| `@earthlink/date-time` | `packages/datetime/` | DateTime wrapper around Luxon. 46+ formats, C#-like arithmetic (addDays, addSeconds, etc.), diff, boundary, comparison methods |
| `@earthlink/string-utils` | `packages/string-utils/` | Case transforms, null checks, truncate, slugify, mask, HTML escape, format templates, random strings |
| `@earthlink/logger` | `packages/logger/` | Structured logging via pino. Logger class with child loggers, timing, singleton pattern |
| `@earthlink/eslint-config` | `packages/eslint-config/` | Shared ESLint rules: no switch (use ts-pattern), prefer-const, no-console |
| `@earthlink/power-utils` | `meta-package/` | Aggregator — re-exports everything above. Single install for consumers. |

**Dependency graph:**
```
@earthlink/power-utils (meta)
├── @earthlink/core (ts-pattern, zod)
├── @earthlink/date-time (luxon)
├── @earthlink/string-utils (no external deps)
└── @earthlink/logger (pino)
```

**Build:** TypeScript → CommonJS (ES2020 target), strict mode. Output to `dist/` with `.d.ts` declarations. Shared config in `tsconfig.base.json`.

**Testing:** Jest with ts-jest. Coverage thresholds enforced (95%+ for individual packages). Shared config in `jest.config.base.js`.

**Publishing:** GitHub Actions on push to `main` → `pnpm publish -r --access public`.

## Coding Conventions for Consumers

This package is designed so that installing `@earthlink/power-utils` standardizes the development environment:

- **Use `match()` from ts-pattern instead of `switch` statements.** The ESLint config enforces this.
- **Use `const` exclusively.** Avoid `let`. Use immutable patterns with spread operators and `Object.freeze`.
- **Use `z` (zod) for runtime type validation.** Validate at system boundaries.
- **Use `Result<T, E>` for error handling** instead of throwing exceptions in utility functions.
- **Use `createLogger()` or `getLogger()`** instead of `console.log`.

## Key Patterns

- `DateTime` class provides both instance methods and static equivalents for most operations
- The `.DateTime` getter accesses the underlying Luxon DateTime
- `DateFormat` enum defines all supported format strings
- `Result<T, E>` and `Option<T>` follow Rust-style patterns — use `isOk()`/`isSome()` to discriminate
- Logger uses pino internally — `child()` for adding context, `time()` for performance measurement
- StringUtils are re-exported under a `StringUtils` namespace in the meta-package to avoid name collisions with core guards
