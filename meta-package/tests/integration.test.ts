/**
 * Integration tests to verify all re-exports from @earthlink/power-utils work.
 */

describe('@earthlink/power-utils integration', () => {
  test('core - Result exports', () => {
    const { ok, err, isOk, isErr, unwrap, unwrapOr, mapResult, tryCatch } = require('../src');

    const success = ok(42);
    expect(isOk(success)).toBe(true);
    expect(unwrap(success)).toBe(42);

    const failure = err(new Error('fail'));
    expect(isErr(failure)).toBe(true);
    expect(unwrapOr(failure, 0)).toBe(0);

    const mapped = mapResult(success, (v: number) => v * 2);
    expect(unwrap(mapped)).toBe(84);

    const caught = tryCatch(() => JSON.parse('{"a":1}'));
    expect(isOk(caught)).toBe(true);
  });

  test('core - Option exports', () => {
    const { some, none, isSome, isNone, fromNullable, unwrapOption } = require('../src');

    const s = some(10);
    expect(isSome(s)).toBe(true);
    expect(unwrapOption(s)).toBe(10);

    const n = none();
    expect(isNone(n)).toBe(true);

    expect(isSome(fromNullable('hello'))).toBe(true);
    expect(isNone(fromNullable(null))).toBe(true);
  });

  test('core - Guards exports', () => {
    const { isString, isNumber, isBoolean, isPresent, assertTrue } = require('../src');

    expect(isString('hello')).toBe(true);
    expect(isNumber(42)).toBe(true);
    expect(isBoolean(true)).toBe(true);
    expect(isPresent('value')).toBe(true);
    expect(() => assertTrue(false)).toThrow();
  });

  test('core - ts-pattern re-export', () => {
    const { match, P } = require('../src');

    const result = match(42)
      .with(P.number, (n: number) => `number: ${n}`)
      .otherwise(() => 'other');
    expect(result).toBe('number: 42');
  });

  test('core - zod re-export', () => {
    const { z } = require('../src');

    const schema = z.object({ name: z.string() });
    const result = schema.safeParse({ name: 'test' });
    expect(result.success).toBe(true);
  });

  test('DateTime export', () => {
    const { DateTime, DateFormat } = require('../src');

    expect(DateTime).toBeDefined();
    expect(DateFormat).toBeDefined();

    const dt = DateTime.fromString('2024-01-15');
    expect(dt.year).toBe(2024);
    expect(dt.month).toBe(1);
    expect(dt.day).toBe(15);
  });

  test('StringUtils namespace export', () => {
    const { StringUtils } = require('../src');

    expect(StringUtils.toCamelCase('hello_world')).toBe('helloWorld');
    expect(StringUtils.toSnakeCase('helloWorld')).toBe('hello_world');
    expect(StringUtils.isNullOrEmpty(null)).toBe(true);
    expect(StringUtils.isNullOrEmpty('hello')).toBe(false);
    expect(StringUtils.escapeHtml('<div>')).toBe('&lt;div&gt;');
  });

  test('Logger export', () => {
    const { Logger, createLogger, LogLevel } = require('../src');

    expect(Logger).toBeDefined();
    expect(typeof createLogger).toBe('function');
    expect(LogLevel.INFO).toBe('info');
  });
});
