// Core: Result, Option, Guards, ts-pattern, zod
export {
  // Result
  ok, err, isOk, isErr, mapResult, mapErr, unwrap, unwrapOr, tryCatch, tryCatchAsync,
  // Option
  some, none, isSome, isNone, fromNullable, mapOption, unwrapOption, unwrapOptionOr,
  // Guards
  isString, isNumber, isBoolean, isArray, isObject, isFunction,
  isDefined, isNotNull, isPresent,
  assertType, assertDefined, assertNotNull, assertTrue, exhaustive,
  // ts-pattern
  match, P,
  // zod
  z, ZodError,
} from '@earthlink/core';

export type {
  Result, Ok, Err,
  Option, Some, None,
  ZodType, ZodSchema,
} from '@earthlink/core';

// DateTime
export { DateTime, DateFormat } from '@earthlink/date-time';
export type { DatePair, PartialDatePair } from '@earthlink/date-time';

// String utilities (namespaced to avoid collisions)
export * as StringUtils from '@earthlink/string-utils';

// Logger
export { Logger, createLogger, getLogger } from '@earthlink/logger';
export { LogLevel } from '@earthlink/logger';
export type { LoggerConfig } from '@earthlink/logger';
