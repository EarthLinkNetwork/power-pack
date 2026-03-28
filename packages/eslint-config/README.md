# @earthlink/eslint-config

Shared ESLint configuration for the ELN ecosystem.

## Rules enforced

- **No switch statements**: Use `ts-pattern` `match()` instead. Import from `@earthlink/core`.
- **const only**: `prefer-const` and `no-var` are errors. Avoid `let` where possible.
- **No console.log**: Use `@earthlink/logger` instead. `console.warn` and `console.error` are allowed.
- **TypeScript strict**: No unused vars, warn on `any`.

## Usage

Install peer dependencies:
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

In your `.eslintrc.json`:
```json
{
  "extends": "@earthlink/eslint-config"
}
```

Or in `eslint.config.mjs` (flat config):
```js
import earthlinkConfig from "@earthlink/eslint-config";
export default [earthlinkConfig];
```
