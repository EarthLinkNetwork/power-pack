export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function isPresent<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function assertType<T>(value: unknown, predicate: (v: unknown) => v is T, message?: string): asserts value is T {
  if (!predicate(value)) {
    throw new TypeError(message ?? `Type assertion failed`);
  }
}

export function assertDefined<T>(value: T | undefined, message?: string): asserts value is T {
  if (value === undefined) {
    throw new TypeError(message ?? 'Expected value to be defined');
  }
}

export function assertNotNull<T>(value: T | null, message?: string): asserts value is T {
  if (value === null) {
    throw new TypeError(message ?? 'Expected value to be non-null');
  }
}

export function assertTrue(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Assertion failed');
  }
}

export function exhaustive(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
