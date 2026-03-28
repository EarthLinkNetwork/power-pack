/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // Enforce ts-pattern match() over switch statements
    "no-restricted-syntax": [
      "error",
      {
        selector: "SwitchStatement",
        message: "Use ts-pattern match() instead of switch. Import { match } from '@earthlink/core'.",
      },
    ],
    // Enforce const over let
    "prefer-const": "error",
    "no-var": "error",
    // TypeScript strict practices
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    // No console in production
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
};
