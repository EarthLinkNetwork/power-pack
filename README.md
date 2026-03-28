# @earthlink/power-utils

All-in-one TypeScript utility toolkit. Install once, get a standardized development environment with DateTime, string utilities, structured logging, pattern matching, schema validation, and more.

**This is a public npm package. No sensitive information (API keys, tokens, credentials) should be included.**

## Install

```bash
npm install @earthlink/power-utils
# or
pnpm add @earthlink/power-utils
```

Or install individual packages:

```bash
npm install @earthlink/core          # Result/Option, ts-pattern, zod
npm install @earthlink/date-time     # DateTime utilities (Luxon wrapper)
npm install @earthlink/string-utils  # String manipulation
npm install @earthlink/logger        # Structured logging (pino wrapper)
npm install @earthlink/eslint-config # Shared ESLint rules
```

## Quick Start

```typescript
import {
  // DateTime
  DateTime, DateFormat,
  // Result type
  ok, err, isOk, tryCatch,
  // Pattern matching (ts-pattern)
  match, P,
  // Schema validation (zod)
  z,
  // Logger
  createLogger, LogLevel,
  // String utilities
  StringUtils,
} from '@earthlink/power-utils';

// DateTime — C#-like date operations
const dt = DateTime.fromString('2024-03-15T10:30:00Z');
const tomorrow = dt.addDays(1);
const diff = dt.diffInHours(tomorrow);      // -24
const formatted = dt.toStringFormat('yyyy/MM/dd'); // "2024/03/15"
console.log(dt.isLeapYear());               // true
console.log(dt.startOfMonth().day);          // 1

// Result type — explicit error handling without exceptions
const result = tryCatch(() => JSON.parse('{"name":"test"}'));
if (isOk(result)) {
  console.log(result.value.name); // "test"
}

// Pattern matching — replace switch with match()
const status = match(response.code)
  .with(200, () => 'success')
  .with(404, () => 'not found')
  .with(P.number.gte(500), () => 'server error')
  .otherwise(() => 'unknown');

// Zod — runtime type validation
const UserSchema = z.object({
  name: z.string(),
  age: z.number().min(0),
});
const user = UserSchema.parse({ name: 'Taro', age: 25 });

// Logger — structured logging via pino
const logger = createLogger({ name: 'my-app', level: 'info' });
logger.info('Server started', { port: 3000 });
const child = logger.child({ requestId: 'abc-123' });
child.info('Processing request');
const end = logger.time('db-query');
// ... do work ...
end(); // logs "db-query completed in 42ms"

// String utilities
StringUtils.toCamelCase('hello_world');      // "helloWorld"
StringUtils.slugify('Hello World!');          // "hello-world"
StringUtils.mask('4111111111111111', 4, 4);  // "4111********1111"
StringUtils.isNullOrEmpty(null);             // true
StringUtils.escapeHtml('<script>alert("xss")</script>');
```

## Packages

### @earthlink/core

Foundational types and re-exported libraries.

| Category | Exports |
|----------|---------|
| **Result** | `ok`, `err`, `isOk`, `isErr`, `mapResult`, `mapErr`, `unwrap`, `unwrapOr`, `tryCatch`, `tryCatchAsync` |
| **Option** | `some`, `none`, `isSome`, `isNone`, `fromNullable`, `mapOption`, `unwrapOption`, `unwrapOptionOr` |
| **Guards** | `isString`, `isNumber`, `isBoolean`, `isArray`, `isObject`, `isFunction`, `isDefined`, `isNotNull`, `isPresent` |
| **Assertions** | `assertType`, `assertDefined`, `assertNotNull`, `assertTrue`, `exhaustive` |
| **ts-pattern** | `match`, `P` |
| **zod** | `z`, `ZodError`, `ZodType`, `ZodSchema` |

### @earthlink/date-time

DateTime class wrapping Luxon with C#-like API.

| Category | Methods |
|----------|---------|
| **Arithmetic** | `addMinutes()`, `addHours()`, `addDays()`, `addMonths()`, `addYears()`, `addSeconds()` |
| **Diff** | `diffInSeconds()`, `diffInMinutes()`, `diffInHours()`, `diffInDays()`, `diffInMonths()`, `diffInYears()` |
| **Boundary** | `startOfDay()`, `endOfDay()`, `startOfMonth()`, `endOfMonth()` |
| **Comparison** | `isBefore()`, `isAfter()`, `isSameDay()`, `equals()`, `compare()` |
| **Calendar** | `daysInMonth()`, `isLeapYear()`, `daysInMonthOf()`, `isLeapYearOf()` |
| **Format** | `toStringFormat()`, `getFormattedStringWithHyphen()`, `getDateOnlyWithSlash()`, ... (46+ formats via `DateFormat` enum) |
| **Factory** | `fromString()`, `fromLuxonDateTime()`, `now()`, `tryParse()` |
| **Getters** | `year`, `month`, `day`, `hour`, `minute`, `second`, `dayOfWeek` |

### @earthlink/string-utils

| Category | Functions |
|----------|-----------|
| **Case** | `toCamelCase`, `toPascalCase`, `toSnakeCase`, `toKebabCase`, `toTitleCase`, `toConstantCase`, `toUpperCase`, `toLowerCase` |
| **Checks** | `isNullOrEmpty`, `isNullOrWhiteSpace`, `isNotNullOrEmpty`, `isNotNullOrWhiteSpace` |
| **Transform** | `truncate`, `padLeft`, `padRight`, `slugify`, `mask`, `reverse`, `countOccurrences` |
| **Format** | `format` (positional), `formatNamed` (named), `template` (reusable) |
| **HTML** | `escapeHtml`, `unescapeHtml` |
| **Random** | `createRandomString` |

### @earthlink/logger

| Export | Description |
|--------|-------------|
| `Logger` | Class with `trace`, `debug`, `info`, `warn`, `error`, `fatal` methods |
| `createLogger(config?)` | Create a new logger instance |
| `getLogger(config?)` | Singleton logger (created once, reused) |
| `Logger.child(bindings)` | Create child logger with bound context |
| `Logger.time(label)` | Performance timer — returns a stop function |
| `LogLevel` | Enum: TRACE, DEBUG, INFO, WARN, ERROR, FATAL |

### @earthlink/eslint-config

Shared ESLint rules for the ELN ecosystem:

- **No `switch` statements** — use `match()` from ts-pattern instead
- **`prefer-const`** — avoid `let`, embrace immutability
- **`no-console`** — use `@earthlink/logger` instead (warn/error allowed)
- **TypeScript strict** — no unused vars, warn on `any`

```json
{
  "extends": "@earthlink/eslint-config"
}
```

## Development

```bash
pnpm install    # Install dependencies
pnpm build      # Build all packages
pnpm test       # Run all tests (516 tests, 100% coverage)
```

## License

MIT
