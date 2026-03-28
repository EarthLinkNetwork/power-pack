import {
  ok,
  err,
  isOk,
  isErr,
  mapResult,
  mapErr,
  unwrap,
  unwrapOr,
  tryCatch,
  tryCatchAsync,
  Result,
} from '../src/result';

describe('Result', () => {
  describe('ok()', () => {
    it('creates an Ok type with the given value', () => {
      const result = ok(42);
      expect(result).toEqual({ ok: true, value: 42 });
    });

    it('creates an Ok type with a string value', () => {
      const result = ok('hello');
      expect(result).toEqual({ ok: true, value: 'hello' });
    });

    it('creates an Ok type with a complex object', () => {
      const obj = { name: 'test', nested: { a: 1 } };
      const result = ok(obj);
      expect(result).toEqual({ ok: true, value: obj });
    });
  });

  describe('err()', () => {
    it('creates an Err type with an Error', () => {
      const error = new Error('something went wrong');
      const result = err(error);
      expect(result).toEqual({ ok: false, error });
    });

    it('creates an Err type with a string error', () => {
      const result = err('failure');
      expect(result).toEqual({ ok: false, error: 'failure' });
    });

    it('creates an Err type with a custom error object', () => {
      const customErr = { code: 404, message: 'not found' };
      const result = err(customErr);
      expect(result).toEqual({ ok: false, error: customErr });
    });
  });

  describe('isOk()', () => {
    it('returns true for Ok', () => {
      expect(isOk(ok(1))).toBe(true);
    });

    it('returns false for Err', () => {
      expect(isOk(err('error'))).toBe(false);
    });
  });

  describe('isErr()', () => {
    it('returns true for Err', () => {
      expect(isErr(err('error'))).toBe(true);
    });

    it('returns false for Ok', () => {
      expect(isErr(ok(1))).toBe(false);
    });
  });

  describe('mapResult()', () => {
    it('transforms the value for Ok', () => {
      const result = mapResult(ok(5), (x) => x * 2);
      expect(result).toEqual(ok(10));
    });

    it('transforms Ok value to a different type', () => {
      const result = mapResult(ok(42), (x) => String(x));
      expect(result).toEqual(ok('42'));
    });

    it('passes through Err without calling the function', () => {
      const fn = jest.fn();
      const error = err('error');
      const result = mapResult(error, fn);
      expect(result).toEqual(error);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('mapErr()', () => {
    it('transforms the error for Err', () => {
      const result = mapErr(err('not found'), (e) => `Error: ${e}`);
      expect(result).toEqual(err('Error: not found'));
    });

    it('passes through Ok without calling the function', () => {
      const fn = jest.fn();
      const result = mapErr(ok(42), fn);
      expect(result).toEqual(ok(42));
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('unwrap()', () => {
    it('returns the value for Ok', () => {
      expect(unwrap(ok(42))).toBe(42);
    });

    it('returns complex value for Ok', () => {
      const obj = { a: 1 };
      expect(unwrap(ok(obj))).toBe(obj);
    });

    it('throws the error for Err when error is an Error instance', () => {
      const error = new Error('boom');
      expect(() => unwrap(err(error))).toThrow(error);
    });

    it('throws a wrapped Error for Err when error is not an Error instance', () => {
      expect(() => unwrap(err('string error'))).toThrow('string error');
    });

    it('throws a wrapped Error for Err with a number error', () => {
      expect(() => unwrap(err(404))).toThrow('404');
    });
  });

  describe('unwrapOr()', () => {
    it('returns the value for Ok', () => {
      expect(unwrapOr(ok(42), 0)).toBe(42);
    });

    it('returns the default value for Err', () => {
      expect(unwrapOr(err('error'), 0)).toBe(0);
    });

    it('returns the default value with string type', () => {
      expect(unwrapOr(err('error') as Result<string, string>, 'default')).toBe('default');
    });
  });

  describe('tryCatch()', () => {
    it('returns Ok for a non-throwing function', () => {
      const result = tryCatch(() => 42);
      expect(result).toEqual(ok(42));
    });

    it('returns Ok for a function returning a string', () => {
      const result = tryCatch(() => 'hello');
      expect(result).toEqual(ok('hello'));
    });

    it('returns Err for a function that throws an Error', () => {
      const error = new Error('oops');
      const result = tryCatch(() => {
        throw error;
      });
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe(error);
      }
    });

    it('wraps a thrown string in an Error', () => {
      const result = tryCatch(() => {
        throw 'string error';
      });
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('string error');
      }
    });
  });

  describe('tryCatchAsync()', () => {
    it('returns Ok for a resolving promise', async () => {
      const result = await tryCatchAsync(() => Promise.resolve(42));
      expect(result).toEqual(ok(42));
    });

    it('returns Ok for an async function', async () => {
      const result = await tryCatchAsync(async () => 'async value');
      expect(result).toEqual(ok('async value'));
    });

    it('returns Err for a rejecting promise with Error', async () => {
      const error = new Error('async error');
      const result = await tryCatchAsync(() => Promise.reject(error));
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe(error);
      }
    });

    it('wraps a rejected string in an Error', async () => {
      const result = await tryCatchAsync(() => Promise.reject('string rejection'));
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('string rejection');
      }
    });
  });

  describe('type discrimination', () => {
    it('allows accessing .value on Ok after isOk check', () => {
      const result: Result<number, string> = ok(42);
      if (isOk(result)) {
        const value: number = result.value;
        expect(value).toBe(42);
      } else {
        fail('Expected Ok');
      }
    });

    it('allows accessing .error on Err after isErr check', () => {
      const result: Result<number, string> = err('failure');
      if (isErr(result)) {
        const error: string = result.error;
        expect(error).toBe('failure');
      } else {
        fail('Expected Err');
      }
    });
  });
});
